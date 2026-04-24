import { useEffect, useState } from 'react';
import { Clock, Phone, User, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Order, type OrderStatus, STATUS_META, STATUS_FLOW } from '@/lib/tapri-data';

interface OrderCardProps {
  order: Order;
  onAdvance: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
}

const useCountdown = (target: string) => {
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

export const OrderCard = ({ order, onAdvance, onDelete, onDragStart }: OrderCardProps) => {
  const { label, overdue, mins } = useCountdown(order.pickupTime);
  const isUrgent = order.status !== 'completed' && order.status !== 'ready' && (order.urgent || overdue || mins <= 5);
  const meta = STATUS_META[order.status];
  const nextStatus = STATUS_FLOW[Math.min(STATUS_FLOW.indexOf(order.status) + 1, STATUS_FLOW.length - 1)];
  const totalQty = order.items.reduce((a, b) => a + b.qty, 0);
  const hasTea = order.items.some(i => i.id.includes('chai') || i.id.includes('tea') || i.id === 'coffee');
  const isActive = order.status === 'preparing' || order.status === 'pending';

  return (
    <div
      draggable
      onDragStart={() => onDragStart(order.id)}
      className={`paper-card rounded-2xl p-4 cursor-grab active:cursor-grabbing transition-all hover:-translate-y-1 hover:shadow-warm animate-bounce-in ${
        isUrgent ? 'urgent-glow border-urgent/50' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2 min-w-0">
          {hasTea && isActive && (
            <div className="relative w-10 h-10 rounded-xl bg-gradient-chai flex items-center justify-center shrink-0">
              <span className="text-lg">☕</span>
              <span className="steam" />
              <span className="steam steam-2" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-display font-bold text-chai-deep truncate">{order.groupName}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><User className="w-3 h-3" />{order.customerName}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="w-3 h-3" />{order.phone}
            </div>
          </div>
        </div>
        <Badge variant="outline" className={`${meta.color} text-xs font-bold shrink-0`}>
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
            className={`flex-1 font-semibold ${
              order.status === 'ready'
                ? 'bg-neon text-chai-deep hover:bg-neon-glow'
                : 'bg-gradient-chai text-cream hover:opacity-90'
            }`}
          >
            {order.status === 'pending' && 'Start Preparing'}
            {order.status === 'preparing' && 'Mark Ready'}
            {order.status === 'ready' && 'Complete'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <div className="flex-1 text-center text-xs text-muted-foreground py-2 font-handwritten text-base">
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
