// src/services/tagsService.ts
import axios from "axios";
import { Tag } from "../types/feed";

const API_URL = "/api";

export const fetchTags = async (category?: string): Promise<Tag[]> => {
  try {
    const response = await axios.get(`${API_URL}/tags`, {
      params: category ? { category } : undefined,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};

export const fetchPopularTags = async (limit: number = 10): Promise<Tag[]> => {
  try {
    const response = await axios.get(`${API_URL}/tags/popular`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching popular tags:", error);
    throw error;
  }
};

export const createTag = async (
  name: string,
  category?: string,
): Promise<Tag> => {
  try {
    const response = await axios.post(`${API_URL}/tags`, {
      name,
      category,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating tag:", error);
    throw error;
  }
};

export const fetchTagsByIds = async (tagIds: string[]): Promise<Tag[]> => {
  try {
    if (!tagIds.length) return [];

    const response = await axios.get(`${API_URL}/tags/byIds`, {
      params: { ids: tagIds.join(",") },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tags by ids:", error);
    throw error;
  }
};
