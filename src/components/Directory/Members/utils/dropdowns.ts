import { DepartmentKeysEnum } from "@/enums";
import { BandRoleEnum } from "@/enums/bands";

export const DEPARTMENTS = Object.values(DepartmentKeysEnum).map((key) => ({
  id: key,
  name: key,
}));

export const BANDS = Object.values(BandRoleEnum).map((role) => ({
  id: role,
  name: role,
}));

export const POSITIONS = ["Secretary", "Treasurer"];

export const MINISTRIES: Ministry[] = ["Children Ministry", "Youth Fellowship"];
