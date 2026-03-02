import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../constants/urls';

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
        if (!response.ok) throw new Error('Failed to fetch logos');
        const data = await response.json();
        setLogos(data.data); // Assuming { success: true, data: [...] }
        setLoading(false);
      } catch (err) {
        setError('Failed to load logos');
        setLoading(false);
      }
    };
    fetchLogos();
  }, []);

  if (loading) return <div>Loading Logos...</div>;
  if (error || logos.length === 0) return <div>Error: {error}. No logos available.</div>;

  const allLogos = [...logos, ...logos]; // Duplicate for marquee

  return (
    <section className="py-16 bg-[#2E2C2A] border-y border-white/10 overflow-hidden">
      <h3 className="text-center text-sm font-medium tracking-[0.2em] uppercase text-white/50 mb-10">
        Trusted By Leading Wedding Videographers
      </h3>
      <div className="overflow-hidden relative">
        <div className="flex animate-scroll-left gap-16 w-max">
          {allLogos.map((logo, index) => (
            <a
              key={`${logo.id}-${index}`}
              href={logo.link || '#'}
              className="flex items-center justify-center min-w-[160px] h-12"
            >
              {logo.logo_url ? (
                <img src={logo.logo_url} alt={logo.company_name} className="max-h-8 object-contain" />
              ) : (
                <span className="text-lg font-serif font-semibold text-white/40 hover:text-white transition-colors">
                  {logo.company_name}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}