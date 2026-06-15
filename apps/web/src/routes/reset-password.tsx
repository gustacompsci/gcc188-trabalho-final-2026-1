import { resetPasswordSchema } from "@extraufla/shared";
import { Button } from "@extraufla/ui/components/button";
import { Card, CardContent } from "@extraufla/ui/components/card";
import { Input } from "@extraufla/ui/components/input";
import { Label } from "@extraufla/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import { resetPasswordMutation } from "@/lib/auth.queries";

export const Route = createFileRoute("/reset-password")({
  validateSearch: z.object({ token: z.string().optional() }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const { mutateAsync: resetPassword } = useMutation(resetPasswordMutation());

  const form = useForm({
    defaultValues: { newPassword: "", confirmPassword: "" },
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error("Token inválido ou ausente.");
        return;
      }
      try {
        await resetPassword({ token, ...value });
        toast.success("Senha redefinida com sucesso!");
        navigate({ to: "/login" });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro ao redefinir senha.";
        toast.error(message);
      }
    },
    validators: {
      onSubmit: resetPasswordSchema.pick({ newPassword: true, confirmPassword: true }),
    },
  });

  if (!token) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-muted p-6">
        <Card className="w-full max-w-sm">
          <CardContent className="flex flex-col gap-4 p-6 text-center">
            <p className="text-destructive text-sm">Link inválido ou expirado.</p>
            <Link to="/forgot-password" className="text-primary text-sm hover:underline">
              Solicitar novo link
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardContent className="p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2 text-center">
                <h1 className="font-bold font-heading text-2xl">Nova senha</h1>
                <p className="text-muted-foreground text-sm">Crie uma nova senha para sua conta.</p>
              </div>

              <form.Field name="newPassword">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={field.name}>Nova senha</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.map((error) => (
                      <p key={error?.message} className="text-destructive text-xs">
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>

              <form.Field name="confirmPassword">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={field.name}>Confirmar senha</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.map((error) => (
                      <p key={error?.message} className="text-destructive text-xs">
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>

              <form.Subscribe
                selector={(s) => ({ canSubmit: s.canSubmit, isSubmitting: s.isSubmitting })}
              >
                {({ canSubmit, isSubmitting }) => (
                  <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Redefinir senha"}
                  </Button>
                )}
              </form.Subscribe>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
