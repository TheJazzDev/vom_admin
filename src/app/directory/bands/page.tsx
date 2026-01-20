import BandsPage from "@/components/Directory/Bands/BandsPage";
import { PermissionGuard } from "@/components/Guards/PermissionGuard";
import { ActionEnum, ResourceEnum } from "@/enums";

export const metadata = {
  title: "VOM - Bands",
};

export default function Page() {
  return (
    <PermissionGuard resource={ResourceEnum.BANDS} action={ActionEnum.VIEW}>
      <BandsPage />
    </PermissionGuard>
  );
}
