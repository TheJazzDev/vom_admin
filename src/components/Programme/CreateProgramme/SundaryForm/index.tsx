"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { initialSundayProgramme } from "../../initialData";
import { draftProgrammeSchema } from "../../Schemas/draft";
import { sundayProgrammeSchema } from "../../Schemas/sunday";
import Details from "./Details";
import Hynms from "./Hynms";
import Officiating from "./Officiating";

export default function SundayProgrammeForm() {
  const [mode, setMode] = useState<"draft" | "publish">("publish");

  const form = useForm({
    resolver: zodResolver(
      mode === "draft" ? draftProgrammeSchema : sundayProgrammeSchema,
    ),
    defaultValues: initialSundayProgramme,
  });

  const onSubmit = (values: SundayProgrammeProps) => {
    const normalized = { ...initialSundayProgramme, ...values };

    if (mode === "draft") {
      console.log("Saved as draft:", normalized);
    } else {
      console.log("Published:", normalized);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Details control={form.control} />
        <Officiating control={form.control} />
        <Hynms control={form.control} />

        <div className="w-full sticky bottom-0 bg-gray-50 dark:bg-gray-900">
          <div className="flex gap-6 py-4 mx-auto">
            <Button
              variant="outline"
              type="submit"
              onClick={() => setMode("draft")}
            >
              Save programme as draft
            </Button>
            <Button type="submit" onClick={() => setMode("publish")}>
              Publish Programme
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
