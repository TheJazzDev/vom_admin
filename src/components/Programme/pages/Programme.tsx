"use client";

import {
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarDays,
  Clock,
  FileText,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProgrammeStats, useRecentProgrammes } from "@/hooks/useProgrammes";
import { formatDate } from "@/utils";
import { RecentProgrammeSkeleton } from "../Components/Skeletons/RecentProgrammeSkeleton";
import { StatsCardSkeleton } from "../Components/Skeletons/StatsCardSkeleton";

const ProgrammeDashboard = () => {
  const [_type, _setType] = useState<ProgrammeType>("sunday");

  const router = useRouter();
  const { data: stats, isLoading: statsLoading } = useProgrammeStats();
  const { data: recentProgrammes, isLoading: recentLoading } =
    useRecentProgrammes(5);

  const navigationCards = [
    {
      title: "Upcoming Programmes",
      description: "View and manage upcoming services and events",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      href: "/programmes/upcoming",
      count: stats?.upcoming || 0,
    },
    {
      title: "Past Programmes",
      description: "Browse completed programmes and services",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      href: "/programmes/past",
      count: stats?.past || 0,
    },
    {
      title: "Draft Programmes",
      description: "Continue working on saved drafts",
      icon: FileText,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-800",
      href: "/programmes/drafts",
      count: stats?.drafts || 0,
    },
  ];

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Programme Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage church programmes, services, and special events
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Programme
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
            <DropdownMenuItem
              onClick={() => router.push(`/programmes/create?type=sunday`)}
            >
              Sunday Programme
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/programmes/create?type=shiloh`)}
            >
              Shiolh Programme
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/programmes/create?type=vigil`)}
            >
              Vigil Programme
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <Card className="py-6">
              <CardContent className="px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Programmes
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats?.total || 0}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="py-6">
              <CardContent className="px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Upcoming
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats?.upcoming || 0}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="py-6">
              <CardContent className="px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      This Month
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats?.thisMonth || 0}
                    </p>
                  </div>
                  <CalendarDays className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="py-6">
              <CardContent className="px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Drafts
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats?.drafts || 0}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {navigationCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={card.href}
              className={`py-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${card.bgColor} ${card.borderColor}`}
              onClick={() => router.push(card.href)}
            >
              <CardHeader className="pb-4 px-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-lg">
                    {card.count}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {card.description}
                </p>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${card.color} hover:bg-transparent`}
                  >
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Programmes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Recent Programmes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentLoading ? (
              <RecentProgrammeSkeleton />
            ) : recentProgrammes && recentProgrammes.length > 0 ? (
              <div className="space-y-3">
                {recentProgrammes.map((programme) => (
                  <button
                    type="button"
                    key={programme.id}
                    className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => router.push(`/programmes/${programme.id}`)}
                  >
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {programme.topic}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(programme.date)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        programme.status === "upcoming"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {programme.status}
                    </Badge>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No programmes yet
                </p>
              </div>
            )}
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/programmes/upcoming")}
                className="w-full text-blue-600 hover:text-blue-700"
              >
                View All Programmes
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => router.push("/programmes/create")}
              className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Programme
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/programmes/drafts")}
              className="w-full justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              Continue Draft
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/programmes/upcoming")}
              className="w-full justify-start"
            >
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/programmes/past")}
              className="w-full justify-start"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Archive
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgrammeDashboard;
