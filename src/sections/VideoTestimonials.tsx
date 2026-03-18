import { useState, useEffect, useRef } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../constants/urls';

interface Testimonial {
  id: number;
  name: string;
  designation: string;
  company?: string;
  thumbnail: string;
  video_file?: string;
  video_url?: string;
}

export function VideoTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionVisible, setSectionVisible] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}testimonials/`);
        if (!res.ok) throw new Error(`Failed to fetch testimonials: ${res.status}`);
        const json = await res.json();
        setTestimonials(json.data || json);
      } catch (err) {
        console.error('Testimonials fetch error:', err);
        setError('Could not load video testimonials');
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (loading) return;
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      requestAnimationFrame(() => setTimeout(() => setSectionVisible(true), 16));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => setTimeout(() => setSectionVisible(true), 16));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    observer.observe(el);
    const fallback = setTimeout(() => setSectionVisible(true), 1000);
    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, [loading]);

  useEffect(() => {
    if (selectedIndex !== null || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedIndex, testimonials.length]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedIndex]);

  const handlePrev = () =>
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % testimonials.length);

  const goToPrevVideo = () =>
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + testimonials.length) % testimonials.length
    );

  const goToNextVideo = () =>
    setSelectedIndex((prev) =>
      prev === null ? null : (prev + 1) % testimonials.length
    );

  const getPosition = (index: number) => {
    const total = testimonials.length;
    const diff = (index - activeIndex + total) % total;
    if (diff === 0) return 'center';
    if (diff === 1) return 'right';
    if (diff === total - 1) return 'left';
    return 'hidden';
  };

  if (loading) {
    return (
      <section className="py-24 text-center text-gray-400 bg-[#363432] min-h-[60vh] flex items-center justify-center">
        <div className="text-2xl">Loading video testimonials...</div>
      </section>
    );
  }

  if (error || testimonials.length === 0) {
    return (
      <section className="py-24 text-center text-red-400 bg-[#363432] min-h-[60vh] flex items-center justify-center">
        <div className="text-2xl">{error || 'No video testimonials available right now.'}</div>
      </section>
    );
  }

  return (
    <>
      <style>{`
        .vt-section {
          opacity: 0;
          transform: translateY(28px) translateZ(0);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
          backface-visibility: hidden;
          animation: vtFallback 0s linear 1.2s forwards;
        }
        @keyframes vtFallback {
          to { opacity: 1; transform: translateY(0) translateZ(0); }
        }
        .vt-section.vt-visible {
          opacity: 1; transform: translateY(0) translateZ(0); animation: none;
        }

        /* ── CAROUSEL WRAPPER ── */
        /* Uses flex so arrows are always vertically centered with the card */
        .vt-carousel-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          width: 100%;
          position: relative;
        }

        /* Arrow buttons — always vertically centered, never absolute */
        .vt-arrow {
          flex-shrink: 0;
          width: 44px; height: 44px;
          border-radius: 50%;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          color: white; cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.2s;
          z-index: 20;
          flex-shrink: 0;
        }
        .vt-arrow:hover { background: #CDFF00; color: #111; border-color: #CDFF00; }
        .vt-arrow.left:hover { transform: translateX(-2px); }
        .vt-arrow.right:hover { transform: translateX(2px); }

        @media (min-width: 768px) {
          .vt-arrow { width: 52px; height: 52px; }
        }

        /* ── CARDS STAGE ── */
        /* Fixed height container where cards absolutely position themselves */
        .vt-stage {
          position: relative;
          /* Height matches center card height + top offset */
          height: 420px;
          flex: 1;
          max-width: 700px;
          overflow: visible;
        }

        @media (max-width: 640px) {
          .vt-stage { height: 340px; }
        }
        @media (max-width: 400px) {
          .vt-stage { height: 290px; }
        }

        /* ── REEL CARDS ── */
        .reel-card {
          position: absolute;
          transform-origin: center center;
          transition:
            left 0.65s cubic-bezier(0.16, 1, 0.3, 1),
            width 0.65s cubic-bezier(0.16, 1, 0.3, 1),
            height 0.65s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.65s cubic-bezier(0.16, 1, 0.3, 1),
            filter 0.65s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
            top 0.65s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, filter, opacity;
          backface-visibility: hidden;
        }

        /* Center card — vertically centered in stage */
        .reel-center {
          width: 240px; height: 400px;
          left: 50%;
          top: 50%;
          transform: translateX(-50%) translateY(-50%) translateZ(0);
          z-index: 10; filter: none; opacity: 1;
        }

        /* Side cards — slightly smaller, vertically centered too */
        .reel-left, .reel-right {
          width: 170px; height: 300px;
          top: 50%;
          transform: translateX(-50%) translateY(-50%) scale(0.88) translateZ(0);
          z-index: 5;
          filter: blur(1.5px) brightness(0.65);
          opacity: 0.75;
        }
        .reel-left  { left: calc(50% - 210px); }
        .reel-right { left: calc(50% + 210px); }

        .reel-hidden {
          opacity: 0; pointer-events: none; visibility: hidden;
          left: 50%; top: 50%;
          width: 170px; height: 300px;
          transform: translateX(-50%) translateY(-50%) scale(0.7) translateZ(0);
          z-index: 1;
        }

        /* ── RESPONSIVE CARD SIZES ── */
        @media (max-width: 640px) {
          .reel-center  { width: 170px; height: 300px; }
          .reel-left    { left: calc(50% - 150px); width: 120px; height: 220px; }
          .reel-right   { left: calc(50% + 150px); width: 120px; height: 220px; }
          .reel-hidden  { width: 120px; height: 220px; }
        }
        @media (max-width: 400px) {
          .reel-center  { width: 140px; height: 250px; }
          .reel-left    { left: calc(50% - 120px); width: 100px; height: 180px; }
          .reel-right   { left: calc(50% + 120px); width: 100px; height: 180px; }
          .reel-hidden  { width: 100px; height: 180px; }
        }

        /* ── 9:16 POPUP ── */
        .vt-popup-backdrop {
          position: fixed;
          top: 72px; left: 0; right: 0; bottom: 0;
          z-index: 150;
          display: flex; flex-direction: row;
          align-items: center; justify-content: center;
          gap: 20px;
          padding: 16px;
          background: rgba(0,0,0,0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .vt-popup-col {
          display: flex; flex-direction: column;
          align-items: center; gap: 14px;
          flex-shrink: 0;
        }

        .vt-popup-inner {
          position: relative;
          width: min(300px, 75vw);
          background: #000;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06);
          flex-shrink: 0;
          aspect-ratio: 9 / 16;
          max-height: calc(100vh - 72px - 80px);
        }

        .vt-popup-inner video {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }

        .vt-popup-info { text-align: center; }
        .vt-popup-info h3 {
          font-size: 1rem; font-weight: 600;
          color: #F0EDE8; margin: 0 0 4px;
          font-family: 'League Spartan', sans-serif;
        }
        .vt-popup-info p { font-size: 0.8rem; color: #CDFF00; margin: 0; }

        .vt-popup-nav {
          width: 48px; height: 48px; flex-shrink: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: white;
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .vt-popup-nav:hover { background: #CDFF00; color: #111; border-color: #CDFF00; }
        .vt-popup-nav.prev:hover { transform: translateX(-2px); }
        .vt-popup-nav.next:hover { transform: translateX(2px); }

        @media (max-width: 480px) { .vt-popup-nav { display: none; } }

        .vt-popup-close {
          position: absolute; top: 14px; right: 14px; z-index: 25;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(0,0,0,0.65);
          border: 1px solid rgba(255,255,255,0.15);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: white; transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .vt-popup-close:hover { background: #CDFF00; color: #111; border-color: #CDFF00; }

        .vt-popup-fallback {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          background: linear-gradient(to bottom, #111, #000);
          padding: 28px; text-align: center;
        }
      `}</style>

      <section
        ref={sectionRef}
        className={`vt-section${sectionVisible ? ' vt-visible' : ''} py-16 relative overflow-hidden bg-gradient-to-br from-[#1a1918] via-[#2a2826] to-[#363432] min-h-[80vh] z-10`}
      >
        <div className="container mx-auto px-4 relative z-10">

          {/* Heading */}
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-5xl mb-4 text-white"
              style={{ fontFamily: "'Aboreto', cursive", letterSpacing: '0.02em' }}
            >
              Video{' '}
              <span
                className="text-[#CDFF00]"
                style={{ fontFamily: "'Aboreto', cursive", letterSpacing: '0.12em', textTransform: 'uppercase' }}
              >
                TESTIMONIALS
              </span>
            </h2>
          </div>

          {/* ── Carousel: [arrow] [stage] [arrow] ── */}
          <div className="vt-carousel-row">

            {/* Left arrow */}
            <button className="vt-arrow left" onClick={handlePrev} aria-label="Previous">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Cards stage */}
            <div className="vt-stage">
              {testimonials.map((testimonial, index) => {
                const position = getPosition(index);
                return (
                  <div
                    key={testimonial.id}
                    className={`reel-card reel-${position}`}
                    onClick={() => {
                      if (position === 'center') setSelectedIndex(index);
                      else if (position !== 'hidden') setActiveIndex(index);
                    }}
                  >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden group cursor-pointer shadow-xl">
                      {testimonial.thumbnail ? (
                        <img
                          src={testimonial.thumbnail}
                          alt={testimonial.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                          No thumbnail
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      {position === 'center' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#CDFF00]/90 flex items-center justify-center transform scale-90 group-hover:scale-110 transition-all duration-300 shadow-2xl shadow-[#CDFF00]/30">
                            <Play className="w-7 h-7 md:w-8 md:h-8 text-black ml-1" fill="black" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 bg-gradient-to-t from-black/90 to-transparent">
                        <h4 className="font-semibold text-white text-sm md:text-lg mb-0.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                          {testimonial.name}
                        </h4>
                        <p className="text-[#CDFF00] text-xs md:text-sm">{testimonial.designation}</p>
                        {testimonial.company && (
                          <p className="text-gray-300 text-xs md:text-sm mt-0.5">{testimonial.company}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right arrow */}
            <button className="vt-arrow right" onClick={handleNext} aria-label="Next">
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-3 rounded-full transition-all duration-400 ${
                  index === activeIndex
                    ? 'w-10 bg-[#CDFF00] shadow-md shadow-[#CDFF00]/40'
                    : 'w-3 bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 9:16 Video Popup ── */}
      {selectedIndex !== null && (
        <div className="vt-popup-backdrop" onClick={() => setSelectedIndex(null)}>

          <button className="vt-popup-nav prev" onClick={(e) => { e.stopPropagation(); goToPrevVideo(); }} aria-label="Previous">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="vt-popup-col">
            <div className="vt-popup-inner" onClick={(e) => e.stopPropagation()}>
              <button className="vt-popup-close" onClick={() => setSelectedIndex(null)} aria-label="Close">
                <X className="w-4 h-4" />
              </button>

              {testimonials[selectedIndex].video_file || testimonials[selectedIndex].video_url ? (
                <video
                  key={testimonials[selectedIndex].id}
                  src={testimonials[selectedIndex].video_file || testimonials[selectedIndex].video_url}
                  controls
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div className="vt-popup-fallback">
                  {testimonials[selectedIndex].thumbnail && (
                    <img
                      src={testimonials[selectedIndex].thumbnail}
                      alt={testimonials[selectedIndex].name}
                      className="w-full rounded-xl mb-6 shadow-2xl object-cover"
                      style={{ maxHeight: '55%' }}
                    />
                  )}
                  <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                    {testimonials[selectedIndex].name}
                  </h3>
                  <p className="text-[#CDFF00] text-sm mb-1">{testimonials[selectedIndex].designation}</p>
                  {testimonials[selectedIndex].company && (
                    <p className="text-gray-400 text-sm mb-4">{testimonials[selectedIndex].company}</p>
                  )}
                  <p className="text-gray-500 text-sm">Video coming soon – stay tuned!</p>
                </div>
              )}
            </div>

            <div className="vt-popup-info" onClick={(e) => e.stopPropagation()}>
              <h3>{testimonials[selectedIndex].name}</h3>
              <p>
                {testimonials[selectedIndex].designation}
                {testimonials[selectedIndex].company && ` · ${testimonials[selectedIndex].company}`}
              </p>
            </div>
          </div>

          <button className="vt-popup-nav next" onClick={(e) => { e.stopPropagation(); goToNextVideo(); }} aria-label="Next">
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>
      )}
    </>
  );
}