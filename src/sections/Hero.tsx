
import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../constants/urls';

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
        throw new Error(`HTTP ${response.status}`);
      }

      const json: HeroApiResponse = await response.json();

      if (!json.success || !json.data) {
        throw new Error("Invalid API response");
      }

      setHeroData(json.data);
    } catch (err) {
      console.error("Hero fetch failed:", err);
      setHeroData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isReady) fetchHero();
  }, [isReady, fetchHero]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const videoSrc =
    heroData?.background_video_file ||
    heroData?.background_video_url ||
    "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-in-a-romantic-sunset-scene-34374-large.mp4";

  const posterSrc =
    heroData?.background_video_file || heroData?.background_video_url
      ? undefined
      : "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --lime:#CDFF00;
          --dark:#222120;
          --light:#F3F3F2;
        }

        body{
          font-family:'DM Sans',sans-serif;
          background:var(--dark);
          color:var(--light);
          overflow-x:hidden;
        }

        .hero{
          position:relative;
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .hero-video-wrap{
          position:absolute;
          inset:0;
          overflow:hidden;
          z-index:0;
        }

        .hero-video-wrap video{
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .hero-overlay{
          position:absolute;
          inset:0;
          background:rgba(0,0,0,0.55);
          z-index:1;
        }

        .hero-center{
          position:relative;
          z-index:2;
          text-align:center;
          max-width:900px;
          padding:0 20px;
        }

        .hero-script{
          color:var(--lime);
          letter-spacing:4px;
          font-size:0.8rem;
          font-weight:500;
        }

        .hero-title{
          font-family:'Playfair Display',serif;
          font-size:clamp(2.5rem,6vw,4.5rem);
          margin:16px 0;
          line-height:1.1;
          white-space:pre-line;
        }

        .hero-subtitle{
          font-size:1.6rem;
          font-weight:500;
          margin-bottom:16px;
        }

        .hero-desc{
          color:#ccc;
          margin-bottom:30px;
        }

        .hero-buttons{
          display:flex;
          gap:18px;
          justify-content:center;
        }

        .btn-primary{
          background:var(--lime);
          color:#222;
          padding:14px 28px;
          border-radius:8px;
          text-decoration:none;
          font-weight:600;
          font-size:1rem;
        }

        .btn-secondary{
          border:1px solid #aaa;
          padding:12px 28px;
          border-radius:8px;
          text-decoration:none;
          color:#eee;
        }
      `}</style>

      {/* NAVBAR */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "70px",
          display: "flex",
          alignItems: "center",
          zIndex: 10,
          background: scrolled ? "rgba(34,33,32,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
 <a href="/" style={{ display: "flex", alignItems: "center" }}>
  <img
    src="/logoImage.png"
    alt="S&D Media"
    style={{
      height: "80px",
      width: "auto",
      objectFit: "contain",
      cursor: "pointer",
      transition: "transform 0.3s ease, opacity 0.3s ease",
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
  />
</a>

          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <a href="#home">Home</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#pricing">Pricing</a>
            <Link to="/team">Our Team</Link>

            <a
              href="#pricing"
              style={{
                background: "#CDFF00",
                padding: "8px 20px",
                borderRadius: "6px",
                textDecoration: "none",
                color: "#222",
              }}
            >
              Start a Project
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section ref={sectionRef} id="home" className="hero">
        <div className="hero-video-wrap">
          <video autoPlay muted loop playsInline poster={posterSrc}>
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>

        <div className="hero-overlay"></div>

        <div className={`hero-center ${visible ? "visible" : ""}`}>
          <span className="hero-script">WEDDING VIDEO EDITING</span>

          <h1 className="hero-title">
            {loading ? "Loading..." : heroData?.heading || fallbackData.heading}
          </h1>

          <p className="hero-subtitle">
            {loading ? "..." : heroData?.subtitle || fallbackData.subtitle}
          </p>

          <p className="hero-desc">
            Professional post-production for wedding videographers who refuse
            to compromise on quality or deadlines.
          </p>

          <div className="hero-buttons">
            <a href="#pricing" className="btn-primary">
              Pricing
            </a>

            <a href="#portfolio" className="btn-secondary">
              Portfolio 
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
