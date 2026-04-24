import { useEffect, useState } from 'react';
import { Bell, BellOff, PartyPopper, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TeaCupLogo } from './TeaCupLogo';

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

const STATUS_MAP: Record<Status, { label: string; classes: string; dot: string }> = {
  open:   { label: 'OPEN',   classes: 'bg-neon/20 text-neon border-neon/60',         dot: 'bg-neon' },
  busy:   { label: 'BUSY',   classes: 'bg-saffron/20 text-saffron border-saffron/60', dot: 'bg-saffron' },
  closed: { label: 'CLOSED', classes: 'bg-urgent/15 text-urgent border-urgent/50',    dot: 'bg-urgent' },
};

export const Header = ({
  status,
  onStatusChange,
  liveCount,
  soundOn,
  onSoundToggle,
  festMode,
  onFestToggle,
}: HeaderProps) => {
  const meta = STATUS_MAP[status];
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [dark]);

  const cycle = () => {
    const next: Status = status === 'open' ? 'busy' : status === 'busy' ? 'closed' : 'open';
    onStatusChange(next);
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-chai border-b-4 border-saffron/60 shadow-warm">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
        {/* Left: logo */}
        <div className="flex items-center gap-3">
          <TeaCupLogo size={52} />
          <div className="leading-tight">
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-cream tracking-wide uppercase">
              Tapri Orders <span className="ml-1">🍵</span>
            </h1>
            <p className="font-handwritten text-saffron text-lg -mt-1">Bulk chai, zero chaos</p>
          </div>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-2 md:gap-2.5 flex-wrap">
          {/* Status pill */}
          <button
            onClick={cycle}
            className={`px-3.5 py-1.5 rounded-full border-2 text-xs font-extrabold tracking-wider flex items-center gap-2 transition hover:scale-105 ${meta.classes}`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${meta.dot}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${meta.dot}`} />
            </span>
            {meta.label}
          </button>

          {/* Live count chip */}
          <div className="relative">
            <div className="px-3.5 py-1.5 rounded-full bg-saffron text-chai-deep text-sm font-extrabold flex items-center gap-1.5 shadow-warm">
              <span className="tabular-nums">{liveCount}</span>
              <span className="font-handwritten text-base leading-none">live</span>
            </div>
            {liveCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-neon ring-2 ring-chai-deep animate-pulse" />
            )}
          </div>

          {/* Fest mode (party popper icon) */}
          <button
            onClick={onFestToggle}
            aria-label="Toggle fest mode"
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition hover:scale-110 ${
              festMode
                ? 'bg-gradient-saffron border-saffron-glow shadow-warm animate-pulse'
                : 'bg-cream/10 border-cream/30 hover:bg-cream/20'
            }`}
          >
            <PartyPopper className={`w-5 h-5 ${festMode ? 'text-chai-deep' : 'text-saffron'}`} />
          </button>

          {/* Sound */}
          <button
            onClick={onSoundToggle}
            aria-label="Toggle sound"
            className="w-10 h-10 rounded-full border-2 border-cream/30 bg-cream/10 hover:bg-cream/20 text-cream flex items-center justify-center transition hover:scale-110"
          >
            {soundOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setDark(d => !d)}
            aria-label="Toggle theme"
            className="w-10 h-10 rounded-full border-2 border-cream/30 bg-cream/10 hover:bg-cream/20 text-cream flex items-center justify-center transition hover:scale-110"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
