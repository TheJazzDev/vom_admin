"use client";

import { BookOpen, Bot, Frame, Settings2, SquareTerminal } from "lucide-react";
import type * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  // teams: [
  //   {
  //     name: 'Acme Inc',
  //     logo: GalleryVerticalEnd,
  //     plan: 'Enterprise',
  //   },
  //   {
  //     name: 'Acme Corp.',
  //     logo: AudioWaveform,
  //     plan: 'Startup',
  //   },
  //   {
  //     name: 'Evil Corp.',
  //     logo: Command,
  //     plan: 'Free',
  //   },
  // ],
  navMain: [
    {
      title: "Programme",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Overview",
          url: "/programme",
        },
        {
          title: "Create new",
          url: "/programme/new",
        },
        {
          title: "Upcoming",
          url: "/programme/upcoming",
        },
        {
          title: "Past",
          url: "/programme/past",
        },
      ],
    },
    {
      title: "Directory",
      url: "/directory",
      icon: SquareTerminal,
      items: [
        {
          title: "Overview",
          url: "/directory",
        },
        {
          title: "Members",
          url: "/directory/members",
        },
        {
          title: "Bands",
          url: "/directory/bands",
        },
        {
          title: "Children",
          url: "/directory/children",
        },
      ],
    },
    {
      title: "Ministry",
      url: "/ministry",
      icon: Bot,
      items: [
        {
          title: "Bible Study",
          url: "/ministry/bible-study",
        },
        {
          title: "Recent Sermons",
          url: "/ministry/recent-sermons",
        },
        {
          title: "Prayer Requests",
          url: "/ministry/prayer-requests",
        },
        {
          title: "Testimonies",
          url: "/ministry/testimonies",
        },
      ],
    },

    {
      title: "Information",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Announcements",
          url: "/information/announcements",
        },
        {
          title: "Events",
          url: "/information/events",
        },
        {
          title: "Weekly Activities",
          url: "/information/weekly-activities",
        },
        {
          title: "Monthly Activities",
          url: "/information/monthly-activities",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>{/* <TeamSwitcher teams={data.teams} /> */}</SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavPages /> */}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
