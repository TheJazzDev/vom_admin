import z from "zod";
import { BandKeys } from "@/enums";
import { BandRoleEnum } from "@/enums/bands";

export const genderSchema = z.enum(["male", "female"]);

export const departmentSchema = z.enum([
  "Interpretation",
  "Programme",
  "Media",
  "Treasury",
  "Technical",
  "Drama",
  "IT",
  "Envagicialism",
  "Sanitation",
]);

export const ministrySchema = z.enum(["Children Ministry", "Youth Fellowship"]);

const MARITAL_STATUS_OPTIONS = [
  "single",
  "married",
  "divorced",
  "widowed",
  "separated",
] as const;

export const occupationSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || val.length >= 3,
    "Occupation must be at least 3 characters if provided",
  );

export const maritalStatusSchema = z
  .string()
  .optional()
  .refine((val) => {
    if (!val) return true;
    if (MARITAL_STATUS_OPTIONS.includes(val.toLowerCase() as MaritalStatus))
      return true;
    return val.length >= 3;
  }, "Marital status must be a valid option or at least 3 characters if custom");

export const bandSchema = z.array(
  z.object({
    name: z.enum(BandKeys, {
      error: () => ({ message: "Please select a valid band name" }),
    }),
    role: z.enum(BandRoleEnum, {
      error: () => ({ message: "Please select a valid band role" }),
    }),
  }),
);
