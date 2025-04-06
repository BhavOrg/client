import axios from "axios";
import { Comment, CommentCreationData } from "../types/feed";

const API_URL = "/api";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Create authenticated axios instance
const createAuthConfig = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const fetchComments = async (postId: string): Promise<any> => {
  try {
    // Include authentication token in the request
    const config = createAuthConfig();
    const response = await axios.get(
      `${API_URL}/comments/post/${postId}`,
      config,
    );

    // Return the full response for processing in the component
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { status: "error", message: "Failed to fetch comments" };
  }
};

export const createComment = async (
  postId: string,
  content: string,
  parentId?: string,
): Promise<any> => {
  try {
    const commentData: CommentCreationData = {
      content,
      isAnonymous: true, // Default to anonymous, could be made configurable
      parentId,
    };

    // Include authentication token in the request
    const config = createAuthConfig();
    const response = await axios.post(
      `${API_URL}/comments/post/${postId}`,
      commentData,
      config,
    );

    console.log("API response for new comment:", response.data);

    // Return the entire response data for processing in the component
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const likeComment = async (
  commentId: string,
  isLiked: boolean,
): Promise<void> => {
  try {
    const endpoint = isLiked ? "like" : "unlike";
    // Include authentication token in the request
    const config = createAuthConfig();
    await axios.post(
      `${API_URL}/comments/${commentId}/${endpoint}`,
      {},
      config,
    );
  } catch (error) {
    console.error(`Error ${isLiked ? "liking" : "unliking"} comment:`, error);
    throw error;
  }
};

export const reportComment = async (
  commentId: string,
  reason: string,
): Promise<void> => {
  try {
    // Include authentication token in the request
    const config = createAuthConfig();
    await axios.post(
      `${API_URL}/comments/${commentId}/report`,
      { reason },
      config,
    );
  } catch (error) {
    console.error("Error reporting comment:", error);
    throw error;
  }
};
