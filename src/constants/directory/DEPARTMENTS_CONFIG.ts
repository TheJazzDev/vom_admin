import { DepartmentKeysEnum } from "@/enums/department";

export const DEPARTMENTS_CONFIG = {
  [DepartmentKeysEnum.INTERPRETATION]: {
    id: DepartmentKeysEnum.INTERPRETATION,
    name: "Interpretation",
    description:
      "Translating and interpreting services for multilingual congregation",
    gradient: ["#3B82F6", "#1E40AF"],
    icon1: "bubble.left.and.bubble.right.fill",
    icon2: "",
    meetingTime: "",
    meetingDay: "Thursdays 6:00 PM",
  },
  [DepartmentKeysEnum.PROGRAMME]: {
    id: DepartmentKeysEnum.PROGRAMME,
    name: "Programme",
    description:
      "Planning, organizing and coordinating all church events and services",
    gradient: ["#10B981", "#047857"],
    icon1: "calendar.badge.plus",
    icon2: "",
    meetingTime: "",
    meetingDay: "Tuesdays 7:00 PM",
  },
  [DepartmentKeysEnum.MEDIA]: {
    id: DepartmentKeysEnum.MEDIA,
    name: "Media",
    description:
      "Managing church communications, photography, and video production",
    gradient: ["#8B5CF6", "#7C3AED"],
    icon1: "camera.fill",
    icon2: "",
    meetingTime: "",
    meetingDay: "Wednesdays 6:30 PM",
  },
  [DepartmentKeysEnum.TREASURY]: {
    id: DepartmentKeysEnum.TREASURY,
    name: "Treasury",
    description:
      "Managing church finances, tithes, offerings and financial records",
    gradient: ["#F59E0B", "#D97706"],
    icon1: "dollarsign.circle.fill",
    icon2: "",
    meetingTime: "",
    meetingDay: "Fridays 7:30 PM",
  },
  [DepartmentKeysEnum.TECHNICAL]: {
    id: DepartmentKeysEnum.TECHNICAL,
    name: "Technical",
    description:
      "Sound engineering, lighting, and audiovisual equipment management",
    gradient: ["#06B6D4", "#0891B2"],
    icon1: "speaker.wave.3.fill",
    icon2: "",
    meetingTime: "",
    meetingDay: "Saturdays 5:00 PM",
  },
  [DepartmentKeysEnum.DRAMA]: {
    id: DepartmentKeysEnum.DRAMA,
    name: "Drama",
    description:
      "Theatrical performances, skits, and creative presentations for ministry",
    gradient: ["#EC4899", "#BE185D"],
    icon1: "theatermasks.fill",
    icon2: "",
    meetingTime: "",
    meetingDay: "Saturdays 3:00 PM",
  },
  [DepartmentKeysEnum.IT]: {
    id: DepartmentKeysEnum.IT,
    name: "IT",
    description:
      "Information Technology, website management, and digital infrastructure",
    gradient: ["#6366F1", "#4338CA"],
    icon1: "desktopcomputer",
    icon2: "",
    meetingTime: "",
    meetingDay: "Thursdays 7:00 PM",
  },
  [DepartmentKeysEnum.EVANGELISM]: {
    id: DepartmentKeysEnum.EVANGELISM,
    name: "Evangelism",
    description: "Spreading the Gospel, soul winning, and outreach programs",
    gradient: ["#EF4444", "#DC2626"],
    icon1: "megaphone.fill",
    icon2: "",
    meetingTime: "",
    meetingDay: "Saturdays 4:00 PM",
  },
  [DepartmentKeysEnum.SANITATION]: {
    id: DepartmentKeysEnum.SANITATION,
    name: "Sanitation",
    description:
      "Maintaining cleanliness and hygiene throughout church premises",
    // gradient: ['#10B981', '#34D399'],
    gradient: ["#10B981", "#34D399"],
    icon1: "sparkles",
    icon2: "",
    meetingTime: "",
    meetingDay: "Saturdays 8:00 AM",
  },
  [DepartmentKeysEnum.SECRETARIAT]: {
    id: DepartmentKeysEnum.SECRETARIAT,
    name: "Secretariat",
    description:
      "Handles administrative, documentation, and correspondence tasks for the church",
    gradient: ["#3B82F6", "#2563EB"],
    icon1: "sparkles",
    icon2: "",
    meetingTime: "",
    meetingDay: "Saturdays 8:00 AM",
  },
};
