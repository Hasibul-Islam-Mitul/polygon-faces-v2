/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, Home, Info, MapPin, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Header() {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Directory', path: '/directory', icon: Users },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Developer', path: '/developer', icon: Users },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b0e14]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:rotate-12">
            <img src="/logo.png" alt="Polygon" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">Faces of <span className="text-[#66bc7b]">Polygon</span></span>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] -mt-1 font-medium">Technology BD</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                  isActive 
                    ? "bg-[#66bc7b] text-[#0b0e14]" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={16} strokeWidth={2.5} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a 
            href="https://polygontechnology.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:block bg-white/5 border border-white/10 text-white rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-[#66bc7b] hover:text-[#0b0e14] transition-all"
          >
            Official Website
          </a>
        </div>
      </div>
    </header>
  );
}
