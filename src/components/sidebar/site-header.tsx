'use client';

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BreadcrumbWithHome } from "../AdminBreadcrumb";
import { ThemeToggle } from "../ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export function SiteHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  if (isLoginPage) {
    return null;
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <BreadcrumbWithHome />
        <div className="ml-auto flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2 text-sm">
              <IconUser className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {user.firstName} {user.lastName}
              </span>
              {user.role && (
                <span className="px-2 py-0.5 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded">
                  {user.role}
                </span>
              )}
            </div>
          )}
          <ThemeToggle />
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <IconLogout className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
