import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@extraufla/ui/components/sidebar";
import { Link } from "@tanstack/react-router";

const navItems = [
  { title: "Painel", to: "/app" as const },
  { title: "Organizações", to: "/organizations" as const },
];

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-3">
        <Link to="/" className="font-bold font-heading text-base text-foreground">
          Extra<span className="text-primary">UFLA</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link to={item.to} />}>
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
