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
  initialShilohProgramme,
  shilohDraftProgrammeSchema,
  shilohProgrammeSchema,
} from "../../Schemas/shiloh";
import ShilohDetails from "./Details";
import ShilohHymns from "./Hymns";
import ShilohOfficiating from "./Officiating";

export default function ShilohProgrammeForm({ type }: { type: string }) {
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
    draftSchema: shilohDraftProgrammeSchema,
    publishSchema: shilohProgrammeSchema,
    initialData: initialShilohProgramme,
    programmeType: type,
  });

  if (shouldShowLoadingState) {
    return <ProgrammeFormLoadingState programmeType="Shiloh" />;
  }

  if (shouldShowErrorState) {
    return <ProgrammeFormErrorState programmeType="Shiloh" error={loadError} />;
  }

  return (
    <div className="space-y-8">
      <ProgrammeFormHeader programmeType="Shiloh" isEditing={isEditing} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ShilohDetails control={form.control} />
          <ShilohHymns control={form.control} />
          <ShilohOfficiating control={form.control} />

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
