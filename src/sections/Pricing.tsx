import { useState, useEffect, useRef } from 'react';
import { Check, X, Calendar } from 'lucide-react';
import { API_BASE_URL } from '../constants/urls'; // Make sure this file exists

// ─────────────────────────────────────────────────────────────
// Type definitions matching your backend models
// ─────────────────────────────────────────────────────────────
interface PricingFeature {
  id?: number;
  text: string;
  order?: number;
}

interface PricingCard {
  id: number;
  heading: string;
  subheading?: string;
  price?: number | string;           // can be number or "Contact Us"
  card_type: 'bundle' | 'custom' | 'dedicated';
  is_most_popular: boolean;
  button_label: string;
  features: PricingFeature[];
  is_active: boolean;
}

interface VideoType {
  id: number;
  name: string;
  price: number;
  order?: number;
  is_active: boolean;
}

// Form data shape – matches your Lead model
interface FormData {
  name: string;
  company_name: string;
  phone: string;
  email: string;
  selected_video_types: number[];   // array of VideoType IDs
}

// ─────────────────────────────────────────────────────────────
export function Pricing() {
  const [cards, setCards] = useState<PricingCard[]>([]);
  const [videoTypes, setVideoTypes] = useState<VideoType[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company_name: '',
    phone: '',
    email: '',
    selected_video_types: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);

  // ─── Fetch pricing cards & video types ─────────────────────────
  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Pricing Cards
        const cardsRes = await fetch(`${API_BASE_URL}pricing/`);
        if (!cardsRes.ok) throw new Error(`Pricing fetch failed: ${cardsRes.status}`);
        const cardsJson = await cardsRes.json();
        const fetchedCards = cardsJson.data || cardsJson;
        setCards(fetchedCards.filter((c: PricingCard) => c.is_active));

        // 2. Video Types (only needed for custom plan)
        const typesRes = await fetch(`${API_BASE_URL}pricing/video-types/`);
        if (!typesRes.ok) throw new Error(`Video types fetch failed: ${typesRes.status}`);
        const typesJson = await typesRes.json();
        const fetchedTypes = typesJson.data || typesJson;
        setVideoTypes(fetchedTypes.filter((t: VideoType) => t.is_active));

      } catch (err: any) {
        console.error('Pricing data fetch error:', err);
        setError('Failed to load pricing plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  // ─── Fade-in animation observer ────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-up');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // ─── Toggle video type (for custom plan) ───────────────────────
  const handleVideoTypeToggle = (typeId: number) => {
    setFormData((prev) => ({
      ...prev,
      selected_video_types: prev.selected_video_types.includes(typeId)
        ? prev.selected_video_types.filter((id) => id !== typeId)
        : [...prev.selected_video_types, typeId],
    }));
  };

  // ─── Calculate total for custom order preview ──────────────────
  const calculateTotal = () => {
    return formData.selected_video_types.reduce((sum, id) => {
      const vt = videoTypes.find((v) => v.id === id);
      return sum + (vt?.price || 0);
    }, 0);
  };

  // ─── Submit lead to backend ────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        company_name: formData.company_name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        selected_plan: selectedPlan,
        selected_video_types: selectedPlan === 'custom' ? formData.selected_video_types : [],
      };

      const res = await fetch(`${API_BASE_URL}leads/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Lead submission failed:', err);
      setSubmitError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setIsSubmitted(false);
    setSubmitError(null);
    setFormData({
      name: '',
      company_name: '',
      phone: '',
      email: '',
      selected_video_types: [],
    });
  };

  // ─── Render ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="py-24 text-center text-gray-400 bg-[#222120]">
        Loading pricing plans...
      </section>
    );
  }

  if (error || cards.length === 0) {
    return (
      <section className="py-24 text-center text-red-400 bg-[#222120]">
        {error || 'No pricing plans available at the moment.'}
      </section>
    );
  }

  return (
    <>
      <section ref={sectionRef} id="pricing" className="py-24 bg-[#222120]">
        <div className="container-custom max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="fade-up font-serif text-3xl md:text-5xl text-[#F3F3F2] font-bold mb-4">
              Transparent <span className="text-[#CDFF00]">Pricing</span>
            </h2>
            <p className="fade-up text-[#DADADA] text-lg max-w-3xl mx-auto">
              Turnaround time = 7-8 Working Days · Multiple videos from one wedding? Volume pricing applies automatically
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 max-w-6xl mx-auto items-stretch">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`fade-up flex-1 flex flex-col bg-[#363432]/50 border ${
                  card.is_most_popular ? 'border-[#CDFF00]/40 shadow-lg shadow-[#CDFF00]/10' : 'border-[#4A4845]'
                } rounded-xl p-6 md:p-8 relative min-h-[520px] md:min-h-[560px] transition-all hover:border-[#CDFF00]/30`}
              >
                {card.is_most_popular && (
                  <div className="absolute -top-3 left-6 px-4 py-1 bg-[#CDFF00] text-[#222120] text-xs font-bold rounded-full shadow-md">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="font-display font-bold text-2xl text-[#F3F3F2] mt-8 mb-2">
                  {card.heading}
                </h3>

                {card.subheading && (
                  <p className="text-[#DADADA] text-sm mb-4">{card.subheading}</p>
                )}

                {card.price !== undefined && card.price !== null ? (
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl md:text-5xl font-bold text-[#F3F3F2]">
                      {typeof card.price === 'number' ? `$${card.price}` : card.price}
                    </span>
                  </div>
                ) : (
                  <div className="text-4xl md:text-5xl font-bold text-[#F3F3F2] mb-6">
                    Contact Us
                  </div>
                )}

                <ul className="space-y-3 mb-8 flex-grow">
                  {card.features.map((f) => (
                    <li key={f.id || f.text} className="flex items-center gap-3 text-[#DADADA] text-base">
                      <Check className="w-5 h-5 text-[#CDFF00] flex-shrink-0" />
                      {f.text}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <button
                    onClick={() => setSelectedPlan(card.card_type)}
                    className={`w-full py-4 px-6 font-semibold rounded-xl transition-all text-lg ${
                      card.is_most_popular
                        ? 'bg-[#CDFF00] text-[#222120] hover:bg-[#b8e600] shadow-lg shadow-[#CDFF00]/20'
                        : card.card_type === 'custom'
                        ? 'border-2 border-[#CDFF00]/60 text-[#CDFF00] hover:bg-[#CDFF00]/10'
                        : 'border-2 border-[#F3F3F2]/30 text-[#F3F3F2] hover:bg-[#F3F3F2]/10'
                    }`}
                  >
                    {card.button_label || 'Choose Plan'} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Inquiry Modal ───────────────────────────────────────────── */}
      {selectedPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#363432] rounded-2xl p-6 md:p-8 border border-[#4A4845]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#4A4845] text-[#DADADA] flex items-center justify-center hover:bg-[#CDFF00] hover:text-[#222120] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-[#CDFF00] flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-[#222120]" />
                </div>
                <h3 className="font-serif text-3xl text-[#F3F3F2] mb-4">Thank You!</h3>
                <p className="text-[#DADADA] text-lg mb-8">
                  Your inquiry has been received. We'll contact you within 24 hours via WhatsApp or email.
                </p>
                <button
                  onClick={closeModal}
                  className="px-8 py-3 bg-[#CDFF00] text-[#222120] font-semibold rounded-xl hover:bg-[#b8e600] transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-3xl text-[#F3F3F2] mb-2">
                  {selectedPlan === 'bundle' && 'Order The Wedding Bundle'}
                  {selectedPlan === 'custom' && 'Build Your Custom Package'}
                  {selectedPlan === 'dedicated' && 'Book Your Dedicated Editor'}
                </h3>

                <p className="text-[#DADADA] mb-6">
                  Please fill in your details below. We'll get back to you shortly.
                </p>

                {submitError && (
                  <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-xl text-red-300">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[#F3F3F2] text-sm mb-2 font-medium">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      className="w-full px-5 py-3.5 bg-[#2E2C3A] border border-[#4A4845] rounded-xl text-[#F3F3F2] placeholder-[#8A8885] focus:border-[#CDFF00] focus:ring-2 focus:ring-[#CDFF00]/30 outline-none transition-all"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-[#F3F3F2] text-sm mb-2 font-medium">Company / Studio Name</label>
                    <input
                      type="text"
                      value={formData.company_name}
                      onChange={(e) => setFormData((p) => ({ ...p, company_name: e.target.value }))}
                      className="w-full px-5 py-3.5 bg-[#2E2C3A] border border-[#4A4845] rounded-xl text-[#F3F3F2] placeholder-[#8A8885] focus:border-[#CDFF00] focus:ring-2 focus:ring-[#CDFF00]/30 outline-none transition-all"
                      placeholder="Your company or studio"
                    />
                  </div>

                  <div>
                    <label className="block text-[#F3F3F2] text-sm mb-2 font-medium">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full px-5 py-3.5 bg-[#2E2C3A] border border-[#4A4845] rounded-xl text-[#F3F3F2] placeholder-[#8A8885] focus:border-[#CDFF00] focus:ring-2 focus:ring-[#CDFF00]/30 outline-none transition-all"
                      placeholder="+44 1234 567890"
                    />
                  </div>

                  <div>
                    <label className="block text-[#F3F3F2] text-sm mb-2 font-medium">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      className="w-full px-5 py-3.5 bg-[#2E2C3A] border border-[#4A4845] rounded-xl text-[#F3F3F2] placeholder-[#8A8885] focus:border-[#CDFF00] focus:ring-2 focus:ring-[#CDFF00]/30 outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  {selectedPlan === 'custom' && (
                    <div className="pt-2">
                      <label className="block text-[#F3F3F2] text-sm mb-3 font-medium">Select Desired Video Types</label>
                      <div className="space-y-3">
                        {videoTypes.map((vt) => (
                          <label
                            key={vt.id}
                            className="flex items-center justify-between p-4 bg-[#2E2C3A] rounded-xl cursor-pointer hover:bg-[#3A3845] transition-colors border border-[#4A4845]/50"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={formData.selected_video_types.includes(vt.id)}
                                onChange={() => handleVideoTypeToggle(vt.id)}
                                className="w-5 h-5 rounded border-[#5a5855] text-[#CDFF00] focus:ring-[#CDFF00] bg-[#222120]"
                              />
                              <span className="text-[#F3F3F2]">{vt.name}</span>
                            </div>
                            <span className="text-[#CDFF00] font-medium">${vt.price}</span>
                          </label>
                        ))}
                      </div>

                      {formData.selected_video_types.length > 0 && (
                        <div className="mt-5 p-5 bg-[#222120] rounded-xl border border-[#4A4845]/50">
                          <div className="flex justify-between items-center text-lg">
                            <span className="text-[#DADADA]">Estimated Total:</span>
                            <span className="text-[#CDFF00] font-bold text-2xl">
                              ${calculateTotal()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedPlan === 'dedicated' && (
                    <div className="p-5 bg-[#222120] rounded-xl border border-[#4A4845]/50">
                      <div className="flex items-start gap-4">
                        <Calendar className="w-6 h-6 text-[#CDFF00] mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-[#F3F3F2] font-medium mb-2">Book a Discovery Call</p>
                          <p className="text-[#DADADA] text-sm">
                            We'll arrange a quick call to understand your needs and tailor the perfect editing solution.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-8 mt-2 rounded-xl font-semibold text-lg transition-all ${
                      isSubmitting
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-[#CDFF00] text-[#222120] hover:bg-[#b8e600] shadow-lg shadow-[#CDFF00]/20'
                    }`}
                  >
                    {isSubmitting
                      ? 'Submitting...'
                      : selectedPlan === 'dedicated'
                      ? 'Book Discovery Call'
                      : 'Submit Your Inquiry'}
                  </button>

                  <p className="text-center text-[#8A8885] text-sm mt-4">
                    We'll reach out via WhatsApp or email within 24 hours.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}