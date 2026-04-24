import { useEffect, useRef, useState } from 'react';
import { Header } from '@/components/tapri/Header';
import { OrderPanel } from '@/components/tapri/OrderPanel';
import { OrderQueue } from '@/components/tapri/OrderQueue';
import { VendorDashboard } from '@/components/tapri/VendorDashboard';
import { Confetti } from '@/components/tapri/Confetti';
import { useOrders } from '@/hooks/use-orders';
import { toast } from 'sonner';

type ShopStatus = 'open' | 'busy' | 'closed';

const playDing = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    o.start();
    o.stop(ctx.currentTime + 0.4);
  } catch { /* ignore */ }
};

const Index = () => {
  const { orders, addOrder, updateStatus, removeOrder } = useOrders();
  const [status, setStatus] = useState<ShopStatus>('open');
  const [soundOn, setSoundOn] = useState(true);
  const [festMode, setFestMode] = useState(false);
  const initialised = useRef(false);

  const liveCount = orders.filter(o => o.status !== 'completed').length;

  // Sound on new order (skip first hydration)
  const prevCount = useRef(orders.length);
  useEffect(() => {
    if (!initialised.current) { initialised.current = true; prevCount.current = orders.length; return; }
    if (orders.length > prevCount.current && soundOn) playDing();
    prevCount.current = orders.length;
  }, [orders.length, soundOn]);

  const handlePlace = (o: typeof orders[number]) => {
    addOrder(o);
    if (festMode) toast.success('🎉 Fest order received!');
  };

  return (
    <div className={`min-h-screen ${festMode ? 'bg-gradient-saffron/5' : ''}`}>
      {festMode && <Confetti />}
      <Header
        status={status}
        onStatusChange={setStatus}
        liveCount={liveCount}
        soundOn={soundOn}
        onSoundToggle={() => setSoundOn(s => !s)}
        festMode={festMode}
        onFestToggle={() => {
          setFestMode(f => !f);
          if (!festMode) toast.success('🎉 Fest Mode ON — let\'s gooo!');
        }}
      />

      <main className="max-w-[1600px] mx-auto px-3 md:px-6 py-5 grid grid-cols-1 lg:grid-cols-[320px_1fr_300px] gap-4 md:gap-5">
        <OrderPanel onPlace={handlePlace} />

        <section className="space-y-4 min-w-0">
          <div className="flex items-end justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-chai-deep">
                Live Order Queue
              </h2>
              <p className="font-handwritten text-chai text-lg -mt-1">
                Drag cards across columns to update status →
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-urgent animate-pulse" />
              Red glow = urgent / overdue
            </div>
          </div>
          <OrderQueue orders={orders} onUpdateStatus={updateStatus} onDelete={removeOrder} />
        </section>

        <VendorDashboard orders={orders} />
      </main>

      <footer className="text-center py-6 text-sm text-muted-foreground">
        <span className="font-handwritten text-chai text-lg">Brewed with </span>
        <span className="text-urgent">♥</span>
        <span className="font-handwritten text-chai text-lg"> at the campus tapri</span>
      </footer>
    </div>
  );
};

export default Index;
