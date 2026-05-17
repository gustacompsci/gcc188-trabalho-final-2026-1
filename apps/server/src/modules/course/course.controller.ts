import { type Router as ExpressRouter, Router } from "express";

import { listCourses } from "./course.service";

export const courseController: ExpressRouter = Router();

courseController.get("/", async (_req, res) => {
	const courses = await listCourses();
	res.json(courses);
});
