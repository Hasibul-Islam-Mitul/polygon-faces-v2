/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Github, Linkedin, Calendar, Briefcase, Palette, Instagram, Globe, Quote } from 'lucide-react';

export default function Developer() {
  return (
    <div className="relative min-h-screen bg-[#0b0e14] pt-32 pb-20 px-4 overflow-hidden">
      {/* Standalone Keyframe Wave Styles */}
      <style>{`
        @keyframes waveFloat1 {
          0% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(-5%) scaleY(1.1) skewY(-2deg); }
          100% { transform: translateX(0) scaleY(1); }
        }
        @keyframes waveFloat2 {
          0% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(5%) scaleY(0.9) skewY(2deg); }
          100% { transform: translateX(0) scaleY(1); }
        }
        @keyframes waveFloat3 {
          0% { transform: translateY(0) scaleX(1); }
          50% { transform: translateY(-3%) scaleX(1.05); }
          100% { transform: translateY(0) scaleX(1); }
        }
        .animate-wave-path1 {
          animation: waveFloat1 15s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .animate-wave-path2 {
          animation: waveFloat2 20s ease-in-out infinite;
          animation-delay: -4s;
          transform-origin: center bottom;
        }
        .animate-wave-path3 {
          animation: waveFloat3 25s ease-in-out infinite;
          animation-delay: -8s;
          transform-origin: center bottom;
        }
      `}</style>

      {/* Layered SVG Fluid Waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 leading-[0]">
        {/* Top-Right Neon Gradient Backing Orb */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#66bc7b]/10 to-[#8247e5]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#66bc7b]/5 to-[#ff3e6c]/5 blur-[150px] rounded-full pointer-events-none" />

        <svg
          id="fluid-wave-layers"
          className="absolute bottom-0 left-0 w-full h-[55%] min-h-[400px]"
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Wave 3: Deep backing wave */}
          <path
            className="animate-wave-path3 opacity-[0.12]"
            d="M0,320 C320,420 640,240 960,340 C1280,440 1360,280 1440,300 L1440,600 L0,600 Z"
            fill="url(#wave-gradient-purple)"
          />
          {/* Wave 2: Middle contrasting wave */}
          <path
            className="animate-wave-path2 opacity-[0.18]"
            d="M0,240 C400,140 800,340 1200,220 C1320,180 1380,240 1440,260 L1440,600 L0,600 Z"
            fill="url(#wave-gradient-cyan)"
          />
          {/* Wave 1: Foreground primary wave */}
          <path
            className="animate-wave-path1 opacity-[0.25]"
            d="M0,160 C360,60 720,260 1080,180 C1260,140 1350,220 1440,240 L1440,600 L0,600 Z"
            fill="url(#wave-gradient-green)"
          />

          <defs>
            <linearGradient id="wave-gradient-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#131722" />
              <stop offset="50%" stopColor="#66bc7b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0b0e14" />
            </linearGradient>
            <linearGradient id="wave-gradient-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0b0e14" />
              <stop offset="40%" stopColor="#00d2ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#131722" />
            </linearGradient>
            <linearGradient id="wave-gradient-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#131722" />
              <stop offset="60%" stopColor="#8247e5" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0b0e14" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Profile Card */}
        <div className="bg-[#131722]/85 backdrop-blur-md border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
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
                className="inline-flex mx-auto md:mx-0 items-center justify-center gap-2 px-3 py-1 rounded-full bg-[#66bc7b]/10 text-[#66bc7b] text-[10px] font-black uppercase tracking-[0.2em] mb-6 animate-pulse"
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
          className="bg-[#131722]/85 backdrop-blur-md border border-white/5 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl z-10"
        >
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
