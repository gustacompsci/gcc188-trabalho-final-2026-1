import { Link } from "@tanstack/react-router";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold font-heading text-foreground text-lg">
            Extra<span className="text-primary">UFLA</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/organizations"
              className="text-muted-foreground text-sm transition-colors hover:text-foreground [&.active]:font-medium [&.active]:text-foreground"
            >
              Organizações
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
