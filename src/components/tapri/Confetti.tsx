import { useMemo } from 'react';

const COLORS = ['hsl(var(--saffron))', 'hsl(var(--neon))', 'hsl(var(--chai))', 'hsl(var(--saffron-glow))'];

export const Confetti = () => {
  const pieces = useMemo(
    () => Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 8,
    })),
    []
  );
  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {pieces.map(p => (
        <span
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};
