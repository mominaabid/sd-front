import { useEffect, useRef } from 'react';
import { builtForConfig } from '../config';
import { Sparkles } from 'lucide-react'; // fallback icon

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
        .fade-up { opacity: 0; transform: translateY(32px); transition: opacity 0.7s, transform 0.7s; }
        .slide-in-left { opacity: 0; transform: translateX(-32px); transition: opacity 0.7s, transform 0.7s; }
        .slide-in-right { opacity: 0; transform: translateX(32px); transition: opacity 0.7s, transform 0.7s; }
        .fade-up.visible, .slide-in-left.visible, .slide-in-right.visible { opacity: 1; transform: translate(0,0); }
      `}</style>

      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="fade-up text-3xl md:text-5xl font-primary font-bold mb-4 text-white">
            Built Specifically for{' '}
            <span className="text-[#CDFF00]">Wedding Videographers</span>
          </h2>
          <p className="fade-up font-secondary text-[#DADADA] text-lg max-w-2xl mx-auto" style={{ transitionDelay: '120ms' }}>
            {builtForConfig.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {builtForConfig.features.map((feature, index) => {
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
                {feature.logo ? (
                  <img
                    src={feature.logo}
                    alt={feature.title}
                    className="w-8 h-8 mb-4 group-hover:drop-shadow-[0_0_8px_rgba(205,255,0,0.5)] transition-all"
                  />
                ) : (
                  <Sparkles className="w-8 h-8 text-[#CDFF00] mb-4 group-hover:drop-shadow-[0_0_8px_rgba(205,255,0,0.5)] transition-all" />
                )}

                <h3 className="text-xl font-primary font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="font-secondary text-[#DADADA] leading-relaxed">
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