"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ShilohProgrammeForm from "../CreateProgramme/ShilohForm";
import SundayProgrammeForm from "../CreateProgramme/SundayForm";
import VigilProgrammeForm from "../CreateProgramme/VigilForm";

const Edit = () => {
  const params = useSearchParams();
  const id = params.get("id");
  const type = params.get("type");

  // Ensure we have both id and type
  if (!id || !type) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-900 mb-2">
          Invalid Edit URL
        </h3>
        <p className="text-red-600">
          Programme ID and type are required for editing.
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading programme data...</div>}>
      {type === "sunday" && <SundayProgrammeForm type="sunday" />}
      {type === "shilo" && <ShilohProgrammeForm type="shilo" />}
      {type === "vigil" && <VigilProgrammeForm type="vigil" />}
    </Suspense>
  );
};

export default Edit;
