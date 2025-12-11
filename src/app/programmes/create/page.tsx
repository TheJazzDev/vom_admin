import { Suspense } from "react";
import { CreateProgramme } from "@/components/Programme";

export const metadata = {
  title: "VOM - Create Programme",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <CreateProgramme />
    </Suspense>
  );
}
