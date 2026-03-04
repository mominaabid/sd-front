import { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import { preloaderConfig } from '../config';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  // Null check: if config is empty, complete immediately
  if (!preloaderConfig.brandName) {
    useEffect(() => { onComplete(); }, [onComplete]);
    return null;
  }

  const [phase, setPhase] = useState<'loading' | 'fading'>('loading');

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase('fading'), 2200);
    const completeTimer = setTimeout(() => onComplete(), 2800);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#222120] flex flex-col items-center justify-center transition-opacity duration-600 ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo Icon */}
      <div className="preloader-text mb-6">
        <Film className="w-12 h-12 text-[#CDFF00]" />
      </div>

      {/* Brand Name */}
      <div className="preloader-text text-center" style={{ animationDelay: '0.2s' }}>
        <h1 className="font-serif text-3xl md:text-4xl tracking-wide mb-2">
  <span className="text-[#F3F3F2]">
    {preloaderConfig.brandName}
  </span>{" "}
  {preloaderConfig.brandHighlight && (
    <span className="text-[#CDFF00]">
      {preloaderConfig.brandHighlight}
    </span>
  )}
</h1>
      </div>

      {/* Loading Line */}
      <div className="mt-8 w-48 h-px bg-[#4A4845] overflow-hidden">
        <div className="preloader-line h-full bg-gradient-to-r from-[#CDFF00]/50 via-[#CDFF00] to-[#CDFF00]/50" />
      </div>

      {/* Year */}
      {preloaderConfig.yearText && (
        <p
          className="preloader-text mt-4 text-xs text-[#8a8885] uppercase tracking-[0.3em]"
          style={{ animationDelay: '0.4s' }}
        >
          {preloaderConfig.yearText}
        </p>
      )}
    </div>
  );
}
