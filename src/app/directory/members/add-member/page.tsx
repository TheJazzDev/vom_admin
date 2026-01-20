import CreateMemberPage from "@/components/Directory/Members/Create";
import { PermissionGuard } from "@/components/Guards/PermissionGuard";
import { ActionEnum, ResourceEnum } from "@/enums";

export const metadata = {
  title: "VOM - Member Create",
};

export default function MembersPage() {
  return (
    <PermissionGuard resource={ResourceEnum.MEMBERS} action={ActionEnum.CREATE}>
      <CreateMemberPage />
    </PermissionGuard>
  );
}
