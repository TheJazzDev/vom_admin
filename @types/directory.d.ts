import { memberEditSchema } from "@/components/Directory/Members/Schemas/memberEditSchema";

declare global {
  type MemberEditForm = z.infer<typeof memberEditSchema>;
}
