import { footerConfig } from '../config';
import { Instagram, Facebook, Linkedin, Youtube, MapPin, Phone, Mail, ArrowUp } from 'lucide-react';

const socialIconMap: Record<string, React.ElementType> = {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
};

const contactIconMap: Record<string, React.ElementType> = {
  MapPin,
  Phone,
  Mail,
};

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1a1918]">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h3
  className="text-2xl text-[#F3F3F2]"
  style={{ fontFamily: "'Aboreto', cursive", letterSpacing: '0.04em' }}
>
  {footerConfig.brandName}
</h3>
              <p className="font-script text-[#CDFF00] text-xl">
                {footerConfig.tagline}
              </p>
            </div>
            <p className="text-[#DADADA] text-sm mb-6">
              {footerConfig.description}
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {footerConfig.socialLinks.map((social) => {
                const Icon = socialIconMap[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-[#363432] flex items-center justify-center text-[#DADADA] hover:bg-[#CDFF00] hover:text-[#222120] transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          {footerConfig.linkGroups.map((group) => (
            <div key={group.title}>
              <h4
  className="text-lg text-[#F3F3F2] mb-4"
  style={{ fontFamily: "'Aboreto', cursive", letterSpacing: '0.04em' }}
>
  {group.title}
</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-[#DADADA] text-sm hover:text-[#CDFF00] transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4
  className="text-lg text-[#F3F3F2] mb-4"
  style={{ fontFamily: "'Aboreto', cursive", letterSpacing: '0.04em' }}
>
  Contact Us
</h4>
            <ul className="space-y-3">
              {footerConfig.contactItems.map((item, index) => {
                const Icon = contactIconMap[item.icon];
                return (
                  <li key={index} className="flex items-start gap-2">
                    <Icon className="w-4 h-4 text-[#CDFF00] flex-shrink-0 mt-0.5" />
                    <span className="text-[#DADADA] text-sm">{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#363432]">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#8a8885] text-sm">
              {footerConfig.copyrightText}
            </p>

            <div className="flex items-center gap-6">
              {footerConfig.legalLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[#8a8885] text-sm hover:text-[#CDFF00] transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#CDFF00] text-[#222120] flex items-center justify-center shadow-lg hover:bg-[#a8cc00] transition-colors z-40"
        aria-label={footerConfig.backToTopText}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}