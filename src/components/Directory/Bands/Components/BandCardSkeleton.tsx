import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const BandCardSkeleton = () => {
  return (
    <Card className="h-[180px] py-4 flex flex-col justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse">
      <CardHeader className="px-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mt-2 w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      </CardContent>
    </Card>
  );
};
