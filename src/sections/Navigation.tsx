import { useState, useEffect } from 'react';
import { navigationConfig } from '../config';
import { Home, Film, CreditCard, Users } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Home,
  Film,
  CreditCard,
  Users,
};

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#222120]/95 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-20 left-4 right-4 bg-[#363432] rounded-2xl p-6 shadow-2xl transition-all duration-500 ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
        >
          <div className="space-y-4">
            {navigationConfig.navLinks.map((link) => {
              // Safe typing: only access iconMap if link.icon exists
              const Icon = link.icon ? iconMap[link.icon] : undefined;

              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg text-[#F3F3F2] hover:bg-[#4A4845] transition-colors"
                >
                  {Icon && <Icon className="w-5 h-5 text-[#CDFF00]" />}
                  {link.name}
                </a>
              );
            })}

            <div className="pt-4 border-t border-[#4A4845]">
              <a
                href="#pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full py-3 px-4 bg-[#CDFF00] text-[#222120] rounded-lg text-center font-medium"
              >
                {navigationConfig.ctaButtonText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}