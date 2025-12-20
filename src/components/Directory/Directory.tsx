"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  Baby,
  Building2,
  Calendar,
  Music,
  Plus,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllBands } from "@/hooks/useBands";
import { useChildren } from "@/hooks/useChildren";
import { useMembers } from "@/hooks/useMembers";
import { DepartmentKeysEnum } from "@/enums";

const DirectoryCard = ({
  title,
  description,
  icon: Icon,
  stats,
  href,
  color = "blue",
}: {
  title: string;
  description: string;

  icon: any;
  stats: {
    label: string;
    value: number;
    variant?: "default" | "secondary" | "destructive" | "outline";
  }[];
  href: string;
  color?: string;
}) => {
  const colorClasses = {
    blue: "border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900 dark:hover:to-blue-800",
    purple:
      "border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900 dark:hover:to-purple-800",
    green:
      "border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 hover:from-green-100 hover:to-green-200 dark:hover:from-green-900 dark:hover:to-green-800",
    orange:
      "border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-900 dark:hover:to-orange-800",
  };

  return (
    <Link href={href} className="block">
      <Card
        className={`py-4 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer border ${
          colorClasses[color as keyof typeof colorClasses]
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </CardDescription>
            </div>
            <div className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md">
              <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 -mt-4">
          <div className="grid grid-cols-2 gap-2">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              >
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const StatsCard = ({
  title,
  value,
  change,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  change: string;

  icon: any;
  color: string;
}) => (
  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          <p className={`text-sm ${color} flex items-center mt-1`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            {change}
          </p>
        </div>
        <div
          className={`p-3 rounded-full ${
            color === "text-green-600"
              ? "bg-green-100 dark:bg-green-900"
              : "bg-blue-100 dark:bg-blue-900"
          }`}
        >
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const DirectoryPage = () => {
  const { data: members, isLoading: membersLoading } = useMembers();
  const { data: bands, isLoading: bandsLoading } = useAllBands();
  const { data: children, isLoading: childrenLoading } = useChildren();

  const isLoading = membersLoading || bandsLoading || childrenLoading;

  // Calculate real stats
  const stats = useMemo(() => {
    const memberStats = {
      total: members?.length || 0,
      active: members?.filter((m) => m.status === "active").length || 0,
      pending: members?.filter((m) => !m.verified).length || 0,
      inactive: members?.filter((m) => m.status === "inactive").length || 0,
    };

    const bandStats = {
      total: bands?.length || 0,
      active: bands?.length || 0,
    };

    const childrenStats = {
      total: children?.length || 0,
      active: children?.length || 0,
      newThisMonth: children?.filter((c) => {
        const createdAt = new Date(c.createdAt);
        const now = new Date();
        return (
          createdAt.getMonth() === now.getMonth() &&
          createdAt.getFullYear() === now.getFullYear()
        );
      }).length || 0,
    };

    // Get unique departments from members
    const allDepartments = new Set<string>();
    members?.forEach((m) => {
      m.departmentKeys?.forEach((d: string) => allDepartments.add(d));
    });

    const departmentStats = {
      total: Object.keys(DepartmentKeysEnum).length,
      active: allDepartments.size,
      vacant: Object.keys(DepartmentKeysEnum).length - allDepartments.size,
    };

    return { memberStats, bandStats, childrenStats, departmentStats };
  }, [members, bands, children]);

  // Get recent activity from members
  const recentActivity = useMemo(() => {
    if (!members) return [];

    const sortedMembers = [...members]
      .filter((m) => m.createdAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);

    return sortedMembers.map((member) => ({
      type: "member",
      action: "Member registered",
      name: `${member.firstName} ${member.lastName}`,
      time: formatDistanceToNow(new Date(member.createdAt), { addSuffix: true }),
    }));
  }, [members]);

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newMembersThisWeek = members?.filter((m) => {
      const createdAt = new Date(m.createdAt);
      return createdAt >= oneWeekAgo;
    }).length || 0;

    const newChildrenThisWeek = children?.filter((c) => {
      const createdAt = new Date(c.createdAt);
      return createdAt >= oneWeekAgo;
    }).length || 0;

    return { newMembersThisWeek, newChildrenThisWeek };
  }, [members, children]);

  const totalMembers = stats.memberStats.total + stats.childrenStats.total;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Directory Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive management hub for all church directory sections
          </p>
        </div>
        <Link href="/directory/members/create">
          <Button className="text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total People"
          value={totalMembers}
          change={`${stats.memberStats.total} members, ${stats.childrenStats.total} children`}
          icon={Users}
          color="text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          title="Active Members"
          value={stats.memberStats.active}
          change={`${stats.memberStats.inactive} inactive`}
          icon={UserCheck}
          color="text-green-600 dark:text-green-400"
        />
        <StatsCard
          title="New This Week"
          value={weeklyStats.newMembersThisWeek}
          change={`${weeklyStats.newChildrenThisWeek} children registered`}
          icon={TrendingUp}
          color="text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          title="Departments"
          value={stats.departmentStats.active}
          change={`${stats.departmentStats.vacant} vacant`}
          icon={Building2}
          color="text-green-600 dark:text-green-400"
        />
      </div>

      {/* Main Directory Sections */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Directory Sections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DirectoryCard
            title="Members"
            description="Church members directory"
            icon={Users}
            href="/directory/members"
            color="blue"
            stats={[
              { label: "Total", value: stats.memberStats.total },
              { label: "Active", value: stats.memberStats.active },
              { label: "Pending", value: stats.memberStats.pending },
              { label: "Inactive", value: stats.memberStats.inactive },
            ]}
          />

          <DirectoryCard
            title="Bands"
            description="Music bands and groups"
            icon={Music}
            href="/directory/bands"
            color="purple"
            stats={[
              { label: "Total", value: stats.bandStats.total },
              { label: "Active", value: stats.bandStats.active },
              { label: "Members", value: stats.memberStats.total },
              { label: "Groups", value: stats.bandStats.total },
            ]}
          />

          <DirectoryCard
            title="Children"
            description="Children and youth records"
            icon={Baby}
            href="/directory/children"
            color="green"
            stats={[
              { label: "Total", value: stats.childrenStats.total },
              { label: "Active", value: stats.childrenStats.active },
              { label: "This Month", value: stats.childrenStats.newThisMonth },
              { label: "Programs", value: 2 },
            ]}
          />

          <DirectoryCard
            title="Departments"
            description="Church departments"
            icon={Building2}
            href="/directory/departments"
            color="orange"
            stats={[
              { label: "Total", value: stats.departmentStats.total },
              { label: "Active", value: stats.departmentStats.active },
              { label: "Vacant", value: stats.departmentStats.vacant },
              { label: "Members", value: stats.memberStats.total },
            ]}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No recent activity
                  </p>
                ) : (
                  recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "member"
                            ? "bg-blue-500"
                            : activity.type === "band"
                              ? "bg-purple-500"
                              : activity.type === "child"
                                ? "bg-green-500"
                                : "bg-orange-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Calendar className="h-5 w-5" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  New Members
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {weeklyStats.newMembersThisWeek}
                </div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  Total Bands
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.bandStats.total}
                </div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-sm font-medium text-green-900 dark:text-green-100">
                  Child Registrations
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {weeklyStats.newChildrenThisWeek}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;
