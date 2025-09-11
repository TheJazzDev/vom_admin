import type { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Hynms = ({ control }: { control: Control<SundayProgrammeProps> }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Hymns</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="hymns.processional"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Processional</FormLabel>
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
              <FormLabel>Introit</FormLabel>
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
              <FormLabel>Opening Hymn</FormLabel>
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
              <FormLabel>Sermon Hymn</FormLabel>
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
              <FormLabel>Vesper Hymn</FormLabel>
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
              <FormLabel>Recessional Hymn</FormLabel>
              <FormControl>
                <Input placeholder="Recessional hymn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="hymns.thanksgiving"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thanksgiving Hymns</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="Enter thanksgiving hymns (comma-separated or list)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default Hynms;
