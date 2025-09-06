import { NotificationTypeEnum } from "../utils/Enum";

export interface Notification {
  _id: string;
  recipientId: string;
  senderId?: {
    _id: string;
    userName: string;
  };
  type: NotificationTypeEnum;
  message: string;
  promptId?: string;
  isRead: boolean;
  createdAt: string;
}
