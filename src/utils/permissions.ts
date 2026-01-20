/**
 * Permission checking utilities
 *
 * Centralized permission logic for role-based access control
 */

import { ActionEnum, ResourceEnum, RoleEnum } from "@/enums";

/**
 * Permission matrix defining what each role can do
 */
const PERMISSIONS: Record<
  RoleEnum,
  Partial<Record<ResourceEnum, ActionEnum[]>>
> = {
  [RoleEnum.SUPER_ADMIN]: {
    [ResourceEnum.MEMBERS]: [
      ActionEnum.VIEW,
      ActionEnum.CREATE,
      ActionEnum.EDIT,
      ActionEnum.DELETE,
      ActionEnum.EXPORT,
    ],
    [ResourceEnum.PROGRAMMES]: [
      ActionEnum.VIEW,
      ActionEnum.CREATE,
      ActionEnum.EDIT,
      ActionEnum.DELETE,
      ActionEnum.PUBLISH,
    ],
    [ResourceEnum.BANDS]: [
      ActionEnum.VIEW,
      ActionEnum.CREATE,
      ActionEnum.EDIT,
      ActionEnum.DELETE,
    ],
    [ResourceEnum.DEPARTMENTS]: [
      ActionEnum.VIEW,
      ActionEnum.CREATE,
      ActionEnum.EDIT,
      ActionEnum.DELETE,
    ],
    [ResourceEnum.ANNOUNCEMENTS]: [
      ActionEnum.VIEW,
      ActionEnum.CREATE,
      ActionEnum.EDIT,
      ActionEnum.DELETE,
    ],
    [ResourceEnum.FIRST_TIMERS]: [
      ActionEnum.VIEW,
      ActionEnum.CREATE,
      ActionEnum.EDIT,
    ],
    [ResourceEnum.ROLES]: [ActionEnum.VIEW, ActionEnum.ASSIGN],
    [ResourceEnum.SETTINGS]: [ActionEnum.VIEW, ActionEnum.EDIT],
    [ResourceEnum.REPORTS]: [ActionEnum.VIEW, ActionEnum.EXPORT],
  },

  [RoleEnum.ADMIN]: {
    [ResourceEnum.MEMBERS]: [
      ActionEnum.VIEW,
      ActionEnum.CREATE,
      ActionEnum.EDIT,
      ActionEnum.DELETE,
      ActionEnum.EXPORT,
    ],
    [ResourceEnum.PROGRAMMES]: [
      ActionEnum.VIEW,
      ActionEnum.CREATE,
      ActionEnum.EDIT,
      ActionEnum.DELETE,
      ActionEnum.PUBLISH,
    ],
    [ResourceEnum.BANDS]: [
      ActionEnum.VIEW,
      ActionEnum.CREATE,
      ActionEnum.EDIT,
      ActionEnum.DELETE,
    ],
    [ResourceEnum.DEPARTMENTS]: [
      ActionEnum.VIEW,
      ActionEnum.CREATE,
      ActionEnum.EDIT,
      ActionEnum.DELETE,
    ],
    [ResourceEnum.ANNOUNCEMENTS]: [
      ActionEnum.VIEW,
      ActionEnum.CREATE,
      ActionEnum.EDIT,
      ActionEnum.DELETE,
    ],
    [ResourceEnum.FIRST_TIMERS]: [
      ActionEnum.VIEW,
      ActionEnum.CREATE,
      ActionEnum.EDIT,
    ],
    [ResourceEnum.SETTINGS]: [ActionEnum.VIEW, ActionEnum.EDIT],
    [ResourceEnum.REPORTS]: [ActionEnum.VIEW, ActionEnum.EXPORT],
  },

  [RoleEnum.PROGRAMME]: {
    [ResourceEnum.MEMBERS]: [ActionEnum.VIEW],
    [ResourceEnum.PROGRAMMES]: [
      ActionEnum.VIEW,
      ActionEnum.CREATE,
      ActionEnum.EDIT,
      ActionEnum.PUBLISH,
    ],
    [ResourceEnum.BANDS]: [ActionEnum.VIEW],
    [ResourceEnum.DEPARTMENTS]: [ActionEnum.VIEW],
    [ResourceEnum.ANNOUNCEMENTS]: [ActionEnum.VIEW],
    [ResourceEnum.FIRST_TIMERS]: [ActionEnum.VIEW],
    [ResourceEnum.REPORTS]: [ActionEnum.VIEW],
  },

  [RoleEnum.TREASURY]: {
    [ResourceEnum.MEMBERS]: [ActionEnum.VIEW],
    [ResourceEnum.PROGRAMMES]: [ActionEnum.VIEW],
    [ResourceEnum.BANDS]: [ActionEnum.VIEW],
    [ResourceEnum.DEPARTMENTS]: [ActionEnum.VIEW],
    [ResourceEnum.ANNOUNCEMENTS]: [ActionEnum.VIEW],
    [ResourceEnum.FIRST_TIMERS]: [ActionEnum.VIEW],
    [ResourceEnum.REPORTS]: [ActionEnum.VIEW, ActionEnum.EXPORT],
  },

  [RoleEnum.SECRETARIAT]: {
    [ResourceEnum.MEMBERS]: [
      ActionEnum.VIEW,
      ActionEnum.EDIT,
      ActionEnum.EXPORT,
    ],
    [ResourceEnum.PROGRAMMES]: [ActionEnum.VIEW],
    [ResourceEnum.BANDS]: [ActionEnum.VIEW],
    [ResourceEnum.DEPARTMENTS]: [ActionEnum.VIEW],
    [ResourceEnum.ANNOUNCEMENTS]: [
      ActionEnum.VIEW,
      ActionEnum.CREATE,
      ActionEnum.EDIT,
    ],
    [ResourceEnum.FIRST_TIMERS]: [
      ActionEnum.VIEW,
      ActionEnum.CREATE,
      ActionEnum.EDIT,
    ],
    [ResourceEnum.REPORTS]: [ActionEnum.VIEW],
  },

  [RoleEnum.USER]: {
    // Regular users have no admin panel access
  },
};

/**
 * Check if a role has permission to perform an action on a resource
 *
 * @param role - User's role
 * @param resource - Resource being accessed
 * @param action - Action being performed
 * @returns true if permission is granted
 */
export function hasPermission(
  role: string | null | undefined,
  resource: ResourceEnum,
  action: ActionEnum,
): boolean {
  if (!role) return false;

  const rolePermissions = PERMISSIONS[role as RoleEnum];
  if (!rolePermissions) return false;

  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) return false;

  return resourcePermissions.includes(action);
}

/**
 * Check if user can perform action (throws error if not)
 *
 * @param role - User's role
 * @param resource - Resource being accessed
 * @param action - Action being performed
 * @throws Error if permission is denied
 */
export function requirePermission(
  role: string | null | undefined,
  resource: ResourceEnum,
  action: ActionEnum,
): void {
  if (!hasPermission(role, resource, action)) {
    throw new Error(
      `Permission denied: ${role || "unknown"} cannot ${action} ${resource}`,
    );
  }
}

/**
 * Get all permissions for a role
 *
 * @param role - User's role
 * @returns Record of resources and their allowed actions
 */
export function getRolePermissions(
  role: string,
): Partial<Record<ResourceEnum, ActionEnum[]>> {
  return PERMISSIONS[role as RoleEnum] || {};
}

/**
 * Check if role has any permission on a resource
 *
 * @param role - User's role
 * @param resource - Resource being accessed
 * @returns true if role has at least one permission on the resource
 */
export function hasAnyPermission(
  role: string | null | undefined,
  resource: ResourceEnum,
): boolean {
  if (!role) return false;

  const rolePermissions = PERMISSIONS[role as RoleEnum];
  if (!rolePermissions) return false;

  const resourcePermissions = rolePermissions[resource];
  return !!resourcePermissions && resourcePermissions.length > 0;
}

/**
 * Get readable permission description
 *
 * @param resource - Resource
 * @param action - Action
 * @returns Human-readable description
 */
export function getPermissionDescription(
  resource: ResourceEnum,
  action: ActionEnum,
): string {
  const descriptions: Record<ResourceEnum, Record<ActionEnum, string>> = {
    [ResourceEnum.MEMBERS]: {
      [ActionEnum.VIEW]: "View member profiles and lists",
      [ActionEnum.CREATE]: "Add new members to the system",
      [ActionEnum.EDIT]: "Edit member information",
      [ActionEnum.DELETE]: "Remove members from the system",
      [ActionEnum.EXPORT]: "Export member data",
      [ActionEnum.PUBLISH]: "",
      [ActionEnum.ASSIGN]: "",
    },
    [ResourceEnum.PROGRAMMES]: {
      [ActionEnum.VIEW]: "View programme schedules",
      [ActionEnum.CREATE]: "Create new programmes",
      [ActionEnum.EDIT]: "Edit programme details",
      [ActionEnum.DELETE]: "Delete programmes",
      [ActionEnum.PUBLISH]: "Publish/unpublish programmes",
      [ActionEnum.EXPORT]: "",
      [ActionEnum.ASSIGN]: "",
    },
    [ResourceEnum.BANDS]: {
      [ActionEnum.VIEW]: "View band information",
      [ActionEnum.CREATE]: "Create new bands",
      [ActionEnum.EDIT]: "Edit band details",
      [ActionEnum.DELETE]: "Delete bands",
      [ActionEnum.EXPORT]: "",
      [ActionEnum.PUBLISH]: "",
      [ActionEnum.ASSIGN]: "",
    },
    [ResourceEnum.DEPARTMENTS]: {
      [ActionEnum.VIEW]: "View department information",
      [ActionEnum.CREATE]: "Create new departments",
      [ActionEnum.EDIT]: "Edit department details",
      [ActionEnum.DELETE]: "Delete departments",
      [ActionEnum.EXPORT]: "",
      [ActionEnum.PUBLISH]: "",
      [ActionEnum.ASSIGN]: "",
    },
    [ResourceEnum.ANNOUNCEMENTS]: {
      [ActionEnum.VIEW]: "View announcements",
      [ActionEnum.CREATE]: "Create new announcements",
      [ActionEnum.EDIT]: "Edit announcements",
      [ActionEnum.DELETE]: "Delete announcements",
      [ActionEnum.EXPORT]: "",
      [ActionEnum.PUBLISH]: "",
      [ActionEnum.ASSIGN]: "",
    },
    [ResourceEnum.FIRST_TIMERS]: {
      [ActionEnum.VIEW]: "View first timers",
      [ActionEnum.CREATE]: "Add first timers",
      [ActionEnum.EDIT]: "Edit first timer information",
      [ActionEnum.DELETE]: "",
      [ActionEnum.EXPORT]: "",
      [ActionEnum.PUBLISH]: "",
      [ActionEnum.ASSIGN]: "",
    },
    [ResourceEnum.ROLES]: {
      [ActionEnum.VIEW]: "View user roles",
      [ActionEnum.ASSIGN]: "Assign roles to users",
      [ActionEnum.CREATE]: "",
      [ActionEnum.EDIT]: "",
      [ActionEnum.DELETE]: "",
      [ActionEnum.EXPORT]: "",
      [ActionEnum.PUBLISH]: "",
    },
    [ResourceEnum.SETTINGS]: {
      [ActionEnum.VIEW]: "View system settings",
      [ActionEnum.EDIT]: "Modify system settings",
      [ActionEnum.CREATE]: "",
      [ActionEnum.DELETE]: "",
      [ActionEnum.EXPORT]: "",
      [ActionEnum.PUBLISH]: "",
      [ActionEnum.ASSIGN]: "",
    },
    [ResourceEnum.REPORTS]: {
      [ActionEnum.VIEW]: "View reports and analytics",
      [ActionEnum.EXPORT]: "Export reports and data",
      [ActionEnum.CREATE]: "",
      [ActionEnum.EDIT]: "",
      [ActionEnum.DELETE]: "",
      [ActionEnum.PUBLISH]: "",
      [ActionEnum.ASSIGN]: "",
    },
  };

  return descriptions[resource]?.[action] || "";
}
