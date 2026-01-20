/**
 * Role and Permission Enums
 *
 * Defines the role hierarchy and permission structure for the VOM Admin system.
 */

/**
 * User roles in the system (ordered by authority level)
 */
export enum RoleEnum {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  PROGRAMME = "programme",
  TREASURY = "treasury",
  SECRETARIAT = "secretariat",
  USER = "user",
}

/**
 * Role metadata for display and description
 */
export const ROLE_CONFIG = {
  [RoleEnum.SUPER_ADMIN]: {
    label: "Super Admin",
    description: "Full system access with role management",
    color: "#DC2626", // red-600
    icon: "shield-check",
    level: 100,
  },
  [RoleEnum.ADMIN]: {
    label: "Admin",
    description: "IT team members with administrative access",
    color: "#2563EB", // blue-600
    icon: "user-shield",
    level: 80,
  },
  [RoleEnum.PROGRAMME]: {
    label: "Programme",
    description: "Programme department - event management",
    color: "#7C3AED", // violet-600
    icon: "calendar",
    level: 60,
  },
  [RoleEnum.TREASURY]: {
    label: "Treasury",
    description: "Treasury department - financial oversight",
    color: "#059669", // emerald-600
    icon: "currency-dollar",
    level: 60,
  },
  [RoleEnum.SECRETARIAT]: {
    label: "Secretariat",
    description: "Secretariat - administrative support",
    color: "#D97706", // amber-600
    icon: "clipboard-document-list",
    level: 60,
  },
  [RoleEnum.USER]: {
    label: "User",
    description: "Regular member - mobile app access only",
    color: "#6B7280", // gray-500
    icon: "user",
    level: 10,
  },
} as const;

/**
 * Resources that can have permissions
 */
export enum ResourceEnum {
  MEMBERS = "members",
  PROGRAMMES = "programmes",
  BANDS = "bands",
  DEPARTMENTS = "departments",
  ANNOUNCEMENTS = "announcements",
  FIRST_TIMERS = "firstTimers",
  ROLES = "roles",
  SETTINGS = "settings",
  REPORTS = "reports",
}

/**
 * Actions that can be performed on resources
 */
export enum ActionEnum {
  VIEW = "view",
  CREATE = "create",
  EDIT = "edit",
  DELETE = "delete",
  EXPORT = "export",
  PUBLISH = "publish",
  ASSIGN = "assign",
}

/**
 * Permission type
 */
export type Permission = {
  resource: ResourceEnum;
  action: ActionEnum;
};

/**
 * Role type (extracted from enum)
 */
export type Role = `${RoleEnum}`;

/**
 * Admin roles (roles with admin panel access)
 */
export const ADMIN_ROLES: Role[] = [
  RoleEnum.SUPER_ADMIN,
  RoleEnum.ADMIN,
  RoleEnum.PROGRAMME,
  RoleEnum.TREASURY,
  RoleEnum.SECRETARIAT,
];

/**
 * Check if a role has admin access
 */
export function isAdminRole(role?: string | null): boolean {
  if (!role) return false;
  return ADMIN_ROLES.includes(role as Role);
}

/**
 * Get role level (for hierarchy comparison)
 */
export function getRoleLevel(role?: string | null): number {
  if (!role) return 0;
  return ROLE_CONFIG[role as RoleEnum]?.level || 0;
}

/**
 * Check if role A can modify role B
 */
export function canModifyRole(
  modifierRole: string,
  targetRole: string,
): boolean {
  const modifierLevel = getRoleLevel(modifierRole);
  const targetLevel = getRoleLevel(targetRole);

  // Only super_admin can modify roles
  if (modifierRole !== RoleEnum.SUPER_ADMIN) return false;

  // Super admin can modify any role
  return modifierLevel > targetLevel || modifierRole === RoleEnum.SUPER_ADMIN;
}
