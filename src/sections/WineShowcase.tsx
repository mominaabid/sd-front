import { useEffect, useRef } from 'react';
import { builtForConfig } from '../config';
import { Clock, Sparkles, Flame, Shield } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  'Time Saving': Clock,
  'Quality': Sparkles,
  'Peak Season Burnout': Flame,
  'Reliable Editing Partner': Shield,
};

export function WineShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="pt-16 md:pt-24 bg-gradient-to-b from-[#363432] to-[#222120]"
    >
      <style>{`
        .fade-up {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .slide-in-left {
          opacity: 0;
          transform: translateX(-32px);
          transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .slide-in-right {
          opacity: 0;
          transform: translateX(32px);
          transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .fade-up.visible,
        .slide-in-left.visible,
        .slide-in-right.visible {
          opacity: 1;
          transform: translate(0, 0);
        }
      `}</style>

      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="fade-up text-3xl md:text-5xl font-display font-bold mb-4">
            Built Specifically for{' '}
            <span className="text-[#CDFF00]">Wedding Videographers</span>
          </h2>
          <p className="fade-up text-[#DADADA] text-lg max-w-2xl mx-auto" style={{ transitionDelay: '120ms' }}>
            {builtForConfig.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {builtForConfig.features.map((feature, index) => {
            const Icon = iconMap[feature.title] || Sparkles;
            const isEven = index % 2 === 0;

            return (
              <div
                key={feature.title}
                className={`${isEven ? 'slide-in-left' : 'slide-in-right'} group bg-[#222120]/50 border border-[#4A4845] rounded-lg p-8 hover:border-[#CDFF00]/30 transition-colors`}
                style={{
                  transitionDelay: `${index * 120}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              >
                <Icon className="w-8 h-8 text-[#CDFF00] mb-4 group-hover:drop-shadow-[0_0_8px_rgba(205,255,0,0.5)] transition-all" />

                <h3 className="text-xl font-display font-semibold mb-3 text-[#F3F3F2]">
                  {feature.title}
                </h3>
                <p className="text-[#DADADA] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quote
        <div className="fade-up max-w-3xl mx-auto" style={{ transitionDelay: '480ms' }}>
          <div className="relative p-8 md:p-10 bg-[#363432]/50 rounded-2xl border border-[#4A4845]">
            <Quote className="absolute top-6 left-6 w-10 h-10 text-[#CDFF00]/20" />
            <blockquote className="relative z-10 text-center">
              <p className="font-serif text-xl md:text-2xl text-[#F3F3F2] mb-4 italic">
                "{builtForConfig.quote.text}"
              </p>
              <footer className="text-[#CDFF00] text-sm">
                — {builtForConfig.quote.attribution}
              </footer>
            </blockquote>
          </div>
        </div> */}

      </div>
    </section>
  );
}