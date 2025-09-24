"use client";

import type { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DateField from "../../Components/DateField";
import { PsalmNumbersInput } from "../../Components/PsalmNumbersInput";

interface ShilohDetailsProps {
  control: Control<ShilohProgrammeProps>;
}

export default function ShilohDetails({ control }: ShilohDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DateField
            control={control}
            name="date"
            dayType="wednesday"
            required
          />

          <FormField
            control={control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Theme <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter Shiloh theme" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input placeholder="Enter programme topic" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="lesson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Lesson <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter lesson reference" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="openingPrayer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Opening Prayer <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <PsalmNumbersInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
