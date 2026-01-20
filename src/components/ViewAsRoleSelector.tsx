"use client";

import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_CONFIG, RoleEnum } from "@/enums";

export function ViewAsRoleSelector() {
  const { user, viewingAsRole, setViewingAsRole } = useAuth();

  // Only show to super_admins
  if (user?.role !== RoleEnum.SUPER_ADMIN) {
    return null;
  }

  const handleRoleChange = (value: string) => {
    if (value === "reset") {
      setViewingAsRole(null);
    } else {
      setViewingAsRole(value);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 p-4">
      {/* Warning banner when viewing as another role */}
      {viewingAsRole && (
        <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2">
            <IconEye className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-200">
              Viewing as{" "}
              <strong>{ROLE_CONFIG[viewingAsRole as RoleEnum]?.label}</strong>
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <IconEye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            View As Role
          </span>
          <Badge variant="outline" className="text-xs">
            Super Admin
          </Badge>
        </div>

        <Select
          value={viewingAsRole || "reset"}
          onValueChange={handleRoleChange}
        >
          <SelectTrigger className="w-full h-9 text-sm">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reset">
              <div className="flex items-center gap-2">
                <IconEyeOff className="w-4 h-4" />
                <span>Your Role (Super Admin)</span>
              </div>
            </SelectItem>
            {Object.values(RoleEnum)
              .filter((role) => role !== RoleEnum.SUPER_ADMIN)
              .map((role) => (
                <SelectItem key={role} value={role}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: ROLE_CONFIG[role]?.color }}
                    />
                    <span>{ROLE_CONFIG[role]?.label}</span>
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {viewingAsRole && (
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Testing {ROLE_CONFIG[viewingAsRole as RoleEnum]?.label} permissions
          </p>
        )}
      </div>
    </div>
  );
}
