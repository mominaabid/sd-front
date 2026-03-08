import { useState, useEffect } from 'react';
import { preloaderConfig } from '../config';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  // If brandName is missing, skip preloader
  if (!preloaderConfig.brandName) {
    useEffect(() => {
      onComplete();
    }, [onComplete]);
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
      {/* Logo Image */}
      <div
        className="preloader-text mb-6 opacity-0 animate-fade-in-up"
        style={{ animationDelay: '0.0s', animationFillMode: 'forwards' }}
      >
        <img
          src="/logoImage.png"
          alt="S&D Media"
          className="h-16 md:h-20 w-auto transform scale-0 animate-pop-in"
        />
      </div>

      {/* Brand Name + Tagline */}
      <div className="preloader-text text-center">
        <h1
          className="font-serif text-3xl md:text-4xl tracking-wide mb-2 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <span className="text-[#F3F3F2]">{preloaderConfig.brandName}</span>{" "}
          {preloaderConfig.brandHighlight && (
            <span className="text-[#CDFF00]">{preloaderConfig.brandHighlight}</span>
          )}
        </h1>

        {preloaderConfig.tagline && (
          <p
            className="text-[#CDFF00]/80 text-sm md:text-base tracking-wide opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
          >
            {preloaderConfig.tagline}
          </p>
        )}
      </div>

      {/* Loading Line */}
      <div
        className="mt-8 w-48 h-px bg-[#4A4845] overflow-hidden opacity-0 animate-fade-in-up"
        style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
      >
        <div className="preloader-line h-full bg-gradient-to-r from-[#CDFF00]/50 via-[#CDFF00] to-[#CDFF00]/50" />
      </div>

      {/* Year */}
      {preloaderConfig.yearText && (
        <p
          className="preloader-text mt-4 text-xs text-[#8a8885] uppercase tracking-[0.3em] opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
        >
          {preloaderConfig.yearText}
        </p>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(8px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out;
          }

          @keyframes popIn {
            0% { transform: scale(0); opacity: 0; }
            80% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); }
          }

          .animate-pop-in {
            animation: popIn 0.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}