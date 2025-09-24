import z from "zod";

export const initialShilohProgramme: ShilohProgrammeProps = {
  date: "",
  theme: "",
  topic: "",
  lesson: "",
  openingPrayer: [],
  officiating: {
    revivalist: "",
    preparatoryPrayer: "",
    lesson: "",
    preacher: "",
    worshipLeader: "",
    prayerMinistration: "",
  },
  hynms: {
    opening: "",
    sermon: "",
    prayer: "",
    thanksgiving: "",
  },
};

export const shilohProgrammeSchema = z.object({
  date: z.date({ error: "Date is required" }).transform((d) => d.toISOString()),
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

export const shilohDraftProgrammeSchema = z.object({
  date: z
    .date()
    .optional()
    .transform((d) => d?.toISOString()),
  theme: z.string().optional(),
  topic: z.string().optional(),
  lesson: z.string().optional(),
  openingPrayer: z.array(z.number()).default([]),
  officiating: z
    .object({
      revivalist: z.string().optional(),
      preparatoryPrayer: z.string().optional(),
      lesson: z.string().optional(),
      preacher: z.string().optional(),
      worshipLeader: z.string().optional(),
      prayerMinistration: z.string().optional(),
    })
    .optional(),
  hynms: z
    .object({
      opening: z.string().optional(),
      sermon: z.string().optional(),
      prayer: z.string().optional(),
      thanksgiving: z.string().optional(),
    })
    .optional(),
});
