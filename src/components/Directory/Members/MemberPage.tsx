"use client";

import { Clock, Download, Plus, UserCheck, Users, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMembers } from "@/hooks/useMembers";
import MemberStatsCard from "./Components/MemberStatsCard";
import { ExportDialog } from "./ExportDialog";
import { PrintableView } from "./PrintableView";
import { MemberDataTable } from "./Table/MemberTable";

const MembersPage = () => {
  const router = useRouter();
  const { data: members, isLoading, error } = useMembers();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // Calculate live stats from actual member data
  const memberStats = useMemo(() => {
    if (!members || members.length === 0) {
      return {
        total: 0,
        active: 0,
        pending: 0,
        inactive: 0,
        newThisMonth: 0,
        birthdays: 0,
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Count members by status
    const active = members.filter((m) => m.status === "active").length;
    const inactive = members.filter((m) => m.status === "inactive").length;

    // Count pending (not verified)
    const pending = members.filter((m) => !m.verified).length;

    // Count new members this month
    const newThisMonth = members.filter((m) => {
      if (!m.createdAt) return false;
      const createdDate = new Date(m.createdAt);
      return (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      );
    }).length;

    // Count upcoming birthdays (within next 7 days)
    const birthdays = members.filter((m) => {
      if (!m.dob) return false;

      try {
        const dobDate = new Date(m.dob);
        const birthdayThisYear = new Date(
          currentYear,
          dobDate.getMonth(),
          dobDate.getDate(),
        );

        // If birthday already passed this year, check next year
        if (birthdayThisYear < now) {
          birthdayThisYear.setFullYear(currentYear + 1);
        }

        // Calculate days until birthday
        const daysUntilBirthday = Math.ceil(
          (birthdayThisYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        return daysUntilBirthday >= 0 && daysUntilBirthday <= 7;
      } catch (_error) {
        return false;
      }
    }).length;

    return {
      total: members.length,
      active,
      pending,
      inactive,
      newThisMonth,
      birthdays,
    };
  }, [members]);

  // Calculate trends
  const activePercentage =
    memberStats.total > 0
      ? Math.round((memberStats.active / memberStats.total) * 100)
      : 0;

  const inactivePercentage =
    memberStats.total > 0
      ? Math.round((memberStats.inactive / memberStats.total) * 100)
      : 0;

  const growthRate =
    memberStats.total > 0
      ? Math.round((memberStats.newThisMonth / memberStats.total) * 100)
      : 0;

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading members...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">
            Failed to load members
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6">
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
            onClick={() => setExportDialogOpen(true)}
            disabled={isLoading || !members?.length}
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
          trend={
            memberStats.newThisMonth > 0
              ? `+${growthRate}% this month`
              : "No new members"
          }
        />
        <MemberStatsCard
          title="Active Members"
          value={memberStats.active}
          icon={UserCheck}
          color="text-green-600 dark:text-green-400"
          trend={`${activePercentage}% of total`}
        />
        <MemberStatsCard
          title="Pending Verification"
          value={memberStats.pending}
          icon={Clock}
          color="text-yellow-600 dark:text-yellow-400"
          trend={
            memberStats.pending > 0
              ? `${memberStats.pending} awaiting`
              : "All verified"
          }
        />
        <MemberStatsCard
          title="Inactive"
          value={memberStats.inactive}
          icon={UserX}
          color="text-red-600 dark:text-red-400"
          trend={`${inactivePercentage}% of total`}
        />
      </div>

      {memberStats.birthdays > 0 && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎉</span>
            <p className="text-purple-900 dark:text-purple-100 font-medium">
              {memberStats.birthdays} member
              {memberStats.birthdays !== 1 ? "s have" : " has"} upcoming
              birthdays in the next 7 days!
            </p>
          </div>
        </div>
      )}

      <MemberDataTable data={members || []} />

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
      />

      {/* Hidden printable view - only visible when printing */}
      <PrintableView members={members || []} />
    </div>
  );
};

export default MembersPage;
