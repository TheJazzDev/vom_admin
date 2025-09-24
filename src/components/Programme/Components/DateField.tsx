"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DAY_CONFIGS, type DayConfig } from "../constants/dataConfig";

interface DateFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  dayType?: DayType;
  customLabel?: string;
  customConfig?: Partial<DayConfig>;
  disabled?: boolean;
  required?: boolean;
}

export default function DateField<T extends FieldValues>({
  control,
  name,
  dayType = "any",
  customLabel,
  customConfig,
  disabled = false,
  required = false,
}: DateFieldProps<T>) {
  const [open, setOpen] = useState(false);

  // Get configuration based on day type
  const config = {
    ...DAY_CONFIGS[dayType],
    ...customConfig,
  };

  const label = customLabel || config.label;

  // Get current date for calculations
  const today = new Date();
  const currentYear = today.getFullYear();

  // Function to check if date should be disabled
  const isDateDisabled = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Disable past dates
    if (date < now) return true;

    // If dayNumber is specified, check restrictions
    if (config.dayNumber !== undefined) {
      const dayOfWeek = date.getDay();

      // Handle array of allowed days (weekdays, weekends)
      if (Array.isArray(config.dayNumber)) {
        return !config.dayNumber.includes(dayOfWeek);
      }

      // Handle single day restriction
      return dayOfWeek !== config.dayNumber;
    }

    // For "any" day type, don't disable any future dates
    return false;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span>{format(field.value, "PPP")}</span>
                      <span
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded",
                          config.badgeColor,
                        )}
                      >
                        {config.badgeText}
                      </span>
                    </div>
                  ) : (
                    <span>{config.placeholder}</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              {config.helpText && (
                <div className="p-3 border-b bg-muted/50">
                  <p className="text-xs text-muted-foreground">
                    {config.helpText}
                  </p>
                </div>
              )}
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(value) => {
                  field.onChange(value);
                  setOpen(false);
                }}
                disabled={isDateDisabled}
                captionLayout="dropdown"
                startMonth={new Date(currentYear, today.getMonth())}
                endMonth={new Date(currentYear + 2, 11)}
                className="p-3"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { type DayType, DAY_CONFIGS };
