import type { LucideIcon } from "lucide-react";
import { Bell, Calendar, ClipboardList, Heart, Send, Shield, Users } from "lucide-react";
import { RoleEnum } from "@/enums";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: {
    title: string;
    url: string;
  }[];
  roles?: string[]; // Allowed roles to view this item. If undefined/empty, all roles can view
}

export const navigation: NavItem[] = [
  {
    title: "Programmes",
    url: "/programmes",
    icon: Calendar,
    items: [
      { title: "Overview", url: "/programmes" },
      { title: "Create New", url: "/programmes/create" },
      { title: "Upcoming", url: "/programmes/upcoming" },
      { title: "Past", url: "/programmes/past" },
      { title: "Drafts", url: "/programmes/drafts" },
    ],
  },
  {
    title: "Directory",
    url: "/directory",
    icon: Users,
    items: [
      { title: "Overview", url: "/directory" },
      { title: "Members", url: "/directory/members" },
      { title: "Bands", url: "/directory/bands" },
      { title: "Children", url: "/directory/children" },
      { title: "First Timers", url: "/first-timers" },
    ],
  },
  {
    title: "Attendance",
    url: "/attendance",
    icon: ClipboardList,
  },
  {
    title: "Ministry",
    url: "/ministry",
    icon: Heart,
    items: [
      { title: "Daily Prayers", url: "/ministry/prayers" },
      { title: "Bible Study", url: "/ministry/bible-study" },
      { title: "Recent Sermons", url: "/ministry/recent-sermons" },
      { title: "Prayer Requests", url: "/ministry/prayer-requests" },
      { title: "Testimonies", url: "/ministry/testimonies" },
    ],
  },
  {
    title: "Information",
    url: "/information",
    icon: Bell,
    items: [
      { title: "Announcements", url: "/information/announcements" },
      { title: "Events", url: "/information/events" },
      { title: "Weekly Activities", url: "/information/weekly-activities" },
      { title: "Monthly Activities", url: "/information/monthly-activities" },
    ],
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Send,
    items: [
      { title: "Overview", url: "/notifications" },
      { title: "Send Notification", url: "/notifications/send" },
    ],
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Shield,
    items: [{ title: "Role Management", url: "/admin/roles" }],
    roles: [RoleEnum.SUPER_ADMIN], // Only super admin can see this section
  },
];
