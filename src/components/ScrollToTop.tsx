import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { scrollToTopConfig } from '../config';

export function ScrollToTop() {
  if (!scrollToTopConfig.ariaLabel) return null;

  const [isVisible, setIsVisible] = useState(false);
  const { pathname } = useLocation();

  // ── Meta Pixel: fire PageView on every route change ──
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label={scrollToTopConfig.ariaLabel}
      className={`fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-[#CDFF00]/90 text-[#222120] flex items-center justify-center shadow-lg shadow-[#CDFF00]/20 backdrop-blur-sm transition-all duration-300 hover:bg-[#CDFF00] hover:scale-110 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}