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

interface ShilohOfficiatingProps {
  control: Control<ShilohProgrammeProps>;
}

export default function ShilohOfficiating({ control }: ShilohOfficiatingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Officiating</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="officiating.lesson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Lesson Leader <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter lesson leader name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="officiating.preacher"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Preacher <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter preacher name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="officiating.worshipLeader"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Worship Leader <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter worship leader name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="officiating.prayerMinistration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Prayer Ministration <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter prayer ministration leader"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="officiating.revivalist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Revivalist</FormLabel>
                <FormControl>
                  <Input placeholder="Enter revivalist name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="officiating.preparatoryPrayer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preparatory Prayer</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter preparatory prayer leader"
                    {...field}
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
