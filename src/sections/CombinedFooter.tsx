import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { footerConfig } from '../config';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
} from 'lucide-react';

const EMAILJS_SERVICE_ID  = 'service_t0pawjh';
const EMAILJS_TEMPLATE_ID = 'template_f67ipi7';
const EMAILJS_PUBLIC_KEY  = 'Cw8opDgdlvyc27n2Q';

type IconName = 'MapPin' | 'Phone' | 'Mail' | 'Instagram' | 'Facebook' | 'Linkedin' | 'Youtube';

const iconMap: Record<IconName, React.ElementType> = {
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
  const [error, setError] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:    formState.name,
          from_email:   formState.email,
          from_phone:   formState.phone,
          from_company: formState.company,
          message:      formState.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      setIsSubmitted(true);
      setFormState({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (err) {
      setError('Something went wrong. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="pt-10 pb-4 md:pt-14 md:pb-6 bg-gradient-to-b from-[#222120] to-[#1a1918] border-t border-[#363432]"
    >
      <div className="max-w-6xl mx-auto px-3 md:px-4">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-16">

          {/* LEFT: INFO + LINKS + SOCIAL */}
          <div className="space-y-10">

            <div>
              <h3 className="font-serif text-xl md:text-2xl text-[#F3F3F2] mb-5">
                Contact Info
              </h3>
              <div className="space-y-4 text-[#DADADA]">
                <a
                  href="mailto:Info@sndmedia.co"
                  className="flex items-center gap-3 hover:text-[#CDFF00] transition-colors"
                >
                  <Mail className="w-5 h-5 text-[#CDFF00]" />
                  <span>Info@sndmedia.co</span>
                </a>
                <a
                  href="tel:+447962696177"
                  className="flex items-center gap-3 hover:text-[#CDFF00] transition-colors"
                >
                  <Phone className="w-5 h-5 text-[#CDFF00]" />
                  <span>+44 7962 696177</span>
                </a>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#CDFF00] mt-1 flex-shrink-0" />
                  <span>32 Hollywall Ln, Stoke-on-Trent ST6 5PP, UK</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-xl md:text-2xl text-[#F3F3F2] mb-5">
                Quick Links
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[#DADADA]">
                <a href="/" className="hover:text-[#CDFF00] transition-colors">Home</a>
                <a href="/#portfolio" className="hover:text-[#CDFF00] transition-colors">Portfolio</a>
                <a href="/#pricing" className="hover:text-[#CDFF00] transition-colors">Pricing</a>
                <a href="/team" className="hover:text-[#CDFF00] transition-colors">Our Team</a>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-xl md:text-2xl text-[#F3F3F2] mb-5">
                Follow Us
              </h3>
              <div className="flex gap-4">
                {footerConfig.socialLinks.map((social) => {
                  const Icon = iconMap[social.icon as IconName];
                  if (!Icon) return null;
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

          {/* RIGHT: CONTACT FORM */}
          <div>
           <h2
  className="text-3xl md:text-4xl text-[#F3F3F2] mb-3"
  style={{ fontFamily: "'League Spartan', sans-serif", letterSpacing: '0.02em' }}
>
  Send Us a{' '}
  <span
    className="text-[#CDFF00] font-bold"
    style={{ fontFamily: "'Aboreto', cursive", letterSpacing: '0.12em', textTransform: 'uppercase' }}
  >
    MESSAGE
  </span>
</h2>
            <p className="text-[#DADADA] mb-8 text-base">
              Fill out the form below and we will get back to you within 24 hours
            </p>

            {isSubmitted ? (
              <div className="text-center py-12 bg-[#363432]/40 rounded-xl border border-[#4A4845]/50">
                <CheckCircle className="w-14 h-14 text-[#CDFF00] mx-auto mb-4" />
                <h3
  className="text-xl md:text-2xl text-[#F3F3F2] mb-5"
  style={{ fontFamily: "'Aboreto', cursive", letterSpacing: '0.04em' }}
>Message Sent!</h3>
                <p className="text-[#DADADA]">Thank you, we will be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Full Name"
                    className="w-full px-5 py-3.5 bg-[#363432] border border-[#4A4845] rounded-lg text-[#F3F3F2] placeholder-[#8a8885] focus:border-[#CDFF00] focus:outline-none transition-all"
                  />
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Email"
                    className="w-full px-5 py-3.5 bg-[#363432] border border-[#4A4845] rounded-lg text-[#F3F3F2] placeholder-[#8a8885] focus:border-[#CDFF00] focus:outline-none transition-all"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="WhatsApp / Phone"
                    className="w-full px-5 py-3.5 bg-[#363432] border border-[#4A4845] rounded-lg text-[#F3F3F2] placeholder-[#8a8885] focus:border-[#CDFF00] focus:outline-none transition-all"
                  />
                  <input
                    type="text"
                    value={formState.company}
                    onChange={(e) => setFormState((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="Company / Studio (optional)"
                    className="w-full px-5 py-3.5 bg-[#363432] border border-[#4A4845] rounded-lg text-[#F3F3F2] placeholder-[#8a8885] focus:border-[#CDFF00] focus:outline-none transition-all"
                  />
                </div>

                <textarea
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us about your project..."
                  className="w-full px-5 py-3.5 bg-[#363432] border border-[#4A4845] rounded-lg text-[#F3F3F2] placeholder-[#8a8885] focus:border-[#CDFF00] focus:outline-none transition-all resize-none"
                />

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-9 py-3.5 bg-[#CDFF00] text-[#222120] font-medium rounded-lg hover:bg-[#b8e600] transition-colors disabled:opacity-60 flex items-center gap-2.5"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  {!isSubmitting && <Send size={18} />}
                </button>
              </form>
            )}
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-[#363432] text-center text-sm text-[#8a8885]">
          <span>2026 S and D Media. All rights reserved.</span>
        </div>
      </div>
    </section>
  );
}