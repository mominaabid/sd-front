import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { builtForConfig } from '../config';

export function MadeForPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home',      href: '/#home',      type: 'anchor' },
    { label: 'Portfolio', href: '/#portfolio',  type: 'anchor' },
    { label: 'Pricing',   href: '/#pricing',    type: 'anchor' },
    { label: 'Our Team',  href: '/team',        type: 'router' },
    { label: 'Made For',  href: '/made-for',    type: 'router' },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    const els = Array.from(pageRef.current?.querySelectorAll('.mf-fade') ?? []);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          requestAnimationFrame(() => {
            setTimeout(() => target.classList.add('mf-visible'), 16);
          });
          observer.unobserve(target);
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -32px 0px' }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#222120] text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Aboreto&family=League+Spartan:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --lime:     #C8F400;
          --dark:     #141312;
          --dark-mid: #1c1b19;
          --dark-sur: #232220;
          --light:    #F0EDE8;
          --nav-h:    72px;
          --r:        12px;
          --section-px: clamp(16px, 4vw, 32px);
          --section-max: 1280px;
        }

        body { font-family: 'Outfit', sans-serif; -webkit-font-smoothing: antialiased; }

        .mf-fade {
          opacity: 0;
          transform: translateY(24px) translateZ(0);
          transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
          backface-visibility: hidden;
        }
        .mf-fade.mf-visible { opacity: 1; transform: translateY(0) translateZ(0); }

        /* ── NAVBAR ── */
        .mf-nav {
          position: fixed; inset: 0 0 auto 0; height: var(--nav-h); z-index: 200;
          display: flex; align-items: center; justify-content: center;
          padding: 0 clamp(16px, 4vw, 48px);
          background: rgba(20,19,18,0.94);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 4px 32px rgba(0,0,0,0.45);
        }
        .mf-nav-inner { width: 100%; max-width: 1280px; display: flex; align-items: center; justify-content: space-between; }
        .mf-logo { flex-shrink:0; display:flex; align-items:center; text-decoration:none; }
        .mf-logo img { height: clamp(38px,5vw,52px); width:auto; display:block; }
        .mf-nav-links { display: flex; align-items: center; gap: clamp(16px, 2.2vw, 34px); list-style: none; margin:0; padding:0; }
        .mf-nav-links li a {
          color: rgba(240,237,232,0.68); text-decoration: none;
          font-size: 0.875rem; font-weight:400; letter-spacing:0.4px;
          padding-bottom: 3px; position: relative; transition: color 0.25s;
        }
        .mf-nav-links li a::after {
          content:''; position:absolute; bottom:0; left:0;
          width:0; height:1px; background:var(--lime);
          transition: width 0.3s cubic-bezier(0.25,1,0.5,1);
        }
        .mf-nav-links li a:hover { color: var(--light); }
        .mf-nav-links li a:hover::after { width:100%; }

        /* Hamburger */
        .mf-ham {
          display:none; flex-direction:column; justify-content:center; align-items:center;
          width:44px; height:44px; gap:5px; cursor:pointer;
          background:none; border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:0; flex-shrink:0;
          transition: border-color 0.2s, background 0.2s;
        }
        .mf-ham:hover { border-color:rgba(200,244,0,0.45); background:rgba(200,244,0,0.05); }
        .mf-ham span { display:block; width:20px; height:1.5px; background:var(--light); border-radius:2px; transition: transform 0.38s cubic-bezier(0.23,1,0.32,1), opacity 0.22s; }
        .mf-ham.open span { background: var(--lime); }
        .mf-ham.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .mf-ham.open span:nth-child(2) { opacity:0; transform:scaleX(0); }
        .mf-ham.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        .mf-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0); z-index:205; pointer-events:none; transition:background 0.35s; }
        .mf-overlay.open { background:rgba(0,0,0,0.65); pointer-events:auto; backdrop-filter:blur(4px); }

        .mf-drawer {
          display:none; position:fixed; top:0; right:0; bottom:0; width:min(340px,88vw);
          background:var(--dark-mid); z-index:210; flex-direction:column;
          transform:translateX(100%); transition:transform 0.42s cubic-bezier(0.16,1,0.3,1);
          border-left:1px solid rgba(255,255,255,0.07);
        }
        .mf-drawer.open { transform:translateX(0); }
        .mf-drawer-hdr { display:flex; align-items:center; justify-content:space-between; padding:0 20px; height:var(--nav-h); border-bottom:1px solid rgba(255,255,255,0.06); flex-shrink:0; }
        .mf-drawer-body { flex:1; overflow-y:auto; padding:8px 0; }
        .mf-mob-link { display:flex; align-items:center; justify-content:space-between; padding:15px 24px; color:rgba(240,237,232,0.75); text-decoration:none; font-size:1rem; font-weight:400; border-bottom:1px solid rgba(255,255,255,0.04); transition: color 0.3s, background 0.3s, padding-left 0.35s; }
        .mf-mob-link:last-child { border-bottom:none; }
        .mf-mob-link:hover { color:var(--light); background:rgba(200,244,0,0.05); padding-left:32px; }
        .mf-mob-arr { font-size:0.8rem; color:var(--lime); opacity:0; transform:translateX(-6px); transition: opacity 0.3s, transform 0.35s; }
        .mf-mob-link:hover .mf-mob-arr { opacity:1; transform:translateX(0); }
        .mf-drawer-ftr { padding:20px 20px 36px; border-top:1px solid rgba(255,255,255,0.06); flex-shrink:0; }
        .mf-mob-cta {
          display:flex; align-items:center; justify-content:center; width:100%;
          background:var(--lime); color:#111; padding:15px; border-radius:var(--r);
          font-family: 'League Spartan', sans-serif; font-weight:600; font-size:0.9rem;
          letter-spacing: 0.08em; text-transform: uppercase;
          text-decoration:none; transition:transform 0.2s, box-shadow 0.2s;
        }
        .mf-mob-cta:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(200,244,0,0.28); }

        @media (max-width: 860px) { .mf-nav-links li:nth-child(1), .mf-nav-links li:nth-child(3) { display:none; } }
        @media (max-width: 600px) { .mf-nav-links { display:none; } .mf-ham { display:flex; } .mf-overlay { display:block; } .mf-drawer { display:flex; } }

        /* ── PAGE HEADER ── */
        .mf-header {
          background: #1a1815; border-bottom: 1px solid #3a3835;
          padding: calc(var(--nav-h) + clamp(32px,5vw,56px)) clamp(16px,5vw,48px) clamp(40px,6vw,72px);
          text-align: center;
        }
        .mf-header-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          color: var(--lime); font-size: clamp(0.62rem,1.1vw,0.7rem);
          font-weight:500; letter-spacing:3.5px; text-transform:uppercase; margin-bottom: 16px;
        }
        .mf-header-eyebrow::before,.mf-header-eyebrow::after { content:''; display:block; width:28px; height:1px; background:var(--lime); opacity:0.55; }

        /* REDUCED: was clamp(2.6rem, 7vw, 5rem) */
        .mf-header h1 {
          font-family: 'Aboreto', cursive;
          font-size: clamp(1.5rem, 3.5vw, 2.6rem);
          font-weight: 300; line-height: 1.15;
          margin-bottom: clamp(12px,2vw,20px);
          color: var(--light); letter-spacing: 0.02em;
        }
        .mf-header h1 em {
          font-family: 'Aboreto', cursive;
          font-style: normal; font-weight: 300;
          color: var(--lime); text-transform: uppercase; letter-spacing: 0.12em;
        }
        .mf-header p { color: rgba(240,237,232,0.55); font-size: clamp(0.85rem,1.5vw,1rem); max-width: 520px; margin:0 auto; line-height:1.7; }

        /* ── CONTENT ── */
        .mf-content-wrap { max-width: var(--section-max); margin: 0 auto; padding-left: var(--section-px); padding-right: var(--section-px); }
        .mf-section { padding-top: clamp(48px,8vw,96px); padding-bottom: clamp(48px,8vw,96px); }

        /* ── FEATURE CARDS — exactly 2 per row ── */
        .mf-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(16px,2vw,28px);
        }
        @media (max-width: 580px) {
          .mf-grid { grid-template-columns: 1fr; }
        }

        .mf-card {
          background: #1e1d1b;
          border: 1px solid #4A4845;
          border-radius: 14px;
          padding: clamp(24px,4vw,36px);
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
          will-change: transform;
        }
        .mf-card:hover {
          border-color: rgba(200,244,0,0.35);
          box-shadow: 0 0 0 1px rgba(200,244,0,0.12), 0 16px 40px rgba(0,0,0,0.4);
          transform: translateY(-4px);
        }
        .mf-card-icon { margin-bottom: 20px; }

        /* ALL icons rendered bright — no dull appearance */
        .mf-card-icon img {
          width: 36px; height: 36px;
          object-fit: contain;
          filter: brightness(1.3) saturate(1.2);
          transition: filter 0.3s;
        }
        /* Reliability icon is grey/white — recolor it to lime green like the others */
        .mf-card-icon img[src*="Reliable"] {
          filter: brightness(0) saturate(100%) invert(89%) sepia(61%) saturate(700%) hue-rotate(28deg) brightness(1.05);
        }
        .mf-card-icon svg {
          width: 36px; height: 36px;
          transition: filter 0.3s;
        }
        .mf-card:hover .mf-card-icon img {
          filter: brightness(1.5) saturate(1.3) drop-shadow(0 0 8px rgba(205,255,0,0.55));
        }
        .mf-card:hover .mf-card-icon img[src*="Reliable"] {
          filter: brightness(0) saturate(100%) invert(89%) sepia(61%) saturate(700%) hue-rotate(28deg) brightness(1.2) drop-shadow(0 0 8px rgba(205,255,0,0.6));
        }
        .mf-card:hover .mf-card-icon svg {
          filter: drop-shadow(0 0 8px rgba(205,255,0,0.55));
        }

        .mf-card h3 {
          font-family: 'Aboreto', cursive;
          font-size: clamp(1rem,2vw,1.2rem);
          font-weight: 400; letter-spacing: 0.04em;
          color: var(--light); margin-bottom: 12px;
        }
        .mf-card p {
          color: rgba(240,237,232,0.65);
          font-size: clamp(0.88rem,1.5vw,0.95rem);
          line-height: 1.75;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration:0.01ms!important; transition-duration:0.01ms!important; }
        }
      `}</style>

      {/* Mobile overlay */}
      <div className={`mf-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)} />

      {/* Mobile drawer */}
      <div className={`mf-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mf-drawer-hdr">
          <a href="/" className="mf-logo" onClick={() => setMobileMenuOpen(false)}>
            <img src="/logoImage.png" alt="S&D Media" />
          </a>
          <button className="mf-ham open" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <span /><span /><span />
          </button>
        </div>
        <nav className="mf-drawer-body">
          {navLinks.map(({ label, href, type }) =>
            type === 'router' ? (
              <Link key={label} to={href} className="mf-mob-link" onClick={() => setMobileMenuOpen(false)}>
                {label}<span className="mf-mob-arr">›</span>
              </Link>
            ) : (
              <a key={label} href={href} className="mf-mob-link" onClick={() => setMobileMenuOpen(false)}>
                {label}<span className="mf-mob-arr">›</span>
              </a>
            )
          )}
        </nav>
        <div className="mf-drawer-ftr">
          <a href="/#pricing" className="mf-mob-cta" onClick={() => setMobileMenuOpen(false)}>
            Start a Project →
          </a>
        </div>
      </div>

      {/* Navbar */}
      <nav className="mf-nav">
        <div className="mf-nav-inner">
          <a href="/" className="mf-logo">
            <img src="/logoImage.png" alt="S&D Media" />
          </a>
          <ul className="mf-nav-links">
            {navLinks.map(({ label, href, type }) => (
              <li key={label}>
                {type === 'router' ? <Link to={href}>{label}</Link> : <a href={href}>{label}</a>}
              </li>
            ))}
          </ul>
          <button
            className={`mf-ham ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Page Header */}
      <div className="mf-header">
        <p className="mf-fade mf-header-eyebrow">Crafted for the professionals who care</p>
        <h1 className="mf-fade">Built Specifically for <em>Wedding Videographers</em></h1>
        <p className="mf-fade">{builtForConfig.subtitle}</p>
      </div>

      {/* Features Grid */}
      <div className="mf-section">
        <div className="mf-content-wrap">
          <div className="mf-grid">
            {builtForConfig.features.map((feature, index) => (
              <div
                key={feature.title}
                className="mf-fade mf-card"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="mf-card-icon">
                  {feature.logo ? (
                    <img src={feature.logo} alt={feature.title} />
                  ) : (
                    <Sparkles className="text-[#CDFF00]" />
                  )}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}