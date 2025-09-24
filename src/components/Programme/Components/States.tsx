import { Card, CardContent } from "@/components/ui/card";
import { FormSkeleton } from "./Skeletons/FormSkeleton";

interface ProgrammeFormLoadingStateProps {
  programmeType: string;
}

export function ProgrammeFormLoadingState({
  programmeType,
}: ProgrammeFormLoadingStateProps) {
  return (
    <div className="space-y-8 py-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Loading {programmeType} Programme...
        </h1>
      </div>
      <FormSkeleton />
    </div>
  );
}

interface ProgrammeFormErrorStateProps {
  programmeType: string;
  error: any;
}

export function ProgrammeFormErrorState({
  programmeType,
  error,
}: ProgrammeFormErrorStateProps) {
  return (
    <div className="space-y-8 py-6">
      <Card className="border-red-200 dark:border-red-700">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">
              Error Loading {programmeType} Programme
            </h3>
            <p className="text-red-600 dark:text-red-400">
              {error?.message || "Failed to load programme data"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ProgrammeFormHeaderProps {
  programmeType: string;
  isEditing: boolean;
}

export function ProgrammeFormHeader({
  programmeType,
  isEditing,
}: ProgrammeFormHeaderProps) {
  return (
    <div className={`text-center ${isEditing ? "mt-8" : ""}`}>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {isEditing ? "Edit" : "Create"} {programmeType} Programme
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-1">
        {isEditing
          ? `Update the ${programmeType} programme details`
          : `Fill in the ${programmeType} programme details`}
      </p>
    </div>
  );
}
