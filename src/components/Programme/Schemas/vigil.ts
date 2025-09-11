import z from "zod";

export const vigilProgrammeSchema = z.object({
  type: z.literal("vigil"),
  date: z.string().nonempty("Date is required"),
  theme: z.string().optional(),
  topic: z.string().optional(),
  lesson: z.string().optional(),
  openingPrayer: z.array(z.number()).default([]),
  officiating: z.object({
    lesson: z.string().optional(),
    preacher: z.string().optional(),
    worshipLeader: z.string().optional(),
    prayerMinistration: z.string().optional(),
  }),
  hynms: z.object({
    opening: z.string().optional(),
    sermon: z.string().optional(),
    prayer: z.string().optional(),
    thanksgiving: z.string().optional(),
  }),
});
