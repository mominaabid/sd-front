import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '../constants/urls';

interface Review {
  id: number;
  name: string;
  title: string;
  review_text: string;
  picture?: string;
  rating: number;
  website_url?: string;
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
    const elements = document.querySelectorAll('.tr-fade');
    elements.forEach((el) => observer.observe(el));
    setTimeout(() => {
      document.querySelectorAll('.tr-fade').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('visible');
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
    return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
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
    const half = Math.round(reviews.length / 2);
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
      className="py-16 md:py-20 bg-[#363432] overflow-hidden relative z-10"
    >
      <style>{`
        .tr-fade {
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .tr-fade.visible { opacity: 1; transform: translateY(0); }

        /* ── CAROUSEL ROW: arrow — stage — arrow ── */
        .tr-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
        }

        /* Arrows — always vertically centered, never overflow */
        .tr-arrow {
          flex-shrink: 0;
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1px solid #4A4845;
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          color: #DADADA; cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }
        .tr-arrow:hover { color: #CDFF00; border-color: #CDFF00; }

        @media (min-width: 768px) {
          .tr-arrow { width: 52px; height: 52px; }
          .tr-row { gap: 16px; }
        }

        /* Stage — fixed height, clips nothing, cards absolutely positioned inside */
        .tr-stage {
          position: relative;
          flex: 1;
          max-width: 560px;
          height: 360px;
          overflow: visible;
        }

        @media (max-width: 640px) { .tr-stage { height: 420px; } }
        @media (max-width: 400px) { .tr-stage { height: 460px; } }

        /* Each card — absolutely positioned, centered */
        .tr-card {
          position: absolute;
          left: 50%; top: 0;
          width: 100%;
          transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1),
                      opacity 0.7s ease,
                      filter 0.7s ease;
          pointer-events: none;
        }
        .tr-card.center  { pointer-events: auto; }
        .tr-card.adjacent { pointer-events: auto; }

        /* ── LINK STYLES ── */
        .tr-link-btn {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.72rem; font-weight: 600; color: #CDFF00;
          text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase;
          padding: 5px 10px;
          border: 1px solid rgba(205,255,0,0.3); border-radius: 8px;
          background: rgba(205,255,0,0.06);
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          white-space: nowrap; flex-shrink: 0;
        }
        .tr-link-btn:hover { background: rgba(205,255,0,0.14); border-color: rgba(205,255,0,0.65); transform: translateY(-1px); }
        .tr-avatar-link { display: block; border-radius: 50%; transition: box-shadow 0.2s, transform 0.2s; flex-shrink: 0; }
        .tr-avatar-link:hover { box-shadow: 0 0 0 2px #CDFF00; transform: scale(1.06); }
        .tr-name-link { color: inherit; text-decoration: none; font-weight: 600; display: block; }
        .tr-name-link:hover { color: #CDFF00; text-decoration: underline; text-underline-offset: 3px; }
      `}</style>

      <div className="max-w-4xl mx-auto px-3 md:px-6">

        {/* Heading */}
        <div className="text-center mb-10 md:mb-12">
          <h2
            className="tr-fade text-2xl md:text-4xl text-[#F3F3F2]"
            style={{ fontFamily: "'Aboreto', cursive", letterSpacing: '0.02em' }}
          >
            What Our Clients{' '}
            <span
              className="text-[#CDFF00]"
              style={{ fontFamily: "'Aboreto', cursive", letterSpacing: '0.12em', textTransform: 'uppercase' }}
            >
              SAY
            </span>
          </h2>
        </div>

        {/* ── [arrow] [stage] [arrow] ── */}
        <div className="tr-fade tr-row">

          {/* Left arrow */}
          <button className="tr-arrow" onClick={handlePrev} aria-label="Previous review">
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Stage */}
          <div className="tr-stage">
            {/* Side fade overlays */}
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#363432] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#363432] to-transparent z-10 pointer-events-none" />

            {reviews.map((review, index) => {
              const offset = getOffset(index);
              const isCenter = offset === 0;
              const isAdjacent = Math.abs(offset) === 1;
              const hasLink = !!review.website_url;

              // On mobile only show center card; on larger screens show adjacent too
              const opacity = isCenter ? 1 : isAdjacent ? 0.5 : 0;
              const blur = isCenter ? 0 : isAdjacent ? 3 : 6;
              const zIndex = isCenter ? 30 : isAdjacent ? 20 : 10;

              // translateX as % of card width — works on all screen sizes
              const translateX = offset * 105; // 105% per step so side cards peek slightly

              return (
                <div
                  key={review.id}
                  className={`tr-card ${isCenter ? 'center' : isAdjacent ? 'adjacent' : ''}`}
                  style={{
                    transform: `translateX(calc(-50% + ${translateX}%))`,
                    opacity,
                    filter: `blur(${blur}px)`,
                    zIndex,
                  }}
                >
                  <div
                    className={`bg-[#2a2826] border ${
                      isCenter
                        ? 'border-[#CDFF00]/50 shadow-2xl shadow-[#CDFF00]/20'
                        : 'border-[#4A4845]/50'
                    } rounded-2xl p-5 md:p-8 flex flex-col gap-4 transition-all duration-500`}
                  >
                    {/* Quote + stars */}
                    <div className="flex justify-between items-start">
                      <Quote className="w-8 h-8 md:w-10 md:h-10 text-[#CDFF00]/30 flex-shrink-0" />
                      <div className="flex gap-0.5 md:gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 md:w-5 md:h-5 ${
                              i < (review.rating || 5)
                                ? 'fill-[#CDFF00] text-[#CDFF00]'
                                : 'text-[#4A4845]/40'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="text-sm md:text-base text-[#F3F3F2] leading-relaxed text-center italic line-clamp-5">
                      {review.review_text}
                    </p>

                    {/* Bottom: avatar + name + visit button */}
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <div className="flex items-center gap-2 md:gap-3 min-w-0">

                        {/* Avatar */}
                        {hasLink ? (
                          <a href={review.website_url} target="_blank" rel="noopener noreferrer"
                            className="tr-avatar-link" title={`Visit ${review.name}'s website`}>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#CDFF00]/20 to-[#CDFF00]/5 border-2 border-[#CDFF00]/30">
                              {review.picture
                                ? <img src={review.picture} alt={review.name} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-[#CDFF00] font-bold text-base">{review.name.split(' ').map(n => n[0]).join('')}</div>
                              }
                            </div>
                          </a>
                        ) : (
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#CDFF00]/20 to-[#CDFF00]/5 border-2 border-[#CDFF00]/30 flex-shrink-0">
                            {review.picture
                              ? <img src={review.picture} alt={review.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-[#CDFF00] font-bold text-base">{review.name.split(' ').map(n => n[0]).join('')}</div>
                            }
                          </div>
                        )}

                        {/* Name + title */}
                        <div className="min-w-0">
                          {hasLink ? (
                            <a href={review.website_url} target="_blank" rel="noopener noreferrer"
                              className="tr-name-link text-[#F3F3F2] text-sm md:text-base truncate">
                              {review.name}
                            </a>
                          ) : (
                            <p className="font-semibold text-[#F3F3F2] text-sm md:text-base truncate">{review.name}</p>
                          )}
                          <p className="text-[#CDFF00] text-xs truncate">{review.title}</p>
                        </div>
                      </div>

                      {/* Visit button */}
                      {hasLink && (
                        <a href={review.website_url} target="_blank" rel="noopener noreferrer"
                          className="tr-link-btn" onClick={(e) => e.stopPropagation()}>
                          <ExternalLink size={10} /> Visit
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right arrow */}
          <button className="tr-arrow" onClick={handleNext} aria-label="Next review">
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-3 md:gap-4 mt-8 md:mt-10">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => { setActiveIndex(index); startAutoScroll(); }}
              className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-10 md:w-12 bg-[#CDFF00] shadow-sm shadow-[#CDFF00]/40'
                  : 'w-2 md:w-3 bg-[#4A4845] hover:bg-[#CDFF00]/60'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}