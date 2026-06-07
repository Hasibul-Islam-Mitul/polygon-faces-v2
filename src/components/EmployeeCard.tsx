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
}

export default function EmployeeCard({ employee, index }: EmployeeCardProps) {
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
      "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #65bc7b 100%)", // Slate charcoal with Polygon green
      "linear-gradient(135deg, #090d16 0%, #111827 50%, #65bc7b 100%)", // Rich dark gray and Polygon green
      "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #65bc7b 100%)", // Indigo overlay with Polygon green
      "linear-gradient(135deg, #0f1c24 0%, #1d3557 60%, #65bc7b 100%)", // Deep navy blue with Polygon green
      "linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #65bc7b 100%)", // Midnight blue and Polygon green
      "linear-gradient(135deg, #1b4d3e 0%, #0b0e14 60%, #65bc7b 100%)", // Forest emerald deep slate with Polygon green
      "linear-gradient(135deg, #070a0e 0%, #0f172a 50%, #65bc7b 100%)"  // Extreme dark charcoal with Polygon green
    ];
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  const ImageContent = ({ className, showInitials = false }: { className: string, showInitials?: boolean }) => {
    const photoLink = employee.photoLink || '';
    const imgSrc = photoLink.startsWith('http') 
      ? photoLink 
      : `/faces/${photoLink}`;

    if (imageError || !photoLink || imgSrc.endsWith('undefined') || imgSrc.endsWith('/faces/')) {
      // Procedural colorful gradient background based on department + name string length
      const seedString = `${employee.name}-${employee.department || 'Operations'}-${employee.name.length}`;
      const gradient = getGradientForString(seedString);
      return (
        <div 
          id={`avatar-card-container-${employee.id}`}
          className={cn("relative flex items-center justify-center overflow-hidden group/avatar select-none transition-all duration-500 hover:scale-105", className)}
          style={{ background: gradient }}
        >
          {/* Animated Futuristic Tech Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-white/10 rounded-full m-4 pointer-events-none scale-105"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-dashed border-white/5 rounded-full m-8 pointer-events-none"
          />
          
          {/* Futuristic technical ID metadata label */}
          <div className="absolute top-4 left-4 font-mono text-[8px] text-white/40 tracking-wider">
            POLY_ID // {employee.id.substring(0, 5).toUpperCase()}
          </div>
          
          {/* Circular abstract vector human contour with pulse hover frame */}
          <div 
            id={`avatar-fallback-${employee.id}`}
            className="absolute w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/5 border border-white/10 hover:border-[#65bc7b]/40 flex items-center justify-center backdrop-blur-[4px] transition-all duration-500 group-hover/avatar:scale-110 group-hover/avatar:border-[#65bc7b]/60 shadow-2xl overflow-hidden"
          >
            {/* Glowing tactical halo on hover */}
            <span className="absolute inset-0 rounded-full border border-[#65bc7b]/0 group-hover/avatar:border-[#65bc7b]/20 group-hover/avatar:scale-105 transition-all duration-700 animate-pulse" />

            {/* Clean, semi-transparent human profile vector silhouette */}
            <svg 
              className="absolute w-20 h-20 text-white/10 group-hover/avatar:text-white/20 transition-all duration-300 pointer-events-none"
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>

            {/* Employee's standard text initials rendered cleanly over or beside it */}
            <span className="relative font-mono text-2xl md:text-3xl font-extrabold text-white/90 group-hover/avatar:text-white tracking-widest select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all duration-300">
              {getInitials(employee.name)}
            </span>

            {/* Micro badge indicator inside frame */}
            <div className="absolute bottom-3 font-mono text-[8px] font-black text-[#65bc7b] uppercase tracking-widest leading-none opacity-40 group-hover/avatar:opacity-100 transition-opacity duration-300">
              {(employee.department || 'OPS').substring(0, 3)}
            </div>
          </div>

          <div className="absolute bottom-4 right-4 font-mono text-[8px] text-white/30 tracking-tight">
            DEPT // {(employee.department || 'OPS').substring(0, 3).toUpperCase()}
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
        onClick={() => setIsModalOpen(true)}
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
              className="relative w-full max-w-4xl bg-[#131722] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 aspect-square md:aspect-auto overflow-hidden">
                <ImageContent className="w-full h-full object-cover" showInitials />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <button 
                  id={`close-modal-button-${employee.id}`}
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                >
                  <X size={24} />
                </button>
                
                <span className="inline-flex px-3 py-1 bg-[#65bc7b]/10 text-[#65bc7b] rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 self-start">
                  {employee.department}
                </span>
                
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2">{employee.name}</h2>
                <p className="text-xl text-[#65bc7b] font-bold mb-8 italic">{employee.role}</p>
                
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 mb-8">
                    <QuoteIcon className="text-[#65bc7b] mb-4 opacity-30" size={24} />
                    <p className="text-white/80 leading-relaxed italic">{employee.quote || "Collaborating on the next generation of Fintech infrastructure for Bangladesh."}</p>
                </div>

                <div className="flex gap-4">
                    {employee.linkedin && (
                         <a href={employee.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-[#0077b5] text-white rounded-xl font-bold transition-transform hover:scale-105">
                            <Linkedin size={20} /> LinkedIn
                        </a>
                    )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
