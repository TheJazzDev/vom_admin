import { Suspense } from "react";
import { CreatePrayerForm } from "@/components/Ministry/Prayers";

export const metadata = {
  title: "VOM - Create Prayer",
};

export default function CreatePrayerPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Create Daily Prayer
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create a new daily prayer for the congregation
        </p>
      </div>
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <CreatePrayerForm />
      </Suspense>
    </div>
  );
}
