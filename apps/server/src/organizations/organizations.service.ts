import type {
  CreateOrganizationDto,
  CreateSelectiveProcessDto,
  ListOrganizationsQuery,
  OrganizationDetail,
  OrganizationListItem,
} from "@extraufla/shared";
import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import type { SQL } from "drizzle-orm";
import { and, eq, like, or } from "drizzle-orm";
import { user } from "../auth/auth.sql";
import { deriveStatus, slugify } from "../common/utils";
import { DATABASE, type DrizzleDB } from "../database/database.module";
import { organization } from "./organizations.sql";
import { selectiveProcess } from "./selective_process.sql";

@Injectable()
export class OrganizationsService implements OnModuleInit {
  constructor(@Inject(DATABASE) private readonly db: DrizzleDB) {}

  async onModuleInit() {
    await this.seedOrganizations();
  }

  async listOrganizations({
    type,
    search,
    leaderId,
    limit,
    offset,
  }: ListOrganizationsQuery): Promise<OrganizationListItem[]> {
    const conditions: SQL[] = [];

    if (type) {
      conditions.push(eq(organization.type, type));
    }

    if (leaderId) {
      conditions.push(eq(organization.leaderId, leaderId));
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

  async createOrganization(dto: CreateOrganizationDto, leaderId: string) {
    let id = slugify(dto.name);

    const [existing] = await this.db
      .select({ id: organization.id, name: organization.name })
      .from(organization)
      .where(eq(organization.id, id));

    if (existing) {
      if (existing.name.toLowerCase() === dto.name.toLowerCase())
        throw new ConflictException(`Organização '${dto.name}' já existe`);

      const suffix = Math.random().toString(36).slice(2, 5);
      id = `${id}-${suffix}`;
    }

    const [org] = await this.db
      .insert(organization)
      .values({
        ...dto,
        id,
        socialLinks: dto.socialLinks ?? null,
        logoUrl: dto.logoUrl ?? null,
        leaderId,
      })
      .returning();
    return org;
  }

  async createProcess(organizationId: string, dto: CreateSelectiveProcessDto, userId: string) {
    const [org] = await this.db
      .select()
      .from(organization)
      .where(eq(organization.id, organizationId));
    if (!org) throw new NotFoundException(`Organização ${organizationId} não encontrada`);
    if (org.leaderId !== userId)
      throw new ForbiddenException("Apenas o líder da organização pode criar processos seletivos");

    const [process] = await this.db
      .insert(selectiveProcess)
      .values({
        id: crypto.randomUUID(),
        organizationId,
        title: dto.title,
        description: dto.description,
        vacancies: dto.vacancies,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      })
      .returning();
    return process;
  }

  async seedOrganizations() {
    try {
      await this.db
        .insert(user)
        .values({
          id: "system",
          name: "Sistema ExtraUFLA",
          email: "system@extraufla.internal",
          emailVerified: true,
          role: "admin",
        })
        .onConflictDoUpdate({
          target: user.id,
          set: { role: "admin" },
        });

      const orgs = [
        {
          id: "comp-junior",
          name: "Comp Júnior",
          type: "junior_company" as const,
          description:
            "Empresa júnior de Ciência da Computação da UFLA, oferecendo soluções em tecnologia e inovação para empresas e pessoas.",
          area: "Tecnologia",
          contact: "contato@compjunior.com.br",
          socialLinks: JSON.stringify({ Site: "https://compjunior.com.br/" }),
          leaderId: "system",
        },
        {
          id: "nescau-ufla",
          name: "NESCAU",
          type: "study_group" as const,
          description:
            "Núcleo de Estudos em Segurança Computacional e Auditoria da UFLA, dedicado à pesquisa e prática em segurança da informação, CTF e auditoria de sistemas.",
          area: "Segurança da Informação",
          contact: "nescau@ufla.br",
          leaderId: "system",
        },
        {
          id: "robotica-junior",
          name: "Robótica Júnior",
          type: "junior_company" as const,
          description:
            "Empresa Júnior do curso de Engenharia de Controle e Automação da UFLA, orientada por professores do Departamento de Engenharia e federada à FEJEMG. Missão: fornecer qualidade de vida por meio de soluções em automação.",
          area: "Engenharia e Automação",
          contact: "roboticajr@ufla.br",
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
          id: "comp-junior-ps-2026",
          organizationId: "comp-junior",
          title: "Processo Seletivo 2026.1 — Comp Júnior",
          description:
            "Seleção de novos membros para as áreas de desenvolvimento, design e gestão.",
          vacancies: 6,
          startDate: new Date("2026-06-01"),
          endDate: new Date("2026-06-30"),
        },
        {
          id: "nescau-ps-2026",
          organizationId: "nescau-ufla",
          title: "Seleção de Membros — NESCAU 2026",
          description:
            "Vagas para estudantes interessados em segurança da informação, CTF e auditoria de sistemas.",
          vacancies: 10,
          startDate: new Date("2026-06-10"),
          endDate: new Date("2026-07-10"),
        },
        {
          id: "robotica-jr-ps-2026",
          organizationId: "robotica-junior",
          title: "Processo Seletivo Robótica Júnior 2026.2",
          description: "Seleção de trainees para as áreas de projetos em automação e controle.",
          vacancies: 5,
          startDate: new Date("2026-07-15"),
          endDate: new Date("2026-08-15"),
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
