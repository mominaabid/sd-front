import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { API_BASE_URL } from '../constants/urls';

interface VideoType {
  id: number;
  name: string;
  price: number;
}

interface PricingCard {
  id: string;
  card_type: string;
  heading: string;
  subheading?: string;
  button_label: string;
  is_most_popular?: boolean;
  features?: string[];
}

interface FormData {
  personalName: string;
  companyName: string;
  phone: string;
  email: string;
  videoTypes: string[];
}

export default function Pricing() {
  const [cards, setCards] = useState<PricingCard[]>([]);
  const [videoTypesList, setVideoTypesList] = useState<VideoType[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PricingCard | null>(null);
  const [formData, setFormData] = useState<FormData>({
    personalName: '',
    companyName: '',
    phone: '',
    email: '',
    videoTypes: [],
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch pricing cards and video types
  useEffect(() => {
    fetch(`${API_BASE_URL}pricing/`)
      .then((res) => res.json())
      .then((data) => setCards(data.data || []))
      .catch((err) => console.error('Error fetching pricing cards:', err));

    fetch(`${API_BASE_URL}pricing/video-types/`)
      .then((res) => res.json())
      .then((data) => setVideoTypesList(data.data || []))
      .catch((err) => console.error('Error fetching video types:', err));
  }, []);

  // ── Lock body scroll when modal is open ──
  useEffect(() => {
    if (selectedPlan) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPlan]);

  const handleVideoTypeToggle = (videoId: string) => {
    setFormData((prev) => ({
      ...prev,
      videoTypes: prev.videoTypes.includes(videoId)
        ? prev.videoTypes.filter((id) => id !== videoId)
        : [...prev.videoTypes, videoId],
    }));
  };

  const calculateTotal = () => {
    return formData.videoTypes.reduce((total, videoId) => {
      const video = videoTypesList.find((v) => v.id.toString() === videoId);
      return total + (video?.price || 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const payload: Record<string, unknown> = {
      name: formData.personalName,
      company_name: formData.companyName,
      phone: formData.phone,
      email: formData.email,
      selected_plan: selectedPlan.card_type,
      date: new Date().toISOString(),
    };

    if (selectedPlan.card_type === 'custom') {
      payload.video_type_ids = formData.videoTypes.map((id) => parseInt(id, 10));
    }

    try {
      const res = await fetch(`${API_BASE_URL}leads/submit/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        console.error('Submit failed:', result);
      }
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setIsSubmitted(false);
    setFormData({ personalName: '', companyName: '', phone: '', email: '', videoTypes: [] });
  };

  return (
    <>
      <style>{`
        /* ── Card layout: flex column so CTA button is always bottom-aligned ── */
        .pc-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .pc-card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .pc-features { flex: 1; }
        .pc-btn-wrap { margin-top: auto; padding-top: 20px; }

        /* ── Modal backdrop: fixed, no scroll ── */
        .pc-backdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Top padding clears the fixed navbar (72px) + extra breathing room */
          padding: calc(72px + 12px) 16px 16px;
          background: rgba(22, 21, 20, 0.88);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          overflow: hidden;
        }

        /* ── Modal box: capped height, flex column ── */
        .pc-modal {
          position: relative;
          width: 100%;
          max-width: 520px;
          /* Height fills remaining space below the navbar */
          max-height: 100%;
          background: #363432;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 24px 64px rgba(0,0,0,0.65);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* ── Sticky close button row at top of modal ── */
        .pc-modal-hdr {
          position: relative;
          flex-shrink: 0;
          padding: 20px 52px 0 28px; /* right pad leaves room for close btn */
        }

        /* ── Close button ── */
        .pc-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3F3F2;
          transition: background 0.2s, color 0.2s, transform 0.25s;
          flex-shrink: 0;
          z-index: 5;
        }
        .pc-close:hover {
          background: #CDFF00;
          color: #1a1918;
          transform: rotate(90deg);
        }

        /* ── Scrollable inner body ── */
        .pc-modal-body {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 16px 28px 28px;
          scrollbar-width: thin;
          scrollbar-color: rgba(205,255,0,0.25) transparent;
        }
        .pc-modal-body::-webkit-scrollbar { width: 4px; }
        .pc-modal-body::-webkit-scrollbar-track { background: transparent; }
        .pc-modal-body::-webkit-scrollbar-thumb {
          background: rgba(205,255,0,0.25);
          border-radius: 4px;
        }
      `}</style>

      <section id="pricing" className="section-padding bg-[#222120]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-[#F3F3F2] font-bold mb-4">
              Transparent <span className="text-[#CDFF00]">Pricing</span>
            </h2>
            <p className="text-[#DADADA] text-lg">
              Turnaround time = 7–8 Working Days · Multiple videos from one wedding? Volume pricing applies automatically
            </p>
          </div>

          {/* items-stretch so all cards are same height → buttons align */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch pt-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="pc-card bg-card/50 border border-border/50 rounded-lg p-6 relative overflow-visible"
              >
                {card.is_most_popular && (
                  <span className="absolute -top-3 left-6 px-3 py-1 bg-[#CDFF00] text-[#1a1918] text-xs font-semibold rounded-full">
                    Most Popular
                  </span>
                )}

                <div className="pc-card-body">
                  <div className="pc-features">
                    <h3 className="text-xl font-bold text-[#F3F3F2]">{card.heading}</h3>
                    {card.subheading && (
                      <p className="text-sm text-muted-foreground mb-4">{card.subheading}</p>
                    )}
                    {card.features && card.features.length > 0 && (
                      <ul className="space-y-2 mb-2">
                        {card.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* CTA always at the bottom of every card */}
                  <div className="pc-btn-wrap">
                    <button
                      onClick={() => setSelectedPlan(card)}
                      className="w-full py-3 border border-primary/40 text-primary rounded-md hover:bg-primary/10 transition-colors"
                    >
                      {card.button_label}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modal ── */}
      {selectedPlan && (
        /* Clicking backdrop closes modal; backdrop itself does NOT scroll */
        <div className="pc-backdrop" onClick={closeModal}>

          {/* Modal box stops propagation so inner clicks don't close it */}
          <div className="pc-modal" onClick={(e) => e.stopPropagation()}>

            {/* Always-visible close button */}
            <button className="pc-close" onClick={closeModal} aria-label="Close">
              <X className="w-4 h-4" />
            </button>

            {isSubmitted ? (
              /* Success state — no scroll needed */
              <div className="pc-modal-body flex flex-col items-center justify-center text-center py-10">
                <Check className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-2xl text-[#F3F3F2] mb-2 font-semibold">Thank You!</h3>
                <p className="text-[#DADADA] mb-6">
                  We've received your inquiry. Our team will contact you shortly.
                </p>
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-primary text-[#222120] rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Non-scrolling header with plan title */}
                <div className="pc-modal-hdr">
                  <h3 className="text-2xl font-bold text-[#F3F3F2]">{selectedPlan.heading}</h3>
                  {selectedPlan.subheading && (
                    <p className="text-sm text-muted-foreground mt-1 mb-0">{selectedPlan.subheading}</p>
                  )}
                </div>

                {/* Scrollable form body */}
                <div className="pc-modal-body">
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4">

                    {/* Video Types — custom plan only */}
                    {selectedPlan.card_type === 'custom' && videoTypesList.length > 0 && (
                      <div>
                        <label className="block text-[#F3F3F2] font-medium mb-2 text-sm">
                          Select Video Types
                        </label>
                        <div className="flex flex-col gap-2">
                          {videoTypesList.map((video) => (
                            <label
                              key={video.id}
                              className="flex justify-between items-center p-3 bg-[#4A4845] rounded-lg cursor-pointer hover:bg-[#525050] transition-colors"
                            >
                              <span className="text-[#F3F3F2] font-medium text-sm">{video.name}</span>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-[#CDFF00] font-semibold text-sm">${video.price}</span>
                                <input
                                  type="checkbox"
                                  checked={formData.videoTypes.includes(video.id.toString())}
                                  onChange={() => handleVideoTypeToggle(video.id.toString())}
                                  className="w-4 h-4 accent-[#CDFF00] cursor-pointer"
                                />
                              </div>
                            </label>
                          ))}
                        </div>
                        {formData.videoTypes.length > 0 && (
                          <p className="mt-3 text-sm font-semibold text-[#CDFF00] text-right">
                            Total Estimate: ${calculateTotal()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Contact fields */}
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Personal Name *"
                        required
                        value={formData.personalName}
                        onChange={(e) => setFormData({ ...formData, personalName: e.target.value })}
                        className="w-full p-3 rounded-xl bg-[#4A4845] text-[#F3F3F2] placeholder:text-[#9a9896] focus:outline-none focus:ring-2 focus:ring-primary transition"
                      />
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full p-3 rounded-xl bg-[#4A4845] text-[#F3F3F2] placeholder:text-[#9a9896] focus:outline-none focus:ring-2 focus:ring-primary transition"
                      />
                      <input
                        type="tel"
                        placeholder="Phone *"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3 rounded-xl bg-[#4A4845] text-[#F3F3F2] placeholder:text-[#9a9896] focus:outline-none focus:ring-2 focus:ring-primary transition"
                      />
                      <input
                        type="email"
                        placeholder="Email *"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3 rounded-xl bg-[#4A4845] text-[#F3F3F2] placeholder:text-[#9a9896] focus:outline-none focus:ring-2 focus:ring-primary transition"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-primary text-[#222120] rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Submit Inquiry
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}