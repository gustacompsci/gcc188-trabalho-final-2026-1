import { organizationTypeLabels } from "@extraufla/shared";
import { Button } from "@extraufla/ui/components/button";
import { Input } from "@extraufla/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@extraufla/ui/components/select";
import { Skeleton } from "@extraufla/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { sessionQuery, signOutMutation } from "@/lib/auth.queries";
import { coursesQuery, organizationsQuery, patchUserMutation } from "@/lib/organizations.queries";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function EditNameInline({ currentName }: { currentName: string }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentName);
  const queryClient = useQueryClient();
  const { mutate: patchUser, isPending } = useMutation(patchUserMutation(queryClient));

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="mt-1 text-muted-foreground text-xs hover:text-foreground"
      >
        Editar nome
      </button>
    );
  }

  const hasError = name.length > 0 && name.length < 2;

  return (
    <div className="mt-2 flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-7 w-48 text-sm"
          autoFocus
        />
        <Button
          size="sm"
          disabled={isPending || name.length < 2}
          onClick={() =>
            patchUser(
              { name },
              {
                onSuccess: () => {
                  setEditing(false);
                  toast.success("Nome atualizado!");
                },
                onError: () => toast.error("Erro ao atualizar nome."),
              },
            )
          }
        >
          Salvar
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
          Cancelar
        </Button>
      </div>
      {hasError && <p className="text-destructive text-xs">Nome deve ter ao menos 2 caracteres</p>}
    </div>
  );
}

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session } = useQuery(sessionQuery());
  const { mutate: signOut } = useMutation(signOutMutation(queryClient));
  const { data: organizations, isPending: orgsLoading } = useQuery(organizationsQuery());
  const { data: courses, isPending: coursesLoading } = useQuery(coursesQuery());
  const { mutate: patchUser } = useMutation(patchUserMutation(queryClient));

  const isLeaderOrAdmin = ["leader", "admin"].includes(session?.user.role ?? "");
  const { data: myOrgs, isPending: myOrgsLoading } = useQuery({
    ...organizationsQuery({ leaderId: session?.user.id }),
    enabled: isLeaderOrAdmin && !!session?.user.id,
  });

  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const openOrgs = organizations?.filter((o) => o.hasOpenProcess).slice(0, 3) ?? [];
  const currentCourse = courses?.find((c) => c.id === session?.user.courseId);
  const selectedCourseName = courses?.find((c) => c.id === selectedCourseId)?.name;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl">Painel</h1>
        <Button
          variant="outline"
          onClick={() => signOut(undefined, { onSuccess: () => navigate({ to: "/" }) })}
        >
          Sair
        </Button>
      </div>

      <section className="mb-6 rounded-2xl border p-4 ring-1 ring-foreground/5 dark:ring-foreground/10">
        <h2 className="mb-1 font-medium">
          Bem-vindo(a), {session?.user.name}
          {currentCourse && (
            <span className="ml-2 font-normal text-muted-foreground text-sm">
              ({currentCourse.name})
            </span>
          )}
        </h2>
        <p className="text-muted-foreground text-sm">{session?.user.email}</p>
        <EditNameInline currentName={session?.user.name ?? ""} />
      </section>

      <section className="mb-6 rounded-2xl border p-4 ring-1 ring-foreground/5 dark:ring-foreground/10">
        <h2 className="mb-3 font-medium">Curso</h2>
        {coursesLoading ? (
          <Skeleton className="h-5 w-48" />
        ) : currentCourse ? (
          <p className="text-sm">{currentCourse.name}</p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm">Selecione seu curso:</p>
            <Select<string>
              value={selectedCourseId}
              onValueChange={(value) => {
                if (value && value !== selectedCourseId) {
                  setSelectedCourseId(value);
                  patchUser(
                    { courseId: value },
                    {
                      onSuccess: () => toast.success("Curso atualizado!"),
                      onError: () => toast.error("Erro ao atualizar curso."),
                    },
                  );
                }
              }}
            >
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue placeholder="Selecionar curso...">
                  {selectedCourseName ?? undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {courses?.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </section>

      {isLeaderOrAdmin && (
        <section className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-medium">Minhas Organizações</h2>
            <Link
              to="/app/organizations/new"
              className="rounded-md bg-primary px-3 py-1 text-primary-foreground text-xs hover:bg-primary/90"
            >
              + Nova organização
            </Link>
          </div>
          {myOrgsLoading && (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          )}
          {!myOrgsLoading && myOrgs && myOrgs.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Você ainda não criou nenhuma organização.
            </p>
          )}
          {!myOrgsLoading && myOrgs && myOrgs.length > 0 && (
            <div className="flex flex-col gap-2">
              {myOrgs.map((org) => (
                <Link
                  key={org.id}
                  to="/app/organizations/$organizationId"
                  params={{ organizationId: org.id }}
                  className="flex items-center justify-between rounded-xl border bg-background/60 px-3 py-2 transition-colors hover:bg-background"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-sm">{org.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {organizationTypeLabels[org.type]}
                    </span>
                  </div>
                  {org.hasOpenProcess && (
                    <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-green-700 text-xs dark:text-green-400">
                      Inscrições Abertas
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {orgsLoading && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        </section>
      )}

      {!orgsLoading && openOrgs.length === 0 && (
        <section className="rounded-2xl border p-4 ring-1 ring-foreground/5 dark:ring-foreground/10">
          <h2 className="mb-1 font-medium">Processos Seletivos</h2>
          <p className="text-muted-foreground text-sm">
            Nenhum processo seletivo aberto no momento.{" "}
            <Link to="/app/organizations" className="text-primary hover:underline">
              Ver organizações
            </Link>
          </p>
        </section>
      )}

      {!orgsLoading && openOrgs.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-medium">Processos Seletivos Abertos</h2>
            <Link to="/app/organizations" className="text-primary text-sm hover:underline">
              Ver catálogo completo
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {openOrgs.map((org) => (
              <Link
                key={org.id}
                to="/app/organizations/$organizationId"
                params={{ organizationId: org.id }}
                className="flex flex-col gap-1 rounded-2xl border p-4 ring-1 ring-foreground/5 transition-colors hover:bg-muted/50 dark:ring-foreground/10"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm">{org.name}</span>
                  <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-green-700 text-xs dark:text-green-400">
                    Inscrições Abertas
                  </span>
                </div>
                <span className="text-muted-foreground text-xs">
                  {organizationTypeLabels[org.type]}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
