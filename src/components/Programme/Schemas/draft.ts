import { z } from "zod";

export const draftProgrammeSchema = z.object({
  date: z.string().min(1, "Date is required"),
});
