// src/services/tagsService.ts
import axios, { AxiosError, AxiosInstance } from "axios";
import { Tag } from "../types/feed";

// Centralized API configuration
const API_URL = "/api";

// Create a reusable axios instance with interceptors
const createAxiosInstance = (requireAuth = false): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add authentication if required
      if (requireAuth) {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Authentication required. Please log in.");
        }
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Centralized error handling
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

// Error handling utility
const handleAxiosError = (error: AxiosError) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    switch (error.response.status) {
      case 400:
        console.error("Bad Request:", error.response.data);
        break;
      case 401:
        console.error("Unauthorized: Authentication required");
        // Optionally trigger logout or token refresh
        break;
      case 403:
        console.error("Forbidden: You do not have permission");
        break;
      case 404:
        console.error("Not Found:", error.response.config.url);
        break;
      case 500:
        console.error("Server Error:", error.response.data);
        break;
      default:
        console.error(`Unexpected error: ${error.response.status}`);
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error("No response received:", error.request);
  } else {
    // Something happened in setting up the request
    console.error("Error setting up request:", error.message);
  }
};

// Authentication token retrieval (implement based on your auth system)
const getAuthToken = (): string | null => {
  // Retrieve token from storage (e.g., localStorage, sessionStorage)
  return localStorage.getItem("token");
};

export const fetchTags = async (category?: string): Promise<Tag[]> => {
  try {
    const response = await createAxiosInstance().get("/tags", {
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
    const response = await createAxiosInstance().get("/tags/popular", {
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
    // Require authentication for tag creation
    const response = await createAxiosInstance(true).post("/tags", {
      name,
      category,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating tag:", error);

    // More detailed error handling
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Specific handling for unauthorized errors
        throw new Error(
          "Authentication required. Please log in to create tags.",
        );
      }
    }

    throw error;
  }
};

export const fetchTagsByIds = async (tagIds: string[]): Promise<Tag[]> => {
  try {
    if (!tagIds.length) return [];

    const response = await createAxiosInstance().get("/tags/byIds", {
      params: { ids: tagIds.join(",") },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tags by ids:", error);
    throw error;
  }
};

// Optional: Add a method to validate and refresh token if needed
export const validateToken = async (): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) return false;

    // Send token validation request to backend
    await createAxiosInstance(true).get("/auth/validate");
    return true;
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
};
