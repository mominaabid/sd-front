import { useState, useEffect } from "react";
import { API_BASE_URL } from "../constants/urls";

interface Logo {
  id: number;
  company_name: string;
  logo_url: string;
  link?: string;
}

export function TrustedBy() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}logos/`);
        const result = await response.json();

        if (result.success && result.data) {
          setLogos(result.data);
        } else {
          throw new Error("Invalid API structure");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load logos");
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, []);

  if (loading) return <div className="text-center py-10 text-white">Loading logos...</div>;
  if (error) return <div className="text-center py-10 text-red-400">{error}</div>;
  if (logos.length === 0) return <div className="text-center py-10 text-white">No logos available</div>;

  // Repeat logos enough times to make the scroll seamless
  const repeatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="py-16 bg-[#2E2C2A] border-y border-white/10 overflow-hidden">
      <style>
        {`
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }

          .logo-scroll {
            display: flex;
            gap: 4rem;
            width: max-content;
            animation: scrollLeft 30s linear infinite;
          }

          .logo-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <h3 className="text-center text-sm font-medium tracking-[0.2em] uppercase text-white/50 mb-10">
        Trusted By Leading Wedding Videographers
      </h3>

      <div className="overflow-hidden relative">
        <div className="logo-scroll">
          {repeatedLogos.map((logo, index) => (
            <a
              key={`${logo.id}-${index}`}
              href={logo.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center min-w-[160px] h-12"
            >
              <img
                src={logo.logo_url}
                alt={logo.company_name}
                loading="lazy"
                className="max-h-20 w-auto object-contain opacity-70 hover:opacity-100 transition"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}