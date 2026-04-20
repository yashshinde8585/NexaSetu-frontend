import React from 'react';
import { 
  Shield, 
  GitBranch, 
  Globe, 
  Terminal, 
  Rocket, 
  Layers,
  Cpu,
  Users,
  Code2,
  Bug,
  GraduationCap,
  Heart,
  Activity,
  CheckCircle
} from 'lucide-react';

export const HOME_CONFIG = {
  EXECUTION_SYSTEM: {
    NODE_COUNT: 12,
    INTERACTION_RADIUS: 15,
    SIZE_BASE: 2,
    SIZE_VARIANCE: 3,
    STATUS_OPTIONS: ['success', 'error', 'info', 'warning'],
  },
  ANIMATION: {
    SIGNAL_INTERVAL: 3000,
    GLOW_PARALLAX_TOP: 0.15,
    GLOW_PARALLAX_BOTTOM: -0.1,
  },
  SIGNALS: [
    { text: '3 tasks at risk', status: 'error' },
    { text: 'Execution Health: 78%', status: 'info' },
    { text: 'AI Suggestion: Reassign backend tasks', status: 'success' },
    { text: 'Dependency path optimized', status: 'warning' },
  ],
};

export const ROLE_CARDS = [
  {
    icon: <Cpu className="text-primary" size={24} />,
    role: 'Executive Oversight',
    highlight: 'CTOs & VPs',
    description: 'Track organizational health and mitigate technical risk with high-level portfolio insights.',
    important: true,
    featured: true,
    dir: 'left',
    delay: 0,
    visualHint: (
      <div className="flex gap-1.5 h-10 items-end">
        {[60, 40, 85, 30, 95].map((h, i) => (
          <div key={i} className={`w-1.5 rounded-t-sm bg-primary/${i % 2 === 0 ? '40' : '20'}`} style={{ height: `${h}%` }} />
        ))}
      </div>
    ),
  },
  {
    icon: <Users className="text-secondary" size={24} />,
    role: 'Delivery Management',
    highlight: 'EMs & Team Leads',
    description: 'Stabilize team velocity and eliminate daily execution friction for smoother shipping.',
    dir: 'right',
    delay: 100,
    visualHint: (
      <div className="flex -space-x-2 mt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-6 h-6 rounded-full bg-white/10 border border-background-dark flex items-center justify-center text-[8px] font-bold text-secondary">U{i}</div>
        ))}
      </div>
    ),
  },
  {
    icon: <Code2 className="text-primary-light" size={24} />,
    role: 'Technical Governance',
    highlight: 'Architects & Tech Leads',
    description: 'Monitor infrastructure health and enforce deployment standards across the stack.',
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
    role: 'Quality Engineering',
    highlight: 'QA Managers',
    description: 'Certify release readiness with automated trend tracking and managed safety gates.',
    important: true,
    dir: 'right',
    delay: 200,
    visualHint: (
      <div className="relative w-full h-8 bg-background-dark/50 rounded-lg border border-white/5 overflow-hidden">
        <div className="absolute inset-x-0 h-[1px] bg-status-success/50 animate-scan shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
      </div>
    ),
  },
  {
    icon: <GraduationCap className="text-status-success" size={24} />,
    role: 'Junior Growth',
    highlight: 'Interns & New Grads',
    description: 'Guided onboarding paths to accelerate individual contributions and skill growth.',
    dir: 'left',
    delay: 250,
  },
  {
    icon: <Heart className="text-status-warning" size={24} />,
    role: 'Talent Analytics',
    highlight: 'People Ops',
    description: 'Understand engagement and team health through data-driven people insights.',
    dir: 'right',
    delay: 300,
  },
];
