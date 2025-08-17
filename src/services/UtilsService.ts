import { AxiosError } from "axios";

// 🔹 Utility to extract error safely
export const handleApiError = (err: unknown, fallback: string): never => {
  const error = err as AxiosError<any>;
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(error.message || fallback);
};