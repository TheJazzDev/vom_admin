import { CalendarDays, Clock, Edit, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/utils";

const getTypeColor = (type: string) => {
  switch (type) {
    case "sunday":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "shilo":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "vigil":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getStatusColor = (status: string) => {
  return status === "published"
    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
};

export const ProgrammeCard = ({ programme }: { programme: any }) => {
  const router = useRouter();

  const params = new URLSearchParams({
    id: programme.id,
    type: programme.type,
  });

  return (
    <Card className="py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3 px-4 h-full">
        <div className="space-y-1">
          <CardTitle className="font-semibold text-gray-900 dark:text-gray-100">
            {programme.topic}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {programme.theme || ""}
          </CardDescription>
          <div className="flex items-end gap-2 capitalize">
            <Badge className={getTypeColor(programme.type)}>
              {programme.type}
            </Badge>
            <Badge className={getStatusColor(programme.status)}>
              {programme.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4">
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {formatDate(programme.date)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {programme.time}
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {programme.preacher}
          </div>
        </div>

        <div className="flex gap-2">
          {/* <Button
            onClick={() => {
              router.push(`/programmes/view?${params.toString()}`);
            }}
            variant='outline'
            size='sm'>
            <Eye className='h-4 w-4 mr-1' />
            View
          </Button> */}
          {programme.status === "draft" && (
            <>
              <Button
                onClick={() =>
                  router.push(`/programmes/edit?${params.toString()}`)
                }
                variant="outline"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
