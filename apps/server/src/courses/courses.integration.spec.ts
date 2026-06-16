import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { createTestApp } from "../test/create-test-app";

describe("Courses (integration)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    ({ app } = await createTestApp());
  });

  afterAll(async () => {
    await app?.close();
  });

  describe("GET /api/courses", () => {
    it("returns a non-empty array of courses", async () => {
      const res = await request(app.getHttpServer()).get("/api/courses").expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("returns courses with id and name fields", async () => {
      const res = await request(app.getHttpServer()).get("/api/courses").expect(200);

      const course = res.body[0];
      expect(course).toHaveProperty("id");
      expect(course).toHaveProperty("name");
    });
  });
});
