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

        return (
          <FormItem>
            <FormLabel>
              Officiating Bands{" "}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <div className="space-y-2">
              <div
                className={`flex flex-wrap gap-1 min-h-[32px] p-2 border rounded-md relative ${
                  disabled ? "bg-muted/50 border-muted cursor-not-allowed" : ""
                }`}
              >
                {currentValues.length > 0 ? (
                  <>
                    {currentValues.map((item: string, index: number) => (
                      <Badge
                        key={index + 1}
                        variant="secondary"
                        className={`text-xs ${disabled ? "opacity-50" : ""}`}
                      >
                        {item}
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => handleRemoveItem(index)}
                          className={disabled ? "cursor-not-allowed" : ""}
                        >
                          <IconX
                            className={`ml-1 h-3 w-3 ${
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
                      onClick={handleClearAll}
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
                    No band selected
                  </span>
                )}
              </div>

              <div>
                {[""].length > 0 && (
                  <Select key={selectKey} onValueChange={handleAddItem}>
                    <SelectTrigger disabled={disabled} className="w-full">
                      <SelectValue placeholder="Select officiating bands" />
                    </SelectTrigger>
                    <SelectContent>
                      {[]
                        .filter((option) => !currentValues.includes(option))
                        .map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
