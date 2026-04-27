import { Notification } from '../entities/Notification';
import { INotificationRepository } from './NotificationRepository';
import { pool } from '../db';

export class SupabaseNotificationRepository implements INotificationRepository {
  async getAll(): Promise<Notification[]> {
    const { rows } = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
    return rows.map(this.mapToEntity);
  }

  async create(notification: Notification): Promise<Notification> {
    const query = `
      INSERT INTO notifications (id, type, title, message, order_id, is_read, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      notification.id,
      notification.type,
      notification.title,
      notification.message,
      notification.orderId,
      notification.isRead,
      notification.createdAt
    ];
    const { rows } = await pool.query(query, values);
    return this.mapToEntity(rows[0]);
  }

  async markAsRead(id: string): Promise<boolean> {
    const query = 'UPDATE notifications SET is_read = TRUE WHERE id = $1 OR order_id = $1 RETURNING *';
    const { rowCount } = await pool.query(query, [id]);
    return (rowCount ?? 0) > 0;
  }

  async markAllAsRead(): Promise<void> {
    await pool.query('UPDATE notifications SET is_read = TRUE');
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await pool.query('DELETE FROM notifications WHERE id = $1', [id]);
    return (rowCount ?? 0) > 0;
  }

  async deleteAll(): Promise<void> {
    await pool.query('DELETE FROM notifications');
  }

  async deleteOld(timestamp: number): Promise<void> {
    await pool.query('DELETE FROM notifications WHERE created_at < $1', [timestamp]);
  }

  private mapToEntity(row: any): Notification {
    return {
      id: row.id,
      type: row.type as any,
      title: row.title,
      message: row.message,
      orderId: row.order_id,
      isRead: row.is_read,
      createdAt: parseInt(row.created_at)
    };
  }
}
