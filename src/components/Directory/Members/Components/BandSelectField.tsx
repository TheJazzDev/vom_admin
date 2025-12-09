// FILE: components/Directory/Members/Components/BandSelectField.tsx
// Simplified version - New members can only be assigned as "Member" role

import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";
import type { Control } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BandKeysEnum } from "@/enums";

interface BandSelectFieldProps {
  control: Control<CreateMemberData>;
  disabled?: boolean;
  required?: boolean;
}

export const BandSelectField = ({
  control,
  disabled = false,
  required = false,
}: BandSelectFieldProps) => {
  const [selectedBandName, setSelectedBandName] = useState<BandKeys | "">("");

  const isBandDataArray = (value: any): value is BandData[] => {
    return (
      Array.isArray(value) &&
      (value.length === 0 ||
        (typeof value[0] === "object" &&
          "name" in value[0] &&
          "role" in value[0]))
    );
  };

  return (
    <FormField
      control={control}
      name="band"
      render={({ field }) => {
        const currentBands: BandData[] = isBandDataArray(field.value)
          ? field.value
          : [];

        const handleAddBand = () => {
          if (selectedBandName) {
            const bandExists = currentBands.some(
              (band: BandData) => band.name === selectedBandName,
            );

            if (!bandExists) {
              const newBand: BandData = {
                name: selectedBandName,
                role: "Member",
              };
              const updatedBands = [...currentBands, newBand];
              field.onChange(updatedBands);

              setTimeout(() => {
                field.onBlur();
              }, 0);

              setSelectedBandName("");
            }
          }
        };

        const handleRemoveBand = (indexToRemove: number) => {
          const newValue = currentBands.filter((_, i) => i !== indexToRemove);
          field.onChange(newValue);

          setTimeout(() => {
            field.onBlur();
          }, 0);
        };

        const handleClearAllBands = () => {
          field.onChange([]);

          setTimeout(() => {
            field.onBlur();
          }, 0);
        };

        return (
          <FormItem>
            <p className="text-sm font-medium">
              Band {required && <span className="text-red-500">*</span>}
            </p>
            <div className="space-y-2">
              {/* Display current bands */}
              <div
                className={`flex flex-wrap gap-2 min-h-[42px] p-2 border rounded-md relative ${
                  disabled ? "bg-muted/50 border-muted cursor-not-allowed" : ""
                }`}
              >
                {currentBands.length > 0 ? (
                  <>
                    {currentBands.map((band: BandData, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={`text-xs ${disabled ? "opacity-50" : ""}`}
                      >
                        {band.name}
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => handleRemoveBand(index)}
                          className={`ml-2 ${
                            disabled ? "cursor-not-allowed" : ""
                          }`}
                        >
                          <IconX
                            className={`h-3 w-3 ${
                              disabled
                                ? "text-muted-foreground cursor-not-allowed"
                                : "cursor-pointer hover:text-red-500"
                            }`}
                          />
                        </button>
                      </Badge>
                    ))}
                    <Button
                      size="sm"
                      type="button"
                      variant="ghost"
                      disabled={disabled}
                      onClick={handleClearAllBands}
                      className={`h-6 px-2 text-xs absolute top-1 right-1 ${
                        disabled
                          ? "text-muted-foreground cursor-not-allowed opacity-50"
                          : "text-muted-foreground hover:text-red-500"
                      }`}
                    >
                      <IconTrash className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <span
                    className={`text-sm ${
                      disabled
                        ? "text-muted-foreground/50"
                        : "text-muted-foreground"
                    }`}
                  >
                    No bands selected
                  </span>
                )}
              </div>

              {/* Band selection form - Only band name, role is always "Member" */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1 block">
                    Select Band
                  </p>
                  <Select
                    value={selectedBandName}
                    onValueChange={(value: BandKeys) => {
                      setSelectedBandName(value);
                    }}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select band to add" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(BandKeysEnum)
                        .filter(
                          (bandKey) =>
                            bandKey !== BandKeysEnum.UNASSIGNED &&
                            !currentBands.some(
                              (band: BandData) => band.name === bandKey,
                            ),
                        )
                        .map((bandKey) => (
                          <SelectItem key={bandKey} value={bandKey}>
                            {bandKey}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  size="sm"
                  disabled={disabled || !selectedBandName}
                  onClick={handleAddBand}
                  className="h-10"
                >
                  <IconPlus className="h-4 w-4 mr-1" />
                  Add as Member
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                New members are automatically assigned as "Member" role
              </p>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
