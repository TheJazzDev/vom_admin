"use client";

import {
  BookOpen,
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  Plus,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMembers } from "@/hooks/useMembers";
import { useProgrammes } from "@/hooks/useProgrammes";

const QuickStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  href,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  color: string;
  href?: string;
}) => {
  const CardContentSection = (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {value}
            </p>
            {subtitle && (
              <p className={`text-sm ${color} font-medium`}>{subtitle}</p>
            )}
          </div>
          <div
            className={`p-3 rounded-full ${
              color.includes("blue")
                ? "bg-blue-100 dark:bg-blue-900"
                : color.includes("green")
                  ? "bg-green-100 dark:bg-green-900"
                  : color.includes("purple")
                    ? "bg-purple-100 dark:bg-purple-900"
                    : "bg-orange-100 dark:bg-orange-900"
            }`}
          >
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return href ? (
    <Link href={href}>{CardContentSection}</Link>
  ) : (
    CardContentSection
  );
};

const SectionCard = ({
  title,
  description,
  icon: Icon,
  href,
  stats,
  color,
  children,
}: {
  title: string;
  description: string;
  icon: any;
  href: string;
  stats?: { label: string; value: number }[];
  color: string;
  children?: React.ReactNode;
}) => (
  <Card
    className={`bg-linear-to-br ${color} border-0 hover:shadow-xl transition-all duration-300 h-full`}
  >
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold text-white">
            {title}
          </CardTitle>
          <CardDescription className="text-white/80 text-sm">
            {description}
          </CardDescription>
        </div>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {stats && (
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
      {children}
      <Link href={href}>
        <Button
          variant="secondary"
          className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          View Details
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const MainDashboard = () => {
  const { data: members, isLoading: membersLoading } = useMembers();
  const { data: programmes, isLoading: programmesLoading } = useProgrammes();

  // Calculate real statistics from actual data
  const stats = useMemo(() => {
    if (!members) {
      return {
        totalMembers: 0,
        activeMembers: 0,
        inactiveMembers: 0,
        newThisMonth: 0,
        activeBands: 0,
        departments: 0,
        upcomingProgrammes: 0,
        pastProgrammes: 0,
        draftProgrammes: 0,
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const activeMembers = members.filter((m) => m.status === "active").length;
    const inactiveMembers = members.filter(
      (m) => m.status === "inactive",
    ).length;

    const newThisMonth = members.filter((m) => {
      if (!m.createdAt) return false;
      const createdDate = new Date(m.createdAt);
      return (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      );
    }).length;

    // Get unique bands
    const uniqueBands = new Set<string>();
    for (const m of members) {
      if (m.band) {
        for (const b of m.band) {
          uniqueBands.add(b.name);
        }
      }
    }

    // Get unique departments
    const uniqueDepartments = new Set<string>();
    for (const m of members) {
      if (m.department) {
        for (const d of m.department) {
          uniqueDepartments.add(d.name);
        }
      }
    }

    const upcomingProgrammes =
      programmes?.filter((p) => p.status === "upcoming").length || 0;
    const pastProgrammes =
      programmes?.filter((p) => p.status === "past").length || 0;
    const draftProgrammes =
      programmes?.filter((p) => p.status === "draft").length || 0;

    return {
      totalMembers: members.length,
      activeMembers,
      inactiveMembers,
      newThisMonth,
      activeBands: uniqueBands.size,
      departments: uniqueDepartments.size,
      upcomingProgrammes,
      pastProgrammes,
      draftProgrammes,
    };
  }, [members, programmes]);

  const growthPercentage =
    stats.totalMembers > 0
      ? ((stats.newThisMonth / stats.totalMembers) * 100).toFixed(1)
      : "0.0";

  // Show loading state
  if (membersLoading || programmesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Church Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back! Here's what's happening in your church today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/directory/members/add-member">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats - Using Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickStatCard
          title="Total Members"
          value={stats.totalMembers}
          subtitle={`+${growthPercentage}% this month`}
          icon={Users}
          color="text-blue-600 dark:text-blue-400"
          href="/directory/members"
        />
        <QuickStatCard
          title="Active Members"
          value={stats.activeMembers}
          subtitle={`${stats.inactiveMembers} inactive`}
          icon={UserCheck}
          color="text-green-600 dark:text-green-400"
          href="/directory/members"
        />
        <QuickStatCard
          title="Upcoming Programmes"
          value={stats.upcomingProgrammes}
          subtitle={`${stats.pastProgrammes} past`}
          icon={Calendar}
          color="text-purple-600 dark:text-purple-400"
          href="/programmes/upcoming"
        />
        <QuickStatCard
          title="New This Month"
          value={stats.newThisMonth}
          subtitle="New members"
          icon={Clock}
          color="text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Directory Section - Using Real Data */}
        <SectionCard
          title="Directory"
          description="Manage members, bands & departments"
          icon={Users}
          href="/directory"
          color="from-blue-600 to-blue-700"
          stats={[
            { label: "Members", value: stats.totalMembers },
            { label: "Active", value: stats.activeMembers },
            { label: "Bands", value: stats.activeBands },
            { label: "Departments", value: stats.departments },
          ]}
        />

        {/* Programme Section - Using Real Data */}
        <SectionCard
          title="Programmes"
          description="Current, upcoming & past programs"
          icon={Calendar}
          href="/programmes"
          color="from-orange-600 to-orange-700"
          stats={[
            { label: "Total", value: programmes?.length || 0 },
            { label: "Upcoming", value: stats.upcomingProgrammes },
            { label: "Past", value: stats.pastProgrammes },
            { label: "Drafts", value: stats.draftProgrammes },
          ]}
        />

        {/* Bands Section */}
        <SectionCard
          title="Bands"
          description="Manage church bands & members"
          icon={Building2}
          href="/directory/bands"
          color="from-purple-600 to-purple-700"
          stats={[
            { label: "Active Bands", value: stats.activeBands },
            { label: "Total Members", value: stats.totalMembers },
            { label: "Departments", value: stats.departments },
            { label: "New Members", value: stats.newThisMonth },
          ]}
        />
      </div>

      {/* Quick Links Card */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/directory/members/add-member">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Add New Member
              </Button>
            </Link>
            <Link href="/programmes/create">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Create Programme
              </Button>
            </Link>
            <Link href="/directory/bands">
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="h-4 w-4 mr-2" />
                View Bands
              </Button>
            </Link>
            <Link href="/directory/members">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Member Directory
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Programme Overview */}
      {programmes && programmes.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Calendar className="h-5 w-5" />
                  Recent Programmes
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Latest church programmes
                </CardDescription>
              </div>
              <Link href="/programmes">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {programmes.slice(0, 5).map((programme) => (
                <Link
                  key={programme.id}
                  href={`/programmes/edit?id=${programme.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {programme.title || "Untitled Programme"}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        {programme.date
                          ? new Date(programme.date).toLocaleDateString()
                          : "No date"}
                      </div>
                    </div>
                    <Badge
                      variant={
                        programme.status === "upcoming"
                          ? "default"
                          : programme.status === "draft"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {programme.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MainDashboard;
