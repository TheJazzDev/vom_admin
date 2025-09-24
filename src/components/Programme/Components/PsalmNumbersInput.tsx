import { Input } from "@/components/ui/input";

interface PsalmNumbersInputProps {
  value?: number[];
  onChange: (value: number[]) => void;
  onBlur?: () => void;
  disabled?: boolean;
}

export const PsalmNumbersInput = ({
  value = [],
  onChange,
  onBlur,
  disabled = false,
}: PsalmNumbersInputProps) => {
  const normalizedValue = [value[0] ?? 0, value[1] ?? 0, value[2] ?? 0];

  const handleInputChange = (index: number, inputValue: string) => {
    const newValue = [...normalizedValue];

    if (inputValue === "") {
      newValue[index] = 0;
    } else {
      const numValue = parseInt(inputValue, 10);
      if (!Number.isNaN(numValue) && numValue >= 1 && numValue <= 150) {
        newValue[index] = numValue;
      } else {
        // Don't update if invalid - keeps the old value
        return;
      }
    }

    onChange(newValue);
  };

  const formatDisplayValue = (val: number) => {
    return val === 0 ? "" : val.toString();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">Psalm</div>

        <div className="flex items-center justify-between gap-2 flex-1">
          <Input
            type="number"
            min="1"
            max="150"
            value={formatDisplayValue(normalizedValue[0])}
            onChange={(e) => handleInputChange(0, e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            className="text-center"
            placeholder="51"
          />

          <span className="text-muted-foreground">,</span>

          <Input
            type="number"
            min="1"
            max="150"
            value={formatDisplayValue(normalizedValue[1])}
            onChange={(e) => handleInputChange(1, e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            className="text-center"
            placeholder="19"
          />

          <span className="text-muted-foreground">&</span>

          <Input
            type="number"
            min="1"
            max="150"
            value={formatDisplayValue(normalizedValue[2])}
            onChange={(e) => handleInputChange(2, e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            className="text-center"
            placeholder="24"
          />
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Preview: Psalm{" "}
        {normalizedValue
          .filter((v) => v > 0)
          .join(", ")
          .replace(/,([^,]*)$/, " &$1")}
      </div>
    </div>
  );
};
