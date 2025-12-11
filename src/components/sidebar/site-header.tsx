"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { BreadcrumbWithHome } from "../AdminBreadcrumb";
import { ThemeToggle } from "../ThemeToggle";
import { useSidebarContext } from "./SimpleSidebar";

export function SiteHeader() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { toggleSidebar } = useSidebarContext();

  if (isLoginPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="flex w-full items-center gap-4 px-6">
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <BreadcrumbWithHome />
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
