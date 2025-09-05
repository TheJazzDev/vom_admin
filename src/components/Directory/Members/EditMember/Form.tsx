"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2 } from "@tabler/icons-react";
import { useState } from "react";
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
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useEditMember } from "@/hooks/useMembers";
import { memberEditSchema } from "../Schemas/memberEditSchema";
import type { tableSchema } from "../Schemas/tableSchema";
import AccountControls from "./AccountControls";
import BasicInformation from "./BasicInformation";
import ChurchInformation from "./ChurchInformation";
import PersonalDetails from "./PersonalDetails";

type MemberEditForm = z.infer<typeof memberEditSchema>;

interface FormProps {
  item: z.infer<typeof tableSchema>;
  currentUserRole?: "admin" | "super_admin";
}

export function EditMemberForm({ item, currentUserRole = "admin" }: FormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const initialValues: MemberEditForm = {
    firstName: item.firstName || "",
    lastName: item.lastName || "",
    email: item.email || "",
    title: item.title || "",
    position: Array.isArray(item.position) ? item.position : [],
    address: item.address || "",
    gender: item.gender || "male",
    dob: item.dob || "",
    department: Array.isArray(item.department) ? item.department : [],
    band: Array.isArray(item.band) ? item.band : [],
    ministry: Array.isArray(item.ministry) ? item.ministry : [],
    primaryPhone: item.primaryPhone || "",
    secondaryPhone: item.secondaryPhone || "",
    authType: item.authType || "email",
    status: item.status || "active",
    verified: item.verified ?? false,
    emailVerified: item.emailVerified ?? false,
    phoneVerified: item.phoneVerified ?? false,
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

  const onSubmit = async (data: MemberEditForm) => {
    await editMemberMutation.mutateAsync(
      { memberId: item.memberId, data },
      {
        onSuccess: () => {
          setIsOpen(false);
          form.reset(initialValues);
        },
      },
    );
  };

  return (
    <Drawer direction="bottom" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground w-64 px-0 text-left flex items-center gap-2 cursor-pointer hover:underline"
        >
          <p className="flex-1">{item.firstName}</p>
          <p className="flex-1">{item.lastName}</p>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="drawer-content-container">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle>Edit Member Profile</DrawerTitle>
          <DrawerDescription>
            Update {item.firstName} {item.lastName}'s profile information
          </DrawerDescription>
        </DrawerHeader>

        <div className="drawer-scroll-area">
          <Form {...form}>
            <form
              id="edit-member-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <BasicInformation
                control={form.control}
                memberId={item.memberId}
              />
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
              disabled={editMemberMutation.isPending || !isDirty || !isValid}
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
