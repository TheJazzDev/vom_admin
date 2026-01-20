"use client";

import { Archive, Plus, TrendingUp, UserCheck, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateFirstTimerDialog } from "@/components/FirstTimers/CreateFirstTimerDialog";
import { FirstTimersTable } from "@/components/FirstTimers/FirstTimersTable";
import { PermissionGuard } from "@/components/Guards/PermissionGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionEnum, ResourceEnum } from "@/enums";
import {
  archiveFirstTimer,
  getAllFirstTimers,
  getFirstTimerStats,
} from "@/services/firstTimers";

export default function FirstTimersPage() {
  const [firstTimers, setFirstTimers] = useState<FirstTimer[]>([]);
  const [stats, setStats] = useState<FirstTimerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [timersData, statsData] = await Promise.all([
        getAllFirstTimers(),
        getFirstTimerStats(),
      ]);
      setFirstTimers(timersData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading first timers:", error);
      toast.error("Failed to load first timers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleArchive(id: string) {
    try {
      await archiveFirstTimer(id);
      toast.success("First timer archived");
      loadData();
    } catch (error) {
      console.error("Error archiving first timer:", error);
      toast.error("Failed to archive first timer");
    }
  }

  return (
    <PermissionGuard
      resource={ResourceEnum.FIRST_TIMERS}
      action={ActionEnum.VIEW}
    >
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              First Timers
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Manage church visitors and convert them to members
            </p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            size="sm"
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Add First Timer</span>
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="mb-4 sm:mb-6 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Active (48hrs)
                </CardTitle>
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                <div className="text-lg font-bold sm:text-xl md:text-2xl">
                  {stats.active}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently displayed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Converted
                </CardTitle>
                <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                <div className="text-lg font-bold sm:text-xl md:text-2xl">
                  {stats.converted}
                </div>
                <p className="text-xs text-muted-foreground">Became members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  This Week
                </CardTitle>
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                <div className="text-lg font-bold sm:text-xl md:text-2xl">
                  {stats.thisWeek}
                </div>
                <p className="text-xs text-muted-foreground">New visitors</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Archived
                </CardTitle>
                <Archive className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                <div className="text-lg font-bold sm:text-xl md:text-2xl">
                  {stats.archived}
                </div>
                <p className="text-xs text-muted-foreground">Not converted</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* First Timers Table */}
        <Card>
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <CardTitle className="text-sm sm:text-base md:text-lg">
              All First Timers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <FirstTimersTable
              firstTimers={firstTimers}
              loading={loading}
              onArchive={handleArchive}
              onRefresh={loadData}
            />
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <CreateFirstTimerDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={loadData}
        />
      </div>
    </PermissionGuard>
  );
}
