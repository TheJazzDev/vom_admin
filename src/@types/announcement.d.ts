declare global {
  type AnnouncementType = "event" | "general" | "urgent" | "celebration";
  type AnnouncementPriority = "low" | "medium" | "high";

  interface Announcement {
    id: string;
    title: string;
    content: string;
    type: AnnouncementType;
    priority: AnnouncementPriority;
    date: string; // ISO date string
    author: string;
    readTime?: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    publishDate?: string; // Optional scheduled publish date
    expiryDate?: string; // Optional expiry date
  }

  type CreateAnnouncementInput = Omit<
    Announcement,
    "id" | "createdAt" | "updatedAt"
  >;
  type UpdateAnnouncementInput = Partial<CreateAnnouncementInput> & {
    id: string;
  };
}
