import { useEffect, useRef, useState, useCallback } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../constants/urls'; // Make sure this file exists

// ─────────────────────────────────────────────────────────────
// Type definition for the API response (adjust if your real response differs)
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
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fallback values in case API fails
  const fallbackData = {
    heading: "Wedding Films That\nMove People.",
    subtitle: "Delivered On Time. Every Time.",
    background_video_url: undefined,
    background_video_file: undefined,
  };

  // ─── Fetch hero data from backend ──────────────────────────────
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
      setFetchError('Could not load hero content');
      setHeroData(fallbackData); // still show fallback UI
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isReady) {
      fetchHero();
    }
  }, [isReady, fetchHero]);

  // ─── Visibility & scroll handlers (unchanged) ──────────────────
  useEffect(() => {
    if (!isReady) return;
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, [isReady]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Mobile menu logic (unchanged) ─────────────────────────────
  const linkStyle = {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: scrolled ? '#e0dcdc' : '#4e4c4c',
    textDecoration: 'none',
    transition: 'color 0.25s ease',
  } as const;

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

  // ─── Computed video source ─────────────────────────────────────
  const videoSrc =
    heroData?.background_video_file ||
    heroData?.background_video_url ||
    'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-in-a-romantic-sunset-scene-34374-large.mp4';

  const posterSrc =
    heroData?.background_video_file || heroData?.background_video_url
      ? undefined // if we have video, no need for poster
      : 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80';

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --lime: #CDFF00;
          --dark: #222120;
          --light: #F3F3F2;
          --muted: #DADADA;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--dark);
          color: var(--light);
          overflow-x: hidden;
        }

        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          height: 60px;
          background: rgba(34,33,32,0.82);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          font-size: 1.55rem;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: var(--light);
          text-decoration: none;
        }

        .nav-logo span {
          color: var(--lime);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: clamp(1rem, 3vw, 2.5rem);
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-links a {
          font-size: 0.94rem;
          font-weight: 400;
          color: var(--muted);
          text-decoration: none;
          letter-spacing: 0.015em;
          transition: color 0.25s ease;
        }

        .nav-links a:hover {
          color: var(--light);
        }

        .btn-cta {
          background: var(--lime);
          color: var(--dark);
          font-weight: 500;
          font-size: 0.94rem;
          padding: 11px 26px;
          border-radius: 8px;
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: all 0.22s ease;
          box-shadow: 0 2px 8px rgba(205,255,0,0.18);
        }

        .btn-cta:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 20px rgba(205,255,0,0.28);
          opacity: 0.94;
        }

        .hero { 
  position: relative; 
  min-height: 100vh; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  overflow: hidden; 
}

.hero-content {
  padding: 120px 24px 80px;      /* balanced vertical space */
  max-width: 820px;
  width: 100%;
}

@media (max-width: 767px) {
  .hero {
    min-height: 100vh;
  }
  .hero-content {
    padding: 80px 16px 60px;
  }
}

        .hero-video-wrap { position: absolute; inset: 0; height: 120%; top: -10%; }
        .hero-video-wrap video { width: 100%; height: 100%; object-fit: cover; }
        .hero-video-wrap::before {
          content: '';
          position: absolute; inset: 0;
          background: url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80') center/cover no-repeat;
          z-index: -1;
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(34,33,32,0.65) 0%, rgba(34,33,32,0.45) 50%, rgba(34,33,32,0.88) 100%);
        }

        @keyframes kenburns {
          0%   { transform: scale(1) translate(0, 0); }
          50%  { transform: scale(1.06) translate(-1%, 0.5%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .hero-video-wrap video, .hero-video-wrap::before { animation: kenburns 18s ease-in-out infinite; }

        .hero-side-text {
          position: absolute; left: 24px; top: 50%; transform: translateY(-50%);
          writing-mode: vertical-rl; text-orientation: mixed;
          font-size: 0.65rem; letter-spacing: 0.35em; text-transform: uppercase;
          color: rgba(218,218,218,0.3); font-weight: 400;
        }

        .hero-content {
          position: relative; 
          z-index: 10; 
          text-align: center;
          max-width: 820px; 
          padding: 85px 24px 50px;     /* ← much tighter vertical space */
          width: 100%;
        }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { opacity: 0; }

        .hero-content.visible .fade-up:nth-child(1) { animation: fadeUp 0.7s ease forwards 0.1s; }
        .hero-content.visible .fade-up:nth-child(2) { animation: fadeUp 0.7s ease forwards 0.25s; }
        .hero-content.visible .fade-up:nth-child(3) { animation: fadeUp 0.7s ease forwards 0.4s; }
        .hero-content.visible .fade-up:nth-child(4) { animation: fadeUp 0.7s ease forwards 0.55s; }
        .hero-content.visible .fade-up:nth-child(5) { animation: fadeUp 0.7s ease forwards 0.7s; }
        .hero-content.visible .fade-up:nth-child(6) { animation: fadeUp 0.7s ease forwards 0.85s; }

        .hero-script {
          font-family: 'DM Sans', sans-serif; 
          font-weight: 500; 
          font-size: 0.78rem;
          letter-spacing: 0.32em; 
          text-transform: uppercase; 
          color: var(--lime);
          margin-bottom: 16px; 
          display: block;
        }

        .hero-title {
          font-family: 'Playfair Display', serif; 
          font-size: 4rem;   /* ← slightly smaller */
          font-weight: 900; 
          color: var(--light); 
          line-height: 1.08;
          margin-bottom: 12px; 
          white-space: pre-line;
        }

        .hero-title em { font-style: italic; font-weight: 600; }

        .hero-subtitle {
          font-family: 'Playfair Display', serif; 
          font-size: 2rem;    /* ← slightly smaller */
          font-weight: 600; 
          color: rgba(243,243,242,0.75); 
          margin-bottom: 14px; 
          
        }

        .hero-desc {
          font-size: 0.95rem; 
          color: rgba(218,218,218,0.7); 
          line-height: 1.65;
          max-width: 500px; 
          margin: 0 auto 32px; 
          font-weight: 300;
        }

        .hero-buttons {
          display: flex; 
          flex-direction: row; 
          gap: 12px; 
          justify-content: center;
          margin-bottom: 48px; 
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex; 
          align-items: center; 
          gap: 8px;
          background: var(--lime); 
          color: var(--dark);
          font-family: 'DM Sans', sans-serif; 
          font-weight: 600; 
          font-size: 1rem;
          padding: 10px 32px 10px 28px; 
          border-radius: 7px; 
          text-decoration: none;
          letter-spacing: 0.01em; 
          box-shadow: 0 0 20px #ccff004d, 0 0 60px #ccff001a;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-2px); 
          box-shadow: 0 4px 30px #ccff0066, 0 0 80px #ccff0033;
        }

        .btn-secondary {
          display: inline-flex; 
          align-items: center; 
          gap: 8px;
          background: rgba(255,255,255,0.08); 
          border: 1px solid rgba(255,255,255,0.18);
          color: var(--light); 
          font-family: 'DM Sans', sans-serif; 
          font-weight: 500; 
          font-size: 1rem;
          padding: 10px 32px 10px 28px;
          border-radius: 7px; 
          text-decoration: none;
          letter-spacing: 0.01em; 
          transition: background 0.2s, transform 0.2s;
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.14); 
          transform: translateY(-2px);
        }

        // .hero-stats {
        //   display: grid; 
        //   grid-template-columns: repeat(3, 1fr); 
        //   gap: 24px;
        //   max-width: 520px; 
        //   margin: 0 auto;
        // }

        // .stat-number {
        //   font-family: 'Playfair Display', serif; 
        //   font-size: clamp(1.6rem, 3.6vw, 2.3rem);   /* ← smaller numbers */
        //   font-weight: 700; 
        //   color: var(--lime); 
        //   line-height: 1; 
        //   margin-bottom: 4px;
        // }

        // .stat-suffix { font-size: 0.82em; }

        // .stat-label {
        //   font-size: 0.72rem; 
        //   color: var(--muted);
        //   letter-spacing: 0.04em; 
        //   text-transform: uppercase; 
        //   font-weight: 400;
        // }

        .scroll-indicator {
          position: absolute; 
          bottom: 24px; 
          left: 50%; 
          transform: translateX(-50%);
        }

        .scroll-mouse {
          width: 24px; 
          height: 38px; 
          border: 2px solid rgba(218,218,218,0.3);
          border-radius: 12px; 
          display: flex; 
          justify-content: center; 
          padding-top: 7px;
        }

        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          80% { transform: translateY(10px); opacity: 0; }
        }

        .scroll-dot {
          width: 4px; 
          height: 6px; 
          background: var(--lime);
          border-radius: 2px; 
          animation: scrollBounce 1.8s ease-in-out infinite;
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateY(-50%) translateX(-16px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0); }
        }

        .hero-side-text.visible { animation: slideInLeft 0.8s ease forwards 1s; opacity: 0; }

        .section { padding: 120px 48px; max-width: 1200px; margin: 0 auto; }
        .section-title {
          font-family: 'Playfair Display', serif; 
          font-size: clamp(2rem, 4vw, 3rem);
          color: var(--light); 
          margin-bottom: 16px;
        }
        .section-label {
          font-size: 0.75rem; 
          letter-spacing: 0.32em; 
          text-transform: uppercase;
          color: var(--lime); 
          margin-bottom: 12px; 
          display: block;
        }
        .section-body { 
          color: rgba(218,218,218,0.7); 
          line-height: 1.8; 
          max-width: 600px; 
          font-size: 0.975rem; 
        }

        .divider { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 0 48px; }

        @media (max-width: 767px) {
          .hero {
            min-height: 65vh;           /* better mobile proportion */
          }
          .hero-content {
            padding: 70px 16px 45px;
          }
          .hero-title {
            font-size: 4rem;
          }
          .hero-subtitle {
            font-size: clamp(0.95rem, 3vw, 1.3rem);
          }
          .hero-desc {
            font-size: 0.92rem;
          }
          .hero-buttons {
            gap: 10px;
            margin-bottom: 40px;
          }
          .btn-primary, .btn-secondary {
            padding: 11px 24px;
            font-size: 0.85rem;
          }
        }
         

        @media (max-width: 767px) {
  .nav-desktop { display: none !important; }
  .hamburger { display: block !important; }
}

        .nav a:hover { color: #ffffff !important; }
      `}</style>

      {/* ─── NAVBAR (unchanged) ──────────────────────────────────────── */}
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
            href="#home"
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
              <a
                key={label}
                href={href}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#d3d3cc',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F3F3F2')}
                onMouseLeave={e => (e.currentTarget.style.color = '#d3d3cc')}
              >
                {label}
              </a>
            ))}
            {/* Team Link separately */}
            <Link
              to="/team"
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#d3d3cc',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F3F3F2')}
              onMouseLeave={e => (e.currentTarget.style.color = '#d3d3cc')}
            >
              Our Team
            </Link>

            <a
              href="#pricing"
              style={{
                padding: '8px 20px',
                fontSize: '0.875rem',
                fontWeight: 500,
                background: '#CDFF00',
                color: '#222120',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Start a Project
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMobileMenuOpen(true)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#F3F3F2',
              cursor: 'pointer',
            }}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
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

            <a href="#home" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#portfolio" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>Portfolio</a>
            <a href="#pricing" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="/team" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>Our Team</a>

            <a
              href="#pricing"
              style={{ ...ctaStyle, fontSize: '1.3rem', padding: '14px 36px' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Start a Project
            </a>
          </div>
        )}
      </nav>

      {/* ─── HERO SECTION ────────────────────────────────────────────── */}
      <section ref={sectionRef} id="home" className="hero min-h-screen relative z-0">
        <div className="hero-video-wrap">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={posterSrc}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>

        <div className={`hero-content${visible ? ' visible' : ''}`}>
          {/* You can keep scriptText static or make it dynamic too if you add it to model */}
          <span className="fade-up hero-script">WEDDING VIDEO EDITING</span>

          <h1 className="fade-up hero-title">
            {loading ? 'Loading...' : (heroData?.heading || fallbackData.heading)}
          </h1>

          <p className="fade-up hero-subtitle">
            {loading ? '...' : (heroData?.subtitle || fallbackData.subtitle)}
          </p>

          <p className="fade-up hero-desc">
            Professional post-production for wedding videographers who refuse to compromise on quality or deadlines.
          </p>

          <div className="fade-up hero-buttons">
            <a href="#pricing" className="btn-primary">
              Pricing <ArrowRight size={16} />
            </a>
            <a href="#portfolio" className="btn-secondary">
              Portfolio <ArrowRight size={16} />
            </a>
          </div>

          {/* Stats still commented out – you can re-enable later if needed */}
          {/* <div className="fade-up hero-stats">...</div> */}
        </div>
      </section>
    </>
  );
}