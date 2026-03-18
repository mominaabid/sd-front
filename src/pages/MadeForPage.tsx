import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
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
          requestAnimationFrame(() => setTimeout(() => target.classList.add('mf-visible'), 16));
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
    <div ref={pageRef} className="min-h-screen bg-[#141312] text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Aboreto&family=League+Spartan:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --lime:     #C8F400;
          --dark:     #141312;
          --dark-mid: #1c1b19;
          --dark-sur: #1e1d1b;
          --light:    #F0EDE8;
          --muted:    rgba(240,237,232,0.45);
          --nav-h:    72px;
          --r:        12px;
          --px:       clamp(20px, 5vw, 80px);
          --max:      1200px;
        }

        /* ── FADE ANIMATION ── */
        .mf-fade {
          opacity: 0; transform: translateY(28px) translateZ(0);
          transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform; backface-visibility: hidden;
        }
        .mf-fade.mf-visible { opacity: 1; transform: translateY(0) translateZ(0); }

        /* ── NAVBAR ── */
        .mf-nav {
          position: fixed; inset: 0 0 auto 0; height: var(--nav-h); z-index: 200;
          display: flex; align-items: center; justify-content: center;
          padding: 0 var(--px);
          background: rgba(20,19,18,0.92);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 4px 40px rgba(0,0,0,0.5);
        }
        .mf-nav-inner { width: 100%; max-width: var(--max); display: flex; align-items: center; justify-content: space-between; }
        .mf-logo { flex-shrink:0; display:flex; align-items:center; text-decoration:none; }
        .mf-logo img { height: clamp(38px,5vw,52px); width:auto; display:block; }
        .mf-nav-links { display: flex; align-items: center; gap: clamp(16px, 2.2vw, 36px); list-style: none; margin:0; padding:0; }
        .mf-nav-links li a {
          color: rgba(240,237,232,0.6); text-decoration: none;
          font-family: 'League Spartan', sans-serif;
          font-size: 0.82rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
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
        .mf-overlay.open { background:rgba(0,0,0,0.7); pointer-events:auto; backdrop-filter:blur(6px); }
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
          font-family: 'League Spartan', sans-serif; font-weight:700; font-size:0.85rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration:none; transition:transform 0.2s, box-shadow 0.2s;
        }
        .mf-mob-cta:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(200,244,0,0.28); }

        @media (max-width: 860px) { .mf-nav-links li:nth-child(1), .mf-nav-links li:nth-child(3) { display:none; } }
        @media (max-width: 600px) { .mf-nav-links { display:none; } .mf-ham { display:flex; } .mf-overlay { display:block; } .mf-drawer { display:flex; } }

        /* ── HERO HEADER ── */
        .mf-hero {
          position: relative;
          min-height: 70vh;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: calc(var(--nav-h) + clamp(60px,10vw,120px)) var(--px) clamp(60px,8vw,100px);
          overflow: hidden;
        }

        /* grain overlay */
        .mf-hero::before {
          content: '';
          position: absolute; inset: 0; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          pointer-events: none;
        }

        /* radial lime glow top-right */
        .mf-hero::after {
          content: '';
          position: absolute; z-index: 0;
          top: -20%; right: -10%;
          width: 70vw; height: 70vw;
          background: radial-gradient(ellipse at center, rgba(200,244,0,0.07) 0%, transparent 65%);
          pointer-events: none;
        }

        .mf-hero-inner {
          position: relative; z-index: 1;
          max-width: var(--max);
          width: 100%;
          margin: 0 auto;
        }

        .mf-hero-tag {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'League Spartan', sans-serif;
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--lime);
          margin-bottom: clamp(20px, 3vw, 32px);
        }
        .mf-hero-tag::before {
          content: ''; display: block;
          width: 32px; height: 1px; background: var(--lime); opacity: 0.6;
        }

        .mf-hero h1 {
          font-family: 'Aboreto', cursive;
          font-size: clamp(1.8rem, 4.5vw, 3.8rem);
          font-weight: 400;
          line-height: 1.05;
          letter-spacing: 0.02em;
          color: var(--light);
          margin: 0 0 clamp(20px, 3vw, 32px);
        }
        .mf-hero h1 .accent {
          color: var(--lime);
          font-family: 'Aboreto', cursive;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: block;
        }

        .mf-hero-sub {
          font-family: 'League Spartan', sans-serif;
          font-size: clamp(0.9rem, 1.6vw, 1.1rem);
          font-weight: 400;
          color: rgba(240,237,232,0.5);
          letter-spacing: 0.04em;
          max-width: 520px;
          line-height: 1.8;
        }

        /* horizontal rule below hero */
        .mf-divider {
          width: 100%; height: 1px;
          background: linear-gradient(90deg, rgba(200,244,0,0.4) 0%, rgba(200,244,0,0.08) 40%, transparent 100%);
        }

        /* ── FEATURES SECTION ── */
        .mf-features {
          padding: clamp(60px,10vw,120px) var(--px);
          max-width: var(--max);
          margin: 0 auto;
        }

        .mf-features-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: clamp(48px, 7vw, 80px);
          flex-wrap: wrap;
        }

        .mf-features-header h2 {
          font-family: 'League Spartan', sans-serif;
          font-size: clamp(0.72rem, 1.1vw, 0.8rem);
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240,237,232,0.35);
          margin: 0;
        }

        .mf-features-count {
          font-family: 'Aboreto', cursive;
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 400;
          color: rgba(200,244,0,0.12);
          letter-spacing: -0.02em;
          line-height: 1;
          user-select: none;
        }

        /* ── FEATURE CARD — editorial row layout ── */
        .mf-card-list { display: flex; flex-direction: column; gap: 0; }

        .mf-card {
          display: grid;
          grid-template-columns: 80px 1fr auto;
          align-items: start;
          gap: clamp(20px, 4vw, 48px);
          padding: clamp(28px, 4vw, 44px) 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          cursor: default;
          transition: background 0.3s;
          position: relative;
          overflow: hidden;
        }

        .mf-card::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 0;
          background: linear-gradient(90deg, rgba(200,244,0,0.04), transparent);
          transition: width 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .mf-card:hover::before { width: 100%; }

        .mf-card:first-child { border-top: 1px solid rgba(255,255,255,0.06); }

        .mf-card-num {
          font-family: 'Aboreto', cursive;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 400;
          color: rgba(200,244,0,0.18);
          letter-spacing: -0.02em;
          line-height: 1;
          transition: color 0.4s;
          flex-shrink: 0;
          padding-top: 4px;
        }
        .mf-card:hover .mf-card-num { color: rgba(200,244,0,0.55); }

        .mf-card-body { min-width: 0; }

        .mf-card-title {
          font-family: 'Aboreto', cursive;
          font-size: clamp(1.1rem, 2.2vw, 1.5rem);
          font-weight: 400;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--light);
          margin: 0 0 12px;
          line-height: 1.2;
          transition: color 0.3s;
        }
        .mf-card:hover .mf-card-title { color: #fff; }

        .mf-card-desc {
          font-family: 'League Spartan', sans-serif;
          font-size: clamp(0.88rem, 1.5vw, 0.98rem);
          font-weight: 400;
          color: rgba(240,237,232,0.48);
          line-height: 1.8;
          max-width: 580px;
          transition: color 0.3s;
        }
        .mf-card:hover .mf-card-desc { color: rgba(240,237,232,0.7); }

        .mf-card-icon-wrap {
          width: clamp(48px, 5vw, 64px);
          height: clamp(48px, 5vw, 64px);
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.4s, background 0.4s, box-shadow 0.4s;
        }
        .mf-card:hover .mf-card-icon-wrap {
          border-color: rgba(200,244,0,0.3);
          background: rgba(200,244,0,0.06);
          box-shadow: 0 0 24px rgba(200,244,0,0.12);
        }
        .mf-card-icon-wrap img,
        .mf-card-icon-wrap svg {
          width: clamp(22px, 2.5vw, 28px);
          height: clamp(22px, 2.5vw, 28px);
          object-fit: contain;
          transition: filter 0.4s, transform 0.4s;
        }
        .mf-card:hover .mf-card-icon-wrap img,
        .mf-card:hover .mf-card-icon-wrap svg {
          filter: drop-shadow(0 0 6px rgba(200,244,0,0.6));
          transform: scale(1.1);
        }

        /* ── CTA STRIP ── */
        .mf-cta-strip {
          margin: 0 var(--px) clamp(60px,10vw,120px);
          padding: clamp(36px,5vw,56px) clamp(28px,5vw,56px);
          background: linear-gradient(135deg, rgba(200,244,0,0.08) 0%, rgba(200,244,0,0.03) 50%, transparent 100%);
          border: 1px solid rgba(200,244,0,0.15);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; flex-wrap: wrap;
          max-width: var(--max);
          margin-left: auto; margin-right: auto;
          position: relative; overflow: hidden;
        }
        .mf-cta-strip::before {
          content: '';
          position: absolute; top: -50%; right: -10%;
          width: 40%; padding-bottom: 40%;
          background: radial-gradient(circle, rgba(200,244,0,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .mf-cta-strip-text h3 {
          font-family: 'Aboreto', cursive;
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          font-weight: 400; letter-spacing: 0.04em;
          color: var(--light); margin: 0 0 8px;
        }
        .mf-cta-strip-text p {
          font-family: 'League Spartan', sans-serif;
          font-size: clamp(0.85rem, 1.4vw, 0.95rem);
          color: rgba(240,237,232,0.45);
          margin: 0;
        }
        .mf-cta-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--lime); color: #111;
          padding: 14px 28px;
          border-radius: var(--r);
          font-family: 'League Spartan', sans-serif;
          font-weight: 700; font-size: 0.85rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; white-space: nowrap;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
          flex-shrink: 0;
        }
        .mf-cta-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 12px 32px rgba(200,244,0,0.3); }

        /* ── RESPONSIVE ── */
        @media (max-width: 640px) {
          .mf-card { grid-template-columns: 48px 1fr; }
          .mf-card-icon-wrap { display: none; }
          .mf-hero h1 { font-size: clamp(1.5rem, 7vw, 2.2rem); }
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

      {/* ── HERO ── */}
      <header className="mf-hero">
        <div className="mf-hero-inner">
          <p className="mf-fade mf-hero-tag">Built with purpose</p>
          <h1 className="mf-fade" style={{ transitionDelay: '80ms' }}>
            Made For
            <span className="accent">Wedding Videographers</span>
          </h1>
          <p className="mf-fade mf-hero-sub" style={{ transitionDelay: '160ms' }}>
            {builtForConfig.subtitle}
          </p>
        </div>
      </header>

      <div className="mf-divider" />

      {/* ── FEATURES ── */}
      <section className="mf-features">
        <div className="mf-fade mf-features-header">
          <h2>What we solve for you</h2>
          <span className="mf-features-count">0{builtForConfig.features.length}</span>
        </div>

        <div className="mf-card-list">
          {builtForConfig.features.map((feature, index) => (
            <div key={feature.title} className="mf-fade mf-card" style={{ transitionDelay: `${index * 90}ms` }}>

              {/* Number */}
              <span className="mf-card-num">
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Body */}
              <div className="mf-card-body">
                <h3 className="mf-card-title">{feature.title}</h3>
                <p className="mf-card-desc">{feature.description}</p>
              </div>

              {/* Icon */}
              <div className="mf-card-icon-wrap">
                {feature.logo ? (
                  <img src={feature.logo} alt={feature.title} />
                ) : (
                  <Sparkles style={{ color: 'var(--lime)', width: 24, height: 24 }} />
                )}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <div className="mf-fade" style={{ padding: '0 var(--px)', maxWidth: 'calc(var(--max) + var(--px) * 2)', margin: '0 auto clamp(60px,10vw,120px)' }}>
        <div className="mf-cta-strip">
          <div className="mf-cta-strip-text">
            <h3>Ready to scale your business?</h3>
            <p>Let us handle post-production while you focus on filming more weddings.</p>
          </div>
          <a href="/#pricing" className="mf-cta-btn">
            View Pricing <ArrowRight size={16} />
          </a>
        </div>
      </div>

    </div>
  );
}