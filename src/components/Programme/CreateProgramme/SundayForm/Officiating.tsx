import { type Control, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectOfficiatingBands } from "../../Components/OfficiatingBands";
import { SelectMemberField } from "../../Components/SelectMemberField";
import { SelectMinistersField } from "../../Components/SelectMinistersField";

const SundayOfficiating = ({
  control,
}: {
  control: Control<SundayProgrammeProps>;
}) => {
  const officiatingBands = useWatch({
    control,
    name: "officiating.band",
  });

  const noBandSelected = officiatingBands.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Officiating</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-col-1 lg:grid-cols-2 gap-6 items-start">
          <FormField
            control={control}
            name="officiating.preacher"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Preacher <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g Prophet Kehinde Ogunleti"
                    {...field}
                  />
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
                    placeholder="e.g Prophet Kehinde Ogunleti"
                    {...field}
                  />
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
          <SelectOfficiatingBands control={control} required />
        </div>

        <div className="grid grid-col-1 lg:grid-cols-2 gap-6 items-start">
          {noBandSelected && (
            <p className="lg:col-span-2 text-center mb-4 font-semibold tracking-widest text-gray-500 dark:text-gray-300">
              Select officiating band(s) to enable the fields below
            </p>
          )}

          <SelectMemberField
            control={control}
            name="officiating.worshipLeader"
            label="Worship Leader"
          />
          <SelectMemberField
            control={control}
            name="officiating.alternateWorshipLeader"
            label="Alternative Worship Leader"
          />
          <SelectMemberField
            control={control}
            name="officiating.lesson"
            label="Lesson"
          />
          <SelectMemberField
            control={control}
            name="officiating.thanksgivingPrayer"
            label="Thanksgiving Prayer"
          />
          <SelectMemberField
            control={control}
            name="officiating.intercessoryPrayer1"
            label="1st Intercessory Prayerlist"
          />
          <SelectMemberField
            control={control}
            name="officiating.intercessoryPrayer2"
            label="2nd Intercessory Prayerlist"
          />
          <SelectMemberField
            control={control}
            name="officiating.intercessoryPrayer3"
            label="3rd Intercessory Prayerlist"
          />
          <div className="col-span-2">
            <SelectMinistersField
              control={control}
              name="officiating.ministers"
              label="Officiating Ministers"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SundayOfficiating;
