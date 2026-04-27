import { useState, useMemo } from 'react';
import { Plus, Minus, Send, Zap, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MENU, CATEGORIES, SUGGESTIONS, type Order } from '@/lib/tapri-data';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface OrderPanelProps {
  onPlace: (o: Omit<Order, 'id'>) => void;
  onPopper?: () => void;
  onCelebrate?: () => void;
}

export const OrderPanel = ({ onPlace, onPopper, onCelebrate }: OrderPanelProps) => {
  const [activeCat, setActiveCat] = useState<typeof CATEGORIES[number]['id']>('tea');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [groupName, setGroupName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupMins, setPickupMins] = useState(15);

  const items = useMemo(() => MENU.filter(m => m.category === activeCat), [activeCat]);

  const updateQty = (id: string, delta: number) => {
    setCart(c => {
      const next = (c[id] || 0) + delta;
      const copy = { ...c };
      if (next <= 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  };

  const setBulk = (id: string, qty: number) => setCart(c => ({ ...c, [id]: qty }));

  const total = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = MENU.find(m => m.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }, [cart]);

  const totalCups = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);

  const applySuggestion = (preset: { id: string; qty: number }[], group: string) => {
    const next: Record<string, number> = {};
    preset.forEach(p => { next[p.id] = p.qty; });
    setCart(next);
    setGroupName(group);
    onPopper?.();
    onCelebrate?.();
    toast.success('🎉 Quick reorder loaded — fire the kettle!');
  };

  const handlePlace = () => {
    if (!groupName.trim() || !customerName.trim() || !phone.trim()) {
      toast.error('Fill group, name & phone');
      return;
    }
    if (totalCups === 0) {
      toast.error('Add some items first');
      return;
    }
    // Note: id is omitted — the backend (OrderService.placeOrder) generates the canonical ID
    const order = {
      groupName: groupName.trim(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      items: Object.entries(cart).map(([id, qty]) => {
        const m = MENU.find(x => x.id === id)!;
        return { id, name: m.name, emoji: m.emoji, qty, price: m.price };
      }),
      total,
      pickupTime: new Date(Date.now() + pickupMins * 60 * 1000).toISOString(),
      status: 'pending' as const,
      createdAt: Date.now(),
      urgent: pickupMins <= 10,
    };
    onPlace(order);
    toast.success(`Order placed for ${groupName}! ☕`);
    setCart({});
    setGroupName('');
    setCustomerName('');
    setPhone('');
  };

  return (
    <aside className="paper-card rounded-2xl p-4 md:p-5 flex flex-col gap-4 h-fit lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-chai-deep">Place Order</h2>
          <p className="font-handwritten text-chai text-base -mt-0.5">Tap, count, send 🚀</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="border-chai/30 text-chai hover:bg-chai/10">
              <QrCode className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="paper-card">
            <DialogHeader>
              <DialogTitle className="text-chai-deep">Scan to Order ☕</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-56 h-56 rounded-xl bg-cream border-4 border-chai/30 p-3 grid grid-cols-8 grid-rows-8 gap-0.5">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className={`rounded-[2px] ${Math.random() > 0.5 ? 'bg-chai-deep' : 'bg-transparent'}`} />
                ))}
              </div>
              <p className="font-handwritten text-xl text-chai">Scan to skip the queue!</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 bg-secondary p-1 rounded-xl">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`flex-1 py-2 px-1 rounded-lg text-xs font-semibold transition ${activeCat === c.id
                ? 'bg-gradient-chai text-cream shadow-card'
                : 'text-chai-deep/70 hover:bg-cream'
              }`}
          >
            <div className="text-base">{c.emoji}</div>
            {c.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 -mr-1">
        {items.map(item => {
          const qty = cart[item.id] || 0;
          return (
            <div
              key={item.id}
              className={`rounded-xl border p-3 flex items-center gap-3 transition ${qty > 0 ? 'bg-saffron/10 border-saffron/40' : 'bg-cream border-border hover:border-chai/30'
                }`}
            >
              <div className="text-2xl">{item.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-chai-deep truncate">{item.name}</div>
                <div className="text-xs text-chai">₹{item.price}</div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="outline" className="h-7 w-7 border-chai/30" onClick={() => updateQty(item.id, -1)}>
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-8 text-center font-bold text-chai-deep tabular-nums">{qty}</span>
                <Button size="icon" className="h-7 w-7 bg-chai hover:bg-chai-deep text-cream" onClick={() => updateQty(item.id, 1)}>
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulk quick buttons */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Bulk Add (Masala Chai)</p>
        <div className="grid grid-cols-3 gap-2">
          {[10, 25, 50].map(n => (
            <button
              key={n}
              onClick={() => setBulk('masala-chai', n)}
              className="py-2 rounded-lg bg-gradient-saffron text-chai-deep font-bold text-sm hover:scale-105 transition shadow-card"
            >
              {n} cups
            </button>
          ))}
        </div>
      </div>

      {/* Smart suggestions — dark "chalkboard" cards with quick reorder buttons */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-saffron" />
          <span className="font-display font-extrabold text-saffron text-xs uppercase tracking-widest">
            Smart Suggestions
          </span>
        </div>
        {SUGGESTIONS.map(s => {
          const totalQty = s.presetItems.reduce((a, b) => a + b.qty, 0);
          const firstItem = MENU.find(m => m.id === s.presetItems[0].id);
          return (
            <div
              key={s.group}
              className="chalkboard rounded-xl p-3 border-2 border-chalkboard/50 shadow-card"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="w-3.5 h-3.5 text-saffron fill-saffron" />
                <span className="font-display font-extrabold text-saffron text-[11px] uppercase tracking-widest">
                  Smart Suggestion
                </span>
              </div>
              <p className="font-handwritten text-cream text-base leading-snug mb-2.5">
                "{s.items}"
              </p>
              <button
                onClick={() => applySuggestion(s.presetItems, s.group)}
                className="w-full bg-gradient-saffron text-chai-deep font-display font-bold py-2 rounded-full text-sm hover:scale-[1.03] active:scale-95 transition shadow-warm flex items-center justify-center gap-1.5"
              >
                Quick Reorder · {totalQty} {firstItem?.emoji ?? '☕'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Customer details */}
      <div className="space-y-2">
        <div>
          <Label className="text-xs text-chai-deep">Group / Team</Label>
          <Input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="e.g. CSE Lab Team" className="bg-cream border-chai/20" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-chai-deep">Name</Label>
            <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Your name" className="bg-cream border-chai/20" />
          </div>
          <div>
            <Label className="text-xs text-chai-deep">Phone</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="98765 43210" className="bg-cream border-chai/20" />
          </div>
        </div>
        <div>
          <Label className="text-xs text-chai-deep">Pickup in (mins)</Label>
          <div className="flex gap-1.5 mt-1">
            {[10, 15, 30, 60].map(m => (
              <button
                key={m}
                onClick={() => setPickupMins(m)}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold border transition ${pickupMins === m
                    ? 'bg-chai text-cream border-chai'
                    : 'bg-cream text-chai border-chai/20 hover:border-chai/50'
                  }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Total + Place */}
      <div className="border-t border-dashed border-chai/30 pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-handwritten text-lg text-chai">Total ({totalCups} items)</span>
          <span className="font-display text-2xl font-extrabold text-chai-deep">₹{total}</span>
        </div>
        <Button
          onClick={handlePlace}
          className="w-full bg-gradient-chai text-cream font-bold text-base py-6 rounded-xl shadow-warm hover:scale-[1.02] hover:shadow-glow-neon transition"
        >
          <Send className="w-4 h-4 mr-2" />
          Place Order
        </Button>
      </div>
    </aside>
  );
};
