import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import type { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const BasicInformation = ({
  control,
  memberId,
}: {
  memberId: string;
  control: Control<MemberEditForm>;
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(memberId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold text-blue-500">
        Basic Information
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        <div>
          <FormLabel>
            Member Id <span className="text-red-500">*</span>
          </FormLabel>
          <div className="flex gap-2 items-center mt-2 relative">
            <span className="w-full cursor-not-allowed">
              <Input value={memberId} disabled />
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
              <p className="text-[10px] text-green-500 absolute -top-3 right-0">
                Copied!
              </p>
            )}
          </div>
        </div>
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Mr., Mrs., Dr." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
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
          control={control}
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
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
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
      </div>
    </div>
  );
};

export default BasicInformation;
