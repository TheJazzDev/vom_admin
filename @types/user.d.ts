import { userSchema } from "@/components/Directory/Members/Schemas/tableSchema";

declare global {
  type Gender = "male" | "female";
  type AuthType = "" | "email" | "phone";
  type AccountType = "member" | "guest";
  type Role = "user" | "admin" | "super_admin";
  type MaritalStatus =
    | "single"
    | "married"
    | "divorced"
    | "widowed"
    | "separated";

  type Ministry = "Children Ministry" | "Youth Fellowship";

  type UserProfile = z.infer<typeof userSchema>;
}
