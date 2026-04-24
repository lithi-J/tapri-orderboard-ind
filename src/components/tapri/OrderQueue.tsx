import { useState } from 'react';
import { OrderCard } from './OrderCard';
import { type Order, type OrderStatus, STATUS_META } from '@/lib/tapri-data';

interface OrderQueueProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
}

const COLUMNS: OrderStatus[] = ['pending', 'preparing', 'ready'];

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
        const colOrders = orders.filter(o => o.status === col);
        const meta = STATUS_META[col];
        const isOver = overCol === col;
        return (
          <div
            key={col}
            onDragOver={(e) => { e.preventDefault(); setOverCol(col); }}
            onDragLeave={() => setOverCol(null)}
            onDrop={() => handleDrop(col)}
            className={`rounded-2xl p-3 transition ${
              isOver ? 'bg-saffron/15 ring-2 ring-saffron border-saffron' : 'bg-secondary/50'
            } border border-border min-h-[200px]`}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${meta.dot}`} />
                <h3 className="font-display font-bold text-chai-deep uppercase text-sm tracking-wide">
                  {meta.label}
                </h3>
              </div>
              <span className="bg-cream text-chai-deep text-xs font-bold rounded-full px-2 py-0.5 min-w-[24px] text-center">
                {colOrders.length}
              </span>
            </div>
            <div className="space-y-3">
              {colOrders.length === 0 && (
                <div className="text-center py-8 font-handwritten text-chai/40 text-lg">
                  Drag orders here ↓
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
