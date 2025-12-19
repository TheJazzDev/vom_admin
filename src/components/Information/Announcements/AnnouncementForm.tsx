"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createAnnouncement,
  updateAnnouncement,
} from "@/services/announcementService";
import {
  type CreateAnnouncementFormData,
  createAnnouncementSchema,
} from "./schemas";

interface AnnouncementFormProps {
  announcement?: Announcement;
  mode: "create" | "edit";
}

export function AnnouncementForm({
  announcement,
  mode,
}: AnnouncementFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateAnnouncementFormData>({
    resolver: zodResolver(createAnnouncementSchema),
    defaultValues: announcement
      ? {
          title: announcement.title,
          content: announcement.content,
          type: announcement.type,
          priority: announcement.priority,
          date: announcement.date,
          author: announcement.author,
          readTime: announcement.readTime,
          tags: announcement.tags,
          isActive: announcement.isActive,
          publishDate: announcement.publishDate,
          expiryDate: announcement.expiryDate,
        }
      : {
          type: "general",
          priority: "medium",
          isActive: true,
          tags: [],
          date: new Date().toISOString().split("T")[0],
        },
  });

  const tags = watch("tags") || [];

  const createMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      toast.success("Announcement created successfully");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      router.push("/information/announcements");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create announcement");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAnnouncement,
    onSuccess: () => {
      toast.success("Announcement updated successfully");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      router.push("/information/announcements");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update announcement");
    },
  });

  const onSubmit = (data: CreateAnnouncementFormData) => {
    if (mode === "create") {
      createMutation.mutate(data);
    } else if (announcement) {
      updateMutation.mutate({ ...data, id: announcement.id });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue("tags", [...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove),
    );
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Title */}
        <div className="lg:col-span-2">
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Enter announcement title"
            className="mt-1"
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Content */}
        <div className="lg:col-span-2">
          <Label htmlFor="content">
            Content <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="content"
            {...register("content")}
            placeholder="Enter announcement content"
            rows={6}
            className="mt-1"
          />
          {errors.content && (
            <p className="text-sm text-red-500 mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Type */}
        <div>
          <Label htmlFor="type">
            Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("type")}
            onValueChange={(value) => setValue("type", value as any)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="celebration">Celebration</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
          )}
        </div>

        {/* Priority */}
        <div>
          <Label htmlFor="priority">
            Priority <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("priority")}
            onValueChange={(value) => setValue("priority", value as any)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          {errors.priority && (
            <p className="text-sm text-red-500 mt-1">
              {errors.priority.message}
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <Label htmlFor="date">
            Date <span className="text-red-500">*</span>
          </Label>
          <Input id="date" type="date" {...register("date")} className="mt-1" />
          {errors.date && (
            <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Author */}
        <div>
          <Label htmlFor="author">
            Author <span className="text-red-500">*</span>
          </Label>
          <Input
            id="author"
            {...register("author")}
            placeholder="Author name"
            className="mt-1"
          />
          {errors.author && (
            <p className="text-sm text-red-500 mt-1">{errors.author.message}</p>
          )}
        </div>

        {/* Read Time */}
        <div>
          <Label htmlFor="readTime">Read Time</Label>
          <Input
            id="readTime"
            {...register("readTime")}
            placeholder="e.g., 2 min read"
            className="mt-1"
          />
          {errors.readTime && (
            <p className="text-sm text-red-500 mt-1">
              {errors.readTime.message}
            </p>
          )}
        </div>

        {/* Publish Date */}
        <div>
          <Label htmlFor="publishDate">Publish Date (Optional)</Label>
          <Input
            id="publishDate"
            type="datetime-local"
            {...register("publishDate")}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to publish immediately
          </p>
        </div>

        {/* Expiry Date */}
        <div>
          <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
          <Input
            id="expiryDate"
            type="datetime-local"
            {...register("expiryDate")}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Announcement will hide after this date
          </p>
        </div>

        {/* Tags */}
        <div className="lg:col-span-2">
          <Label htmlFor="tagInput">Tags</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Type a tag and press Enter"
            />
            <Button type="button" onClick={addTag} variant="outline">
              Add Tag
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Is Active */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={watch("isActive")}
            onCheckedChange={(checked) =>
              setValue("isActive", checked as boolean)
            }
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Active (visible to users)
          </Label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : mode === "create"
              ? "Create Announcement"
              : "Update Announcement"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/information/announcements")}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
