import BandDetailsPage from "@/components/Directory/Bands/BandDetailsPage";
import { PermissionGuard } from "@/components/Guards/PermissionGuard";
import { ActionEnum, ResourceEnum } from "@/enums";

export const metadata = {
  title: "VOM - Bands Details",
};

export default function Page() {
  return (
    <PermissionGuard resource={ResourceEnum.BANDS} action={ActionEnum.VIEW}>
      <BandDetailsPage />
    </PermissionGuard>
  );
}
