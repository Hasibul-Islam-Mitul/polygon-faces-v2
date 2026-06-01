/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Globe, Shield, Zap, Users, RefreshCw, Loader2, Bot, X, Star } from 'lucide-react';
import { fetchEmployeeData, shuffleArray } from '../lib/csv-utils';
import { Employee } from '../types';
import EmployeeCard from '../components/EmployeeCard';
import Filters from '../components/Filters';
import { cn } from '../lib/utils';

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBot, setSelectedBot] = useState<Employee | null>(null);
  const [botImageError, setBotImageError] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchEmployeeData();
    setEmployees(shuffleArray(data)); 
    setLoading(false);
  };

  const featuredMembers = useMemo(() => {
    return employees.slice(0, 8);
  }, [employees]);

  const handleMeetBot = () => {
    if (employees.length > 0) {
      const randomIndex = Math.floor(Math.random() * employees.length);
      setSelectedBot(employees[randomIndex]);
      setBotImageError(false);
    }
  };

  const services = [
    
  ];

  return (
    <div className="min-h-screen bg-[#0b0e14]">
      {/* Hero Section */}
      <div className="relative pt-48 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[#66bc7b] blur-[150px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-white/5 border border-white/10 rounded-[2rem]"
          >
            <img src="/logo.png" alt="Polygon" className="w-16 h-16 object-contain" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black text-white leading-none mb-6 tracking-tighter"
          >
            FACES OF <br />
            <span className="text-[#66bc7b] italic">POLYGON</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg md:text-2xl max-w-2xl mb-12 leading-relaxed"
          >
           Meet Our People.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-3xl">
            {services.map((service, i) => (
              <span key={i} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-[#66bc7b]">
                {service}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
             <Link
                to="/directory"
                className="group flex items-center justify-center gap-3 bg-[#66bc7b] text-[#0b0e14] px-10 py-5 rounded-[2.5rem] font-black text-lg transition-all hover:scale-105 shadow-2xl shadow-[#66bc7b]/20"
              >
                View Full Directory
                <Users size={20} />
              </Link>
              <button 
                onClick={handleMeetBot}
                className="group flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-10 py-5 rounded-[2.5rem] font-black text-lg transition-all hover:bg-white/10"
              >
                Meet a PolyBot
                <Bot size={24} />
              </button>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-4 pb-32">
         <div className="flex flex-col items-center mb-16 text-center">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#66bc7b]/10 border border-[#66bc7b]/20 px-6 py-3 rounded-2xl flex items-center gap-3 mb-8"
            >
                <div className="bg-[#66bc7b] p-1.5 rounded-lg text-[#0b0e14]">
                    <Star size={14} fill="currentColor" />
                </div>
                <span className="text-white text-[10px] font-black uppercase tracking-widest">
                    Onboarding Milestone: <span className="text-[#66bc7b]">MD. Hasibul Islam Mitul</span> has engaged with {employees.length} people.
                </span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">Featured <span className="text-[#66bc7b]">Talent</span></h2>
            <p className="text-white/40 text-lg max-w-xl">Meet the visionaries behind Bangladesh's leading fintech infrastructure.</p>
        </div>

        {loading ? (
             <div className="flex flex-col items-center justify-center py-20">
                <div className="hexagon-loader mb-6" />
                <p className="text-[#66bc7b] font-bold text-sm tracking-[0.3em] uppercase animate-pulse">Syncing Ecosystem...</p>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {featuredMembers.map((emp, idx) => (
                        <EmployeeCard key={emp.id} employee={emp} index={idx} />
                    ))}
                </div>
                <div className="text-center">
                    <Link to="/directory" className="inline-flex items-center gap-2 text-[#66bc7b] font-black uppercase tracking-widest hover:translate-x-3 transition-transform group">
                        Enter Full Ecosystem <ArrowRight size={20} className="group-hover:text-white transition-colors" />
                    </Link>
                </div>
            </>
        )}
      </section>

      {/* Stats Section */}
      <div className="bg-[#080a0f] border-y border-white/5 py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
                { label: 'Users Impacted', value: '50M+', icon: Users },
                { label: 'Products Delivered', value: '70+', icon: Zap },
                { label: 'Happy Clients', value: '50M+', icon: Shield },
                { label: 'Years Experience', value: '3+', icon: Globe },
            ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center md:items-start gap-5">
                    <div className="p-4 bg-[#66bc7b]/10 rounded-2xl text-[#66bc7b]">
                        <stat.icon size={28} />
                    </div>
                    <div>
                        <p className="text-5xl font-black text-white tracking-tighter mb-2">{stat.value}</p>
                        <p className="uppercase text-[10px] font-black tracking-[0.4em] text-white/40">{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* PolyBot Modal */}
      <AnimatePresence>
        {selectedBot && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBot(null)}
              className="absolute inset-0 bg-[#0b0e14]/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-[#131722] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <div className="aspect-square relative overflow-hidden">
                {botImageError || !selectedBot.image ? (
                  <div className="w-full h-full bg-[#1a1f2e] flex items-center justify-center text-white/20 select-none">
                    <span className="text-8xl font-black tracking-tighter">
                      {selectedBot.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                    </span>
                  </div>
                ) : (
                  <img 
                    src={selectedBot.image} 
                    alt={selectedBot.name} 
                    className="w-full h-full object-cover" 
                    onError={() => setBotImageError(true)}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent opacity-80" />
                <button 
                  onClick={() => setSelectedBot(null)}
                  className="absolute top-6 right-6 p-2.5 bg-black/40 hover:bg-white/10 rounded-full text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-10 text-center">
                <p className="text-[#66bc7b] text-[10px] font-black uppercase tracking-[0.3em] mb-3">{selectedBot.department}</p>
                <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">{selectedBot.name}</h3>
                <p className="text-white/60 font-bold mb-8 italic">{selectedBot.role}</p>
                <div className="p-5 bg-white/5 rounded-2xl mb-8 border border-white/5">
                   <p className="text-white/40 text-sm leading-relaxed italic">"{selectedBot.quote}"</p>
                </div>
                <button 
                  onClick={() => setSelectedBot(null)}
                  className="w-full bg-[#66bc7b] text-[#0b0e14] py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all"
                >
                  Close PolyBot
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


// Helper local components for filters
// (Filters component is already imported, assuming it's correct)
