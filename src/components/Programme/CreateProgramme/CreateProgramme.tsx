"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ShilohProgrammeForm from "./ShilohForm";
import SundayProgrammeForm from "./SundaryForm";
import VigilProgrammeForm from "./VigilForm";

const CreateProgramme = () => {
  const [type, setType] = useState<ProgrammeType>("sunday");

  return (
    <div className="space-y-8">
      <div className="py-4 space-y-8 sticky top-0 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Create New Programme
        </h2>
      </div>
      <div className="flex justify-between items-center">
        <p className="capitalize text-lg font-semibold">
          {type} Service Details
        </p>
        <div className="flex gap-4">
          <Label htmlFor="type" className="font-semibold">
            Type
          </Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as ProgrammeType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select programme type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sunday">Sunday Programme</SelectItem>
              <SelectItem value="shilo">Shilo Programme</SelectItem>
              <SelectItem value="vigil">Vigil Programme</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {type === "sunday" && <SundayProgrammeForm />}
        {type === "shilo" && <ShilohProgrammeForm />}
        {type === "vigil" && <VigilProgrammeForm />}
      </div>
    </div>
  );
};

export default CreateProgramme;
