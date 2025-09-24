"use client";

import { Users } from "lucide-react";
import {
  IoHeartOutline,
  IoHelpCircleOutline,
  IoMusicalNoteOutline,
  IoPersonAddOutline,
  IoShieldHalfOutline,
  IoShieldOutline,
  IoSparklesOutline,
  IoStarOutline,
  IoWomanOutline,
} from "react-icons/io5";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const BandCard = ({ band }: { band: Band }) => {
  const getIcon = () => {
    switch (band?.icon2) {
      case "IoMusicalNoteOutline":
        return <IoMusicalNoteOutline />;
      case "IoHeartOutline":
        return <IoHeartOutline />;
      case "IoShieldOutline":
        return <IoShieldOutline />;
      case "IoSparklesOutline":
        return <IoSparklesOutline />;
      case "IoWomanOutline":
        return <IoWomanOutline />;
      case "IoShieldHalfOutline":
        return <IoShieldHalfOutline />;
      case "IoHelpCircleOutline":
        return <IoHelpCircleOutline />;
      case "IoStarOutline":
        return <IoStarOutline />;
      case "IoPersonAddOutline":
        return <IoPersonAddOutline />;
      default:
        return null;
    }
  };

  return (
    <Card className="h-[180px] py-4 flex flex-col justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <CardHeader className="px-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{
                  background: `linear-gradient(135deg, ${band.gradient[0]}, ${band.gradient[1]})`,
                }}
              >
                {getIcon()}
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {band.name}
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {band.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {band.memberCount} Members
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
