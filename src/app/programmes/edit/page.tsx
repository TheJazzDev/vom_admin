import { Suspense } from "react";
import { Edit } from "@/components/Programme";

export const metadata = {
  title: "VOM - Edit Programme",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <Edit />
    </Suspense>
  );
}
