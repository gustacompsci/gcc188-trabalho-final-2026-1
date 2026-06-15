import { z } from "zod";

const ALLOWED_DOMAINS = ["@ufla.br", "@estudante.ufla.br"] as const;

const uflaEmail = z
  .string()
  .email()
  .refine((email) => ALLOWED_DOMAINS.some((domain) => email.endsWith(domain)), {
    message: "Use seu e-mail institucional (@ufla.br ou @estudante.ufla.br)",
  });

export const signInSchema = z.object({
  email: uflaEmail,
  password: z.string().min(1, "Senha obrigatória"),
});

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
    email: uflaEmail,
    password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
    courseId: z.string().min(1, "Selecione seu curso"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export const forgetPasswordSchema = z.object({
  email: uflaEmail,
  redirectTo: z.string().url().optional(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token obrigatório"),
    newPassword: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export type SignInDto = z.infer<typeof signInSchema>;
export type SignUpDto = z.infer<typeof signUpSchema>;
export type ForgetPasswordDto = z.infer<typeof forgetPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
