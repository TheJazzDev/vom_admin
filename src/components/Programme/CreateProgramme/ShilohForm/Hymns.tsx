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

interface ShilohHymnsProps {
  control: Control<ShilohProgrammeProps>;
}

export default function ShilohHymns({ control }: ShilohHymnsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Hymns</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="hynms.opening"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening Hymn</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter opening hymn number or title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="hynms.sermon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sermon Hymn</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter sermon hymn number or title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="hynms.prayer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prayer Hymn</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter prayer hymn number or title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="hynms.thanksgiving"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thanksgiving Hymn</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter thanksgiving hymn number or title"
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
