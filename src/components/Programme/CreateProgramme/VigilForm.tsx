'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { initialVigilProgramme } from '../Utils/initialData';
import { vigilProgrammeSchema } from '../Schemas/vigil';

export default function VigilProgrammeForm() {
  const form = useForm<VigilProgrammeProps>({
    resolver: zodResolver(vigilProgrammeSchema),
    defaultValues: initialVigilProgramme,
  });

  const onSubmit = (values: VigilProgrammeProps) => {
    console.log('Submitted VigilProgramme:', values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        {/* ----------------------
          General Info
        ---------------------- */}
        <div className='space-y-4'>
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
                  <Input placeholder='Vigil theme' {...field} />
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
                  <Input placeholder='Vigil topic' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lesson'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson</FormLabel>
                <FormControl>
                  <Input placeholder='Lesson title' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ----------------------
          Officiating
        ---------------------- */}
        <div className='space-y-4'>
          <h3 className='font-semibold text-lg'>Officiating</h3>
          <FormField
            control={form.control}
            name='officiating.lesson'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson</FormLabel>
                <FormControl>
                  <Input placeholder='Officiating lesson' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='officiating.preacher'
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
          <FormField
            control={form.control}
            name='officiating.worshipLeader'
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
            name='officiating.prayerMinistration'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prayer Ministration</FormLabel>
                <FormControl>
                  <Input placeholder='Prayer ministration leader' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ----------------------
          Hymns
        ---------------------- */}
        <div className='space-y-4'>
          <h3 className='font-semibold text-lg'>Hymns</h3>
          <FormField
            control={form.control}
            name='hynms.opening'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening Hymn</FormLabel>
                <FormControl>
                  <Input placeholder='Opening hymn' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='hynms.sermon'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sermon Hymn</FormLabel>
                <FormControl>
                  <Input placeholder='Sermon hymn' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='hynms.prayer'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prayer Hymn</FormLabel>
                <FormControl>
                  <Input placeholder='Prayer hymn' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='hynms.thanksgiving'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thanksgiving Hymn</FormLabel>
                <FormControl>
                  <Input placeholder='Thanksgiving hymn' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ----------------------
          Submit
        ---------------------- */}
        <Button type='submit'>Save Vigil Programme</Button>
      </form>
    </Form>
  );
}
