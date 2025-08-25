// utils/handleApiError.ts
import axios from "axios";

/**
 * Extracts a user-friendly error message from API/Network errors
 * Supports backend ApiError shape: { statusCode, message }
 */
export const handleApiError = (err: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(err)) {
    if (err.response?.data) {
      const data = err.response.data as { statusCode?: number; message?: string };

      // Backend ApiError message
      if (data?.message) return data.message;

      // If no message, show generic with status code
      if (data?.statusCode) return `Request failed with status ${data.statusCode}`;
    }

    if (err.request) {
      return "No response from server. Please try again later.";
    }
  }

  if (err instanceof Error) {
    return err.message;
  }

  return defaultMessage;
};
