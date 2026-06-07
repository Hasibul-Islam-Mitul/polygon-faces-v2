/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Github, Linkedin, Calendar, Briefcase, Palette, Instagram, Globe, Quote } from 'lucide-react';

export default function Developer() {
  return (
    <div className="min-h-screen bg-[#0b0e14] pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Profile Card */}
        <div className="bg-[#131722] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#66bc7b]/10 blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-12 p-8 md:p-16 relative z-10">
            <div className="w-full md:w-[350px] shrink-0">
              <div className="aspect-square rounded-[2.5rem] overflow-hidden border-4 border-white/5 relative group bg-[#0b0e14]">
                <img 
                  src="/pfp square.jpg" 
                  alt="MD. Hasibul Islam Mitul" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-15070032111d1-1828f1146436?auto=format&fit=crop&q=80&w=400';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14]/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href="https://github.com/Hasibul-Islam-Mitul" target="_blank" className="p-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-[#66bc7b] hover:text-[#0b0e14] transition-all">
                        <Github size={18} />
                    </a>
                    <a href="https://www.linkedin.com/in/md-hasibul-islam-mitul/" target="_blank" className="p-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-[#66bc7b] hover:text-[#0b0e14] transition-all">
                        <Linkedin size={18} />
                    </a>
                    <a href="https://www.instagram.com/hasibul_islam_mitul/" target="_blank" className="p-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-[#66bc7b] hover:text-[#0b0e14] transition-all">
                        <Instagram size={18} />
                    </a>
                    <a href="https://sites.google.com/view/hasibul-islam-mitul/" target="_blank" className="p-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-[#66bc7b] hover:text-[#0b0e14] transition-all">
                        <Globe size={18} />
                    </a>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex mx-auto md:mx-0 items-center gap-2 px-3 py-1 rounded-full bg-[#66bc7b]/10 text-[#66bc7b] text-[10px] font-black uppercase tracking-[0.2em] mb-6 animate-pulse"
              >
                <Palette size={12} /> Technical Graphics intern
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-none text-center md:text-left"
              >
                MD. Hasibul <br />
                Islam Mitul
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/60 text-lg mb-8 leading-relaxed italic text-center md:text-left"
              >
                "Specializing in the visual architecture and automated systems for Polygon Technology Bangladesh. Bridging the gap between graphics and fintech."
              </motion.p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1 font-mono">
                        <Calendar size={12} /> Onboarded
                    </div>
                    <p className="text-white font-bold text-center md:text-left">May 1, 2026</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1 font-mono">
                        <Briefcase size={12} /> Team
                    </div>
                    <p className="text-white font-bold text-center md:text-left">Marketing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Most Memorable Experience Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#131722] border border-white/5 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl"
        >
          {/* Accent glow */}
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#66bc7b]/5 blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#66bc7b]/10 rounded-xl flex items-center justify-center text-[#66bc7b]">
                <Quote size={20} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">
                Most Memorable Experience
              </h2>
            </div>
            
            <div className="w-full h-[1px] bg-white/10 my-2" />

            <div className="relative">
              {/* Giant quote sign background */}
              <span className="absolute -top-10 -left-4 text-[12rem] font-sans font-black text-white/[0.02] select-none pointer-events-none leading-none">
                “
              </span>
              
              <p className="text-white/80 text-base md:text-lg leading-relaxed md:leading-loose text-justify font-normal pl-4 border-l-2 border-[#66bc7b]/20 relative z-10">
                "On my very first day as an intern, I never expected what was coming. Asad Bhai asked me about my co-curricular activities, and when I mentioned I was a Scout, he had me demonstrating loud commands and parade drills right there! I gave it my all, but then he said he wasn't fully satisfied, <span className="text-[#66bc7b] font-bold">You have to dance now.</span> After some hilarious bargaining (I really wanted that selfie for the website!), I gave in and tried some steps to a Bengali song. I was so shy and nervous doing some steps to a Bengali song, but looking back, it was the perfect ice-breaker. That moment instantly washed away all my anxiety, helped introduce me to almost the entire team, and made me feel immediately at home. I’ve worked in other places before, but the work culture and the people here are unmatched. It was the perfect, unforgettable start to my journey, and I’m proud to say I became one of his favorite juniors (well, at least I like to think so!)."
              </p>
            </div>
            
            <div className="mt-4 flex items-center justify-end gap-3 text-white/40 text-xs font-mono uppercase tracking-widest">
              <span>— Day One Onboarding</span>
              <span className="w-1.5 h-1.5 bg-[#66bc7b] rounded-full animate-ping" />
            </div>
          </div>
        </motion.div>

        {/* Footer info label */}
        <div className="text-center pt-4">
            <p className="text-white/25 text-xs font-medium uppercase tracking-[0.3em]">Official Developer Profile • Faces of Polygon</p>
        </div>
      </div>
    </div>
  );
}
