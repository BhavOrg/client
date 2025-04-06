// Updated Post interface to match the API response
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

export interface ApiTag {
  tag_id: number;
  name: string;
  post_count: string;
}

export interface TagsResponse {
  status: string;
  data: {
    tags: ApiTag[];
  };
}

// Post types
export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export interface Post {
  post_id: string;
  author_id?: string;
  content: string;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  is_anonymous: boolean;
  sentiment_score?: string;
  urgency_level: UrgencyLevel;
  expert_responded: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  author_username: string | null;
  tags: string[] | Tag[];

  // Client-side properties (not from API)
  id?: string; // For backward compatibility
  author?: User; // Populated client-side
  likeCount?: number; // For backward compatibility
  isLikedByUser?: boolean;
  isSavedByUser?: boolean;
  hasTriggerWarning?: boolean;
  triggerWarningText?: string;
  hasExpertResponse?: boolean; // Alias for expert_responded
  isAnonymous?: boolean; // Alias for is_anonymous
}

// Comment types
export interface Comment {
  data: any;
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

// API response interfaces
export interface PostsResponse {
  status: string;
  data: {
    posts: Post[];
    pagination: PaginationInfo;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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

// Query params for fetching posts
export interface PostsQueryParams {
  page?: number;
  limit?: number;
  sort?: SortOption;
  filter?: FilterOption | null;
  tags?: string[];
  search?: string;
}

// Paginated response for client
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
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
