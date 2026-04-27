import { Order, OrderStatus } from '../entities/Order';
import { IOrderRepository } from './OrderRepository';
import { pool } from '../db';

export class SupabaseOrderRepository implements IOrderRepository {
  async getAll(): Promise<Order[]> {
    const { rows } = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    return rows.map(this.mapToEntity);
  }

  async getById(id: string): Promise<Order | null> {
    const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    return rows.length ? this.mapToEntity(rows[0]) : null;
  }

  async create(order: Order): Promise<Order> {
    const query = `
      INSERT INTO orders (id, group_name, customer_name, phone, items, total, pickup_time, status, created_at, urgent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      order.id,
      order.groupName,
      order.customerName,
      order.phone,
      JSON.stringify(order.items),
      order.total,
      order.pickupTime,
      order.status,
      order.createdAt,
      order.urgent
    ];
    const { rows } = await pool.query(query, values);
    return this.mapToEntity(rows[0]);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const query = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
    const { rows } = await pool.query(query, [status, id]);
    return rows.length ? this.mapToEntity(rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    return (rowCount ?? 0) > 0;
  }

  private mapToEntity(row: any): Order {
    return {
      id: row.id,
      groupName: row.group_name,
      customerName: row.customer_name,
      phone: row.phone,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
      total: parseFloat(row.total),
      pickupTime: row.pickup_time,
      status: row.status as OrderStatus,
      createdAt: parseInt(row.created_at),
      urgent: row.urgent
    };
  }
}
