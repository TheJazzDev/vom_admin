import type { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { HybridMultiSelectField } from "../Components/HybridMultiSelectField";

const AccountControls = ({
  control,
  isSuperAdmin,
}: {
  isSuperAdmin: boolean;
  control: Control<MemberEditForm>;
}) => {
  return (
    <div className="space-y-4 mt-6 pb-6">
      <Label className="text-base font-semibold text-blue-500">
        Account Controls
      </Label>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="verified"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <FormLabel>Verified</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  disabled={!isSuperAdmin}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="emailVerified"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <FormLabel>Email Verified</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  disabled={!isSuperAdmin}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="phoneVerified"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <FormLabel>Phone Verified</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  disabled={!isSuperAdmin}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FormField
          control={control}
          name="authType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Authentication</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full" disabled={!isSuperAdmin}>
                    <SelectValue placeholder="Select authentication type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={`w-full ${
                      !isSuperAdmin
                        ? "bg-muted/50 border-muted cursor-not-allowed"
                        : ""
                    }`}
                    disabled={!isSuperAdmin}
                  >
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <HybridMultiSelectField
        disabled
        name="position"
        control={control}
        allowCustomInput={true}
      />
    </div>
  );
};

export default AccountControls;
