import { z } from "zod";

export const sundayProgrammeSchema = z.object({
  type: z.literal("sunday"),
  date: z.string().nonempty("Date is required"),
  theme: z.string().nonempty("Theme is requried"),
  topic: z.string().nonempty("Topic is requried"),
  lesson: z.string().nonempty("Lesson is requried"),
  callToWorship: z.string().nonempty("Call to worship is requried"),
  callToWorshipText: z.string().nonempty("Call to worship text is requried"),
  openingPrayer: z.array(z.number()).default([51, 19, 24]),
  officiating: z.object({
    lesson: z.string().nonempty("Lesson is requried"),
    band: z
      .array(z.string())
      .min(1, { message: "At least one band must be selected" })
      .default([]),
    preacher: z.string().nonempty("Preacher is requried"),
    worshipLeader: z.string().nonempty("Worship leader is requried"),
    alternateWorshipLeader: z
      .string()
      .nonempty("Alternative worship leader is requried"),
    intercessoryPrayer1: z
      .string()
      .nonempty("1st Intercessory praylist is requried"),
    intercessoryPrayer2: z
      .string()
      .nonempty("2nd Intercessory praylist is requried"),
    intercessoryPrayer3: z
      .string()
      .nonempty("3rd Intercessory praylist is requried"),
    workersPrayerLeader: z.string().optional(),
    prayerMinistration: z
      .string()
      .nonempty("Prayer ministration lead is requried"),
    thanksgivingPrayer: z
      .string()
      .nonempty("Thanksgiving prayerlist is requried"),
    sundaySchoolTeacher: z.string().optional(),
    ministers: z.array(z.string()).default([]),
  }),
  hymns: z.object({
    processional: z.string().nonempty("Processional hynm is requried"),
    introit: z.string().nonempty("Introit is requried"),
    opening: z.string().nonempty("Opening hynm is requried"),
    thanksgiving: z
      .array(z.string())
      .min(1, { message: "At least one hymn is required" })
      .default([]),
    sermon: z.string().nonempty("Sermon hynm is requried"),
    vesper: z.string().nonempty("Vesper is requried"),
    recessional: z.string().nonempty("Recessional hynm is requried"),
  }),
});
