import { createOrganizationSchema, organizationTypeLabels } from "@extraufla/shared";
import { Button } from "@extraufla/ui/components/button";
import { Card, CardContent } from "@extraufla/ui/components/card";
import { Input } from "@extraufla/ui/components/input";
import { Label } from "@extraufla/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@extraufla/ui/components/select";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import { sessionQuery } from "@/lib/auth.queries";
import { createOrganizationMutation } from "@/lib/organizations.queries";

export const Route = createFileRoute("/organizations/new")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery());
    if (!session) redirect({ to: "/login", throw: true });
    else if (!["leader", "admin"].includes(session.user.role)) {
      redirect({ to: "/app", throw: true });
    }
  },
  component: NewOrganizationPage,
});

// Form validator that matches defaultValues (all fields are strings)
const formSchema = createOrganizationSchema.extend({
  socialLinks: z.string(),
  logoUrl: z.string(),
});

function NewOrganizationPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: createOrg } = useMutation(createOrganizationMutation(queryClient));

  const form = useForm({
    defaultValues: {
      id: "",
      name: "",
      type: "" as "junior_company" | "extension_project" | "study_group",
      description: "",
      area: "",
      contact: "",
      socialLinks: "",
      logoUrl: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const org = await createOrg({
          ...value,
          socialLinks: value.socialLinks || undefined,
          logoUrl: value.logoUrl || undefined,
        });
        toast.success("Organização criada com sucesso!");
        navigate({ to: "/organizations/$organizationId", params: { organizationId: org.id } });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro ao criar organização.";
        toast.error(message);
      }
    },
    validators: { onSubmit: formSchema },
  });

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 font-bold text-2xl">Nova Organização</h1>
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
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="id">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={field.name}>ID (slug)</Label>
                    <Input
                      id={field.name}
                      placeholder="comp-junior"
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

              <form.Field name="name">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={field.name}>Nome</Label>
                    <Input
                      id={field.name}
                      placeholder="Comp Júnior"
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

            <form.Field name="type">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <Label>Tipo</Label>
                  <Select<string>
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v as typeof field.state.value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        Object.keys(organizationTypeLabels) as Array<
                          keyof typeof organizationTypeLabels
                        >
                      ).map((k) => (
                        <SelectItem key={k} value={k}>
                          {organizationTypeLabels[k]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors.map((e) => (
                    <p key={e?.message} className="text-destructive text-xs">
                      {e?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="description">
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

            <div className="grid grid-cols-2 gap-4">
              <form.Field name="area">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={field.name}>Área</Label>
                    <Input
                      id={field.name}
                      placeholder="Tecnologia"
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

              <form.Field name="contact">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={field.name}>Contato</Label>
                    <Input
                      id={field.name}
                      placeholder="contato@org.com.br"
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

            <form.Field name="logoUrl">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor={field.name}>URL do Logo (opcional)</Label>
                  <Input
                    id={field.name}
                    type="url"
                    placeholder="https://..."
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

            <form.Subscribe
              selector={(s) => ({ canSubmit: s.canSubmit, isSubmitting: s.isSubmitting })}
            >
              {({ canSubmit, isSubmitting }) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Criando..." : "Criar organização"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
