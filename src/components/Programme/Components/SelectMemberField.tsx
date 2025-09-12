import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWatch, type Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useMembersByBands } from '@/hooks/useBands';
import { BandKeys } from '@/enums';
import { convertBandsToOptions } from '../Utils/convertBandsToOptions';

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
    name: 'officiating.band',
  });

  const allOfficiatingMembers = useWatch({
    control,
    name: 'officiating',
  });

  const { data, isLoading } = useMembersByBands(officiatingBands as BandKeys[]);

  const membersList = convertBandsToOptions(data ?? []);

  const disabled = isLoading || officiatingBands.length === 0;

  const getSelectedMembers = (currentFieldName: string) => {
    if (!allOfficiatingMembers) return [];

    const selectedMembers: string[] = [];
    const officiatingFields = [
      'lesson',
      'worshipLeader',
      'alternateWorshipLeader',
      'intercessoryPrayer1',
      'intercessoryPrayer2',
      'intercessoryPrayer3',
    ];

    officiatingFields.forEach((fieldName) => {
      const fieldValue = allOfficiatingMembers[fieldName];

      if (fieldName !== currentFieldName.split('.').pop() && fieldValue) {
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
        const currentFieldName = name;
        const selectedMembers = getSelectedMembers(currentFieldName);

        const availableOptions = membersList.filter(
          (option) => !selectedMembers.includes(option.value)
        );

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
            <Select
              disabled={disabled}
              value={field.value || ''}
              onValueChange={(val) =>
                field.onChange(val === '__CLEAR__' ? '' : val)
              }>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.value && (
                  <SelectItem value='__CLEAR__'>
                    <span className='text-gray-500'>Clear selection</span>
                  </SelectItem>
                )}
                {membersList.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
