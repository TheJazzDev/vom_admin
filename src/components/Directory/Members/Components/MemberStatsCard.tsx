import { Card, CardContent } from "@/components/ui/card";

const MemberStatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: string | number;
  subtitle?: string;

  icon: any;
  color: string;
  trend?: string;
}) => (
  <Card className="py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
    <CardContent className="px-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
          {trend && <p className={`text-xs ${color} font-medium`}>{trend}</p>}
        </div>
        <div
          className={`p-3 rounded-full ${
            color.includes("blue")
              ? "bg-blue-100 dark:bg-blue-900"
              : color.includes("green")
                ? "bg-green-100 dark:bg-green-900"
                : color.includes("yellow")
                  ? "bg-yellow-100 dark:bg-yellow-900"
                  : "bg-red-100 dark:bg-red-900"
          }`}
        >
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default MemberStatsCard;
