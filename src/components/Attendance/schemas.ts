import { z } from 'zod';

export const serviceTypeOptions = [
  { value: 'Sunday Service', label: 'Sunday Service' },
  { value: 'Midweek Service', label: 'Midweek Service' },
  { value: 'Special Event', label: 'Special Event' },
] as const;

export const attendanceFormSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  serviceType: z.enum(['Sunday Service', 'Midweek Service', 'Special Event']),
  maleAdults: z.number().min(0, 'Must be 0 or greater'),
  femaleAdults: z.number().min(0, 'Must be 0 or greater'),
  children: z.number().min(0, 'Must be 0 or greater'),
  notes: z.string().optional(),
});

export type AttendanceFormData = z.infer<typeof attendanceFormSchema>;
