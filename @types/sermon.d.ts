type SermonCategory =
  | "sunday"
  | "midweek"
  | "special"
  | "conference"
  | "revival";

interface Sermon {
  id: string;
  title: string;
  preacher: string;
  preacherTitle: string;
  preacherPhoto: string | null;
  description: string;
  scriptureReference: string;
  category: SermonCategory;
  videoUrl: string | null;
  audioUrl: string | null;
  thumbnailUrl: string | null;
  duration: number; // in minutes
  viewCount: number;
  isActive: boolean;
  sermonDate: string;
  createdAt: string;
}

interface SermonSeries {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  sermonsCount: number;
}

interface CreateSermonData {
  title: string;
  preacher: string;
  preacherTitle: string;
  preacherPhoto?: string | null;
  description: string;
  scriptureReference: string;
  category: SermonCategory;
  videoUrl?: string | null;
  audioUrl?: string | null;
  thumbnailUrl?: string | null;
  duration: number;
  sermonDate: string;
}
