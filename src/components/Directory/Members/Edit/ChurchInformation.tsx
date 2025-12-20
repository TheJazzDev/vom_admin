import type { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BandSelectField } from "../Components/BandSelectField";
import { DepartmentSelectField } from "../Components/DepartmentSelectField";
import { HybridMultiSelectField } from "../Components/HybridMultiSelectField";

const ChurchInformation = ({
  control,
}: {
  control: Control<MemberEditForm>;
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold text-blue-500">
        Church Information
      </Label>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <DepartmentSelectField control={control} />
        <HybridMultiSelectField control={control} name="ministry" />
        <FormField
          control={control}
          name="joinDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Join Date <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., May 2023" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <BandSelectField control={control} />
      </div>
    </div>
  );
};

export default ChurchInformation;
