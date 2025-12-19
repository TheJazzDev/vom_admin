"use client";

import { useSearchParams } from "next/navigation";
import ShilohProgrammeForm from "./ShilohForm";
import SundayProgrammeForm from "./SundayForm";
import VigilProgrammeForm from "./VigilForm";

const CreateProgramme = () => {
  const searchParams = useSearchParams().get("type");

  return (
    <div className="mt-6">
      {searchParams === "sunday" && <SundayProgrammeForm type="sunday" />}
      {searchParams === "shiloh" && <ShilohProgrammeForm type="shilo" />}
      {searchParams === "vigil" && <VigilProgrammeForm type="vigil" />}
    </div>
  );
};

export default CreateProgramme;
