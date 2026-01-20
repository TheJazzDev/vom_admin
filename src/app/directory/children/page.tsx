import { Suspense } from "react";
import { ChildrenList } from "@/components/Directory/Children";
import { PermissionGuard } from "@/components/Guards/PermissionGuard";
import { ActionEnum, ResourceEnum } from "@/enums";

export const metadata = {
  title: "VOM - Children Directory",
};

export default function ChildrenPage() {
  return (
    <PermissionGuard resource={ResourceEnum.MEMBERS} action={ActionEnum.VIEW}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Children Directory
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage children and youth records
          </p>
        </div>
        <Suspense fallback={<div className="p-6">Loading children...</div>}>
          <ChildrenList />
        </Suspense>
      </div>
    </PermissionGuard>
  );
}
