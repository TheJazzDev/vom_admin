"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePrayer, useUpdatePrayer } from "@/hooks/usePrayers";
import { cn } from "@/lib/utils";

import {
  type DailyPrayerFormData,
  dailyPrayerSchema,
} from "./Schemas/prayerSchema";

interface CreatePrayerFormProps {
  initialData?: DailyPrayer;
  isEditing?: boolean;
}

export function CreatePrayerForm({
  initialData,
  isEditing = false,
}: CreatePrayerFormProps) {
  const router = useRouter();
  const createMutation = useCreatePrayer();
  const updateMutation = useUpdatePrayer();

  const form = useForm<DailyPrayerFormData>({
    resolver: zodResolver(dailyPrayerSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      scriptureReference: initialData?.scriptureReference || "",
      scriptureText: initialData?.scriptureText || "",
      date: initialData?.date || format(new Date(), "yyyy-MM-dd"),
      authorName: initialData?.authorName || "",
      authorId: initialData?.authorId || "",
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(data: DailyPrayerFormData) {
    try {
      if (isEditing && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          updates: data,
        });
        toast.success("Prayer updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Prayer created successfully");
      }
      router.push("/ministry/prayers");
    } catch (_error) {
      toast.error(
        isEditing ? "Failed to update prayer" : "Failed to create prayer",
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Prayer" : "Create Daily Prayer"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the daily prayer details"
            : "Create a new daily prayer for the congregation"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter prayer title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The date this prayer should be shown
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scriptureReference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scripture Reference</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Psalm 23:1-6" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scriptureText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scripture Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the scripture text..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The full text of the scripture reference
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prayer Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the prayer..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter author name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter author ID (user ID)" {...field} />
                  </FormControl>
                  <FormDescription>
                    The user ID of the author from the members collection
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                    ? "Update Prayer"
                    : "Create Prayer"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
