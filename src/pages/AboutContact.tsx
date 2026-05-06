/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Mail, MapPin, Globe, Shield, Zap, Target, Heart } from 'lucide-react';

export default function AboutContact() {
  const values = [
    { title: 'Fintech First', desc: 'Building seamless Merchant Onboarding ecosystems.', icon: Zap },
    { title: 'Regional Focus', desc: 'Serving the growing digital economy of Bangladesh.', icon: Globe },
    { title: 'Brand Identity', desc: 'Crafting high-end visual systems for enterprises.', icon: Target },
    { title: 'Technical Excellence', desc: 'High-performance digital infrastructure.', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#0b0e14] pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* About Section */}
        <div className="flex flex-col lg:flex-row gap-20 items-center mb-32">
          <div className="flex-1">
            <h2 className="text-[#66bc7b] font-bold uppercase tracking-[0.3em] text-xs mb-4">Polygon Technology Bangladesh</h2>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
              Engineering <br />
              <span className="text-[#66bc7b]">The Future.</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl">
              Headquartered in Dhaka, Polygon Technology is a specialized firm focusing on building high-performance digital infrastructure and Fintech solutions. We empower 50M+ users through our ecosystem of merchant tools and software systems.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {values.map((v, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="mt-1 text-[#66bc7b]">
                    <v.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1">{v.title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-[4/3] bg-[#131722] border border-white/10 rounded-[3rem] overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" alt="Polygon Office" className="w-full h-full object-cover transition-all duration-700" />
                <div className="absolute inset-0 bg-[#66bc7b]/20 mix-blend-overlay" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#66bc7b]/10 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>

        {/* Contact & Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-20 border-t border-white/5">
          <div className="bg-[#131722] p-8 md:p-12 rounded-[2.5rem] border border-white/5 flex flex-col justify-center">
            <h3 className="text-[#66bc7b] font-bold uppercase tracking-[0.2em] text-[10px] mb-4">Inquiries</h3>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter">Connect with the <span className="text-[#66bc7b]">HQ</span></h2>
            
            <div className="space-y-6">
               <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-[#66bc7b]/10 rounded-2xl flex items-center justify-center text-[#66bc7b] group-hover:bg-[#66bc7b] group-hover:text-[#0b0e14] transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Email Us</p>
                    <p className="text-white font-bold">info@polygontechnology.io</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-[#66bc7b]/10 rounded-2xl flex items-center justify-center text-[#66bc7b] group-hover:bg-[#66bc7b] group-hover:text-[#0b0e14] transition-all">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Headquarters</p>
                    <p className="text-white font-bold text-sm">Dhaka, Bangladesh</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#66bc7b]/10 rounded-2xl flex items-center justify-center text-[#66bc7b]">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Technical Support</p>
                    <p className="text-white font-bold">support@polygontechnology.io</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="h-[500px] bg-[#131722] border border-white/10 rounded-[3rem] overflow-hidden relative shadow-2xl group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.5779271000633!2d90.4023227752998!3d23.79803978694587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70f85efffff%3A0xc4331b847509cbef!2sPolygon%20Technology!5e0!3m2!1sen!2sbd!4v1777973437800!5m2!1sen!2sbd" 
                className="w-full h-full grayscale invert opacity-50 group-hover:opacity-80 transition-opacity duration-700" 
                style={{ border: 0, filter: 'hue-rotate(60deg) saturate(0.5)' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="absolute bottom-10 left-10 p-5 bg-[#0b0e14]/90 backdrop-blur-md rounded-[2rem] border border-white/10 flex items-center gap-4">
                <div className="w-3 h-3 bg-[#66bc7b] rounded-full animate-ping" />
                <div>
                   <span className="block text-white text-[10px] font-black uppercase tracking-widest leading-none mb-1">Dhaka HQ</span>
                   <span className="text-white/40 text-[8px] font-bold uppercase tracking-wider">Live Operation View</span>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
