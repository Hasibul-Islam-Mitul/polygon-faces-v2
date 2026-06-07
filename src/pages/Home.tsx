/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef } from 'react';
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
  Smile, 
  Sparkles, 
  Layers 
} from 'lucide-react';
import { fetchEmployeeData, shuffleArray } from '../lib/csv-utils';
import { Employee } from '../types';
import EmployeeCard from '../components/EmployeeCard';
import { cn } from '../lib/utils';

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
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string | null>(null);
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{ name: string; keywords: string[] } | null>(null);

  const featuredTalentRef = useRef<HTMLDivElement>(null);

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

  // 1. Dynamic Ecosystem / Department Breakdown Calculations
  const departmentCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    employees.forEach(emp => {
      const dept = emp.department || 'Operations';
      counts[dept] = (counts[dept] || 0) + 1;
    });

    const total = employees.length || 1;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
    })).sort((a, b) => b.count - a.count);
  }, [employees]);

  // Displayed members list based on selected department filter on-the-fly
  const displayedMembers = useMemo(() => {
    if (!selectedDeptFilter) {
      return employees.slice(0, 8);
    }
    return employees.filter(emp => (emp.department || 'Operations') === selectedDeptFilter);
  }, [employees, selectedDeptFilter]);

  // Handle department row selection with auto smooth scrolling
  const handleDeptSelect = (deptName: string) => {
    const nextFilter = selectedDeptFilter === deptName ? null : deptName;
    setSelectedDeptFilter(nextFilter);
    if (nextFilter) {
      setTimeout(() => {
         featuredTalentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Chart A Colors: Mapped distinct, high-contrast unique colors
  const chartAColors = ['#8247e5', '#65bc7b', '#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#14b8a6'];

  // Chart A (Ecosystem) calculation parameters (circumference: 238.76 for radius: 38)
  const pieSlices = useMemo(() => {
    const totalCount = departmentCounts.reduce((sum, item) => sum + item.count, 0) || 1;
    let accumulatedFraction = 0;
    return departmentCounts.map((dept, index) => {
      const fraction = dept.count / totalCount;
      const strokeLength = fraction * 238.76;
      const strokeOffset = 238.76 - strokeLength;
      const rotation = accumulatedFraction * 360;
      accumulatedFraction += fraction;
      
      return {
        ...dept,
        strokeOffset,
        rotation,
        color: chartAColors[index % chartAColors.length]
      };
    });
  }, [departmentCounts]);

  // Centralized Sentiment/Quote Categorization Engine (Single Source of Truth)
  const sentimentSlices = useMemo(() => {
    const total = employees.length || 1;
    
    // Initialize counts dynamically using keys conforming to the schema
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
                          quote.includes('no comment');

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

      // Any remaining non-placeholder fall back to generic
      countsMap['Others']++;
    });

    const chartBColors = ['#65bc7b', '#8247e5', '#3b82f6', '#ec4899', '#f97316', '#06b6d4'];

    // Map each schema element back with computed count and percentage of total employees
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

    // To ensure pie chart slices are mathematically perfect, continuous and form exactly 100% of the circle,
    // we use the cumulative percentage overlay method.
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

  // Dynamic semantic filtering for the modal popup with matching keyword extraction
  const categoryQuotes = useMemo(() => {
    if (!selectedCategory) return [];
    
    // Select precisely the employees that were categorized into this category
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
                          quote.includes('no comment');
      
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

  // Fallback avatar helper inside modal lists
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div id="home-page-root" className="min-h-screen bg-[#0b0e14] relative">
      
      {/* 1. FUTURISTIC AMBIENT BLURRED BACKDROP WITH FLOATING OUTLINE HEXAGONS */}
      <div className="absolute inset-x-0 top-0 h-[800px] overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0e14]/50 to-[#0b0e14] z-10" />
        
        {/* Floating Line-Art SVG Hexagons based on official geometry */}
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

        {/* Ambient background accent glows */}
        <div className="absolute w-[350px] h-[350px] bg-[#8247e5]/10 top-[20%] left-[20%] filter blur-[100px]" />
        <div className="absolute w-[400px] h-[400px] bg-[#65bc7b]/8 top-[10%] right-[15%] filter blur-[120px]" />

        {/* Technical dot grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Hero Content Section */}
      <div className="relative pt-48 pb-20 px-4 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
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
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black text-white leading-none mb-6 tracking-tighter"
          >
            FACES OF <br />
            <span className="text-[#65bc7b] italic">POLYGON</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg md:text-2xl max-w-2xl mb-12 leading-relaxed"
          >
            Meet Our People.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-6 mt-4">
             <Link
                to="/directory"
                className="group flex items-center justify-center gap-3 bg-[#65bc7b] text-[#0b0e14] px-10 py-5 rounded-[2.5rem] font-black text-lg transition-all hover:scale-105 shadow-2x shadow-[#65bc7b]/20"
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

      {/* Employee / Team Grid Section */}
      <section ref={featuredTalentRef} id="featured-talent" className="relative max-w-7xl mx-auto px-4 pb-32 z-10 scroll-mt-24">
         <div className="flex flex-col items-center mb-16 text-center">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#65bc7b]/10 border border-[#65bc7b]/20 px-6 py-3 rounded-2xl flex items-center gap-3 mb-8"
            >
                <div className="bg-[#65bc7b] p-1.5 rounded-lg text-[#0b0e14]">
                    <Star size={14} fill="currentColor" />
                </div>
                <span className="text-white text-[10px] font-black uppercase tracking-widest leading-none">
                    Onboarding Milestone: <span className="text-[#65bc7b]">MD. Hasibul Islam Mitul</span> has engaged with {employees.length} people.
                </span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
              {selectedDeptFilter ? (
                <>Ecosystem: <span className="text-[#65bc7b]">{selectedDeptFilter}</span></>
              ) : (
                <>Featured <span className="text-[#65bc7b]">Talent</span></>
              )}
            </h2>
            <p className="text-white/40 text-lg max-w-xl">
              {selectedDeptFilter 
                ? `Displaying all mapped team members operating in our ${selectedDeptFilter} division.`
                : "Meet the visionaries behind Bangladesh's leading fintech infrastructure."}
            </p>

            {/* Filter active notification badge */}
            {selectedDeptFilter && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-mono"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#65bc7b] animate-pulse" />
                <span className="text-white/70">Department filter is active</span>
                <button 
                  onClick={() => setSelectedDeptFilter(null)}
                  className="ml-3 font-bold text-[#ff7597] hover:text-white uppercase text-[10px] tracking-wide underline decoration-dotted transition-colors"
                >
                  Clear filter
                </button>
              </motion.div>
            )}
        </div>

        {loading ? (
             <div className="flex flex-col items-center justify-center py-20">
                <div className="hexagon-loader mb-6 animate-spin" />
                <p className="text-[#65bc7b] font-bold text-sm tracking-[0.3em] uppercase animate-pulse">Syncing Ecosystem...</p>
            </div>
        ) : (
            <>
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
                >
                  <AnimatePresence mode="popLayout">
                    {displayedMembers.map((emp, idx) => (
                      <motion.div 
                        key={emp.id} 
                        layout 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                      >
                        <EmployeeCard employee={emp} index={idx} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {displayedMembers.length === 0 && (
                  <div className="p-16 border border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.01] text-center mb-16">
                    <p className="text-white/30 text-lg">No employees found matching this criteria.</p>
                  </div>
                )}

                <div className="text-center">
                    <Link to="/directory" className="inline-flex items-center gap-2 text-[#65bc7b] font-black uppercase tracking-widest hover:translate-x-3 transition-transform group">
                        Enter Full Ecosystem <ArrowRight size={20} className="group-hover:text-white transition-colors" />
                    </Link>
                </div>
            </>
        )}
      </section>

      {/* 2. Team Insights & Re-Architected Dual Data Analytics Section */}
      <section className="relative max-w-7xl mx-auto px-4 pb-32 z-10 border-t border-white/5 pt-28">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#65bc7b]/10 text-[#65bc7b] rounded-full text-[10px] mb-4 font-black tracking-widest uppercase">
            <TrendingUp size={12} /> Live Statistical Matrix
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            Team Insights & <span className="text-[#65bc7b]">Analytics</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl">
            Real-time aggregate telemetry of roles and qualitative cultural metrics inside Polygon Bangladesh.
          </p>
        </div>

        {/* TOP LAYOUT: SIDE BY SIDE LISTS (No cramped pie charts here!) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch mb-12">
          
          {/* Component A: Department distribution (Bars list only) */}
          <div id="stats-departments-container" className="bg-[#131722] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#65bc7b]/5 blur-[80px] pointer-events-none" />
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#65bc7b]/10 rounded-xl flex items-center justify-center text-[#65bc7b]">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Ecosystem Distribution</h3>
                  <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider">Interactive dashboard: Click rows to filter employee grid instantly</p>
                </div>
              </div>

              <div className="w-full h-[1px] bg-white/10 my-6" />

              <div className="space-y-4">
                {loading ? (
                  <div className="py-12 text-center text-white/30 text-sm">Aggregating records...</div>
                ) : (
                  departmentCounts.map((dept, index) => {
                    const isActive = selectedDeptFilter === dept.name;
                    const sliceColor = pieSlices.find(s => s.name === dept.name)?.color || '#65bc7b';
                    
                    return (
                      <div 
                        key={dept.name}
                        onClick={() => handleDeptSelect(dept.name)}
                        onMouseEnter={() => setHoveredDept(dept.name)}
                        onMouseLeave={() => setHoveredDept(null)}
                        className={cn(
                          "p-3.5 rounded-xl border border-transparent transition-all cursor-pointer flex flex-col gap-1.5",
                          isActive 
                            ? "bg-[#65bc7b]/10 border-[#65bc7b]/30" 
                            : "hover:bg-white/[0.03] hover:border-white/5"
                        )}
                      >
                        <div className="flex justify-between items-center font-mono">
                          <span className="text-white/95 text-xs font-bold flex items-center gap-2">
                            <span 
                              className="w-2.5 h-2.5 rounded-full filter" 
                              style={{ 
                                backgroundColor: sliceColor, 
                                boxShadow: hoveredDept === dept.name ? `0 0 10px ${sliceColor}` : 'none' 
                              }} 
                            />
                            {dept.name}
                          </span>
                          <span className="text-white/40 text-[10px] font-bold">
                            {dept.count} members ({dept.percentage}%)
                          </span>
                        </div>
                        
                        <div className="w-full h-1.5 bg-[#0b0e14] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${dept.percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.05 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: sliceColor }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-white/30 font-mono tracking-wider uppercase">
              <span>Relational Linkages: Stable</span>
              <span>Total Nodes: {employees.length}</span>
            </div>
          </div>

          {/* Component B: Categorized Quotes Sentiment (Bars list only) */}
          <div id="stats-categories-container" className="bg-[#131722] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[80px] pointer-events-none" />

            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                  <Smile size={18} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Categorized Quotes</h3>
                  <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider">Interactive auditing: Click any card to load matched employees</p>
                </div>
              </div>

              <div className="w-full h-[1px] bg-white/10 my-6" />

              <div className="space-y-4">
                {sentimentSlices.map((slice) => {
                  const matchCount = slice.count;
                  const ratio = slice.percentage;
                  const sliceColor = slice.color;

                  return (
                    <motion.div 
                      key={slice.name} 
                      whileHover={{ scale: 1.015 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 12 }}
                      onClick={() => setSelectedCategory({ name: slice.name, keywords: slice.keywords })}
                      className="p-4 bg-[#0b0e14]/50 hover:bg-[#0b0e14] border border-white/5 hover:border-blue-500/20 rounded-2xl flex flex-col gap-2 cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-center font-mono">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sliceColor }} />
                          <span className="text-white font-bold text-xs uppercase tracking-wider">{slice.name}</span>
                        </div>
                        <span className="text-blue-400 text-xs font-bold font-mono">
                          {matchCount > 0 ? `${ratio}% (${matchCount})` : '0% (No quotes recorded)'}
                        </span>
                      </div>
                      
                      <div className="w-full h-1.5 bg-[#0b0e14] rounded-full overflow-hidden mt-1">
                        <div 
                           className="h-full rounded-full transition-all duration-500" 
                           style={{ 
                             width: `${Math.max(ratio, matchCount > 0 ? 1 : 0)}%`,
                             backgroundColor: sliceColor
                           }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-[#65bc7b] font-mono tracking-wider uppercase justify-end">
              <Sparkles size={11} className="animate-pulse" />
              <span>Real-time Semantic Analyzer Live</span>
            </div>
          </div>

        </div>

        {/* BOTTOM LAYOUT: WIDER DEDICATED LAYOUT CONTAINER FOR DUAL INTERACTIVE PIE CHARTS */}
        <div id="dual-pie-charts-container" className="bg-[#131722] border border-white/5 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-12">
            <span className="inline-block py-1.5 px-3.5 bg-white/5 border border-white/10 rounded-full font-mono text-[9px] uppercase tracking-widest text-white/50 mb-3">
              Advanced Visualization Portal
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter">
              Interactive Team & Sentiment <span className="text-[#65bc7b]">Proportions</span>
            </h3>
            <p className="text-white/40 text-xs mt-1">
              Click slices inside either visualizer system to activate corresponding telemetry filters or popups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            {/* Visualizer A: Department distribution pie chart */}
            <div className="flex flex-col items-center">
              <h4 className="text-sm font-bold uppercase tracking-widest font-mono text-white/60 mb-8 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#65bc7b]" /> Ecosystem Density Ratio
              </h4>
              
              <div className="relative w-64 h-64 md:w-72 md:h-72">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#0b0e14" strokeWidth="12" fill="transparent" />
                  
                  {pieSlices.map((slice, index) => {
                    const isHovered = hoveredDept === slice.name || selectedDeptFilter === slice.name;
                    return (
                      <motion.circle
                        key={slice.name}
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth={isHovered ? "14" : "10"}
                        strokeDasharray="238.76"
                        initial={{ strokeDashoffset: 238.76 }}
                        whileInView={{ strokeDashoffset: slice.strokeOffset }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.08 }}
                        style={{
                          transform: `rotate(${slice.rotation}deg)`,
                          transformOrigin: '50px 50px',
                        }}
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredDept(slice.name)}
                        onMouseLeave={() => setHoveredDept(null)}
                        onClick={() => handleDeptSelect(slice.name)}
                      />
                    );
                  })}
                </svg>

                {/* Total staff indicator centered inside */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                  <span className="text-[10px] font-black uppercase text-white/40 tracking-widest leading-none">Departments</span>
                  <span className="text-4xl font-black text-white leading-none mt-1.5">{employees.length}</span>
                  <span className="text-[9px] font-mono text-[#65bc7b] mt-1.5 uppercase tracking-wider font-bold">People</span>
                </div>
              </div>

              {/* Legend/Selector metadata */}
              <div className="mt-8 text-center h-6">
                <AnimatePresence mode="wait">
                  {(hoveredDept || selectedDeptFilter) ? (
                    <motion.p 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-mono font-bold text-[#65bc7b] tracking-wider uppercase"
                    >
                      {hoveredDept || selectedDeptFilter} (Click to Filter)
                    </motion.p>
                  ) : (
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                      Hover on slices to inspect
                    </p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Visualizer B: Sentiment Categories distribution pie chart */}
            <div className="flex flex-col items-center">
              <h4 className="text-sm font-bold uppercase tracking-widest font-mono text-white/60 mb-8 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Sentiment Category Ratio
              </h4>

              <div className="relative w-64 h-64 md:w-72 md:h-72">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#0b0e14" strokeWidth="12" fill="transparent" />
                  
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

                {/* Total comments stats centered inside */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                  <span className="text-[10px] font-black uppercase text-white/40 tracking-widest leading-none">Categorization</span>
                  <span className="text-4xl font-black text-white leading-none mt-1.5">
                    {sentimentSlices.reduce((sum, item) => sum + item.count, 0)}
                  </span>
                  <span className="text-[9px] font-mono text-blue-400 mt-1.5 uppercase tracking-wider font-bold">Quotes</span>
                </div>
              </div>

              {/* Legend/Selector metadata */}
              <div className="mt-8 text-center h-6">
                <AnimatePresence mode="wait">
                  {hoveredCategory ? (
                    <motion.p 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-mono font-bold text-blue-400 tracking-wider uppercase"
                    >
                      {hoveredCategory} (Click to Audit)
                    </motion.p>
                  ) : (
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                      Hover on slices to inspect
                    </p>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="bg-[#080a0f] border-y border-white/5 py-24 px-4 z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
                { label: 'Users Impacted', value: '50M+', icon: Users },
                { label: 'Products Delivered', value: '70+', icon: Zap },
                { label: 'Happy Clients', value: '50M+', icon: Shield },
                { label: 'Years Experience', value: '3+', icon: Globe },
            ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center md:items-start gap-5">
                    <div className="p-4 bg-[#65bc7b]/10 rounded-2xl text-[#65bc7b]">
                        <stat.icon size={28} />
                    </div>
                    <div>
                        <p className="text-5xl font-black text-white tracking-tighter mb-2">{stat.value}</p>
                        <p className="uppercase text-[10px] font-black tracking-[0.4em] text-white/40">{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* PolyBot Modal */}
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
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-[#131722] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <div className="aspect-square relative overflow-hidden">
                {botImageError || !selectedBot.photoLink ? (
                  <div className="w-full h-full bg-[#1a1f2e] flex items-center justify-center text-white/20 select-none relative">
                     {/* Standard profile frame avatar with custom gradient background circle inside PolyBot fallback */}
                     <div 
                       className="w-24 h-24 rounded-full flex items-center justify-center"
                       style={{ background: 'linear-gradient(135deg, #8a3ffc 0%, #65bc7b 100%)' }}
                     >
                       <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                       </svg>
                     </div>
                  </div>
                ) : (
                  <img 
                    src={selectedBot.photoLink.startsWith('http') ? selectedBot.photoLink : `/faces/${selectedBot.photoLink}`} 
                    alt={selectedBot.name} 
                    className="w-full h-full object-cover" 
                    onError={() => setBotImageError(true)}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent opacity-80" />
                <button 
                  onClick={() => setSelectedBot(null)}
                  className="absolute top-6 right-6 p-2.5 bg-black/40 hover:bg-white/10 rounded-full text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-10 text-center">
                <p className="text-[#65bc7b] text-[10px] font-black uppercase tracking-[0.3em] mb-3">{selectedBot.department}</p>
                <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">{selectedBot.name}</h3>
                <p className="text-white/60 font-bold mb-8 italic">{selectedBot.role}</p>
                <div className="p-5 bg-white/5 rounded-2xl mb-8 border border-white/5">
                   <p className="text-white/40 text-sm leading-relaxed italic">"{selectedBot.quote}"</p>
                </div>
                <button 
                  onClick={() => setSelectedBot(null)}
                  className="w-full bg-[#65bc7b] text-[#0b0e14] py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all"
                >
                  Close PolyBot
                </button>
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
              className="relative w-full max-w-2xl bg-[#131722] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[80vh] relative z-50"
            >
              {/* Modal header details */}
              <div className="p-8 pb-4 border-b border-white/5 flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1 font-mono">
                    <Smile size={12} fill="currentColor" /> Category Match Vector
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter">{selectedCategory.name}</h3>
                </div>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable list of actual feedback statements matching definitions dynamically */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {categoryQuotes.length === 0 ? (
                  <div className="text-center py-12 text-white/30 text-sm font-mono leading-relaxed">
                    No exact logs found in records matching this category's filter logic.
                  </div>
                ) : (
                  categoryQuotes.map((emp) => (
                    <div key={emp.id} className="p-5 bg-[#0b0e14]/80 border border-white/5 rounded-2xl flex flex-col gap-4 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-[#1c2130] flex items-center justify-center"
                          style={{
                            background: emp.photoLink ? 'transparent' : 'linear-gradient(135deg, #8a3ffc 0%, #65bc7b 100%)'
                          }}
                        >
                          {emp.photoLink ? (
                            <img 
                              src={emp.photoLink.startsWith('http') ? emp.photoLink : `/faces/${emp.photoLink}`} 
                              alt={emp.name} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-xs font-mono font-bold text-white">
                              {getInitials(emp.name)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-black text-sm leading-none">{emp.name}</p>
                          <p className="text-white/40 text-[10px] font-medium mt-1 uppercase tracking-wider">{emp.role} // {emp.department}</p>
                        </div>
                      </div>

                      {/* Highlighted matching quote */}
                      <p className="text-white/70 italic text-sm leading-relaxed border-l-2 border-[#65bc7b]/40 pl-4 py-1">
                        "{emp.quote || 'No comment recorded.'}"
                      </p>
                    </div>
                  ))
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
