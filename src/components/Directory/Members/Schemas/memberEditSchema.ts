import z from "zod";

export const memberEditSchema = z.object({
  firstName: z.string().min(3, "First name is required"),
  lastName: z.string().min(3, "Last name is required"),
  email: z.email("Invalid email address"),
  title: z.string().min(1, "Title is required"),
  position: z.array(z.string()),
  address: z.string().min(1, "Address is required"),
  gender: z.enum(["male", "female"]),
  dob: z.string().min(1, "Date of birth is required"),
  department: z.array(z.string()),
  band: z.array(z.string()).optional(),
  ministry: z.array(z.string()).optional(),
  primaryPhone: z.string().min(1, "Primary phone is required"),
  secondaryPhone: z.string().optional(),
  // Super admin only fields
  authType: z.enum(["email", "phone"]),
  status: z.enum(["active", "inactive"]).optional(),
  verified: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  phoneVerified: z.boolean().optional(),
});
