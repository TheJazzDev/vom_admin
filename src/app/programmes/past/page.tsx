import { PermissionGuard } from "@/components/Guards/PermissionGuard";
import { PastProgrammesPage } from "@/components/Programme";
import { ActionEnum, ResourceEnum } from "@/enums";

export const metadata = {
  title: "VOM - Past Programme",
};

export default function Page() {
  return (
    <PermissionGuard
      resource={ResourceEnum.PROGRAMMES}
      action={ActionEnum.VIEW}
    >
      <PastProgrammesPage />
    </PermissionGuard>
  );
}
