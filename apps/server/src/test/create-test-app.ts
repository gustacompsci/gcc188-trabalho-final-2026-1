import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as path from "path";
import { fileURLToPath } from "url";
import { AppModule } from "../app.module";
import { course } from "../courses/courses.sql";
import { DATABASE, type DrizzleDB } from "../database/database.module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createTestApp(): Promise<{
  app: INestApplication;
  db: DrizzleDB;
}> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const db = moduleRef.get<DrizzleDB>(DATABASE);
  await migrate(db, { migrationsFolder: path.join(__dirname, "../../migrations") });

  const app = moduleRef.createNestApplication();
  await app.init();

  // Seed a stable test course so FK constraints pass in all test fixtures
  await db.insert(course).values({ id: "test-course", name: "Test Course" }).onConflictDoNothing();

  return { app, db };
}
