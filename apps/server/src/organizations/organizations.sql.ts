import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "../auth/auth.sql";
import { selectiveProcess } from "./selective_process.sql";

export const organization = sqliteTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  type: text("type", {
    enum: ["junior_company", "extension_project", "study_group"],
  }).notNull(),
  description: text("description").notNull(),
  area: text("area").notNull(),
  contact: text("contact").notNull(),
  socialLinks: text("social_links"),
  logoUrl: text("logo_url"),
  leaderId: text("leader_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});

export const organizationRelations = relations(organization, ({ one, many }) => ({
  leader: one(user, {
    fields: [organization.leaderId],
    references: [user.id],
  }),
  processes: many(selectiveProcess),
}));
