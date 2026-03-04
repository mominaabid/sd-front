import { useEffect, useRef, useState, useCallback } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../constants/urls'; // Make sure this file exists

interface HeroApiResponse {
  success: boolean;
  data: {
    heading: string;
    subtitle: string;
    background_video_url?: string;
    background_video_file?: string;
  };
}

interface HeroProps {
  isReady?: boolean;
}

export function Hero({ isReady = true }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ─── Dynamic data states ───────────────────────────────────────
  const [heroData, setHeroData] = useState<HeroApiResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  const fallbackData = {
    heading: "Wedding Films That\nMove People.",
    subtitle: "Delivered On Time. Every Time.",
    background_video_url: undefined,
    background_video_file: undefined,
  };

  const fetchHero = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}hero/`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} – ${response.statusText}`);
      }

      const json: HeroApiResponse = await response.json();

      if (!json.success || !json.data) {
        throw new Error('API response format invalid');
      }

      setHeroData(json.data);
    } catch (err) {
      console.error('Hero fetch failed:', err);
      setHeroData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isReady) fetchHero();
  }, [isReady, fetchHero]);

  useEffect(() => {
    if (!isReady) return;
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, [isReady]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ctaStyle = {
    background: '#CDFF00',
    color: '#222120',
    fontWeight: 500,
    fontSize: '0.95rem',
    padding: '11px 26px',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'all 0.25s ease',
    boxShadow: scrolled ? '0 4px 16px rgba(205,255,0,0.25)' : 'none',
  } as const;

  const mobileLinkStyle = {
    fontSize: '1.6rem',
    color: '#F3F3F2',
    textDecoration: 'none',
  } as const;

  const videoSrc =
    heroData?.background_video_file ||
    heroData?.background_video_url ||
    'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-in-a-romantic-sunset-scene-34374-large.mp4';

  const posterSrc =
    heroData?.background_video_file || heroData?.background_video_url
      ? undefined
      : 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        :root { --lime: #CDFF00; --dark: #222120; --light: #F3F3F2; --muted: #DADADA; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: var(--dark); color: var(--light); overflow-x: hidden; }
        /* NAV, HERO, etc styles omitted for brevity – keep the same from your original code */
      `}</style>

      {/* NAVBAR */}
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
          <a href="#home" style={{ fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: '-0.02em', color: '#e9e9e9', textDecoration: 'none' }}>
            S&amp;D <span style={{ color: '#CDFF00' }}>Media</span>
          </a>

          {/* Desktop links */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {['Home', 'Portfolio', 'Pricing'].map(label => (
              <a key={label} href={`#${label.toLowerCase()}`} style={{ fontSize: '0.875rem', fontWeight: 500, color: '#d3d3cc', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F3F3F2')}
                onMouseLeave={e => (e.currentTarget.style.color = '#d3d3cc')}
              >
                {label}
              </a>
            ))}
            <Link to="/team" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#d3d3cc', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F3F3F2')}
              onMouseLeave={e => (e.currentTarget.style.color = '#d3d3cc')}
            >
              Our Team
            </Link>
            <a href="#pricing" style={{ padding: '8px 20px', fontSize: '0.875rem', fontWeight: 500, background: '#CDFF00', color: '#222120', borderRadius: '6px', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Start a Project
            </a>
          </div>

          <button className="hamburger" onClick={() => setMobileMenuOpen(true)} style={{ display: 'none', background: 'none', border: 'none', color: '#F3F3F2', cursor: 'pointer' }}>
            <Menu size={24} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div style={{ position: 'fixed', inset: '80px 0 0 0', background: 'rgba(34,33,32,0.96)', backdropFilter: 'blur(12px)', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.8rem' }}>
            <button onClick={() => setMobileMenuOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '5vw', background: 'none', border: 'none', color: '#F3F3F2', fontSize: '2.5rem' }}>
              <X size={40} />
            </button>

            <a href="#home" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#portfolio" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>Portfolio</a>
            <a href="#pricing" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="/team" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>Our Team</a>
            <a href="#pricing" style={{ ...ctaStyle, fontSize: '1.3rem', padding: '14px 36px' }} onClick={() => setMobileMenuOpen(false)}>Start a Project</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section ref={sectionRef} id="home" className="hero min-h-screen relative z-0">
        <div className="hero-video-wrap">
          <video autoPlay muted loop playsInline poster={posterSrc}>
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>

        <div className={`hero-content${visible ? ' visible' : ''}`}>
          <span className="fade-up hero-script">WEDDING VIDEO EDITING</span>
          <h1 className="fade-up hero-title">{loading ? 'Loading...' : (heroData?.heading || fallbackData.heading)}</h1>
          <p className="fade-up hero-subtitle">{loading ? '...' : (heroData?.subtitle || fallbackData.subtitle)}</p>
          <p className="fade-up hero-desc">Professional post-production for wedding videographers who refuse to compromise on quality or deadlines.</p>
          <div className="fade-up hero-buttons">
            <a href="#pricing" className="btn-primary">Pricing <ArrowRight size={16} /></a>
            <a href="#portfolio" className="btn-secondary">Portfolio <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>
    </>
  );
}