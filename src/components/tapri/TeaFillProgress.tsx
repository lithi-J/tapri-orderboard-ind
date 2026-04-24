interface TeaFillProgressProps {
  /** 0 = empty cup, 1 = fully brewed, 2 = ready, 3 = picked up */
  stage: 0 | 1 | 2 | 3;
  brewing?: boolean;
}

const STAGE_FILL: Record<number, number> = { 0: 18, 1: 55, 2: 90, 3: 100 };

/**
 * Mini tea cup that fills as the order progresses through stages.
 * Includes a wave at the surface and rising bubbles while brewing.
 */
export const TeaFillProgress = ({ stage, brewing = false }: TeaFillProgressProps) => {
  const fill = STAGE_FILL[stage];

  return (
    <div className="relative w-12 h-12 shrink-0" aria-label={`Brew progress ${fill}%`}>
      {/* Cup outline */}
      <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full">
        <defs>
          <clipPath id="cupClip">
            <path d="M8 12 h32 l-3 24 q-1 5 -6 5 h-14 q-5 0 -6 -5 z" />
          </clipPath>
        </defs>

        {/* Cup body bg */}
        <path
          d="M8 12 h32 l-3 24 q-1 5 -6 5 h-14 q-5 0 -6 -5 z"
          fill="hsl(var(--cream))"
          stroke="hsl(var(--chai-deep))"
          strokeWidth="1.8"
        />
        {/* Handle */}
        <path
          d="M40 18 q7 1 7 8 q0 7 -7 8"
          fill="none"
          stroke="hsl(var(--chai-deep))"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Tea fill (clipped to cup) */}
        <g clipPath="url(#cupClip)">
          <rect
            x="0"
            y={48 - (fill / 100) * 36}
            width="48"
            height="48"
            fill="hsl(var(--chai))"
            style={{ transition: 'y 0.8s ease-out' }}
          />
          {/* Wave on top of fluid */}
          <path
            d={`M-10 ${48 - (fill / 100) * 36} q 6 -3 12 0 t 12 0 t 12 0 t 12 0 v 40 h-48 z`}
            fill="hsl(var(--chai-deep))"
            opacity="0.55"
            style={{
              transformOrigin: 'center',
              animation: 'tea-wave 2.4s ease-in-out infinite',
            }}
          />

          {/* Bubbles when brewing */}
          {brewing && (
            <>
              <circle cx="18" cy="38" r="1.8" fill="hsl(var(--chai-foam))" style={{ animation: 'bubble-rise 2s ease-in infinite' }} />
              <circle cx="26" cy="40" r="1.3" fill="hsl(var(--chai-foam))" style={{ animation: 'bubble-rise 2.4s ease-in 0.7s infinite' }} />
              <circle cx="32" cy="38" r="1.5" fill="hsl(var(--chai-foam))" style={{ animation: 'bubble-rise 2.2s ease-in 1.3s infinite' }} />
            </>
          )}
        </g>
      </svg>

      {/* Steam wisps when brewing */}
      {brewing && (
        <>
          <span
            className="absolute rounded-full"
            style={{
              left: '50%',
              bottom: '90%',
              width: 4,
              height: 12,
              background: 'linear-gradient(to top, hsl(var(--chai-deep) / 0.55), transparent)',
              filter: 'blur(1.5px)',
              animation: 'brew-steam 2.2s ease-out infinite',
            }}
          />
          <span
            className="absolute rounded-full"
            style={{
              left: '35%',
              bottom: '90%',
              width: 3,
              height: 10,
              background: 'linear-gradient(to top, hsl(var(--chai-deep) / 0.45), transparent)',
              filter: 'blur(1.5px)',
              animation: 'brew-steam 2.2s ease-out 0.7s infinite',
            }}
          />
          <span
            className="absolute rounded-full"
            style={{
              left: '65%',
              bottom: '90%',
              width: 3,
              height: 10,
              background: 'linear-gradient(to top, hsl(var(--chai-deep) / 0.45), transparent)',
              filter: 'blur(1.5px)',
              animation: 'brew-steam 2.2s ease-out 1.3s infinite',
            }}
          />
        </>
      )}
    </div>
  );
};
