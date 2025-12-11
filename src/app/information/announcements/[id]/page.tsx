"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAnnouncementById } from "@/services/announcementService";

export default function ViewAnnouncementPage() {
  const params = useParams();
  const _router = useRouter();
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

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      medium: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    };
    return colors[priority] || colors.medium;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      general: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      event: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      urgent: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      celebration:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    };
    return colors[type] || colors.general;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex gap-2 mb-3">
              <Badge className={getTypeColor(announcement.type)}>
                {announcement.type.toUpperCase()}
              </Badge>
              <Badge className={getPriorityColor(announcement.priority)}>
                {announcement.priority.toUpperCase()}
              </Badge>
              {announcement.isActive ? (
                <Badge className="bg-green-500">Active</Badge>
              ) : (
                <Badge variant="secondary">Inactive</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {announcement.title}
            </h1>
          </div>
          <Link href={`/information/announcements/${id}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        {/* Meta Info */}
        <div className="flex flex-wrap gap-6 pb-6 border-b border-gray-200 dark:border-gray-800 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(announcement.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <UserIcon className="w-4 h-4" />
            <span>{announcement.author}</span>
          </div>
          {announcement.readTime && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{announcement.readTime}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none mb-6">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {announcement.content}
          </p>
        </div>

        {/* Tags */}
        {announcement.tags.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {announcement.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        {(announcement.publishDate || announcement.expiryDate) && (
          <div className="border-t border-gray-200 dark:border-gray-800 mt-6 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcement.publishDate && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Publish Date
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(announcement.publishDate)}
                  </p>
                </div>
              )}
              {announcement.expiryDate && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Expiry Date
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(announcement.expiryDate)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div>
              <span className="font-medium">Created:</span>{" "}
              {formatDate(announcement.createdAt)}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>{" "}
              {formatDate(announcement.updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
