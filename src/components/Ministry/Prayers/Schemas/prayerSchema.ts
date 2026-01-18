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
  scriptureReference: z.string().min(1, "Scripture reference is required"),
  scriptureText: z.string().min(1, "Scripture text is required"),
  date: z.string().min(1, "Date is required"),
  authorName: z.string().min(1, "Author name is required"),
  authorId: z.string().min(1, "Author ID is required"),
});

export type DailyPrayerFormData = z.infer<typeof dailyPrayerSchema>;
