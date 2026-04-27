import { useEffect, useRef, useState } from 'react';
import { Clock, Phone, User, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Order, type OrderStatus, STATUS_META, STATUS_FLOW } from '@/lib/tapri-data';
import { TeaFillProgress } from './TeaFillProgress';
import { PickedUpStamp } from './PickedUpStamp';

interface OrderCardProps {
  order: Order;
  onAdvance: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
}

const useCountdown = (target: string | number) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = new Date(target).getTime() - now;
  const abs = Math.abs(diff);
  const mins = Math.floor(abs / 60000);
  const secs = Math.floor((abs % 60000) / 1000);
  return { label: `${mins}:${String(secs).padStart(2, '0')}`, overdue: diff < 0, mins };
};

const STAGE_BY_STATUS: Record<OrderStatus, 0 | 1 | 2 | 3> = {
  pending: 0,
  preparing: 1,
  ready: 2,
  completed: 3,
};

export const OrderCard = ({ order, onAdvance, onDelete, onDragStart }: OrderCardProps) => {
  const { label, overdue, mins } = useCountdown(order.pickupTime);
  const isUrgent = order.status !== 'completed' && order.status !== 'ready' && (order.urgent || overdue || mins <= 5);
  const meta = STATUS_META[order.status];
  const nextStatus = STATUS_FLOW[Math.min(STATUS_FLOW.indexOf(order.status) + 1, STATUS_FLOW.length - 1)];
  const totalQty = order.items.reduce((a, b) => a + b.qty, 0);
  const isBrewing = order.status === 'preparing';
  const isPickedUp = order.status === 'completed';

  // Show stamp briefly when transitioning into completed within this card's lifetime
  const [showStamp, setShowStamp] = useState(isPickedUp);
  const prev = useRef(order.status);
  useEffect(() => {
    if (prev.current !== 'completed' && order.status === 'completed') {
      setShowStamp(true);
    }
    prev.current = order.status;
  }, [order.status]);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(order.id)}
      className={`relative paper-card rounded-2xl p-4 cursor-grab active:cursor-grabbing transition-all hover:-translate-y-1 hover:shadow-warm animate-bounce-in ${isUrgent ? 'urgent-glow border-urgent/60 border-2' : ''
        } ${isPickedUp ? 'opacity-90' : ''}`}
    >
      {showStamp && <PickedUpStamp />}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <TeaFillProgress stage={STAGE_BY_STATUS[order.status]} brewing={isBrewing} />
          <div className="min-w-0">
            <h3 className="font-display font-extrabold text-chai-deep uppercase tracking-wide truncate text-sm">
              {order.groupName}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span className="truncate">{order.customerName}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="w-3 h-3" />
              {order.phone}
            </div>
          </div>
        </div>
        <Badge variant="outline" className={`${meta.color} text-[10px] font-bold shrink-0 uppercase tracking-wider`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${meta.dot}`} />
          {meta.label}
        </Badge>
      </div>

      {/* Items */}
      <div className="bg-cream rounded-lg p-2 mb-3 space-y-1 border border-dashed border-chai/20">
        {order.items.map(it => (
          <div key={it.id} className="flex items-center justify-between text-sm">
            <span className="text-chai-deep">
              <span className="mr-1">{it.emoji}</span>{it.name}
            </span>
            <span className="font-bold text-chai">×{it.qty}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className={`flex items-center gap-1 text-sm font-mono font-bold ${isUrgent ? 'text-urgent' : 'text-chai-deep'}`}>
          <Clock className="w-4 h-4" />
          <span>{overdue ? `+${label}` : label}</span>
          {overdue && <span className="text-[10px] uppercase font-sans">overdue</span>}
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</div>
          <div className="font-display font-extrabold text-chai-deep">₹{order.total}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {order.status !== 'completed' ? (
          <Button
            size="sm"
            onClick={() => onAdvance(order.id, nextStatus)}
            className={`flex-1 font-semibold ${order.status === 'ready'
                ? 'bg-neon text-chai-deep hover:bg-neon-glow'
                : order.status === 'pending'
                  ? 'bg-gradient-saffron text-chai-deep hover:opacity-90'
                  : 'bg-gradient-chai text-cream hover:opacity-90'
              }`}
          >
            {order.status === 'pending' && 'Start Brewing'}
            {order.status === 'preparing' && 'Mark Ready'}
            {order.status === 'ready' && 'Picked Up ✓'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <div className="flex-1 text-center text-muted-foreground py-2 font-handwritten text-base">
            ✓ Served · {totalQty} items
          </div>
        )}
        <Button size="icon" variant="ghost" onClick={() => onDelete(order.id)} className="text-muted-foreground hover:text-urgent">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};