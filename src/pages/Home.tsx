/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Globe, 
  Shield, 
  Zap, 
  Users, 
  Bot, 
  X, 
  Star, 
  TrendingUp, 
  Smile 
} from 'lucide-react';
import { fetchEmployeeData, shuffleArray } from '../lib/csv-utils';
import { Employee } from '../types';
import EmployeeCard from '../components/EmployeeCard';
import { cn } from '../lib/utils';

// Sarcastic Bengali roasts system
const BENGALI_ROASTS = [
  "Chhobi chara dynamic UI? Eto bhalo coding jani na bhai!",
  "Frame khali! Back-end database bodhoy apnake khujche!",
  "Chhobi tola ki strictly confidential naki bhai? :))",
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

// Centralised static categories schema matching brand guidelines
const CATEGORIES_SCHEMA = [
  {
    name: 'Culture',
    keywords: ['nice', 'friendly', 'good', 'great', 'culture', 'environment', 'atmosphere', 'people', 'warm', 'supportive']
  },
  {
    name: 'Tech & Architecture',
    keywords: ['tech', 'code', 'blockchain', 'polygon', 'system', 'build', 'engineering', 'platform', 'payment', 'ledger']
  },
  {
    name: 'Mentorship',
    keywords: ['learn', 'grow', 'intern', 'junior', 'senior', 'mentor', 'guidance', 'career', 'roadmap', 'pathway']
  },
  {
    name: 'Collaboration',
    keywords: ['help', 'team', 'support', 'coordination', 'together', 'bhai', 'dynamics', 'cooperative']
  },
  {
    name: 'No Comments',
    keywords: [] as string[]
  },
  {
    name: 'Others',
    keywords: [] as string[]
  }
];

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBot, setSelectedBot] = useState<Employee | null>(null);
  const [botImageError, setBotImageError] = useState(false);

  // States for interactive stats & quotes
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{ name: string; keywords: string[] } | null>(null);

  const featuredTalentRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchEmployeeData();
    setEmployees(shuffleArray(data)); 
    setLoading(false);
  };

  const handleMeetBot = () => {
    if (employees.length > 0) {
      const randomIndex = Math.floor(Math.random() * employees.length);
      setSelectedBot(employees[randomIndex]);
      setBotImageError(false);
    }
  };

  // Carousel Slow Horizontal Autoplay logic + full drag support + mouse hover pauses
  useEffect(() => {
    const el = carouselRef.current;
    if (!el || loading || employees.length === 0) return;
    
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const scroll = (time: number) => {
      if (!isCarouselHovered && !isDragging && el) {
        const elapsed = time - lastTime;
        el.scrollLeft += 0.03 * elapsed; // Slowly shift leftward
        
        // Loop back to start if scrolled near edge
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) {
          el.scrollLeft = 0;
        }
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(scroll);
    };
    
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isCarouselHovered, isDragging, loading, employees]);

  // Support sideways scroll gesture via desktop vertical mouse wheel inside the container
  const handleCarouselWheel = (e: React.WheelEvent) => {
    const el = carouselRef.current;
    if (el) {
      if (e.deltaY !== 0) {
        el.scrollLeft += e.deltaY;
      }
    }
  };

  // Click & Drag support for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = carouselRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsCarouselHovered(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = carouselRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5; 
    el.scrollLeft = scrollLeftState - walk;
  };

  // Touch Swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const el = carouselRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const el = carouselRef.current;
    if (!el) return;
    const x = e.touches[0].pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftState - walk;
  };

  // Floating line-art hexagons matching hollow Polygon logo geometry
  const floatingHexagons = [
    { id: 1, left: "8%", top: "12%", size: 65, duration: 24, delay: 0, x: [0, 35, -20, 0], y: [0, -45, 25, 0] },
    { id: 2, left: "82%", top: "18%", size: 85, duration: 28, delay: 1.2, x: [0, -35, 40, 0], y: [0, 50, -35, 0] },
    { id: 3, left: "44%", top: "35%", size: 55, duration: 21, delay: 2.4, x: [0, 25, -25, 0], y: [0, 35, -45, 0] },
    { id: 4, left: "18%", top: "55%", size: 75, duration: 30, delay: 0.6, x: [0, -45, 25, 0], y: [0, -25, 55, 0] },
    { id: 5, left: "76%", top: "65%", size: 95, duration: 26, delay: 1.8, x: [0, 35, -35, 0], y: [0, 45, -25, 0] },
    { id: 6, left: "28%", top: "72%", size: 60, duration: 29, delay: 3.2, x: [0, -35, 25, 0], y: [0, -55, 35, 0] },
    { id: 7, left: "88%", top: "45%", size: 70, duration: 23, delay: 2.8, x: [0, -15, 45, 0], y: [0, -45, 15, 0] },
    { id: 8, left: "4%", top: "40%", size: 80, duration: 32, delay: 1.5, x: [0, 35, -25, 0], y: [0, -35, 45, 0] },
    { id: 9, left: "58%", top: "8%", size: 90, duration: 22, delay: 0.9, x: [0, -45, 25, 0], y: [0, 45, -25, 0] },
    { id: 10, left: "32%", top: "4%", size: 65, duration: 31, delay: 3.8, x: [0, 25, -35, 0], y: [0, -25, 35, 0] },
    { id: 11, left: "48%", top: "80%", size: 80, duration: 25, delay: 2.1, x: [0, -25, 25, 0], y: [0, 35, -40, 0] },
    { id: 12, left: "65%", top: "88%", size: 70, duration: 27, delay: 0.3, x: [0, 30, -30, 0], y: [0, -30, 30, 0] }
  ];

  // Highly engaging floating photo nodes that drift smoothly in non-linear, unpredictable organic motions
  const floatingPhotoNodes = useMemo(() => {
    if (employees.length === 0) return [];
    const pool = employees.filter(e => e.photoLink && !e.photoLink.includes('none'));
    const sourceList = pool.length > 5 ? pool : employees;
    
    const nodes = [];
    const count = Math.min(15, sourceList.length || 1);
    for (let i = 0; i < count; i++) {
      const emp = sourceList[i % sourceList.length];
      
      const startX = 5 + (i * 90 / count) + (Math.sin(i) * 3); 
      const startY = 12 + ((i * 17) % 65); 
      
      const dx = [0, (Math.sin(i) * 45), (Math.cos(i) * -40), 0];
      const dy = [0, (Math.cos(i) * -45), (Math.sin(i) * 40), 0];
      const duration = 24 + (i * 3) % 20; 
      const delay = (i * 1.3) % 4;
      const size = 55 + (i * 7) % 35; 
      const borderColor = i % 2 === 0 ? '#65bc7b' : '#8247e5';

      nodes.push({
        id: `drift-${emp.id}-${i}`,
        employee: emp,
        style: {
          left: `${startX}%`,
          top: `${startY}%`,
          width: size,
          height: size,
        },
        animate: {
          x: dx,
          y: dy,
          rotate: [0, i % 2 === 0 ? 30 : -35, i % 2 === 0 ? -30 : 35, 0],
          scale: [1, 1.1, 0.9, 1]
        },
        duration,
        delay,
        borderColor
      });
    }
    return nodes;
  }, [employees]);

  // Dynamic department slices for Employee Distribution Chart (Chart 1)
  const departmentSlices = useMemo(() => {
    const total = employees.length || 1;
    const countsMap: { [key: string]: number } = {};
    employees.forEach(emp => {
      const dept = emp.department || 'Operations';
      countsMap[dept] = (countsMap[dept] || 0) + 1;
    });

    const depts = Object.keys(countsMap).sort();
    const chartColors = ['#8247e5', '#3b82f6', '#ec4899', '#f97316', '#06b6d4', '#65bc7b'];
    const computed = depts.map((name, index) => {
      const count = countsMap[name];
      const percentage = Math.round((count / total) * 100);
      return {
        ...CATEGORIES_SCHEMA[index % CATEGORIES_SCHEMA.length], 
        name,
        count,
        percentage,
        color: chartColors[index % chartColors.length]
      };
    });

    let cumulative = 0;
    return computed.map(item => {
      const currentCumulative = cumulative;
      cumulative += (item.count / total) * 100;
      return {
        ...item,
        cumulativePercentageBefore: currentCumulative,
        cumulativePercentageAfter: cumulative,
        strokeOffset: 100 - cumulative
      };
    });
  }, [employees]);

  // Centralised Sentiment/Quote Categorization Engine (Chart 2)
  const sentimentSlices = useMemo(() => {
    const total = employees.length || 1;
    
    const countsMap: { [key: string]: number } = {
      'Culture': 0,
      'Tech & Architecture': 0,
      'Mentorship': 0,
      'Collaboration': 0,
      'No Comments': 0,
      'Others': 0
    };

    employees.forEach(emp => {
      const quote = (emp.quote || '').trim().toLowerCase();
      
      const isNoComment = !quote || 
                          quote === 'no comments' || 
                          quote === 'no comment' || 
                          quote === 'no comments.' || 
                          quote === 'no comment.' || 
                          quote === 'none' || 
                          quote === 'none.' ||
                          quote === 'na' || 
                          quote === 'n/a' || 
                          quote === 'n/a.' || 
                          quote.includes('no comment') ||
                          quote.includes('no comments');

      if (isNoComment) {
        countsMap['No Comments']++;
        return;
      }

      // Check positive culture keywords first
      const positiveKeywords = ['nice', 'friendly', 'good', 'great', 'culture', 'environment', 'atmosphere', 'people', 'warm', 'supportive'];
      if (positiveKeywords.some(kw => quote.includes(kw))) {
        countsMap['Culture']++;
        return;
      }

      // Check fintech themes keywords
      const fintechKeywords = ['tech', 'code', 'blockchain', 'polygon', 'system', 'build', 'engineering', 'platform', 'payment', 'ledger'];
      if (fintechKeywords.some(kw => quote.includes(kw))) {
        countsMap['Tech & Architecture']++;
        return;
      }

      // Check career learning keywords
      const growthKeywords = ['learn', 'grow', 'intern', 'junior', 'senior', 'mentor', 'guidance', 'career', 'roadmap', 'pathway'];
      if (growthKeywords.some(kw => quote.includes(kw))) {
        countsMap['Mentorship']++;
        return;
      }

      // Check team collaboration keywords
      const collaborationKeywords = ['help', 'team', 'support', 'coordination', 'together', 'bhai', 'dynamics', 'cooperative'];
      if (collaborationKeywords.some(kw => quote.includes(kw))) {
        countsMap['Collaboration']++;
        return;
      }

      countsMap['Others']++;
    });

    const chartBColors = ['#65bc7b', '#8247e5', '#3b82f6', '#ec4899', '#f97316', '#06b6d4'];

    const computed = CATEGORIES_SCHEMA.map((cat, index) => {
      const count = countsMap[cat.name] || 0;
      const percentage = Math.round((count / total) * 100);
      return {
        ...cat,
        count,
        percentage,
        color: chartBColors[index % chartBColors.length]
      };
    });

    let cumulative = 0;
    return computed.map(item => {
      const currentCumulative = cumulative;
      cumulative += (item.count / total) * 100;

      return {
        ...item,
        cumulativePercentageBefore: currentCumulative,
        cumulativePercentageAfter: cumulative,
        strokeOffset: 100 - cumulative
      };
    });
  }, [employees]);

  // Dynamic semantic filtering with robust matching logic
  const categoryQuotes = useMemo(() => {
    if (!selectedCategory) return [];
    
    return employees.filter(emp => {
      const quote = (emp.quote || '').trim().toLowerCase();
      
      const isNoComment = !quote || 
                          quote === 'no comments' || 
                          quote === 'no comment' || 
                          quote === 'no comments.' || 
                          quote === 'no comment.' || 
                          quote === 'none' || 
                          quote === 'none.' ||
                          quote === 'na' || 
                          quote === 'n/a' || 
                          quote === 'n/a.' || 
                          quote.includes('no comment') ||
                          quote.includes('no comments');
      
      let assignedCategory = 'Others';
      
      if (isNoComment) {
        assignedCategory = 'No Comments';
      } else {
        const positiveKeywords = ['nice', 'friendly', 'good', 'great', 'culture', 'environment', 'atmosphere', 'people', 'warm', 'supportive'];
        const fintechKeywords = ['tech', 'code', 'blockchain', 'polygon', 'system', 'build', 'engineering', 'platform', 'payment', 'ledger'];
        const growthKeywords = ['learn', 'grow', 'intern', 'junior', 'senior', 'mentor', 'guidance', 'career', 'roadmap', 'pathway'];
        const collaborationKeywords = ['help', 'team', 'support', 'coordination', 'together', 'bhai', 'dynamics', 'cooperative'];

        if (positiveKeywords.some(kw => quote.includes(kw))) {
          assignedCategory = 'Culture';
        } else if (fintechKeywords.some(kw => quote.includes(kw))) {
          assignedCategory = 'Tech & Architecture';
        } else if (growthKeywords.some(kw => quote.includes(kw))) {
          assignedCategory = 'Mentorship';
        } else if (collaborationKeywords.some(kw => quote.includes(kw))) {
          assignedCategory = 'Collaboration';
        }
      }

      return assignedCategory === selectedCategory.name;
    });
  }, [employees, selectedCategory]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div id="home-page-root" className="min-h-screen bg-[#0b0e14] relative overflow-hidden">
      
      {/* Cinematic Ambient Backdrop Wrapper with video feed and geometric floating hex outlines */}
      <div className="absolute inset-x-0 top-0 h-[850px] overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0e14]/60 to-[#0b0e14] z-10" />
        
        {/* Cinematic Video Background Muted, Mapped loop */}
        <video 
          src="/hero-bg.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0"
        />

        {floatingHexagons.map((hex) => (
          <motion.div
            key={hex.id}
            id={`floating-hexagon-${hex.id}`}
            className="absolute pointer-events-none opacity-20 filter blur-[1px]"
            style={{
              left: hex.left,
              top: hex.top,
              width: hex.size,
              height: hex.size,
            }}
            animate={{
              x: hex.x,
              y: hex.y,
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: hex.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: hex.delay,
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon 
                points="50,5 95,25 95,75 50,95 5,75 5,25" 
                stroke="#65bc7b" 
                strokeWidth="2" 
                fill="none" 
              />
            </svg>
          </motion.div>
        ))}

        {/* Ambient Backlight glows */}
        <div className="absolute w-[350px] h-[350px] bg-[#8247e5]/10 top-[20%] left-[20%] filter blur-[100px]" />
        <div className="absolute w-[400px] h-[400px] bg-[#65bc7b]/8 top-[10%] right-[15%] filter blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Dynamic organically floating photo nodes drifting gracefully */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto">
          {floatingPhotoNodes.map((node) => (
            <motion.div
              key={node.id}
              className="absolute rounded-full border-2 bg-[#131722]/85 overflow-hidden shadow-2xl flex items-center justify-center cursor-pointer hover:border-[#65bc7b] hover:scale-125 hover:z-30 transition-transform duration-300 group"
              style={{
                ...node.style,
                borderColor: node.borderColor,
              }}
              animate={node.animate}
              transition={{
                duration: node.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: node.delay,
              }}
              onClick={() => {
                setSelectedBot(node.employee);
                setBotImageError(false);
              }}
            >
              <img 
                src={node.employee.photoLink && !node.employee.photoLink.includes('none') ? (node.employee.photoLink.startsWith('http') ? node.employee.photoLink : `/faces/${node.employee.photoLink}`) : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'} 
                alt={node.employee.name} 
                className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300 pointer-events-none" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
                }}
              />
              <div className="absolute inset-0 bg-[#65bc7b]/5 mix-blend-color pointer-events-none" />
              
              {/* Floating micro tag labels */}
              <div className="absolute inset-x-0 bottom-0 py-0.5 bg-black/75 text-center text-[7px] font-mono text-white/50 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest truncate max-w-full">
                {node.employee.name.split(' ')[0]}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hero Content Section */}
      <div className="relative pt-44 pb-16 px-4 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          {/* Compact Brand Logo Framing Container */}
          <motion.div
            id="brand-logo-frame"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-0 w-20 h-20 md:w-24 md:h-24 bg-[#131722] border border-[#65bc7b]/20 rounded-2xl relative overflow-hidden flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_25px_rgba(101,188,123,0.1)]"
          >
            <img 
              src="/logo.png" 
              alt="Polygon logo" 
              className="w-full h-full object-cover scale-110 absolute inset-0 transition-transform duration-500 hover:scale-120" 
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg md:text-2xl max-w-2xl text-center mt-6 mb-12 leading-relaxed font-sans font-medium tracking-tight"
          >
            Meet our people and learn about our culture.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-6">
             <Link
                to="/directory"
                className="group flex items-center justify-center gap-3 bg-[#65bc7b] text-[#0b0e14] px-10 py-5 rounded-[2.5rem] font-black text-lg transition-all hover:scale-105 shadow-2xl shadow-[#65bc7b]/20"
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

      {/* Employee / High-End Interactive Slideshow Carousel Section */}
      <section ref={featuredTalentRef} id="featured-talent" className="relative max-w-7xl mx-auto px-4 pb-28 z-10 scroll-mt-24">
         <div className="flex flex-col items-center mb-10 text-center">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#65bc7b]/10 border border-[#65bc7b]/20 px-6 py-3 rounded-2xl flex items-center gap-3 mb-8"
            >
                <div className="bg-[#65bc7b] p-1.5 rounded-lg text-[#0b0e14]">
                    <Star size={14} fill="currentColor" />
                </div>
                <span className="text-white text-[10px] font-black uppercase tracking-widest leading-none font-mono">
                    Onboarding Milestone: <span className="text-[#65bc7b]">MD. Hasibul Islam Mitul</span> has engaged with {employees.length} people.
                </span>
            </motion.div>

            {/* Hyper-Minimalist Tag replacing heavy Core Personnel title */}
            <div className="inline-block bg-[#131722] border border-white/5 px-6 py-2.5 rounded-full shadow-lg">
                <span className="text-sm font-mono font-black text-[#65bc7b] uppercase tracking-[0.35em]">
                  Polybots
                </span>
            </div>
        </div>

        {loading ? (
             <div className="flex flex-col items-center justify-center py-20">
                <div className="hexagon-loader mb-6 animate-spin" />
                <p className="text-[#65bc7b] font-bold text-sm tracking-[0.3em] uppercase animate-pulse">Syncing Ecosystem...</p>
            </div>
        ) : (
            <>
                {/* Horizontal Auto-scrolling Interlocking Carousel wrapper */}
                <div 
                  id="featured-talent-carousel-container"
                  className="relative w-full overflow-hidden"
                  onMouseEnter={() => setIsCarouselHovered(true)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div 
                    ref={carouselRef}
                    onWheel={handleCarouselWheel}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchMove}
                    className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory cursor-grab active:cursor-grabbing scrollbar-none scroll-smooth select-none"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {employees.map((emp, idx) => (
                      <div 
                        key={emp.id} 
                        className="min-w-[280px] sm:min-w-[310px] snap-center flex-shrink-0"
                      >
                        <EmployeeCard employee={emp} index={idx} />
                      </div>
                    ))}
                  </div>

                  {/* Gradient shadow edges to make the carousel fade elegantly into background */}
                  <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0b0e14] to-transparent pointer-events-none z-10" />
                  <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0b0e14] to-transparent pointer-events-none z-10" />
                </div>

                <div className="text-center mt-12">
                    <Link to="/directory" className="inline-flex items-center gap-2 text-[#65bc7b] font-black uppercase tracking-widest hover:translate-x-3 transition-transform group">
                        Enter Full Ecosystem <ArrowRight size={20} className="group-hover:text-white transition-colors" />
                    </Link>
                </div>
            </>
        )}
      </section>

      {/* 2. Team & Quotes Proportions Section */}
      <section className="relative max-w-7xl mx-auto px-4 pb-32 z-10 border-t border-white/5 pt-24">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#65bc7b]/10 text-[#65bc7b] rounded-full text-[10px] mb-4 font-black tracking-widest uppercase">
            <TrendingUp size={12} /> Live Statistical Matrix
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase">
            Team & Quotes Proportions
          </h2>
          <p className="text-white/40 text-sm max-w-xl font-normal leading-relaxed">
            Real-time aggregate data visualization of cultural topics and personnel distribution within Polygon Technologies.
          </p>
        </div>

        {/* Side-by-Side Dual Donut Charts Cleaned and Perfectly Symmetrical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch max-w-5xl mx-auto">
          
          {/* Chart 1: Employee Distribution Chart */}
          <div id="employee-distribution-container" className="bg-[#131722] border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between min-h-[460px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#8247e5]/5 blur-[80px] pointer-events-none" />
            
            <div className="text-center w-full">
              <h3 className="text-2xl font-black text-white tracking-tight uppercase">Employee Distribution</h3>
              <p className="text-white/40 text-[9px] font-mono uppercase tracking-wider mt-1.5">
                Personnel node matrix
              </p>
            </div>

            {/* Donut graphic with accentuated size indicators */}
            <div className="relative w-60 h-60 md:w-64 md:h-64 flex items-center justify-center my-6 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#0c0e14" strokeWidth="11" fill="transparent" />
                
                {[...departmentSlices].reverse().filter(s => s.count > 0).map((slice, index) => {
                  const isHovered = hoveredCategory === slice.name;
                  return (
                    <motion.circle
                      key={slice.name}
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={isHovered ? "14" : "10"}
                      strokeDasharray="100 100"
                      pathLength="100"
                      initial={{ strokeDashoffset: 100 }}
                      whileInView={{ strokeDashoffset: slice.strokeOffset }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.08 }}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredCategory(slice.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    />
                  );
                })}
              </svg>

              {/* Accentuated Milestone text display upgraded is highly visible at a glance */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="text-[10px] font-black uppercase text-white/30 tracking-widest leading-none">Departments</span>
                <span className="text-5xl md:text-6xl font-black text-[#65bc7b] leading-none mt-2.5">{departmentSlices.length}</span>
                <span className="text-[9px] font-mono text-white/40 mt-1.5 uppercase tracking-wider font-bold">Groups</span>
              </div>
            </div>

            {/* Interactive hovering helper text panel */}
            <div className="h-6 text-center w-full">
              <AnimatePresence mode="wait">
                {hoveredCategory && departmentSlices.some(s => s.name === hoveredCategory) ? (
                  <motion.p 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-mono font-bold text-[#65bc7b] tracking-wider uppercase"
                  >
                    {hoveredCategory}: {departmentSlices.find(s => s.name === hoveredCategory)?.percentage}% ({departmentSlices.find(s => s.name === hoveredCategory)?.count} members)
                  </motion.p>
                ) : (
                  <p className="text-[10px] font-mono text-white/35 uppercase tracking-wider">
                    Hover on slices to inspect coordinates
                  </p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Chart 2: Sentiment Proportions Chart (Update specific header to "Categorized Quotes") */}
          <div id="stats-categories-standalone-container" className="bg-[#131722] border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between min-h-[460px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#65bc7b]/5 blur-[80px] pointer-events-none" />
            
            <div className="text-center w-full">
              <h3 className="text-2xl font-black text-white tracking-tight uppercase">Categorized Quotes</h3>
              <p className="text-white/40 text-[9px] font-mono uppercase tracking-wider mt-1.5">
                Feedback semantic segmentation
              </p>
            </div>

            {/* Donut graphic with accentuated size indicators */}
            <div className="relative w-60 h-60 md:w-64 md:h-64 flex items-center justify-center my-6 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#0c0e14" strokeWidth="11" fill="transparent" />
                
                {[...sentimentSlices].reverse().filter(s => s.count > 0).map((slice, index) => {
                  const isHovered = hoveredCategory === slice.name;
                  return (
                    <motion.circle
                      key={slice.name}
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={isHovered ? "14" : "10"}
                      strokeDasharray="100 100"
                      pathLength="100"
                      initial={{ strokeDashoffset: 100 }}
                      whileInView={{ strokeDashoffset: slice.strokeOffset }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.08 }}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredCategory(slice.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      onClick={() => setSelectedCategory({ name: slice.name, keywords: slice.keywords })}
                    />
                  );
                })}
              </svg>

              {/* Accentuated Milestone text display upgraded is highly visible at a glance */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="text-[10px] font-black uppercase text-white/30 tracking-widest leading-none">Feedback</span>
                <span className="text-5xl md:text-6xl font-black text-[#8247e5] leading-none mt-2.5">{employees.length}</span>
                <span className="text-[9px] font-mono text-white/40 mt-1.5 uppercase tracking-wider font-bold">Total Quotes</span>
              </div>
            </div>

            {/* Interactive hovering helper text panel */}
            <div className="h-6 text-center w-full">
              <AnimatePresence mode="wait">
                {hoveredCategory && sentimentSlices.some(s => s.name === hoveredCategory) ? (
                  <motion.p 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-mono font-bold text-[#8247e5] tracking-wider uppercase cursor-pointer"
                    onClick={() => {
                      const s = sentimentSlices.find(x => x.name === hoveredCategory);
                      if (s) setSelectedCategory({ name: s.name, keywords: s.keywords });
                    }}
                  >
                    {hoveredCategory}: {sentimentSlices.find(s => s.name === hoveredCategory)?.percentage}% (Audit logs)
                  </motion.p>
                ) : (
                  <p className="text-[10px] font-mono text-white/35 uppercase tracking-wider">
                    Click segments to audit feedback logs
                  </p>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* Fun Office Stats Board - Clean Elegant Overhaul with Local Images */}
      <div id="polygon-telemetry-fun-stats" className="bg-[#080a0f] border-y border-white/5 py-24 px-4 z-10 relative overflow-hidden">
        {/* Subtle grid backdrop decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(101,188,123,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto p-0 md:p-6">
          <div className="text-center mb-16">
            <h3 className="text-xs font-mono font-bold text-[#65bc7b] uppercase tracking-[0.3em] mb-3">Live HQ Metrics</h3>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">Ecosystem Weird Metrics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                label: 'Caffeine Engine', 
                value: '340+ Cups / Day', 
                subtext: 'Fueled entirely by syntax errors.',
                image: '/coffee.png',
                glow: 'shadow-[0_0_20px_rgba(101,188,123,0.12)] border-[#65bc7b]/15 text-[#65bc7b]' 
              },
              { 
                label: 'The Great Escapes', 
                value: '42 Outings / Hour', 
                subtext: 'Frequent unexpected disappearances to the washroom or lawn.',
                image: '/bunk.png',
                glow: 'shadow-[0_0_20px_rgba(130,71,229,0.12)] border-[#8247e5]/15 text-[#8247e5]' 
              },
              { 
                label: 'Chief Security Officer', 
                value: 'Doglus', 
                subtext: 'Patrolling the corridors for dropped snacks.',
                image: '/doglus.png',
                glow: 'shadow-[0_0_20px_rgba(59,130,246,0.12)] border-blue-500/15 text-blue-400' 
              },
              { 
                label: 'Head of Employee Wellness', 
                value: 'Milo', 
                subtext: 'Sleeping through 100% of critical production deployments.',
                image: '/milo.png',
                glow: 'shadow-[0_0_20px_rgba(236,72,153,0.12)] border-pink-500/15 text-pink-400' 
              },
            ].map((card, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8, scale: 1.02 }}
                className={cn(
                  "p-8 bg-[#131722]/90 backdrop-blur-md rounded-[2.5rem] border flex flex-col justify-between min-h-[290px] transition-all relative overflow-hidden",
                  card.glow
                )}
              >
                {/* Visual glow element */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.05] bg-current filter blur-2xl rounded-full pointer-events-none" />

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border border-white/5 shrink-0 flex items-center justify-center shadow-inner">
                    <img 
                      src={card.image} 
                      alt={card.label} 
                      className="w-full h-full object-cover rounded-xl scale-105" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150';
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/55 leading-none block">{card.label}</span>
                  </div>
                </div>

                <div className="mt-8 mb-4">
                  <p className="text-3xl font-black text-white tracking-tight mb-2 uppercase">{card.value}</p>
                  <p className="text-xs text-white/50 leading-relaxed font-normal">{card.subtext}</p>
                </div>

                <div className="w-full h-1 bg-current opacity-20 rounded-full overflow-hidden shrink-0 mt-3">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: i * 0.2 }}
                    className="h-full bg-current" 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
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
              className="relative w-full max-w-3xl bg-[#131722] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[420px] aspect-auto md:aspect-[16/10] lg:aspect-[16/9] z-50"
            >
              {/* Left Column: Portrait image or Sarcastic Bengali Roast Fallback */}
              <div className="md:w-[35%] relative bg-[#090b10] border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center justify-center p-8 select-none shrink-0">
                {selectedBot.photoLink && !selectedBot.photoLink.includes('none') && !botImageError ? (
                  <div className="w-40 h-40 md:w-44 md:h-44 rounded-full border-2 border-[#65bc7b] overflow-hidden relative shadow-2xl">
                    <img 
                      src={selectedBot.photoLink.startsWith('http') ? selectedBot.photoLink : `/faces/${selectedBot.photoLink}`} 
                      alt={selectedBot.name} 
                      className="w-full h-full object-cover" 
                      onError={() => setBotImageError(true)}
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-[#ff3e6c]/15 to-[#0b0e14] border-2 border-[#ff3e6c]/35 flex flex-col items-center justify-center p-4 text-center">
                    <span className="px-2 py-0.5 bg-[#ff3e6c]/10 rounded text-[7px] font-mono font-black text-[#ff3e6c] uppercase tracking-wider mb-2">[ DATA_EMPTY ]</span>
                    {/* Fallback Bengali corporate tech roasts matching alternatingly based on employee indexes */}
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

              {/* Right Column: Detailed Designation with massive quote and balanced typographic hierarchy */}
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-between relative">
                <button 
                  onClick={() => setSelectedBot(null)}
                  className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors hidden md:block"
                >
                  <X size={16} />
                </button>

                <div className="flex flex-col gap-6">
                  {/* Compact code tag chip for Name at the very top */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#65bc7b]/10 border border-[#65bc7b]/20 rounded-md text-[9px] font-mono font-bold text-[#65bc7b] uppercase tracking-wide">
                      OP_TAG: {selectedBot.name}
                    </span>
                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-[9px] font-mono font-medium text-white/50 uppercase tracking-widest">
                      ID_NODE: {selectedBot.id}
                    </span>
                  </div>

                  {/* Designated department and description lines below with balanced layout margins */}
                  <div>
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase leading-none">
                      {selectedBot.role}
                    </h3>
                    <p className="text-[#65bc7b] text-xs font-black uppercase tracking-widest mt-2">
                      {selectedBot.department} DEPARTMENT
                    </p>
                  </div>

                  {/* Massively sized employee quote block taking up the majority of the landscape modal center */}
                  <div className="p-8 bg-[#0b0e14]/65 border border-white/5 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-2 left-3 font-mono text-[8px] text-[#65bc7b]/40 uppercase tracking-widest">[ SENTIMENT_STATEMENT ]</div>
                    <p className="text-2xl md:text-3xl font-black text-white leading-relaxed italic tracking-tight text-left pt-2">
                      "{selectedBot.quote || 'No comment recorded.'}"
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">Widescreen Polybot v2.5</span>
                  <button 
                    onClick={() => setSelectedBot(null)}
                    className="bg-[#65bc7b] text-[#0b0e14] px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DYNAMIC CATEGORIZED QUOTES MODAL */}
      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCategory(null)}
              className="absolute inset-0 bg-[#0b0e14]/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-2xl bg-[#131722] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[80vh] z-50"
            >
              {/* Modal header details */}
              <div className="p-8 pb-4 border-b border-white/5 flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[#8247e5] text-[10px] font-black uppercase tracking-widest mb-1 font-mono">
                    <Smile size={12} fill="currentColor" /> Category Match Vector
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">{selectedCategory.name}</h3>
                </div>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable list of actual feedback statements */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {categoryQuotes.length === 0 ? (
                  <div className="text-center py-12 text-white/30 text-sm font-mono leading-relaxed">
                    No exact logs found in records matching this category's filter logic.
                  </div>
                ) : (
                  categoryQuotes.map((emp) => {
                    const hasValidPhoto = emp.photoLink && !emp.photoLink.includes('none');
                    return (
                      <div key={emp.id} className="p-5 bg-[#0b0e14]/80 border border-white/5 rounded-2xl flex flex-col gap-4 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full overflow-hidden border border-white/10 flex items-center justify-center animate-pulse"
                            style={{
                              background: hasValidPhoto ? 'transparent' : 'linear-gradient(135deg, #131722 0%, #0b0e14 100%)'
                            }}
                          >
                            {hasValidPhoto ? (
                              <img 
                                src={emp.photoLink.startsWith('http') ? emp.photoLink : `/faces/${emp.photoLink}`} 
                                alt={emp.name} 
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150';
                                }}
                              />
                            ) : (
                              <span className="text-xs font-mono font-bold text-[#ff3e6c]">
                                {getInitials(emp.name)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-black text-sm leading-none">{emp.name}</p>
                            <p className="text-white/40 text-[10px] font-medium mt-1.5 uppercase tracking-wider">{emp.role} // {emp.department}</p>
                          </div>
                        </div>

                        {/* Highlighted matching quote */}
                        <p className="text-white/70 italic text-sm leading-relaxed border-l-2 border-[#65bc7b]/40 pl-4 py-1">
                          "{emp.quote || 'No comment recorded.'}"
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal footer statistics information */}
              <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[9px] font-mono tracking-widest text-white/30 uppercase">
                <span>Category Search Total: {categoryQuotes.length} matches</span>
                <span>Audit Sync Secure</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
