"use client";

import { IconAlertCircle, IconLock, IconShield } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { type ActionEnum, type ResourceEnum, ROLE_CONFIG } from "@/enums";
import { hasPermission } from "@/utils/permissions";

interface PermissionGuardProps {
  children: React.ReactNode;
  resource: ResourceEnum;
  action: ActionEnum;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  resource,
  action,
  fallback,
}: PermissionGuardProps) {
  const { loading, effectiveRole } = useAuth();
  const router = useRouter();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Checking permissions...
          </p>
        </div>
      </div>
    );
  }

  // Check permission using effective role (which includes view-as functionality)
  const hasAccess = hasPermission(effectiveRole, resource, action);

  if (!hasAccess) {
    // Use custom fallback if provided
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default permission denied UI
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <IconLock className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to {action} {resource}. This page requires
            elevated access that your current role does not provide.
          </p>

          {/* Current Role Badge */}
          {effectiveRole && (
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <IconShield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your role:{" "}
                <span
                  className="font-semibold"
                  style={{
                    color:
                      ROLE_CONFIG[effectiveRole as keyof typeof ROLE_CONFIG]
                        ?.color || "#6B7280",
                  }}
                >
                  {ROLE_CONFIG[effectiveRole as keyof typeof ROLE_CONFIG]
                    ?.label || effectiveRole}
                </span>
              </span>
            </div>
          )}

          {/* Help Text */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <IconAlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200 text-left">
                <p className="font-medium mb-1">Need access?</p>
                <p>
                  Contact your system administrator or super admin to request
                  the appropriate role for this section.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="shrink-0"
            >
              Go Back
            </Button>
            <Button onClick={() => router.push("/")} className="shrink-0">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // User has permission, render children
  return <>{children}</>;
}
