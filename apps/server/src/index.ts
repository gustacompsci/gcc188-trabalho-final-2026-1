import { auth } from "@extraufla/auth";
import { db } from "@extraufla/db";
import { course } from "@extraufla/db/schema";
import { env } from "@extraufla/env/server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

async function seedCourses() {
  const dataPath = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "courses.json")
  if (!existsSync(dataPath)) {
    console.log("No courses.json found, skipping seed")
    return
  }

  const courses: { id: string; name: string }[] = JSON.parse(readFileSync(dataPath, "utf-8"))
  const result = await db.insert(course).values(courses).onConflictDoNothing().returning()
  console.log(`Seeded ${result.length} courses`)
}

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

await seedCourses()

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
