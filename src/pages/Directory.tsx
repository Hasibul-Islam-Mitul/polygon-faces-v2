/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, RefreshCw, Loader2, Bot, X, Star } from 'lucide-react';
import { fetchEmployeeData, shuffleArray } from '../lib/csv-utils';
import { Employee } from '../types';
import EmployeeCard from '../components/EmployeeCard';
import Filters from '../components/Filters';
import { cn } from '../lib/utils';

export default function Directory() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
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

  const departments = useMemo(() => {
    const depts = new Set(employees.map(e => e.department));
    return ['All Departments', ...Array.from(depts)].sort();
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || 
                            emp.role.toLowerCase().includes(search.toLowerCase());
      const matchesDept = department === 'All Departments' || emp.department === department;
      return matchesSearch && matchesDept;
    });
  }, [employees, search, department]);

  const handleMeetBot = () => {
    if (employees.length > 0) {
      const randomIndex = Math.floor(Math.random() * employees.length);
      setSelectedBot(employees[randomIndex]);
      setBotImageError(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#66bc7b]/10 border border-[#66bc7b]/20 px-6 py-3 rounded-2xl flex items-center gap-3 mb-8"
            >
                <div className="bg-[#66bc7b] p-1.5 rounded-lg text-[#0b0e14]">
                    <Star size={14} fill="currentColor" />
                </div>
                <span className="text-white text-xs font-bold uppercase tracking-widest">
                    Onboarding Milestone: <span className="text-[#66bc7b]">MD. Hasibul Islam Mitul</span> has engaged with {employees.length} people.
                </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">Full <span className="text-[#66bc7b]">Directory</span></h1>
            <p className="text-white/40 text-lg max-w-xl">Meet every visionary building at Polygon Technology Bangladesh.</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="flex gap-4">
                <button 
                    onClick={handleMeetBot}
                    className="bg-[#66bc7b] text-[#0b0e14] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[#66bc7b]/20"
                >
                    <Bot size={18} />
                    Meet a PolyBot
                </button>
                <button 
                    onClick={loadData}
                    className="p-3 text-white/40 hover:text-[#66bc7b] transition-colors bg-white/5 rounded-xl border border-white/5"
                >
                    <RefreshCw size={18} className={cn(loading && "animate-spin")} />
                </button>
            </div>
        </div>

        <Filters 
          search={search} 
          setSearch={setSearch} 
          department={department} 
          setDepartment={setDepartment} 
          departments={departments}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="hexagon-loader mb-6" />
            <p className="text-[#66bc7b] font-bold text-sm tracking-[0.3em] uppercase">Syncing Ecosystem...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredEmployees.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {filteredEmployees.map((emp, idx) => (
                  <EmployeeCard key={emp.id} employee={emp} index={idx} />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-white/5">
                <Users size={48} className="mx-auto text-white/20 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
                <p className="text-white/40">Broaden your search or check another department.</p>
              </div>
            )}
          </AnimatePresence>
        )}
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
              className="absolute inset-0 bg-[#0b0e14]/90 backdrop-blur-sm"
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent" />
                <button onClick={() => setSelectedBot(null)} className="absolute top-6 right-6 p-2 bg-black/40 rounded-full text-white"><X size={20}/></button>
              </div>
              <div className="p-8 text-center">
                <p className="text-[#66bc7b] text-[10px] font-black uppercase tracking-[0.3em] mb-2">{selectedBot.department}</p>
                <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">{selectedBot.name}</h3>
                <p className="text-white/60 font-bold mb-6 italic">{selectedBot.role}</p>
                <button onClick={() => setSelectedBot(null)} className="w-full bg-[#66bc7b] text-[#0b0e14] p-4 rounded-2xl font-bold">Close PolyBot</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
