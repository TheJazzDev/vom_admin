import { z } from "zod";

export const dailyPrayerSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  content: z
    .string()
    .min(10, "Prayer content must be at least 10 characters")
    .max(2000, "Prayer content must be less than 2000 characters"),
  scriptureReference: z
    .string()
    .min(1, "Scripture reference is required"),
  scriptureText: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  author: z.string().min(1, "Author is required"),
  authorId: z.string().optional(),
});

export type DailyPrayerFormData = z.infer<typeof dailyPrayerSchema>;
