'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { initialShilohProgramme } from '../Utils/initialData';
import { draftProgrammeSchema } from '../Schemas/draft';
import { shilohProgrammeSchema } from '../Schemas/shiloh';

export default function ShilohProgrammeForm() {
  const [mode, setMode] = useState<'draft' | 'publish'>('publish');

  const form = useForm<ShilohProgrammeProps>({
    resolver: zodResolver(
      mode === 'draft' ? draftProgrammeSchema : shilohProgrammeSchema
    ),
    defaultValues: initialShilohProgramme,
  });

  const onSubmit = (values: ShilohProgrammeProps) => {
    const normalized = { ...initialShilohProgramme, ...values };

    if (mode === 'draft') {
      console.log('Saved as draft:', normalized);
    } else {
      console.log('Published:', normalized);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-col-1 lg:grid-cols-3 gap-4'>
          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='theme'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <FormControl>
                  <Input placeholder='Shiloh theme' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='topic'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input placeholder='Shiloh topic' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-4'>
          <h3 className='font-semibold text-lg'>Opening Session</h3>
          <FormField
            control={form.control}
            name='openingPrayer'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening Prayer</FormLabel>
                <FormControl>
                  <Input placeholder='Name of prayer leader' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='welcomeAddress'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Welcome Address</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder='Enter welcome address notes'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ----------------------
          Worship & Choir
        ---------------------- */}
        <div className='space-y-4'>
          <h3 className='font-semibold text-lg'>Worship & Choir</h3>
          <FormField
            control={form.control}
            name='worshipLeader'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Worship Leader</FormLabel>
                <FormControl>
                  <Input placeholder='Name of worship leader' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='choirMinistration'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choir Ministration</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder='Choir songs or notes'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ----------------------
          Word & Sermon
        ---------------------- */}
        <div className='space-y-4'>
          <h3 className='font-semibold text-lg'>Word & Sermon</h3>
          <FormField
            control={form.control}
            name='scriptureReading'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scripture Reading</FormLabel>
                <FormControl>
                  <Input placeholder='Scripture text or reference' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='sermonTitle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sermon Title</FormLabel>
                <FormControl>
                  <Input placeholder='Title of sermon' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='preacher'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preacher</FormLabel>
                <FormControl>
                  <Input placeholder='Name of preacher' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ----------------------
          Offering & Announcements
        ---------------------- */}
        <div className='space-y-4'>
          <h3 className='font-semibold text-lg'>Offering & Announcements</h3>
          <FormField
            control={form.control}
            name='offering'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Offering</FormLabel>
                <FormControl>
                  <Input placeholder='Offering details' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='announcements'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Announcements</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder='Enter announcements'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ----------------------
          Closing
        ---------------------- */}
        <div className='space-y-4'>
          <h3 className='font-semibold text-lg'>Closing</h3>
          <FormField
            control={form.control}
            name='closingRemarks'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Closing Remarks</FormLabel>
                <FormControl>
                  <Textarea rows={2} placeholder='Closing notes' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='closingPrayer'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Closing Prayer</FormLabel>
                <FormControl>
                  <Input placeholder='Leader of closing prayer' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='w-full sticky bottom-0 bg-gray-50 dark:bg-gray-900'>
          <div className='flex gap-6 py-4 mx-auto'>
            <Button
              variant='outline'
              type='submit'
              onClick={() => setMode('draft')}>
              Save programme as draft
            </Button>
            <Button type='submit' onClick={() => setMode('publish')}>
              Publish Programme
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
