"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PermissionGuard } from "@/components/Guards/PermissionGuard";
import { AnnouncementForm } from "@/components/Information/Announcements/AnnouncementForm";
import { Button } from "@/components/ui/button";
import { ActionEnum, ResourceEnum } from "@/enums";

export default function CreateAnnouncementPage() {
  return (
    <PermissionGuard
      resource={ResourceEnum.ANNOUNCEMENTS}
      action={ActionEnum.CREATE}
    >
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
            Create Announcement
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create a new announcement for the church
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <AnnouncementForm mode="create" />
        </div>
      </div>
    </PermissionGuard>
  );
}
