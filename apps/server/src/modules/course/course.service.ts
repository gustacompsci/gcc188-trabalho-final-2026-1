import { db } from "@extraufla/db";

import { type Course, course, type NewCourse } from "./course.model";

export async function listCourses(): Promise<Course[]> {
	return db.select().from(course);
}

export async function seedCourses(courses: NewCourse[]): Promise<number> {
	if (courses.length === 0) return 0;
	const result = await db
		.insert(course)
		.values(courses)
		.onConflictDoNothing()
		.returning();
	return result.length;
}
