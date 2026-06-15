import type { OrganizationType } from "@extraufla/shared";
import { organizationTypeLabels, organizationTypeSchema } from "@extraufla/shared";
import { Button } from "@extraufla/ui/components/button";
import { Input } from "@extraufla/ui/components/input";
import { Skeleton } from "@extraufla/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { organizationsQuery } from "@/lib/organizations.queries";

const searchSchema = z.object({
  type: organizationTypeSchema.optional(),
  search: z.string().optional(),
});

export const Route = createFileRoute("/organizations/")({
  validateSearch: searchSchema,
  component: OrganizationsPage,
});

const TYPE_FILTERS: { label: string; value: OrganizationType | undefined }[] = [
  { label: "Todos", value: undefined },
  { label: "Empresa Júnior", value: "junior_company" },
  { label: "Projeto de Extensão", value: "extension_project" },
  { label: "Núcleo de Estudo", value: "study_group" },
];

function OrganizationsPage() {
  const navigate = useNavigate({ from: "/organizations/" });
  const { type, search } = Route.useSearch();
  const [searchInput, setSearchInput] = useState(search ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({ search: (prev) => ({ ...prev, search: searchInput || undefined }) });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, navigate]);

  const { data: organizations, isPending } = useQuery(organizationsQuery({ type, search }));

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 font-bold text-2xl">Organizações</h1>

      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <Button
              key={f.label}
              variant={type === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => navigate({ search: (prev) => ({ ...prev, type: f.value }) })}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <Input
          placeholder="Buscar organizações..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isPending && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map((key) => (
            <Skeleton key={key} className="h-48" />
          ))}
        </div>
      )}

      {!isPending && organizations?.length === 0 && (
        <p className="text-muted-foreground">Nenhuma organização encontrada.</p>
      )}

      {!isPending && organizations && organizations.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <Link
              key={org.id}
              to="/organizations/$organizationId"
              params={{ organizationId: org.id }}
              className="flex flex-col gap-2 rounded-2xl border p-4 ring-1 ring-foreground/5 transition-colors hover:bg-muted/50 dark:ring-foreground/10"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium leading-tight">{org.name}</span>
                {org.hasOpenProcess && (
                  <span className="shrink-0 rounded-full bg-green-500/15 px-2 py-0.5 text-green-700 text-xs dark:text-green-400">
                    Inscrições Abertas
                  </span>
                )}
              </div>
              <span className="w-fit rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs">
                {organizationTypeLabels[org.type]}
              </span>
              {org.area && <span className="text-muted-foreground text-xs">{org.area}</span>}
              <p className="line-clamp-3 text-muted-foreground text-sm">{org.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
