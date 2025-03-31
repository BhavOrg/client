// User types
export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  isExpert?: boolean;
}

// Tag type
export interface Tag {
  id: string;
  name: string;
  count?: number;
  category?: string;
}

// Post types
export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export interface Post {
  id: string;
  author: User;
  content: string;
  tags: Tag[];
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  commentCount: number;
  isLikedByUser: boolean;
  isSavedByUser?: boolean;
  hasTriggerWarning: boolean;
  triggerWarningText?: string;
  urgencyLevel?: UrgencyLevel;
  hasExpertResponse: boolean;
  isAnonymous: boolean;
}

// Comment types
export interface Comment {
  id: string;
  author: User;
  content: string;
  postId: string;
  parentId?: string;
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  isLikedByUser: boolean;
  isExpertResponse: boolean;
  isAnonymous: boolean;
  replies?: Comment[];
}

// Filter and sort options
export type SortOption = "newest" | "popular" | "trending" | "mostComments";
export type FilterOption =
  | "needsSupport"
  | "expertResponses"
  | "myPosts"
  | "saved";

// Post creation types
export interface PostCreationData {
  content: string;
  isAnonymous: boolean;
  tags: string[];
  hasTriggerWarning: boolean;
  triggerWarningText?: string;
}

// Comment creation types
export interface CommentCreationData {
  content: string;
  isAnonymous: boolean;
  parentId?: string;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
}

// Query params for fetching posts
export interface PostsQueryParams {
  page?: number;
  limit?: number;
  sort?: SortOption;
  filter?: FilterOption | null;
  tags?: string[];
  search?: string;
}

// Notification types
export type NotificationType =
  | "comment"
  | "like"
  | "expertResponse"
  | "mention"
  | "tag"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedPostId?: string;
  relatedCommentId?: string;
  relatedUserId?: string;
}
