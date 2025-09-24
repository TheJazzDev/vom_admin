"use client";

import {
  CheckCheckIcon,
  Clock,
  Download,
  Filter,
  Mail,
  Plus,
  Search,
  Settings,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMembers } from "@/hooks/useMembers";
import { MemberDataTable } from "./Table/MemberTable";

export const metadata = {
  title: "VOM - Members Directory",
};

// Mock data for demonstration
const memberStats = {
  total: 342,
  active: 298,
  pending: 12,
  inactive: 32,
  newThisMonth: 15,
  birthdays: 8,
};

const recentMembers = [
  {
    name: "John Doe",
    status: "active",
    joinDate: "2024-01-15",
    email: "john@example.com",
  },
  {
    name: "Jane Smith",
    status: "pending",
    joinDate: "2024-01-20",
    email: "jane@example.com",
  },
];

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

const QuickActions = () => (
  <Card className="py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Settings className="h-5 w-5" />
        Quick Actions
      </CardTitle>
    </CardHeader>
    <CardContent className="px-4 space-y-3 -mt-4">
      {/* <Button className='w-full justify-start bg-blue-600 hover:bg-blue-700 text-white'>
        <UserPlus className='h-4 w-4 mr-2' />
        Add New Member
      </Button> */}
      <Button
        variant="outline"
        className="w-full justify-start border-gray-300 dark:border-gray-600"
      >
        <Upload className="h-4 w-4 mr-2" />
        Import Members
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start border-gray-300 dark:border-gray-600"
      >
        <Download className="h-4 w-4 mr-2" />
        Export Directory
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start border-gray-300 dark:border-gray-600"
      >
        <Mail className="h-4 w-4 mr-2" />
        Send Newsletter
      </Button>
    </CardContent>
  </Card>
);

const RecentMembers = () => (
  <Card className="py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <CardHeader className="">
      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <UserPlus className="h-5 w-5" />
        Recent Members
      </CardTitle>
    </CardHeader>
    <CardContent className="px-4 -mt-4">
      <div className="space-y-4">
        {recentMembers.map((member, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="space-y-1 w-full">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {member.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {member.email}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Joined {member.joinDate}
                </p>
                <Badge variant="secondary">
                  {member.status === "active" ? (
                    <CheckCheckIcon className="text-green-600" />
                  ) : (
                    <XIcon className="text-red-600" />
                  )}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const SearchAndFilter = () => (
  <Card className="py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Search className="h-5 w-5" />
        Search Members
      </CardTitle>
    </CardHeader>
    <CardContent className="px-4 space-y-4 -mt-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by name, email, phone..."
          className="pl-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-700">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="inactive"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
          >
            Inactive
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start border-gray-300 dark:border-gray-600"
      >
        <Filter className="h-4 w-4 mr-2" />
        Advanced Filters
      </Button>
    </CardContent>
  </Card>
);

const MembersPage = () => {
  const router = useRouter();
  const { data: members } = useMembers();

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Members Directory
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and view all church members information
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-gray-300 dark:border-gray-600"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => router.push("/directory/members/add-member")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MemberStatsCard
          title="Total Members"
          value={memberStats.total}
          icon={Users}
          color="text-blue-600 dark:text-blue-400"
          trend="+5% this month"
        />
        <MemberStatsCard
          title="Active Members"
          value={memberStats.active}
          icon={UserCheck}
          color="text-green-600 dark:text-green-400"
          trend="87% of total"
        />
        <MemberStatsCard
          title="Pending Approval"
          value={memberStats.pending}
          icon={Clock}
          color="text-yellow-600 dark:text-yellow-400"
          trend="3 this week"
        />
        <MemberStatsCard
          title="Inactive"
          value={memberStats.inactive}
          icon={UserX}
          color="text-red-600 dark:text-red-400"
          trend="9% of total"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RecentMembers />
        <SearchAndFilter />
        <QuickActions />
      </div>

      <MemberDataTable data={members || []} />
    </div>
  );
};

export default MembersPage;
