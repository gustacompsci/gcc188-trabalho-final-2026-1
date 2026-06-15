import type { SelectiveProcessStatus } from "@extraufla/shared";
import { organizationTypeLabels } from "@extraufla/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";

import { sessionQuery } from "@/lib/auth.queries";
import { organizationDetailQuery } from "@/lib/organizations.queries";

function OrganizationError({ error }: { error: unknown }) {
  const message =
    error instanceof Error && error.message.includes("404")
      ? "Organização não encontrada."
      : "Erro ao carregar organização. Tente novamente.";
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <p className="text-destructive text-sm">{message}</p>
    </div>
  );
}

export const Route = createFileRoute("/app/organizations/$organizationId")({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(organizationDetailQuery(params.organizationId)),
  errorComponent: ({ error }) => <OrganizationError error={error} />,
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
  const router = useRouter();
  const { data: session } = useQuery(sessionQuery());
  const socialLinks = parseSocialLinks(org.socialLinks);
  const isLeader =
    session && ["leader", "admin"].includes(session.user.role) && org.leaderId === session.user.id;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <button
        type="button"
        onClick={() => router.history.back()}
        className="mb-6 inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
      >
        ← Voltar
      </button>

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
            {Object.entries(socialLinks).map(([key, url]) => {
              const safeUrl = (() => {
                try {
                  const p = new URL(url);
                  return ["http:", "https:"].includes(p.protocol) ? p.toString() : null;
                } catch {
                  return null;
                }
              })();
              return (
                <li key={key}>
                  {safeUrl ? (
                    <a
                      href={safeUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-primary text-sm hover:underline"
                    >
                      {key}
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-sm">{key}</span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : org.socialLinks ? (
          <p className="text-muted-foreground text-sm">{org.socialLinks}</p>
        ) : null}
      </div>

      {org.processes.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-lg">Processos Seletivos</h2>
            {isLeader && (
              <Link
                to="/app/organizations/$organizationId/new-process"
                params={{ organizationId: org.id }}
                className="rounded-md bg-primary px-3 py-1 text-primary-foreground text-xs hover:bg-primary/90"
              >
                + Novo processo
              </Link>
            )}
          </div>
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
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">Nenhum processo seletivo disponível.</p>
          {isLeader && (
            <Link
              to="/app/organizations/$organizationId/new-process"
              params={{ organizationId: org.id }}
              className="rounded-md bg-primary px-3 py-1 text-primary-foreground text-xs hover:bg-primary/90"
            >
              + Novo processo
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
