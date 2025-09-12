import type { Control } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { EnhancedPsalmInput } from '../../Components/PsalmNumbersInput';

const Details = ({ control }: { control: Control<SundayProgrammeProps> }) => {
  const [open, setOpen] = useState(false);

  const today = new Date();
  const currentYear = today.getFullYear();

  return (
    <>
      <h3 className='font-semibold text-2xl text-center text-blue-600'>
        Details
      </h3>

      <div className='grid grid-col-1 lg:grid-cols-3 gap-6 items-start'>
        <FormField
          control={control}
          name='date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date (Sundays Only)</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}>
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {field.value ? (
                        <div className='flex items-center justify-between gap-2'>
                          <span>{format(field.value, 'PPP')}</span>
                          <span className='text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded'>
                            Sunday
                          </span>
                        </div>
                      ) : (
                        <span>Pick a Sunday</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-4' align='start'>
                  <div className='p-3 border-b bg-muted/50'>
                    <p className='text-xs text-muted-foreground'>
                      Only Sundays are available for selection
                    </p>
                  </div>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={(value) => {
                      field.onChange(value);
                      setOpen(false);
                    }}
                    disabled={(date) => {
                      const now = new Date();
                      now.setHours(0, 0, 0, 0);

                      // disable past dates
                      if (date < now) return true;

                      // disable non-Sundays
                      return date.getDay() !== 0;
                    }}
                    captionLayout='dropdown'
                    startMonth={new Date(currentYear, today.getMonth())}
                    endMonth={new Date(currentYear + 2, 11)}
                    className='p-3'
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='theme'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <FormControl>
                <Input placeholder='e.g Double Glory' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='topic'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input placeholder='e.g Manifestation of Power' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='lesson'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson</FormLabel>
              <FormControl>
                <Input placeholder='e.g Act 5:12-25' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='callToWorship'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Call to Worship</FormLabel>
              <FormControl>
                <Input placeholder='e.g Acts 5:12' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='openingPrayer'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opening Prayer</FormLabel>
              <FormControl>
                <EnhancedPsalmInput
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='lg:col-span-3'>
          <FormField
            control={control}
            name='callToWorshipText'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Call to Worship Text</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder='e.g ENITORINA: EJE KI A FI OTITO OKAN SUMBO TOSI NI EKUN IGBAGBO, KI A SI WE OKAN WA MO KURO NINU ERI OKAN BUBURU KI A SI FI OMI MIMO WE ARA WAN NU. E JE KI A DI IJEWO IRETI WA MU SINSIN NI AISIYEMEJI; (NITORIPE OLOOTO NI ENI TI O SE ILERI) HEB 10:22-23'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default Details;
