import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ArrayInputProps {
  value?: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const ArrayInput = ({
  value = [],
  onChange,
  onBlur,
  placeholder,
  disabled = false,
}: ArrayInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addItem = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setInputValue("");
    }
  };

  const removeItem = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newArray = [...value];
    const [movedItem] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, movedItem);
    onChange(newArray);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  const handleInputBlur = () => {
    // Add current input value if it exists when input loses focus
    if (inputValue.trim()) {
      addItem();
    }
    onBlur?.();
  };

  return (
    <div className="flex flex-col lg:flex-row lg:gap-6 space-y-3 lg:space-y-0">
      {/* Input section */}
      <div className="flex flex-col space- lg:w-1/2">
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            disabled={disabled}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            disabled={
              disabled ||
              !inputValue.trim() ||
              value.includes(inputValue.trim())
            }
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Helper text */}
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {inputValue.trim() && value.includes(inputValue.trim()) && (
              <span className="text-amber-500">This hymn is already added</span>
            )}
          </div>
          {value.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange([])}
              disabled={disabled}
              className="text-xs text-red-500 hover:text-red-700 h-auto p-1"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Display section */}
      <div className="lg:w-1/2">
        {value.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Added hymns ({value.length}):
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-muted/20">
              {value.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-2 bg-background rounded border"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                      {index + 1}
                    </span>
                    <span className="text-sm flex-1">{item}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Move up button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveItem(index, index - 1)}
                      disabled={disabled || index === 0}
                      className="h-6 w-6 p-0"
                    >
                      ↑
                    </Button>

                    {/* Move down button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveItem(index, index + 1)}
                      disabled={disabled || index === value.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      ↓
                    </Button>

                    {/* Remove button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={disabled}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
