"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2, IconUserPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { useCreateMember } from "@/hooks/useMembers";
import { BandSelectField } from "../Components/BandSelectField";
import { HybridMultiSelectField } from "../Components/HybridMultiSelectField";
import { createMemberSchema } from "../Schemas/createMemberSchema";

export default function CreateMemberPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const createMemberMutation = useCreateMember();

  const form = useForm<CreateMemberData>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      title: "",
      address: "",
      gender: undefined,
      dob: "",
      occupation: "",
      maritalStatus: "",
      department: [],
      band: [],
      ministry: [],
      primaryPhone: "",
      secondaryPhone: "",
      avatar: "",
    },
  });

  const onSubmit = async (data: CreateMemberData) => {
    setIsSubmitting(true);
    try {
      await createMemberMutation.mutateAsync(data);
    } catch (error) {
      console.error("Failed to create member:", error);
      // You can add toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (form.formState.isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );
      if (!confirmed) return;
    }
    router.back();
  };

  return (
    <div className="space-y-6 flex flex-col overflow-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Create New Member
              </h1>
              <p className="text-muted-foreground">
                Add a new member to the church database
              </p>
            </div>

            <div className="flex items-center gap-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting && (
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Creating..." : "Create Member"}
              </Button>
            </div>
          </div>
          {/* Basic information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUserPlus className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the member's basic details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Title <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Mr., Mrs., Dr." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Middle Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Personal information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUserPlus className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Enter the member's personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Date of Birth <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Gender <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Phone numbers and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="primaryPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Primary Phone <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+234..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondaryPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+234... (optional)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Full address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Church Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Church Information</CardTitle>
              <CardDescription>
                Positions, departments, and ministry involvement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HybridMultiSelectField
                  name="department"
                  control={form.control}
                  required
                />
                <HybridMultiSelectField
                  name="ministry"
                  control={form.control}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="joinDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Join Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Full address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <BandSelectField control={form.control} />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
        </form>
      </Form>
    </div>
  );
}
