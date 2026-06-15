import { Button } from "@extraufla/ui/components/button";
import { Card, CardContent } from "@extraufla/ui/components/card";
import { Input } from "@extraufla/ui/components/input";
import { Label } from "@extraufla/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import { sessionQuery } from "@/lib/auth.queries";
import { createProcessMutation } from "@/lib/organizations.queries";

export const Route = createFileRoute("/app/organizations/$organizationId/new-process")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery());
    if (!["leader", "admin"].includes(session?.user.role ?? "")) {
      redirect({ to: "/app", throw: true });
    }
  },
  component: NewProcessPage,
});

const processFormSchema = z
  .object({
    title: z.string().min(3, "Título deve ter ao menos 3 caracteres"),
    description: z.string().min(10, "Descrição deve ter ao menos 10 caracteres"),
    vacancies: z.number().int().positive("Vagas deve ser um número positivo"),
    startDate: z.string().min(1, "Data de início obrigatória"),
    endDate: z.string().min(1, "Data de encerramento obrigatória"),
  })
  .refine((d) => new Date(d.endDate) > new Date(d.startDate), {
    message: "A data de encerramento deve ser posterior à de início",
    path: ["endDate"],
  });

function NewProcessPage() {
  const { organizationId } = Route.useParams();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: createProcess } = useMutation(
    createProcessMutation(queryClient, organizationId),
  );

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      vacancies: 1,
      startDate: "",
      endDate: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await createProcess({
          title: value.title,
          description: value.description,
          vacancies: value.vacancies,
          startDate: new Date(value.startDate).getTime(),
          endDate: new Date(value.endDate).getTime(),
        });
        toast.success("Processo seletivo criado!");
        navigate({
          to: "/app/organizations/$organizationId",
          params: { organizationId },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro ao criar processo.";
        toast.error(message);
      }
    },
    validators: { onSubmit: processFormSchema },
  });

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 font-bold text-2xl">Novo Processo Seletivo</h1>
      <Card>
        <CardContent className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            <form.Field
              name="title"
              validators={{ onBlur: z.string().min(3, "Título deve ter ao menos 3 caracteres") }}
            >
              {(field) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor={field.name}>Título</Label>
                  <Input
                    id={field.name}
                    placeholder="Processo Seletivo 2026.2"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.map((e) => (
                    <p key={e?.message} className="text-destructive text-xs">
                      {e?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field
              name="description"
              validators={{
                onBlur: z.string().min(10, "Descrição deve ter ao menos 10 caracteres"),
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor={field.name}>Descrição</Label>
                  <textarea
                    id={field.name}
                    rows={3}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.map((e) => (
                    <p key={e?.message} className="text-destructive text-xs">
                      {e?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="vacancies">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor={field.name}>Vagas</Label>
                  <Input
                    id={field.name}
                    type="number"
                    min={1}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                  {field.state.meta.errors.map((e) => (
                    <p key={e?.message} className="text-destructive text-xs">
                      {e?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-2 gap-4">
              <form.Field name="startDate">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={field.name}>Início</Label>
                    <Input
                      id={field.name}
                      type="date"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.map((e) => (
                      <p key={e?.message} className="text-destructive text-xs">
                        {e?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>

              <form.Field name="endDate">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={field.name}>Encerramento</Label>
                    <Input
                      id={field.name}
                      type="date"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.map((e) => (
                      <p key={e?.message} className="text-destructive text-xs">
                        {e?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            <div className="flex gap-2">
              <form.Subscribe
                selector={(s) => ({ canSubmit: s.canSubmit, isSubmitting: s.isSubmitting })}
              >
                {({ canSubmit, isSubmitting }) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? "Criando..." : "Criar processo"}
                  </Button>
                )}
              </form.Subscribe>
              <Button type="button" variant="outline" onClick={() => router.history.back()}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
