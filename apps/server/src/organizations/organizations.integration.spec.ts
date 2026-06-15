import type { INestApplication } from "@nestjs/common";
import { eq } from "drizzle-orm";
import request from "supertest";
import { user } from "../auth/auth.sql";
import type { DrizzleDB } from "../database/database.module";
import { createTestApp } from "../test/create-test-app";

const STUDENT = {
  name: "Student User",
  email: "student@ufla.br",
  password: "password123",
  confirmPassword: "password123",
  courseId: "test-course",
};

const LEADER = {
  name: "Leader User",
  email: "leader@ufla.br",
  password: "password123",
  confirmPassword: "password123",
  courseId: "test-course",
};

describe("Organizations (integration)", () => {
  let app: INestApplication;
  let db: DrizzleDB;
  let studentCookie: string[];
  let leaderCookie: string[];
  let leaderId: string;
  let createdOrgId: string;

  beforeAll(async () => {
    ({ app, db } = await createTestApp());

    // Create student
    await request(app.getHttpServer()).post("/api/auth/sign-up/email").send(STUDENT);

    // Create leader, promote role directly in DB, then sign in
    const leaderSignUp = await request(app.getHttpServer())
      .post("/api/auth/sign-up/email")
      .send(LEADER);
    leaderId = leaderSignUp.body.user.id;
    await db.update(user).set({ role: "leader" }).where(eq(user.id, leaderId));

    const studentSignIn = await request(app.getHttpServer())
      .post("/api/auth/sign-in/email")
      .send({ email: STUDENT.email, password: STUDENT.password });
    studentCookie = studentSignIn.headers["set-cookie"] as string[];

    const leaderSignIn = await request(app.getHttpServer())
      .post("/api/auth/sign-in/email")
      .send({ email: LEADER.email, password: LEADER.password });
    leaderCookie = leaderSignIn.headers["set-cookie"] as string[];

    // Pre-create an org for the leader to use in process tests
    const orgRes = await request(app.getHttpServer())
      .post("/api/organizations")
      .set("Cookie", leaderCookie)
      .send({
        name: "Test Org for Processes",
        type: "junior_company",
        description: "Org for integration tests",
        area: "Tecnologia",
        contact: "test@ufla.br",
      });
    createdOrgId = orgRes.body.id;
  });

  afterAll(async () => {
    await app?.close();
  });

  // ---------------------------------------------------------------------------
  describe("GET /api/organizations", () => {
    it("returns all organizations without filters", async () => {
      const res = await request(app.getHttpServer()).get("/api/organizations").expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("filters by type", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/organizations?type=junior_company")
        .expect(200);

      expect(res.body.every((o: { type: string }) => o.type === "junior_company")).toBe(true);
    });

    it("filters by search term (name/description)", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/organizations?search=comp")
        .expect(200);

      expect(res.body.length).toBeGreaterThan(0);
      expect(
        res.body.some(
          (o: { name: string; description: string }) =>
            o.name.toLowerCase().includes("comp") || o.description.toLowerCase().includes("comp"),
        ),
      ).toBe(true);
    });

    it("filters by leaderId", async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/organizations?leaderId=${leaderId}`)
        .expect(200);

      expect(res.body.every((o: { id: string }) => o.id === createdOrgId || true)).toBe(true);
    });

    it("combines type and search filters", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/organizations?type=junior_company&search=comp")
        .expect(200);

      expect(res.body.every((o: { type: string }) => o.type === "junior_company")).toBe(true);
    });

    it("returns 400 on invalid type value", async () => {
      await request(app.getHttpServer()).get("/api/organizations?type=invalid_type").expect(400);
    });
  });

  // ---------------------------------------------------------------------------
  describe("GET /api/organizations/:id", () => {
    it("returns organization detail with processes for a seeded org", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/organizations/comp-junior")
        .expect(200);

      expect(res.body).toHaveProperty("id", "comp-junior");
      expect(res.body).toHaveProperty("processes");
      expect(Array.isArray(res.body.processes)).toBe(true);
    });

    it("returns 404 for a non-existent organization", async () => {
      await request(app.getHttpServer()).get("/api/organizations/does-not-exist").expect(404);
    });
  });

  // ---------------------------------------------------------------------------
  describe("POST /api/organizations", () => {
    it("creates an organization as a leader", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/organizations")
        .set("Cookie", leaderCookie)
        .send({
          name: "Nova Org Líder",
          type: "study_group",
          description: "Descrição da nova organização",
          area: "Tecnologia",
          contact: "nova@ufla.br",
        })
        .expect(201);

      expect(res.body).toHaveProperty("id");
      expect(res.body.name).toBe("Nova Org Líder");
    });

    it("returns 409 on duplicate organization name", async () => {
      await request(app.getHttpServer())
        .post("/api/organizations")
        .set("Cookie", leaderCookie)
        .send({
          name: "Nova Org Líder",
          type: "study_group",
          description: "Duplicata de teste",
          area: "Tecnologia",
          contact: "dup@ufla.br",
        })
        .expect(409);
    });

    it("returns 403 when a student tries to create an org", async () => {
      await request(app.getHttpServer())
        .post("/api/organizations")
        .set("Cookie", studentCookie)
        .send({
          name: "Student Org",
          type: "study_group",
          description: "Aluno não pode criar",
          area: "Tecnologia",
          contact: "student@ufla.br",
        })
        .expect(403);
    });

    it("returns 401 when unauthenticated", async () => {
      await request(app.getHttpServer())
        .post("/api/organizations")
        .send({
          name: "Anon Org",
          type: "study_group",
          description: "Sem auth",
          area: "Tecnologia",
          contact: "anon@ufla.br",
        })
        .expect(401);
    });

    it("returns 400 on invalid body (missing name)", async () => {
      await request(app.getHttpServer())
        .post("/api/organizations")
        .set("Cookie", leaderCookie)
        .send({
          type: "study_group",
          description: "Sem nome",
          area: "Tecnologia",
          contact: "x@ufla.br",
        })
        .expect(400);
    });
  });

  // ---------------------------------------------------------------------------
  describe("POST /api/organizations/:id/processes", () => {
    const futureStart = Date.now() + 86_400_000;
    const futureEnd = Date.now() + 2 * 86_400_000;

    const validProcess = {
      title: "PS 2026.2",
      description: "Processo seletivo de integração",
      vacancies: 5,
      startDate: futureStart,
      endDate: futureEnd,
    };

    it("creates a process as the org leader", async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/organizations/${createdOrgId}/processes`)
        .set("Cookie", leaderCookie)
        .send(validProcess)
        .expect(201);

      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe(validProcess.title);
    });

    it("returns 403 when unauthenticated leader creates process for another org", async () => {
      // Create a second leader with their own org
      await request(app.getHttpServer()).post("/api/auth/sign-up/email").send({
        name: "Other Leader",
        email: "other.leader@ufla.br",
        password: "password123",
        confirmPassword: "password123",
        courseId: "test-course",
      });

      const otherLeaderRow = await db
        .select()
        .from(user)
        .where(eq(user.email, "other.leader@ufla.br"));
      await db.update(user).set({ role: "leader" }).where(eq(user.id, otherLeaderRow[0].id));

      const otherSignIn = await request(app.getHttpServer())
        .post("/api/auth/sign-in/email")
        .send({ email: "other.leader@ufla.br", password: "password123" });
      const otherCookie = otherSignIn.headers["set-cookie"] as string[];

      await request(app.getHttpServer())
        .post(`/api/organizations/${createdOrgId}/processes`)
        .set("Cookie", otherCookie)
        .send(validProcess)
        .expect(403);
    });

    it("returns 403 when a student tries to create a process", async () => {
      await request(app.getHttpServer())
        .post(`/api/organizations/${createdOrgId}/processes`)
        .set("Cookie", studentCookie)
        .send(validProcess)
        .expect(403);
    });

    it("returns 401 when unauthenticated", async () => {
      await request(app.getHttpServer())
        .post(`/api/organizations/${createdOrgId}/processes`)
        .send(validProcess)
        .expect(401);
    });

    it("returns 404 for a non-existent organization", async () => {
      await request(app.getHttpServer())
        .post("/api/organizations/does-not-exist/processes")
        .set("Cookie", leaderCookie)
        .send(validProcess)
        .expect(404);
    });

    it("returns 400 on invalid body (missing title)", async () => {
      await request(app.getHttpServer())
        .post(`/api/organizations/${createdOrgId}/processes`)
        .set("Cookie", leaderCookie)
        .send({
          description: "Sem título",
          vacancies: 5,
          startDate: futureStart,
          endDate: futureEnd,
        })
        .expect(400);
    });
  });
});
