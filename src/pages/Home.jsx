import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Rocket,
  ArrowRight,
  GitBranch,
  Layout,
  CheckCircle,
  Terminal,
  Globe,
  Layers,
  Sparkles,
  Command,
  Cpu,
  Users,
  Code2,
  Bug,
  GraduationCap,
  Heart,
  Activity,
  ChevronDown,
  Zap,
} from 'lucide-react';
import { ROLE_SIM_DATA } from '../constants/homeData';

// Configuration
const HOME_CONFIG = {
  EXECUTION_SYSTEM: {
    NODE_COUNT: 15,
    INTERACTION_RADIUS: 15,
    SIZE_BASE: 2,
    SIZE_VARIANCE: 3,
    STATUS_OPTIONS: ['success', 'error', 'info', 'warning'],
  },
  ANIMATION: {
    HERO_PARALLAX_FACTOR: 0.35,
    GLOW_PARALLAX_TOP: 0.15,
    GLOW_PARALLAX_BOTTOM: -0.1,
    SIGNAL_INTERVAL: 3000,
  },
  SIGNALS: [
    { text: "------ 3 tasks at risk", status: "error" },
    { text: "---- Execution Health: 78% ---", status: "info" },
    { text: "---- AI Suggestion: Reassign backend tasks", status: "success" },
    { text: "---- Dependency path optimized", status: "warning" }
  ]
};

// Scroll Orchestration Hooks
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
          setProgress(scrollHeight <= clientHeight ? 1 : scrollTop / (scrollHeight - clientHeight));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return progress;
};

const useReveal = (threshold = 0.12, rootMargin = '0px 0px -60px 0px') => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold, rootMargin }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold, rootMargin]);
  return [ref, visible];
};

const Reveal = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.12,
}) => {
  const [ref, visible] = useReveal(threshold);
  const base = {
    transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms,
                 transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  };
  const hidden = {
    up:    { opacity: 0, transform: 'translateY(48px)' },
    left:  { opacity: 0, transform: 'translateX(-48px)' },
    right: { opacity: 0, transform: 'translateX(48px)' },
    scale: { opacity: 0, transform: 'scale(0.88)' },
    fade:  { opacity: 0, transform: 'none' },
  }[direction];
  const shown = { opacity: 1, transform: 'none' };

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...base, ...(visible ? shown : hidden) }}
    >
      {children}
    </div>
  );
};

// UI Components
const ScrollProgressBar = ({ progress }) => (
  <div className="fixed top-0 left-0 right-0 h-[2px] z-[200] pointer-events-none bg-white/5">
    <div
      className="h-full rounded-r-full transition-all duration-100 bg-linear-to-r from-primary to-secondary shadow-[0_0_12px_rgba(59,130,246,0.8)]"
      style={{ width: `${progress * 100}%` }}
    />
  </div>
);

const ChapterLabel = ({ number, label }) => (
  <Reveal delay={0} direction="fade">
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[10px] font-black text-white/20 tracking-[0.3em] uppercase">
        {String(number).padStart(2, '0')}
      </span>
      <div className="h-[1px] w-8 bg-white/10" />
      <span className="text-[10px] font-black text-primary/60 tracking-[0.25em] uppercase">
        {label}
      </span>
    </div>
  </Reveal>
);

// Execution Visualization
const ExecutionSystem = () => {
  const { NODE_COUNT, STATUS_OPTIONS, SIZE_BASE, SIZE_VARIANCE } = HOME_CONFIG.EXECUTION_SYSTEM;
  const [backgroundNodes] = useState(() => Array.from({ length: NODE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    status: STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)],
    size: SIZE_BASE + Math.random() * SIZE_VARIANCE,
    pulseDelay: Math.random() * 5
  })));

  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    let ticking = false;
    const handleMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setMousePosition({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full opacity-[0.03] sm:opacity-20 grayscale sm:grayscale-0" viewBox="0 0 100 100" preserveAspectRatio="none">
        {backgroundNodes.map((node, i) => (
          backgroundNodes.slice(i + 1, i + 3).map((target, j) => (
            <path
              key={`${i}-${j}`}
              d={`M ${node.x} ${node.y} L ${target.x} ${target.y}`}
              className="stroke-white/10 fill-none signal-path"
              strokeWidth="0.1"
            />
          ))
        ))}
        {backgroundNodes.map((node) => {
          const dist = Math.sqrt(Math.pow(node.x - mousePosition.x, 2) + Math.pow(node.y - mousePosition.y, 2));
          const colorClass = {
            success: 'text-status-success',
            error: 'text-status-error',
            info: 'text-status-info',
            warning: 'text-status-warning'
          }[node.status];

          return (
            <g key={node.id} style={{ transform: `translate(${node.x}px, ${node.y}px)` }}>
              <circle
                cx={0} cy={0}
                r={node.size * (dist < HOME_CONFIG.EXECUTION_SYSTEM.INTERACTION_RADIUS ? 1.5 : 1) * 0.1}
                className={`${colorClass} fill-current animate-pulse-node`}
                style={{ animationDelay: `${node.pulseDelay}s` }}
              />
              {dist < HOME_CONFIG.EXECUTION_SYSTEM.INTERACTION_RADIUS && (
                <circle cx={0} cy={0} r={node.size * 0.3} className={`${colorClass} fill-none stroke-current opacity-20`} />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const ExecutionCore = () => (
  <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center scale-[0.65] sm:scale-100 hidden sm:flex">
    <div className="absolute inset-0 border border-primary/20 rounded-full animate-rotate-core" />
    <div className="absolute inset-4 border border-secondary/20 rounded-full animate-rotate-core [animation-direction:reverse]" />
    <div className="absolute inset-12 border border-primary/10 rounded-full animate-pulse-core" />
    <div className="relative w-32 h-32 rounded-full glass border border-white/20 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-primary/10 animate-pulse" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-12 h-1 bg-primary/60 rounded-full mb-1" />
        <div className="w-8 h-1 bg-secondary/40 rounded-full" />
      </div>
      <div className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-scan" />
    </div>
    {[0, 60, 120, 180, 240, 300].map((deg) => (
      <div
        key={deg}
        className="absolute w-px h-full bg-linear-to-b from-transparent via-white/10 to-transparent"
        style={{ transform: `rotate(${deg}deg)` }}
      />
    ))}
  </div>
);

const LiveSignals = () => {
  const [activeSignalIndex, setActiveSignalIndex] = useState(0);
  const signals = HOME_CONFIG.SIGNALS;
  useEffect(() => {
    const timer = setInterval(() => setActiveSignalIndex(p => (p + 1) % signals.length), HOME_CONFIG.ANIMATION.SIGNAL_INTERVAL);
    return () => clearInterval(timer);
  }, [signals.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-[5%] left-4 md:left-20 animate-float-card opacity-30 md:opacity-100 hidden md:block">
        <SignalCard {...signals[0]} />
      </div>
      <div className="absolute top-[8%] right-4 md:right-20 animate-float-card opacity-30 md:opacity-100 hidden md:block [animation-delay:-2s]">
        <SignalCard {...signals[1]} />
      </div>
      <div className="absolute bottom-[10%] left-4 md:left-40 animate-float-card hidden lg:block [animation-delay:-4s]">
        <SignalCard {...signals[2]} />
      </div>
    </div>
  );
};

const SignalCard = ({ text, status }) => {
  const colors = {
    error: 'border-status-error/30 bg-status-error/5 text-status-error',
    info: 'border-status-info/30 bg-status-info/5 text-status-info',
    success: 'border-status-success/30 bg-status-success/5 text-status-success',
    warning: 'border-status-warning/30 bg-status-warning/5 text-status-warning'
  };
  return (
    <div className={`px-4 py-2 border rounded-xl glass-dark text-[10px] md:text-xs font-bold whitespace-nowrap shadow-2xl backdrop-blur-xl ${colors[status]}`}>
      <div className="flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
        {text}
      </div>
    </div>
  );
};

// Main Page Component
const Home = () => {
  const scrollProgress = useScrollProgress();
  const [heroParallax, setHeroParallax] = useState(0);

  useEffect(() => {
    const onScroll = () => setHeroParallax(window.scrollY * HOME_CONFIG.ANIMATION.HERO_PARALLAX_FACTOR);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-white selection:bg-primary/30 relative overflow-x-hidden">
      <ScrollProgressBar progress={scrollProgress} />
      <BackgroundGlow parallax={heroParallax} />

      {/* Hero Section */}
      <header className="relative min-h-[85vh] sm:min-h-screen flex items-start justify-center pt-16 sm:pt-32 pb-20 px-6 overflow-hidden bg-[#020617]">
        <div className="absolute inset-0 bg-grid-white pointer-events-none opacity-20 hidden sm:block" />
        <div className="absolute inset-0 z-0">
          <ExecutionSystem />
        </div>

        <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center w-full">
          {/* Mobile Hero */}
          <div className="sm:hidden flex flex-col items-start w-full gap-5 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h1 className="text-5xl font-black tracking-tighter leading-[0.93] flex flex-col gap-1">
              <span className="text-white">Don't just</span>
              <span className="text-white/20 line-through decoration-white/40 decoration-4">track.</span>
              <span className="text-brand">Orchestrate.</span>
            </h1>
            <p className="text-sm text-white/40 font-medium leading-relaxed pr-4">
              NexaSetu is your mission control - AI that predicts risks, eliminates bottlenecks, and drives delivery.
            </p>
            <div className="flex flex-col w-full gap-5 mt-10">
              <Link to="/register" className="flex items-center justify-between px-6 py-5 bg-white rounded-xl active:scale-95 transition-all shadow-xl">
                <span className="text-base font-black text-black tracking-tight">Start executing</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-black/5 text-black/50 uppercase">Free</span>
                  <ArrowRight size={20} className="text-black" />
                </div>
              </Link>
              <button className="flex items-center justify-center gap-3 px-6 py-5 border border-white/10 rounded-xl active:scale-95 transition-all bg-white/5">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[7px] border-l-white border-b-[5px] border-b-transparent ml-0.5" />
                </div>
                <span className="text-base font-black text-white tracking-tight">Watch demo</span>
              </button>
            </div>
          </div>

          {/* Desktop Hero */}
          <div className="hidden sm:flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-8 [animation-duration:800ms]">
              {['Tasks', 'AI Alerts', 'Execution Health', 'Risk Prediction'].map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-primary-light uppercase tracking-widest backdrop-blur-md">
                  [{tag}]
                </span>
              ))}
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.05em] mb-10 leading-[0.9] text-center max-w-4xl">
              <span className="block overflow-hidden pb-1">
                {["Don't", 'just', 'track.'].map((word, i) => (
                  <span key={i} className="inline-block" style={{ animation: `heroWord 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms both` }}>
                    {word}&nbsp;
                  </span>
                ))}
              </span>
              <span className="block overflow-hidden">
                <span className="inline-block text-gradient hero-gradient-word tracking-[-0.05em]" style={{ animation: `heroWord 0.9s cubic-bezier(0.22,1,0.36,1) 320ms both` }}>
                  Orchestrate.
                </span>
              </span>
            </h1>

            <p className="text-xl text-white/50 mb-12 max-w-2xl text-center leading-relaxed font-medium" style={{ animation: 'heroSubFade 1s cubic-bezier(0.22,1,0.36,1) 0.6s both' }}>
              Ditch the bloated trackers of the past. NexaSetu is the high-performance execution engine that orchestrates your entire delivery.
            </p>

            <div className="flex flex-row gap-3 justify-center w-full animate-in fade-in slide-in-from-bottom-8 [animation-duration:1000ms] [animation-delay:1000ms]">
              <Link to="/register" className="px-10 py-5 bg-white text-background-dark text-base font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                Get Started
              </Link>
              <Link to="/login" className="px-10 py-5 glass text-white text-base font-black rounded-2xl hover:bg-white/5 border border-white/10 transition-all hover:scale-105 flex items-center justify-center gap-2 group">
                Try Live Demo <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none z-30">
          <LiveSignals />
        </div>
      </header>

      {/* Capabilities Section */}
      <section id="features" className="py-20 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <ChapterLabel number={1} label="Capabilities" />
          <Reveal direction="up" delay={100}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Modern <span className="text-gradient">Project Management</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={200}>
            <p className="text-text-muted max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Everything you need to manage complex projects and teams without the friction.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          <Reveal className="col-span-12 lg:col-span-8" direction="left" delay={0} threshold={0.08}>
            <FeatureCard
              icon={<Shield className="text-secondary" size={28} />}
              title="Enterprise-Grade Team Permissions"
              description="Precisely manage your project security. Implement tailored views for Admins, Project Leads, and Developers."
              featured={true}
              visualHint={
                <div className="relative h-12 w-full overflow-hidden bg-background-dark/50 rounded-lg p-2 border border-white/5">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="text-[6px] font-mono whitespace-nowrap animate-binary text-secondary">
                      {Array(10).fill('0101101001 10010110 01110100 11001010').join('\n')}
                    </div>
                  </div>
                  <div className="relative flex items-center justify-between z-10">
                    <div className="text-[8px] font-mono text-secondary">ACCESS_STATUS:</div>
                    <div className="px-1.5 py-0.5 rounded bg-secondary/20 text-[8px] font-mono text-secondary uppercase animate-pulse border border-secondary/30">Verified</div>
                  </div>
                </div>
              }
            />
          </Reveal>

          <Reveal className="col-span-12 md:col-span-6 lg:col-span-4" direction="right" delay={100} threshold={0.08}>
            <FeatureCard
              icon={<GitBranch className="text-primary-light" size={28} />}
              title="GitHub Sync"
              description="Direct link with your codebase. Track PRs, commits, and deployment status in real-time."
              visualHint={
                <div className="relative w-full h-8 mt-2 flex items-center justify-between px-2">
                  <div className="w-4 h-4 rounded-full bg-primary-light/20 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full bg-primary-light animate-pulse-ring" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-light shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                  </div>
                  <div className="flex-1 relative h-[1px] mx-4">
                    <div className="absolute inset-0 bg-white/10" />
                    <div className="absolute h-1 w-2 bg-primary-light/60 rounded-full top-1/2 -translate-y-1/2 animate-data-flow" />
                  </div>
                  <div className="w-4 h-4 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white/20 rounded-sm" />
                  </div>
                </div>
              }
            />
          </Reveal>

          <Reveal className="col-span-12 md:col-span-6 lg:col-span-4" direction="up" delay={0} threshold={0.08}>
            <FeatureCard
              icon={<Globe className="text-status-info" size={28} />}
              title="Global Insights"
              description="Analytics across your entire portfolio. Identify bottlenecks before they impact delivery."
              visualHint={
                <div className="flex items-end gap-1 mt-2 h-10">
                  {[40, 70, 50, 90, 60, 80].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-status-info/30 rounded-t-sm transition-all duration-700"
                      style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
              }
            />
          </Reveal>

          <Reveal className="col-span-12 md:col-span-6 lg:col-span-4" direction="up" delay={120} threshold={0.08}>
            <FeatureCard
              icon={<Terminal className="text-primary" size={28} />}
              title="Magic Bar AI"
              description="Command your infrastructure with natural language. AI-assisted project creation."
              visualHint={
                <div className="font-mono text-[9px] text-primary/80 mt-2 bg-black/40 p-2 rounded-lg border border-primary/20 shadow-inner group-hover:border-primary/40 transition-colors h-10 flex items-center">
                  <div className="w-fit animate-typing whitespace-nowrap">
                    <span className="text-primary-light/60">{'>'}</span> nexasetu deploy --prod
                  </div>
                </div>
              }
            />
          </Reveal>

          <Reveal className="col-span-12 md:col-span-6 lg:col-span-4" direction="up" delay={240} threshold={0.08}>
            <FeatureCard
              icon={<Rocket className="text-primary" size={28} />}
              title="Instant Units"
              description="Spin up new project environments and team workspaces in seconds."
              visualHint={
                <div className="flex gap-1 mt-2 items-end h-6">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className={`w-4 h-4 rounded transition-all ${i === 0 ? 'bg-primary/40 animate-pulse' : 'bg-white/5'}`} />
                  ))}
                </div>
              }
            />
          </Reveal>

          <Reveal className="col-span-12" direction="up" delay={80} threshold={0.08}>
            <FeatureCard
              icon={<Layers className="text-status-warning" size={28} />}
              title="Dynamic Resource Management"
              description="Visualize team load and resource allocation with surgical precision."
              featured={true}
              layout="horizontal"
              visualHint={
                <div className="relative w-full h-12 bg-white/5 rounded-xl border border-white/5 overflow-hidden p-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[8px] font-mono text-status-warning/60">
                    <span>LOADCAP: 84%</span>
                    <span className="animate-pulse">STABLE</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 w-3/4 bg-status-warning rounded-full animate-pulse transition-all" />
                    <div className="absolute inset-0 w-1/4 h-full bg-white/20 animate-data-flow" />
                  </div>
                </div>
              }
            />
          </Reveal>
        </div>
      </section>

      {/* Role Workspace Section */}
      <section className="py-20 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <ChapterLabel number={2} label="Roles" />
            <Reveal direction="up" delay={100}>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Tailored <span className="text-gradient">Command Centers</span>
              </h2>
            </Reveal>
            <Reveal direction="up" delay={200}>
              <p className="text-text-muted max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                Dashboards architected for your engineering ecosystem role.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                icon: <Cpu className="text-primary" size={28} />,
                role: 'Executive Leadership',
                highlight: 'CTO & VP Engineering',
                description: 'Strategic oversight. Analyze organizational velocity and technical risk.',
                important: true,
                featured: true,
                dir: 'left',
                delay: 0,
                visualHint: (
                  <div className="flex gap-1.5 h-10 items-end">
                    {[60, 40, 85, 30, 95].map((h, i) => (
                      <div key={i} className={`w-2 rounded-t-sm bg-primary/${i % 2 === 0 ? '40' : '20'} animate-pulse`} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                ),
              },
              {
                icon: <Users className="text-secondary" size={24} />,
                role: 'Engineering Management',
                highlight: 'EM & Delivery Leads',
                description: 'Balance team load and identify delivery friction.',
                dir: 'right',
                delay: 100,
                visualHint: (
                  <div className="flex -space-x-2 mt-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full bg-white/10 border border-background-dark flex items-center justify-center text-[8px] font-bold text-secondary">U{i}</div>
                    ))}
                  </div>
                ),
              },
              {
                icon: <Code2 className="text-primary-light" size={24} />,
                role: 'Technical Excellence',
                highlight: 'Tech Leads',
                description: 'Infrastructure stability and deployment pipeline visibility.',
                dir: 'left',
                delay: 150,
                visualHint: (
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-primary-light/40">
                    <CheckCircle size={10} className="text-status-success" /> <span>main:8c4a...</span>
                  </div>
                ),
              },
              {
                icon: <Bug className="text-status-error" size={24} />,
                role: 'Quality Assurance Hub',
                highlight: 'QA Managers',
                description: 'Certify mission readiness. Track defect trends and release gates.',
                important: true,
                dir: 'right',
                delay: 200,
                visualHint: (
                  <div className="relative w-full h-12 bg-background-dark/50 rounded-xl border border-white/5 overflow-hidden">
                    <div className="absolute inset-x-0 h-[1px] bg-status-success/50 animate-scan shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                    <div className="absolute right-2 bottom-2 text-[8px] font-mono text-status-success">READY</div>
                  </div>
                ),
              },
              {
                icon: <GraduationCap className="text-status-success" size={24} />,
                role: 'Growth Track',
                highlight: 'Interns',
                description: 'Guided onboarding to accelerate contributions fast.',
                dir: 'left',
                delay: 250,
                visualHint: (
                  <div className="mt-2 flex gap-1">
                    {[0.3, 0.1, 0.05].map((o, i) => (
                      <div key={i} className="w-2 h-2 rounded" style={{ background: `rgba(34,197,94,${o})` }} />
                    ))}
                  </div>
                ),
              },
              {
                icon: <Heart className="text-status-warning" size={24} />,
                role: 'People Operations',
                highlight: 'HR Teams',
                description: 'Engagement and talent analytics.',
                dir: 'right',
                delay: 300,
                visualHint: (
                  <div className="flex gap-2 items-center">
                    <Activity size={14} className="text-status-warning" />
                    <div className="h-1 w-16 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-status-warning" />
                    </div>
                  </div>
                ),
              },
            ].map((card, idx) => (
              <Reveal key={idx} direction={card.dir} delay={card.delay} threshold={0.08}>
                <RoleCard {...card} />
              </Reveal>
            ))}
          </div>

          <Reveal direction="up" delay={400} threshold={0.05} className="mt-16 md:mt-24">
            <PerspectiveSimulator />
          </Reveal>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <ChapterLabel number={3} label="Scalability" />
          <Reveal direction="up" delay={100}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Strategic <span className="text-gradient">Access Plans</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch md:items-end">
          <Reveal direction="left" delay={0} threshold={0.08}>
            <div className="p-8 glass rounded-[2rem] border border-white/10 hover:border-white/20 transition-all duration-500 h-full">
              <div className="mb-8 font-bold">
                <h3 className="text-xs text-primary uppercase tracking-widest mb-4">Core</h3>
                <div className="text-4xl font-bold mb-2">$0</div>
                <p className="text-text-muted text-sm tracking-tight">For specialized units</p>
              </div>
              <ul className="space-y-4 mb-8">
                {['1 Active Workspace', '3 Portfolio Projects', 'Limited AI Insights'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium opacity-80">
                    <CheckCircle size={16} className="text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block w-full py-4 glass hover:bg-white/10 text-white font-bold rounded-xl text-center">
                Get Started
              </Link>
            </div>
          </Reveal>

          <Reveal direction="scale" delay={150} threshold={0.08}>
            <div className="p-8 bg-linear-to-b from-primary/10 to-transparent glass border border-primary/30 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all">
              <div className="absolute top-6 right-8 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full animate-pulse">
                Standard
              </div>
              <div className="mb-8 font-bold">
                <h3 className="text-xs text-primary uppercase tracking-widest mb-4">Tactical</h3>
                <div className="text-4xl font-bold mb-2">$49<span className="text-lg text-text-muted">/mo</span></div>
                <p className="text-text-muted text-sm tracking-tight">For high-velocity divisions</p>
              </div>
              <ul className="space-y-4 mb-8">
                {['Unlimited Projects', 'Full Mission Control', 'Advanced AI Prediction'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold">
                    <CheckCircle size={16} className="text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block w-full py-4 bg-primary text-white font-black rounded-xl text-center shadow-lg shadow-primary/20">
                Select Tactical
              </Link>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0} threshold={0.08}>
            <div className="p-8 glass rounded-[2rem] border border-white/10 hover:border-white/20 transition-all duration-500 h-full">
              <div className="mb-8 font-bold">
                <h3 className="text-xs text-secondary uppercase tracking-widest mb-4">Division</h3>
                <div className="text-4xl font-bold mb-2">Custom</div>
                <p className="text-text-muted text-sm tracking-tight">For global organizations</p>
              </div>
              <ul className="space-y-4 mb-8">
                {['Multi-Division Sync', 'Dedicated AI Training', 'Strategic Oversight'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium opacity-80">
                    <CheckCircle size={16} className="text-secondary" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block w-full py-4 glass hover:bg-white/10 text-white font-bold rounded-xl text-center">
                Contact Command
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-20 md:pb-32 px-6">
        <Reveal direction="scale" delay={0} threshold={0.1}>
          <div className="max-w-6xl mx-auto glass rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-20 text-center relative overflow-hidden border border-white/10 shadow-3xl group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-1000" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            <ChapterLabel number={4} label="Authorization" />
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight mb-8 relative z-10 leading-tight">
              Ready to command <br className="hidden sm:block" /> your division?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link to="/register" className="px-10 py-5 bg-white text-background-dark font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl">
                Get Started Now
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Site Footer */}
      <footer className="py-16 md:py-20 px-6 border-t border-white/5 bg-background-dark/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 sm:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-xl"></div>
                <div className="relative w-10 h-10 bg-brand rounded-xl flex items-center justify-center p-2 shadow-2xl transition-transform duration-500 overflow-hidden ring-1 ring-white/20">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
                  <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer-logo pointer-events-none" />
                  <div className="grid grid-cols-2 gap-1.5 w-5 h-5 relative z-10" aria-hidden="true">
                    <div className="bg-white rounded-[2px] shadow-sm transform group-hover:rotate-3 transition-transform duration-500" />
                    <div className="bg-white/80 rounded-[2px] shadow-sm" />
                    <div className="bg-white/80 rounded-[2px] shadow-sm" />
                    <div className="bg-white rounded-[2px] shadow-sm relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">NexaSetu</span>
            </Link>
            <p className="text-text-muted max-w-sm text-sm font-medium leading-relaxed">
              Leading the autonomous execution revolution. Mission control for high-density engineering environments.
            </p>
          </div>
          <div>
            <h4 className="text-white font-black mb-6 text-sm uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4 text-text-muted font-bold text-xs">
              <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary transition-colors cursor-pointer uppercase tracking-wider">Capabilities</button></li>
              <li><button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary transition-colors cursor-pointer uppercase tracking-wider">Tactical Plans</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black mb-6 text-sm uppercase tracking-widest">Command</h4>
            <ul className="space-y-4 text-text-muted font-bold text-xs">
              <li><Link to="/register" className="hover:text-primary transition-colors uppercase tracking-wider">Get Started</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors uppercase tracking-wider">Sign In</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
          <p>&copy; 2026 NexaSetu Division. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/security" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Parallax Decorative Background
const BackgroundGlow = ({ parallax = 0 }) => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50">
    <div
      className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px] animate-pulse"
      style={{ transform: `translateY(${parallax * HOME_CONFIG.ANIMATION.GLOW_PARALLAX_TOP}px)` }}
    />
    <div
      className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[140px]"
      style={{ transform: `translateY(${parallax * HOME_CONFIG.ANIMATION.GLOW_PARALLAX_BOTTOM}px)` }}
    />
    <div className="absolute top-[25%] left-[60%] w-[40%] h-[40%] bg-status-info/5 rounded-full blur-[120px] animate-float [animation-duration:20s]" />
    <div className="absolute bottom-[20%] left-[10%] w-[35%] h-[35%] bg-status-warning/5 rounded-full blur-[100px] animate-pulse [animation-duration:15s]" />
  </div>
);

// Feature Component
const FeatureCard = ({ icon, title, description, featured = false, layout = 'vertical', visualHint = null }) => (
  <div
    className={`p-6 md:p-10 bg-white/[0.02] sm:glass rounded-3xl md:rounded-[2rem] border ${
      featured ? 'border-primary/40 bg-linear-to-br from-primary/5 to-transparent' : 'border-white/5'
    } hover:border-primary/30 transition-all group hover:-translate-y-1.5 duration-500 flex h-full ${
      layout === 'horizontal' ? 'flex-col lg:flex-row lg:items-center gap-8' : 'flex-col'
    } ${featured ? 'shadow-[0_0_50px_rgba(59,130,246,0.05)]' : ''}`}
  >
    <div className={layout === 'horizontal' ? 'lg:flex-[1.5]' : ''}>
      <div className={`mb-6 md:mb-8 p-4 bg-background-dark border border-white/5 rounded-2xl w-fit ${featured ? 'ring-2 ring-primary/20 bg-primary/10' : ''} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl group-hover:shadow-primary/10`}>
        {React.cloneElement(icon, { 'aria-hidden': 'true' })}
      </div>
      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-text-muted text-sm md:text-base leading-relaxed mb-6">{description}</p>
      {visualHint && (
        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Live Indicator</div>
          {visualHint}
        </div>
      )}
    </div>
    {layout === 'horizontal' && (
      <div className="flex-1 flex flex-col justify-center lg:border-l lg:border-white/5 lg:pl-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 group-hover:bg-primary/5 transition-colors">
            <div className="h-1 w-12 bg-primary/40 rounded-full mb-3" />
            <div className="h-3 w-full bg-white/10 rounded-full" />
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 group-hover:bg-secondary/5 transition-colors">
            <div className="h-1 w-12 bg-secondary/40 rounded-full mb-3" />
            <div className="h-3 w-full bg-white/10 rounded-full" />
          </div>
        </div>
      </div>
    )}
  </div>
);

// Role Component
const RoleCard = ({ icon, role, highlight, description, important = false, featured = false, visualHint = null }) => (
  <div
    className={`p-6 md:p-8 bg-white/[0.02] sm:glass rounded-3xl md:rounded-[2rem] border ${
      important ? 'border-secondary/30 bg-secondary/5' : 'border-white/5'
    } hover:border-white/20 hover:-translate-y-1.5 transition-all duration-500 group relative overflow-hidden h-full flex flex-col shadow-lg`}
  >
    <div className={`absolute top-0 right-0 w-24 h-24 ${important ? 'bg-secondary/10' : 'bg-primary/5'} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all`} />
    <div className="relative z-10 flex-1">
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 ${important ? 'bg-secondary/20' : 'bg-white/5'} rounded-xl group-hover:scale-110 transition-transform flex items-center justify-center`}>
          {React.cloneElement(icon, { 'aria-hidden': 'true' })}
        </div>
        <div>
          <h4 className={`font-bold text-white leading-tight ${featured ? 'text-2xl' : 'text-lg'}`}>{role}</h4>
          <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest mt-1">{highlight}</p>
        </div>
      </div>
      <p className={`text-text-muted leading-relaxed ${featured ? 'text-base' : 'text-sm'}`}>{description}</p>
      {visualHint && (
        <div className="mt-8">
          <div className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Workspace Insight</div>
          {visualHint}
        </div>
      )}
    </div>
    {important && (
      <div className="mt-auto pt-6 flex items-center gap-1.5 text-[8px] font-black text-secondary uppercase tracking-[0.2em] relative z-10">
        <Activity size={10} className="animate-pulse" />
        {featured ? 'Strategic Mission Control Enabled' : 'Critical Path Visibility'}
      </div>
    )}
  </div>
);

// Perspective Simulator Logic
const PerspectiveSimulator = () => {
  const [activeTab, setActiveTab] = useState('leadership');
  const data = ROLE_SIM_DATA[activeTab];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
        <div className="text-center md:text-left">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 block">Interactive Projection</span>
          <h3 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            Simulate <span className="text-gradient">Role Perspective</span>
          </h3>
        </div>
        
        <div 
          role="tablist"
          className="grid grid-cols-2 sm:grid-cols-4 p-1.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 w-full md:w-auto md:min-w-[600px]"
        >
          {Object.entries(ROLE_SIM_DATA).map(([key, role]) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeTab === key}
              aria-controls={`panel-${key}`}
              id={`tab-${key}`}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-xl transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest flex-1 ${
                activeTab === key 
                ? 'bg-white text-background-dark shadow-[0_10px_25px_-5px_rgba(255,255,255,0.2)]' 
                : 'text-white/40 hover:text-white hover:bg-white/10'
              }`}
            >
              <div 
                aria-hidden="true"
                className={`transition-colors duration-300 ${activeTab === key ? 'text-background-dark' : `text-${role.color}`}`}
              >
                {role.icon}
              </div>
              <span className="block">{key}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-white/5 to-secondary/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative glass-dark rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-3xl">
          <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-status-error/40 border border-status-error/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-status-warning/40 border border-status-warning/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-status-success/40 border border-status-success/60" />
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-white/60">
                <Terminal size={12} className="text-primary-light" />
                <span className="uppercase tracking-widest">Workspace://{data.viewLabel}</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2 text-[9px] font-black text-status-success uppercase tracking-[0.2em] animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-status-success" />
                System Active
              </div>
            </div>
          </div>

          <div 
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="p-5 md:p-10 grid grid-cols-12 gap-6 md:gap-12 min-h-[400px]"
          >
            <div className="col-span-12 md:col-span-4 flex flex-col gap-4 md:gap-6">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Primary Indicators</div>
              {data.metrics.map((m, i) => (
                <div key={i} className="p-3 md:p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all group/stat">
                  <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">{m.label}</div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-black text-white">{m.value}</div>
                    <div className={`text-[10px] font-bold ${m.trend.startsWith('+') || m.trend === 'Healthy' || m.trend === 'Peak' ? 'text-status-success' : 'text-primary-light'}`}>
                      {m.trend}
                    </div>
                  </div>
                  <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out" 
                      style={{ width: i === 0 ? '85%' : i === 1 ? '45%' : '70%' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="col-span-12 md:col-span-5 flex flex-col items-center justify-center relative py-8 md:py-12 order-3 md:order-2">
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-48 h-48 md:w-64 md:h-64 border border-white/10 rounded-full animate-rotate-core" />
                <div className="absolute w-32 h-32 md:w-48 md:h-48 border border-white/10 rounded-full animate-rotate-core [animation-direction:reverse]" />
              </div>
              <div className="relative z-10 flex flex-col items-center animate-stat-pop">
                <div className={`w-24 h-24 rounded-3xl bg-${data.color}/20 flex items-center justify-center border border-${data.color}/40 shadow-[0_0_50px_rgba(59,130,246,0.2)] mb-6`}>
                  {React.cloneElement(data.icon, { size: 48, className: `text-${data.color}` })}
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{data.title}</h4>
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-secondary" />
                  <span className="text-xs font-mono text-white/60">Execution Synchronized</span>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-3 flex flex-col gap-6 order-2 md:order-3">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Collective Intel</div>
              <div className="flex flex-col gap-4">
                {data.intelligence.map((msg, i) => (
                  <div key={i} className="relative pl-4 overflow-hidden py-3">
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary to-transparent" />
                    <p className="text-xs font-medium text-white/80 leading-relaxed italic animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 200}ms` }}>
                      "{msg}"
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-auto p-4 glass rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={12} className="text-status-success" />
                  <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Auto-Orchestrator</span>
                </div>
                <div className="text-[10px] text-white/60 font-medium">System is performing proactive risk mitigation. No action required.</div>
              </div>
            </div>
          </div>
          
          <div className="h-1 w-full bg-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent w-40 animate-data-flow" />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <Link 
          to="/register" 
          className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] hover:text-white transition-colors group"
        >
          View Full Dashboard Capabilities
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default Home;
