import { useState, useEffect, useRef } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../constants/urls';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Video {
  id: number;
  title: string;
  couple?: string;
  thumbnail?: string;       // ✅ correct field name from API
  video_url?: string;
  video_file?: string;
  category: string;         // ✅ API returns category as a plain string
  category_id: number;
  description?: string;
}

export function Portfolio() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}portfolio/categories/`);
        if (!res.ok) throw new Error(`Categories fetch failed: ${res.status}`);
        const json = await res.json();
        const fetched = json.data || json;
        setCategories([{ id: 0, name: 'All', slug: 'all' }, ...fetched]);
      } catch (err) {
        console.error('Categories fetch error:', err);
        setError('Failed to load portfolio categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_BASE_URL}portfolio/videos/`;
        if (activeTab !== 'All') {
          const selectedCat = categories.find(c => c.name === activeTab);
          if (selectedCat && selectedCat.id !== 0) url += `?category=${selectedCat.id}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Videos fetch failed: ${res.status}`);
        const json = await res.json();
        setVideos(json.data || json);
        setCurrentPage(0);
      } catch (err) {
        console.error('Videos fetch error:', err);
        setError('Failed to load portfolio videos');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [activeTab, categories]);

  const totalPages = Math.ceil(videos.length / itemsPerPage);
  const paginatedVideos = videos.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    const elements = document.querySelectorAll('.port-fade');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    elements.forEach((el) => { el.classList.remove('visible'); observer.observe(el); });
    return () => observer.disconnect();
  }, [paginatedVideos]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedVideo(null); };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const getPageRange = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i);
    if (currentPage <= 2) return [0, 1, 2, 3, '...', totalPages - 1];
    if (currentPage >= totalPages - 3) return [0, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
    return [0, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages - 1];
  };

  const renderThumbnail = (item: Video) => {
    const thumbUrl = item.thumbnail || null;
    const videoUrl = item.video_url || item.video_file || null;

    if (thumbUrl) {
      return (
        <img
          src={thumbUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            console.warn('Thumbnail failed to load:', thumbUrl);
            e.currentTarget.style.display = 'none';
            const sibling = e.currentTarget.nextElementSibling as HTMLElement;
            if (sibling) sibling.style.display = 'block';
          }}
        />
      );
    }

    if (videoUrl) {
      return (
        <video
          src={videoUrl}
          muted
          preload="metadata"
          className="w-full h-full object-cover"
        />
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center bg-[#2a2825]">
        <Play className="w-10 h-10 text-[#CDFF00]/30" />
      </div>
    );
  };

  return (
    <>
      <style>{`
        .port-fade {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.85s ease-out, transform 0.85s ease-out;
        }
        .port-fade.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .port-tab {
          font-family: 'League Spartan', sans-serif !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          font-size: 0.78rem !important;
          font-weight: 500 !important;
        }
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 48px;
          flex-wrap: wrap;
          padding: 0 12px;
        }
        .page-nav {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 42px;
          padding: 0 18px;
          border-radius: 10px;
          border: 1px solid rgba(74,72,69,0.8);
          color: rgba(240,237,232,0.65);
          background: transparent;
          font-family: 'League Spartan', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
          user-select: none;
        }
        .page-nav:not(:disabled):hover {
          border-color: #CDFF00;
          color: #fff;
          background: rgba(205,255,0,0.06);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(205,255,0,0.12);
        }
        .page-nav:disabled { opacity: 0.3; cursor: not-allowed; pointer-events: none; }
        .page-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          border-radius: 8px;
          font-family: 'League Spartan', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid transparent;
          background: transparent;
          color: rgba(240,237,232,0.55);
          transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
          user-select: none;
          flex-shrink: 0;
        }
        .page-pill:hover:not(.active) {
          background: rgba(205,255,0,0.1); color: #fff;
          border-color: rgba(205,255,0,0.25); transform: translateY(-1px);
        }
        .page-pill.active {
          background: #CDFF00; color: #111; border-color: #CDFF00;
          font-weight: 700; box-shadow: 0 4px 14px rgba(205,255,0,0.3);
        }
        .page-ellipsis {
          width: 28px; text-align: center;
          color: rgba(240,237,232,0.3); font-size: 0.9rem;
          user-select: none; pointer-events: none; line-height: 38px;
        }
        @media (max-width: 480px) {
          .page-nav { width: 42px; height: 42px; padding: 0; border-radius: 10px; }
          .page-nav-label { display: none; }
          .page-pill { width: 34px; height: 34px; font-size: 0.8rem; border-radius: 7px; }
          .pagination { gap: 4px; margin-top: 36px; }
        }
        @media (max-width: 360px) {
          .page-pill { width: 30px; height: 30px; font-size: 0.75rem; }
          .page-nav { width: 38px; height: 38px; }
          .pagination { gap: 3px; }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="portfolio"
        className="py-16 bg-[#222120] relative z-10 min-h-[80vh]"
      >
        <div className="container mx-auto px-6">

          {/* Header */}
          <div className="port-fade text-center mb-12">
            <h2
              className="text-3xl md:text-5xl mb-4"
              style={{ fontFamily: "'Aboreto', cursive", letterSpacing: '0.02em' }}
            >
              Our{' '}
              <span
                className="text-[#CDFF00]"
                style={{ fontFamily: "'Aboreto', cursive", letterSpacing: '0.12em', textTransform: 'uppercase' }}
              >
                PORTFOLIO
              </span>
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="port-fade flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.name)}
                className={`port-tab px-5 py-2 rounded-full transition-all ${
                  activeTab === cat.name
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'bg-[#363432] text-gray-300 hover:text-white border border-gray-600 hover:border-primary/50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-20 text-gray-400 text-xl">Loading portfolio...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-400 text-xl">{error}</div>
          ) : paginatedVideos.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-xl">No videos found in this category.</div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {paginatedVideos.map((item, index) => (
                  <div
                    key={item.id}
                    className="port-fade group relative aspect-video bg-[#363432] rounded-xl overflow-hidden border border-[#4A4845]/50 cursor-pointer hover:border-[#CDFF00]/50 transition-all duration-300 shadow-lg hover:shadow-[#CDFF00]/10"
                    style={{ transitionDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedVideo(item)}
                  >
                    {/* Play overlay */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-[#CDFF00]/80 flex items-center justify-center shadow-lg shadow-[#CDFF00]/30 transform group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-[#222120] fill-[#222120] ml-1" />
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-full h-full overflow-hidden">
                      {renderThumbnail(item)}
                      {/* Hidden video fallback revealed if image onError fires */}
                      {item.thumbnail && (item.video_url || item.video_file) && (
                        <video
                          src={item.video_url || item.video_file}
                          muted
                          preload="metadata"
                          className="w-full h-full object-cover"
                          style={{ display: 'none' }}
                        />
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 to-transparent">
                      {/* category is a plain string from API */}
                      <p
                        className="text-xs text-[#CDFF00] uppercase tracking-wider mb-1"
                        style={{ fontFamily: "'League Spartan', sans-serif" }}
                      >
                        {item.category || 'Video'}
                      </p>
                      <h4
                        className="text-white text-lg"
                        style={{ fontFamily: "'League Spartan', sans-serif" }}
                      >
                        {item.title}
                      </h4>
                      {item.couple && <p className="text-sm text-gray-300 mt-1">{item.couple}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="pagination" aria-label="Portfolio pages">
                  <button
                    className="page-nav"
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                    <span className="page-nav-label">Previous</span>
                  </button>
                  {getPageRange().map((item, i) =>
                    item === '...' ? (
                      <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
                    ) : (
                      <button
                        key={item as number}
                        className={`page-pill ${currentPage === item ? 'active' : ''}`}
                        onClick={() => setCurrentPage(item as number)}
                        aria-label={`Page ${(item as number) + 1}`}
                        aria-current={currentPage === item ? 'page' : undefined}
                      >
                        {(item as number) + 1}
                      </button>
                    )
                  )}
                  <button
                    className="page-nav"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                    aria-label="Next page"
                  >
                    <span className="page-nav-label">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      {selectedVideo && (
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-center px-4 pt-20 pb-8 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-[#111111] transform transition-all duration-300 scale-100 sm:scale-105"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#CDFF00] hover:text-black transition-all duration-200 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              key={selectedVideo.id}
              src={selectedVideo.video_url || selectedVideo.video_file || ''}
              className="w-full h-auto max-h-[70vh] object-contain bg-black"
              controls
              autoPlay
            />
            <div className="p-4 text-center bg-[#1a1a1a]">
              <h3
                className="text-xl md:text-2xl text-white mb-1"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                {selectedVideo.title}
              </h3>
              {selectedVideo.couple && (
                <p className="text-gray-300 text-base md:text-lg">{selectedVideo.couple}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}