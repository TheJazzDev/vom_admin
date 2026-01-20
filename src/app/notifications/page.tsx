"use client";

import {
  IconBell,
  IconPlus,
  IconSend,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsPage() {
  const [stats, setStats] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/list");
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications.slice(0, 10)); // Show last 10
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchNotifications();
  }, [fetchStats, fetchNotifications]);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
            Push Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Send notifications to church members
          </p>
        </div>
        <Button asChild>
          <Link href="/notifications/send">
            <IconPlus className="mr-2 h-4 w-4" />
            Send Notification
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
              <IconSend className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{stats.sent}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <CardTitle className="text-sm font-medium">Recipients</CardTitle>
              <IconBell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{stats.totalRecipients}</div>
              <p className="text-xs text-muted-foreground">Total delivered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <IconSend className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{stats.successRate}%</div>
              <p className="text-xs text-muted-foreground">Delivery success</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <IconBell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{stats.scheduled}</div>
              <p className="text-xs text-muted-foreground">Pending delivery</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingNotifications ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="mt-1 p-2 rounded-full bg-primary/10">
                    <IconBell className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium text-sm leading-tight">
                        {notification.title}
                      </h4>
                      <Badge
                        variant={
                          notification.status === "sent"
                            ? "default"
                            : "secondary"
                        }
                        className="shrink-0"
                      >
                        {notification.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {notification.body}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {notification.recipients?.type === "all" ? (
                          <>
                            <IconUsers className="h-3 w-3" />
                            <span>All Members</span>
                          </>
                        ) : notification.recipients?.type === "members" ? (
                          <>
                            <IconUser className="h-3 w-3" />
                            <span>Members Only</span>
                          </>
                        ) : notification.recipients?.type === "guests" ? (
                          <>
                            <IconUser className="h-3 w-3" />
                            <span>Guests Only</span>
                          </>
                        ) : (
                          <>
                            <IconUser className="h-3 w-3" />
                            <span>Custom</span>
                          </>
                        )}
                      </div>
                      <span>•</span>
                      <span>{notification.deliveryStats?.sent || 0} sent</span>
                      {notification.deliveryStats?.failed > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-destructive">
                            {notification.deliveryStats.failed} failed
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span>
                        {new Date(notification.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <IconBell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No notifications sent yet
              </p>
              <Button asChild className="mt-4" variant="outline" size="sm">
                <Link href="/notifications/send">
                  <IconPlus className="mr-2 h-4 w-4" />
                  Send Your First Notification
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
