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
        const fetched = json.data || json;

        setTestimonials(fetched);
      } catch (err) {
        console.error('Testimonials fetch error:', err);
        setError('Could not load video testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // ─── Improved fade-in observer + force visible ─────────────────
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
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    // Query all .test-fade (document-wide fallback)
    const elements = document.querySelectorAll('.test-fade');
    elements.forEach((el) => observer.observe(el));

    // Force visible check after mount (handles sections off-screen on load)
    setTimeout(() => {
      document.querySelectorAll('.test-fade').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
        }
      });
    }, 800);

    return () => observer.disconnect();
  }, [testimonials, loading]); // re-run when data changes

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

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrevVideo = () => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToNextVideo = () => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev + 1) % testimonials.length
    );
  };

  const getPosition = (index: number) => {
    const diff = (index - activeIndex + testimonials.length) % testimonials.length;
    if (diff === 0) return 'center';
    if (diff === 1 || diff === -(testimonials.length - 1)) return 'right';
    if (diff === testimonials.length - 1 || diff === -1) return 'left';
    return 'hidden';
  };

  // ─── Render ─────────────────────────────────────────────────────
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
        .test-fade {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.9s ease-out, transform 0.9s ease-out;
        }
        .test-fade.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .reel-card {
          transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: absolute;
          transform-origin: center center;
        }

        .reel-center {
          width: 240px;
          height: 400px;
          transform: translateX(-50%) scale(1);
          left: 50%;
          z-index: 10;
          filter: none;
          opacity: 1;
        }

        .reel-left,
        .reel-right {
          width: 180px;
          height: 320px;
          transform: translateX(-50%) scale(0.88);
          z-index: 5;
          filter: blur(2px) brightness(0.7);
          opacity: 0.8;
        }

        .reel-left { left: calc(50% - 220px); }
        .reel-right { left: calc(50% + 220px); }

        .reel-hidden {
          opacity: 0;
          pointer-events: none;
          visibility: hidden;
        }

        @media (max-width: 640px) {
          .reel-center { width: 180px; height: 320px; }
          .reel-left { left: calc(50% - 170px); width: 140px; height: 250px; }
          .reel-right { left: calc(50% + 170px); width: 140px; height: 250px; }
        }

        .popup-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 60;
          width: 50px;
          height: 50px;
          background: rgba(34, 33, 32, 0.75);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .popup-nav:hover {
          background: #CDFF00;
          color: #222120;
          transform: translateY(-50%) scale(1.15);
        }

        .popup-nav-left  { left: 20px; }
        .popup-nav-right { right: 20px; }

        @media (min-width: 640px) {
          .popup-nav { width: 60px; height: 60px; }
          .popup-nav-left  { left: 40px; }
          .popup-nav-right { right: 40px; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="py-24 relative overflow-hidden bg-gradient-to-br from-[#1a1918] via-[#2a2826] to-[#363432] min-h-[80vh] relative z-10"
      >
        {/* Lime glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(205,255,0,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="test-fade text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white">
              Video <span className="text-[#CDFF00]">Testimonials</span>
            </h2>
          </div>

          {/* Carousel */}
          <div className="test-fade relative" style={{ height: '440px' }}>
            {/* Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#CDFF00] hover:text-black transition-all shadow-lg"
              aria-label="Previous"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#CDFF00] hover:text-black transition-all shadow-lg"
              aria-label="Next"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* Cards */}
            {testimonials.map((testimonial, index) => {
              const position = getPosition(index);

              return (
                <div
                  key={testimonial.id}
                  className={`reel-card reel-${position} test-fade`}
                  style={{ top: position === 'center' ? '20px' : '60px' }}
                  onClick={() => {
                    if (position === 'center') setSelectedIndex(index);
                    else setActiveIndex(index);
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

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Play button (center only) */}
                    {position === 'center' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-[#CDFF00]/90 flex items-center justify-center transform scale-90 group-hover:scale-110 transition-all duration-300 shadow-2xl shadow-[#CDFF00]/30">
                          <Play className="w-8 h-8 text-black ml-1" fill="black" />
                        </div>
                      </div>
                    )}

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 to-transparent">
                      <h4 className="font-display font-semibold text-white text-lg mb-1">
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

      {/* ─── POPUP ───────────────────────────────────────────────────── */}
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
              aria-label="Previous"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            <button
              onClick={goToNextVideo}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#CDFF00] hover:text-black transition-all"
              aria-label="Next"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* Video or fallback */}
            {testimonials[selectedIndex].video_file || testimonials[selectedIndex].video_url ? (
              <video
                src={testimonials[selectedIndex].video_file || testimonials[selectedIndex].video_url}
                controls
                autoPlay
                className="w-full h-full object-cover"
                onError={(e) => console.error('Video error:', e)}
              >
                <source
                  src={testimonials[selectedIndex].video_file || testimonials[selectedIndex].video_url}
                  type="video/mp4"
                />
                Your browser does not support video playback.
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-center p-8">
                {testimonials[selectedIndex].thumbnail && (
                  <img
                    src={testimonials[selectedIndex].thumbnail}
                    alt={testimonials[selectedIndex].name}
                    className="max-w-full max-h-3/4 object-contain rounded-xl mb-6 shadow-2xl"
                  />
                )}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {testimonials[selectedIndex].name}
                </h3>
                <p className="text-[#CDFF00] text-lg mb-2">{testimonials[selectedIndex].designation}</p>
                {testimonials[selectedIndex].company && (
                  <p className="text-gray-300 text-base mb-6">{testimonials[selectedIndex].company}</p>
                )}
                <p className="text-gray-400 text-xl">Video coming soon – stay tuned!</p>
              </div>
            )}

            {/* Bottom info bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent px-6 py-4">
              <h3 className="font-display text-xl font-bold text-white">
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