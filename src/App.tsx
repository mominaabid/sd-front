import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Navigation } from './sections/Navigation';
import { Hero } from './sections/Hero';
import { TrustedBy } from './sections/TrustedBy';
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
import { MadeForPage } from './pages/MadeForPage';
import Chatbot from './components/Chatbot';

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

        <Routes>
          {/* Home Page — WineShowcase removed */}
          <Route
            path="/"
            element={
              <main>
                <section id="home">
                  <Hero isReady={!isLoading} />
                </section>
                <TrustedBy />
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

          {/* Made For Page */}
          <Route
            path="/made-for"
            element={
              <>
                <MadeForPage />
                <Footer />
              </>
            }
          />
        </Routes>

        <ScrollToTop />
        <WhatsAppWidget />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;