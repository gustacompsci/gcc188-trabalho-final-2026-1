import { Button } from "@extraufla/ui/components/button";
import { Card, CardContent } from "@extraufla/ui/components/card";
import { Input } from "@extraufla/ui/components/input";
import { Label } from "@extraufla/ui/components/label";
import { cn } from "@extraufla/ui/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { signUpMutation } from "@/lib/auth.queries";
import { ApiError } from "@/lib/http";

export default function SignUpForm({
  onSwitchToSignIn,
  className,
}: {
  onSwitchToSignIn: () => void;
  className?: string;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: signUp } = useMutation(signUpMutation(queryClient));

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    onSubmit: async ({ value }) => {
      try {
        await signUp({ email: value.email, password: value.password, name: value.name });
        navigate({ to: "/login" });
        toast.success("Cadastro realizado! Faça login para continuar.");
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
          toast.error("E-mail já cadastrado. Faça login ou recupere sua senha.");
        } else {
          const message = error instanceof Error ? error.message : "Erro ao criar conta.";
          toast.error(message);
        }
      }
    },
    validators: {
      onSubmit: z
        .object({
          name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
          email: z
            .email("E-mail inválido")
            .refine(
              (email) => email.endsWith("@ufla.br") || email.endsWith("@estudante.ufla.br"),
              "Utilize seu e-mail institucional (@ufla.br ou @estudante.ufla.br).",
            ),
          password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
          confirmPassword: z.string().min(1, "Confirme sua senha."),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "As senhas não conferem.",
          path: ["confirmPassword"],
        }),
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-primary/5 md:flex md:flex-col md:items-center md:justify-center md:gap-4 md:p-8">
            <div className="text-center">
              <p className="font-bold font-heading text-3xl text-primary">
                Extra<span className="text-foreground">UFLA</span>
              </p>
              <p className="mt-2 text-muted-foreground text-sm">
                Atividades extracurriculares da UFLA em um só lugar.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="p-6 md:p-8"
          >
            <div className="flex flex-col gap-5">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="font-bold font-heading text-2xl">Criar conta</h1>
                <p className="text-muted-foreground text-sm">
                  Use seu e-mail institucional UFLA para se cadastrar.
                </p>
              </div>

              <form.Field name="name">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={field.name}>Nome completo</Label>
                    <Input
                      id={field.name}
                      name={field.name}
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

              <form.Field name="email">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={field.name}>E-mail institucional</Label>
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

              <form.Field name="password">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={field.name}>Senha</Label>
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
                selector={(state) => ({
                  canSubmit: state.canSubmit,
                  isSubmitting: state.isSubmitting,
                })}
              >
                {({ canSubmit, isSubmitting }) => (
                  <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? "Criando conta..." : "Criar conta"}
                  </Button>
                )}
              </form.Subscribe>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
                <span className="relative z-10 bg-card px-2 text-muted-foreground">
                  Já tem uma conta?
                </span>
              </div>

              <Button type="button" variant="outline" className="w-full" onClick={onSwitchToSignIn}>
                Entrar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
