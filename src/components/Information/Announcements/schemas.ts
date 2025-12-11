import { z } from "zod";

export const announcementTypeEnum = z.enum([
  "event",
  "general",
  "urgent",
  "celebration",
]);
export const announcementPriorityEnum = z.enum(["low", "medium", "high"]);

export const createAnnouncementSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  type: announcementTypeEnum,
  priority: announcementPriorityEnum,
  date: z.string().min(1, "Date is required"),
  author: z.string().min(2, "Author name is required"),
  readTime: z.string().optional(),
  tags: z.array(z.string()),
  isActive: z.boolean(),
  publishDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

export const updateAnnouncementSchema = createAnnouncementSchema
  .partial()
  .extend({
    id: z.string(),
  });

export type CreateAnnouncementFormData = z.infer<
  typeof createAnnouncementSchema
>;
export type UpdateAnnouncementFormData = z.infer<
  typeof updateAnnouncementSchema
>;
