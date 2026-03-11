import { useState, useEffect } from 'react';
import { X, Phone } from 'lucide-react';

// WhatsApp logo — green rounded square with white speech bubble + phone
function WhatsAppLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="24" fill="#25D366" />
      <path
        fill="white"
        d="M24 10.5C16.544 10.5 10.5 16.544 10.5 24c0 2.34.63 4.665 1.83 6.69L10.5 37.5l7.035-1.8A13.44 13.44 0 0024 37.5c7.456 0 13.5-6.044 13.5-13.5S31.456 10.5 24 10.5zm0 24.6a11.1 11.1 0 01-5.67-1.545l-.405-.24-4.185 1.095 1.11-4.08-.264-.42A11.07 11.07 0 0112.9 24c0-6.12 4.98-11.1 11.1-11.1S35.1 17.88 35.1 24 30.12 35.1 24 35.1z"
      />
      <path
        fill="white"
        d="M30.045 26.82c-.33-.165-1.95-.96-2.253-1.071-.303-.105-.524-.165-.744.165-.22.33-.855 1.071-1.05 1.29-.19.22-.385.247-.714.082-.33-.165-1.395-.513-2.657-1.635-1.98-1.665-1.98-1.665-2.13-1.89-.165-.247-.018-.38.123-.518.127-.123.33-.385.495-.577.165-.193.22-.33.33-.55.11-.22.055-.413-.027-.578-.083-.165-.745-1.793-1.02-2.453-.27-.645-.544-.557-.744-.567-.19-.01-.413-.012-.634-.012-.22 0-.578.082-.88.413-.304.33-1.155 1.128-1.155 2.75 0 1.62 1.182 3.187 1.347 3.407.165.22 2.327 3.554 5.64 4.987.788.34 1.403.543 1.882.695.79.252 1.51.217 2.078.132.634-.094 1.952-.798 2.228-1.567.275-.77.275-1.43.192-1.568-.082-.138-.302-.22-.633-.385z"
      />
    </svg>
  );
}

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const phoneNumber = '447962696177';
  const message = encodeURIComponent('Hi S&D Media! I\'m interested in your wedding video editing services. Can we discuss my project?');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <>
      <div
        className={`fixed bottom-24 right-8 z-40 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Chat Window */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-[#363432] rounded-2xl shadow-2xl border border-[#4A4845] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-[#25D366] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <WhatsAppLogo className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">S&D Media</h4>
                  <p className="text-white/80 text-xs">Typically replies in minutes</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Content */}
            <div className="p-4 bg-[#222120]">
              <div className="bg-[#363432] rounded-lg p-3 mb-4">
                <p className="text-[#F3F3F2] text-sm">
                  Hello! 👋 Welcome to S&D Media. How can we help you with your wedding video editing needs today?
                </p>
                <span className="text-[#8a8885] text-xs mt-1 block">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#128C7E] transition-colors"
              >
                <Phone className="w-4 h-4" />
                Start Chat on WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
            isOpen ? 'bg-[#4A4845]' : 'bg-transparent'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-[#F3F3F2]" />
          ) : (
            <WhatsAppLogo className="w-14 h-14" />
          )}
        </button>
      </div>
    </>
  );
}