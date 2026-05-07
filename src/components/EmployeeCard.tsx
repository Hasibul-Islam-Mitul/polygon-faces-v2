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

  const ImageContent = ({ className, showInitials = false }: { className: string, showInitials?: boolean }) => {
    // Construct the image source exactly as requested: /faces/ + photoLink
    const photoLink = employee.photoLink || '';
    const imgSrc = photoLink.startsWith('http') 
      ? photoLink 
      : `/faces/${photoLink}`;

    if (imageError || !photoLink || imgSrc.endsWith('undefined') || imgSrc.endsWith('/faces/')) {
      return (
        <div className={cn("bg-[#1a1f2e] flex items-center justify-center text-white/20 select-none", className)}>
          <span className={cn("font-black tracking-tighter", showInitials ? "text-6xl" : "text-3xl")}>
            {getInitials(employee.name)}
          </span>
        </div>
      );
    }
    return (
      <img
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
          <div className="absolute inset-0 bg-[#66bc7b]/90 backdrop-blur-md p-8 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <QuoteIcon className="text-[#0b0e14] mb-4 opacity-50" size={32} />
            <p className="text-[#0b0e14] font-bold text-sm leading-relaxed italic">
              "{employee.quote || 'Building excellence at Polygon Technology Bangladesh.'}"
            </p>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent opacity-80 group-hover:opacity-0 transition-opacity" />
          
          <div className="absolute bottom-6 left-6 right-6 group-hover:opacity-0 transition-opacity">
            <p className="text-[#66bc7b] text-[10px] font-black uppercase tracking-[0.2em] mb-1">{employee.department}</p>
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
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
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
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                >
                  <X size={24} />
                </button>
                
                <span className="inline-flex px-3 py-1 bg-[#66bc7b]/10 text-[#66bc7b] rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 self-start">
                  {employee.department}
                </span>
                
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2">{employee.name}</h2>
                <p className="text-xl text-[#66bc7b] font-bold mb-8 italic">{employee.role}</p>
                
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 mb-8">
                    <QuoteIcon className="text-[#66bc7b] mb-4 opacity-30" size={24} />
                    <p className="text-white/80 leading-relaxed italic">{employee.quote || "Collaborating on the next generation of Fintech infrastructure for Bangladesh."}</p>
                </div>

                <div className="flex gap-4">
                    {employee.linkedin && (
                         <a href={employee.linkedin} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-[#0077b5] text-white rounded-xl font-bold transition-transform hover:scale-105">
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
