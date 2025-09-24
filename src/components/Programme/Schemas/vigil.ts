import z from "zod";

export const initialVigilProgramme: VigilProgrammeProps = {
  date: "",
  theme: "",
  topic: "",
  lesson: "",
  openingPrayer: [],
  officiating: {
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

export const vigilProgrammeSchema = z.object({
  date: z.date({ error: "Date is required" }).transform((d) => d.toISOString()),
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

export const vigilDraftProgrammeSchema = z.object({
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
