import z from "zod";
import {
  bandSchema,
  departmentSchema,
  genderSchema,
  maritalStatusSchema,
  ministrySchema,
  occupationSchema,
} from "./shared";

export const memberEditSchema = z.object({
  firstName: z.string().min(3, "First name is required"),
  middleName: z
    .string()
    .refine((val) => !val || val.length >= 3, {
      message: "Middle Name cannot be less than 3 characters",
    })
    .optional(),
  lastName: z.string().min(3, "Last name is required"),
  email: z
    .string()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Invalid email address",
    })
    .optional(),
  title: z.string().min(1, "Title is required"),
  position: z.array(z.string()).optional(),
  address: z.string().min(1, "Address is required"),
  gender: genderSchema,
  dob: z.string().min(1, "Date of birth is required"),
  occupation: occupationSchema.optional(),
  maritalStatus: maritalStatusSchema.optional(),
  band: bandSchema.optional(),
  joinDate: z.string().optional(),
  department: z.array(departmentSchema).optional(),
  ministry: z.array(ministrySchema).optional(),
  primaryPhone: z.string().min(1, "Primary phone is required"),
  secondaryPhone: z.string().optional(),
  avatar: z.string().optional(),
  // Super admin only fields
  authType: z.enum(["email", "phone"]),
  status: z.enum(["active", "inactive"]).optional(),
  verified: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  phoneVerified: z.boolean().optional(),
});
