import { IconTrash, IconX } from "@tabler/icons-react";
import { type KeyboardEvent, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { memberEditSchema } from "../Schemas/memberEditSchema";
import { DEPARTMENTS, MINISTRIES, POSITIONS } from "../utils/dropdowns";

// Define the types for your dropdown data
interface Department {
  // Add properties based on your actual Department type
  id?: string;
  name: string;
}

interface Ministry {
  // Add properties based on your actual Ministry type
  id?: string;
  name: string;
  // Add other properties as needed
}

type MemberEditForm = z.infer<typeof memberEditSchema>;
type AllowedKeys = "department" | "ministry" | "position";

interface HybridMultiSelectFieldProps {
  name: AllowedKeys;
  control: Control<MemberEditForm>;
  required?: boolean;
  disabled?: boolean;
  allowCustomInput?: boolean;
}

export const HybridMultiSelectField = ({
  name,
  control,
  disabled = false,
  required = false,
  allowCustomInput = false,
}: HybridMultiSelectFieldProps) => {
  const [selectKey, setSelectKey] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const getFieldConfig: Record<
    AllowedKeys,
    {
      options: string[] | Department[] | Ministry[];
      inputPlaceholder: string;
      selectPlaceholder: string;
    }
  > = {
    department: {
      options: DEPARTMENTS,
      inputPlaceholder: "Type custom department",
      selectPlaceholder: "Or select preset department",
    },
    ministry: {
      options: MINISTRIES,
      inputPlaceholder: "Type custom ministry",
      selectPlaceholder: "Or select preset ministry",
    },
    position: {
      options: POSITIONS,
      inputPlaceholder: "Type custom position",
      selectPlaceholder: "Or select preset position",
    },
  };

  const fieldConfig = getFieldConfig[name];

  // Helper function to get string value from option
  const getOptionValue = (option: string | Department | Ministry): string => {
    if (typeof option === "string") {
      return option;
    }
    return option.name; // Assuming objects have a 'name' property
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const currentValues: string[] = Array.isArray(field.value)
          ? (field.value as string[])
          : [];

        const handleRemoveItem = (indexToRemove: number) => {
          const newValue = currentValues.filter((_, i) => i !== indexToRemove);
          field.onChange(newValue);

          // Trigger validation after updating
          setTimeout(() => {
            field.onBlur();
          }, 0);
        };

        const handleClearAll = () => {
          field.onChange([]);

          // Trigger validation after updating
          setTimeout(() => {
            field.onBlur();
          }, 0);
        };

        const handleAddItem = (value: string) => {
          const trimmedValue = value.trim();
          if (trimmedValue && !currentValues.includes(trimmedValue)) {
            const updatedValues = [...currentValues, trimmedValue];
            field.onChange(updatedValues);

            // Trigger validation after updating
            setTimeout(() => {
              field.onBlur();
            }, 0);
          }
          setSelectKey((prev) => prev + 1);
        };

        const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const trimmedValue = inputValue.trim();
            if (trimmedValue && !currentValues.includes(trimmedValue)) {
              const updatedValues = [...currentValues, trimmedValue];
              field.onChange(updatedValues);

              // Trigger validation after updating
              setTimeout(() => {
                field.onBlur();
              }, 0);

              setInputValue("");
            }
          }
        };

        return (
          <FormItem>
            <FormLabel className="capitalize">
              {name} {required && <span className="text-red-500">*</span>}
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
                        key={index}
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
                    No {name} selected
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {fieldConfig.options.length > 0 && (
                  <Select key={selectKey} onValueChange={handleAddItem}>
                    <SelectTrigger disabled={disabled} className="w-full">
                      <SelectValue
                        placeholder={fieldConfig.selectPlaceholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldConfig.options
                        .filter((option) => {
                          const optionValue = getOptionValue(option);
                          return !currentValues.includes(optionValue);
                        })
                        .map((option) => {
                          const optionValue = getOptionValue(option);
                          return (
                            <SelectItem key={optionValue} value={optionValue}>
                              {optionValue}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                )}

                {allowCustomInput && (
                  <Input
                    value={inputValue}
                    className="col-span-1"
                    disabled={disabled}
                    onKeyDown={handleKeyPress}
                    placeholder={fieldConfig.inputPlaceholder}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
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
