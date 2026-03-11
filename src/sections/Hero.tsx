import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../constants/urls";

interface HeroApiResponse {
  success: boolean;
  data: HeroData;
}

interface HeroData {
  heading: string;
  subtitle: string;
  background_video_url?: string;
  background_video_file?: string;
}

interface HeroProps {
  isReady?: boolean;
}

export function Hero({ isReady = true }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const fallbackData: HeroData = {
    heading: "Wedding Films That Couples\nRemember.",
    subtitle: "Professional postproduction for wedding videographers who refuse to compromise on quality or deadlines even during peak season.",
  };

  const fetchHero = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}hero/`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json: HeroApiResponse = await response.json();
      if (json.success && json.data) setHeroData(json.data);
      else setHeroData(fallbackData);
    } catch (err) {
      console.error("Hero fetch failed:", err);
      setHeroData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (isReady) fetchHero(); }, [isReady, fetchHero]);
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const videoSrc =
    heroData?.background_video_file?.trim()
      ? heroData.background_video_file
      : heroData?.background_video_url?.trim()
      ? heroData.background_video_url
      : "/77929-564459462_tiny.mp4";

  const heading = heroData?.heading || fallbackData.heading;
  const subtitle = heroData?.subtitle || fallbackData.subtitle;

  const navLinks = [
    { label: "Home", href: "#home", type: "anchor" },
    { label: "Portfolio", href: "#portfolio", type: "anchor" },
    { label: "Pricing", href: "#pricing", type: "anchor" },
    { label: "Our Team", href: "/team", type: "router" },
  ];

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');

@font-face {
  font-family: "Porto";
  src: url("/fonts/Porto-Regular.woff2") format("woff2");
}

@font-face {
  font-family: "Auriga";
  src: url("/fonts/Auriga-Regular.woff2") format("woff2");
}
        :root {
          --lime: #C8F400;
          --dark: #141312;
          --dark-mid: #1c1b19;
          --light: #F0EDE8;
          --muted: rgba(240,237,232,0.45);
          --nav-h: 72px;
          --radius: 12px;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
           font-family:'Porto', sans-serif;
          background: var(--dark);
          color: var(--light);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* ══ NAVBAR ══ */
        .navbar {
          position: fixed;
          inset: 0 0 auto 0;
          height: var(--nav-h);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 clamp(16px, 4vw, 48px);
          transition: background 0.4s, box-shadow 0.4s, border-color 0.4s;
          border-bottom: 1px solid transparent;
        }
        .navbar.scrolled {
          background: rgba(20,19,18,0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom-color: rgba(255,255,255,0.06);
          box-shadow: 0 4px 32px rgba(0,0,0,0.45);
        }
        .navbar-inner {
          width: 100%;
          max-width: 1280px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo { flex-shrink: 0; display: flex; align-items: center; text-decoration: none; }
        .nav-logo img { height: clamp(40px, 5vw, 54px); width: auto; display: block; }

        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: clamp(18px, 2.5vw, 36px);
          list-style: none;
        }
        .nav-links-desktop li a {
          color: rgba(240,237,232,0.7);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 400;
          letter-spacing: 0.4px;
          padding-bottom: 3px;
          position: relative;
          transition: color 0.25s;
        }
        .nav-links-desktop li a::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: var(--lime);
          transition: width 0.3s cubic-bezier(0.25,1,0.5,1);
        }
        .nav-links-desktop li a:hover { color: var(--light); }
        .nav-links-desktop li a:hover::after { width: 100%; }

        .nav-cta {
          background: var(--lime) !important;
          color: #111 !important;
          padding: 10px 20px !important;
          border-radius: var(--radius) !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          white-space: nowrap;
          overflow: hidden;
          position: relative;
          transition: transform 0.25s, box-shadow 0.25s !important;
        }
        .nav-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.2);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,244,0,0.3) !important; }
        .nav-cta:hover::before { opacity: 1; }
        .nav-cta::after { display: none !important; }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 44px; height: 44px;
          gap: 5px;
          cursor: pointer;
          background: none;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 0;
          transition: border-color 0.2s, background 0.2s;
          flex-shrink: 0;
        }
        .hamburger:hover { border-color: rgba(200,244,0,0.45); background: rgba(200,244,0,0.05); }
        .hamburger span {
          display: block;
          width: 20px; height: 1.5px;
          background: var(--light);
          border-radius: 2px;
          transition: transform 0.38s cubic-bezier(0.23,1,0.32,1), opacity 0.22s, background 0.22s;
        }
        .hamburger.open span { background: var(--lime); }
        .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* Mobile overlay */
        .mob-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0);
          z-index: 105;
          pointer-events: none;
          transition: background 0.35s;
        }
        .mob-overlay.open { background: rgba(0,0,0,0.65); pointer-events: auto; backdrop-filter: blur(4px); }

        /* Mobile drawer */
        .mob-drawer {
          display: none;
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: min(340px, 88vw);
          background: var(--dark-mid);
          z-index: 106;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.42s cubic-bezier(0.16,1,0.3,1);
          border-left: 1px solid rgba(255,255,255,0.07);
        }
        .mob-drawer.open { transform: translateX(0); }

        .mob-drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px;
          height: var(--nav-h);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .mob-drawer-body { flex: 1; overflow-y: auto; padding: 8px 0; }
        .mob-nav-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 15px 24px;
          color: rgba(240,237,232,0.75);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 400;
          letter-spacing: 0.2px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: color 0.2s, background 0.2s, padding-left 0.25s;
        }
        .mob-nav-link:last-child { border-bottom: none; }
        .mob-nav-link:hover { color: var(--light); background: rgba(200,244,0,0.04); padding-left: 30px; }
        .mob-nav-arrow {
          font-size: 0.8rem; color: var(--lime);
          opacity: 0; transform: translateX(-4px);
          transition: opacity 0.2s, transform 0.2s;
        }
        .mob-nav-link:hover .mob-nav-arrow { opacity: 1; transform: translateX(0); }
        .mob-drawer-footer {
          padding: 20px 20px 36px;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .mob-cta {
          display: flex; align-items: center; justify-content: center;
          width: 100%;
          background: var(--lime);
          color: #111;
          padding: 15px;
          border-radius: var(--radius);
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .mob-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(200,244,0,0.28); }

        /* Breakpoints */
        @media (max-width: 860px) {
          .nav-links-desktop li:nth-child(1),
          .nav-links-desktop li:nth-child(3) { display: none; }
        }
        @media (max-width: 600px) {
          .nav-links-desktop { display: none; }
          .hamburger { display: flex; }
          .mob-overlay { display: block; }
          .mob-drawer { display: flex; }
        }

        /* ══ HERO ══ */
        .hero {
          position: relative;
          min-height: 100svh;
          display: grid;
          place-items: center;
        }
        .hero-bg {
          position: absolute; inset: 0; overflow: hidden; z-index: 0;
        }
        .hero-bg video {
          width: 100%; height: 100%; object-fit: cover; transform: scale(1.04);
        }
        .hero-gradient {
          position: absolute; inset: 0; z-index: 1;
          background:
            linear-gradient(180deg, rgba(14,13,12,0.52) 0%, transparent 38%, rgba(14,13,12,0.72) 100%),
            linear-gradient(90deg, rgba(14,13,12,0.38) 0%, transparent 55%);
        }
        .hero-vignette {
          position: absolute; inset: 0; z-index: 2;
          background: radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.52) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 3;
          text-align: center;
          padding: clamp(60px, 10vw, 90px) clamp(16px, 4vw, 32px) clamp(50px, 8vw, 70px);
          max-width: 960px;
          width: 100%;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: var(--lime);
          font-size: clamp(0.68rem, 1.15vw, 0.76rem);
          font-weight: 500;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(10px);
          animation: fadeUp 0.7s ease forwards 0.1s;
        }

        .hero-eyebrow::before,
        .hero-eyebrow::after {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: var(--lime);
          opacity: 0.55;
        }

        .hero-title {
          font-family:'Auriga', serif;
          font-size: clamp(2.2rem,5vw,4.1rem);
          font-weight:700;
          letter-spacing:-0.25px;
          line-height:1.05;
          white-space: pre-line;
          margin: clamp(18px, 3vw, 26px) 0 clamp(12px, 2vw, 18px);
          color: var(--light);
          opacity: 0;
          transform: translateY(16px);
          animation: fadeUp 0.95s ease forwards 0.3s;
        }
        .hero-title em {
          color: var(--lime);
        }

        .hero-rule {
          width: 40px; height: 1px;
          background: linear-gradient(90deg, var(--lime), transparent);
          margin: 0 auto clamp(12px, 2vw, 18px);
          opacity: 0;
          animation: fadeIn 0.6s ease forwards 0.55s;
        }

        .hero-subtitle {
          font-family:'Porto', sans-serif;
          font-size:clamp(0.9rem,1.5vw,1.05rem);
          font-weight:600;
          color: white;
          letter-spacing: 0.3px;
          margin-bottom: 10px;
          opacity: 0;
          animation: fadeUp 0.7s ease forwards 0.55s;
        }

        .hero-desc {
          font-size: clamp(0.82rem, 1.4vw, 0.92rem);
          color: rgba(240,237,232,0.38);
          line-height: 1.75;
          max-width: 500px;
          margin: 0 auto clamp(32px, 5vw, 48px);
          opacity: 0;
          animation: fadeUp 0.7s ease forwards 0.7s;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(10px, 2vw, 18px);
          flex-wrap: wrap;
          opacity: 0;
          animation: fadeUp 0.7s ease forwards 0.85s;
        }

        .btn-lime {
          position: relative; overflow: hidden;
          display: inline-flex; align-items: center; gap: 9px;
          background: var(--lime);
          color: #111;
          padding: clamp(12px, 1.5vw, 14px) clamp(22px, 3vw, 30px);
          border-radius: var(--radius);
          font-family:'Auriga', serif;
          font-weight:600;
          font-size: clamp(0.83rem, 1.3vw, 0.92rem);
          text-decoration: none;
          letter-spacing: 0.2px;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .btn-lime::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(255,255,255,0.2);
          opacity: 0; transition: opacity 0.25s;
        }
        .btn-lime:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(200,244,0,0.3); }
        .btn-lime:hover::before { opacity: 1; }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 9px;
          border: 1px solid rgba(240,237,232,0.2);
          color: rgba(240,237,232,0.75);
          padding: clamp(11px, 1.4vw, 13px) clamp(22px, 3vw, 30px);
          border-radius: var(--radius);
          font-family:'Auriga', serif;
          font-weight:600;
          text-decoration: none;
          letter-spacing: 0.2px;
          transition: border-color 0.25s, color 0.25s, background 0.25s;
        }
        .btn-ghost:hover { border-color: rgba(200,244,0,0.45); color: var(--light); background: rgba(200,244,0,0.05); }

        /* Scroll hint */
        .hero-scroll {
          position: absolute;
          bottom: clamp(24px, 4vw, 36px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex; flex-direction: column; align-items: center; gap: 7px;
          opacity: 0;
          animation: fadeIn 1s ease forwards 1.4s;
        }
        .scroll-mouse {
          width: 22px; height: 34px;
          border: 1.5px solid rgba(240,237,232,0.22);
          border-radius: 12px;
          display: flex; justify-content: center;
          padding-top: 6px;
        }
        .scroll-mouse span {
          width: 2px; height: 6px;
          background: var(--lime);
          border-radius: 2px;
          animation: scrollDot 1.9s ease infinite;
        }
        .scroll-label {
          font-size: 0.58rem;
          letter-spacing: 2.5px;
          color: rgba(240,237,232,0.28);
          text-transform: uppercase;
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes scrollDot {
          0%  { transform: translateY(0); opacity: 1; }
          60% { transform: translateY(10px); opacity: 0; }
          61% { transform: translateY(0); opacity: 0; }
          100%{ opacity: 1; }
        }

        @media (max-width: 480px) {
          .hero-actions { flex-direction: column; align-items: stretch; }
          .btn-lime, .btn-ghost { justify-content: center; }
          .hero-scroll { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Mobile overlay */}
      <div className={`mob-overlay ${mobileMenuOpen ? "open" : ""}`} onClick={() => setMobileMenuOpen(false)} />

      {/* Mobile drawer */}
      <div className={`mob-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mob-drawer-header">
          <a href="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
            <img src="/logoImage.png" alt="S&D Media" />
          </a>
          <button className="hamburger open" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <span /><span /><span />
          </button>
        </div>

        <nav className="mob-drawer-body">
          {navLinks.map(({ label, href, type }) =>
            type === "router" ? (
              <Link key={label} to={href} className="mob-nav-link" onClick={() => setMobileMenuOpen(false)}>
                {label}<span className="mob-nav-arrow">›</span>
              </Link>
            ) : (
              <a key={label} href={href} className="mob-nav-link" onClick={() => setMobileMenuOpen(false)}>
                {label}<span className="mob-nav-arrow">›</span>
              </a>
            )
          )}
        </nav>

        <div className="mob-drawer-footer">
          <a href="#pricing" className="mob-cta" onClick={() => setMobileMenuOpen(false)}>
            Start a Project →
          </a>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner">
          <a href="/" className="nav-logo">
            <img src="/logoImage.png" alt="S&D Media" />
          </a>

          <ul className="nav-links-desktop">
            {navLinks.map(({ label, href, type }) => (
              <li key={label}>
                {type === "router"
                  ? <Link to={href}>{label}</Link>
                  : <a href={href}>{label}</a>}
              </li>
            ))}
          </ul>

          <button
            className={`hamburger ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section ref={sectionRef} id="home" className="hero">
        <div className="hero-bg">
          {!loading && (
            <video key={videoSrc} autoPlay muted loop playsInline preload="metadata">
              <source src={videoSrc} type="video/mp4" />
            </video>
          )}
        </div>
        <div className="hero-gradient" />
        <div className="hero-vignette" />

        <div className="hero-content">
          <span className="hero-eyebrow">Wedding Video Editing</span>
          <h1 className="hero-title">
            {heading.includes("Move") ? <>Wedding Films That Couples{"\n"} Remember.</> : heading}
          </h1>
          <div className="hero-rule" />
          <p className="hero-subtitle">{subtitle}</p>
          <div className="hero-actions">
            <a href="#pricing" className="btn-lime">View Pricing →</a>
            <a href="#portfolio" className="btn-ghost">Watch Portfolio</a>
          </div>
        </div>
      </section>
    </>
  );
}