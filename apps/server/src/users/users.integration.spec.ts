import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { createTestApp } from "../test/create-test-app";

const USER = {
  name: "Users Test",
  email: "userstest@ufla.br",
  password: "password123",
  confirmPassword: "password123",
  courseId: "test-course",
};

describe("Users (integration)", () => {
  let app: INestApplication;
  let sessionCookie: string[];

  beforeAll(async () => {
    ({ app } = await createTestApp());

    await request(app.getHttpServer()).post("/api/auth/sign-up/email").send(USER);

    const signIn = await request(app.getHttpServer())
      .post("/api/auth/sign-in/email")
      .send({ email: USER.email, password: USER.password });
    sessionCookie = signIn.headers["set-cookie"] as string[];
  });

  afterAll(async () => {
    await app?.close();
  });

  describe("PATCH /api/users/me", () => {
    it("updates the user name", async () => {
      const res = await request(app.getHttpServer())
        .patch("/api/users/me")
        .set("Cookie", sessionCookie)
        .send({ name: "Updated Name" })
        .expect(200);

      expect(res.body.name).toBe("Updated Name");
    });

    it("accepts a partial body (only courseId)", async () => {
      const res = await request(app.getHttpServer())
        .patch("/api/users/me")
        .set("Cookie", sessionCookie)
        .send({ courseId: "administracao" })
        .expect(200);

      expect(res.body.courseId).toBe("administracao");
    });

    it("returns 401 when unauthenticated", async () => {
      await request(app.getHttpServer())
        .patch("/api/users/me")
        .send({ name: "Anonymous" })
        .expect(401);
    });
  });
});
