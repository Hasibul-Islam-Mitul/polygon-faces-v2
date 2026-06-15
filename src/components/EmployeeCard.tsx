/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Linkedin, ExternalLink, X, Quote as QuoteIcon } from 'lucide-react';
import { Employee } from '../types';
import { cn } from '../lib/utils';

interface EmployeeCardProps {
  employee: Employee;
  index: number;
  key?: string | number;
  onClick?: () => void;
}

const BENGALI_ROASTS = [
  "Chhobi chara dynamic UI? Eto bhalo coding jani na bhai!",
  "Frame khali! Back-end database bodhoy apnake khujche!",
  "Chhobi tola ki strictly confidential naki bhai? :))",
  "Chhobi dile crash khabe na, crush khabe!",
  "Chhobi chara profile dekhte thiki database error er moto lage!",
  "Chhobi chara employee? System-e to compile korche na!"
];

const getRoastForEmployee = (index: number) => {
  return BENGALI_ROASTS[index % BENGALI_ROASTS.length];
};

export default function EmployeeCard({ employee, index, onClick }: EmployeeCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getGradientForString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const gradients = [
      "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #65bc7b 100%)",
      "linear-gradient(135deg, #090d16 0%, #111827 50%, #65bc7b 100%)",
      "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #65bc7b 100%)",
      "linear-gradient(135deg, #0f1c24 0%, #1d3557 60%, #65bc7b 100%)",
      "linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #65bc7b 100%)",
      "linear-gradient(135deg, #1b4d3e 0%, #0b0e14 60%, #65bc7b 100%)",
      "linear-gradient(135deg, #070a0e 0%, #0f172a 50%, #65bc7b 100%)"
    ];
    const indexStr = Math.abs(hash) % gradients.length;
    return gradients[indexStr];
  };

  const ImageContent = ({ className, showInitials = false }: { className: string, showInitials?: boolean }) => {
    const photoLink = employee.photoLink || '';
    const imgSrc = photoLink.startsWith('http') 
      ? photoLink 
      : `/faces/${photoLink}`;

    if (imageError || !photoLink || imgSrc.endsWith('undefined') || imgSrc.endsWith('/faces/')) {
      const roast = getRoastForEmployee(index);
      return (
        <div 
          id={`avatar-card-container-${employee.id}`}
          className={cn("relative flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-gradient-to-br from-[#0c0f16] to-[#050608] border border-[#ff3e6c]/20 select-none transition-all duration-500 hover:scale-105", className)}
        >
          {/* Subtle warning backdrop lines */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ff3e6c_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Hover neon pulse outline ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 inset-y-0 border border-[#ff3e6c]/10 rounded-full m-8 pointer-events-none scale-105"
          />

          {/* Sarcastic roast text */}
          <div className="z-10 flex flex-col items-center gap-4 max-w-[95%]">
            <span className="px-2.5 py-1 bg-[#ff3e6c]/10 rounded-md text-[8px] font-mono font-black text-[#ff3e6c] tracking-widest uppercase border border-[#ff3e6c]/20 animate-pulse">
              [ NO_PHOTO_ERROR ]
            </span>
            <p className="font-mono text-xs text-white/95 leading-relaxed italic border-l-2 border-[#ff3e6c]/40 pl-3">
              "{roast}"
            </p>
            <span className="font-mono text-[9px] text-[#ff3e6c]/40 font-bold uppercase tracking-wider">
              {getInitials(employee.name)} // ID: {employee.id.substring(0, 5).toUpperCase()}
            </span>
          </div>
        </div>
      );
    }
    return (
      <img
        id={`avatar-image-${employee.id}`}
        src={imgSrc}
        alt={employee.name}
        loading="lazy"
        decoding="async"
        className={className}
        onError={() => setImageError(true)}
      />
    );
  };

  return (
    <>
      <motion.div
        id={`employee-grid-card-${employee.id}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: (index % 8) * 0.05 }}
        whileHover={{ y: -10 }}
        onClick={onClick || (() => setIsModalOpen(true))}
        className="group relative bg-[#131722] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer"
      >
        <div className="aspect-[4/5] relative overflow-hidden">
          <ImageContent className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-[#65bc7b]/90 backdrop-blur-md p-8 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <QuoteIcon className="text-[#0b0e14] mb-4 opacity-50" size={32} />
            <p className="text-[#0b0e14] font-bold text-sm leading-relaxed italic">
              "{employee.quote || 'Building excellence at Polygon Technology Bangladesh.'}"
            </p>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent opacity-80 group-hover:opacity-0 transition-opacity" />
          
          <div className="absolute bottom-6 left-6 right-6 group-hover:opacity-0 transition-opacity">
            <p className="text-[#65bc7b] text-[10px] font-black uppercase tracking-[0.2em] mb-1">{employee.department}</p>
            <h3 className="text-xl font-black text-white tracking-tighter">{employee.name}</h3>
            <p className="text-white/40 text-xs font-bold">{employee.role}</p>
          </div>
        </div>

        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
          <div className="bg-white p-2 rounded-xl text-[#0b0e14] shadow-xl">
            <ExternalLink size={16} />
          </div>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div id={`employee-detail-modal-${employee.id}`} className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#0b0e14]/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative w-full max-w-4xl min-h-[550px] bg-[#131722] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row z-[102]"
            >
              {/* Left Column: Landscape Aspect-locked Edge-to-edge frame portrait (Completely removed circular borders) */}
              <div className="md:w-[38%] relative bg-[#090b10] border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-stretch justify-center overflow-hidden shrink-0">
                <div className="w-full h-full min-h-[300px] md:min-h-full relative select-none">
                  <ImageContent className="absolute inset-0 w-full h-full object-cover" showInitials />
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 left-6 p-2 bg-black/60 hover:bg-white/15 rounded-full text-white transition-colors md:hidden z-10"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Right Column: Prominent shield profile details split container */}
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-between relative overflow-y-auto">
                <button 
                  id={`close-modal-button-${employee.id}`}
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors hidden md:block"
                >
                  <X size={16} />
                </button>

                <div className="flex flex-col gap-6">
                  {/* Boosted Name Profile Identity matches of directory */}
                  <div className="flex flex-col gap-1.5 matches-directory-identity">
                    <p className="text-[#65bc7b] text-base md:text-lg font-extrabold uppercase tracking-widest font-mono">
                      {employee.department} DEPARTMENT
                    </p>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
                      {employee.name}
                    </h2>
                  </div>

                  {/* Designation Registry Detail */}
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white/80 tracking-tight uppercase">
                      {employee.role}
                    </h3>
                  </div>

                  {/* Massively sized employee voice quote block */}
                  <div className="p-8 bg-[#0b0e14]/65 border border-white/5 rounded-3xl relative overflow-hidden mt-3">
                    <p className="text-xl md:text-2xl font-black text-white leading-relaxed italic tracking-tight text-left">
                      "{employee.quote || 'No comment recorded.'}"
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex gap-4">
                    {employee.linkedin && (
                      <a 
                        href={employee.linkedin} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#0077b5] text-white rounded-full font-black text-xs uppercase tracking-wider transition-transform hover:scale-105"
                      >
                        <Linkedin size={14} /> LinkedIn
                      </a>
                    )}
                  </div>

                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="bg-[#65bc7b] text-[#0b0e14] px-8 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
