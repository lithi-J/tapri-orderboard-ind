import { TeaCupLogo } from './TeaCupLogo';

interface TeaLoadingProps {
  className?: string;
}

/**
 * Premium loading component with an animated tea cup.
 * Replaces generic "Loading..." text with a themed animation.
 */
export const TeaLoading = ({ className = '' }: TeaLoadingProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-10 px-6 text-center ${className}`}>
      <div className="relative">
        {/* Glow effect behind the cup */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-saffron/20 blur-3xl rounded-full animate-pulse" />
        
        {/* The animated cup */}
        <TeaCupLogo size={64} className="relative z-10" />
        
        {/* Brewing indicator dots */}
        <div className="mt-4 flex justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-saffron/40 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-saffron/60 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-saffron animate-bounce" />
        </div>
      </div>
    </div>
  );
};
