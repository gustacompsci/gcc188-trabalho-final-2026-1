import type { SelectiveProcessStatus } from "@extraufla/shared";
import { organizationTypeLabels } from "@extraufla/shared";
import { createFileRoute, Link } from "@tanstack/react-router";

import { organizationDetailQuery } from "@/lib/organizations.queries";

export const Route = createFileRoute("/organizations/$organizationId")({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(organizationDetailQuery(params.organizationId)),
  component: OrganizationDetailPage,
});

const statusLabels: Record<SelectiveProcessStatus, string> = {
  open: "Aberto",
  closed: "Encerrado",
  scheduled: "Agendado",
};

const statusClasses: Record<SelectiveProcessStatus, string> = {
  open: "bg-green-500/15 text-green-700 dark:text-green-400",
  closed: "bg-muted text-muted-foreground",
  scheduled: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
};

function parseSocialLinks(raw: string | null): Record<string, string> | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return null;
  }
}

function OrganizationDetailPage() {
  const org = Route.useLoaderData();
  const socialLinks = parseSocialLinks(org.socialLinks);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Link
        to="/organizations"
        className="mb-6 inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
      >
        ← Voltar para organizações
      </Link>

      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="font-bold text-2xl">{org.name}</h1>
          <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs">
            {organizationTypeLabels[org.type]}
          </span>
        </div>
        {org.area && <p className="text-muted-foreground text-sm">{org.area}</p>}
        <p className="text-sm">{org.description}</p>
      </div>

      <div className="mb-6 flex flex-col gap-2 rounded-2xl border p-4 ring-1 ring-foreground/5 dark:ring-foreground/10">
        <h2 className="font-medium">Contato</h2>
        <p className="text-muted-foreground text-sm">{org.contact}</p>
        {socialLinks ? (
          <ul className="flex flex-wrap gap-3">
            {Object.entries(socialLinks).map(([key, url]) => (
              <li key={key}>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary text-sm hover:underline"
                >
                  {key}
                </a>
              </li>
            ))}
          </ul>
        ) : org.socialLinks ? (
          <p className="text-muted-foreground text-sm">{org.socialLinks}</p>
        ) : null}
      </div>

      {org.processes.length > 0 && (
        <section>
          <h2 className="mb-4 font-semibold text-lg">Processos Seletivos</h2>
          <div className="flex flex-col gap-3">
            {org.processes.map((process) => (
              <div
                key={process.id}
                className="flex flex-col gap-2 rounded-2xl border p-4 ring-1 ring-foreground/5 dark:ring-foreground/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium">{process.title}</span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${statusClasses[process.status]}`}
                  >
                    {statusLabels[process.status]}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">{process.description}</p>
                <div className="flex flex-wrap gap-4 text-muted-foreground text-xs">
                  <span>Vagas: {process.vacancies}</span>
                  <span>Início: {new Date(process.startDate).toLocaleDateString("pt-BR")}</span>
                  <span>Fim: {new Date(process.endDate).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {org.processes.length === 0 && (
        <p className="text-muted-foreground text-sm">Nenhum processo seletivo disponível.</p>
      )}
    </div>
  );
}
