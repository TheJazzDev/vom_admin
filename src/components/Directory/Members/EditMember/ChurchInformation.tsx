import { IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";
import type { Control } from "react-hook-form";
import type z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { memberEditSchema } from "../Schemas/memberEditSchema";
import { BANDS, DEPARTMENTS, MINISTRIES, POSITIONS } from "./dropdowns";

type MemberEditForm = z.infer<typeof memberEditSchema>;

export const MultiSelectField = ({
  name,
  label,
  options,
  control,
  placeholder,
  required = false,
}: {
  name: keyof MemberEditForm;
  label: string;
  options: string[];
  placeholder: string;
  required?: boolean;
  control: Control<MemberEditForm>;
}) => {
  const [selectKey, setSelectKey] = useState(0);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const currentValues = Array.isArray(field.value) ? field.value : [];

        const handleRemoveItem = (indexToRemove: number) => {
          const newValue = currentValues.filter((_, i) => i !== indexToRemove);
          field.onChange(newValue);
        };

        const handleClearAll = () => {
          field.onChange([]);
        };

        const handleAddItem = (value: string) => {
          if (!currentValues.includes(value)) {
            field.onChange([...currentValues, value]);
          }
          // Force Select to reset by changing key
          setSelectKey((prev) => prev + 1);
        };

        return (
          <FormItem>
            <FormLabel>
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <div className="space-y-2">
              {/* Display selected items as badges */}
              <div className="flex flex-wrap gap-1 min-h-[32px] p-2 border rounded-md relative">
                {currentValues.length > 0 ? (
                  <>
                    <>
                      {/* //biome-ignore lint/suspicious/noArrayIndexKey: ignore */}
                      {currentValues.map((item, index) => (
                        <Badge
                          //biome-ignore lint/suspicious/noArrayIndexKey: ignore
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {item}
                          <button
                            type="button"
                            //biome-ignore lint/suspicious/noArrayIndexKey: ignore
                            onClick={() => handleRemoveItem(index)}
                          >
                            <IconX className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500" />
                          </button>
                        </Badge>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-muted-foreground hover:text-red-500 absolute top-1 right-1"
                        onClick={handleClearAll}
                      >
                        <IconTrash className="h-3 w-3" />
                      </Button>
                    </>
                    {/* //biome-ignore lint/suspicious/noArrayIndexKey: ignore */}
                    {currentValues.map((item, index) => (
                      <Badge
                        //biome-ignore lint/suspicious/noArrayIndexKey: ignore
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {item}
                        <button
                          type="button"
                          //biome-ignore lint/suspicious/noArrayIndexKey: ignore
                          onClick={() => handleRemoveItem(index)}
                        >
                          <IconX className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500" />
                        </button>
                      </Badge>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-red-500 absolute top-1 right-1"
                      onClick={handleClearAll}
                    >
                      <IconTrash className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    No {label.toLowerCase()} selected
                  </span>
                )}
              </div>

              {/* Dropdown to add new items */}
              <Select
                key={selectKey} // This forces the Select to reset
                onValueChange={handleAddItem}
              >
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options
                    .filter((option) => !currentValues.includes(option))
                    .map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

const ChurchInformation = ({ control }: { control: any }) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold text-blue-500">
        Church Information
      </Label>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MultiSelectField
          control={control}
          name="position"
          label="Positions"
          options={POSITIONS}
          placeholder="Add a position (optional)"
        />

        <MultiSelectField
          control={control}
          name="department"
          label="Departments"
          options={DEPARTMENTS}
          placeholder="Add a department (optional)"
        />

        <MultiSelectField
          control={control}
          name="band"
          label="Bands"
          options={BANDS}
          placeholder="Add a band (optional)"
        />

        <MultiSelectField
          control={control}
          name="ministry"
          label="Ministries"
          options={MINISTRIES}
          placeholder="Add a ministry (optional)"
        />
      </div>
    </div>
  );
};

export default ChurchInformation;
