import { Coffee, Bell, BellOff, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Status = 'open' | 'busy' | 'closed';

interface HeaderProps {
  status: Status;
  onStatusChange: (s: Status) => void;
  liveCount: number;
  soundOn: boolean;
  onSoundToggle: () => void;
  festMode: boolean;
  onFestToggle: () => void;
}

const STATUS_MAP: Record<Status, { label: string; classes: string }> = {
  open:   { label: 'Open',   classes: 'bg-neon/20 text-neon border-neon/50 shadow-glow-neon' },
  busy:   { label: 'Busy',   classes: 'bg-saffron/20 text-saffron border-saffron/50' },
  closed: { label: 'Closed', classes: 'bg-urgent/15 text-urgent border-urgent/40' },
};

export const Header = ({ status, onStatusChange, liveCount, soundOn, onSoundToggle, festMode, onFestToggle }: HeaderProps) => {
  const meta = STATUS_MAP[status];
  const cycle = () => {
    const next: Status = status === 'open' ? 'busy' : status === 'busy' ? 'closed' : 'open';
    onStatusChange(next);
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-chai border-b-4 border-saffron/60 shadow-warm">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-saffron flex items-center justify-center shadow-warm relative overflow-hidden">
              <Coffee className="w-6 h-6 text-chai-deep" strokeWidth={2.5} />
              <span className="steam" />
              <span className="steam steam-2" />
              <span className="steam steam-3" />
            </div>
          </div>
          <div className="leading-tight">
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-cream">
              Tapri Orders <span className="text-saffron">☕</span>
            </h1>
            <p className="font-handwritten text-saffron text-lg -mt-1">Bulk chai, zero chaos</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Badge variant="outline" className="bg-cream/10 text-cream border-cream/30 text-sm px-3 py-1.5">
            <span className="font-handwritten text-base mr-1">Live</span>
            <span className="font-bold text-saffron">{liveCount}</span>
            <span className="ml-1 opacity-80">orders</span>
          </Badge>

          <button
            onClick={cycle}
            className={`px-3 py-1.5 rounded-full border text-sm font-semibold flex items-center gap-2 transition hover:scale-105 ${meta.classes}`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
            </span>
            {meta.label}
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={onSoundToggle}
            className="bg-cream/10 text-cream border-cream/30 hover:bg-cream/20 hover:text-cream"
          >
            {soundOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </Button>

          <Button
            size="sm"
            onClick={onFestToggle}
            className={festMode
              ? 'bg-gradient-saffron text-chai-deep font-bold border-2 border-saffron-glow shadow-warm'
              : 'bg-cream/10 text-cream border border-cream/30 hover:bg-cream/20'}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Fest Mode
          </Button>
        </div>
      </div>
    </header>
  );
};
