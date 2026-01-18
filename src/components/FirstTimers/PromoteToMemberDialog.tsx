"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { promoteToMember } from "@/services/firstTimers";
import { useAdminStore } from "@/stores/adminStore";

const promoteMemberSchema = z.object({
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  gender: z.enum(["male", "female"]).optional(),
  dob: z.string().optional(),
});

type PromoteMemberFormData = z.infer<typeof promoteMemberSchema>;

interface PromoteToMemberDialogProps {
  firstTimer: FirstTimer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PromoteToMemberDialog({
  firstTimer,
  open,
  onOpenChange,
  onSuccess,
}: PromoteToMemberDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAdminStore();

  const form = useForm<PromoteMemberFormData>({
    resolver: zodResolver(promoteMemberSchema),
    defaultValues: {
      email: "",
      gender: undefined,
      dob: "",
    },
  });

  async function onSubmit(data: PromoteMemberFormData) {
    if (!user?.id) {
      toast.error("Admin user not found");
      return;
    }

    try {
      setIsSubmitting(true);

      const additionalData: Partial<UserProfile> = {};

      // Only add fields if they have values
      if (data.email && data.email.trim() !== "") {
        additionalData.email = data.email;
      }
      if (data.gender) {
        additionalData.gender = data.gender;
      }
      if (data.dob && data.dob.trim() !== "") {
        additionalData.dob = data.dob;
      }

      const memberId = await promoteToMember(
        firstTimer.id,
        user.id,
        additionalData,
      );

      toast.success(
        `Successfully promoted to member! Member ID: ${memberId.slice(0, 8)}...`,
      );
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error promoting to member:", error);
      toast.error("Failed to promote to member");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Promote to Member
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Convert {firstTimer.firstName} {firstTimer.lastName} to a permanent
            church member
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 rounded-lg bg-muted p-3 sm:p-4">
          <h4 className="mb-2 text-xs font-medium sm:text-sm">
            Basic Information (from First Timer record)
          </h4>
          <div className="space-y-1 text-xs sm:text-sm">
            <p>
              <span className="text-muted-foreground">Name:</span>{" "}
              {firstTimer.firstName} {firstTimer.lastName}
            </p>
            <p>
              <span className="text-muted-foreground">Phone:</span>{" "}
              {firstTimer.phoneNumber}
            </p>
            <p>
              <span className="text-muted-foreground">Address:</span>{" "}
              {firstTimer.address}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4"
          >
            <p className="text-muted-foreground text-xs sm:text-sm">
              Add additional information for the member account:
            </p>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">
                    Email (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="member@example.com"
                      {...field}
                      className="text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Member's email address for communication
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">
                    Gender (Optional)
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-xs sm:text-sm">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male" className="text-xs sm:text-sm">
                        Male
                      </SelectItem>
                      <SelectItem value="female" className="text-xs sm:text-sm">
                        Female
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">
                    Date of Birth (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Member's date of birth
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950/20 sm:p-4">
              <p className="text-xs text-yellow-800 dark:text-yellow-200 sm:text-sm">
                <strong>Note:</strong> This will create a member account with
                the first timer's information. The first timer record will be
                marked as "converted" and linked to the new member account.
              </p>
            </div>

            <DialogFooter className="gap-2 pt-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="text-xs sm:text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-xs sm:text-sm"
              >
                {isSubmitting ? "Promoting..." : "Promote to Member"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
