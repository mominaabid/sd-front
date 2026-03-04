import { useEffect, useRef, useState } from 'react';
import { Menu, X, Linkedin } from 'lucide-react';
import {useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants/urls'; // Ensure this file exists

// ─── Types matching your backend model (TeamMember) ─────────────
interface TeamMember {
  id: number;
  name: string;
  role: string;              // was "title" in config
  bio: string;
  picture: string;           // full media URL[](http://.../media/team/photo.jpg)
  linkedin_url?: string;     // optional LinkedIn profile URL
  // order?: number;         // optional – can sort if needed
  // is_active: boolean;     // assuming API returns only active
}

// ─── Fallback team members (used if API fails or is empty) ──────
const fallbackMembers: TeamMember[] = [
  {
    id: 9991,
    name: 'Saad Ahmed',
    role: 'Lead Editor & Co-Founder',
    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: 'With 8+ years of wedding filmmaking experience, Saad leads the creative vision at S&D Media. He specialises in cinematic storytelling and has edited over 500 wedding films.',
    linkedin_url: 'https://linkedin.com/in/saad-ahmed-example',
  },
  {
    id: 9992,
    name: 'Danish Malik',
    role: 'Senior Editor & Co-Founder',
    picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    bio: 'Danish brings technical mastery to every project. His colour grading expertise gives S&D films their signature warm, timeless look that clients love.',
    linkedin_url: 'https://linkedin.com/in/danish-malik-example',
  },
  // ... you can keep adding the other 7 fallback members if you want
  // For brevity, I'm showing only 2 here — copy the rest from your original
];

// ─── Fallback BTS images (unchanged) ────────────────────────────
const fallbackBtsImages: string[] = [
  'https://images.unsplash.com/photo-1574717025058-160f6d5a8b9c?w=800&q=80',
  'https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&q=80',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80',
];

export function TeamPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // ─── Fetch team members from backend ───────────────────────────
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}team/`);
        if (!res.ok) {
          throw new Error(`Team fetch failed: ${res.status}`);
        }

        const json = await res.json();
        // Adjust based on your API shape: { success: true, data: [...] } or direct array
        const fetched = json.data || json;

        // Optional: sort by order if present
        // fetched.sort((a: TeamMember, b: TeamMember) => (a.order || 0) - (b.order || 0));

        setTeamMembers(fetched.length > 0 ? fetched : fallbackMembers);
      } catch (err) {
        console.error('Failed to load team:', err);
        setError('Could not load team members');
        setTeamMembers(fallbackMembers); // fallback on error
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  // ─── Scroll detection for sticky navbar ────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Fade-in animation observer ────────────────────────────────
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

    const elements = pageRef.current?.querySelectorAll('.fade-up');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [teamMembers]); // re-run when members load

  // ─── Close lightbox on Escape ──────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImg(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ─── Scroll to top on mount ────────────────────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // ─── Navigation helper ─────────────────────────────────────────
  const handleNavClick = (path: string, hash?: string) => {
    navigate(path);
    setMobileMenuOpen(false);

    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div ref={pageRef} className="min-h-screen bg-[#222120]">
      {/* ─── NAVBAR (unchanged from your version) ──────────────────── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease',
          background: scrolled ? 'rgba(34, 33, 32, 0.82)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.25)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <a
            href="/"
            style={{
              fontSize: '1.5rem',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#e9e9e9',
              textDecoration: 'none',
            }}
          >
            S&amp;D <span style={{ color: '#CDFF00' }}>Media</span>
          </a>

          {/* Desktop links */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {[
              { label: 'Home', href: '/' },
              { label: 'Portfolio', href: '#portfolio' },
              { label: 'Pricing', href: '#pricing' },
            ].map(({ label, href }) => (
              <button
                key={label}
                onClick={() => handleNavClick(href.includes('#') ? '/' : href, href.includes('#') ? href : undefined)}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#d3d3cc',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F3F3F2')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#d3d3cc')}
              >
                {label}
              </button>
            ))}

            <button
              onClick={() => handleNavClick('/team')}
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#d3d3cc',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F3F3F2')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#d3d3cc')}
            >
              Our Team
            </button>

            <button
              onClick={() => handleNavClick('/', '#pricing')}
              style={{
                padding: '8px 20px',
                fontSize: '0.875rem',
                fontWeight: 500,
                background: '#CDFF00',
                color: '#222120',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Start a Project
            </button>
          </div>

          {/* Hamburger */}
          <button
            className="hamburger md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            style={{ background: 'none', border: 'none', color: '#F3F3F2', cursor: 'pointer' }}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              inset: '80px 0 0 0',
              background: 'rgba(34,33,32,0.96)',
              backdropFilter: 'blur(12px)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2.8rem',
            }}
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '5vw', background: 'none', border: 'none', color: '#F3F3F2', fontSize: '2.5rem' }}
            >
              <X size={40} />
            </button>

            <button onClick={() => handleNavClick('/')} style={{ fontSize: '1.6rem', color: '#F3F3F2' }}>Home</button>
            <button onClick={() => handleNavClick('/', '#portfolio')} style={{ fontSize: '1.6rem', color: '#F3F3F2' }}>Portfolio</button>
            <button onClick={() => handleNavClick('/', '#pricing')} style={{ fontSize: '1.6rem', color: '#F3F3F2' }}>Pricing</button>
            <button onClick={() => handleNavClick('/team')} style={{ fontSize: '1.6rem', color: '#F3F3F2' }}>Our Team</button>

            <button
              onClick={() => handleNavClick('/', '#pricing')}
              style={{ background: '#CDFF00', color: '#222120', fontWeight: 500, fontSize: '1.3rem', padding: '14px 36px', borderRadius: '6px', border: 'none' }}
            >
              Start a Project
            </button>
          </div>
        )}
      </nav>

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="bg-[#1a1815] border-b border-[#3a3835] pt-28 pb-16 text-center">
        <p className="fade-up text-[#DADADA] text-sm tracking-[0.2em] uppercase mb-3">The Editors Behind the Magic</p>
        <h1 className="fade-up font-serif text-5xl md:text-6xl text-[#F3F3F2] mb-4">
          Meet Our <span className="text-[#CDFF00]">Team</span>
        </h1>
        <p className="fade-up text-[#DADADA] max-w-2xl mx-auto text-lg px-6 leading-relaxed">
          9 full-time specialists who live and breathe wedding storytelling — no freelancers, no compromises.
        </p>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="container-custom py-16 md:py-20 px-6">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading team members...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : (
          <>
            {/* Team Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-8 mb-20 md:mb-28">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="fade-up group relative overflow-hidden rounded-xl"
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={member.picture}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Default overlay (name + role) */}
                    <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-500 group-hover:opacity-0">
                      <h4 className="font-serif text-lg md:text-xl text-white leading-tight mb-1">
                        {member.name}
                      </h4>
                      <p className="text-[#CDFF00] text-sm font-medium">{member.role}</p>
                    </div>

                    {/* Hover overlay (bio + LinkedIn) */}
                    <div className="absolute inset-0 bg-black/85 flex flex-col justify-end p-5 md:p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <h4 className="font-serif text-lg md:text-xl text-white mb-2">
                        {member.name}
                      </h4>
                      <p className="text-[#CDFF00] text-sm mb-4">{member.role}</p>
                      <p className="text-gray-200 text-sm leading-relaxed mb-5 line-clamp-4">
                        {member.bio}
                      </p>

                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#CDFF00] hover:text-white transition-colors text-sm font-medium"
                        >
                          <Linkedin className="w-5 h-5" />
                          Connect on LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Behind the Scenes Section */}
            <div className="fade-up">
              <div className="text-center mb-10 md:mb-12">
                <p className="text-[#DADADA] text-sm tracking-[0.2em] uppercase mb-3">Inside S&D Media</p>
                <h2 className="font-serif text-3xl md:text-4xl text-[#F3F3F2]">
                  Behind the Scenes
                </h2>
              </div>

              {/* Masonry grid */}
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
                {fallbackBtsImages.map((src, i) => (
                  <div
                    key={i}
                    className="fade-up break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group relative shadow-md"
                    style={{ transitionDelay: `${i * 80}ms` }}
                    onClick={() => setLightboxImg(src)}
                  >
                    <img
                      src={src}
                      alt={`Behind the scenes ${i + 1}`}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white text-sm tracking-widest uppercase border border-white/40 px-5 py-2 rounded-full">
                        View Larger
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Fullscreen Lightbox ──────────────────────────────────────── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#363432]/80 text-white flex items-center justify-center hover:bg-[#CDFF00] hover:text-black transition-colors z-10 shadow-lg"
            onClick={() => setLightboxImg(null)}
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={lightboxImg}
            alt="Behind the scenes enlarged"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}