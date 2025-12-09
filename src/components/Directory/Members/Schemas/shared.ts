import z from "zod";
import { BandKeysEnum } from "@/enums";
import { BandRoleEnum } from "@/enums/bands";
import { DepartmentKeysEnum, DepartmentRoleEnum } from "@/enums/department";

export const genderSchema = z.enum(["male", "female"]);
export const departmentRoleSchema = z.enum(DepartmentRoleEnum);

export const departmentNameSchema = z.enum([
  DepartmentKeysEnum.INTERPRETATION,
  DepartmentKeysEnum.PROGRAMME,
  DepartmentKeysEnum.MEDIA,
  DepartmentKeysEnum.TREASURY,
  DepartmentKeysEnum.TECHNICAL,
  DepartmentKeysEnum.DRAMA,
  DepartmentKeysEnum.IT,
  DepartmentKeysEnum.EVANGELISM,
  DepartmentKeysEnum.SANITATION,
  DepartmentKeysEnum.SECRETARIAT,
]);

export const departmentSchema = z.object({
  name: departmentNameSchema,
  role: departmentRoleSchema,
});

export const ministrySchema = z.enum(["Children Ministry", "Youth Fellowship"]);

export const occupationSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || val.length >= 3,
    "Occupation must be at least 3 characters if provided",
  );

const MARITAL_STATUS_OPTIONS = [
  "single",
  "married",
  "divorced",
  "widowed",
  "separated",
] as const;

export const maritalStatusSchema = z.enum(MARITAL_STATUS_OPTIONS).optional();

export const bandRoleSchema = z.enum(BandRoleEnum);

export const bandNameSchema = z.enum([
  BandKeysEnum.CHOIR,
  BandKeysEnum.LOVE_DIVINE,
  BandKeysEnum.DANIEL,
  BandKeysEnum.DEBORAH,
  BandKeysEnum.QUEEN_ESTHER,
  BandKeysEnum.GOOD_WOMEN,
  BandKeysEnum.WARDEN,
  BandKeysEnum.JOHN_BELOVED,
  BandKeysEnum.FAITH,
  BandKeysEnum.HOLY_MARY,
  BandKeysEnum.UNASSIGNED,
]);

export const bandDataSchema = z.object({
  name: bandNameSchema,
  role: bandRoleSchema,
});

export const bandSchema = z.array(bandDataSchema);
