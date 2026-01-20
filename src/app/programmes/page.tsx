import { PermissionGuard } from "@/components/Guards/PermissionGuard";
import ProgrammeDashboard from "@/components/Programme/pages/Programme";
import { ActionEnum, ResourceEnum } from "@/enums";

export const metadata = {
  title: "VOM - Programme",
};

export default function Page() {
  return (
    <PermissionGuard
      resource={ResourceEnum.PROGRAMMES}
      action={ActionEnum.VIEW}
    >
      <ProgrammeDashboard />
    </PermissionGuard>
  );
}
