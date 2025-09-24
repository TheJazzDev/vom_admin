import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProgrammeFormActionsProps {
  isLoading: boolean;
  isEditing: boolean;
  mode: "draft" | "publish";
  onModeChange: (mode: "draft" | "publish") => void;
}

export function ProgrammeFormActions({
  isLoading,
  isEditing,
  mode,
  onModeChange,
}: ProgrammeFormActionsProps) {
  return (
    <div className="w-full sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t">
      <div className="flex justify-end gap-4 py-4 mx-auto px-4">
        <Button
          variant="outline"
          type="submit"
          size="lg"
          disabled={isLoading}
          onClick={() => onModeChange("draft")}
          className="flex items-center gap-2"
        >
          {isLoading && mode === "draft" && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          Save as Draft
        </Button>

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          onClick={() => onModeChange("publish")}
          className="flex items-center gap-2"
        >
          {isLoading && mode === "publish" && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {isEditing ? "Update" : "Publish"} Programme
        </Button>
      </div>
    </div>
  );
}
