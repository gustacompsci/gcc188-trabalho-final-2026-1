import { SidebarInset, SidebarProvider } from "@extraufla/ui/components/sidebar";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/admin-sidebar";
import { sessionQuery } from "@/lib/auth.queries";

export const Route = createFileRoute("/app")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery());
    if (!session) redirect({ to: "/login", throw: true });
  },
  component: AppLayout,
});

function AppLayout() {
  const { data: session } = useQuery(sessionQuery());

  if (session?.user.role === "admin") {
    return (
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="overflow-auto">
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return <Outlet />;
}
