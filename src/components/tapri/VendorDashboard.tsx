import { useMemo } from 'react';
import { TrendingUp, IndianRupee, Package, CheckCircle2, Clock } from 'lucide-react';
import type { Order } from '@/lib/tapri-data';

interface Props { orders: Order[] }

export const VendorDashboard = ({ orders }: Props) => {
  const stats = useMemo(() => {
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const today = orders.filter(o => o.createdAt >= todayStart.getTime());
    const completed = today.filter(o => o.status === 'completed').length;
    const pending = today.filter(o => o.status !== 'completed').length;
    const revenue = today.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);
    const totalCups = today.reduce((s, o) => s + o.items.reduce((a, b) => a + b.qty, 0), 0);
    return { total: today.length, completed, pending, revenue, totalCups };
  }, [orders]);

  // Build a tiny hourly chart from order timestamps
  const chartData = useMemo(() => {
    const buckets = Array.from({ length: 12 }, () => 0);
    const now = Date.now();
    orders.forEach(o => {
      const hoursAgo = Math.floor((now - o.createdAt) / (1000 * 60 * 60));
      if (hoursAgo >= 0 && hoursAgo < 12) buckets[11 - hoursAgo] += 1;
    });
    return buckets;
  }, [orders]);
  const maxBar = Math.max(...chartData, 1);

  return (
    <aside className="space-y-4 h-fit lg:sticky lg:top-24">
      {/* Revenue hero */}
      <div className="rounded-2xl p-5 bg-gradient-chai text-cream shadow-warm relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-saffron/20 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-saffron font-handwritten text-lg">
            <IndianRupee className="w-4 h-4" />
            Today's Revenue
          </div>
          <div className="text-4xl font-display font-extrabold mt-1">₹{stats.revenue.toLocaleString('en-IN')}</div>
          <div className="text-xs text-cream/70 mt-1">{stats.completed} completed orders</div>
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<Package />} label="Total Orders" value={stats.total} accent="chai" />
        <StatCard icon={<Clock />} label="Pending" value={stats.pending} accent="saffron" />
        <StatCard icon={<CheckCircle2 />} label="Completed" value={stats.completed} accent="neon" />
        <StatCard icon={<TrendingUp />} label="Items Sold" value={stats.totalCups} accent="chai" />
      </div>

      {/* Mini analytics */}
      <div className="paper-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-chai-deep text-sm">Orders / Time</h3>
          <span className="font-handwritten text-chai text-base">last 12h</span>
        </div>
        <div className="flex items-end gap-1 h-24">
          {chartData.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md bg-gradient-to-t from-chai to-saffron transition-all hover:opacity-80"
              style={{ height: `${(v / maxBar) * 100}%`, minHeight: '8%' }}
              title={`${v} orders`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
          <span>-12h</span><span>-6h</span><span>now</span>
        </div>
      </div>

      {/* Vendor tip */}
      <div className="chalkboard rounded-2xl p-4">
        <div className="font-handwritten text-saffron text-xl leading-tight">Tip of the day</div>
        <p className="text-cream/80 text-sm mt-1">
          Peak order time is <span className="text-saffron font-bold">4–6 PM</span>. Pre-boil 2 extra litres of milk to stay ahead!
        </p>
      </div>
    </aside>
  );
};

const StatCard = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent: 'chai' | 'saffron' | 'neon' }) => {
  const accentMap = {
    chai: 'text-chai bg-chai/10',
    saffron: 'text-saffron bg-saffron/15',
    neon: 'text-neon bg-neon/15',
  } as const;
  return (
    <div className="paper-card rounded-2xl p-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accentMap[accent]}`}>
        <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>
      </div>
      <div className="text-2xl font-display font-extrabold text-chai-deep mt-2 tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground uppercase tracking-wide font-semibold">{label}</div>
    </div>
  );
};
