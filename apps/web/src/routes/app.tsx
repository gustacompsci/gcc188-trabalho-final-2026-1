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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { sessionQuery, signOutMutation } from "@/lib/auth.queries";
import { coursesQuery, organizationsQuery, patchUserMutation } from "@/lib/organizations.queries";

export const Route = createFileRoute("/app")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery());
    if (!session) redirect({ to: "/login", throw: true });
  },
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

  return (
    <div className="mt-2 flex items-center gap-2">
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
  );
}

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session } = useQuery(sessionQuery());
  const { mutate: signOut } = useMutation(signOutMutation(queryClient));
  const { data: organizations } = useQuery(organizationsQuery());
  const { data: courses } = useQuery(coursesQuery());
  const { mutate: patchUser } = useMutation(patchUserMutation(queryClient));

  const openOrgs = organizations?.filter((o) => o.hasOpenProcess).slice(0, 3) ?? [];
  const currentCourse = courses?.find((c) => c.id === session?.user.courseId);

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
        {currentCourse ? (
          <p className="text-sm">{currentCourse.name}</p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm">Selecione seu curso:</p>
            <Select<string>
              onValueChange={(value) => {
                if (value) patchUser({ courseId: value });
              }}
            >
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue placeholder="Selecionar curso..." />
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

      {["leader", "admin"].includes(session?.user.role ?? "") && (
        <section className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-medium">Área do Líder</h2>
            <Link
              to="/organizations/new"
              className="rounded-md bg-primary px-3 py-1 text-primary-foreground text-xs hover:bg-primary/90"
            >
              + Nova organização
            </Link>
          </div>
          <p className="text-muted-foreground text-sm">
            Acesse uma organização que você lidera para abrir um processo seletivo.
          </p>
        </section>
      )}

      {openOrgs.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-medium">Processos Seletivos Abertos</h2>
            <Link to="/organizations" className="text-primary text-sm hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {openOrgs.map((org) => (
              <Link
                key={org.id}
                to="/organizations/$organizationId"
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
