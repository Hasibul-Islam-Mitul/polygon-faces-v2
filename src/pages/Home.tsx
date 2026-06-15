/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Users, 
  Bot, 
  X, 
  Star, 
  TrendingUp, 
  Smile,
  Shield,
  Zap
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

const getRoastForEmployee = (index: number) => {
  return BENGALI_ROASTS[index % BENGALI_ROASTS.length];
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Help helper logic for No comments identification
const checkIsNoComment = (rawQuote: string | null | undefined): boolean => {
  if (rawQuote === null || rawQuote === undefined) return true;
  const cleaned = rawQuote.trim().toLowerCase();
  return cleaned === '' || 
         cleaned === 'no comments' || 
         cleaned === 'no comment' || 
         cleaned === 'no comments.' || 
         cleaned === 'no comment.' || 
         cleaned === 'none' || 
         cleaned === 'none.' ||
         cleaned === 'na' || 
         cleaned === 'n/a' || 
         cleaned === 'n/a.' || 
         cleaned.includes('no comment') ||
         cleaned.includes('no comments');
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
  const scrollPosRef = useRef(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchEmployeeData();
    setEmployees(shuffleArray(data)); 
    setLoading(false);
  };

  // Initialize scroll position to center third when loaded
  useEffect(() => {
    const el = carouselRef.current;
    if (el && !loading && employees.length > 0) {
      if (el.scrollLeft === 0) {
        el.scrollLeft = el.scrollWidth / 3;
      }
      scrollPosRef.current = el.scrollLeft;
    }
  }, [loading, employees]);

  const handleMeetBot = () => {
    if (employees.length > 0) {
      const randomIndex = Math.floor(Math.random() * employees.length);
      setSelectedBot(employees[randomIndex]);
      setBotImageError(false);
    }
  };

  // Continuous infinite tripling list matching slide mechanics
  const displayEmployees = useMemo(() => {
    if (employees.length === 0) return [];
    return [...employees, ...employees, ...employees];
  }, [employees]);

  // Carousel Smooth Continuous Auto-scroll Horizontal Marquee
  useEffect(() => {
    const el = carouselRef.current;
    if (!el || loading || employees.length === 0) return;
    
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const scroll = (time: number) => {
      if (!isDragging && el) {
        const elapsed = Math.min(time - lastTime, 50); // Prevent giant translation leaps of auto-scroll
        
        // Relaxed, beautiful pace (0.025 pixels/ms is extremely relaxed and constant)
        scrollPosRef.current += 0.025 * elapsed; 
        
        const firstThird = el.scrollWidth / 3;
        const secondThird = firstThird * 2;
        
        // Wrap-around seamlessly near container ends
        if (scrollPosRef.current >= secondThird) {
          scrollPosRef.current -= firstThird;
        } else if (scrollPosRef.current <= 5) {
          scrollPosRef.current += firstThird;
        }
        
        el.scrollLeft = scrollPosRef.current;
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(scroll);
    };
    
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging, loading, employees]);

  // Handle native scroll event to keep scrollPosRef in-sync when manual scrolling is ongoing
  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (el && (isCarouselHovered || isDragging)) {
      scrollPosRef.current = el.scrollLeft;
    }
  };

  // Support sideways scroll gesture via desktop vertical mouse wheel inside the container
  const handleCarouselWheel = (e: React.WheelEvent) => {
    const el = carouselRef.current;
    if (el) {
      if (e.deltaY !== 0) {
        el.scrollLeft += e.deltaY;
        scrollPosRef.current = el.scrollLeft;
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
    scrollPosRef.current = el.scrollLeft;
  };

  // Touch Swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const el = carouselRef.current;
    if (!el) return;
    setIsDragging(true);
    setIsCarouselHovered(true);
    setStartX(e.touches[0].pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsCarouselHovered(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const el = carouselRef.current;
    if (!el) return;
    const x = e.touches[0].pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftState - walk;
    scrollPosRef.current = el.scrollLeft;
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
    { id: 9, left: "58%", top: "8%", size: 90, duration: 22, delay: 0.9, x: [0, -45, 25, 0], y: [0, 45, -25, 0] }
  ];

  // Highly engaging floating comic cloud of elements drifting smoothly
  const floatingComicElements = useMemo(() => {
    if (employees.length === 0) return [];
    
    const pool = employees.filter(e => e.photoLink && !e.photoLink.includes('none'));
    const sourceList = pool.length > 0 ? pool : employees;
    const elements = [];
    const count = Math.min(10, sourceList.length);
    for (let i = 0; i < count; i++) {
      const emp = sourceList[i];
      const type = i % 2 === 0 ? 'speech-bubble' : 'rectangle-card';
      
      const startX = 5 + (i * 90 / count) + (Math.sin(i * 1.5) * 4); 
      const startY = 15 + ((i * 19) % 55); 
      
      const dx = [0, (Math.sin(i * 1.2) * 50), (Math.cos(i * 0.8) * -45), 0];
      const dy = [0, (Math.cos(i * 1.2) * -50), (Math.sin(i * 0.8) * 45), 0];
      const duration = 28 + (i * 4) % 18; 
      const delay = (i * 1.5) % 5;
      
      let rawQuote = emp.quote || '';
      if (checkIsNoComment(rawQuote)) {
        rawQuote = "Happy to be part of Polygon Technology Bangladesh!";
      }
      let quoteSnippet = rawQuote;
      if (quoteSnippet.length > 55) {
        quoteSnippet = quoteSnippet.substring(0, 52) + "...";
      }

      elements.push({
        id: `comic-${emp.id}-${i}`,
        employee: emp,
        type,
        quoteSnippet,
        startX,
        startY,
        dx,
        dy,
        duration,
        delay
      });
    }
    return elements;
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

  // Centralised Sentiment/Quote Categorization Engine (Chart 2) with ROBUST MATCHING
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
      const isNoComment = checkIsNoComment(emp.quote);

      if (isNoComment) {
        countsMap['No Comments']++;
        return;
      }

      const quote = (emp.quote || '').trim().toLowerCase();

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
      const isNoComment = checkIsNoComment(emp.quote);
      
      let assignedCategory = 'Others';
      
      if (isNoComment) {
        assignedCategory = 'No Comments';
      } else {
        const quote = (emp.quote || '').trim().toLowerCase();
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

  return (
    <div id="home-page-root" className="min-h-screen bg-[#0b0e14] relative overflow-hidden">
      
      {/* Cinematic Ambient Backdrop Wrapper */}
      <div className="absolute inset-x-0 top-0 h-[850px] overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0e14]/60 to-[#0b0e14] z-10" />
        
        {/* Cinematic Video Background */}
        <video 
          src="/hero-bg.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0 border-none"
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

        {/* Comic Cloud of elements drifting smoothly */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto">
          {floatingComicElements.map((el) => (
            <motion.div
              key={el.id}
              className="absolute z-20 cursor-pointer select-none group"
              style={{
                left: `${el.startX}%`,
                top: `${el.startY}%`,
              }}
              animate={{
                x: el.dx,
                y: el.dy,
                rotate: [0, el.delay % 2 === 0 ? 3 : -3, el.delay % 2 === 0 ? -3 : 3, 0],
              }}
              transition={{
                duration: el.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: el.delay,
              }}
              onClick={() => {
                setSelectedBot(el.employee);
                setBotImageError(false);
              }}
            >
              {el.type === 'speech-bubble' ? (
                /* Comic Speech Bubble Layer */
                <div className="bg-[#131722]/80 backdrop-blur-md border-2 border-white/60 hover:border-[#65bc7b] p-4 rounded-2xl max-w-[220px] shadow-2xl relative transition-all duration-300 hover:scale-105 active:scale-95 text-left">
                  <p className="text-white/80 text-xs font-bold leading-relaxed italic">
                    "{el.quoteSnippet}"
                  </p>
                  <p className="text-[#65bc7b] text-[9px] font-mono font-black uppercase tracking-wider mt-2">
                    — {el.employee.name.split(' ')[0]}
                  </p>
                  <div className="absolute bottom-[-8px] left-6 w-3 h-3 bg-[#131722] border-r-2 border-b-2 border-white/60 group-hover:border-[#65bc7b] rotate-45" />
                </div>
              ) : (
                /* Floating Comic Rectangle Card Layer */
                <div className="bg-[#131722]/85 backdrop-blur-md border-2 border-white/60 hover:border-[#65bc7b] p-2.5 rounded-xl flex gap-3 items-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 max-w-[240px]">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
                    <img 
                      src={el.employee.photoLink && !el.employee.photoLink.includes('none') ? (el.employee.photoLink.startsWith('http') ? el.employee.photoLink : `/faces/${el.employee.photoLink}`) : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'} 
                      alt={el.employee.name} 
                      className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300 pointer-events-none" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150';
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-black text-xs leading-none truncate">{el.employee.name}</p>
                    <p className="text-white/50 text-[9px] font-mono uppercase tracking-wider mt-1 truncate">{el.employee.role}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hero Content Section - Spacious upper portion to display background conversation clouds, CTA pushed low */}
      <div className="relative pt-[500px] pb-16 px-4 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          {/* Squeezed and Vertically Stacked CTA Action Triggers */}
          <div className="flex flex-col gap-4 w-full max-w-xs relative z-30 mt-16">
            <button 
              onClick={handleMeetBot}
              className="group flex items-center justify-center gap-3 bg-[#65bc7b]/10 backdrop-blur-md border border-[#65bc7b]/30 text-[#65bc7b] hover:bg-[#65bc7b]/20 px-6 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 hover:scale-105"
            >
              <Bot size={18} />
              Meet a PolyBot
            </button>
            <Link
              to="/directory"
              className="group flex items-center justify-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 text-white/80 hover:bg-white/10 px-6 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 hover:scale-105 text-center"
            >
              <Users size={18} />
              View Full Directory
            </Link>
          </div>
        </div>
      </div>

      {/* Employee / High-End Interactive Slideshow Carousel Section */}
      <section ref={featuredTalentRef} id="featured-talent" className="relative max-w-7xl mx-auto px-4 pb-28 z-10 scroll-mt-24">
         <div className="flex flex-col items-center mb-10 text-center">
            {/* Hyper-Minimalist Tag replacing heavy Core Personnel title */}
            <div className="inline-block bg-[#131722] border border-white/5 px-8 py-3 rounded-full shadow-lg">
                <span className="text-sm font-mono font-black text-[#65bc7b] uppercase tracking-[0.35em]">
                  Employees
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
                {/* Horizontal Auto-scrolling Interlocking Carousel wrapper with Locked Width Cards (Continuous flow) */}
                <div 
                  id="featured-talent-carousel-container"
                  className="relative w-full overflow-hidden text-center"
                  onMouseLeave={handleMouseLeave}
                >
                  <div 
                    ref={carouselRef}
                    onScroll={handleCarouselScroll}
                    onWheel={handleCarouselWheel}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchMove}
                    className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory cursor-grab active:cursor-grabbing scrollbar-none scroll-smooth select-none items-stretch"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {displayEmployees.map((emp, idx) => (
                      <div 
                        key={`slide-${emp.id}-${idx}`}
                        className="w-[280px] md:w-[320px] shrink-0 transform hover:scale-[1.02] transition-transform duration-300"
                      >
                        <EmployeeCard 
                          employee={emp} 
                          index={idx} 
                          onClick={() => {
                            setSelectedBot(emp);
                            setBotImageError(false);
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Gradient shadow edges to make the carousel fade elegantly into background */}
                  <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0b0e14] to-transparent pointer-events-none z-10" />
                  <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0b0e14] to-transparent pointer-events-none z-10" />
                </div>

                {/* Simplified & bolded Onboarding Milestone banner positioned lower to balance layout white space */}
                <div className="mt-14 flex justify-center">
                  <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="bg-[#65bc7b]/10 border border-[#65bc7b]/30 px-10 py-5 rounded-3xl flex items-center gap-4 shadow-xl max-w-xl w-full justify-center"
                  >
                      <div className="bg-[#65bc7b] p-3 rounded-xl text-[#0b0e14] shrink-0">
                          <Star size={20} fill="currentColor" />
                      </div>
                      <span className="text-white text-lg md:text-2xl font-black uppercase tracking-wide leading-none font-mono">
                          Mitul met <span className="text-[#65bc7b]">72</span> people
                      </span>
                  </motion.div>
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

        {/* Side-by-Side Dual Donut Charts Perfectly Symmetrical Grid */}
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

              {/* Accentuated Milestone text display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="text-[10px] font-black uppercase text-white/30 tracking-widest leading-none font-mono">Departments</span>
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

          {/* Chart 2: Sentiment Proportions Chart */}
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

              {/* Accentuated Milestone text display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="text-[10px] font-black uppercase text-white/30 tracking-widest leading-none font-mono">Feedback</span>
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

      {/* Fun Office Stats Board - Clean Elegant Overhaul with FULL Local background images */}
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
                subtext: 'Fueled entirely by production panic and syntax errors.',
                image: '/coffee.jpg',
                glow: 'shadow-[0_0_20px_rgba(101,188,123,0.12)] border-[#65bc7b]/15 text-[#65bc7b]' 
              },
              { 
                label: 'The Great Escapes', 
                value: '42 Outings / Hour', 
                subtext: 'Frequent unexpected tactical disappearances to the washroom or the office lawn.',
                image: '/outing.jpeg',
                glow: 'shadow-[0_0_20px_rgba(130,71,229,0.12)] border-[#8247e5]/15 text-[#8247e5]' 
              },
              { 
                label: 'Chief Security Officer', 
                value: 'Doglus', 
                subtext: 'Patrolling the corridors for dropped snacks, loose code, and system bugs.',
                image: '/doglus.jpeg',
                glow: 'shadow-[0_0_20px_rgba(59,130,246,0.12)] border-blue-500/15 text-blue-400' 
              },
              { 
                label: 'Head of Employee Wellness', 
                value: 'Milo', 
                subtext: 'Successfully sleeping through 100% of critical production deployment alerts.',
                image: '/milo.jpeg',
                glow: 'shadow-[0_0_20px_rgba(236,72,153,0.12)] border-pink-500/15 text-pink-400' 
              }
            ].map((card, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8, scale: 1.02 }}
                className={cn(
                  "p-6 bg-[#131722]/55 backdrop-blur-md rounded-[2rem] border flex flex-col justify-between min-h-[290px] transition-all relative overflow-hidden group",
                  card.glow
                )}
              >
                {/* Visual background image layer stretching 100% of containing card wrapper with clearly visible images */}
                <div className="absolute inset-0 z-0 opacity-[0.45] group-hover:opacity-75 transition-opacity duration-500 pointer-events-none">
                  <img 
                    src={card.image} 
                    alt={card.label} 
                    className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.05]" 
                    onError={(e) => {
                      const fallbacks = [
                        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600',
                        'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=600',
                        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600',
                        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600'
                      ];
                      (e.target as HTMLImageElement).src = fallbacks[i];
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f17]/95 via-[#0d0f17]/50 to-transparent opacity-90" />
                </div>
 
                {/* Subtitle & Value Sizing Content Stack */}
                <div className="relative z-10 flex-grow flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-current opacity-90 leading-none block mb-2">{card.label}</span>
                    <p className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2 uppercase leading-none">{card.value}</p>
                  </div>
 
                  <div className="mt-2">
                    <p className="text-xs md:text-sm font-semibold text-white/95 leading-relaxed font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{card.subtext}</p>
                    
                    <div className="w-full h-1 bg-current opacity-25 rounded-full overflow-hidden shrink-0 mt-4">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: i * 0.2 }}
                        className="h-full bg-current" 
                      />
                    </div>
                  </div>
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
              className="relative w-full max-w-4xl min-h-[550px] bg-[#131722] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row z-50"
            >
              {/* Left Column: Landscape Aspect-locked Edge-to-edge frame portrait (Completely removed circular borders) */}
              <div className="md:w-[38%] relative bg-[#090b10] border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-stretch justify-center overflow-hidden shrink-0">
                {selectedBot.photoLink && !selectedBot.photoLink.includes('none') && !botImageError ? (
                  <div className="w-full h-full min-h-[300px] md:min-h-full relative select-none">
                    <img 
                      src={selectedBot.photoLink.startsWith('http') ? selectedBot.photoLink : `/faces/${selectedBot.photoLink}`} 
                      alt={selectedBot.name} 
                      className="absolute inset-0 w-full h-full object-cover" 
                      onError={() => setBotImageError(true)}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full min-h-[300px] md:min-h-full bg-gradient-to-br from-[#ff3e6c]/15 to-[#0b0e14] flex flex-col items-center justify-center p-8 text-center select-none">
                    <p className="text-white/85 font-mono text-xs leading-relaxed italic">
                      "{getRoastForEmployee(employees.findIndex(e => e.id === selectedBot.id))}"
                    </p>
                  </div>
                )}
                
                <button 
                  onClick={() => setSelectedBot(null)}
                  className="absolute top-6 left-6 p-2 bg-black/60 hover:bg-white/15 rounded-full text-white transition-colors md:hidden z-10"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Right Column: Prominent shield profile details split container */}
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-between relative overflow-y-auto">
                <button 
                  onClick={() => setSelectedBot(null)}
                  className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors hidden md:block"
                >
                  <X size={16} />
                </button>

                <div className="flex flex-col gap-6">
                  {/* Boosted Name Profile Identity matches directory size */}
                  <div className="flex flex-col gap-1.5 matches-directory-identity">
                    <p className="text-[#65bc7b] text-base md:text-lg font-extrabold uppercase tracking-widest font-mono">
                      {selectedBot.department} DEPARTMENT
                    </p>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
                      {selectedBot.name}
                    </h2>
                  </div>

                  {/* Designation Registry Detail */}
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white/80 tracking-tight uppercase">
                      {selectedBot.role}
                    </h3>
                  </div>

                  {/* Massively sized employee voice quote block */}
                  <div className="p-8 bg-[#0b0e14]/65 border border-white/5 rounded-3xl relative overflow-hidden mt-3">
                    <p className="text-xl md:text-2xl font-black text-white leading-relaxed italic tracking-tight text-left">
                      "{selectedBot.quote || 'No comment recorded.'}"
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-end">
                  <button 
                    onClick={() => setSelectedBot(null)}
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

      {/* DYNAMIC CATEGORIZED QUOTES MODAL (Shares exact same split structure) */}
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
              className="relative w-full max-w-4xl bg-[#131722] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[460px] aspect-auto md:aspect-[16/9] z-50"
            >
              {/* Left Column Component Sharing the structural template */}
              <div className="md:w-[38%] relative bg-gradient-to-br from-[#8247e5]/10 to-[#0b0e14] border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center justify-center p-10 text-center select-none shrink-0">
                <div className="bg-[#8247e5]/20 p-5 rounded-3xl text-[#8247e5] mb-6">
                  <Smile size={38} fill="currentColor" />
                </div>
                <p className="text-[#8247e5] text-xs font-black uppercase tracking-widest font-mono mb-2">Category Vector</p>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase mb-4">{selectedCategory.name}</h3>
                
                <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono tracking-wider text-white/50 uppercase">
                  {categoryQuotes.length} Match Records
                </span>

                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="absolute top-6 left-6 p-2 bg-black/40 hover:bg-white/15 rounded-full text-white transition-colors md:hidden"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Right Column Component: Scrollable feedback quotes list */}
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-between max-h-[85vh] md:max-h-[600px] overflow-hidden relative">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors hidden md:block"
                >
                  <X size={16} />
                </button>

                <div className="flex-1 overflow-y-auto pr-2 space-y-6">
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
                              className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center animate-pulse"
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

                {/* Secure sync stats */}
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-mono tracking-widest text-white/30 uppercase shrink-0">
                  <span>Category Search Total: {categoryQuotes.length} matches</span>
                  <span>Audit Sync Secure</span>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
