export interface OrderItem {
  id: string;
  name: string;
  emoji: string;
  qty: number;
  price: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';

export interface Order {
  id: string;
  groupName: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  total: number;
  pickupTime: string;
  status: OrderStatus;
  createdAt: number;
  urgent: boolean;
}
