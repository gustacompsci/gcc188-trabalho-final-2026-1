import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { organization } from "./organization";

export const selectiveProcess = sqliteTable("selective_process", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  vacancies: integer("vacancies").notNull(),
  startDate: integer("start_date", { mode: "timestamp_ms" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});

export const selectiveProcessRelations = relations(selectiveProcess, ({ one }) => ({
  organization: one(organization, {
    fields: [selectiveProcess.organizationId],
    references: [organization.id],
  }),
}));
