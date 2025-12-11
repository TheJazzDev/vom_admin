"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnnouncementForm } from "@/components/Information/Announcements/AnnouncementForm";
import { Button } from "@/components/ui/button";
import { getAnnouncementById } from "@/services/announcementService";

export default function EditAnnouncementPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: announcement, isLoading } = useQuery({
    queryKey: ["announcement", id],
    queryFn: () => getAnnouncementById(id),
  });

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading announcement...</p>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="py-6">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 mb-4">Announcement not found</p>
          <Link href="/information/announcements">
            <Button>Back to Announcements</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/information/announcements">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Announcements
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Announcement
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Update announcement details
        </p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <AnnouncementForm mode="edit" announcement={announcement} />
      </div>
    </div>
  );
}
