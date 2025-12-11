"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateMember } from "@/hooks/useMembers";
import { AvatarUploadSection } from "../Create/AvatarUploadSection";
import { BasicInfoSection } from "../Create/BasicInfoSection";
import { ChurchInfoSection } from "../Create/ChurchInfoSection";
import { ContactInfoSection } from "../Create/ContactInfoSection";
import { PersonalInfoSection } from "../Create/PersonalInfoSection";
import { createMemberSchema } from "../Schemas/createMemberSchema";

export default function CreateMemberPage() {
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
      gender: "",
      dob: "",
      occupation: "",
      maritalStatus: "",
      department: [],
      band: [],
      ministry: [],
      position: [],
      primaryPhone: "",
      secondaryPhone: "",
      avatar: "",
      joinDate: "",
    },
  });

  const onSubmit = async (data: CreateMemberData) => {
    try {
      await createMemberMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error creating member:", error);
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

  const isSubmitting = createMemberMutation.isPending;

  return (
    <div className="space-y-6 flex flex-col overflow-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-between mt-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Create New Member
              </h1>
              <p className="text-muted-foreground">
                Add a new member to the church database
              </p>
            </div>

            <div className="flex items-center gap-4">
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

          <AvatarUploadSection form={form} />
          <BasicInfoSection form={form} />
          <PersonalInfoSection form={form} />
          <ContactInfoSection form={form} />
          <ChurchInfoSection form={form} />
        </form>
      </Form>
    </div>
  );
}
