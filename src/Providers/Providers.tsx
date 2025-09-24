"use client";

import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import type * as React from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const mutationCache = new MutationCache({
  onMutate: (variables: any) => {
    console.log("Global on mutate:", variables);
  },
});

const queryClient = new QueryClient({
  mutationCache,
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      onSuccess: (data: any) => {
        console.log("Global mutation success", data);
      },
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 64)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="px-6 h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 transition-colors duration-200 overflow-hidden overflow-y-scroll">
              <div className="max-w-7xl mx-auto">{children}</div>
            </div>
          </SidebarInset>
          <ReactQueryDevtools />
        </SidebarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
