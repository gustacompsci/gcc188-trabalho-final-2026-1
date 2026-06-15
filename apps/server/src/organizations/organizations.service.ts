import type {
  ListOrganizationsQuery,
  OrganizationDetail,
  OrganizationListItem,
  SelectiveProcessStatus,
} from "@extraufla/shared";
import { Inject, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import type { SQL } from "drizzle-orm";
import { and, eq, like, or } from "drizzle-orm";
import { DATABASE, type DrizzleDB } from "../database/database.module";
import { organization, selectiveProcess, user } from "../database/schema";

function deriveStatus(startDate: Date, endDate: Date): SelectiveProcessStatus {
  const now = Date.now();
  const start = startDate.getTime();
  const end = endDate.getTime();
  if (now < start) return "scheduled";
  if (now > end) return "closed";
  return "open";
}

@Injectable()
export class OrganizationsService implements OnModuleInit {
  constructor(@Inject(DATABASE) private readonly db: DrizzleDB) {}

  async onModuleInit() {
    await this.seedOrganizations();
  }

  async listOrganizations({
    type,
    search,
    limit,
    offset,
  }: ListOrganizationsQuery): Promise<OrganizationListItem[]> {
    const conditions: SQL[] = [];

    if (type) {
      conditions.push(eq(organization.type, type));
    }

    if (search) {
      const searchCondition = or(
        like(organization.name, `%${search}%`),
        like(organization.description, `%${search}%`),
      );
      if (searchCondition) conditions.push(searchCondition);
    }

    const orgs = await this.db
      .select()
      .from(organization)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset);

    const now = Date.now();

    const results: OrganizationListItem[] = await Promise.all(
      orgs.map(async (org) => {
        const processes = await this.db
          .select()
          .from(selectiveProcess)
          .where(eq(selectiveProcess.organizationId, org.id));

        const hasOpenProcess = processes.some(
          (p) => p.startDate.getTime() <= now && now <= p.endDate.getTime(),
        );

        return {
          id: org.id,
          name: org.name,
          type: org.type,
          description: org.description,
          area: org.area,
          logoUrl: org.logoUrl,
          hasOpenProcess,
        };
      }),
    );

    return results;
  }

  async getOrganization(id: string): Promise<OrganizationDetail> {
    const [org] = await this.db.select().from(organization).where(eq(organization.id, id));

    if (!org) throw new NotFoundException(`Organization ${id} not found`);

    const processes = await this.db
      .select()
      .from(selectiveProcess)
      .where(eq(selectiveProcess.organizationId, id));

    const processesWithStatus = processes.map((p) => ({
      id: p.id,
      organizationId: p.organizationId,
      title: p.title,
      description: p.description,
      vacancies: p.vacancies,
      startDate: p.startDate.getTime(),
      endDate: p.endDate.getTime(),
      status: deriveStatus(p.startDate, p.endDate),
      createdAt: p.createdAt.getTime(),
      updatedAt: p.updatedAt.getTime(),
    }));

    const hasOpenProcess = processesWithStatus.some((p) => p.status === "open");

    return {
      id: org.id,
      name: org.name,
      type: org.type,
      description: org.description,
      area: org.area,
      contact: org.contact,
      socialLinks: org.socialLinks,
      logoUrl: org.logoUrl,
      leaderId: org.leaderId,
      createdAt: org.createdAt.getTime(),
      updatedAt: org.updatedAt.getTime(),
      hasOpenProcess,
      processes: processesWithStatus,
    };
  }

  async seedOrganizations() {
    try {
      // Ensure a system user exists to use as leaderId
      await this.db
        .insert(user)
        .values({
          id: "system",
          name: "Sistema",
          email: "system@extraufla.internal",
          emailVerified: true,
        })
        .onConflictDoNothing();

      const orgs = [
        {
          id: "representacao-jr",
          name: "RepresentAção Jr",
          type: "junior_company" as const,
          description:
            "Empresa júnior de representação e consultoria da UFLA, focada em soluções de gestão e comunicação.",
          area: "Gestão e Comunicação",
          contact: "representacao@ufla.br",
          leaderId: "system",
        },
        {
          id: "projeto-verde-campus",
          name: "Projeto Verde Campus",
          type: "extension_project" as const,
          description:
            "Projeto de extensão voltado à sustentabilidade e meio ambiente no campus da UFLA.",
          area: "Meio Ambiente",
          contact: "verde@ufla.br",
          leaderId: "system",
        },
        {
          id: "nucleo-de-ia",
          name: "Núcleo de IA",
          type: "study_group" as const,
          description:
            "Grupo de estudos dedicado à inteligência artificial, aprendizado de máquina e ciência de dados.",
          area: "Tecnologia",
          contact: "ia@ufla.br",
          leaderId: "system",
        },
        {
          id: "biotech-jr",
          name: "BioTech Jr",
          type: "junior_company" as const,
          description:
            "Empresa júnior de biotecnologia da UFLA, prestando consultoria e serviços na área biológica.",
          area: "Biotecnologia",
          contact: "biotech@ufla.br",
          leaderId: "system",
        },
        {
          id: "extensao-cultural-ufla",
          name: "Extensão Cultural UFLA",
          type: "extension_project" as const,
          description:
            "Projeto de extensão cultural que promove arte, música e cultura na comunidade universitária.",
          area: "Cultura e Arte",
          contact: "cultural@ufla.br",
          leaderId: "system",
        },
      ];

      for (const org of orgs) {
        await this.db.insert(organization).values(org).onConflictDoNothing();
      }

      const processes = [
        {
          id: "representacao-jr-ps-2026",
          organizationId: "representacao-jr",
          title: "Processo Seletivo 2026.1 — RepresentAção Jr",
          description: "Seleção de novos membros para as áreas de consultoria e marketing.",
          vacancies: 5,
          startDate: new Date("2026-06-01"),
          endDate: new Date("2026-06-30"),
        },
        {
          id: "nucleo-ia-ps-2026",
          organizationId: "nucleo-de-ia",
          title: "Seleção de Membros — Núcleo de IA",
          description: "Vagas para estudantes interessados em IA, ML e análise de dados.",
          vacancies: 8,
          startDate: new Date("2026-07-01"),
          endDate: new Date("2026-07-31"),
        },
        {
          id: "biotech-jr-ps-2026",
          organizationId: "biotech-jr",
          title: "Processo Seletivo BioTech Jr 2026",
          description: "Seleção de trainees para a empresa júnior de biotecnologia.",
          vacancies: 4,
          startDate: new Date("2026-04-01"),
          endDate: new Date("2026-04-30"),
        },
        {
          id: "verde-campus-ps-2026",
          organizationId: "projeto-verde-campus",
          title: "Voluntários Projeto Verde Campus",
          description: "Recrutamento de voluntários para iniciativas de sustentabilidade.",
          vacancies: 10,
          startDate: new Date("2026-06-10"),
          endDate: new Date("2026-07-10"),
        },
        {
          id: "extensao-cultural-ps-2026",
          organizationId: "extensao-cultural-ufla",
          title: "Seleção Extensão Cultural 2026.2",
          description: "Vagas para monitores e organizadores de eventos culturais.",
          vacancies: 6,
          startDate: new Date("2026-08-01"),
          endDate: new Date("2026-08-31"),
        },
      ];

      for (const p of processes) {
        await this.db.insert(selectiveProcess).values(p).onConflictDoNothing();
      }
    } catch {
      // Silently skip seed errors (e.g. schema not yet migrated in test env)
    }
  }
}
