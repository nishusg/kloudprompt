import { Notification } from "../models/Notification";
import apiClient from "./ApiClient";
import { handleApiError } from "./UtilsService";

// ✅ Get all notifications for a user
export const getUserNotifications = async (
  userId: string
): Promise<Notification[]> => {
  try {
    const response = await apiClient.get(`/notifications/users/${userId}`);
    return response.data.data.notifications;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch notifications");
    throw new Error(message);
  }
};

// ✅ Mark a single notification as read
export const markNotificationAsRead = async (
  notificationId: string
): Promise<Notification> => {
  try {
    const response = await apiClient.patch(
      `/notifications/read/${notificationId}`
    );
    return response.data.data.notification;
  } catch (err) {
    const message = handleApiError(err, "Failed to mark notification as read");
    throw new Error(message);
  }
};

// ✅ Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (
  userId: string
): Promise<boolean> => {
  try {
    await apiClient.patch(`/notifications/users/${userId}/read-all`);
    return true;
  } catch (err) {
    const message = handleApiError(err, "Failed to mark all notifications as read");
    throw new Error(message);
  }
};

// ✅ Delete a notification
export const deleteNotification = async (
  notificationId: string
): Promise<boolean> => {
  try {
    await apiClient.delete(`/notifications/${notificationId}`);
    return true;
  } catch (err) {
    const message = handleApiError(err, "Failed to delete notification");
    throw new Error(message);
  }
};
