import { useState, useEffect, useRef } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../constants/urls';

// ─────────────────────────────────────────────────────────────
// Type definitions
// ─────────────────────────────────────────────────────────────
interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Video {
  id: number;
  title: string;
  couple?: string;
  thumbnail_url: string;
  video_url?: string;
  video_file?: string;
  category: { id: number };
}

// ─────────────────────────────────────────────────────────────
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

  // ─── Fetch categories ──────────────────────────────────────────
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}portfolio/categories/`);
        if (!res.ok) throw new Error(`Categories fetch failed: ${res.status}`);
        const json = await res.json();
        const fetched = json.data || json;

        setCategories([
          { id: 0, name: 'All', slug: 'all' },
          ...fetched,
        ]);
      } catch (err) {
        console.error('Categories fetch error:', err);
        setError('Failed to load portfolio categories');
      }
    };

    fetchCategories();
  }, []);

  // ─── Fetch videos ──────────────────────────────────────────────
  useEffect(() => {
    if (categories.length === 0) return;

    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `${API_BASE_URL}portfolio/videos/`;
        if (activeTab !== 'All') {
          const selectedCat = categories.find(c => c.name === activeTab);
          if (selectedCat && selectedCat.id !== 0) {
            url += `?category=${selectedCat.id}`;
          }
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Videos fetch failed: ${res.status}`);

        const json = await res.json();
        const fetchedVideos = json.data || json;

        setVideos(fetchedVideos);
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

  // ─── Improved Intersection Observer + force visible fallback ───
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
        rootMargin: '0px 0px -100px 0px', // trigger earlier
      }
    );

    // Query all .port-fade in document (safer than ref-only)
    const elements = document.querySelectorAll('.port-fade');
    elements.forEach((el) => observer.observe(el));

    // Force visible for elements already in view after mount
    setTimeout(() => {
      document.querySelectorAll('.port-fade').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
        }
      });
    }, 800); // slight delay after data loads

    return () => observer.disconnect();
  }, [videos, categories, loading]); // re-run when content changes

  // ─── Escape to close modal ─────────────────────────────────────
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedVideo(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // ─── Pagination ────────────────────────────────────────────────
  const totalPages = Math.ceil(videos.length / itemsPerPage);
  const paginatedVideos = videos.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .port-fade {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.9s ease-out, transform 0.9s ease-out;
        }
        .port-fade.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <section
        ref={sectionRef}
        id="portfolio"
        className="py-24 bg-[#222120] relative z-10 min-h-[80vh]" // ← key fix: z-index + min height
      >
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="port-fade text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Our <span className="text-primary">Portfolio</span>
            </h2>
          </div>

          {/* Tabs */}
          <div className="port-fade flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.name)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === cat.name
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'bg-[#363432] text-gray-300 hover:text-white border border-gray-600 hover:border-primary/50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Content Area */}
          {loading ? (
            <div className="text-center py-20 text-gray-400 text-xl">
              Loading portfolio...
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-400 text-xl">
              {error}
            </div>
          ) : paginatedVideos.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-xl">
              No videos found in this category.
            </div>
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
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                        No thumbnail
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Play icon on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-[#CDFF00]/80 flex items-center justify-center shadow-lg shadow-[#CDFF00]/30 transform group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-[#222120] fill-[#222120] ml-1" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 to-transparent">
                      <p className="text-xs text-[#CDFF00] font-medium uppercase tracking-wider mb-1">
                        {categories.find(c => c.id === item.category.id)?.name || 'Video'}
                      </p>
                      <h4 className="font-display font-semibold text-white text-lg">
                        {item.title}
                      </h4>
                      {item.couple && (
                        <p className="text-sm text-gray-300 mt-1">
                          {item.couple}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="px-6 py-3 rounded-lg border border-[#4A4845] text-gray-300 disabled:opacity-40 hover:border-[#CDFF00] hover:text-white transition-colors"
                  >
                    <ChevronLeft className="inline w-5 h-5 mr-2" />
                    Previous
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        currentPage === i
                          ? 'bg-[#CDFF00] text-black shadow-lg'
                          : 'text-gray-300 hover:bg-[#CDFF00]/20 hover:text-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-6 py-3 rounded-lg border border-[#4A4845] text-gray-300 disabled:opacity-40 hover:border-[#CDFF00] hover:text-white transition-colors"
                  >
                    Next
                    <ChevronRight className="inline w-5 h-5 ml-2" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Video Popup */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#CDFF00] hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full h-full relative">
              {selectedVideo.thumbnail_url ? (
                <img
                  src={selectedVideo.thumbnail_url}
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-500 text-xl">
                  No preview available
                </div>
              )}

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                <div className="w-24 h-24 rounded-full bg-[#CDFF00] flex items-center justify-center mb-6 cursor-pointer hover:scale-110 transition-transform shadow-xl shadow-[#CDFF00]/30">
                  <Play className="w-12 h-12 text-black fill-black ml-2" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                  {selectedVideo.title}
                </h3>
                {selectedVideo.couple && (
                  <p className="text-gray-300 text-lg">{selectedVideo.couple}</p>
                )}
                <p className="text-[#CDFF00] text-base mt-4 opacity-80">
                  Video playback coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}