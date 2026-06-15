import type { ForgetPasswordDto, ResetPasswordDto, SignInDto, SignUpDto } from "@extraufla/shared";
import type { QueryClient } from "@tanstack/react-query";
import { http } from "./http";

export type AuthSession = {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    token: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    courseId: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
} | null;

export const sessionQuery = () =>
  ({
    queryKey: ["auth", "session"] as const,
    queryFn: () => http.get<AuthSession>("/auth/get-session"),
    staleTime: 1000 * 60 * 5,
  }) as const;

export const signInMutation = (queryClient: QueryClient) => ({
  mutationFn: (input: SignInDto) =>
    http.post("/auth/sign-in/email", { body: JSON.stringify(input) }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "session"] }),
});

export const signUpMutation = (queryClient: QueryClient) => ({
  mutationFn: (input: SignUpDto) =>
    http.post("/auth/sign-up/email", { body: JSON.stringify(input) }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "session"] }),
});

export const forgetPasswordMutation = () => ({
  mutationFn: (input: ForgetPasswordDto) =>
    http.post("/auth/forget-password", { body: JSON.stringify(input) }),
});

export const resetPasswordMutation = () => ({
  mutationFn: (input: ResetPasswordDto) =>
    http.post("/auth/reset-password", { body: JSON.stringify(input) }),
});

export const signOutMutation = (queryClient: QueryClient) => ({
  mutationFn: () => http.post("/auth/sign-out"),
  onSuccess: () => {
    queryClient.setQueryData(["auth", "session"], null);
    queryClient.invalidateQueries({ queryKey: ["auth"] });
  },
});
