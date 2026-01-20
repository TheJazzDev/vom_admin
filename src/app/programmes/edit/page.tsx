import { Suspense } from "react";
import { PermissionGuard } from "@/components/Guards/PermissionGuard";
import { Edit } from "@/components/Programme";
import { ActionEnum, ResourceEnum } from "@/enums";

export const metadata = {
  title: "VOM - Edit Programme",
};

export default function Page() {
  return (
    <PermissionGuard
      resource={ResourceEnum.PROGRAMMES}
      action={ActionEnum.EDIT}
    >
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <Edit />
      </Suspense>
    </PermissionGuard>
  );
}
