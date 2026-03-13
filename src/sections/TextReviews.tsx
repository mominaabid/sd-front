import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { API_BASE_URL } from '../constants/urls';

interface Review {
  id: number;
  name: string;
  title: string;
  review_text: string;
  picture?: string;
  rating: number;
}

export function TextReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}reviews/`);
        if (!res.ok) throw new Error(`Reviews fetch failed: ${res.status}`);
        const json = await res.json();
        setReviews(json.data || json);
      } catch (err) {
        console.error('Failed to load reviews:', err);
        setError('Could not load client reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

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
      { threshold: 0.15, rootMargin: '0px 0px -120px 0px' }
    );
    const elements = document.querySelectorAll('.fade-up');
    elements.forEach((el) => observer.observe(el));

    setTimeout(() => {
      document.querySelectorAll('.fade-up').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
        }
      });
    }, 1000);

    return () => observer.disconnect();
  }, [reviews, loading]);

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

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    startAutoScroll();
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
    startAutoScroll();
  };

  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    const half = Math.floor(reviews.length / 2);
    if (offset > half) offset -= reviews.length;
    if (offset < -half) offset += reviews.length;
    return offset;
  };

  if (loading) {
    return (
      <section className="py-16 bg-[#363432] text-center text-gray-400 min-h-[50vh] flex items-center justify-center">
        <div className="text-xl">Loading client reviews...</div>
      </section>
    );
  }

  if (error || reviews.length === 0) {
    return (
      <section className="py-20 bg-[#363432] text-center text-red-400 min-h-[50vh] flex items-center justify-center">
        <div className="text-xl">{error || 'No reviews available at the moment.'}</div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 bg-[#363432] overflow-hidden relative z-10 min-h-[70vh]"
    >
      <div className="container-custom max-w-6xl mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h2
  className="fade-up text-2xl md:text-4xl text-[#F3F3F2]"
  style={{ fontFamily: "'League Spartan', sans-serif", letterSpacing: '0.02em' }}
>
  What Our Clients{' '}
  <span
    className="text-[#CDFF00] font-bold"
    style={{ fontFamily: "'Aboreto', cursive", letterSpacing: '0.12em', textTransform: 'uppercase' }}
  >
    SAY
  </span>
</h2>
        </div>

        <div className="fade-up relative" style={{ height: '320px', minHeight: '280px' }}>
          <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-[#363432] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-[#363432] to-transparent z-10 pointer-events-none" />

          {reviews.map((review, index) => {
            const offset = getOffset(index);
            const isCenter = offset === 0;
            const isAdjacent = Math.abs(offset) === 1;

            const translateX = offset * 180;
            const scale = isCenter ? 1 : 0.85;
            const opacity = isCenter ? 1 : isAdjacent ? 0.6 : 0;
            const blur = isCenter ? 0 : isAdjacent ? 2 : 5;
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
                  width: '500px',
                  maxWidth: '90vw',
                  pointerEvents: isCenter || isAdjacent ? 'auto' : 'none',
                }}
              >
                <div
                  className={`
                    bg-[#2a2826] border ${isCenter ? 'border-[#CDFF00]/50 shadow-2xl shadow-[#CDFF00]/20' : 'border-[#4A4845]/50'}
                    rounded-2xl p-6 md:p-8 shadow-lg h-full flex flex-col transition-all duration-500
                  `}
                >
                  <div className="flex justify-between items-start mb-4 md:mb-6">
                    <Quote className="w-10 h-10 md:w-12 md:h-12 text-[#CDFF00]/30 flex-shrink-0" />
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 md:w-6 md:h-6 ${
                            i < (review.rating || 5)
                              ? 'fill-[#CDFF00] text-[#CDFF00]'
                              : 'text-[#4A4845]/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm md:text-base text-[#F3F3F2] leading-relaxed text-center italic mb-6 md:mb-8 flex-grow line-clamp-5">
                    "{review.review_text}"
                  </p>

                  <div className="flex items-center gap-3 md:gap-4 mt-auto">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-gradient-to-br from-[#CDFF00]/20 to-[#CDFF00]/5 border-2 border-[#CDFF00]/30 flex-shrink-0">
                      {review.picture ? (
                        <img
                          src={review.picture}
                          alt={review.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#CDFF00] font-bold text-lg md:text-xl">
                          {review.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#F3F3F2] text-base md:text-lg truncate">
                        {review.name}
                      </p>
                      <p className="text-[#CDFF00] text-xs md:text-sm truncate">{review.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 md:gap-10 mt-8 md:mt-10">
          <button
            onClick={handlePrev}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#4A4845] bg-transparent flex items-center justify-center text-[#DADADA] hover:text-[#CDFF00] hover:border-[#CDFF00] transition-all shadow-sm"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
          </button>

          <div className="flex gap-3 md:gap-4">
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
                className={`h-2 md:h-2.5 rounded-full transition-all duration-400 ${
                  index === activeIndex
                    ? 'w-10 md:w-12 bg-[#CDFF00] shadow-sm shadow-[#CDFF00]/40'
                    : 'w-2 md:w-3 bg-[#4A4845] hover:bg-[#CDFF00]/60'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#4A4845] bg-transparent flex items-center justify-center text-[#DADADA] hover:text-[#CDFF00] hover:border-[#CDFF00] transition-all shadow-sm"
            aria-label="Next review"
          >
            <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
          </button>
        </div>
      </div>
    </section>
  );
}