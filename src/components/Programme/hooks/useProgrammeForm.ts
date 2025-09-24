import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import type { z } from "zod";
import {
  useProgrammeById,
  useSaveProgramme,
  useUpdateProgramme,
} from "@/hooks/useProgrammes";

interface UseProgrammeFormOptions {
  draftSchema: z.ZodSchema<ProgrammeFormData>;
  publishSchema: z.ZodSchema<ProgrammeFormData>;
  initialData: ProgrammeFormData;
  programmeType: string;
}

interface UseProgrammeFormReturn {
  form: UseFormReturn<ProgrammeFormData>;
  mode: "draft" | "publish";
  setMode: (mode: "draft" | "publish") => void;
  onSubmit: (values: ProgrammeFormData) => Promise<void>;
  isLoading: boolean;
  isEditing: boolean;
  programmeId: string | null;
  existingProgramme: any;
  isLoadingProgramme: boolean;
  loadError: any;
  shouldShowLoadingState: boolean;
  shouldShowErrorState: boolean;
}

export function useProgrammeForm({
  draftSchema,
  publishSchema,
  initialData,
  programmeType,
}: UseProgrammeFormOptions): UseProgrammeFormReturn {
  const [mode, setMode] = useState<"draft" | "publish">("publish");
  const params = useSearchParams();
  const programmeId = params.get("id");

  const isEditing = !!programmeId;

  // Mutations
  const saveProgrammeMutation = useSaveProgramme();
  const updateProgrammeMutation = useUpdateProgramme();

  // Query for existing programme
  const {
    data: existingProgramme,
    isLoading: isLoadingProgramme,
    error: loadError,
  } = useProgrammeById(programmeId ? programmeId : undefined);

  // Form setup
  const form = useForm<ProgrammeFormData>({
    resolver: zodResolver(
      mode === "draft" ? draftSchema : (publishSchema as ProgrammeFormData),
    ),
    defaultValues: initialData,
  });

  // Update form when data loads
  useEffect(() => {
    if (existingProgramme && isEditing) {
      // Reset form with existing data
      form.reset({
        ...initialData,
        ...existingProgramme,
        date: existingProgramme.date
          ? new Date(existingProgramme.date)
          : undefined,
      });
    }
  }, [existingProgramme, isEditing, form, initialData]);

  // Submit handler
  const onSubmit = async (values: ProgrammeFormData) => {
    try {
      const status = mode === "draft" ? "draft" : "published";
      const normalized = { ...initialData, ...values };

      if (isEditing) {
        // Update existing programme
        await updateProgrammeMutation.mutateAsync({
          id: programmeId,
          data: {
            ...normalized,
            type: programmeType,
            status,
          },
        });
      } else {
        // Create new programme
        await saveProgrammeMutation.mutateAsync({
          ...normalized,
          type: programmeType,
          status,
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // Loading states
  const isLoading =
    saveProgrammeMutation.isPending || updateProgrammeMutation.isPending;
  const shouldShowLoadingState = isEditing && isLoadingProgramme;
  const shouldShowErrorState = isEditing && !!loadError;

  return {
    form,
    mode,
    setMode,
    onSubmit,
    isLoading,
    isEditing,
    programmeId,
    existingProgramme,
    isLoadingProgramme,
    loadError,
    shouldShowLoadingState,
    shouldShowErrorState,
  };
}
