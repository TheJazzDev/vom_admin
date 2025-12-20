"use client";

import { useParams } from "next/navigation";
import { CreatePrayerForm } from "@/components/Ministry/Prayers";
import { usePrayerById } from "@/hooks/usePrayers";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPrayerPage() {
  const params = useParams();
  const prayerId = params.id as string;
  const { data: prayer, isLoading, error } = usePrayerById(prayerId);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error || !prayer) {
    return (
      <div className="p-6">
        <p className="text-red-600">Prayer not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Edit Prayer
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Update the daily prayer details
        </p>
      </div>
      <CreatePrayerForm initialData={prayer} isEditing />
    </div>
  );
}
