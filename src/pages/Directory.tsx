/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, RefreshCw, Bot, X, Star } from 'lucide-react';
import { fetchEmployeeData, shuffleArray } from '../lib/csv-utils';
import { Employee } from '../types';
import EmployeeCard from '../components/EmployeeCard';
import Filters from '../components/Filters';
import { cn } from '../lib/utils';

const BENGALI_ROASTS = [
  "Chhobi chara dynamic UI? Eto bhalo coding jani na bhai!",
  "Chobi tulen nai? Back-end database bodhoy apnakei khujche!",
  "Chhobi tola ki strictly confidential naki bhai? senti khelam :))",
  "Chhobi dile crash khabe na, crush khabe!",
  "Chhobi chara profile dekhte thiki database error er moto lage!",
  "Chhobi chara employee? System-e to compile korche na!"
];

const getRoastForEmployee = (id: string | number) => {
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % BENGALI_ROASTS.length;
  return BENGALI_ROASTS[index];
};

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

      {/* PolyBot Widescreen Landscape Modal */}
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
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-3xl bg-[#131722] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[400px] z-50"
            >
              {/* Left Column: Portrait space / Roast Fallback */}
              <div className="md:w-[35%] relative bg-[#0d1016] border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center justify-center p-8 select-none">
                {((selectedBot.photoLink || selectedBot.image) && !((selectedBot.photoLink || selectedBot.image).includes('none')) && !botImageError) ? (
                  <div className="w-40 h-40 md:w-44 md:h-44 rounded-full border-2 border-[#66bc7b] overflow-hidden relative shadow-2xl">
                    <img 
                      src={(selectedBot.photoLink || selectedBot.image).startsWith('http') ? (selectedBot.photoLink || selectedBot.image) : `/faces/${(selectedBot.photoLink || selectedBot.image)}`} 
                      alt={selectedBot.name} 
                      className="w-full h-full object-cover" 
                      onError={() => setBotImageError(true)}
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-[#ff3e6c]/15 to-[#0b0e14] border-2 border-[#ff3e6c]/35 flex flex-col items-center justify-center p-4 text-center">
                    <span className="px-2 py-0.5 bg-[#ff3e6c]/10 rounded text-[7px] font-mono font-black text-[#ff3e6c] uppercase tracking-wider mb-2">[ DATA_EMPTY ]</span>
                    <p className="text-white/85 font-mono text-[9px] leading-tight italic">
                      "{getRoastForEmployee(selectedBot.id)}"
                    </p>
                  </div>
                )}
                
                <button 
                  onClick={() => setSelectedBot(null)}
                  className="absolute top-6 left-6 p-2 bg-black/40 hover:bg-white/15 rounded-full text-white transition-colors md:hidden"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Right Column: Information layout */}
              <div className="flex-1 p-8 md:p-11 flex flex-col justify-between relative">
                <button 
                  onClick={() => setSelectedBot(null)}
                  className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors hidden md:block"
                >
                  <X size={16} />
                </button>

                <div className="flex flex-col gap-6">
                  {/* Subtle tag top display */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono tracking-wide text-white/70">
                      Operator tag: {selectedBot.name}
                    </span>
                    <span className="px-3 py-1 bg-[#66bc7b]/10 border border-[#66bc7b]/20 rounded-full text-[9px] font-mono tracking-wider font-extrabold text-[#66bc7b] uppercase">
                      {selectedBot.department}
                    </span>
                  </div>

                  {/* designation text fields enlarged */}
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none animate-pulse">
                      {selectedBot.role}
                    </h3>
                    <p className="text-white/40 text-[9px] uppercase tracking-widest mt-1">Designation Registry Node</p>
                  </div>

                  {/* massively enlarged quotes */}
                  <div className="p-6 bg-[#0b0e14]/60 border border-white/5 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-2 left-3 font-mono text-[8px] text-[#66bc7b]/40">[ SENTIMENT_STATEMENT ]</div>
                    <p className="text-xl md:text-2xl font-black text-white leading-relaxed italic tracking-tight text-left pt-2">
                      "{selectedBot.quote || 'No comment recorded.'}"
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">Widescreen Polybot v2.5</span>
                  <button 
                    onClick={() => setSelectedBot(null)}
                    className="bg-[#66bc7b] text-[#0b0e14] px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
