"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowLeft, IconLoader2, IconSend } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BandKeysEnum, DepartmentKeysEnum } from "@/enums";

const notificationSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  body: z
    .string()
    .min(1, "Message is required")
    .max(500, "Message must be less than 500 characters"),
  type: z.enum(["announcement", "programme", "prayer", "sermon", "general"]),
  priority: z.enum(["normal", "high", "urgent"]),
  targetType: z.enum([
    "all",
    "members",
    "guests",
    "band",
    "department",
    "custom",
  ]),
  bandKeys: z.array(z.string()).optional(),
  departmentKeys: z.array(z.string()).optional(),
  route: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

export default function SendNotificationPage() {
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [_recipientCount, _setRecipientCount] = useState<number | null>(null);

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      body: "",
      type: "general",
      priority: "normal",
      targetType: "all",
      bandKeys: [],
      departmentKeys: [],
      route: "",
      imageUrl: "",
    },
  });

  const targetType = form.watch("targetType");

  const onSubmit = async (data: NotificationFormData) => {
    try {
      setIsSending(true);

      const payload: SendNotificationRequest = {
        title: data.title,
        body: data.body,
        type: data.type,
        priority: data.priority,
        route: data.route,
        imageUrl: data.imageUrl,
        recipients: {
          type: data.targetType,
          bandKeys: data.targetType === "band" ? data.bandKeys : undefined,
          departmentKeys:
            data.targetType === "department" ? data.departmentKeys : undefined,
        },
        data: {
          type: data.type,
        },
      };

      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result: SendNotificationResponse = await response.json();

      if (result.success) {
        toast.success(`Notification sent to ${result.recipientCount} members!`);
        router.push("/notifications");
      } else {
        toast.error(result.error || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("An error occurred while sending the notification");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/notifications">
            <IconArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Send Notification</h1>
          <p className="text-sm text-muted-foreground">
            Compose and send push notifications to members
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Content</CardTitle>
                  <CardDescription>
                    Compose your notification message
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter notification title"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Keep it short and clear (max 100 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter notification message"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value.length}/500 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notification Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="announcement">
                              Announcement
                            </SelectItem>
                            <SelectItem value="programme">Programme</SelectItem>
                            <SelectItem value="prayer">Prayer</SelectItem>
                            <SelectItem value="sermon">Sermon</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="route"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deep Link (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="/(tabs)/home or /programme/123"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Where to navigate when tapped
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Target Audience */}
              <Card>
                <CardHeader>
                  <CardTitle>Target Audience</CardTitle>
                  <CardDescription>
                    Select who should receive this notification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="targetType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Send to</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select audience" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="members">
                              Members Only
                            </SelectItem>
                            <SelectItem value="guests">Guests Only</SelectItem>
                            <SelectItem value="band">Specific Band</SelectItem>
                            <SelectItem value="department">
                              Specific Department
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {targetType === "band" && (
                    <FormField
                      control={form.control}
                      name="bandKeys"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Bands</FormLabel>
                          <FormDescription>
                            Hold Ctrl/Cmd to select multiple
                          </FormDescription>
                          <FormControl>
                            <select
                              multiple
                              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              onChange={(e) => {
                                const values = Array.from(
                                  e.target.selectedOptions,
                                  (option) => option.value,
                                );
                                field.onChange(values);
                              }}
                            >
                              {Object.values(BandKeysEnum).map((band) => (
                                <option key={band} value={band}>
                                  {band.replace(/_/g, " ")}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {targetType === "department" && (
                    <FormField
                      control={form.control}
                      name="departmentKeys"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Departments</FormLabel>
                          <FormDescription>
                            Hold Ctrl/Cmd to select multiple
                          </FormDescription>
                          <FormControl>
                            <select
                              multiple
                              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              onChange={(e) => {
                                const values = Array.from(
                                  e.target.selectedOptions,
                                  (option) => option.value,
                                );
                                field.onChange(values);
                              }}
                            >
                              {Object.values(DepartmentKeysEnum).map((dept) => (
                                <option key={dept} value={dept}>
                                  {dept.replace(/_/g, " ")}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How it will look</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border bg-muted p-4">
                    <div className="font-semibold text-sm mb-1">
                      {form.watch("title") || "Notification Title"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {form.watch("body") || "Your message will appear here"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button type="submit" className="w-full" disabled={isSending}>
                  {isSending ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <IconSend className="mr-2 h-4 w-4" />
                      Send Notification
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.back()}
                  disabled={isSending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
