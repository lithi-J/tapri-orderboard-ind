import { Order, OrderStatus } from '../entities/Order';

export interface IOrderRepository {
  getAll(): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
  create(order: Order): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
}

// In-memory implementation for demonstration
export class InMemoryOrderRepository implements IOrderRepository {
  private orders: Order[] = [];

  async getAll(): Promise<Order[]> {
    return this.orders;
  }

  async getById(id: string): Promise<Order | null> {
    return this.orders.find(o => o.id === id) || null;
  }

  async create(order: Order): Promise<Order> {
    this.orders.push(order);
    return order;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const index = this.orders.findIndex(o => o.id === id);
    if (index !== -1) {
      this.orders[index].status = status;
      return this.orders[index];
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.orders.length;
    this.orders = this.orders.filter(o => o.id !== id);
    return this.orders.length < initialLength;
  }
}
