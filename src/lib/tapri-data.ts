export type MenuItem = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: 'tea' | 'snack' | 'beverage' | 'coldrink';
};

export const MENU: MenuItem[] = [
  // Tea varieties
  { id: 'masala-chai', name: 'Masala Chai', emoji: '☕', price: 15, category: 'tea' },
  { id: 'ginger-chai', name: 'Adrak Chai', emoji: '🫚', price: 18, category: 'tea' },
  { id: 'elaichi-chai', name: 'Elaichi Chai', emoji: '🌿', price: 20, category: 'tea' },
  { id: 'kulhad-chai', name: 'Kulhad Chai', emoji: '🍵', price: 25, category: 'tea' },
  { id: 'lemon-tea', name: 'Lemon Tea', emoji: '🍋', price: 20, category: 'tea' },
  { id: 'green-tea', name: 'Green Tea', emoji: '🍃', price: 22, category: 'tea' },
  { id: 'black-tea', name: 'Black Tea', emoji: '⚫', price: 12, category: 'tea' },

  // Snacks
  { id: 'samosa', name: 'Samosa', emoji: '🥟', price: 15, category: 'snack' },
  { id: 'kachori', name: 'Kachori', emoji: '🥮', price: 18, category: 'snack' },
  { id: 'vada-pav', name: 'Vada Pav', emoji: '🍔', price: 25, category: 'snack' },
  { id: 'parle-g', name: 'Parle-G', emoji: '🍪', price: 5, category: 'snack' },
  { id: 'good-day', name: 'Good Day', emoji: '🥠', price: 10, category: 'snack' },
  { id: 'rusk', name: 'Rusk', emoji: '🍞', price: 8, category: 'snack' },
  { id: 'maggi', name: 'Maggi', emoji: '🍜', price: 30, category: 'snack' },

  // Milk beverages
  { id: 'boost', name: 'Boost', emoji: '💪', price: 30, category: 'beverage' },
  { id: 'horlicks', name: 'Horlicks', emoji: '🥛', price: 30, category: 'beverage' },
  { id: 'bournvita', name: 'Bournvita', emoji: '🍫', price: 30, category: 'beverage' },
  { id: 'badam-milk', name: 'Badam Milk', emoji: '🌰', price: 35, category: 'beverage' },
  { id: 'coffee', name: 'Filter Coffee', emoji: '☕', price: 25, category: 'beverage' },

  // Cold drinks
  { id: 'thums-up', name: 'Thums Up', emoji: '🥤', price: 25, category: 'coldrink' },
  { id: 'sprite', name: 'Sprite', emoji: '🧊', price: 25, category: 'coldrink' },
  { id: 'lassi', name: 'Sweet Lassi', emoji: '🍶', price: 40, category: 'coldrink' },
  { id: 'nimbu-pani', name: 'Nimbu Pani', emoji: '🍋', price: 20, category: 'coldrink' },
  { id: 'cold-coffee', name: 'Cold Coffee', emoji: '🧋', price: 45, category: 'coldrink' },
];

export const CATEGORIES: { id: MenuItem['category']; label: string; emoji: string }[] = [
  { id: 'tea', label: 'Chai', emoji: '☕' },
  { id: 'snack', label: 'Snacks', emoji: '🥟' },
  { id: 'beverage', label: 'Milk Drinks', emoji: '🥛' },
  { id: 'coldrink', label: 'Cold', emoji: '🥤' },
];

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
  pending:    { label: 'Pending',   color: 'bg-saffron/20 text-saffron border-saffron/40',         dot: 'bg-saffron' },
  preparing:  { label: 'Preparing', color: 'bg-chai/15 text-chai border-chai/40',                  dot: 'bg-chai' },
  ready:      { label: 'Ready',     color: 'bg-neon/20 text-neon border-neon/50',                  dot: 'bg-neon' },
  completed:  { label: 'Done',      color: 'bg-muted text-muted-foreground border-border',         dot: 'bg-muted-foreground' },
};

export const SUGGESTIONS = [
  { group: 'CSE Lab Team', items: 'Usually orders 50 Masala Chai at 4 PM', presetItems: [{ id: 'masala-chai', qty: 50 }] },
  { group: 'ECE Fest Crew', items: 'Loves 25 Samosas + 25 Chai combo', presetItems: [{ id: 'samosa', qty: 25 }, { id: 'masala-chai', qty: 25 }] },
  { group: 'Hostel Block C', items: '30 Maggi every late-night study', presetItems: [{ id: 'maggi', qty: 30 }] },
];
