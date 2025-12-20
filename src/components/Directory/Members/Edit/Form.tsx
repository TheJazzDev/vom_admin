"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2 } from "@tabler/icons-react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import type { BandRoleEnum } from "@/enums/bands";
import { useEditMember } from "@/hooks/useMembers";
import { memberEditSchema } from "../Schemas/memberEditSchema";
import AccountControls from "./AccountControls";
import { AvatarSection } from "./AvatarSection";
import BasicInformation from "./BasicInformation";
import ChurchInformation from "./ChurchInformation";
import PersonalDetails from "./PersonalDetails";

type MemberEditForm = z.infer<typeof memberEditSchema>;

interface FormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  item: UserProfile;
  currentUserRole?: "admin" | "super_admin";
}

export function EditMemberForm({
  item,
  isOpen,
  setIsOpen,
  currentUserRole = "admin",
}: FormProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const initialValues: MemberEditForm = {
    firstName: item.firstName || "",
    middleName: item.middleName || "",
    lastName: item.lastName || "",
    email: item.email || "",
    title: item.title || "",
    position: Array.isArray(item.position) ? item.position : [],
    address: item.address || "",
    gender: item.gender || "male",
    dob: item.dob || "",
    occupation: item.occupation || "",
    maritalStatus: item.maritalStatus || "",
    department: Array.isArray(item.department) ? item.department : [],
    band: Array.isArray(item.band)
      ? (item.band.filter(
          (band: BandRoleEnum) =>
            band &&
            typeof band === "object" &&
            "name" in band &&
            "role" in band,
        ) as { name: BandKeys; role: BandRoleEnum }[])
      : [],
    ministry: Array.isArray(item.ministry) ? item.ministry : [],
    primaryPhone: item.primaryPhone || "",
    secondaryPhone: item.secondaryPhone || "",
    avatar: item.avatar || "",
    authType: item.authType || "email",
    status: item.status || "active",
    verified: item.verified ?? false,
    emailVerified: item.emailVerified ?? false,
    phoneVerified: item.phoneVerified ?? false,
    joinDate: item.joinDate ?? "",
  };

  // Validate onChange so isValid updates live
  const form = useForm<MemberEditForm>({
    resolver: zodResolver(memberEditSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const { isDirty, isValid } = form.formState;
  const editMemberMutation = useEditMember();
  const isSuperAdmin = currentUserRole === "super_admin";

  // Reset form with new values when item changes or drawer opens
  useEffect(() => {
    if (isOpen) {
      const values: MemberEditForm = {
        firstName: item.firstName || "",
        middleName: item.middleName || "",
        lastName: item.lastName || "",
        email: item.email || "",
        title: item.title || "",
        position: Array.isArray(item.position) ? item.position : [],
        address: item.address || "",
        gender: item.gender || "male",
        dob: item.dob || "",
        occupation: item.occupation || "",
        maritalStatus: item.maritalStatus || "",
        department: Array.isArray(item.department) ? item.department : [],
        band: Array.isArray(item.band)
          ? (item.band.filter(
              (band: BandRoleEnum) =>
                band &&
                typeof band === "object" &&
                "name" in band &&
                "role" in band,
            ) as { name: BandKeys; role: BandRoleEnum }[])
          : [],
        ministry: Array.isArray(item.ministry) ? item.ministry : [],
        primaryPhone: item.primaryPhone || "",
        secondaryPhone: item.secondaryPhone || "",
        avatar: item.avatar || "",
        authType: item.authType || "email",
        status: item.status || "active",
        verified: item.verified ?? false,
        emailVerified: item.emailVerified ?? false,
        phoneVerified: item.phoneVerified ?? false,
        joinDate: item.joinDate ?? "",
      };
      form.reset(values);
    }
  }, [isOpen, item, form]);

  const onSubmit = async (data: MemberEditForm) => {
    await editMemberMutation.mutateAsync(
      { id: item.id, data },
      {
        onSuccess: () => {
          setIsOpen(false);
          form.reset(initialValues);
        },
      },
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Drawer direction="bottom" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="drawer-content-container">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle>Edit Member Profile</DrawerTitle>
          <div className="flex gap-4 items-center mx-auto">
            <DrawerDescription>
              Update {item.firstName} {item.lastName}'s profile information
            </DrawerDescription>
            <DrawerDescription className="flex gap-2 items-center relative">
              <span className="font-semibold">MEMBER ID:</span>
              <span className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-lg">
                <span>{item.id}</span>
              </span>
              <button
                onClick={handleCopy}
                type="button"
                className="p-2 rounded-md transition cursor-pointer"
              >
                {copied ? (
                  <CheckIcon className="text-green-500 w-4 h-4" />
                ) : (
                  <CopyIcon className="text-gray-500 w-4 h-4" />
                )}
              </button>
              {copied && (
                <p className="text-[10px] text-green-500 absolute -right-10">
                  Copied!
                </p>
              )}
            </DrawerDescription>
          </div>
        </DrawerHeader>

        <div className="drawer-scroll-area">
          <Form {...form}>
            <form
              id="edit-member-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <AvatarSection
                control={form.control}
                memberId={item.id}
                currentAvatarUrl={item.avatar}
              />
              <Separator />
              <BasicInformation control={form.control} />
              <Separator />
              <PersonalDetails control={form.control} />
              <Separator />
              <ChurchInformation control={form.control} />
              <Separator />
              <AccountControls
                control={form.control}
                isSuperAdmin={isSuperAdmin}
              />
            </form>
          </Form>
        </div>

        <DrawerFooter className="drawer-footer-sticky">
          <div className="flex flex-row gap-6">
            <DrawerClose asChild>
              <Button variant="outline" className="w-fit flex-1">
                Cancel
              </Button>
            </DrawerClose>

            <Button
              form="edit-member-form"
              type="submit"
              disabled={editMemberMutation.isPending || !isValid || !isDirty}
              className="w-fit flex-1"
            >
              {editMemberMutation.isPending && (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editMemberMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
