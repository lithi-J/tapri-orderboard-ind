import { useEffect, useState } from 'react';
import { PartyPopper } from 'lucide-react';

interface PopperBurstProps {
  trigger: number; // increment to fire a burst
}

const COLORS = [
  'hsl(var(--saffron))',
  'hsl(var(--saffron-glow))',
  'hsl(var(--neon))',
  'hsl(var(--chai))',
  'hsl(var(--urgent))',
];

/**
 * Center-screen party popper burst.
 * Re-fires every time `trigger` changes.
 */
export const PopperBurst = ({ trigger }: PopperBurstProps) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (trigger === 0) return;
    setActive(trigger);
    const t = setTimeout(() => setActive(0), 1400);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!active) return null;

  // 24 confetti pieces around a circle
  const pieces = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i / 24) * 360;
    const dist = 140 + Math.random() * 120;
    return { i, angle, dist, color: COLORS[i % COLORS.length] };
  });

  return (
    <div
      key={active}
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
      aria-hidden
    >
      {/* Glow ring */}
      <span
        className="absolute top-1/2 left-1/2 rounded-full"
        style={{
          width: 200,
          height: 200,
          background:
            'radial-gradient(circle, hsl(var(--saffron) / 0.5) 0%, transparent 70%)',
          animation: 'popper-ring 1.2s ease-out forwards',
        }}
      />

      {/* Big popper icon pop */}
      <PartyPopper
        className="absolute text-saffron drop-shadow-[0_0_20px_hsl(var(--saffron-glow))]"
        style={{
          width: 80,
          height: 80,
          animation: 'bounce-in 0.6s cubic-bezier(0.68,-0.55,0.27,1.55) forwards',
        }}
      />

      {/* Confetti shards */}
      {pieces.map(p => (
        <span
          key={p.i}
          className="absolute top-1/2 left-1/2 rounded-sm"
          style={{
            width: 10,
            height: 14,
            background: p.color,
            ['--angle' as string]: `${p.angle}deg`,
            ['--dist' as string]: `${p.dist}px`,
            animation: `popper-piece 1.2s cubic-bezier(0.2, 0.8, 0.4, 1) forwards`,
          }}
        />
      ))}
    </div>
  );
};
