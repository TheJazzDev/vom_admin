import z from "zod";

export const shilohProgrammeSchema = z.object({
  type: z.literal("shilo"),
  date: z.string().nonempty("Date is required"),
  theme: z.string(),
  topic: z.string(),
  lesson: z.string(),
  openingPrayer: z.array(z.number()).default([]),
  officiating: z.object({
    revivalist: z.string().optional(),
    preparatoryPrayer: z.string().optional(),
    lesson: z.string(),
    preacher: z.string(),
    worshipLeader: z.string(),
    prayerMinistration: z.string(),
  }),
  hynms: z.object({
    opening: z.string(),
    sermon: z.string(),
    prayer: z.string(),
    thanksgiving: z.string(),
  }),
});
