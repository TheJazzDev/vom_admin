import { z } from "zod";
import {
  bandSchema,
  departmentSchema,
  genderSchema,
  maritalStatusSchema,
  ministrySchema,
  occupationSchema,
} from "./shared";

// Schema for creating new members (excludes auto-generated fields)
export const createMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  title: z.string().min(1, "Title is required"),
  address: z.string().min(1, "Address is required"),
  gender: genderSchema,
  dob: z.string().min(1, "Date of birth is required"),
  department: z.array(departmentSchema).optional(),
  ministry: z.array(ministrySchema).optional(),
  position: z.array(z.string()).optional(),
  occupation: occupationSchema.optional(),
  maritalStatus: maritalStatusSchema.optional(),
  band: bandSchema.optional(),
  primaryPhone: z.string().min(1, "Primary phone is required"),
  secondaryPhone: z.string().optional(),
  avatar: z.string().optional(),
});
