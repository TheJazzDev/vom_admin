"use client";

import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import type * as React from "react";
import { Toaster } from "sonner";
import {
  SimpleSidebar,
  SimpleSidebarProvider,
  useSidebarContext,
} from "@/components/sidebar/SimpleSidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const mutationCache = new MutationCache();

const queryClient = new QueryClient({
  mutationCache,
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
    },
  },
});

const navItems = [
  {
    title: "Programmes",
    url: "/programmes",
    icon: BookOpen,
    items: [
      {
        title: "Overview",
        url: "/programmes",
      },
      {
        title: "Create new",
        url: "/programmes/create",
      },
      {
        title: "Upcoming",
        url: "/programmes/upcoming",
      },
      {
        title: "Past",
        url: "/programmes/past",
      },
      {
        title: "Drafts",
        url: "/programmes/drafts",
      },
    ],
  },
  {
    title: "Directory",
    url: "/directory",
    icon: SquareTerminal,
    items: [
      {
        title: "Overview",
        url: "/directory",
      },
      {
        title: "Members",
        url: "/directory/members",
      },
      {
        title: "Bands",
        url: "/directory/bands",
      },
      {
        title: "Children",
        url: "/directory/children",
      },
    ],
  },
  {
    title: "Ministry",
    url: "/ministry",
    icon: Bot,
    items: [
      {
        title: "Bible Study",
        url: "/ministry/bible-study",
      },
      {
        title: "Recent Sermons",
        url: "/ministry/recent-sermons",
      },
      {
        title: "Prayer Requests",
        url: "/ministry/prayer-requests",
      },
      {
        title: "Testimonies",
        url: "/ministry/testimonies",
      },
    ],
  },
  {
    title: "Information",
    url: "/information",
    icon: Settings2,
    items: [
      {
        title: "Announcements",
        url: "/information/announcements",
      },
      {
        title: "Events",
        url: "/information/events",
      },
      {
        title: "Weekly Activities",
        url: "/information/weekly-activities",
      },
      {
        title: "Monthly Activities",
        url: "/information/monthly-activities",
      },
    ],
  },
];

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarContext();

  return (
    <div
      className={cn(
        "min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out",
        // No margin on mobile (sidebar is overlay)
        // Margin on desktop based on collapsed state
        "ml-0 md:ml-64",
        isCollapsed && "md:ml-16",
      )}
    >
      <SiteHeader />
      <main className="px-6 py-6">
        <div className="mx-auto">{children}</div>
      </main>
    </div>
  );
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <SimpleSidebarProvider>
      <SimpleSidebar navItems={navItems} />
      <LayoutContent>{children}</LayoutContent>
    </SimpleSidebarProvider>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
