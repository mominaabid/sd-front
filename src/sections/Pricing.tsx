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

  // Toggle video type selection
  const handleVideoTypeToggle = (videoId: string) => {
    setFormData((prev) => ({
      ...prev,
      videoTypes: prev.videoTypes.includes(videoId)
        ? prev.videoTypes.filter((id) => id !== videoId)
        : [...prev.videoTypes, videoId],
    }));
  };

  // Calculate total price for selected video types
  const calculateTotal = () => {
    return formData.videoTypes.reduce((total, videoId) => {
      const video = videoTypesList.find((v) => v.id.toString() === videoId);
      return total + (video?.price || 0);
    }, 0);
  };

  // Submit inquiry
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const payload: any = {
      name: formData.personalName,
      company_name: formData.companyName,
      phone: formData.phone,
      email: formData.email,
      selected_plan: selectedPlan.card_type,
      date: new Date().toISOString(),
    };

    // Add video_type_ids only for "custom"
    if (selectedPlan.card_type === 'custom') {
      payload.video_type_ids = formData.videoTypes.map((id) => parseInt(id, 10));
    }

    console.log('Sending payload:', payload);

    try {
      const res = await fetch(`${API_BASE_URL}leads/submit/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      console.log('Backend response:', result);

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
    setFormData({
      personalName: '',
      companyName: '',
      phone: '',
      email: '',
      videoTypes: [],
    });
  };

  return (
    <>
      <section className="section-padding bg-[#222120]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-[#F3F3F2] font-bold mb-4">
              Transparent <span className="text-[#CDFF00]">Pricing</span>
            </h2>
            <p className="text-[#DADADA] text-lg">
              Turnaround time = 7-8 Working Days · Multiple videos from one wedding? Volume pricing applies automatically
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {cards.map((card) => (
              <div key={card.id} className="bg-card/50 border border-border/50 rounded-lg p-6 relative">
                {card.is_most_popular && (
                  <span className="absolute -top-3 left-6 px-3 py-1 bg-primary text-xs rounded-full">Most Popular</span>
                )}

                <h3 className="text-xl font-bold text-[#F3F3F2]">{card.heading}</h3>
                {card.subheading && <p className="text-sm text-muted-foreground mb-4">{card.subheading}</p>}

                {card.features && card.features.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {card.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={() => setSelectedPlan(card)}
                  className="w-full py-3 mt-4 border border-primary/40 text-primary rounded-md hover:bg-primary/10 transition-colors"
                >
                  {card.button_label}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#222120]/90" onClick={closeModal}>
          <div
            className="bg-[#363432] p-6 md:p-8 rounded-3xl max-w-lg w-full shadow-lg border border-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-[#DADADA] hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-8">
                <Check className="w-10 h-10 mx-auto text-primary mb-4" />
                <h3 className="text-2xl text-[#F3F3F2] mb-2 font-semibold">Thank You!</h3>
                <p className="text-[#DADADA] mb-4">
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
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-2xl font-bold text-[#F3F3F2]">{selectedPlan.heading}</h3>
                <p className="text-sm text-muted-foreground mb-4">{selectedPlan.subheading}</p>

                {/* Video Types for Custom Order */}
                {selectedPlan.card_type === 'custom' && videoTypesList.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-[#F3F3F2] font-medium mb-2">Select Video Types</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {videoTypesList.map((video) => (
                        <label
                          key={video.id}
                          className="flex justify-between items-center p-3 bg-[#4A4845] rounded-lg cursor-pointer hover:bg-[#5A5753] transition-colors"
                        >
                          <span className="text-[#F3F3F2] font-medium">{video.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-semibold">${video.price}</span>
                            <input
                              type="checkbox"
                              checked={formData.videoTypes.includes(video.id.toString())}
                              onChange={() => handleVideoTypeToggle(video.id.toString())}
                            />
                          </div>
                        </label>
                      ))}
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#CDFF00]">Total Estimate: ${calculateTotal()}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Personal Name *"
                    required
                    value={formData.personalName}
                    onChange={(e) => setFormData({ ...formData, personalName: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#4A4845] text-[#F3F3F2] placeholder:text-[#DADADA] focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#4A4845] text-[#F3F3F2] placeholder:text-[#DADADA] focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                  <input
                    type="tel"
                    placeholder="Phone *"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#4A4845] text-[#F3F3F2] placeholder:text-[#DADADA] focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#4A4845] text-[#F3F3F2] placeholder:text-[#DADADA] focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-[#222120] rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}