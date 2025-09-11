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

const Details = ({ control }: { control: Control<SundayProgrammeProps> }) => {
  return (
    <>
      <div className="grid grid-col-1 lg:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="openingPrayer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opening Prayer</FormLabel>
              <FormControl>
                <Input placeholder="Psalm 51, 19 & 24" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-col-1 lg:grid-cols-3 gap-4 items-start">
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
    </>
  );
};

export default Details;
