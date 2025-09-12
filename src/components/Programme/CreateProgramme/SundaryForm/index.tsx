'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { initialSundayProgramme } from '../../Utils/initialData';
import {
  sundayDraftProgrammeSchema,
  sundayProgrammeSchema,
} from '../../Schemas/sunday';
import Details from './Details';
import Hynms from './Hynms';
import Officiating from './Officiating';
import { useSaveProgramme } from '@/hooks/useProgrammes';

export default function SundayProgrammeForm() {
  const [mode, setMode] = useState<'draft' | 'publish'>('publish');
  const saveProgrammeMutation = useSaveProgramme();

  const form = useForm({
    resolver: zodResolver(
      mode === 'draft' ? sundayDraftProgrammeSchema : sundayProgrammeSchema
    ),
    defaultValues: initialSundayProgramme,
  });

  const onSubmit = async (values: SundayProgrammeProps) => {
    try {
      const normalized = { ...initialSundayProgramme, ...values };

      await saveProgrammeMutation.mutateAsync({
        ...normalized,
        status: mode === 'draft' ? 'draft' : 'upcoming',
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const isLoading = saveProgrammeMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <Details control={form.control} />
        <Officiating control={form.control} />
        <Hynms control={form.control} />

        <div className='w-full sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t'>
          <div className='flex justify-end gap-4 py-4 mx-auto px-4'>
            <Button
              variant='outline'
              type='submit'
              size='lg'
              disabled={isLoading}
              onClick={() => setMode('draft')}
              className='flex items-center gap-2'>
              {isLoading && mode === 'draft' && (
                <Loader2 className='h-4 w-4 animate-spin' />
              )}
              Save as Draft
            </Button>

            <Button
              type='submit'
              size='lg'
              disabled={isLoading}
              onClick={() => setMode('publish')}
              className='flex items-center gap-2'>
              {isLoading && mode === 'publish' && (
                <Loader2 className='h-4 w-4 animate-spin' />
              )}
              Publish Programme
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
