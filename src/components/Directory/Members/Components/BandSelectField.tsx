import { IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import type { Control } from 'react-hook-form';
import type z from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BandDisplayNames, BandKeys } from '@/enums/bands';
import { formToDisplay, getAvailableRoles } from '@/utils/bandConverter';
import type { memberEditSchema } from '../Schemas/memberEditSchema';

type MemberEditForm = z.infer<typeof memberEditSchema>;

interface BandData {
  name: BandKeys;
  role: BandRole;
}

interface DisplayBand {
  displayName: string;
  roleDisplay: string;
}

interface BandSelectFieldProps {
  control: Control<MemberEditForm>;
  disabled?: boolean;
  required?: boolean;
}

export const BandSelectField = ({
  control,
  disabled = false,
  required = false,
}: BandSelectFieldProps) => {
  const [selectedBandName, setSelectedBandName] = useState<BandKeys | ''>('');
  const [selectedBandRole, setSelectedBandRole] = useState<BandRole | ''>('');

  const isBandDataArray = (value: any): value is BandData[] => {
    return (
      Array.isArray(value) &&
      (value.length === 0 ||
        (typeof value[0] === 'object' &&
          'name' in value[0] &&
          'role' in value[0]))
    );
  };

  const availableRoles = (): BandRole[] => {
    return selectedBandName ? getAvailableRoles(selectedBandName) : [];
  };

  return (
    <FormField
      control={control}
      name='band'
      render={({ field }) => {
        const currentBands: BandData[] = isBandDataArray(field.value)
          ? field.value
          : [];
        const displayBands = formToDisplay(currentBands);

        const handleAddBand = () => {
          if (selectedBandName && selectedBandRole) {
            const bandExists = currentBands.some(
              (band: BandData) => band.name === selectedBandName
            );

            if (!bandExists) {
              const newBand: BandData = {
                name: selectedBandName,
                role: selectedBandRole,
              };
              const updatedBands = [...currentBands, newBand];
              field.onChange(updatedBands);

              setTimeout(() => {
                field.onBlur();
              }, 0);

              setSelectedBandName('');
              setSelectedBandRole('');
            }
          }
        };

        const handleRemoveBand = (indexToRemove: number) => {
          const newValue = currentBands.filter((_, i) => i !== indexToRemove);
          field.onChange(newValue);

          setTimeout(() => {
            field.onBlur();
          }, 0);
        };

        const handleClearAllBands = () => {
          field.onChange([]);

          setTimeout(() => {
            field.onBlur();
          }, 0);
        };

        return (
          <FormItem>
            <p className='capitalize'>
              Band {required && <span className='text-red-500'>*</span>}
            </p>
            <div className='space-y-2'>
              {/* Display current bands */}
              <div
                className={`flex flex-wrap gap-1 min-h-[32px] p-2 border rounded-md relative ${
                  disabled ? 'bg-muted/50 border-muted cursor-not-allowed' : ''
                }`}>
                {displayBands.length > 0 ? (
                  <>
                    {displayBands.map((band: DisplayBand, index: number) => (
                      <Badge
                        key={index}
                        variant='secondary'
                        className={`text-xs ${disabled ? 'opacity-50' : ''}`}>
                        {band.displayName} - {band.roleDisplay}
                        <button
                          type='button'
                          disabled={disabled}
                          onClick={() => handleRemoveBand(index)}
                          className={disabled ? 'cursor-not-allowed' : ''}>
                          <IconX
                            className={`ml-1 h-3 w-3 ${
                              disabled
                                ? 'text-muted-foreground cursor-not-allowed'
                                : 'cursor-pointer hover:text-red-500'
                            }`}
                          />
                        </button>
                      </Badge>
                    ))}
                    <Button
                      size='sm'
                      type='button'
                      variant='ghost'
                      disabled={disabled}
                      onClick={handleClearAllBands}
                      className={`h-6 px-2 text-xs absolute top-1 right-1 ${
                        disabled
                          ? 'text-muted-foreground cursor-not-allowed opacity-50'
                          : 'text-muted-foreground hover:text-red-500'
                      }`}>
                      <IconTrash className='h-3 w-3' />
                    </Button>
                  </>
                ) : (
                  <span
                    className={`text-sm ${
                      disabled
                        ? 'text-muted-foreground/50'
                        : 'text-muted-foreground'
                    }`}>
                    No bands selected
                  </span>
                )}
              </div>

              {/* Band selection form */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-2 items-end'>
                <div>
                  <p className='text-xs text-muted-foreground mb-1 block'>
                    Band Name
                  </p>
                  <Select
                    value={selectedBandName}
                    onValueChange={(value: BandKeys) => {
                      setSelectedBandName(value);
                      setSelectedBandRole('');
                    }}
                    disabled={disabled}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select band' />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(BandKeys)
                        .filter(
                          (bandKey) =>
                            !currentBands.some(
                              (band: BandData) => band.name === bandKey
                            )
                        )
                        .map((bandKey) => (
                          <SelectItem key={bandKey} value={bandKey}>
                            {BandDisplayNames[bandKey]}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className='text-xs text-muted-foreground mb-1 block'>
                    Role
                  </p>
                  <Select
                    value={selectedBandRole}
                    onValueChange={(value: BandRole) =>
                      setSelectedBandRole(value)
                    }
                    disabled={disabled || !selectedBandName}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select role' />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles().map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type='button'
                  size='sm'
                  disabled={disabled || !selectedBandName || !selectedBandRole}
                  onClick={handleAddBand}
                  className='h-10'>
                  <IconPlus className='h-4 w-4 mr-1' />
                  Add
                </Button>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
