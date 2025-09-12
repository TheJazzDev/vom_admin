import { IconTrash, IconX, IconLoader2 } from '@tabler/icons-react';
import { useState } from 'react';
import type { Control } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBands } from '@/hooks/useBands';

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
  const { data, isLoading } = useBands();

  const bandList = (data ?? [])
    .filter((band) => band.id !== 'CHOIR' && band.id !== 'UNASSIGNED')
    .map((band) => ({
      label: band.name,
      value: band.id,
    }));

  return (
    <FormField
      control={control}
      name='officiating.band'
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

        const isDisabled = isLoading || disabled || data?.length === 0 || currentValues.length >= 2;

        return (
          <FormItem>
            <FormLabel>
              Officiating Bands{' '}
              {required && <span className='text-red-500'>*</span>}
            </FormLabel>
            <div className="space-y-2">
              {/* Display area for selected bands */}
              <div className={`flex items-center justify-between w-full border rounded-md px-3 py-2 min-h-[40px] ${
                isDisabled && !isLoading
                  ? 'bg-muted/50 border-muted cursor-not-allowed text-muted-foreground'
                  : 'bg-background'
              }`}>
                <div className="flex-1 flex items-center gap-2 flex-wrap">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <IconLoader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Loading bands...
                      </span>
                    </div>
                  ) : currentValues.length > 0 ? (
                    <>
                      {currentValues.map((val, index) => {
                        const band = bandList.find((b) => b.value === val);
                        return (
                          <Badge
                            key={val}
                            variant='secondary'
                            className={`text-xs h-6 ${
                              isDisabled ? 'opacity-50' : ''
                            }`}>
                            {band ? band.label : val}
                            <button
                              type='button'
                              disabled={isLoading || disabled}
                              onClick={() => handleRemoveItem(index)}
                              className={`ml-1 ${
                                isLoading || disabled ? 'cursor-not-allowed' : ''
                              }`}>
                              <IconX
                                className={`h-3 w-3 ${
                                  isLoading || disabled
                                    ? 'text-muted-foreground cursor-not-allowed'
                                    : 'cursor-pointer hover:text-red-500'
                                }`}
                              />
                            </button>
                          </Badge>
                        );
                      })}
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {currentValues.length >= 2
                        ? "Maximum 2 bands selected"
                        : "Select officiating bands"
                      }
                    </span>
                  )}
                </div>

                {currentValues.length > 0 && !isLoading && (
                  <Button
                    size='sm'
                    type='button'
                    variant='ghost'
                    disabled={isLoading || disabled}
                    onClick={handleClearAll}
                    className={`h-6 px-2 text-xs ml-2 shrink-0 ${
                      isLoading || disabled
                        ? 'text-muted-foreground cursor-not-allowed opacity-50'
                        : 'text-muted-foreground hover:text-red-500'
                    }`}>
                    <IconTrash className='h-3 w-3' />
                  </Button>
                )}
              </div>

              {/* Select dropdown for adding bands */}
              <Select key={selectKey} onValueChange={handleAddItem}>
                <SelectTrigger
                  disabled={isDisabled}
                  className='w-full cursor-pointer'>
                  <SelectValue placeholder={
                    currentValues.length >= 2
                      ? "Maximum 2 bands allowed"
                      : "Add band"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">Loading bands...</span>
                    </div>
                  ) : currentValues.length >= 2 ? (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      Maximum of 2 bands can be selected
                    </div>
                  ) : bandList.filter((option) => !currentValues.includes(option.value)).length === 0 ? (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      {currentValues.length === bandList.length
                        ? "All bands selected"
                        : "No bands available"
                      }
                    </div>
                  ) : (
                    bandList
                      .filter((option) => !currentValues.includes(option.value))
                      .map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))
                  )}
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