import { IconLoader2, IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { uploadMemberAvatar } from "@/services/members/memberService";

interface AvatarUploadSectionProps {
  form: UseFormReturn<CreateMemberData>;
}

export function AvatarUploadSection({ form }: AvatarUploadSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      const downloadUrl = await uploadMemberAvatar(file);
      form.setValue("avatar", downloadUrl, { shouldValidate: true });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload avatar. Please try again.");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    form.setValue("avatar", "", { shouldValidate: true });
    setPreviewUrl(null);
  };

  const avatarUrl = form.watch("avatar");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconPhoto className="h-5 w-5" />
          Profile Picture
        </CardTitle>
        <CardDescription>
          Upload a profile picture for the member (optional)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="avatar"
          render={() => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-4">
                  {(previewUrl || avatarUrl) && (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                      <Image
                        src={previewUrl || avatarUrl}
                        alt="Avatar preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        disabled={isUploading}
                      >
                        <IconX className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                      disabled={isUploading}
                      className="flex items-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <IconUpload className="h-4 w-4" />
                          {avatarUrl ? "Change Picture" : "Upload Picture"}
                        </>
                      )}
                    </Button>
                    {avatarUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleRemoveAvatar}
                        disabled={isUploading}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    Recommended: Square image, at least 200x200px, max 5MB
                  </p>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
