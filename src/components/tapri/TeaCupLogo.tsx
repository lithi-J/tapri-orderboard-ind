interface TeaCupLogoProps {
  size?: number;
  className?: string;
}

/**
 * Hand-crafted tea cup logo with rising steam.
 * Pure SVG + CSS — uses semantic design tokens.
 */
export const TeaCupLogo = ({ size = 48, className = '' }: TeaCupLogoProps) => {
  return (
    <div
      className={`relative inline-flex items-end justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Steam wisps above the cup */}
      <span
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          bottom: '85%',
          width: 5,
          height: 14,
          background: 'linear-gradient(to top, hsl(var(--cream) / 0.85), transparent)',
          filter: 'blur(2px)',
          animation: 'brew-steam 2.4s ease-out infinite',
        }}
      />
      <span
        className="absolute rounded-full"
        style={{
          bottom: '85%',
          left: '32%',
          width: 4,
          height: 12,
          background: 'linear-gradient(to top, hsl(var(--cream) / 0.7), transparent)',
          filter: 'blur(2px)',
          animation: 'brew-steam 2.4s ease-out 0.6s infinite',
        }}
      />
      <span
        className="absolute rounded-full"
        style={{
          bottom: '85%',
          left: '65%',
          width: 4,
          height: 12,
          background: 'linear-gradient(to top, hsl(var(--cream) / 0.7), transparent)',
          filter: 'blur(2px)',
          animation: 'brew-steam 2.4s ease-out 1.2s infinite',
        }}
      />

      {/* Cup SVG */}
      <svg
        viewBox="0 0 64 56"
        width={size}
        height={size * 0.78}
        className="drop-shadow-[0_4px_8px_hsl(var(--chai-deep)/0.4)]"
        style={{ animation: 'logo-bob 3.5s ease-in-out infinite', transformOrigin: 'center bottom' }}
      >
        <defs>
          <linearGradient id="cupBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--saffron-glow))" />
            <stop offset="100%" stopColor="hsl(var(--saffron))" />
          </linearGradient>
          <linearGradient id="teaFluid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--chai))" />
            <stop offset="100%" stopColor="hsl(var(--chai-deep))" />
          </linearGradient>
        </defs>

        {/* Saucer */}
        <ellipse cx="32" cy="52" rx="26" ry="3" fill="hsl(var(--chai-deep))" opacity="0.45" />

        {/* Handle */}
        <path
          d="M50 22 q10 2 10 12 q0 9 -10 11"
          fill="none"
          stroke="url(#cupBody)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Cup body */}
        <path
          d="M8 18 h44 l-4 28 q-1 6 -7 6 h-22 q-6 0 -7 -6 z"
          fill="url(#cupBody)"
          stroke="hsl(var(--chai-deep))"
          strokeWidth="1.5"
        />

        {/* Tea fluid surface */}
        <ellipse cx="30" cy="20" rx="22" ry="4" fill="url(#teaFluid)" />
        <ellipse cx="30" cy="19" rx="18" ry="2.2" fill="hsl(var(--chai-foam))" opacity="0.55" />
      </svg>
    </div>
  );
};
