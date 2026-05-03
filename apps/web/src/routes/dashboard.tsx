import { Button } from "@extraufla/ui/components/button";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
    return { session };
  },
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Painel</h1>
        <Button
          variant="outline"
          onClick={() => {
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  navigate({ to: "/" });
                },
              },
            });
          }}
        >
          Sair
        </Button>
      </div>
      <section className="rounded-lg border p-4">
        <h2 className="mb-2 font-medium">
          Bem-vindo(a), {session.data?.user.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {session.data?.user.email}
        </p>
      </section>
    </div>
  );
}
