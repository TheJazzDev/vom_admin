"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight, Home, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: {
    title: string;
    url: string;
  }[];
}

interface SimpleSidebarProps {
  navItems: NavItem[];
}

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useSidebarContext must be used within SimpleSidebarProvider",
    );
  }
  return context;
}

export function SimpleSidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    // On mobile, toggle open/close
    // On desktop, toggle collapsed/expanded
    if (window.innerWidth < 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, toggleSidebar, isMobileOpen, setIsMobileOpen }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function SimpleSidebar({ navItems }: SimpleSidebarProps) {
  const { isCollapsed, toggleSidebar, isMobileOpen, setIsMobileOpen } =
    useSidebarContext();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Check if a URL is active (exact match only for sub-items to prevent false highlights)
  const isActiveLink = (url: string) => {
    if (url === "/") return pathname === "/";
    return pathname === url;
  };

  // Check if a section has any active child
  const isSectionActive = (item: NavItem) => {
    if (pathname === item.url) return true;
    if (item.items) {
      return item.items.some(
        (subItem) =>
          pathname === subItem.url || pathname.startsWith(`${subItem.url}/`),
      );
    }
    return pathname.startsWith(`${item.url}/`);
  };

  // Get default expanded items based on current path
  const getDefaultExpandedItems = (): string[] => {
    return navItems
      .filter((item) => item.items && isSectionActive(item))
      .map((item) => item.title);
  };

  const [expandedItems, setExpandedItems] = useState<string[]>(() =>
    getDefaultExpandedItems(),
  );

  // Update expanded items when pathname changes
  useEffect(() => {
    const activeItems = navItems
      .filter((item) => {
        if (!item.items) return false;
        if (pathname === item.url) return true;
        return item.items.some(
          (subItem) =>
            pathname === subItem.url || pathname.startsWith(`${subItem.url}/`),
        );
      })
      .map((item) => item.title);

    if (activeItems.length > 0) {
      setExpandedItems((prev) => [...new Set([...prev, ...activeItems])]);
    }
  }, [pathname, navItems]);

  const toggleItem = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsMobileOpen(false);
            }
          }}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out flex flex-col",
          // Mobile: hidden by default, slides in from left when open
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "w-64 md:translate-x-0",
          // Desktop: always visible, width changes based on collapsed state
          isCollapsed ? "md:w-16" : "md:w-64",
        )}
      >
        {/* Header with toggle */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              VOM Admin
            </h2>
          )}
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* Home Link */}
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              pathname === "/"
                ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
            )}
            title={isCollapsed ? "Home" : undefined}
          >
            <Home className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-medium">Home</span>}
          </Link>

          {/* Nav Items */}
          {navItems.map((item) => (
            <div key={item.title}>
              {item.items ? (
                // Collapsible Section
                <div>
                  <button
                    type="button"
                    onClick={() => !isCollapsed && toggleItem(item.title)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors",
                      isSectionActive(item)
                        ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </div>
                    {!isCollapsed && item.items && (
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          expandedItems.includes(item.title) && "rotate-90",
                        )}
                      />
                    )}
                  </button>

                  {/* Sub Items */}
                  {!isCollapsed &&
                    expandedItems.includes(item.title) &&
                    item.items && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.url}
                            href={subItem.url}
                            className={cn(
                              "block px-3 py-2 rounded-lg text-sm transition-colors",
                              isActiveLink(subItem.url)
                                ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-medium"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200",
                            )}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                </div>
              ) : (
                // Direct Link
                <Link
                  href={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActiveLink(item.url)
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* User Section at Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          {user ? (
            <div className="space-y-2">
              {/* User Info */}
              <div
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg",
                  !isCollapsed && "bg-gray-50 dark:bg-gray-900",
                )}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shrink-0">
                  {getUserInitials(
                    user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.email,
                  )}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              {!isCollapsed && (
                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              )}

              {/* Collapsed Logout */}
              {isCollapsed && (
                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors flex items-center justify-center"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          ) : (
            // Not logged in state
            <div
              className={cn(
                "flex items-center gap-3",
                isCollapsed && "justify-center",
              )}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Guest
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Not logged in
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
