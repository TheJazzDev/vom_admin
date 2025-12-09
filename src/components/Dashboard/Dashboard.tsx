"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  Calendar,
  CalendarDays,
  ChevronRight,
  Church,
  Clock,
  CreditCard,
  DollarSign,
  Heart,
  LineChart,
  PieChart,
  Plus,
  Settings,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMembers } from "@/hooks/useMembers";
import { useProgrammes } from "@/hooks/useProgrammes";

// Mock data for dashboard
const dashboardData = {
  overview: {
    totalMembers: 342,
    activeMembers: 298,
    childrenPrograms: 156,
    departments: 12,
    activeBands: 6,
    monthlyGrowth: 8.2,
  },
  // Financial data
  financial: {
    monthlyIncome: 45000,
    monthlyExpenses: 38000,
    tithes: 32000,
    offerings: 13000,
    expenses: {
      operations: 18000,
      maintenance: 8000,
      ministry: 7000,
      outreach: 5000,
    },
    growth: {
      incomeGrowth: 12.5,
      expenseGrowth: -3.2,
    },
  },
  // Member growth data
  memberGrowth: [
    { month: "Jan", members: 320, children: 140, bands: 5 },
    { month: "Feb", members: 325, children: 145, bands: 6 },
    { month: "Mar", members: 330, children: 148, bands: 6 },
    { month: "Apr", members: 335, children: 150, bands: 6 },
    { month: "May", members: 338, children: 152, bands: 6 },
    { month: "Jun", members: 342, children: 156, bands: 6 },
  ],
  // Attendance data
  attendanceData: [
    { week: "Week 1", sunday: 280, midweek: 120, youth: 45 },
    { week: "Week 2", sunday: 290, midweek: 125, youth: 48 },
    { week: "Week 3", sunday: 275, midweek: 115, youth: 42 },
    { week: "Week 4", sunday: 295, midweek: 130, youth: 50 },
  ],
  // Income vs Expenses monthly
  financialTrend: [
    { month: "Jan", income: 42000, expenses: 39000 },
    { month: "Feb", income: 44000, expenses: 40000 },
    { month: "Mar", income: 43000, expenses: 38500 },
    { month: "Apr", income: 46000, expenses: 37000 },
    { month: "May", income: 44500, expenses: 38200 },
    { month: "Jun", income: 45000, expenses: 38000 },
  ],
  // Department distribution
  departmentData: [
    { name: "Youth Ministry", value: 45, color: "#3B82F6" },
    { name: "Choir", value: 25, color: "#8B5CF6" },
    { name: "Children Ministry", value: 60, color: "#10B981" },
    { name: "Media Team", value: 12, color: "#F59E0B" },
    { name: "Ushering", value: 30, color: "#EF4444" },
    { name: "Others", value: 28, color: "#6B7280" },
  ],
  upcomingEvents: [
    {
      id: 1,
      title: "Sunday Service",
      date: "2024-01-28",
      time: "10:00 AM",
      type: "service",
      attendees: 250,
    },
    {
      id: 2,
      title: "Youth Bible Study",
      date: "2024-01-30",
      time: "7:00 PM",
      type: "study",
      attendees: 45,
    },
    {
      id: 3,
      title: "Choir Practice",
      date: "2024-02-01",
      time: "6:30 PM",
      type: "music",
      attendees: 25,
    },
    {
      id: 4,
      title: "Children's Program",
      date: "2024-02-03",
      time: "4:00 PM",
      type: "children",
      attendees: 60,
    },
  ],
  recentActivity: [
    {
      type: "member",
      action: "New member joined",
      details: "John Doe registered",
      time: "2 hours ago",
    },
    {
      type: "announcement",
      action: "Announcement posted",
      details: "Weekly service update",
      time: "4 hours ago",
    },
    {
      type: "prayer",
      action: "Prayer request submitted",
      details: "Family healing request",
      time: "6 hours ago",
    },
    {
      type: "event",
      action: "Event scheduled",
      details: "Youth retreat planning",
      time: "1 day ago",
    },
  ],
  quickStats: {
    todayAttendance: 89,
    weeklyServices: 3,
    pendingApprovals: 7,
    activePrograms: 12,
  },
  ministryHighlights: [
    {
      name: "Youth Ministry",
      members: 45,
      activity: "high",
      leader: "Pastor Mike",
    },
    { name: "Choir", members: 25, activity: "medium", leader: "Sister Mary" },
    {
      name: "Children Ministry",
      members: 60,
      activity: "high",
      leader: "Teacher Sarah",
    },
    { name: "Media Team", members: 12, activity: "low", leader: "Bro David" },
  ],
};

const FinancialStatsCard = ({
  title,
  value,
  change,
  icon: Icon,
  isIncome = true,
}: {
  title: string;
  value: number;
  change: number;
  icon: any;
  isIncome?: boolean;
}) => (
  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ${value.toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            {change > 0 ? (
              <ArrowUpRight
                className={`h-4 w-4 ${
                  isIncome ? "text-green-500" : "text-red-500"
                }`}
              />
            ) : (
              <ArrowDownRight
                className={`h-4 w-4 ${
                  isIncome ? "text-red-500" : "text-green-500"
                }`}
              />
            )}
            <p
              className={`text-sm font-medium ${
                (isIncome && change > 0) || (!isIncome && change < 0)
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {Math.abs(change)}% vs last month
            </p>
          </div>
        </div>
        <div
          className={`p-3 rounded-full ${
            isIncome
              ? "bg-green-100 dark:bg-green-900"
              : "bg-red-100 dark:bg-red-900"
          }`}
        >
          <Icon
            className={`h-6 w-6 ${
              isIncome ? "text-green-600" : "text-red-600"
            }`}
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

const MemberGrowthChart = () => (
  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <TrendingUp className="h-5 w-5" />
        Member Growth Trend
      </CardTitle>
      <CardDescription className="text-gray-600 dark:text-gray-400">
        6-month growth across all categories
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={dashboardData.memberGrowth}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="month" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
          />
          <Area
            type="monotone"
            dataKey="members"
            stackId="1"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="children"
            stackId="1"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="bands"
            stackId="1"
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const AttendanceChart = () => (
  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <BarChart3 className="h-5 w-5" />
        Weekly Attendance
      </CardTitle>
      <CardDescription className="text-gray-600 dark:text-gray-400">
        Service attendance over the past month
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={dashboardData.attendanceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="week" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
          />
          <Bar dataKey="sunday" fill="#3B82F6" name="Sunday Service" />
          <Bar dataKey="midweek" fill="#10B981" name="Midweek Service" />
          <Bar dataKey="youth" fill="#8B5CF6" name="Youth Meeting" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const FinancialTrendChart = () => (
  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <LineChart className="h-5 w-5" />
        Financial Trend
      </CardTitle>
      <CardDescription className="text-gray-600 dark:text-gray-400">
        Monthly income vs expenses comparison
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={dashboardData.financialTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="month" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10B981"
            strokeWidth={3}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#EF4444"
            strokeWidth={3}
            name="Expenses"
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const DepartmentDistributionChart = () => (
  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <PieChart className="h-5 w-5" />
        Department Distribution
      </CardTitle>
      <CardDescription className="text-gray-600 dark:text-gray-400">
        Member distribution across departments
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={dashboardData.departmentData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            dataKey="value"
          >
            {dashboardData.departmentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {dashboardData.departmentData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {item.name} ({item.value})
            </span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

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
    className={`bg-gradient-to-br ${color} border-0 hover:shadow-xl transition-all duration-300 h-full`}
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

const UpcomingEventsWidget = () => (
  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Calendar className="h-5 w-5" />
        Upcoming Events
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {dashboardData.upcomingEvents.slice(0, 4).map((event) => (
        <div
          key={event.id}
          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="space-y-1">
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {event.title}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <CalendarDays className="h-3 w-3" />
              {event.date} at {event.time}
            </div>
          </div>
          <Badge
            variant={
              event.type === "service"
                ? "default"
                : event.type === "study"
                  ? "secondary"
                  : event.type === "music"
                    ? "outline"
                    : "destructive"
            }
          >
            {event.attendees} attending
          </Badge>
        </div>
      ))}
      <Link href="/admin/info/events">
        <Button variant="outline" className="w-full mt-3">
          View All Events
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const RecentActivityWidget = () => (
  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Activity className="h-5 w-5" />
        Recent Activity
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {dashboardData.recentActivity.map((activity, index) => (
        <div
          key={index}
          className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <div
            className={`w-2 h-2 rounded-full mt-2 ${
              activity.type === "member"
                ? "bg-blue-500"
                : activity.type === "announcement"
                  ? "bg-green-500"
                  : activity.type === "prayer"
                    ? "bg-purple-500"
                    : "bg-orange-500"
            }`}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {activity.action}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {activity.details}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {activity.time}
            </p>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

const MinistryHighlightsWidget = () => (
  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Church className="h-5 w-5" />
        Ministry Highlights
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {dashboardData.ministryHighlights.map((ministry, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          <div className="space-y-1">
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {ministry.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Led by {ministry.leader}
            </p>
          </div>
          <div className="text-right space-y-1">
            <Badge
              variant={
                ministry.activity === "high"
                  ? "default"
                  : ministry.activity === "medium"
                    ? "secondary"
                    : "outline"
              }
            >
              {ministry.members} members
            </Badge>
          </div>
        </div>
      ))}
      <Link href="/admin/ministry">
        <Button variant="outline" className="w-full mt-3">
          View All Ministries
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
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const activeMembers = members.filter((m) => m.status === 'active').length;
    const inactiveMembers = members.filter((m) => m.status === 'inactive').length;

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
    members.forEach((m) => {
      m.band?.forEach((b) => uniqueBands.add(b.name));
    });

    // Get unique departments
    const uniqueDepartments = new Set<string>();
    members.forEach((m) => {
      m.department?.forEach((d) => uniqueDepartments.add(d.name));
    });

    const upcomingProgrammes = programmes?.filter((p) => p.status === 'upcoming').length || 0;
    const pastProgrammes = programmes?.filter((p) => p.status === 'past').length || 0;

    return {
      totalMembers: members.length,
      activeMembers,
      inactiveMembers,
      newThisMonth,
      activeBands: uniqueBands.size,
      departments: uniqueDepartments.size,
      upcomingProgrammes,
      pastProgrammes,
    };
  }, [members, programmes]);

  const growthPercentage = stats.totalMembers > 0
    ? ((stats.newThisMonth / stats.totalMembers) * 100).toFixed(1)
    : '0.0';

  // Show loading state
  if (membersLoading || programmesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
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
          <Button
            variant="outline"
            className="border-gray-300 dark:border-gray-600"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
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
          href="/programmes"
        />
        <QuickStatCard
          title="New This Month"
          value={stats.newThisMonth}
          subtitle="New members"
          icon={Clock}
          color="text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinancialStatsCard
          title="Monthly Income"
          value={dashboardData.financial.monthlyIncome}
          change={dashboardData.financial.growth.incomeGrowth}
          icon={DollarSign}
          isIncome={true}
        />
        <FinancialStatsCard
          title="Monthly Expenses"
          value={dashboardData.financial.monthlyExpenses}
          change={dashboardData.financial.growth.expenseGrowth}
          icon={CreditCard}
          isIncome={false}
        />
        <QuickStatCard
          title="Net Surplus"
          value={`$${(
            dashboardData.financial.monthlyIncome -
              dashboardData.financial.monthlyExpenses
          ).toLocaleString()}`}
          subtitle="This month"
          icon={Wallet}
          color="text-green-600 dark:text-green-400"
        />
        <QuickStatCard
          title="Tithes & Offerings"
          value={`$${(
            dashboardData.financial.tithes + dashboardData.financial.offerings
          ).toLocaleString()}`}
          subtitle="+15.3% increase"
          icon={Heart}
          color="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Analytics Charts Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Analytics & Insights
        </h2>

        <Tabs defaultValue="growth" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger
              value="growth"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              Growth
            </TabsTrigger>
            <TabsTrigger
              value="attendance"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              Attendance
            </TabsTrigger>
            <TabsTrigger
              value="financial"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              Financial
            </TabsTrigger>
            <TabsTrigger
              value="departments"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              Departments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MemberGrowthChart />
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Target className="h-5 w-5" />
                    Growth Targets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          Members Goal
                        </span>
                        <span className="text-gray-900 dark:text-gray-100">
                          342/400
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "85.5%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          Children Programs
                        </span>
                        <span className="text-gray-900 dark:text-gray-100">
                          156/200
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: "78%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          Active Bands
                        </span>
                        <span className="text-gray-900 dark:text-gray-100">
                          6/8
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                      Monthly Highlights
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950 rounded">
                        <span className="text-sm text-green-800 dark:text-green-200">
                          New Members
                        </span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          +12
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950 rounded">
                        <span className="text-sm text-blue-800 dark:text-blue-200">
                          Children Registered
                        </span>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                          +8
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AttendanceChart />
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <UserCheck className="h-5 w-5" />
                    Attendance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        89%
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        Average Attendance
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        295
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        Highest This Month
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Service Breakdown
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Sunday Service
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          285 avg
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Midweek Service
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          122 avg
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Youth Meeting
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          46 avg
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialTrendChart />
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Wallet className="h-5 w-5" />
                    Expense Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          Operations
                        </span>
                        <span className="text-gray-900 dark:text-gray-100">
                          $
                          {dashboardData.financial.expenses.operations.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: "47%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          Maintenance
                        </span>
                        <span className="text-gray-900 dark:text-gray-100">
                          $
                          {dashboardData.financial.expenses.maintenance.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: "21%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          Ministry
                        </span>
                        <span className="text-gray-900 dark:text-gray-100">
                          $
                          {dashboardData.financial.expenses.ministry.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: "18%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          Outreach
                        </span>
                        <span className="text-gray-900 dark:text-gray-100">
                          $
                          {dashboardData.financial.expenses.outreach.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "13%" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          $7,000
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">
                          Monthly Surplus
                        </div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          18.4%
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-400">
                          Savings Rate
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="departments" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DepartmentDistributionChart />
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Building2 className="h-5 w-5" />
                    Department Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {dashboardData.ministryHighlights.map((ministry, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {ministry.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Led by {ministry.leader}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {ministry.members} members
                          </div>
                          <Badge
                            variant={
                              ministry.activity === "high"
                                ? "default"
                                : ministry.activity === "medium"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {ministry.activity} activity
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                      Department Status
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="text-xl font-bold text-green-600 dark:text-green-400">
                          11
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">
                          Active Departments
                        </div>
                      </div>
                      <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                        <div className="text-xl font-bold text-red-600 dark:text-red-400">
                          1
                        </div>
                        <div className="text-xs text-red-600 dark:text-red-400">
                          Needs Leader
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Directory Section - Using Real Data */}
        <SectionCard
          title="Directory"
          description="Manage members, bands, children & departments"
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

        {/* Info Section */}
        <SectionCard
          title="Information"
          description="Events, announcements & church info"
          icon={Bell}
          href="/admin/info"
          color="from-green-600 to-green-700"
          stats={[
            { label: "Events", value: 12 },
            { label: "Announcements", value: 8 },
            { label: "This Week", value: 5 },
            { label: "Monthly", value: 24 },
          ]}
        />

        {/* Ministry Section */}
        <SectionCard
          title="Ministry"
          description="Bible study, sermons & prayer requests"
          icon={BookOpen}
          href="/admin/ministry"
          color="from-purple-600 to-purple-700"
          stats={[
            { label: "Bible Studies", value: 6 },
            { label: "Recent Sermons", value: 12 },
            { label: "Prayer Requests", value: 23 },
            { label: "Testimonies", value: 8 },
          ]}
        />

        {/* Programme Section - Using Real Data */}
        <SectionCard
          title="Programme"
          description="Current, upcoming & past programs"
          icon={Calendar}
          href="/programmes"
          color="from-orange-600 to-orange-700"
          stats={[
            { label: "Total", value: programmes?.length || 0 },
            { label: "Upcoming", value: stats.upcomingProgrammes },
            { label: "Past", value: stats.pastProgrammes },
            { label: "Active", value: stats.upcomingProgrammes },
          ]}
        />

        {/* Profile Section */}
        <SectionCard
          title="Profile"
          description="User profile & app settings"
          icon={Settings}
          href="/admin/profile"
          color="from-gray-600 to-gray-700"
          stats={[
            { label: "Admin Users", value: 5 },
            { label: "Components", value: 24 },
            { label: "Settings", value: 12 },
            { label: "Notifications", value: 3 },
          ]}
        />
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UpcomingEventsWidget />
        <RecentActivityWidget />
        <MinistryHighlightsWidget />
      </div>

      {/* Analytics Summary */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <BarChart3 className="h-5 w-5" />
            Church Analytics Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                98%
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Member Retention
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                85%
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Event Attendance
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                12
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Active Ministries
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                +8.2%
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">
                Monthly Growth
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainDashboard;
