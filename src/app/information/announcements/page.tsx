"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Eye, Filter, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { PermissionGuard } from "@/components/Guards/PermissionGuard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionEnum, ResourceEnum } from "@/enums";
import {
  deleteAnnouncement,
  getAnnouncements,
} from "@/services/announcementService";

export default function AnnouncementsPage() {
  const queryClient = useQueryClient();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements", typeFilter, priorityFilter],
    queryFn: () =>
      getAnnouncements({
        type: typeFilter !== "all" ? typeFilter : undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id, false),
    onSuccess: () => {
      toast.success("Announcement deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete announcement");
    },
  });

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary"> = {
      low: "secondary",
      medium: "default",
      high: "destructive",
    };
    return <Badge variant={variants[priority]}>{priority.toUpperCase()}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      general: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      event: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      urgent: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      celebration:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    };
    return (
      <Badge className={colors[type]} variant="outline">
        {type.toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <PermissionGuard
      resource={ResourceEnum.ANNOUNCEMENTS}
      action={ActionEnum.VIEW}
    >
      <div className="py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Announcements
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage church announcements and notices
            </p>
          </div>
          <Link href="/information/announcements/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Announcement
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filters:
            </span>
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="celebration">Celebration</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          {(typeFilter !== "all" || priorityFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTypeFilter("all");
                setPriorityFilter("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No announcements found</p>
              <Link href="/information/announcements/create">
                <Button className="mt-4">Create your first announcement</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((announcement: Announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="text-sm">{announcement.title}</p>
                        {announcement.tags.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {announcement.tags
                              .slice(0, 3)
                              .map((tag: string) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            {announcement.tags.length > 3 && (
                              <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                                +{announcement.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(announcement.type)}</TableCell>
                    <TableCell>
                      {getPriorityBadge(announcement.priority)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(announcement.date)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {announcement.author}
                    </TableCell>
                    <TableCell>
                      {announcement.isActive ? (
                        <Badge variant="default" className="bg-green-500">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/information/announcements/${announcement.id}`}
                        >
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link
                          href={`/information/announcements/${announcement.id}/edit`}
                        >
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(announcement.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this announcement? This action
                will mark it as inactive. You can restore it later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PermissionGuard>
  );
}
