"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

interface BreadcrumbProps {
  homeLabel?: string;
  homePath?: string;
  separator?: "chevron" | "slash" | "arrow";
  showHome?: boolean;
  maxItems?: number;
  className?: string;
  customLabels?: Record<string, string>;
}

// Default labels for common paths
const defaultLabels: Record<string, string> = {
  admin: "Admin",
  directory: "Directory",
  members: "Members",
  bands: "Bands",
  children: "Children",
  departments: "Departments",
  events: "Events",
  services: "Services",
  settings: "Settings",
  profile: "Profile",
  dashboard: "Dashboard",
  reports: "Reports",
  analytics: "Analytics",
  "create-new": "Create New",
  edit: "Edit",
  view: "View",
  details: "Details",
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  homeLabel = "Home",
  homePath = "/",
  separator = "chevron",
  showHome = true,
  maxItems = 5,
  className = "",
  customLabels = {},
}) => {
  const pathname = usePathname();

  const allLabels = { ...defaultLabels, ...customLabels };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (showHome && pathname !== homePath) {
      breadcrumbs.push({
        label: homeLabel,
        href: homePath,
        isLast: false,
      });
    }

    pathSegments.forEach((segment, index) => {
      // ✅ FIX: use index + 1 so the href includes current segment
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const isLast = index === pathSegments.length - 1;

      const label =
        allLabels[segment] ||
        segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      breadcrumbs.push({
        label,
        href,
        isLast,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const displayBreadcrumbs =
    breadcrumbs.length > maxItems
      ? [
          ...breadcrumbs.slice(0, 1),
          { label: "...", href: "", isLast: false },
          ...breadcrumbs.slice(-maxItems + 2),
        ]
      : breadcrumbs;

  const Separator = () => {
    switch (separator) {
      case "chevron":
        return (
          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        );
      case "arrow":
        return <span className="text-gray-400 dark:text-gray-500">→</span>;
      case "slash":
        return <span className="text-gray-400 dark:text-gray-500">/</span>;
    }
  };

  if (breadcrumbs.length <= 1 && showHome) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-sm ${className}`}
    >
      {displayBreadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <Separator />}
          {item.label === "..." ? (
            <span className="text-gray-400 dark:text-gray-500 px-1">...</span>
          ) : item.isLast ? (
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Enhanced version with home icon
export const BreadcrumbWithHome: React.FC<BreadcrumbProps> = (props) => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-sm ${props.className || ""}`}
    >
      {pathname !== (props.homePath || "/") && (
        <>
          <Link
            href={props.homePath || "/"}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-200 flex items-center gap-1"
          >
            <Home className="h-4 w-4" />
            {props.homeLabel || "Home"}
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        </>
      )}
      <Breadcrumb {...props} showHome={false} />
    </nav>
  );
};
