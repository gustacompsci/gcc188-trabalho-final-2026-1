import { z } from "zod";

export const organizationTypeSchema = z.enum([
  "junior_company",
  "extension_project",
  "study_group",
]);
export type OrganizationType = z.infer<typeof organizationTypeSchema>;

export const organizationTypeLabels: Record<OrganizationType, string> = {
  junior_company: "Empresa Júnior",
  extension_project: "Projeto de Extensão",
  study_group: "Núcleo de Estudo",
};

export const selectiveProcessStatusSchema = z.enum(["open", "closed", "scheduled"]);
export type SelectiveProcessStatus = z.infer<typeof selectiveProcessStatusSchema>;

export const selectiveProcessSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  title: z.string(),
  description: z.string(),
  vacancies: z.number().int().positive(),
  startDate: z.number(),
  endDate: z.number(),
  status: selectiveProcessStatusSchema,
  createdAt: z.number(),
  updatedAt: z.number(),
});
export type SelectiveProcess = z.infer<typeof selectiveProcessSchema>;

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: organizationTypeSchema,
  description: z.string(),
  area: z.string(),
  contact: z.string(),
  socialLinks: z.string().nullable(),
  logoUrl: z.string().nullable(),
  leaderId: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});
export type Organization = z.infer<typeof organizationSchema>;

export const organizationListItemSchema = organizationSchema
  .pick({ id: true, name: true, type: true, description: true, area: true, logoUrl: true })
  .extend({ hasOpenProcess: z.boolean() });
export type OrganizationListItem = z.infer<typeof organizationListItemSchema>;

export const organizationDetailSchema = organizationSchema.extend({
  hasOpenProcess: z.boolean(),
  processes: z.array(selectiveProcessSchema),
});
export type OrganizationDetail = z.infer<typeof organizationDetailSchema>;

export const listOrganizationsQuerySchema = z.object({
  type: organizationTypeSchema.optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});
export type ListOrganizationsQuery = z.infer<typeof listOrganizationsQuerySchema>;

export const patchUserSchema = z.object({
  courseId: z.string().optional(),
  name: z.string().min(2).optional(),
});
export type PatchUserDto = z.infer<typeof patchUserSchema>;
