import DirectoryPage from "@/components/Directory/Directory";
import { PermissionGuard } from "@/components/Guards/PermissionGuard";
import { ActionEnum, ResourceEnum } from "@/enums";

export const metadata = {
  title: "VOM - Directory",
};

export default function Page() {
  return (
    <PermissionGuard resource={ResourceEnum.MEMBERS} action={ActionEnum.VIEW}>
      <DirectoryPage />
    </PermissionGuard>
  );
}
