import { PermissionGuard } from "@/components/Guards/PermissionGuard";
import { UpcomingProgrammesPage } from "@/components/Programme";
import { ActionEnum, ResourceEnum } from "@/enums";

export const metadata = {
  title: "VOM - Upcoming Programme",
};

export default function Page() {
  return (
    <PermissionGuard
      resource={ResourceEnum.PROGRAMMES}
      action={ActionEnum.VIEW}
    >
      <UpcomingProgrammesPage />
    </PermissionGuard>
  );
}
