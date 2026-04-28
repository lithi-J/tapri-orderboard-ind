import type { MenuItem } from './menu-api-contract';

export type { MenuItem } from './menu-api-contract';

export const CATEGORIES: { id: MenuItem['category']; label: string; emoji: string }[] = [
  { id: 'tea', label: 'Chai', emoji: '☕' },
  { id: 'snack', label: 'Snacks', emoji: '🥟' },
  { id: 'beverage', label: 'Milk Drinks', emoji: '🥛' },
  { id: 'coldrink', label: 'Cold', emoji: '🥤' },
];
export const CATEGORY_LABELS: Record<MenuItem['category'], string> = {
  tea: 'TEA',
  snack: 'SNACK',
  beverage: 'BEVERAGE',
  coldrink: 'COLD DRINK',
};
export const CATEGORY_EMOJIS: Record<MenuItem['category'], string> = {
  tea: '☕',
  snack: '🥟',
  beverage: '🥛',
  coldrink: '🥤',
};

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';

export type Order = {
  id: string;
  groupName: string;
  customerName: string;
  phone: string;
  items: { id: string; name: string; emoji: string; qty: number; price: number }[];
  total: number;
  pickupTime: string; // ISO
  status: OrderStatus;
  createdAt: number;
  urgent?: boolean;
};

export const STATUS_FLOW: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed'];

export const STATUS_META: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  pending: { label: 'Pending', color: 'bg-saffron/20 text-saffron border-saffron/40', dot: 'bg-saffron' },
  preparing: { label: 'Preparing', color: 'bg-chai/15 text-chai border-chai/40', dot: 'bg-chai' },
  ready: { label: 'Ready', color: 'bg-neon/20 text-neon border-neon/50', dot: 'bg-neon' },
  completed: { label: 'Done', color: 'bg-muted text-muted-foreground border-border', dot: 'bg-muted-foreground' },
};
