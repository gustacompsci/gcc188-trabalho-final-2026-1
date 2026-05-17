import { course } from "@extraufla/db/schema";

export { course };

export type Course = typeof course.$inferSelect;
export type NewCourse = typeof course.$inferInsert;
