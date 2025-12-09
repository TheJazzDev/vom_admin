import { IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";
import type { Control } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bandList } from "../constants/bandList";
import { getFilteredBands } from "../Utils/filterBand";

interface SelectOfficiatingBands {
  control: Control<SundayProgrammeProps>;
  required?: boolean;
  disabled?: boolean;
}

export const SelectOfficiatingBands = ({
  control,
  disabled = false,
  required = false,
}: SelectOfficiatingBands) => {
  const [selectKey, setSelectKey] = useState(0);

  return (
    <FormField
      control={control}
      name="officiating.band"
      render={({ field }) => {
        const currentValues: string[] = Array.isArray(field.value)
          ? (field.value as string[])
          : [];

        const handleRemoveItem = (indexToRemove: number) => {
          const newValue = currentValues.filter((_, i) => i !== indexToRemove);
          field.onChange(newValue);

          setTimeout(() => {
            field.onBlur();
          }, 0);
        };

        const handleClearAll = () => {
          field.onChange([]);

          setTimeout(() => {
            field.onBlur();
          }, 0);
        };

        const handleAddItem = (value: string) => {
          const trimmedValue = value.trim();
          if (trimmedValue && !currentValues.includes(trimmedValue)) {
            const updatedValues = [...currentValues, trimmedValue];
            field.onChange(updatedValues);

            setTimeout(() => {
              field.onBlur();
            }, 0);
          }
          setSelectKey((prev) => prev + 1);
        };

        const isDisabled = disabled || currentValues.length >= 2;

        return (
          <FormItem>
            <FormLabel>
              Officiating Bands{" "}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <div className="space-y-2 flex flex-row-reverse items-start gap-6">
              {/* Display area for selected bands */}
              <div
                className={`flex items-center justify-between border rounded-md px-2 py-2 flex-1 -mt-0.5 ${
                  isDisabled
                    ? "bg-muted/50 border-muted cursor-not-allowed text-muted-foreground"
                    : "bg-transparent"
                }`}
              >
                <div className="flex-1 flex items-center gap-2 flex-wrap">
                  {currentValues.length > 0 ? (
                    currentValues.map((val, index) => {
                      const band = bandList.find((b) => b.value === val);
                      return (
                        <Badge
                          key={val}
                          variant="default"
                          className={`text-xs h-6 ${
                            isDisabled ? "opacity-50" : ""
                          }`}
                        >
                          {band ? band.label : val}
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => handleRemoveItem(index)}
                            className={`ml-1 ${
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
                      );
                    })
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {currentValues.length >= 2
                        ? "Maximum 2 bands selected"
                        : "Selected officiating bands will appear here"}
                    </span>
                  )}
                </div>

                {currentValues.length > 0 && (
                  <Button
                    size="sm"
                    type="button"
                    variant="ghost"
                    disabled={disabled}
                    onClick={handleClearAll}
                    className={`h-6 px-2 text-xs ml-2 shrink-0 ${
                      disabled
                        ? "text-muted-foreground cursor-not-allowed opacity-50"
                        : "text-muted-foreground hover:text-red-500"
                    }`}
                  >
                    <IconTrash className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Select dropdown for adding bands */}
              <div className="relative flex-1">
                <Select key={selectKey} onValueChange={handleAddItem}>
                  <SelectTrigger
                    disabled={isDisabled}
                    className="w-full cursor-pointer"
                  >
                    <SelectValue
                      placeholder={
                        currentValues.length >= 2
                          ? "Maximum 2 bands allowed"
                          : "Add band"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      const availableOptions = getFilteredBands(
                        currentValues,
                      ).filter(
                        (option) => !currentValues.includes(option.value),
                      );

                      if (availableOptions.length === 0) {
                        return (
                          <div className="py-4 text-center text-sm text-muted-foreground">
                            {currentValues.length === 0
                              ? "No bands available"
                              : "Selection limit reached"}
                          </div>
                        );
                      }

                      return availableOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
