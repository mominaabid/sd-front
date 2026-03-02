import { useState, useEffect } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';

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
      {/* Chat Button */}
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
                  <MessageCircle className="w-5 h-5 text-white" />
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
            isOpen ? 'bg-[#4A4845] text-[#F3F3F2]' : 'bg-[#25D366] text-white'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-7 h-7" fill="white" />
          )}
        </button>
      </div>
    </>
  );
}
