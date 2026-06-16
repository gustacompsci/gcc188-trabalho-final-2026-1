import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { createTestApp } from "../test/create-test-app";

const VALID_USER = {
  name: "Auth Test User",
  email: "authtest@ufla.br",
  password: "password123",
  confirmPassword: "password123",
  courseId: "test-course",
};

describe("Auth (integration)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    ({ app } = await createTestApp());
    // Register the user used in sign-in / session tests
    await request(app.getHttpServer()).post("/api/auth/sign-up/email").send(VALID_USER);
  });

  afterAll(async () => {
    await app?.close();
  });

  // ---------------------------------------------------------------------------
  describe("POST /api/auth/sign-up/email", () => {
    it("registers a user with @ufla.br email", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/auth/sign-up/email")
        .send({
          name: "New User",
          email: "newuser@ufla.br",
          password: "password123",
          confirmPassword: "password123",
          courseId: "test-course",
        })
        .expect(201);

      expect(res.body).toHaveProperty("user");
      expect(res.body.user.email).toBe("newuser@ufla.br");
    });

    it("registers a user with @estudante.ufla.br email", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/auth/sign-up/email")
        .send({
          name: "Estudante User",
          email: "estudante@estudante.ufla.br",
          password: "password123",
          confirmPassword: "password123",
          courseId: "test-course",
        })
        .expect(201);

      expect(res.body.user.email).toBe("estudante@estudante.ufla.br");
    });

    it("rejects email outside the ufla.br domain", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/sign-up/email")
        .send({ ...VALID_USER, email: "user@gmail.com" })
        .expect(400);
    });

    it("rejects short name", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/sign-up/email")
        .send({ ...VALID_USER, email: "shortname@ufla.br", name: "A" })
        .expect(400);
    });

    it("rejects password shorter than 8 characters", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/sign-up/email")
        .send({ ...VALID_USER, email: "shortpwd@ufla.br", password: "123", confirmPassword: "123" })
        .expect(400);
    });

    it("rejects mismatched confirmPassword", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/sign-up/email")
        .send({ ...VALID_USER, email: "mismatch@ufla.br", confirmPassword: "different" })
        .expect(400);
    });

    it("rejects duplicate email", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/auth/sign-up/email")
        .send(VALID_USER);

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  // ---------------------------------------------------------------------------
  describe("POST /api/auth/sign-in/email", () => {
    it("signs in with correct credentials and returns a session cookie", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/auth/sign-in/email")
        .send({ email: VALID_USER.email, password: VALID_USER.password })
        .expect(200);

      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("rejects wrong password", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/auth/sign-in/email")
        .send({ email: VALID_USER.email, password: "wrongpassword" });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it("rejects non-existent user", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/auth/sign-in/email")
        .send({ email: "nobody@ufla.br", password: "password123" });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it("rejects non-ufla email (Zod validation)", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/sign-in/email")
        .send({ email: "user@gmail.com", password: "password123" })
        .expect(400);
    });
  });

  // ---------------------------------------------------------------------------
  describe("GET /api/auth/get-session", () => {
    it("returns null without a session cookie", async () => {
      const res = await request(app.getHttpServer()).get("/api/auth/get-session").expect(200);

      expect(res.body).toBeNull();
    });

    it("returns session data with a valid cookie", async () => {
      const signIn = await request(app.getHttpServer())
        .post("/api/auth/sign-in/email")
        .send({ email: VALID_USER.email, password: VALID_USER.password });

      const cookie = signIn.headers["set-cookie"] as string[];

      const res = await request(app.getHttpServer())
        .get("/api/auth/get-session")
        .set("Cookie", cookie)
        .expect(200);

      expect(res.body).toHaveProperty("user");
      expect(res.body.user.email).toBe(VALID_USER.email);
    });
  });

  // ---------------------------------------------------------------------------
  describe("POST /api/auth/sign-out", () => {
    it("signs out and returns success", async () => {
      const signIn = await request(app.getHttpServer())
        .post("/api/auth/sign-in/email")
        .send({ email: VALID_USER.email, password: VALID_USER.password });

      const cookie = signIn.headers["set-cookie"] as string[];

      const res = await request(app.getHttpServer())
        .post("/api/auth/sign-out")
        .set("Cookie", cookie)
        .expect(200);

      expect(res.body).toEqual({ success: true });
    });
  });

  // ---------------------------------------------------------------------------
  describe("POST /api/auth/forget-password", () => {
    it("accepts a valid ufla.br email (Resend mocked)", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/auth/forget-password")
        .send({ email: VALID_USER.email })
        .expect(200);

      expect(res.body).toEqual({ success: true });
    });

    it("rejects non-ufla email", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/forget-password")
        .send({ email: "user@gmail.com" })
        .expect(400);
    });

    it("rejects empty body", async () => {
      await request(app.getHttpServer()).post("/api/auth/forget-password").send({}).expect(400);
    });
  });

  // ---------------------------------------------------------------------------
  describe("POST /api/auth/reset-password", () => {
    it("rejects an invalid token", async () => {
      const res = await request(app.getHttpServer()).post("/api/auth/reset-password").send({
        token: "invalid-token",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it("rejects mismatched passwords (Zod)", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/reset-password")
        .send({ token: "token", newPassword: "password123", confirmPassword: "different" })
        .expect(400);
    });

    it("rejects missing token (Zod)", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/reset-password")
        .send({ newPassword: "password123", confirmPassword: "password123" })
        .expect(400);
    });
  });
});
