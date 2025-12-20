"use client";

import { BookOpen, Calendar, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ShilohProgrammeForm from "./ShilohForm";
import SundayProgrammeForm from "./SundayForm";
import VigilProgrammeForm from "./VigilForm";

const programmeTypes = [
  {
    type: "sunday",
    title: "Sunday Service",
    description: "Create a programme for regular Sunday worship service",
    icon: Sun,
    color: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    type: "shiloh",
    title: "Shiloh Service",
    description: "Create a programme for Shiloh revival service",
    icon: BookOpen,
    color: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    type: "vigil",
    title: "Vigil Service",
    description: "Create a programme for night vigil service",
    icon: Moon,
    color: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
];

const ProgrammeTypeSelector = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Create Programme
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Select the type of programme you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {programmeTypes.map((programme) => (
          <Link
            key={programme.type}
            href={`/programmes/create?type=${programme.type}`}
          >
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${programme.color}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {programme.title}
                  </CardTitle>
                  <div className={`p-3 rounded-full bg-white dark:bg-gray-800 shadow-sm`}>
                    <programme.icon className={`h-6 w-6 ${programme.iconColor}`} />
                  </div>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {programme.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  Click to create
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

const CreateProgramme = () => {
  const searchParams = useSearchParams().get("type");

  if (!searchParams) {
    return <ProgrammeTypeSelector />;
  }

  return (
    <div className="mt-6">
      {searchParams === "sunday" && <SundayProgrammeForm type="sunday" />}
      {searchParams === "shiloh" && <ShilohProgrammeForm type="shilo" />}
      {searchParams === "vigil" && <VigilProgrammeForm type="vigil" />}
    </div>
  );
};

export default CreateProgramme;
