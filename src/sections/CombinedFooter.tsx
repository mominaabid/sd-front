import { useState } from 'react';
import { contactFormConfig } from '../config';
import { footerConfig } from '../config';
import { MapPin, Phone, Mail, Send, CheckCircle, Instagram, Facebook, Linkedin, Youtube, ArrowUp } from 'lucide-react';

const iconMap = {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
};

export function CombinedFooter() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1400));
      setIsSubmitted(true);
      setFormState({ name: '', email: '', phone: '', company: '', message: '' });
    } catch {
      // optional: show error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('success');
    setNewsletterEmail('');
    setTimeout(() => setNewsletterStatus('idle'), 4000);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <section id="contact" className="pt-20 pb-8 md:pt-24 md:pb-12 bg-gradient-to-b from-[#222120] to-[#1a1918] border-t border-[#363432]">
      <div className="container-custom max-w-6xl mx-auto px-5 md:px-6">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-16">
          {/* Left – Contact Form */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#F3F3F2] mb-3">
              Send Us a <span className="text-[#CDFF00]">Message</span>
            </h2>
            <p className="text-[#DADADA] mb-8 text-base">
              Fill out the form below and we'll get back to you within 24 hours
            </p>

            {isSubmitted ? (
              <div className="text-center py-12 bg-[#363432]/40 rounded-xl border border-[#4A4845]/50">
                <CheckCircle className="w-14 h-14 text-[#CDFF00] mx-auto mb-4" />
                <h3 className="text-2xl font-serif text-[#F3F3F2] mb-2">Message Sent!</h3>
                <p className="text-[#DADADA]">Thank you — we'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formState.name}
                    onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Full Name"
                    className="w-full px-5 py-3.5 bg-[#363432] border border-[#4A4845] rounded-lg text-[#F3F3F2] placeholder-[#8a8885] focus:border-[#CDFF00] focus:outline-none transition-all"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={e => setFormState(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email"
                    className="w-full px-5 py-3.5 bg-[#363432] border border-[#4A4845] rounded-lg text-[#F3F3F2] placeholder-[#8a8885] focus:border-[#CDFF00] focus:outline-none transition-all"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <input
                    type="tel"
                    name="phone"
                    value={formState.phone}
                    onChange={e => setFormState(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="WhatsApp / Phone"
                    className="w-full px-5 py-3.5 bg-[#363432] border border-[#4A4845] rounded-lg text-[#F3F3F2] placeholder-[#8a8885] focus:border-[#CDFF00] focus:outline-none transition-all"
                  />
                  <input
                    type="text"
                    name="company"
                    value={formState.company}
                    onChange={e => setFormState(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Company / Studio (optional)"
                    className="w-full px-5 py-3.5 bg-[#363432] border border-[#4A4845] rounded-lg text-[#F3F3F2] placeholder-[#8a8885] focus:border-[#CDFF00] focus:outline-none transition-all"
                  />
                </div>

                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={e => setFormState(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us about your project..."
                  className="w-full px-5 py-3.5 bg-[#363432] border border-[#4A4845] rounded-lg text-[#F3F3F2] placeholder-[#8a8885] focus:border-[#CDFF00] focus:outline-none transition-all resize-none"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-9 py-3.5 bg-[#CDFF00] text-[#222120] font-medium rounded-lg hover:bg-[#b8e600] transition-colors disabled:opacity-60 flex items-center gap-2.5"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  {!isSubmitting && <Send size={18} />}
                </button>
              </form>
            )}
          </div>

          {/* Right – Contact Info + Quick Links + Social */}
          <div className="space-y-10">
            {/* Contact Info */}
            <div>
              <h3 className="font-serif text-xl md:text-2xl text-[#F3F3F2] mb-5">Contact Info</h3>
              <div className="space-y-4 text-[#DADADA]">
                <a href="mailto:Info@sndmedia.co" className="flex items-center gap-3 hover:text-[#CDFF00] transition-colors">
                  <Mail className="w-5 h-5 text-[#CDFF00]" />
                  Info@sndmedia.co
                </a>
                <a href="tel:+447962696177" className="flex items-center gap-3 hover:text-[#CDFF00] transition-colors">
                  <Phone className="w-5 h-5 text-[#CDFF00]" />
                  +44 7962 696177
                </a>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#CDFF00] mt-1 flex-shrink-0" />
                  32 Hollywall Ln, Stoke-on-Trent ST6 5PP, UK
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-serif text-xl md:text-2xl text-[#F3F3F2] mb-5">Quick Links</h3>
              <div className="grid grid-cols-2 gap-2 text-[#DADADA]">
                <a href="/" className="hover:text-[#CDFF00] transition-colors">Home</a>
                <a href="/#portfolio" className="hover:text-[#CDFF00] transition-colors">Portfolio</a>
                <a href="/#pricing" className="hover:text-[#CDFF00] transition-colors">Pricing</a>
                <a href="/team" className="hover:text-[#CDFF00] transition-colors">Our Team</a>
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-serif text-xl md:text-2xl text-[#F3F3F2] mb-5">Follow Us</h3>
              <div className="flex gap-4">
                {footerConfig.socialLinks?.map((social) => {
                  const Icon = iconMap[social.icon as keyof typeof iconMap];
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-lg bg-[#363432] flex items-center justify-center text-[#DADADA] hover:bg-[#CDFF00] hover:text-[#222120] transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-16 pt-10 border-t border-[#363432] text-center text-sm text-[#8a8885]">
          © 2026 S&D Media. All rights reserved.
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#CDFF00] text-[#222120] flex items-center justify-center shadow-xl hover:bg-[#b8e600] transition-colors"
      >
        <ArrowUp size={22} />
      </button>
    </section>
  );
}