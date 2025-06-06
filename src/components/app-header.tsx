"use client";

import { useEffect } from "react";

import { useState } from "react";
import Link from "next/link";
import { Users, Building2, Receipt, LayoutDashboard } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/actions/user-actions";
import { EditUserModal } from "./EditUserModal";
import { LogoutButton } from "@/components/logout-button";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { Logo } from "./logo";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Funcionários",
    url: "/funcionarios",
    icon: Users,
  },
  {
    title: "Filiais",
    url: "/filiais",
    icon: Building2,
  },
  {
    title: "Folha de Pagamento",
    url: "/folha-pagamento",
    icon: Receipt,
  },
];

export function AppHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    }

    loadUser();
  }, []);

  const handleEditClick = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-4">
          <Logo />
        </div>
        <nav className="hidden md:flex items-center justify-center flex-1">
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground ${
                  pathname === item.url
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex items-center gap-4 ml-auto">
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.title} asChild>
                    <Link href={item.url} className="flex items-center gap-2">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">
                  {user?.email || "Carregando..."}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEditClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Editar Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <ModeToggle />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="w-full">
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {user && (
        <EditUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={user}
          onSuccess={() => {
            getCurrentUser().then(setUser);
          }}
        />
      )}
    </header>
  );
}
