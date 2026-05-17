import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { auth } from "@extraufla/auth";
import { env } from "@extraufla/env/server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";

import { courseController } from "./modules/course/course.controller";
import type { NewCourse } from "./modules/course/course.model";
import { seedCourses } from "./modules/course/course.service";

async function runStartupSeed() {
	const dataPath = join(
		dirname(fileURLToPath(import.meta.url)),
		"..",
		"data",
		"courses.json",
	);
	if (!existsSync(dataPath)) {
		console.log("No courses.json found, skipping seed");
		return;
	}
	const courses: NewCourse[] = JSON.parse(readFileSync(dataPath, "utf-8"));
	const inserted = await seedCourses(courses);
	console.log(`Seeded ${inserted} courses`);
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

app.use("/courses", courseController);

await runStartupSeed();

app.listen(3000, () => {
	console.log("Server is running on http://localhost:3000");
});
