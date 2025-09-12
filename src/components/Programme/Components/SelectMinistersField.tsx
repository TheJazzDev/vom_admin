import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWatch, type Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useMembersByBands } from '@/hooks/useBands';
import { BandKeys } from '@/enums';
import { useState } from 'react';
import { X, Plus, UserPlus } from 'lucide-react';
import { convertBandsToOptions } from '../Utils/convertBandsToOptions';

export const SelectMinistersField = ({
  control,
  name,
  label,
}: {
  control: Control;
  name: string;
  label: string;
}) => {
  const [customInput, setCustomInput] = useState('');
  const [inputMode, setInputMode] = useState<'select' | 'manual'>('select');

  const officiatingBands = useWatch({
    control,
    name: 'officiating.band',
  });

  const allOfficiatingMembers = useWatch({
    control,
    name: 'officiating',
  });

  const { data, isLoading } = useMembersByBands(officiatingBands as BandKeys[]);
  const membersList = convertBandsToOptions(data ?? []);
  const disabled = isLoading || officiatingBands.length === 0;

  // Get all selected members from other fields to prevent duplicates
  const getSelectedMembersFromOtherFields = (currentFieldName: string) => {
    if (!allOfficiatingMembers) return [];

    const selectedMembers: string[] = [];
    const officiatingFields = [
      'lesson',
      'worshipLeader',
      'alternateWorshipLeader',
      'intercessoryPrayer1',
      'intercessoryPrayer2',
      'intercessoryPrayer3',
      'ministers',
    ];

    officiatingFields.forEach((fieldName) => {
      if (fieldName !== currentFieldName.split('.').pop()) {
        const fieldValue = allOfficiatingMembers[fieldName];
        if (fieldValue) {
          if (Array.isArray(fieldValue)) {
            selectedMembers.push(...fieldValue);
          } else {
            selectedMembers.push(fieldValue);
          }
        }
      }
    });

    return selectedMembers;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedMembers = getSelectedMembersFromOtherFields(name);
        const currentMinsters = field.value || [];

        // Filter out already selected members and current ministers
        const availableOptions = membersList.filter(
          (option) =>
            !selectedMembers.includes(option.value) &&
            !currentMinsters.includes(option.value)
        );

        const addMemberFromSelect = (memberName: string) => {
          if (memberName && !currentMinsters.includes(memberName)) {
            field.onChange([...currentMinsters, memberName]);
          }
        };

        const addCustomMember = () => {
          const trimmedName = customInput.trim();
          if (trimmedName && !currentMinsters.includes(trimmedName)) {
            field.onChange([...currentMinsters, trimmedName]);
            setCustomInput('');
            setInputMode('select');
          }
        };

        const removeMember = (indexToRemove: number) => {
          const newMinsters = currentMinsters.filter(
            (_: string, index: number) => index !== indexToRemove
          );
          field.onChange(newMinsters);
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addCustomMember();
          } else if (e.key === 'Escape') {
            setCustomInput('');
            setInputMode('select');
          }
        };

        return (
          <FormItem>
            <FormLabel
              className={`${
                disabled
                  ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : ''
              }`}>
              {label} <span className='text-red-500'>*</span>
            </FormLabel>

            <div className='flex gap-6'>
              <div className='space-y-3 flex-1'>
                {inputMode === 'select' ? (
                  // Select Mode
                  <div className='flex gap-2'>
                    <Select
                      disabled={disabled}
                      value=''
                      onValueChange={addMemberFromSelect}>
                      <SelectTrigger className='flex-1'>
                        <SelectValue placeholder='Select a minister from bands' />
                      </SelectTrigger>
                      <SelectContent>
                        {availableOptions.length === 0 ? (
                          <div className='p-2 text-center text-sm text-muted-foreground'>
                            {disabled
                              ? 'Select officiating bands first'
                              : 'No available members'}
                          </div>
                        ) : (
                          availableOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>

                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => setInputMode('manual')}
                      disabled={disabled}
                      className='shrink-0'>
                      <UserPlus className='h-4 w-4' />
                    </Button>
                  </div>
                ) : (
                  // Manual Input Mode
                  <div className='flex gap-2'>
                    <Input
                      placeholder='Enter minister name manually'
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={disabled}
                      className='flex-1'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      onClick={addCustomMember}
                      disabled={disabled || !customInput.trim()}
                      className='shrink-0'>
                      <Plus className='h-4 w-4' />
                    </Button>
                    <Button
                      type='button'
                      variant='ghost'
                      onClick={() => {
                        setCustomInput('');
                        setInputMode('select');
                      }}
                      disabled={disabled}
                      className='shrink-0'>
                      Cancel
                    </Button>
                  </div>
                )}

                {/* Helper Text */}
                <div className='text-xs text-muted-foreground'>
                  {inputMode === 'select'
                    ? 'Select from band members or click + to add manually'
                    : 'Type the minister name and press Enter or click +'}
                </div>
              </div>

              <div className='lg:w-1/2'>
                {currentMinsters.length > 0 && (
                  <div className='space-y-2'>
                    <div className='text-sm text-muted-foreground'>
                      <p>Selected Ministers ({currentMinsters.length}):</p>
                    </div>
                    <div className='space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-muted/20'>
                      {currentMinsters.map(
                        (minister: string, index: number) => (
                          <div
                            key={index}
                            className='flex items-center justify-between gap-2 p-2 bg-background rounded border'>
                            <div className='flex items-center gap-2 flex-1'>
                              <span className='text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded'>
                                {index + 1}
                              </span>
                              <span className='text-sm flex-1'>{minister}</span>
                            </div>

                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() => removeMember(index)}
                              disabled={disabled}
                              className='h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50'>
                              <X className='h-3 w-3' />
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
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
