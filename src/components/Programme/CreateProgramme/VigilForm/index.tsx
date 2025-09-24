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
  initialVigilProgramme,
  vigilDraftProgrammeSchema,
  vigilProgrammeSchema,
} from "../../Schemas/vigil";
import VigilDetails from "./Details";
import VigilHymns from "./Hymns";
import VigilOfficiating from "./Officiating";

export default function VigilProgrammeForm({ type }: { type: string }) {
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
    draftSchema: vigilDraftProgrammeSchema,
    publishSchema: vigilProgrammeSchema,
    initialData: initialVigilProgramme,
    programmeType: type,
  });

  if (shouldShowLoadingState) {
    return <ProgrammeFormLoadingState programmeType="Vigil" />;
  }

  if (shouldShowErrorState) {
    return <ProgrammeFormErrorState programmeType="Vigil" error={loadError} />;
  }

  return (
    <div className="space-y-8">
      <ProgrammeFormHeader programmeType="Vigil" isEditing={isEditing} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <VigilDetails control={form.control} />
          <VigilHymns control={form.control} />
          <VigilOfficiating control={form.control} />

          <ProgrammeFormActions
            mode={mode}
            isLoading={isLoading}
            isEditing={isEditing}
            onModeChange={setMode}
          />
        </form>
      </Form>
    </div>
  );
}
