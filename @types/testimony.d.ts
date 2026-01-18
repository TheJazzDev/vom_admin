type TestimonyCategory =
  | "healing"
  | "provision"
  | "deliverance"
  | "salvation"
  | "restoration"
  | "breakthrough"
  | "protection"
  | "other";

type TestimonyStatus = "pending" | "approved" | "rejected";

interface Testimony {
  id: string;
  title: string;
  content: string;
  category: TestimonyCategory;
  status: TestimonyStatus;
  isAnonymous: boolean;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  likesCount: number;
  commentsCount: number;
  mediaUrls: string[];
  createdAt: string;
  approvedAt: string | null;
}

interface TestimonyComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  content: string;
  createdAt: string;
}

interface CreateTestimonyData {
  title: string;
  content: string;
  category: TestimonyCategory;
  isAnonymous: boolean;
  authorId: string;
  authorName: string;
  authorAvatar?: string | null;
  mediaUrls?: string[];
}
