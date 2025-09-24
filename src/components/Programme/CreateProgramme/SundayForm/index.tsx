"use client";

import { Form } from "@/components/ui/form";
import { ProgrammeFormActions } from "../../Components/ProgrammeFormActions";
import {
  ProgrammeFormErrorState,
  ProgrammeFormHeader,
  ProgrammeFormLoadingState,
} from "../../Components/States";
import { useProgrammeForm } from "../../hooks/useProgrammeForm";
import {
  initialSundayProgramme,
  sundayDraftProgrammeSchema,
  sundayProgrammeSchema,
} from "../../Schemas/sunday";
import SundayDetails from "./Details";
import SundayHynms from "./Hynms";
import SundayOfficiating from "./Officiating";

export default function SundayProgrammeForm({ type }: { type: string }) {
  const {
    form,
    mode,
    setMode,
    onSubmit,
    isLoading,
    isEditing,
    shouldShowLoadingState,
    shouldShowErrorState,
    loadError,
  } = useProgrammeForm({
    draftSchema: sundayDraftProgrammeSchema,
    publishSchema: sundayProgrammeSchema,
    initialData: initialSundayProgramme,
    programmeType: type,
  });

  if (shouldShowLoadingState) {
    return <ProgrammeFormLoadingState programmeType="Sunday" />;
  }

  if (shouldShowErrorState) {
    return <ProgrammeFormErrorState programmeType="Sunday" error={loadError} />;
  }

  return (
    <div className="space-y-8">
      <ProgrammeFormHeader programmeType="Sunday" isEditing={isEditing} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <SundayDetails control={form.control} />
          <SundayHynms control={form.control} />
          <SundayOfficiating control={form.control} />

          <ProgrammeFormActions
            isLoading={isLoading}
            isEditing={isEditing}
            mode={mode}
            onModeChange={setMode}
          />
        </form>
      </Form>
    </div>
  );
}
