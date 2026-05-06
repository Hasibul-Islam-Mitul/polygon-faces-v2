/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import AboutContact from './pages/AboutContact';
import Developer from './pages/Developer';
import Directory from './pages/Directory';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <div className="bg-[#0b0e14] min-h-screen text-white selection:bg-[#66bc7b]/30 selection:text-[#66bc7b]">
        <ScrollToTop />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/about" element={<AboutContact />} />
            <Route path="/developer" element={<Developer />} />
          </Routes>
        </main>
        
        <footer className="bg-[#080a0f] border-t border-white/5 py-20 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-center md:text-left">
            <div className="space-y-6">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <img src="/logo.png" alt="Polygon" className="w-8 h-8 object-contain" />
                <span className="text-xl font-bold tracking-tighter">Polygon Technology</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                Specialized Fintech and Information Technology firm headquartered in Dhaka, Bangladesh.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#66bc7b]">Social Ecosystem</h4>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a href="https://www.linkedin.com/company/polygontechnology/" target="_blank" className="text-white/40 hover:text-white transition-colors">LinkedIn</a>
                <a href="https://www.facebook.com/polygontechnologylimited" target="_blank" className="text-white/40 hover:text-white transition-colors">Facebook</a>
                <a href="https://www.instagram.com/polygontechnologylimited/" target="_blank" className="text-white/40 hover:text-white transition-colors">Instagram</a>
                <a href="https://www.youtube.com/@polygontechnologylimited" target="_blank" className="text-white/40 hover:text-white transition-colors">YouTube</a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#66bc7b]">Developer Focus</h4>
              <p className="text-white/40 text-sm">Project maintained by MD. Hasibul Islam Mitul</p>
              <a href="https://polygontechnology.io/" target="_blank" className="text-white/60 hover:text-[#66bc7b] transition-colors font-bold tracking-tight">Visit Official Site →</a>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-[10px] uppercase tracking-[0.2em]">© 2026 Polygon Technology Limited. All Rights Reserved.</p>
            <p className="text-white/20 text-[10px] uppercase tracking-[0.2em]">Crafted for Fintech Branding</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

