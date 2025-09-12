import { Input } from '@/components/ui/input';

interface PsalmNumbersInputProps {
  value?: number[];
  onChange: (value: number[]) => void;
  onBlur?: () => void;
  disabled?: boolean;
}

export const PsalmNumbersInput = ({
  value = [51, 19, 24], // Default values
  onChange,
  onBlur,
  disabled = false,
}: PsalmNumbersInputProps) => {
  const handleInputChange = (index: number, inputValue: string) => {
    const newValue = [...value];

    // Convert to number, or use 0 if empty/invalid
    const numValue = inputValue === '' ? 0 : parseInt(inputValue, 10);

    // Only update if it's a valid number
    if (!isNaN(numValue)) {
      newValue[index] = numValue;
      onChange(newValue);
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <div className='text-sm text-muted-foreground'>Psalm</div>

      <Input
        type='number'
        min='1'
        max='150'
        value={value[0] || ''}
        onChange={(e) => handleInputChange(0, e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className='w-20 text-center'
        placeholder='51'
      />

      <div className='text-muted-foreground'>,</div>

      <Input
        type='number'
        min='1'
        max='150'
        value={value[1] || ''}
        onChange={(e) => handleInputChange(1, e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className='w-20 text-center'
        placeholder='19'
      />

      <div className='text-muted-foreground'>&</div>

      <Input
        type='number'
        min='1'
        max='150'
        value={value[2] || ''}
        onChange={(e) => handleInputChange(2, e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className='w-20 text-center'
        placeholder='24'
      />
    </div>
  );
};

// Alternative: With validation and better UX
export const EnhancedPsalmInput = ({
  value = [51, 19, 24],
  onChange,
  onBlur,
  disabled = false,
}: PsalmNumbersInputProps) => {
  const handleInputChange = (index: number, inputValue: string) => {
    const newValue = [...value];

    if (inputValue === '') {
      newValue[index] = 0;
    } else {
      const numValue = parseInt(inputValue, 10);
      if (!isNaN(numValue) && numValue >= 1 && numValue <= 150) {
        newValue[index] = numValue;
      } else {
        // Don't update if invalid - keeps the old value
        return;
      }
    }

    onChange(newValue);
  };

  const formatDisplayValue = (val: number) => {
    return val === 0 ? '' : val?.toString();
  };

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        <div className='text-sm text-muted-foreground'>Psalm</div>

        <div className='flex items-center justify-between gap-2 flex-1'>
          <Input
            type='number'
            min='1'
            max='150'
            value={formatDisplayValue(value[0])}
            onChange={(e) => handleInputChange(0, e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            className='text-center'
            placeholder='51'
          />

          <span className='text-muted-foreground'>,</span>

          <Input
            type='number'
            min='1'
            max='150'
            value={formatDisplayValue(value[1])}
            onChange={(e) => handleInputChange(1, e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            className='text-center'
            placeholder='19'
          />

          <span className='text-muted-foreground'>&</span>

          <Input
            type='number'
            min='1'
            max='150'
            value={formatDisplayValue(value[2])}
            onChange={(e) => handleInputChange(2, e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            className='text-center'
            placeholder='24'
          />
        </div>
      </div>

      <div className='text-xs text-muted-foreground'>
        Preview: Psalm{' '}
        {value
          .filter((v) => v > 0)
          .join(', ')
          .replace(/,([^,]*)$/, ' &$1')}
      </div>
    </div>
  );
};
