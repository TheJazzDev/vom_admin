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
import { Textarea } from "@/components/ui/textarea";
import DateField from "../../Components/DateField";
import { PsalmNumbersInput } from "../../Components/PsalmNumbersInput";

const SundayDetails = ({
  control,
}: {
  control: Control<SundayProgrammeProps>;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-col-1 lg:grid-cols-2 gap-6 items-start">
          <DateField control={control} name="date" dayType="sunday" required />
          <FormField
            control={control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <FormControl>
                  <Input placeholder="e.g Double Glory" {...field} />
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
                  <Input placeholder="e.g Manifestation of Power" {...field} />
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
                <FormLabel>Lesson</FormLabel>
                <FormControl>
                  <Input placeholder="e.g Act 5:12-25" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="callToWorship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Call to Worship</FormLabel>
                <FormControl>
                  <Input placeholder="e.g Acts 5:12" {...field} />
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
                <FormLabel>Opening Prayer</FormLabel>
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

          <div className="lg:col-span-2">
            <FormField
              control={control}
              name="callToWorshipText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call to Worship Text</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="e.g ENITORINA: EJE KI A FI OTITO OKAN SUMBO TOSI NI EKUN IGBAGBO, KI A SI WE OKAN WA MO KURO NINU ERI OKAN BUBURU KI A SI FI OMI MIMO WE ARA WAN NU. E JE KI A DI IJEWO IRETI WA MU SINSIN NI AISIYEMEJI; (NITORIPE OLOOTO NI ENI TI O SE ILERI) HEB 10:22-23"
                      {...field}
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

export default SundayDetails;
