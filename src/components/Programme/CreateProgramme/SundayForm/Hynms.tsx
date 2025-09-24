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
import { ArrayInput } from "../../Components/ArrayTextArea";

const SundayHynms = ({
  control,
}: {
  control: Control<SundayProgrammeProps>;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Hynms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="hymns.processional"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Processional <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Processional hymn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="hymns.introit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Introit <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Introit hymn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="hymns.opening"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Opening Hymn <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Opening hymn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="hymns.sermon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sermon Hymn <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Sermon hymn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="hymns.vesper"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Vesper Hymn <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Vesper hymn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="hymns.recessional"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Recessional Hymn <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Recessional hymn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-2 gap-6">
            <FormField
              control={control}
              name="hymns.thanksgiving"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    Thanksgiving Hymns <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <ArrayInput
                      placeholder="Enter hymn title (e.g., Hymn 123: Great is Thy Faithfulness)"
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
        </div>
      </CardContent>
    </Card>
  );
};

export default SundayHynms;
