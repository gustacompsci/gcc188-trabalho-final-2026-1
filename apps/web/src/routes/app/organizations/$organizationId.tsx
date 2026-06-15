import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/organizations/$organizationId")({
  component: () => <Outlet />,
});
