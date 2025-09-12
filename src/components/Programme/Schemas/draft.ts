import { z } from 'zod';

export const draftProgrammeSchema = z.object({
  date: z.date({ error: 'Date is required' }).transform((d) => d.toISOString()),
});
