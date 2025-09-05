import z from "zod";

const genderSchema = z.enum(["male", "female"]);
const authTypeSchema = z.enum(["email", "phone"]);
const statusSchema = z.enum(["active", "inactive"]);
const accountTypeSchema = z.enum(["member", "guest"]);

const departmentSchema = z.enum([
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

const bandSchema = z.enum([
  "Choir",
  "Love Divine",
  "Daniel",
  "Deborah",
  "Queen Esther",
  "Good Women",
  "Warden",
  "John Beloved",
  "Faith",
  "Holy Mary",
]);

const ministrySchema = z.enum(["Children Ministry", "Youth Fellowship"]);

export const tableSchema = z.object({
  // Core identifiers
  uid: z.string(),
  memberId: z.string(),
  accountType: accountTypeSchema,

  // Basic information
  avatar: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  title: z.string(),

  // Contact information
  primaryPhone: z.string(),
  secondaryPhone: z.string().optional(),
  address: z.string(),

  // Personal details
  gender: genderSchema,
  dob: z.string(), // ISO date string

  // Church information
  position: z.array(z.string()).optional(),
  department: z.array(departmentSchema).optional(),
  band: z.array(bandSchema).optional(),
  ministry: z.array(ministrySchema).optional(),

  // Dates
  joinDate: z.string(), // ISO date string
  memberSince: z.string(), // ISO date string
  createdAt: z.string(), // ISO date string

  // Status and verification
  status: statusSchema,
  verified: z.boolean(),
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),

  // Authentication
  authType: authTypeSchema,
  hasPassword: z.boolean().optional(),
});
