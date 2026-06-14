import { Button } from "@extraufla/ui/components/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import { sessionQuery, signOutMutation } from "@/lib/auth.queries";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery());
    if (!session) redirect({ to: "/login", throw: true });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session } = useQuery(sessionQuery());
  const { mutate: signOut } = useMutation(signOutMutation(queryClient));

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
      <section className="rounded-lg border p-4">
        <h2 className="mb-2 font-medium">Bem-vindo(a), {session?.user.name}</h2>
        <p className="text-muted-foreground text-sm">{session?.user.email}</p>
      </section>
    </div>
  );
}
