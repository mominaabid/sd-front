import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { API_BASE_URL } from '../constants/urls';

// ─────────────────────────────────────────────────────────────
// Type definition
// ─────────────────────────────────────────────────────────────
interface Review {
  id: number;
  name: string;
  title: string;
  review_text: string;
  picture?: string;
  rating: number;
}

// ─────────────────────────────────────────────────────────────
export function TextReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Fetch reviews ─────────────────────────────────────────────
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}reviews/`);
        if (!res.ok) throw new Error(`Reviews fetch failed: ${res.status}`);

        const json = await res.json();
        const fetched = json.data || json;

        setReviews(fetched);
      } catch (err) {
        console.error('Failed to load reviews:', err);
        setError('Could not load client reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // ─── Improved fade-in observer + force visible fallback ────────
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
        threshold: 0.15,              // trigger when 15% visible
        rootMargin: '0px 0px -120px 0px', // earlier trigger
      }
    );

    // Query all .fade-up in the document (safer)
    const elements = document.querySelectorAll('.fade-up');
    elements.forEach((el) => observer.observe(el));

    // Force visible for elements already in viewport after data loads
    setTimeout(() => {
      document.querySelectorAll('.fade-up').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
        }
      });
    }, 1000); // delay after content renders

    return () => observer.disconnect();
  }, [reviews, loading]); // re-run when reviews load

  // ─── Auto-scroll logic ─────────────────────────────────────────
  const startAutoScroll = useCallback(() => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    if (reviews.length === 0) return;

    autoScrollRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
  }, [reviews.length]);

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [startAutoScroll]);

  // ─── Navigation ────────────────────────────────────────────────
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    startAutoScroll();
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
    startAutoScroll();
  };

  // ─── Offset calculator for carousel ────────────────────────────
  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    const half = Math.floor(reviews.length / 2);
    if (offset > half) offset -= reviews.length;
    if (offset < -half) offset += reviews.length;
    return offset;
  };

  // ─── Render ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="py-24 bg-[#363432] text-center text-gray-400 min-h-[60vh] flex items-center justify-center">
        <div className="text-2xl">Loading client reviews...</div>
      </section>
    );
  }

  if (error || reviews.length === 0) {
    return (
      <section className="py-24 bg-[#363432] text-center text-red-400 min-h-[60vh] flex items-center justify-center">
        <div className="text-2xl">{error || 'No reviews available at the moment.'}</div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-24 bg-[#363432] overflow-hidden relative z-10 min-h-[80vh]"
    >
      <div className="container-custom max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="fade-up text-3xl md:text-5xl font-display font-bold text-[#F3F3F2]">
            What Our Clients <span className="text-[#CDFF00]">Say</span>
          </h2>
        </div>

        {/* Carousel container */}
        <div className="fade-up relative" style={{ height: '420px', minHeight: '360px' }}>
          {/* Edge fade masks */}
          <div className="absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-[#363432] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-[#363432] to-transparent z-10 pointer-events-none" />

          {reviews.map((review, index) => {
            const offset = getOffset(index);
            const isCenter = offset === 0;
            const isAdjacent = Math.abs(offset) === 1;

            const translateX = offset * 200; // wider spacing
            const scale = isCenter ? 1 : 0.88;
            const opacity = isCenter ? 1 : isAdjacent ? 0.65 : 0;
            const blur = isCenter ? 0 : isAdjacent ? 3 : 6;
            const zIndex = isCenter ? 30 : isAdjacent ? 20 : 10;

            return (
              <div
                key={review.id}
                className="absolute left-1/2 top-0 transition-all duration-700 ease-out fade-up"
                style={{
                  transform: `translateX(calc(-50% + ${translateX}px)) scale(${scale})`,
                  opacity,
                  filter: `blur(${blur}px)`,
                  zIndex,
                  width: '600px',
                  maxWidth: '92vw',
                  pointerEvents: isCenter || isAdjacent ? 'auto' : 'none',
                }}
              >
                <div
                  className={`
                    bg-[#2a2826] border ${isCenter ? 'border-[#CDFF00]/50 shadow-2xl shadow-[#CDFF00]/20' : 'border-[#4A4845]/50'}
                    rounded-2xl p-8 md:p-12 shadow-xl h-full flex flex-col transition-all duration-500
                  `}
                >
                  {/* Quote + Stars */}
                  <div className="flex justify-between items-start mb-6 md:mb-8">
                    <Quote className="w-12 h-12 md:w-14 md:h-14 text-[#CDFF00]/30 flex-shrink-0" />
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 md:w-7 md:h-7 ${
                            i < (review.rating || 5)
                              ? 'fill-[#CDFF00] text-[#CDFF00]'
                              : 'text-[#4A4845]/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review text */}
                  <p className="text-base md:text-lg text-[#F3F3F2] leading-relaxed text-center italic mb-8 flex-grow line-clamp-6">
                    "{review.review_text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-16 h-16 md:w-18 md:h-18 rounded-full overflow-hidden bg-gradient-to-br from-[#CDFF00]/20 to-[#CDFF00]/5 border-2 border-[#CDFF00]/30 flex-shrink-0">
                      {review.picture ? (
                        <img
                          src={review.picture}
                          alt={review.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#CDFF00] font-bold text-xl md:text-2xl">
                          {review.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-[#F3F3F2] text-lg md:text-xl truncate">
                        {review.name}
                      </p>
                      <p className="text-[#CDFF00] text-sm md:text-base truncate">
                        {review.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-8 md:gap-12 mt-10 md:mt-14">
          <button
            onClick={handlePrev}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-[#4A4845] bg-transparent flex items-center justify-center text-[#DADADA] hover:text-[#CDFF00] hover:border-[#CDFF00] transition-all shadow-md"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-7 h-7 md:w-8 md:h-8" />
          </button>

          <div className="flex gap-4 md:gap-5">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  if (autoScrollRef.current) {
                    clearInterval(autoScrollRef.current);
                    startAutoScroll();
                  }
                }}
                className={`h-3 md:h-3.5 rounded-full transition-all duration-400 ${
                  index === activeIndex
                    ? 'w-12 md:w-14 bg-[#CDFF00] shadow-md shadow-[#CDFF00]/40'
                    : 'w-3 md:w-4 bg-[#4A4845] hover:bg-[#CDFF00]/60'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-[#4A4845] bg-transparent flex items-center justify-center text-[#DADADA] hover:text-[#CDFF00] hover:border-[#CDFF00] transition-all shadow-md"
            aria-label="Next review"
          >
            <ChevronRight className="w-7 h-7 md:w-8 md:h-8" />
          </button>
        </div>
      </div>
    </section>
  );
}