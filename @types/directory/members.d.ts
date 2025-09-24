import { createMemberSchema } from "@/components/Directory/Members/Schemas/createMemberSchema";
import { memberEditSchema } from "@/components/Directory/Members/Schemas/memberEditSchema";

declare global {
  type Department =
    | "Interpretation"
    | "Programme"
    | "Media"
    | "Treasury"
    | "Technical"
    | "Drama"
    | "IT"
    | "Envagicialism"
    | "Sanitation";

  type Ministry = "Children Ministry" | "Youth Fellowship";

  type MemberEditForm = z.infer<typeof memberEditSchema>;

  type CreateMemberData = z.infer<typeof createMemberSchema>;
}
