import MembersPage from "@/components/Directory/Members/MemberPage";
import { PermissionGuard } from "@/components/Guards/PermissionGuard";
import { ActionEnum, ResourceEnum } from "@/enums";

export const metadata = {
  title: "VOM - Members",
};

export default function Page() {
  return (
    <PermissionGuard resource={ResourceEnum.MEMBERS} action={ActionEnum.VIEW}>
      <MembersPage />
    </PermissionGuard>
  );
}
