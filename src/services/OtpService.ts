// services/OtpService.ts
import { ApiError } from '../models/ApiError';
import { OTPPurpose } from '../utils/Enum';
import apiClient from './ApiClient';
import { handleApiError } from './UtilsService';

export const requestOtp = async (email: string, purpose: OTPPurpose): Promise<void> => {
  try {
    await apiClient.post('/otp/request', { email , purpose});
  } catch (err) {
    const message = handleApiError(err, 'Failed to send OTP');
    const error: ApiError = { message };
    throw error;
  }
};

export const verifyOtp = async (email: string, code: string, purpose: OTPPurpose): Promise<void> => {
  try {
    await apiClient.post('/otp/verify', { email, code, purpose });
  } catch (err) {
    const message = handleApiError(err, 'OTP verification failed');
    const error: ApiError = { message };
    throw error;
  }
};
