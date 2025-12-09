import { IconBuildingChurch } from "@tabler/icons-react";
import type { UseFormReturn } from "react-hook-form";
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
import { BandSelectField } from "../Components/BandSelectField";
import { DepartmentSelectField } from "../Components/DepartmentSelectField";
import { HybridMultiSelectField } from "../Components/HybridMultiSelectField";

interface ChurchInfoSectionProps {
  form: UseFormReturn<CreateMemberData>;
}

export function ChurchInfoSection({ form }: ChurchInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconBuildingChurch className="h-5 w-5" />
          Church Information
        </CardTitle>
        <CardDescription>
          Positions, departments, and ministry involvement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 relative">
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
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name='position'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input {...field} type='text' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <HybridMultiSelectField name="ministry" control={form.control} />
          <DepartmentSelectField control={form.control} />
          <BandSelectField control={form.control} />
        </div>
      </CardContent>
    </Card>
  );
}
