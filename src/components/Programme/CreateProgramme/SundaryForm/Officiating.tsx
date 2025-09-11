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
import { SelectOfficiatingBands } from "../../Components/OfficiatingBands";

const Officiating = ({
  control,
}: {
  control: Control<SundayProgrammeProps>;
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Officiating</h3>

      <div className="grid grid-col-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-1">
          <SelectOfficiatingBands control={control} required />
        </div>
        <FormField
          control={control}
          name="officiating.preacher"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preacher</FormLabel>
              <FormControl>
                <Input placeholder="e.g Prophet Kehinde Ogunleti" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <p className="text-center my-6 font-semibold">
        Select officiating band to enable the fields below
      </p>

      <div className="grid grid-col-1 lg:grid-cols-3 gap-4 items-start">
        <FormField
          control={control}
          name="officiating.lesson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson</FormLabel>
              <FormControl>
                <Input placeholder="e.g Pst V.A Adeyemo" {...field} />
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
              <FormLabel>Worship Leader</FormLabel>
              <FormControl>
                <Input placeholder="e.g Bro Taiwo Babarinde" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="officiating.alternateWorshipLeader"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alternative Worship Leader</FormLabel>
              <FormControl>
                <Input placeholder="e.g Bro Damilola Adekunle" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="officiating.intercessoryPrayer1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>1st Intercessory Prayerlist</FormLabel>
              <FormControl>
                <Input placeholder="e.g Sarah Babarinde" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="officiating.intercessoryPrayer2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>2nd Intercessory Prayerslist</FormLabel>
              <FormControl>
                <Input placeholder="e.g Sis Tobi Olawole" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="officiating.intercessoryPrayer3"
          render={({ field }) => (
            <FormItem>
              <FormLabel>3rd Intercessory Prayerlist</FormLabel>
              <FormControl>
                <Input placeholder="e.g Sis Damilola Falomo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="officiating.workersPrayerLeader"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workers’ Prayer Leader</FormLabel>
              <FormControl>
                <Input placeholder="Leader of workers’ prayer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="officiating.sundaySchoolTeacher"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sunday School Teacher</FormLabel>
              <FormControl>
                <Input placeholder="e.g S/M/I/I O Ogunleti" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="officiating.ministers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ministers</FormLabel>
              <FormControl>
                <Textarea rows={2} placeholder="List of ministers" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default Officiating;
