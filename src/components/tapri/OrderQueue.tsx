import { useState } from 'react';
import { OrderCard } from './OrderCard';
import { type Order, type OrderStatus, STATUS_META } from '@/lib/tapri-data';

interface OrderQueueProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
}

const COLUMNS: { id: OrderStatus; ring: string; bg: string; dot: string }[] = [
  { id: 'pending',   ring: 'border-urgent/60',  bg: 'bg-urgent/5',   dot: 'bg-urgent' },
  { id: 'preparing', ring: 'border-saffron/70', bg: 'bg-saffron/5',  dot: 'bg-saffron' },
  { id: 'ready',     ring: 'border-neon/70',    bg: 'bg-neon/5',     dot: 'bg-neon' },
];

export const OrderQueue = ({ orders, onUpdateStatus, onDelete }: OrderQueueProps) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<OrderStatus | null>(null);

  const handleDrop = (status: OrderStatus) => {
    if (draggingId) onUpdateStatus(draggingId, status);
    setDraggingId(null);
    setOverCol(null);
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      {COLUMNS.map(col => {
        const colOrders = orders.filter(o => o.status === col.id);
        const meta = STATUS_META[col.id];
        const isOver = overCol === col.id;
        return (
          <div
            key={col.id}
            onDragOver={(e) => { e.preventDefault(); setOverCol(col.id); }}
            onDragLeave={() => setOverCol(null)}
            onDrop={() => handleDrop(col.id)}
            className={`rounded-2xl p-3 border-2 border-dashed transition min-h-[260px] ${col.ring} ${col.bg} ${
              isOver ? 'ring-2 ring-saffron scale-[1.01]' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dot} animate-pulse`} />
                <h3 className="font-display font-extrabold text-chai-deep uppercase text-sm tracking-widest">
                  {meta.label}
                </h3>
              </div>
              <span className="bg-cream text-chai-deep text-xs font-extrabold rounded-full px-2.5 py-0.5 min-w-[26px] text-center border border-chai/20">
                {colOrders.length}
              </span>
            </div>
            <div className="space-y-3">
              {colOrders.length === 0 && (
                <div className="text-center py-10 font-handwritten text-chai/40 text-lg">
                  Drop orders here ↓
                </div>
              )}
              {colOrders.map(o => (
                <OrderCard
                  key={o.id}
                  order={o}
                  onAdvance={onUpdateStatus}
                  onDelete={onDelete}
                  onDragStart={setDraggingId}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};
