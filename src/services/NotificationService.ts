import { Notification } from "../models/Notification";
import apiClient from "./ApiClient";
import { handleApiError } from "./UtilsService";

export const getUserNotifications = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ notifications: Notification[]; page: number; limit: number; total: number; totalPages: number }> => {
  try {
    const response = await apiClient.get(`/notifications/users/${userId}`, {
      params: { page, limit },
    });

    const { notifications, page: currentPage, limit: perPage, total, totalPages } = response.data.data;

    return { notifications, page: currentPage, limit: perPage, total, totalPages };
  } catch (err) {
    const message = handleApiError(err, 'Failed to fetch notifications');
    throw new Error(message);
  }
};

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
