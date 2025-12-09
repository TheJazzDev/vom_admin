import { type Control, useWatch } from "react-hook-form";
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
import { useBandsWithMembers } from "@/hooks/useBands";
import { officiatingFields } from "../constants/officiatingFields";
import { convertBandsToOptions } from "../Utils/convertBandsToOptions";

export const SelectMemberField = ({
  control,
  name,
  label,
}: {
  control: Control;
  name: string;
  label: string;
}) => {
  const officiatingBands = useWatch({
    control,
    name: "officiating.band",
  });

  const allOfficiatingMembers = useWatch({
    control,
    name: "officiating",
  });

  const { data, isLoading } = useBandsWithMembers(
    officiatingBands as BandKeys[],
  );

  const membersList = convertBandsToOptions(data ?? []);

  const disabled = isLoading || officiatingBands.length === 0;

  const getSelectedMembers = (currentFieldName: string) => {
    if (!allOfficiatingMembers) return [];

    const selectedMembers: string[] = [];

    officiatingFields.forEach((fieldName) => {
      const fieldValue = allOfficiatingMembers[fieldName];

      if (fieldName !== currentFieldName.split(".").pop() && fieldValue) {
        selectedMembers.push(fieldValue);
      }
    });

    return selectedMembers;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedMembers = getSelectedMembers(name);

        const _availableOptions = membersList.filter(
          (option) => !selectedMembers.includes(option.value),
        );

        return (
          <FormItem>
            <FormLabel
              className={`${
                disabled
                  ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : ""
              }`}
            >
              {label} <span className="text-red-500">*</span>
            </FormLabel>
            <div className="relative">
              <Select
                disabled={disabled}
                value={field.value || ""}
                onValueChange={(val) =>
                  field.onChange(val === "__CLEAR__" ? "" : val)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.value && (
                    <SelectItem value="__CLEAR__">
                      <span className="text-gray-500">Clear selection</span>
                    </SelectItem>
                  )}
                  {_availableOptions.map((option, index) => (
                    <SelectItem
                      key={`${option.value}+${index}`}
                      value={option.value}
                    >
                      {option.label}
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
