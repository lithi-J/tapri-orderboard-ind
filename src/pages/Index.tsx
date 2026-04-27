import { useEffect, useRef, useState } from 'react';
import { Coffee } from 'lucide-react';
import { Header } from '@/components/tapri/Header';
import { OrderPanel } from '@/components/tapri/OrderPanel';
import { OrderQueue } from '@/components/tapri/OrderQueue';
import { VendorDashboard } from '@/components/tapri/VendorDashboard';
import { Confetti } from '@/components/tapri/Confetti';
import { PopperBurst } from '@/components/tapri/PopperBurst';
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
  const [popper, setPopper] = useState(0);
  const initialised = useRef(false);
  const celebrateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const liveCount = orders.filter(o => o.status !== 'completed').length;

  // Sound on new order (skip first hydration)
  const prevCount = useRef(orders.length);
  useEffect(() => {
    if (!initialised.current) { initialised.current = true; prevCount.current = orders.length; return; }
    if (orders.length > prevCount.current && soundOn) playDing();
    prevCount.current = orders.length;
  }, [orders.length, soundOn]);

  const handlePlace = (o: Parameters<typeof addOrder>[0]) => {
    addOrder(o);
    if (festMode) toast.success('🎉 Fest order received!');
  };

  // Triggered by Quick Reorder — turns on confetti for 4 seconds
  const handleCelebrate = () => {
    if (celebrateTimer.current) clearTimeout(celebrateTimer.current);
    setFestMode(true);
    celebrateTimer.current = setTimeout(() => setFestMode(false), 4000);
  };

  return (
    <div className={`min-h-screen ${festMode ? 'bg-gradient-saffron/5' : ''}`}>
      {festMode && <Confetti />}
      {popper > 0 && <PopperBurst key={popper} trigger={popper} />}
      <Header
        status={status}
        onStatusChange={setStatus}
        liveCount={liveCount}
        festMode={festMode}
        onFestToggle={() => {
          setFestMode(f => !f);
          if (!festMode) toast.success('🎉 Fest Mode ON — let\'s gooo!');
        }}
      />

      <main className="max-w-[1600px] mx-auto px-3 md:px-6 py-5 grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[320px_1fr_300px] gap-4 md:gap-5">
        {/* Left Column: Order Panel (Sticky) */}
        <div className="lg:sticky lg:top-24 h-fit">
          <OrderPanel
            onPlace={handlePlace}
            onPopper={() => setPopper(p => p + 1)}
            onCelebrate={handleCelebrate}
          />
        </div>

        {/* Center/Right: Queue + Dashboard for Laptop/Mobile */}
        <div className="space-y-8 min-w-0">
          <section className="space-y-4">
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

          {/* Show Dashboard here on Laptop (lg) and Mobile/Tablet (xl:hidden) */}
          <div className="xl:hidden">
            <VendorDashboard orders={orders} />
          </div>
        </div>

        {/* Right Column: Dashboard (Desktop XL+) */}
        <div className="hidden xl:block">
          <VendorDashboard orders={orders} />
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-muted-foreground">
        <span className="font-handwritten text-chai text-lg">Brewed with </span>
        <Coffee className="inline-block w-5 h-5 text-urgent mx-1 animate-bounce" />
        <span className="font-handwritten text-chai text-lg"> at the campus tapri</span>
      </footer>
    </div>
  );
};

export default Index;
