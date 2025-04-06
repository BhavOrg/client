// src/services/postsService.ts
import axios from "axios";
import authAxios from "../services/authService";
import {
  Post,
  PostCreationData,
  PostsQueryParams,
  PaginatedResponse,
  UrgencyLevel,
  PostsResponse,
  Tag,
} from "../types/feed";

const API_URL = "/api";

/**
 * Transforms the API response post format to the client-side format
 */
const transformPostData = (post: Post): Post => {
  return {
    ...post,
    // Map API fields to client-side fields for compatibility
    id: post.post_id,
    likeCount: post.upvotes,
    hasExpertResponse: post.expert_responded,
    isAnonymous: post.is_anonymous,
    // Create minimal author object
    author: {
      id: post.author_id || "",
      username: post.author_username || "Anonymous",
      isExpert: false, // We would need additional data to determine this accurately
    },
    // These may need to be populated from elsewhere if the API doesn't provide them
    isLikedByUser: false,
    isSavedByUser: false,
    hasTriggerWarning: false,
  };
};

/**
 * Fetches posts with pagination and filtering options
 */
export const fetchPosts = async (
  params: PostsQueryParams,
): Promise<PaginatedResponse<Post>> => {
  try {
    const response = await axios.get<PostsResponse>(`${API_URL}/posts/feed`, {
      params,
    });

    // Transform each post to match the client-side format
    const transformedPosts = response.data.data.posts.map(transformPostData);

    return {
      data: transformedPosts,
      page: response.data.data.pagination.page,
      totalPages: response.data.data.pagination.totalPages,
      totalItems: response.data.data.pagination.total,
      hasNextPage:
        response.data.data.pagination.page <
        response.data.data.pagination.totalPages,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

/**
 * Fetches a single post by ID
 */
export const fetchPostById = async (postId: string): Promise<Post> => {
  try {
    const response = await axios.get(`${API_URL}/posts/${postId}`);
    return transformPostData(response.data.data.post);
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error);
    throw error;
  }
};

/**
 * Creates a new post
 */
import AuthService from "../services/authService";

export const createPost = async (postData: PostCreationData): Promise<Post> => {
  try {
    const response = await AuthService.authAxios.post<{
      status: string;
      message: string;
      data: { post: Post };
    }>(`/posts`, postData);

    return transformPostData(response.data.data.post);
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

/**
 * Updates an existing post
 */
export const updatePost = async (
  postId: string,
  postData: Partial<PostCreationData>,
): Promise<Post> => {
  try {
    const response = await axios.put(`${API_URL}/posts/${postId}`, {
      content: postData.content,
      is_anonymous: postData.isAnonymous,
      tags: postData.tags,
      has_trigger_warning: postData.hasTriggerWarning,
      trigger_warning_text: postData.triggerWarningText,
    });

    return transformPostData(response.data.data.post);
  } catch (error) {
    console.error(`Error updating post ${postId}:`, error);
    throw error;
  }
};

/**
 * Deletes a post
 */
export const deletePost = async (postId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/posts/${postId}`);
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    throw error;
  }
};

/**
 * Likes or unlikes a post
 */
export const likePost = async (
  postId: string,
  isLiked: boolean,
): Promise<void> => {
  try {
    const voteType = isLiked ? "up" : "down";
    await axios.post(`${API_URL}/posts/${postId}/vote`, { voteType });
  } catch (error) {
    console.error(`Error ${isLiked ? "liking" : "unliking"} post:`, error);
    throw error;
  }
};

/**
 * Saves or unsaves a post for the current user
 */
export const savePost = async (
  postId: string,
  isSaved: boolean,
): Promise<void> => {
  try {
    const endpoint = isSaved ? "save" : "unsave";
    await axios.post(`${API_URL}/posts/${postId}/${endpoint}`);
  } catch (error) {
    console.error(`Error ${isSaved ? "saving" : "unsaving"} post:`, error);
    throw error;
  }
};

/**
 * Reports a post for moderation
 */
export const reportPost = async (
  postId: string,
  reason: string,
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/posts/${postId}/report`, { reason });
  } catch (error) {
    console.error("Error reporting post:", error);
    throw error;
  }
};

/**
 * Updates the urgency level of a post
 * This might be used by moderators or automated systems
 */
export const updatePostUrgency = async (
  postId: string,
  urgencyLevel: UrgencyLevel,
): Promise<Post> => {
  try {
    const response = await axios.patch(`${API_URL}/posts/${postId}/urgency`, {
      urgencyLevel,
    });
    return transformPostData(response.data.data.post);
  } catch (error) {
    console.error(`Error updating post urgency:`, error);
    throw error;
  }
};

/**
 * Fetches posts that need expert attention
 * This might be used in expert dashboards
 */
export const fetchUrgentPosts = async (
  page: number = 1,
  limit: number = 20,
): Promise<PaginatedResponse<Post>> => {
  try {
    const response = await axios.get(`${API_URL}/posts/urgent`, {
      params: { page, limit },
    });

    // Transform each post to match the client-side format
    const transformedPosts = response.data.data.posts.map(transformPostData);

    return {
      data: transformedPosts,
      page: response.data.data.pagination.page,
      totalPages: response.data.data.pagination.totalPages,
      totalItems: response.data.data.pagination.total,
      hasNextPage:
        response.data.data.pagination.page <
        response.data.data.pagination.totalPages,
    };
  } catch (error) {
    console.error("Error fetching urgent posts:", error);
    throw error;
  }
};

/**
 * Fetches posts created by the current user
 */
export const fetchUserPosts = async (
  page: number = 1,
  limit: number = 20,
): Promise<PaginatedResponse<Post>> => {
  try {
    const response = await axios.get(`${API_URL}/posts/me`, {
      params: { page, limit },
    });

    // Transform each post to match the client-side format
    const transformedPosts = response.data.data.posts.map(transformPostData);

    return {
      data: transformedPosts,
      page: response.data.data.pagination.page,
      totalPages: response.data.data.pagination.totalPages,
      totalItems: response.data.data.pagination.total,
      hasNextPage:
        response.data.data.pagination.page <
        response.data.data.pagination.totalPages,
    };
  } catch (error) {
    console.error("Error fetching current user posts:", error);
    throw error;
  }
};

/**
 * Fetches posts saved by the current user
 */
export const fetchSavedPosts = async (
  page: number = 1,
  limit: number = 20,
): Promise<PaginatedResponse<Post>> => {
  try {
    const response = await axios.get(`${API_URL}/posts/saved`, {
      params: { page, limit },
    });

    // Transform each post to match the client-side format
    const transformedPosts = response.data.data.posts.map(transformPostData);

    return {
      data: transformedPosts,
      page: response.data.data.pagination.page,
      totalPages: response.data.data.pagination.totalPages,
      totalItems: response.data.data.pagination.total,
      hasNextPage:
        response.data.data.pagination.page <
        response.data.data.pagination.totalPages,
    };
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    throw error;
  }
};

/**
 * Marks a post as having been viewed by an expert
 * This might be used when an expert reviews a post
 */
export const markPostReviewedByExpert = async (
  postId: string,
): Promise<Post> => {
  try {
    const response = await axios.post(
      `${API_URL}/posts/${postId}/expert-review`,
    );
    return transformPostData(response.data.data.post);
  } catch (error) {
    console.error(`Error marking post as reviewed by expert:`, error);
    throw error;
  }
};
