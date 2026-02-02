import { IconLoader2, IconUpload, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import type { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMemberAvatar } from "@/services/members/memberService";

interface AvatarSectionProps {
  control: Control<MemberEditForm>;
  memberId: string;
  currentAvatarUrl?: string;
}

export function AvatarSection({
  control,
  memberId,
  currentAvatarUrl,
}: AvatarSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Firebase Storage
      const downloadUrl = await updateMemberAvatar(
        file,
        currentAvatarUrl,
        memberId,
      );
      onChange(downloadUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload avatar. Please try again.");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = (onChange: (value: string) => void) => {
    onChange("");
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold text-blue-500">
        Profile Picture
      </Label>
      <FormField
        control={control}
        name="avatar"
        render={({ field }) => {
          const displayUrl = previewUrl || field.value || currentAvatarUrl;

          return (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  {displayUrl && (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 shrink-0">
                      <Image
                        src={displayUrl}
                        alt="Avatar preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAvatar(field.onChange)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition cursor-pointer"
                        disabled={isUploading}
                      >
                        <IconX className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4">
                      <Input
                        id={`avatar-upload-${memberId}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, field.onChange)}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document
                            .getElementById(`avatar-upload-${memberId}`)
                            ?.click()
                        }
                        disabled={isUploading}
                        className="flex items-center gap-2"
                      >
                        {isUploading ? (
                          <>
                            <IconLoader2 className="h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <IconUpload className="h-4 w-4" />
                            {field.value ? "Change Picture" : "Upload Picture"}
                          </>
                        )}
                      </Button>
                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleRemoveAvatar(field.onChange)}
                          disabled={isUploading}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recommended: Square image, at least 200x200px, max 5MB
                    </p>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}
