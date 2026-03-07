import { useState, useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { API_BASE_URL } from "../constants/urls";

// ─────────────────────────────────────────────────────────────
// Types
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
  price?: number | string;
  card_type: "bundle" | "custom" | "dedicated";
  is_most_popular: boolean;
  button_label: string;
  features: PricingFeature[];
}

interface VideoType {
  id: number;
  name: string;
  price: number;
  order?: number;
  is_active: boolean;
}

interface FormData {
  name: string;
  company_name: string;
  phone: string;
  email: string;
  selected_video_types: number[];
}

// ─────────────────────────────────────────────────────────────

export function Pricing() {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [cards, setCards] = useState<PricingCard[]>([]);
  const [videoTypes, setVideoTypes] = useState<VideoType[]>([]);

  const [selectedPlan, setSelectedPlan] =
    useState<"bundle" | "custom" | "dedicated" | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    company_name: "",
    phone: "",
    email: "",
    selected_video_types: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);

  // ─────────────────────────────────────────────────────────────
  // Fetch Pricing Data
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setLoading(true);
        setError(null);

        const cardsRes = await fetch(`${API_BASE_URL}pricing/`);
        if (!cardsRes.ok) throw new Error("Pricing fetch failed");

        const cardsJson = await cardsRes.json();
        const fetchedCards = cardsJson.data || cardsJson;

        const normalizedCards = fetchedCards.map((card: any) => ({
          ...card,
          features: card.features.map((f: any, i: number) => ({
            id: i,
            text: typeof f === "string" ? f : f.text,
          })),
        }));

        setCards(normalizedCards);

        const typesRes = await fetch(`${API_BASE_URL}pricing/video-types/`);
        if (!typesRes.ok) throw new Error("Video types fetch failed");

        const typesJson = await typesRes.json();
        const fetchedTypes = typesJson.data || typesJson;

        setVideoTypes(fetchedTypes.filter((t: VideoType) => t.is_active));
      } catch (err) {
        console.error(err);
        setError("Failed to load pricing plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Fade Animation
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = sectionRef.current?.querySelectorAll(".fade-up");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Toggle Video Types
  // ─────────────────────────────────────────────────────────────
  const handleVideoTypeToggle = (typeId: number) => {
    setFormData((prev) => ({
      ...prev,
      selected_video_types: prev.selected_video_types.includes(typeId)
        ? prev.selected_video_types.filter((id) => id !== typeId)
        : [...prev.selected_video_types, typeId],
    }));
  };

  // ─────────────────────────────────────────────────────────────
  // Calculate Custom Total
  // ─────────────────────────────────────────────────────────────
  const calculateTotal = () => {
    return formData.selected_video_types.reduce((sum, id) => {
      const vt = videoTypes.find((v) => v.id === id);
      return sum + (vt?.price || 0);
    }, 0);
  };

  const isCustomInvalid =
    selectedPlan === "custom" && formData.selected_video_types.length === 0;

  // ─────────────────────────────────────────────────────────────
  // Submit Lead
  // ─────────────────────────────────────────────────────────────
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
        selected_video_types:
          selectedPlan === "custom" ? formData.selected_video_types : [],
      };

      const response = await fetch(`${API_BASE_URL}leads/submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      console.log("Lead submitted:", data);

      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitError(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
  if (selectedPlan && nameInputRef.current) {
    nameInputRef.current.focus();
  }
}, [selectedPlan]);

useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  if (selectedPlan) {
    document.addEventListener("keydown", handleEsc);
  }

  return () => {
    document.removeEventListener("keydown", handleEsc);
  };
}, [selectedPlan]);

  // ─────────────────────────────────────────────────────────────
  const closeModal = () => {
    setSelectedPlan(null);
    setIsSubmitted(false);
    setSubmitError(null);

    setFormData({
      name: "",
      company_name: "",
      phone: "",
      email: "",
      selected_video_types: [],
    });
  };

  // ─────────────────────────────────────────────────────────────
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
        {error || "No pricing plans available."}
      </section>
    );
  }

  return (
    <>
      <section ref={sectionRef} id="pricing" className="py-24 bg-[#222120]">
        <div className="container-custom max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="fade-up font-serif text-3xl md:text-5xl text-[#F3F3F2] font-bold mb-4">
              Transparent <span className="text-[#CDFF00]">Pricing</span>
            </h2>

            <p className="fade-up text-[#DADADA] text-lg max-w-3xl mx-auto">
              Turnaround time = 7-8 Working Days · Multiple videos from one
              wedding? Volume pricing applies automatically
            </p>
          </div>

          {/* Pricing Cards */}

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 max-w-6xl mx-auto items-stretch">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`fade-up flex-1 flex flex-col bg-[#363432]/50 border ${
                  card.is_most_popular
                    ? "border-[#CDFF00]/40 shadow-lg shadow-[#CDFF00]/10"
                    : "border-[#4A4845]"
                } rounded-xl p-6 md:p-8 relative min-h-[520px] transition-all hover:border-[#CDFF00]/30`}
              >
                {card.is_most_popular && (
                  <div className="absolute -top-3 left-6 px-4 py-1 bg-[#CDFF00] text-[#222120] text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="font-display font-bold text-2xl text-[#F3F3F2] mt-8 mb-2">
                  {card.heading}
                </h3>

                {card.subheading && (
                  <p className="text-[#DADADA] text-sm mb-4">
                    {card.subheading}
                  </p>
                )}

                <ul className="space-y-3 mb-4 flex-grow">
                  {card.features.map((f) => (
                    <li
                      key={f.id || f.text}
                      className="flex items-center gap-3 text-[#DADADA]"
                    >
                      <Check className="w-5 h-5 text-[#CDFF00]" />
                      {f.text}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(card.card_type)}
                  className={`w-full py-2.5 px-4 font-semibold rounded-lg text-sm ${
                    card.is_most_popular
                      ? "bg-[#CDFF00] text-[#222120]"
                      : "border border-[#F3F3F2]/30 text-[#F3F3F2]"
                  }`}
                >
                  {card.button_label || "Choose Plan"} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}

      {selectedPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-lg bg-[#363432] rounded-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white"
            >
              <X />
            </button>

            {isSubmitted ? (
              <div className="text-center">
                <Check className="mx-auto mb-4 text-[#CDFF00]" size={40} />
                <h3 className="text-2xl text-white mb-3">Thank You!</h3>
                <p className="text-gray-300">
                  We'll contact you on WhatsApp or email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  required
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-lg bg-[#2E2C3A] text-white"
                />

                <input
                  placeholder="Company Name"
                  value={formData.company_name}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      company_name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg bg-[#2E2C3A] text-white"
                />

                <input
                  required
                  placeholder="Phone / WhatsApp"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-lg bg-[#2E2C3A] text-white"
                />

                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-lg bg-[#2E2C3A] text-white"
                />

                {selectedPlan === "custom" &&
                  videoTypes.map((vt) => (
                    <label
                      key={vt.id}
                      className="flex justify-between text-white"
                    >
                      <span>{vt.name}</span>

                      <input
                        type="checkbox"
                        checked={formData.selected_video_types.includes(vt.id)}
                        onChange={() => handleVideoTypeToggle(vt.id)}
                      />
                    </label>
                  ))}

                {selectedPlan === "custom" &&
                  formData.selected_video_types.length > 0 && (
                    <div className="text-[#CDFF00] font-bold text-lg">
                      Total: ${calculateTotal()}
                    </div>
                  )}
                  {submitError && (
  <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-300 text-sm">
    {submitError}
  </div>
)}

                <button
                  type="submit"
                  disabled={isSubmitting || isCustomInvalid}
                  className="w-full py-3 bg-[#CDFF00] text-black rounded-lg font-semibold"
                >
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}