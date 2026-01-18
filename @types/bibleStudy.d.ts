type BibleStudyType = "topic" | "book" | "series" | "devotional";

interface BibleStudySession {
  id: string;
  title: string;
  description: string;
  type: BibleStudyType;
  scriptureReference: string;
  content: string;
  videoUrl: string | null;
  audioUrl: string | null;
  pdfUrl: string | null;
  thumbnailUrl: string | null;
  authorId: string;
  authorName: string;
  duration: number; // in minutes
  isActive: boolean;
  scheduledDate: string | null;
  createdAt: string;
}

interface BibleStudyTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  sessionsCount: number;
  color: string;
}

interface CreateBibleStudySessionData {
  title: string;
  description: string;
  type: BibleStudyType;
  scriptureReference: string;
  content: string;
  videoUrl?: string | null;
  audioUrl?: string | null;
  pdfUrl?: string | null;
  thumbnailUrl?: string | null;
  authorId: string;
  authorName: string;
  duration: number;
  scheduledDate?: string | null;
}
