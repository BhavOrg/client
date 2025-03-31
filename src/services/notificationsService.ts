// src/services/notificationsService.ts
import axios from "axios";
import { Notification } from "../types/feed";

const API_URL = "/api";

export const fetchNotifications = async (
  page: number = 1,
  limit: number = 20,
): Promise<{ notifications: Notification[]; unreadCount: number }> => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (
  notificationId: string,
): Promise<void> => {
  try {
    await axios.put(`${API_URL}/notifications/${notificationId}/read`);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await axios.put(`${API_URL}/notifications/read-all`);
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// For real-time notifications with WebSockets
export const setupNotificationSocket = (
  onNewNotification: (notification: Notification) => void,
  onUnreadCount: (count: number) => void,
): (() => void) => {
  // This is a placeholder for WebSocket implementation
  // In a real implementation, you would:
  // 1. Set up a WebSocket connection
  // 2. Listen for 'new-notification' events
  // 3. Listen for 'unread-count-update' events
  // 4. Return a cleanup function to close the connection

  console.log("Setting up notification socket (placeholder)");

  // This is a mock implementation for demonstration
  // Replace with actual WebSocket implementation
  const mockInterval = setInterval(() => {
    console.log("WebSocket would be listening for events here");
  }, 30000);

  // Return cleanup function
  return () => {
    clearInterval(mockInterval);
    console.log("Cleaning up notification socket (placeholder)");
  };
};

// For subscribing to push notifications (browser notifications)
export const subscribeToNotifications = async (): Promise<boolean> => {
  try {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      console.error("This browser does not support notifications");
      return false;
    }

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // Register with server for push notifications
      await axios.post(`${API_URL}/notifications/subscribe`);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error subscribing to notifications:", error);
    return false;
  }
};

export const unsubscribeFromNotifications = async (): Promise<void> => {
  try {
    await axios.post(`${API_URL}/notifications/unsubscribe`);
  } catch (error) {
    console.error("Error unsubscribing from notifications:", error);
    throw error;
  }
};
