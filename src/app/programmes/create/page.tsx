import { Suspense } from "react";
import { PermissionGuard } from "@/components/Guards/PermissionGuard";
import { CreateProgramme } from "@/components/Programme";
import { ActionEnum, ResourceEnum } from "@/enums";

export const metadata = {
  title: "VOM - Create Programme",
};

export default function Page() {
  return (
    <PermissionGuard
      resource={ResourceEnum.PROGRAMMES}
      action={ActionEnum.CREATE}
    >
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <CreateProgramme />
      </Suspense>
    </PermissionGuard>
  );
}
