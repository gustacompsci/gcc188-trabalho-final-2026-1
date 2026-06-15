import { forgetPasswordSchema } from "@extraufla/shared";
import { Button } from "@extraufla/ui/components/button";
import { Card, CardContent } from "@extraufla/ui/components/card";
import { Input } from "@extraufla/ui/components/input";
import { Label } from "@extraufla/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { forgetPasswordMutation } from "@/lib/auth.queries";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { mutateAsync: forgetPassword } = useMutation(forgetPasswordMutation());

  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      try {
        await forgetPassword({
          email: value.email,
          redirectTo: `${window.location.origin}/reset-password`,
        });
        setSent(true);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro ao solicitar recuperação.";
        toast.error(message);
      }
    },
    validators: { onSubmit: forgetPasswordSchema.pick({ email: true }) },
  });

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardContent className="p-6">
            {sent ? (
              <div className="flex flex-col gap-4 text-center">
                <h1 className="font-bold font-heading text-2xl">E-mail enviado</h1>
                <p className="text-muted-foreground text-sm">
                  Se o e-mail estiver cadastrado, você receberá as instruções em breve.
                </p>
                <Link to="/login" className="text-primary text-sm hover:underline">
                  Voltar ao login
                </Link>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-2 text-center">
                  <h1 className="font-bold font-heading text-2xl">Recuperar senha</h1>
                  <p className="text-muted-foreground text-sm">
                    Informe seu e-mail institucional para receber o link de redefinição.
                  </p>
                </div>

                <form.Field name="email">
                  {(field) => (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor={field.name}>E-mail</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="seu@ufla.br"
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
                      {isSubmitting ? "Enviando..." : "Enviar link"}
                    </Button>
                  )}
                </form.Subscribe>

                <Link
                  to="/login"
                  className="text-center text-muted-foreground text-sm hover:text-foreground"
                >
                  Voltar ao login
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
