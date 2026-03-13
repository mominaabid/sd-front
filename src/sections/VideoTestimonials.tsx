import { useState, useEffect, useRef } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../constants/urls';

// ─────────────────────────────────────────────────────────────
// Type definitions
// ─────────────────────────────────────────────────────────────
interface Testimonial {
  id: number;
  name: string;
  designation: string;
  company?: string;
  thumbnail: string;
  video_file?: string;
  video_url?: string;
}

// ─────────────────────────────────────────────────────────────
export function VideoTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionVisible, setSectionVisible] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  // ─── Fetch testimonials ────────────────────────────────────────
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

  // ─── Section fade-in ───────────────────────────────────────────
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

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [loading]);

  // ─── Auto-rotate carousel ──────────────────────────────────────
  useEffect(() => {
    if (selectedIndex !== null || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedIndex, testimonials.length]);

  // ─── Escape to close popup ─────────────────────────────────────
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

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

  // ─── FIXED: Position calculation ──────────────────────────────
  // Only ever 3 cards visible: center (diff=0), right (diff=1), left (diff=total-1).
  // Everything else is hidden — regardless of total count.
  const getPosition = (index: number) => {
    const total = testimonials.length;
    const diff = (index - activeIndex + total) % total;

    if (diff === 0) return 'center';
    if (diff === 1) return 'right';
    if (diff === total - 1) return 'left';
    return 'hidden'; // diff === 2, 3, ... total-2 are all hidden
  };

  // ─── Render ───────────────────────────────────────────────────
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
          transition:
            opacity   0.9s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
          backface-visibility: hidden;
          animation: vtFallback 0s linear 1.2s forwards;
        }
        @keyframes vtFallback {
          to { opacity: 1; transform: translateY(0) translateZ(0); }
        }
        .vt-section.vt-visible {
          opacity: 1;
          transform: translateY(0) translateZ(0);
          animation: none;
        }

        .reel-card {
          position: absolute;
          transform-origin: center center;
          transition:
            left      0.65s cubic-bezier(0.16, 1, 0.3, 1),
            width     0.65s cubic-bezier(0.16, 1, 0.3, 1),
            height    0.65s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.65s cubic-bezier(0.16, 1, 0.3, 1),
            filter    0.65s cubic-bezier(0.16, 1, 0.3, 1),
            opacity   0.65s cubic-bezier(0.16, 1, 0.3, 1),
            top       0.65s cubic-bezier(0.16, 1, 0.3, 1),
            z-index   0s;
          will-change: transform, filter, opacity;
          backface-visibility: hidden;
        }

        .reel-center {
          width: 240px;
          height: 400px;
          left: 50%;
          top: 20px;
          transform: translateX(-50%) translateZ(0);
          z-index: 10;
          filter: none;
          opacity: 1;
        }

        .reel-left,
        .reel-right {
          width: 180px;
          height: 320px;
          top: 60px;
          transform: translateX(-50%) scale(0.88) translateZ(0);
          z-index: 5;
          filter: blur(1.5px) brightness(0.65);
          opacity: 0.75;
        }
        .reel-left  { left: calc(50% - 220px); }
        .reel-right { left: calc(50% + 220px); }

        /* Hidden cards fade out and collapse to center — no stuck positioning */
        .reel-hidden {
          opacity: 0;
          pointer-events: none;
          visibility: hidden;
          left: 50%;
          top: 60px;
          width: 180px;
          height: 320px;
          transform: translateX(-50%) scale(0.7) translateZ(0);
          z-index: 1;
        }

        @media (max-width: 640px) {
          .reel-center { width: 180px; height: 320px; }
          .reel-left  { left: calc(50% - 160px); width: 130px; height: 240px; }
          .reel-right { left: calc(50% + 160px); width: 130px; height: 240px; }
        }

        @media (max-width: 400px) {
          .reel-center { width: 150px; height: 270px; }
          .reel-left  { left: calc(50% - 130px); width: 110px; height: 200px; }
          .reel-right { left: calc(50% + 130px); width: 110px; height: 200px; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className={`vt-section${sectionVisible ? ' vt-visible' : ''} py-16 relative overflow-hidden bg-gradient-to-br from-[#1a1918] via-[#2a2826] to-[#363432] min-h-[80vh] z-10`}
      >
        <div className="container mx-auto px-6 relative z-10">

          {/* Heading */}
          <div className="text-center mb-16">
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

          {/* Carousel */}
          <div className="relative" style={{ height: '440px' }}>

            {/* Prev button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#CDFF00] hover:text-black transition-all shadow-lg"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            {/* Next button */}
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#CDFF00] hover:text-black transition-all shadow-lg"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* Cards */}
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
                        <div className="w-16 h-16 rounded-full bg-[#CDFF00]/90 flex items-center justify-center transform scale-90 group-hover:scale-110 transition-all duration-300 shadow-2xl shadow-[#CDFF00]/30">
                          <Play className="w-8 h-8 text-black ml-1" fill="black" />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 to-transparent">
                      <h4
                        className="font-semibold text-white text-lg mb-1"
                        style={{ fontFamily: "'League Spartan', sans-serif" }}
                      >
                        {testimonial.name}
                      </h4>
                      <p className="text-[#CDFF00] text-sm">{testimonial.designation}</p>
                      {testimonial.company && (
                        <p className="text-gray-300 text-sm mt-1">{testimonial.company}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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

      {/* ── Video Popup ── */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#CDFF00] hover:text-black transition-all shadow-md"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={goToPrevVideo}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#CDFF00] hover:text-black transition-all"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              onClick={goToNextVideo}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#CDFF00] hover:text-black transition-all"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {testimonials[selectedIndex].video_file || testimonials[selectedIndex].video_url ? (
              // ─── FIX: key forces React to remount video when navigating ───
              <video
                key={testimonials[selectedIndex].id}
                src={testimonials[selectedIndex].video_file || testimonials[selectedIndex].video_url}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-center p-8">
                {testimonials[selectedIndex].thumbnail && (
                  <img
                    src={testimonials[selectedIndex].thumbnail}
                    alt={testimonials[selectedIndex].name}
                    className="max-w-full max-h-3/4 object-contain rounded-xl mb-6 shadow-2xl"
                  />
                )}
                <h3
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                >
                  {testimonials[selectedIndex].name}
                </h3>
                <p className="text-[#CDFF00] text-lg mb-2">{testimonials[selectedIndex].designation}</p>
                {testimonials[selectedIndex].company && (
                  <p className="text-gray-300 text-base mb-6">{testimonials[selectedIndex].company}</p>
                )}
                <p className="text-gray-400 text-xl">Video coming soon – stay tuned!</p>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent px-6 py-4">
              <h3
                className="font-display text-xl font-bold text-white"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                {testimonials[selectedIndex].name}
              </h3>
              <p className="text-[#CDFF00] text-sm">{testimonials[selectedIndex].designation}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}