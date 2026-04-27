import { Notification } from '../entities/Notification';

export interface INotificationRepository {
  getAll(): Promise<Notification[]>;
  create(notification: Notification): Promise<Notification>;
  markAsRead(id: string): Promise<boolean>;
  markAllAsRead(): Promise<void>;
  delete(id: string): Promise<boolean>;
  deleteAll(): Promise<void>;
  deleteOld(timestamp: number): Promise<void>;
}

export class InMemoryNotificationRepository implements INotificationRepository {
  private notifications: Notification[] = [];

  async getAll(): Promise<Notification[]> {
    return [...this.notifications].sort((a, b) => b.createdAt - a.createdAt);
  }

  async create(notification: Notification): Promise<Notification> {
    this.notifications.push(notification);
    return notification;
  }

  async markAsRead(id: string): Promise<boolean> {
    const n = this.notifications.find(x => x.id === id || x.orderId === id);
    if (n) {
      n.isRead = true;
      return true;
    }
    return false;
  }

  async markAllAsRead(): Promise<void> {
    this.notifications.forEach(n => n.isRead = true);
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.notifications.length;
    this.notifications = this.notifications.filter(n => n.id !== id);
    return this.notifications.length < initialLength;
  }

  async deleteAll(): Promise<void> {
    this.notifications = [];
  }

  async deleteOld(timestamp: number): Promise<void> {
    this.notifications = this.notifications.filter(n => n.createdAt > timestamp);
  }
}
