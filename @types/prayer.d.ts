interface DailyPrayer {
  id: string;
  title: string;
  content: string;
  scriptureReference: string;
  scriptureText: string;
  date: string;
  authorId: string;
  authorName: string;
  likesCount: number;
  commentsCount: number;
  isActive: boolean;
  createdAt: string;
}

interface DailyPrayerComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  content: string;
  createdAt: string;
}

interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  requestedBy: string;
  requestedById?: string;
  category: PrayerCategory;
  status: PrayerRequestStatus;
  isAnonymous: boolean;
  prayerCount: number;
  createdAt: string;
  updatedAt?: string;
  answeredAt?: string;
  testimonial?: string;
}

type PrayerCategory =
  | "healing"
  | "family"
  | "financial"
  | "spiritual"
  | "guidance"
  | "thanksgiving"
  | "other";

type PrayerRequestStatus = "pending" | "answered" | "in_progress";

interface CreateDailyPrayerData {
  title: string;
  content: string;
  scriptureReference: string;
  scriptureText: string;
  date: string;
  authorId: string;
  authorName: string;
}

interface CreatePrayerRequestData {
  title: string;
  description: string;
  requestedBy: string;
  requestedById?: string;
  category: PrayerCategory;
  isAnonymous?: boolean;
}
