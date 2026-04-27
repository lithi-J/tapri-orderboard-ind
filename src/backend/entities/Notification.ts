export type NotificationType = 'new_order' | 'status_update' | 'delayed' | 'pickup_reminder';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  orderId?: string;
  isRead: boolean;
  createdAt: number;
}
