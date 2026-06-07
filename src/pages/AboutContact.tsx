/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Mail, MapPin, Globe, Shield, Zap, Target } from 'lucide-react';

export default function AboutContact() {
  const values = [
    { title: 'Fintech First', desc: 'Building seamless Merchant Onboarding ecosystems.', icon: Zap },
    { title: 'Regional Focus', desc: 'Serving the growing digital economy of Bangladesh.', icon: Globe },
    { title: 'Brand Identity', desc: 'Crafting high-end visual systems for enterprises.', icon: Target },
    { title: 'Technical Excellence', desc: 'High-performance digital infrastructure.', icon: Shield },
  ];

  return (
    <div id="about-page-container" className="min-h-screen bg-[#0b0e14] pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* About Section */}
        <div className="flex flex-col lg:flex-row gap-20 items-center mb-32">
          <div className="flex-1">
            <h2 className="text-[#65bc7b] font-bold uppercase tracking-[0.3em] text-xs mb-4">Polygon Technology</h2>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
              Engineering <br />
              <span className="text-[#65bc7b]">The Future.</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl">
              Polygon Technology is a specialized firm focusing on building high-performance digital infrastructure and Fintech solutions. We empower 50M+ users through our ecosystem of merchant tools and software systems.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {values.map((v, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -6 }}
                  className="flex gap-4 p-5 bg-[#131722] rounded-2xl border border-white/5 cursor-pointer shadow-xl transition-all hover:border-[#65bc7b]/20"
                >
                  <div className="mt-1 text-[#65bc7b]">
                    <v.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1">{v.title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-[4/3] bg-[#131722] border-2 border-[#65bc7b]/30 group-hover:border-[#65bc7b] rounded-[3rem] overflow-hidden relative group shadow-[0_0_30px_rgba(101,188,123,0.15)] transition-all duration-500">
                {/* Office cover.png with premium hover scale and subtle glowing border */}
                <img 
                  src="/cover.png" 
                  alt="Polygon Technology Team" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-[#65bc7b]/10 mix-blend-overlay group-hover:bg-[#65bc7b]/0 transition-all duration-500" />
            </div>
            {/* Ambient emerald backlight aura */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#65bc7b]/15 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>

        {/* Contact & Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-20 border-t border-white/5">
          <div className="bg-[#131722] p-8 md:p-12 rounded-[2.5rem] border border-white/5 flex flex-col justify-center">
            <h3 className="text-[#65bc7b] font-bold uppercase tracking-[0.2em] text-[10px] mb-4">Inquiries</h3>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter">Connect with <span className="text-[#65bc7b]">Polygon Technology</span></h2>
            
            <div className="space-y-6">
               <motion.div 
                 whileHover={{ y: -4 }}
                 className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/[0.02] cursor-pointer transition-all border border-transparent hover:border-white/5"
               >
                  <div className="w-12 h-12 bg-[#65bc7b]/10 rounded-2xl flex items-center justify-center text-[#65bc7b] group-hover:bg-[#65bc7b] group-hover:text-[#0b0e14] transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Email Us</p>
                    <p className="text-white font-bold text-sm">info@polygontechnology.io</p>
                  </div>
               </motion.div>
               <motion.div 
                 whileHover={{ y: -4 }}
                 className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/[0.02] cursor-pointer transition-all border border-transparent hover:border-white/5"
               >
                  <div className="w-12 h-12 bg-[#65bc7b]/10 rounded-2xl flex items-center justify-center text-[#65bc7b] group-hover:bg-[#65bc7b] group-hover:text-[#0b0e14] transition-all">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Location</p>
                    <p className="text-white font-bold text-sm">Dhaka, Bangladesh</p>
                  </div>
               </motion.div>
               <motion.div 
                 whileHover={{ y: -4 }}
                 className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/[0.02] cursor-pointer transition-all border border-transparent hover:border-white/5"
               >
                  <div className="w-12 h-12 bg-[#65bc7b]/10 rounded-2xl flex items-center justify-center text-[#65bc7b] group-hover:bg-[#65bc7b] group-hover:text-[#0b0e14] transition-all">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Technical Support</p>
                    <p className="text-white font-bold text-sm">support@polygontechnology.io</p>
                  </div>
               </motion.div>
            </div>
          </div>

          <div className="h-[500px] bg-[#131722] border border-[#65bc7b]/20 rounded-[3rem] overflow-hidden relative shadow-2xl group transition-all duration-500 hover:border-[#65bc7b]/40">
              {/* High-Fidelity Accent Tinted Google Maps iframe */}
              <div className="w-full h-full select-none overflow-hidden relative">
                <iframe 
                  id="google-maps-frame"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.5779271000633!2d90.4023227752998!3d23.79803978694587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70f85efffff%3A0xc4331b847509cbef!2sPolygon%20Technology!5e0!3m2!1sen!2sbd!4v1777973437800!5m2!1sen!2sbd" 
                  className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-700 filter saturate-[0.8] contrast-[1.1]" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                {/* Brand Tint Overlay using mix-blend-color for a sleek custom tactical vibe */}
                <div className="absolute inset-0 bg-[#65bc7b]/10 mix-blend-color pointer-events-none group-hover:bg-transparent transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-[#0b0e14]/40 pointer-events-none" />
              </div>
              
              <div className="absolute bottom-10 left-10 p-5 bg-[#0b0e14]/90 backdrop-blur-md rounded-[2rem] border border-white/10 flex items-center gap-4">
                <div className="w-3 h-3 bg-[#65bc7b] rounded-full animate-ping" />
                <div>
                   <span className="block text-white text-[10px] font-black uppercase tracking-widest leading-none mb-1">Polygon Technology</span>
                   <span className="text-white/40 text-[8px] font-bold uppercase tracking-wider">Live Operation View</span>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
