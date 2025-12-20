import { Suspense } from "react";
import { PrayersList } from "@/components/Ministry/Prayers";

export const metadata = {
  title: "VOM - Daily Prayers",
};

export default function PrayersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Daily Prayers
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage daily prayers for the congregation
        </p>
      </div>
      <Suspense fallback={<div className="p-6">Loading prayers...</div>}>
        <PrayersList />
      </Suspense>
    </div>
  );
}
