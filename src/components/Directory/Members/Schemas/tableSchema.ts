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
  id: z.string(),
  accountType: accountTypeSchema,

  // Basic information
  avatar: z.string().optional(),
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
  email: z.string().email(),
  title: z.string(),

  // Contact information
  primaryPhone: z.string(),
  secondaryPhone: z.string().optional(),
  address: z.string(),

  // Personal details
  gender: genderSchema,
  dob: z.string(),
  occupation: z.string().optional(),
  maritalStatus: z.string().optional(),

  // Church information
  joinDate: z.string(),
  position: z.array(z.string()).optional(),
  department: z.array(departmentSchema).optional(),
  band: z.array(bandSchema).optional(),
  ministry: z.array(ministrySchema).optional(),

  // Status and verification
  createdAt: z.string(),
  status: statusSchema,
  verified: z.boolean(),
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),

  // Authentication
  authType: authTypeSchema,
  hasPassword: z.boolean().optional(),
});
