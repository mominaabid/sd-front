import { useEffect, useRef, useState } from 'react';
import { Linkedin, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../constants/urls';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  picture: string;
  linkedin_url?: string;
}

interface BTSMedia {
  id: number;
  title: string;
  media_url: string;
  type: 'image' | 'video';
}

const fallbackMembers: TeamMember[] = [
  {
    id: 9991,
    name: 'Saad Ahmed',
    role: 'Lead Editor & Co-Founder',
    bio: 'With 8+ years of wedding filmmaking experience, Saad leads the creative vision at S&D Media. He specialises in cinematic storytelling and has edited over 500 wedding films.',
    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    linkedin_url: 'https://linkedin.com/in/saad-ahmed-example',
  },
  {
    id: 9992,
    name: 'Danish Malik',
    role: 'Senior Editor & Co-Founder',
    bio: 'Danish brings technical mastery to every project. His colour grading expertise gives S&D films their signature warm, timeless look that clients love.',
    picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    linkedin_url: 'https://linkedin.com/in/danish-malik-example',
  },
];

export function TeamPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  const [teamMembers, setTeamMembers]   = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam]   = useState(true);
  const [errorTeam, setErrorTeam]       = useState<string | null>(null);

  const [btsMedia, setBtsMedia]         = useState<BTSMedia[]>([]);
  const [loadingBTS, setLoadingBTS]     = useState(true);
  const [errorBTS, setErrorBTS]         = useState<string | null>(null);

  // Lightbox state — supports both image AND next/prev navigation
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxItems = [
    ...teamMembers.map(m => ({ src: m.picture, type: 'image' as const, label: m.name })),
    ...btsMedia.map(b => ({ src: b.media_url, type: b.type, label: b.title })),
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  // Selected team member for mobile detail panel
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const navLinks = [
    { label: 'Home',      href: '/#home',      type: 'anchor' },
    { label: 'Portfolio', href: '/#portfolio',  type: 'anchor' },
    { label: 'Pricing',   href: '/#pricing',    type: 'anchor' },
    { label: 'Our Team',  href: '/team',        type: 'router' },
  ];

  // ── Fetch team
  useEffect(() => {
    (async () => {
      setLoadingTeam(true);
      try {
        const res  = await fetch(`${API_BASE_URL}team/`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        setTeamMembers(json.data?.length ? json.data : fallbackMembers);
      } catch {
        setErrorTeam('Could not load team members.');
        setTeamMembers(fallbackMembers);
      } finally { setLoadingTeam(false); }
    })();
  }, []);

  // ── Fetch BTS
  useEffect(() => {
    (async () => {
      setLoadingBTS(true);
      try {
        const res  = await fetch(`${API_BASE_URL}behind-the-scenes/`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        setBtsMedia(json.data || []);
      } catch {
        setErrorBTS('Could not load behind-the-scenes media.');
        setBtsMedia([]);
      } finally { setLoadingBTS(false); }
    })();
  }, []);

  // ── Intersection observer for fade-up
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('tp-visible'); observer.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    pageRef.current?.querySelectorAll('.tp-fade').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [teamMembers, btsMedia]);

  // ── Keyboard handlers
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setLightboxIndex(null); setSelectedMember(null); }
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') setLightboxIndex(i => Math.min((i ?? 0) + 1, lightboxItems.length - 1));
      if (e.key === 'ArrowLeft')  setLightboxIndex(i => Math.max((i ?? 0) - 1, 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, lightboxItems.length]);

  // ── Body scroll lock
  useEffect(() => {
    document.body.style.overflow = (mobileMenuOpen || lightboxIndex !== null || selectedMember !== null) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen, lightboxIndex, selectedMember]);


  const openTeamLightbox = (member: TeamMember) => {
    const idx = lightboxItems.findIndex(x => x.src === (member.picture));
    setLightboxIndex(idx >= 0 ? idx : null);
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#222120] text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          STYLES
      ═══════════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --lime:     #C8F400;
          --dark:     #141312;
          --dark-mid: #1c1b19;
          --dark-sur: #232220;
          --light:    #F0EDE8;
          --muted:    rgba(240,237,232,0.5);
          --nav-h:    72px;
          --r:        12px;
        }

        body { font-family: 'Outfit', sans-serif; -webkit-font-smoothing: antialiased; }

        /* ── Scroll reveal ── */
        .tp-fade {
          opacity: 0;
          transform: translateY(40px);
          transition:
            opacity  1s cubic-bezier(0.16, 1, 0.3, 1),
            transform 1s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .tp-fade.tp-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ══════════════════════════
           NAVBAR
        ══════════════════════════ */
        .tp-nav {
          position: fixed;
          inset: 0 0 auto 0;
          height: var(--nav-h);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 clamp(16px, 4vw, 48px);
          background: rgba(20,19,18,0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 4px 32px rgba(0,0,0,0.45);
          transition: box-shadow 0.3s;
        }
        .tp-nav-inner {
          width: 100%; max-width: 1280px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .tp-logo { flex-shrink:0; display:flex; align-items:center; text-decoration:none; }
        .tp-logo img { height: clamp(38px,5vw,52px); width:auto; display:block; }

        .tp-nav-links {
          display: flex; align-items: center;
          gap: clamp(16px, 2.2vw, 34px);
          list-style: none; margin:0; padding:0;
        }
        .tp-nav-links li a {
          color: rgba(240,237,232,0.68);
          text-decoration: none;
          font-size: 0.875rem; font-weight:400; letter-spacing:0.4px;
          padding-bottom: 3px; position: relative;
          transition: color 0.25s;
        }
        .tp-nav-links li a::after {
          content:''; position:absolute; bottom:0; left:0;
          width:0; height:1px; background:var(--lime);
          transition: width 0.3s cubic-bezier(0.25,1,0.5,1);
        }
        .tp-nav-links li a:hover { color: var(--light); }
        .tp-nav-links li a:hover::after { width:100%; }

        .tp-nav-cta {
          background: var(--lime) !important; color: #111 !important;
          padding: 9px 20px !important; border-radius: var(--r) !important;
          font-weight:600 !important; font-size:0.85rem !important;
          white-space:nowrap; position:relative; overflow:hidden;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s !important;
          will-change: transform;
        }
        .tp-nav-cta::before {
          content:''; position:absolute; inset:0;
          background:rgba(255,255,255,0.2); opacity:0;
          transition: opacity 0.3s;
        }
        .tp-nav-cta:hover { transform:translateY(-3px) scale(1.02); box-shadow:0 10px 28px rgba(200,244,0,0.35)!important; }
        .tp-nav-cta:hover::before { opacity:1; }
        .tp-nav-cta::after { display:none!important; }

        /* hamburger */
        .tp-ham {
          display:none; flex-direction:column; justify-content:center; align-items:center;
          width:44px; height:44px; gap:5px; cursor:pointer;
          background:none; border:1px solid rgba(255,255,255,0.12);
          border-radius:10px; padding:0; flex-shrink:0;
          transition: border-color 0.2s, background 0.2s;
        }
        .tp-ham:hover { border-color:rgba(200,244,0,0.45); background:rgba(200,244,0,0.05); }
        .tp-ham span {
          display:block; width:20px; height:1.5px;
          background:var(--light); border-radius:2px;
          transition: transform 0.38s cubic-bezier(0.23,1,0.32,1), opacity 0.22s, background 0.22s;
        }
        .tp-ham.open span { background: var(--lime); }
        .tp-ham.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .tp-ham.open span:nth-child(2) { opacity:0; transform:scaleX(0); }
        .tp-ham.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* overlay */
        .tp-overlay {
          display:none; position:fixed; inset:0;
          background:rgba(0,0,0,0); z-index:205;
          pointer-events:none; transition:background 0.35s;
        }
        .tp-overlay.open { background:rgba(0,0,0,0.65); pointer-events:auto; backdrop-filter:blur(4px); }

        /* drawer */
        .tp-drawer {
          display:none; position:fixed;
          top:0; right:0; bottom:0; width:min(340px,88vw);
          background:var(--dark-mid); z-index:210;
          flex-direction:column;
          transform:translateX(100%);
          transition:transform 0.42s cubic-bezier(0.16,1,0.3,1);
          border-left:1px solid rgba(255,255,255,0.07);
        }
        .tp-drawer.open { transform:translateX(0); }
        .tp-drawer-hdr {
          display:flex; align-items:center; justify-content:space-between;
          padding:0 20px; height:var(--nav-h);
          border-bottom:1px solid rgba(255,255,255,0.06); flex-shrink:0;
        }
        .tp-drawer-body { flex:1; overflow-y:auto; padding:8px 0; }
        .tp-mob-link {
          display:flex; align-items:center; justify-content:space-between;
          padding:15px 24px; color:rgba(240,237,232,0.75);
          text-decoration:none; font-size:1rem; font-weight:400; letter-spacing:0.2px;
          border-bottom:1px solid rgba(255,255,255,0.04);
          transition:
            color       0.3s cubic-bezier(0.16, 1, 0.3, 1),
            background  0.3s cubic-bezier(0.16, 1, 0.3, 1),
            padding-left 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tp-mob-link:last-child { border-bottom:none; }
        .tp-mob-link:hover { color:var(--light); background:rgba(200,244,0,0.05); padding-left:32px; }
        .tp-mob-arr {
          font-size:0.8rem; color:var(--lime);
          opacity:0; transform:translateX(-6px);
          transition:
            opacity   0.3s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tp-mob-link:hover .tp-mob-arr { opacity:1; transform:translateX(0); }
        .tp-drawer-ftr { padding:20px 20px 36px; border-top:1px solid rgba(255,255,255,0.06); flex-shrink:0; }
        .tp-mob-cta {
          display:flex; align-items:center; justify-content:center; width:100%;
          background:var(--lime); color:#111; padding:15px; border-radius:var(--r);
          font-weight:600; font-size:0.95rem; text-decoration:none;
          transition:transform 0.2s, box-shadow 0.2s;
        }
        .tp-mob-cta:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(200,244,0,0.28); }

        @media (max-width: 860px) {
          .tp-nav-links li:nth-child(1),
          .tp-nav-links li:nth-child(3) { display:none; }
        }
        @media (max-width: 600px) {
          .tp-nav-links { display:none; }
          .tp-ham { display:flex; }
          .tp-overlay { display:block; }
          .tp-drawer { display:flex; }
        }

        /* ══════════════════════════
           PAGE HEADER
        ══════════════════════════ */
        .tp-header {
          background: #1a1815;
          border-bottom: 1px solid #3a3835;
          padding: clamp(100px,12vw,136px) clamp(16px,5vw,48px) clamp(40px,6vw,72px);
          text-align: center;
        }
        .tp-header-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          color: var(--lime); font-size: clamp(0.62rem,1.1vw,0.7rem);
          font-weight:500; letter-spacing:3.5px; text-transform:uppercase;
          margin-bottom: 16px;
        }
        .tp-header-eyebrow::before,.tp-header-eyebrow::after {
          content:''; display:block; width:28px; height:1px;
          background:var(--lime); opacity:0.55;
        }
        .tp-header h1 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.6rem, 7vw, 5rem);
          font-weight: 300; line-height: 1.08;
          margin-bottom: clamp(12px,2vw,20px);
          color: var(--light);
        }
        .tp-header h1 em { font-style:italic; color:var(--lime); }
        .tp-header p {
          color: rgba(240,237,232,0.55);
          font-size: clamp(0.9rem,1.8vw,1.1rem);
          max-width: 560px; margin:0 auto; line-height:1.7;
        }
        /* Stagger the three header elements */
        .tp-header .tp-fade:nth-child(1) { transition-delay: 0ms;   }
        .tp-header .tp-fade:nth-child(2) { transition-delay: 120ms; }
        .tp-header .tp-fade:nth-child(3) { transition-delay: 220ms; }

        /* ══════════════════════════
           TEAM GRID
        ══════════════════════════ */
        .tp-team-section {
          padding: clamp(40px,7vw,80px) clamp(16px,4vw,32px);
          max-width: 1280px; margin:0 auto;
        }

        .tp-team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr));
          gap: clamp(12px,2vw,24px);
        }

        /* Card */
        .tp-card {
          position: relative; border-radius: 14px; overflow:hidden;
          cursor: pointer; background: var(--dark-sur);
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
          transition:
            transform  0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform;
        }
        .tp-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.55); }
        .tp-card-img-wrap { position:relative; aspect-ratio:3/4; overflow:hidden; }
        .tp-card-img-wrap img {
          width:100%; height:100%; object-fit:cover;
          transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        .tp-card:hover .tp-card-img-wrap img { transform: scale(1.1); }

        /* Default label (always visible) */
        .tp-card-label {
          position:absolute; inset-x:0; bottom:0;
          padding: clamp(32px,5vw,48px) clamp(12px,3vw,18px) clamp(12px,2vw,16px);
          background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%);
          transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity;
        }
        .tp-card:hover .tp-card-label { opacity:0; }
        .tp-card-label h4 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem,2vw,1.2rem); font-weight:400; margin-bottom:4px;
        }
        .tp-card-label p { color:var(--lime); font-size:0.78rem; font-weight:500; }

        /* Hover overlay */
        .tp-card-overlay {
          position:absolute; inset:0;
          background: rgba(14,13,12,0.9);
          display:flex; flex-direction:column; justify-content:flex-end;
          padding: clamp(14px,3vw,20px);
          opacity:0;
          transform: translateY(12px);
          transition:
            opacity   0.45s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .tp-card:hover .tp-card-overlay { opacity:1; transform:translateY(0); }
        .tp-card-overlay h4 {
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(1rem,2vw,1.2rem); font-weight:400; margin-bottom:4px;
        }
        .tp-card-overlay .tp-role { color:var(--lime); font-size:0.78rem; margin-bottom:10px; }
        .tp-card-overlay .tp-bio {
          color:rgba(240,237,232,0.75); font-size:0.78rem; line-height:1.6;
          display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden;
          margin-bottom:10px;
        }
        .tp-card-overlay .tp-li-link {
          display:inline-flex; align-items:center; gap:6px;
          color:var(--lime); font-size:0.8rem; font-weight:500;
          text-decoration:none; transition:color 0.2s;
        }
        .tp-card-overlay .tp-li-link:hover { color:#fff; }

        /* Mobile: tap-to-reveal panel instead of hover overlay */
        .tp-member-panel {
          position:fixed; inset:0; z-index:300;
          display:flex; align-items:flex-end;
          background: rgba(0,0,0,0);
          backdrop-filter: blur(0px);
          animation: panelFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes panelFadeIn {
          to { background: rgba(0,0,0,0.72); backdrop-filter: blur(8px); }
        }
        .tp-member-panel-inner {
          width:100%; background:var(--dark-mid);
          border-radius:24px 24px 0 0;
          padding:28px 24px 44px;
          max-height:82vh; overflow-y:auto;
          transform: translateY(100%);
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.5);
        }
        @keyframes slideUp {
          to { transform: translateY(0); }
        }
        .tp-panel-close {
          position:absolute; top:16px; right:16px;
          width:36px; height:36px; border-radius:50%;
          background:rgba(255,255,255,0.1); border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          color:var(--light); transition:background 0.2s;
        }
        .tp-panel-close:hover { background:var(--lime); color:#111; }

        /* ══════════════════════════
           SECTION TITLE
        ══════════════════════════ */
        .tp-section-title {
          text-align:center;
          margin-bottom: clamp(24px,4vw,48px);
        }
        .tp-section-title h2 {
          font-family:'Cormorant Garamond',serif;
          font-size: clamp(1.8rem,4vw,3rem);
          font-weight:300; color:var(--light);
        }
        .tp-section-title h2 em { font-style:italic; color:var(--lime); }
        .tp-section-title .tp-rule {
          width:40px; height:1px; margin:12px auto 0;
          background:linear-gradient(90deg,var(--lime),transparent);
        }

        /* ══════════════════════════
           BTS SECTION
        ══════════════════════════ */
        .tp-bts-section {
          background:#1a1815;
          padding: clamp(40px,7vw,80px) clamp(16px,4vw,32px);
        }
        .tp-bts-inner { max-width:1280px; margin:0 auto; }

        .tp-bts-grid {
          display:grid;
          grid-template-columns: repeat(auto-fill, minmax(min(260px,100%), 1fr));
          gap: clamp(10px,2vw,20px);
        }

        .tp-bts-item {
          position:relative; border-radius:12px; overflow:hidden;
          cursor:pointer; background:var(--dark-sur);
          box-shadow:0 4px 16px rgba(0,0,0,0.3);
          transition:
            transform  0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform;
        }
        .tp-bts-item:hover { transform:translateY(-4px); box-shadow:0 14px 36px rgba(0,0,0,0.5); }
        .tp-bts-item img,
        .tp-bts-item video {
          width:100%;
          height: clamp(160px, 22vw, 240px);
          object-fit:cover;
          display:block;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        .tp-bts-item:hover img,
        .tp-bts-item:hover video { transform:scale(1.08); }
        .tp-bts-caption {
          position:absolute; inset-x:0; bottom:0;
          padding:28px 12px 12px;
          background:linear-gradient(to top, rgba(0,0,0,0.85), transparent);
        }
        .tp-bts-caption p { color:var(--lime); font-size:0.78rem; font-weight:500; }

        /* ══════════════════════════
           LIGHTBOX
        ══════════════════════════ */
        .tp-lightbox {
          position:fixed; inset:0; z-index:400;
          background: rgba(0,0,0,0);
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          padding: clamp(12px,3vw,24px);
          animation: lbFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes lbFadeIn {
          to { background: rgba(0,0,0,0.97); }
        }
        .tp-lb-media {
          max-width:min(900px,92vw);
          max-height:80svh;
          object-fit:contain;
          border-radius:12px;
          box-shadow:0 24px 64px rgba(0,0,0,0.8);
          opacity: 0;
          transform: scale(0.94) translateY(10px);
          animation: lbMediaIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
          will-change: opacity, transform;
        }
        @keyframes lbMediaIn {
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .tp-lb-caption {
          margin-top:14px;
          color:rgba(240,237,232,0.5);
          font-size:0.82rem; letter-spacing:0.3px; text-align:center;
          opacity: 0;
          animation: lbCaptionIn 0.4s ease forwards 0.3s;
        }
        @keyframes lbCaptionIn {
          to { opacity: 1; }
        }

        .tp-lb-close {
          position:absolute; top:clamp(12px,2vw,20px); right:clamp(12px,2vw,20px);
          width:44px; height:44px; border-radius:50%;
          background:rgba(255,255,255,0.08); border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          color:var(--light);
          transition: background 0.25s cubic-bezier(0.16,1,0.3,1), color 0.25s, transform 0.25s;
          z-index:10;
        }
        .tp-lb-close:hover { background:var(--lime); color:#111; transform: rotate(90deg) scale(1.1); }

        .tp-lb-nav {
          position:absolute; top:50%; transform:translateY(-50%);
          width:48px; height:48px; border-radius:50%;
          background:rgba(255,255,255,0.08); border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          color:var(--light);
          transition: background 0.25s cubic-bezier(0.16,1,0.3,1), color 0.25s, transform 0.25s, opacity 0.25s;
          will-change: transform;
        }
        .tp-lb-nav:hover { background:var(--lime); color:#111; }
        .tp-lb-prev:hover { transform: translateY(-50%) translateX(-3px); }
        .tp-lb-next:hover { transform: translateY(-50%) translateX(3px); }
        .tp-lb-nav:disabled { opacity:0.2; pointer-events:none; }
        .tp-lb-prev { left:clamp(8px,2vw,20px); }
        .tp-lb-next { right:clamp(8px,2vw,20px); }

        /* ══════════════════════════
           EMPTY / LOADING STATES
        ══════════════════════════ */
        .tp-state {
          text-align:center; padding:clamp(40px,8vw,80px) 16px;
          color:rgba(240,237,232,0.4);
          font-size:clamp(0.9rem,2vw,1.1rem);
        }
        .tp-state.error { color:#f87171; }

        /* ══════════════════════════
           REDUCED MOTION
        ══════════════════════════ */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration:0.01ms!important;
            transition-duration:0.01ms!important;
          }
        }
      `}</style>

      {/* ─── Mobile overlay ─── */}
      <div className={`tp-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)} />

      {/* ─── Mobile drawer ─── */}
      <div className={`tp-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="tp-drawer-hdr">
          <a href="/" className="tp-logo" onClick={() => setMobileMenuOpen(false)}>
            <img src="/logoImage.png" alt="S&D Media" />
          </a>
          <button className="tp-ham open" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <span /><span /><span />
          </button>
        </div>
        <nav className="tp-drawer-body">
          {navLinks.map(({ label, href, type }) =>
            type === 'router' ? (
              <Link key={label} to={href} className="tp-mob-link" onClick={() => setMobileMenuOpen(false)}>
                {label}<span className="tp-mob-arr">›</span>
              </Link>
            ) : (
              <a key={label} href={href} className="tp-mob-link" onClick={() => setMobileMenuOpen(false)}>
                {label}<span className="tp-mob-arr">›</span>
              </a>
            )
          )}
        </nav>
        <div className="tp-drawer-ftr">
          <a href="/#pricing" className="tp-mob-cta" onClick={() => setMobileMenuOpen(false)}>
            Start a Project →
          </a>
        </div>
      </div>

      {/* ─── Navbar ─── */}
      <nav className="tp-nav">
        <div className="tp-nav-inner">
          <a href="/" className="tp-logo">
            <img src="/logoImage.png" alt="S&D Media" />
          </a>
          <ul className="tp-nav-links">
            {navLinks.map(({ label, href, type }) => (
              <li key={label}>
                {type === 'router' ? <Link to={href}>{label}</Link> : <a href={href}>{label}</a>}
              </li>
            ))}
            <li><a href="/#pricing" className="tp-nav-cta">Start a Project</a></li>
          </ul>
          <button
            className={`tp-ham ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ─── Page Header ─── */}
      <div className="tp-header">
        <p className="tp-fade tp-header-eyebrow">The Editors Behind the Magic</p>
        <h1 className="tp-fade">Meet Our <em>Team</em></h1>
        <p className="tp-fade">
          Specialists who live and breathe wedding storytelling — no freelancers, no compromises.
        </p>
      </div>

      {/* ─── Team Grid ─── */}
      <div className="tp-team-section">
        {loadingTeam ? (
          <div className="tp-state">Loading team members…</div>
        ) : errorTeam ? (
          <div className="tp-state error">{errorTeam}</div>
        ) : (
          <div className="tp-team-grid">
            {teamMembers.map((member, i) => (
              <div
                key={member.id}
                className="tp-fade tp-card"
                style={{ transitionDelay: `${i * 70}ms` }}
                onClick={() => {
                  // On touch devices open bottom panel; on desktop rely on CSS hover
                  if (window.matchMedia('(hover: none)').matches) {
                    setSelectedMember(member);
                  } else {
                    openTeamLightbox(member);
                  }
                }}
              >
                <div className="tp-card-img-wrap">
                  <img src={member.picture} alt={member.name} loading="lazy" />
                </div>

                {/* Default label */}
                <div className="tp-card-label">
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                </div>

                {/* Hover overlay (desktop) */}
                <div className="tp-card-overlay">
                  <h4>{member.name}</h4>
                  <p className="tp-role">{member.role}</p>
                  <p className="tp-bio">{member.bio}</p>
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tp-li-link"
                      onClick={e => e.stopPropagation()}
                    >
                      <Linkedin size={15} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── BTS Section ─── */}
      <div className="tp-bts-section">
        <div className="tp-bts-inner">
          <div className="tp-fade tp-section-title">
            <h2>Behind-the-<em>Scenes</em></h2>
            <div className="tp-rule" />
          </div>

          {loadingBTS ? (
            <div className="tp-state">Loading media…</div>
          ) : errorBTS ? (
            <div className="tp-state error">{errorBTS}</div>
          ) : btsMedia.length === 0 ? (
            <div className="tp-state">No behind-the-scenes content yet.</div>
          ) : (
            <div className="tp-bts-grid">
              {btsMedia.map((item, i) => {
                const lbIdx = lightboxItems.findIndex(x => x.src === item.media_url);
                return (
                  <div
                    key={item.id}
                    className="tp-fade tp-bts-item"
                    style={{ transitionDelay: `${i * 50}ms` }}
                    onClick={() => setLightboxIndex(lbIdx >= 0 ? lbIdx : null)}
                  >
                    {item.type === 'image' ? (
                      <img src={item.media_url} alt={item.title} loading="lazy" />
                    ) : (
                      <video src={item.media_url} muted playsInline preload="metadata" />
                    )}
                    <div className="tp-bts-caption"><p>{item.title}</p></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── Mobile member detail panel ─── */}
      {selectedMember && (
        <div className="tp-member-panel" onClick={() => setSelectedMember(null)}>
          <div className="tp-member-panel-inner" onClick={e => e.stopPropagation()}>
            <button className="tp-panel-close" onClick={() => setSelectedMember(null)} aria-label="Close">
              <X size={18} />
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
              <img
                src={selectedMember.picture}
                alt={selectedMember.name}
                style={{ width:64, height:64, borderRadius:'50%', objectFit:'cover', flexShrink:0 }}
              />
              <div>
                <h4 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.15rem', marginBottom:2 }}>
                  {selectedMember.name}
                </h4>
                <p style={{ color:'var(--lime)', fontSize:'0.8rem' }}>{selectedMember.role}</p>
              </div>
            </div>
            <p style={{ color:'rgba(240,237,232,0.7)', fontSize:'0.88rem', lineHeight:1.7, marginBottom:16 }}>
              {selectedMember.bio}
            </p>
            {selectedMember.linkedin_url && (
              <a
                href={selectedMember.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display:'inline-flex', alignItems:'center', gap:8, color:'var(--lime)', fontSize:'0.88rem', fontWeight:600, textDecoration:'none' }}
              >
                <Linkedin size={16} /> View LinkedIn
              </a>
            )}
          </div>
        </div>
      )}

      {/* ─── Lightbox ─── */}
      {lightboxIndex !== null && lightboxItems[lightboxIndex] && (
        <div className="tp-lightbox" onClick={() => setLightboxIndex(null)}>
          <button className="tp-lb-close" onClick={() => setLightboxIndex(null)} aria-label="Close">
            <X size={20} />
          </button>

          <button
            className="tp-lb-nav tp-lb-prev"
            disabled={lightboxIndex === 0}
            onClick={e => { e.stopPropagation(); setLightboxIndex(i => Math.max(0, (i ?? 1) - 1)); }}
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          {lightboxItems[lightboxIndex].type === 'image' ? (
            <img
              src={lightboxItems[lightboxIndex].src}
              alt={lightboxItems[lightboxIndex].label}
              className="tp-lb-media"
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <video
              src={lightboxItems[lightboxIndex].src}
              className="tp-lb-media"
              controls
              autoPlay
              onClick={e => e.stopPropagation()}
            />
          )}

          <p className="tp-lb-caption">{lightboxItems[lightboxIndex].label}</p>

          <button
            className="tp-lb-nav tp-lb-next"
            disabled={lightboxIndex === lightboxItems.length - 1}
            onClick={e => { e.stopPropagation(); setLightboxIndex(i => Math.min(lightboxItems.length - 1, (i ?? 0) + 1)); }}
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}