import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './sections/Navigation';
import { Hero } from './sections/Hero';
import { TrustedBy } from './sections/TrustedBy';
import { WineShowcase } from './sections/WineShowcase';
import { Museum } from './sections/Museum';
import { Portfolio } from './sections/Portfolio';
import { VideoTestimonials } from './sections/VideoTestimonials';
import Pricing from './sections/Pricing';
import { TextReviews } from './sections/TextReviews';
import { CombinedFooter } from './sections/CombinedFooter';
import { Footer } from './sections/Footer';
import { Preloader } from './components/Preloader';
import { ScrollToTop } from './components/ScrollToTop';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { TeamPage } from './pages/TeamPage';

// ✅ Scroll to hash after page content is ready
function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const id = location.hash.replace('#', '');

    // Delay scroll to ensure DOM is rendered
    const timeout = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeout);
  }, [location]);

  return null;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <Router>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      <div className={`min-h-screen bg-[#222120] ${isLoading ? 'overflow-hidden max-h-screen' : ''}`}>
        <Navigation />

        <ScrollToHash />

        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <main>
                <section id="home">
                  <Hero isReady={!isLoading} />
                </section>
                <TrustedBy />
                <WineShowcase />
                <Museum />
                <section id="portfolio">
                  <Portfolio />
                </section>
                <VideoTestimonials />
                <section id="pricing">
                  <Pricing />
                </section>
                <TextReviews />
                <CombinedFooter />
              </main>
            }
          />

          {/* Team Page */}
          <Route
            path="/team"
            element={
              <>
                <TeamPage />
                <Footer />
              </>
            }
          />
        </Routes>

        <ScrollToTop />
        <WhatsAppWidget />
      </div>
    </Router>
  );
}

export default App;