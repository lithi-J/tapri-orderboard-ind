import { Order, OrderStatus } from '../entities/Order';
import { IOrderRepository } from '../repositories/OrderRepository';

export class OrderService {
  constructor(private orderRepository: IOrderRepository) {}

  async listOrders(): Promise<Order[]> {
    return this.orderRepository.getAll();
  }

  async placeOrder(order: Order): Promise<Order> {
    // Generate a fresh unique ID for every order to prevent collisions
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    const newId = `ord-${timestamp}-${random}`;

    const newOrder = {
      ...order,
      id: newId,
      createdAt: order.createdAt || timestamp,
      status: order.status || 'pending',
    };
    return this.orderRepository.create(newOrder);
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    return this.orderRepository.updateStatus(id, status);
  }

  async cancelOrder(id: string): Promise<boolean> {
    return this.orderRepository.delete(id);
  }
}
