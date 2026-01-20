import { PermissionGuard } from "@/components/Guards/PermissionGuard";
import { DraftProgrammesPage } from "@/components/Programme";
import { ActionEnum, ResourceEnum } from "@/enums";

export const metadata = {
  title: "VOM - Drafts Programme",
};

export default function Page() {
  return (
    <PermissionGuard
      resource={ResourceEnum.PROGRAMMES}
      action={ActionEnum.VIEW}
    >
      <DraftProgrammesPage />
    </PermissionGuard>
  );
}
