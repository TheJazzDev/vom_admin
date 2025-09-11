import { shiloProgrammeSchema } from "@/components/Programme/Schemas/shiloh";
import { sundayProgrammeSchema } from "@/components/Programme/Schemas/sunday";
import { vigilProgrammeSchema } from "@/components/Programme/Schemas/vigil";

declare global {
  type ProgrammeType = "shilo" | "sunday" | "vigil";
  type ServiceSections = "Current" | "Upcoming" | "Past";

  export interface UpcomingProgramme {
    id: string;
    date: string;
    topic: string;
    time: string;
    status: "upcoming" | "past";
    type: ProgrammeType;
  }

  type SundayProgrammeProps = z.infer<typeof sundayProgrammeSchema>;
  type ShilohProgrammeProps = z.infer<typeof shiloProgrammeSchema>;
  type VigilProgrammeProps = z.infer<typeof vigilProgrammeSchema>;

  type ProgrammeFormData =
    | SundayProgrammeProps
    | ShiloProgrammeProps
    | VigilProgrammeProps;
}
