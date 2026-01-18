"use client";

import { format } from "date-fns";
import {
  Book,
  Calendar,
  Edit,
  MoreVertical,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeletePrayer,
  usePrayers,
  useUpdatePrayer,
} from "@/hooks/usePrayers";

export function PrayersList() {
  const { data: prayers, isLoading, error } = usePrayers();
  const deleteMutation = useDeletePrayer();
  const updateMutation = useUpdatePrayer();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this prayer?")) {
      setDeletingId(id);
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Prayer deleted successfully");
      } catch (_error) {
        toast.error("Failed to delete prayer");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleToggleActive = async (prayer: DailyPrayer) => {
    try {
      await updateMutation.mutateAsync({
        id: prayer.id,
        updates: { isActive: !prayer.isActive },
      });
      toast.success(
        prayer.isActive ? "Prayer deactivated" : "Prayer activated",
      );
    } catch (_error) {
      toast.error("Failed to update prayer status");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-600">
            Failed to load prayers. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!prayers || prayers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <Book className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            No prayers yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first daily prayer to get started
          </p>
          <Button asChild>
            <Link href="/ministry/prayers/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Prayer
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Daily Prayers
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {prayers.length} prayer{prayers.length !== 1 && "s"}
          </p>
        </div>
        <Button asChild>
          <Link href="/ministry/prayers/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Prayer
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {prayers.map((prayer) => (
          <Card
            key={prayer.id}
            className={`transition-opacity ${
              deletingId === prayer.id ? "opacity-50" : ""
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{prayer.title}</CardTitle>
                    <Badge variant={prayer.isActive ? "default" : "secondary"}>
                      {prayer.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(prayer.date), "PPP")}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {prayer.authorName}
                    </span>
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/ministry/prayers/${prayer.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleToggleActive(prayer)}
                    >
                      {prayer.isActive ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(prayer.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {prayer.scriptureReference}
                  </p>
                  {prayer.scriptureText && (
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1 italic">
                      "{prayer.scriptureText}"
                    </p>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {prayer.content.length > 300
                    ? `${prayer.content.substring(0, 300)}...`
                    : prayer.content}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
