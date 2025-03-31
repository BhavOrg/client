import axios from "axios";
import { Comment, CommentCreationData } from "../types/feed";

const API_URL = "/api";

export const fetchComments = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await axios.get(`${API_URL}/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const createComment = async (
  postId: string,
  content: string,
  parentId?: string,
): Promise<Comment> => {
  try {
    const commentData: CommentCreationData = {
      content,
      isAnonymous: true, // Default to anonymous, could be made configurable
      parentId,
    };

    const response = await axios.post(
      `${API_URL}/posts/${postId}/comments`,
      commentData,
    );

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
    await axios.post(`${API_URL}/comments/${commentId}/${endpoint}`);
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
    await axios.post(`${API_URL}/comments/${commentId}/report`, { reason });
  } catch (error) {
    console.error("Error reporting comment:", error);
    throw error;
  }
};
