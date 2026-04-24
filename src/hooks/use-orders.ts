import { useEffect, useState, useCallback } from 'react';
import type { Order, OrderStatus } from '@/lib/tapri-data';

const STORAGE_KEY = 'tapri-orders-v1';

const seedOrders = (): Order[] => {
  const now = Date.now();
  return [
    {
      id: 'ord-1001',
      groupName: 'CSE Lab Team',
      customerName: 'Rahul Sharma',
      phone: '98765 43210',
      items: [
        { id: 'masala-chai', name: 'Masala Chai', emoji: '☕', qty: 25, price: 15 },
        { id: 'samosa', name: 'Samosa', emoji: '🥟', qty: 10, price: 15 },
      ],
      total: 25 * 15 + 10 * 15,
      pickupTime: new Date(now + 8 * 60 * 1000).toISOString(),
      status: 'preparing',
      createdAt: now - 5 * 60 * 1000,
    },
    {
      id: 'ord-1002',
      groupName: 'ECE Fest Crew',
      customerName: 'Priya Nair',
      phone: '91234 56780',
      items: [
        { id: 'kulhad-chai', name: 'Kulhad Chai', emoji: '🍵', qty: 50, price: 25 },
      ],
      total: 50 * 25,
      pickupTime: new Date(now + 2 * 60 * 1000).toISOString(),
      status: 'pending',
      createdAt: now - 2 * 60 * 1000,
      urgent: true,
    },
    {
      id: 'ord-1003',
      groupName: 'Hostel Block C',
      customerName: 'Arjun Mehta',
      phone: '99887 76655',
      items: [
        { id: 'maggi', name: 'Maggi', emoji: '🍜', qty: 15, price: 30 },
        { id: 'cold-coffee', name: 'Cold Coffee', emoji: '🧋', qty: 10, price: 45 },
      ],
      total: 15 * 30 + 10 * 45,
      pickupTime: new Date(now + 20 * 60 * 1000).toISOString(),
      status: 'ready',
      createdAt: now - 15 * 60 * 1000,
    },
  ];
};

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setOrders(JSON.parse(raw));
      } else {
        setOrders(seedOrders());
      }
    } catch {
      setOrders(seedOrders());
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders, loaded]);

  const addOrder = useCallback((o: Order) => setOrders(prev => [o, ...prev]), []);
  const updateStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
  }, []);
  const removeOrder = useCallback((id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  }, []);

  return { orders, addOrder, updateStatus, removeOrder };
};
