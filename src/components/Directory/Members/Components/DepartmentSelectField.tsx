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
import { DepartmentKeysEnum } from "@/enums";

interface DepartmentSelectFieldProps {
  control: Control<CreateMemberData>;
  disabled?: boolean;
  required?: boolean;
}

export const DepartmentSelectField = ({
  control,
  disabled = false,
  required = false,
}: DepartmentSelectFieldProps) => {
  const [selectedDepartmentName, setSelectedDepartmentName] = useState<
    DepartmentKeys | ""
  >("");

  const isDepartmentDataArray = (value: any): value is DepartmentData[] => {
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
      name="department"
      render={({ field }) => {
        const currentDepartments: DepartmentData[] = isDepartmentDataArray(
          field.value,
        )
          ? field.value
          : [];

        const handleAddDepartment = () => {
          if (selectedDepartmentName) {
            const departmentExists = currentDepartments.some(
              (dept: DepartmentData) => dept.name === selectedDepartmentName,
            );

            if (!departmentExists) {
              // Always assign "Member" role for new members
              const newDepartment: DepartmentData = {
                name: selectedDepartmentName,
                role: "Member",
              };
              const updatedDepartments = [...currentDepartments, newDepartment];
              field.onChange(updatedDepartments);

              setTimeout(() => {
                field.onBlur();
              }, 0);

              setSelectedDepartmentName("");
            }
          }
        };

        const handleRemoveDepartment = (indexToRemove: number) => {
          const newValue = currentDepartments.filter(
            (_, i) => i !== indexToRemove,
          );
          field.onChange(newValue);

          setTimeout(() => {
            field.onBlur();
          }, 0);
        };

        const handleClearAllDepartments = () => {
          field.onChange([]);

          setTimeout(() => {
            field.onBlur();
          }, 0);
        };

        return (
          <FormItem>
            <p className="text-sm font-medium">
              Department {required && <span className="text-red-500">*</span>}
            </p>
            <div className="space-y-2">
              {/* Display current departments */}
              <div
                className={`flex flex-wrap gap-2 min-h-[42px] p-2 border-b rounded-md relative ${
                  disabled ? "bg-muted/50 border-muted cursor-not-allowed" : ""
                }`}
              >
                {currentDepartments.length > 0 ? (
                  <>
                    {currentDepartments.map(
                      (dept: DepartmentData, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className={`text-xs ${disabled ? "opacity-50" : ""}`}
                        >
                          {dept.name}
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => handleRemoveDepartment(index)}
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
                      ),
                    )}
                    <Button
                      size="sm"
                      type="button"
                      variant="ghost"
                      disabled={disabled}
                      onClick={handleClearAllDepartments}
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
                    No departments selected
                  </span>
                )}
              </div>

              {/* Department selection form - Only department name, role is always "Member" */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1 block">
                    Select Department
                  </p>
                  <Select
                    value={selectedDepartmentName}
                    onValueChange={(value: DepartmentKeys) => {
                      setSelectedDepartmentName(value);
                    }}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department to add" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(DepartmentKeysEnum)
                        .filter(
                          (deptKey) =>
                            !currentDepartments.some(
                              (dept: DepartmentData) => dept.name === deptKey,
                            ),
                        )
                        .map((deptKey) => (
                          <SelectItem key={deptKey} value={deptKey}>
                            {deptKey}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  size="sm"
                  disabled={disabled || !selectedDepartmentName}
                  onClick={handleAddDepartment}
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
