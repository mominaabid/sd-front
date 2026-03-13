import { useEffect, useRef } from 'react';
import { whatMakesSpecialConfig } from '../config';
import { HardDrive, Film, Monitor, RotateCcw, Zap, Lock } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  '01': HardDrive,
  '02': Film,
  '03': Monitor,
  '04': RotateCcw,
  '05': Zap,
  '06': Lock,
};

export function Museum() {
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

    const elements = sectionRef.current?.querySelectorAll('.museum-fade');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-[#222120]"
    >
      <style>{`
        .museum-fade {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .museum-fade.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="museum-fade text-center mb-16">
          <h2 className="text-3xl md:text-5xl mb-4 text-white" style={{ fontFamily: "'League Spartan', sans-serif", letterSpacing: '0.02em' }}>
            What Makes Us{' '}
            <span className="text-[#CDFF00] font-bold" style={{ fontFamily: "'Aboreto', cursive", letterSpacing: '0.12em', textTransform: 'uppercase' }}>Special?</span>
          </h2>
          <p className="font-secondary text-[#DADADA] text-lg max-w-2xl mx-auto">
            Six reasons wedding videographers trust us with their clients footage.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {whatMakesSpecialConfig.features.map((feature, index) => {
            const Icon = iconMap[feature.number] || Zap;

            return (
              <div
                key={feature.number}
                className="museum-fade group bg-card/30 border border-border/30 rounded-lg p-6 hover:border-primary/20 transition-all flex flex-col"
                style={{ transitionDelay: `${index * 100}ms`, minHeight: '180px' }}
              >
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>

                {/* Mini heading — League Spartan for readability */}
                <h3 className="text-lg font-semibold mb-1 uppercase tracking-[0.12em] text-white" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  {feature.title}
                </h3>

                <p className="font-secondary text-[#DADADA] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
