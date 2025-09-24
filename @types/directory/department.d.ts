import { DepartmentKeysEnum } from "@/enums";

declare global {
  export type DepartmentRole = "Head" | "Assistant" | "Secretary" | "Member";

  type DepartmentKeys =
    | INTERPRETATION
    | PROGRAMME
    | MEDIA
    | TREASURY
    | TECHNICAL
    | DRAMA
    | IT
    | EVANGELISM
    | SANITATION
    | SECRETARIAT;

  interface DepartmentData {
    name: DepartmentKeysEnum;
    role: DepartmentRole;
  }

  export type DepartmentLeadership = {
    head: string | null;
    assistant: string | null;
    secretary: string | null;
  };

  export interface Department {
    id: DepartmentKeysEnum;
    name: string;
    displayName: string;
    description: string;
    icon1: string;
    icon2: string;
    gradient: GradientColor;
    meetingDay: string;
    createdAt: string;
    isActive: boolean;
    memberCount: number;
    leadership: DepartmentLeadership;
  }

  export interface MemberDepartment {
    departmentId: DepartmentKeysEnum;
    role: DepartmentRole;
    joinedAt: string;
    isActive: boolean;
  }

  interface DepartmentConfigEntry {
    id: string;
    name: string;
    description: string;
    gradient: GradientColor;
    icon: string;
    meetingDay: string;
  }

  export type DepartmentConfigRecord = Record<string, DepartmentConfigEntry>;
}
