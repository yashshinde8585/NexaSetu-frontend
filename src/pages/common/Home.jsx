import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layouts/Navbar';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Kept for state safety but effectively decommissioned

  // Inline SVG Icons (Geometric & Monochromatic, matching typography stroke)
  const Icons = {
    ArrowRight: () => (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    ),
    Layers: () => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    Shield: () => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    Cpu: () => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
      </svg>
    ),
    Activity: () => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    Terminal: () => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
    Refresh: () => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        <path d="M23 4v6h-6" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    ),
    Zap: () => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    PieChart: () => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
    ),
    Menu: () => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
    X: () => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  };

  const SIMULATED_EVENTS = [
    {
      text: 'commit: dev_sarah pushed "feat: add oauth2 integrations" to master',
      type: 'commit',
      val: 68,
    },
    { text: 'NexaSetu: auto-synced commit to "Sprint 3"', type: 'sync' },
    {
      text: 'NexaSetu: Project progress updated to 68% (+3%)',
      type: 'progress',
      val: 68,
    },
    {
      text: 'PR opened: dev_alex opened PR #114 "refactor: db query indexing"',
      type: 'pr',
    },
    {
      text: 'NexaSetu: Blocker alert resolved for Task #42 by dev_alex',
      type: 'blocker',
    },
    {
      text: 'NexaSetu: Project progress updated to 74% (+6%)',
      type: 'progress',
      val: 74,
    },
    {
      text: 'commit: dev_john pushed "fix: resolve auth redirect crash" to master',
      type: 'commit',
      val: 80,
    },
    { text: 'NexaSetu: auto-assigned to Sprint 3', type: 'sync' },
    {
      text: 'NexaSetu: Project progress updated to 80% (+6%)',
      type: 'progress',
      val: 80,
    },
    { text: 'NexaSetu: AI Sprint Summary generated for Sprint 3', type: 'ai' },
  ];

  const [logs, setLogs] = useState([
    { text: 'System: Initializing NexaSetu event sync...', type: 'system' },
    { text: 'System: Connected to GitHub API (Status: 200)', type: 'system' },
  ]);
  const [currentProgress, setCurrentProgress] = useState(65);
  const [activeTab, setActiveTab] = useState('overview');

  // Interactive states for below-the-fold elements
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [currency, setCurrency] = useState('inr');
  const [activeRole, setActiveRole] = useState('executive');
  const [activeFeatureRole, setActiveFeatureRole] = useState('Developer');
  const [workloads, setWorkloads] = useState([75, 90, 45]);
  const [isBalancing, setIsBalancing] = useState(false);
  const [commandText, setCommandText] = useState('');
  const [commandOutput, setCommandOutput] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      const event = SIMULATED_EVENTS[index];
      setLogs((prev) => {
        const timestamp = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        const next = [
          ...prev,
          { text: `[${timestamp}] ${event.text}`, type: event.type },
        ];
        if (next.length > 5) next.shift();
        return next;
      });
      if (event.val) {
        setCurrentProgress(event.val);
      }
      index = (index + 1) % SIMULATED_EVENTS.length;
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // typing simulator for Command Bar card
  useEffect(() => {
    const commandsList = [
      {
        cmd: '/sprint-summary',
        output: 'Sprint 3: 82% complete. 2 tasks blocked.',
      },
      {
        cmd: '/assign-task #42 @alex',
        output: 'Assigned Alex Miller to Task #42.',
      },
      { cmd: '/view-velocity', output: 'Velocity trend: +12% this week.' },
    ];
    let currentIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timer;

    const tick = () => {
      const current = commandsList[currentIdx];
      if (!isDeleting) {
        setCommandText(current.cmd.substring(0, charIdx + 1));
        charIdx++;
        if (charIdx === current.cmd.length) {
          setCommandOutput(current.output);
          isDeleting = true;
          timer = setTimeout(tick, 3000);
        } else {
          timer = setTimeout(tick, 100);
        }
      } else {
        setCommandOutput('');
        setCommandText(current.cmd.substring(0, charIdx - 1));
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          currentIdx = (currentIdx + 1) % commandsList.length;
          timer = setTimeout(tick, 1000);
        } else {
          timer = setTimeout(tick, 50);
        }
      }
    };

    timer = setTimeout(tick, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleBalanceWorkload = () => {
    if (isBalancing) return;
    setIsBalancing(true);
    setWorkloads([70, 70, 70]);
  };

  const handleResetWorkload = () => {
    setWorkloads([75, 90, 45]);
    setIsBalancing(false);
  };

  // Feature Mocks
  const renderAccessControlMock = () => {
    const rolesConfig = {
      Developer: { deploy: false, config: false },
      Lead: { deploy: true, config: false },
      Admin: { deploy: true, config: true },
    };
    const currentPerms = rolesConfig[activeFeatureRole];
    return (
      <div className="bg-background-elevated/60 border border-border-subtle p-3 rounded-lg font-mono text-[9px] mt-4 space-y-2.5 transition-all duration-300">
        <div className="flex bg-white/5 border border-white/10 p-0.5 rounded gap-1">
          {['Developer', 'Lead', 'Admin'].map((r) => (
            <button
              key={r}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveFeatureRole(r);
              }}
              className={`flex-1 text-center py-1 text-[8px] font-black rounded uppercase transition-colors cursor-pointer ${
                activeFeatureRole === r
                  ? 'bg-primary text-black'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-white/60">VIEW_REPOS</span>
            <span className="text-status-success font-black">ALLOWED</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">DEPLOY_PROD</span>
            <span
              className={
                currentPerms.deploy
                  ? 'text-status-success font-black'
                  : 'text-status-error font-black'
              }
            >
              {currentPerms.deploy ? 'ALLOWED' : 'DENIED'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">WRITE_CONFIG</span>
            <span
              className={
                currentPerms.config
                  ? 'text-status-success font-black'
                  : 'text-status-error font-black'
              }
            >
              {currentPerms.config ? 'ALLOWED' : 'DENIED'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderCodebaseSyncMock = () => {
    return (
      <div className="bg-background-elevated/60 border border-border-subtle p-3 rounded-lg font-mono text-[9px] mt-4 space-y-2">
        <div className="flex items-center justify-between text-white/40 border-b border-white/5 pb-1">
          <span>GITHUB WEBHOOKS</span>
          <span className="animate-pulse text-status-success">ACTIVE</span>
        </div>
        <div className="space-y-1 text-left text-white/70 overflow-hidden h-[54px] flex flex-col justify-end">
          <div className="opacity-40 scale-95 origin-left transition-all">
            gh-webhook: branch 'main' updated
          </div>
          <div className="opacity-70 scale-95 origin-left transition-all">
            sync-agent: processing 4 commits
          </div>
          <div className="text-primary animate-pulse font-bold">
            NexaSetu: Sprint 3 progress updated (+4%)
          </div>
        </div>
      </div>
    );
  };

  const renderHealthMetricsMock = () => {
    return (
      <div className="bg-background-elevated/60 border border-border-subtle p-3 rounded-lg font-mono text-[9px] mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-white/40">VELOCITY HEALTH</span>
          <span className="text-status-success font-bold">94% EXCELLENT</span>
        </div>
        <div className="h-10 flex items-end gap-1 px-1">
          {[40, 55, 45, 60, 50, 70, 65, 80, 75, 94].map((val, idx) => (
            <div
              key={idx}
              className="flex-1 bg-primary/20 hover:bg-primary border border-primary/10 rounded-sm transition-all duration-300 relative group"
              style={{ height: `${val}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-white text-black text-[7px] font-black px-1 rounded">
                {val}%
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCommandBarMock = () => {
    return (
      <div className="bg-background-elevated/60 border border-border-subtle p-3 rounded-lg font-mono text-[9px] mt-4 space-y-1.5 min-h-[82px] flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span className="text-primary font-bold">&gt;</span>
            <span className="text-white font-medium">{commandText}</span>
            <span className="w-1.5 h-3 bg-white/70 animate-pulse inline-block" />
          </div>
          {commandOutput && (
            <div className="text-status-success/90 bg-status-success/5 border border-status-success/10 p-1.5 rounded animate-fade-in text-[8px] leading-tight">
              {commandOutput}
            </div>
          )}
        </div>
        <div className="text-[7px] text-white/30 uppercase tracking-widest text-right">
          Interactive Command Input
        </div>
      </div>
    );
  };

  const renderEnvironmentsMock = () => {
    return (
      <div className="bg-background-elevated/60 border border-border-subtle p-3 rounded-lg font-mono text-[9px] mt-4 space-y-2">
        <div className="flex justify-between items-center text-white/40">
          <span>ACTIVE DEPLOYMENTS</span>
          <span>3 TOTAL</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { name: 'Dev', status: 'Active', color: 'bg-primary' },
            { name: 'Staging', status: 'Active', color: 'bg-secondary' },
            { name: 'Prod', status: 'Active', color: 'bg-status-success' },
          ].map((env) => (
            <div
              key={env.name}
              className="border border-white/5 p-1.5 rounded bg-white/[0.02] flex flex-col items-center"
            >
              <span className="text-white/80 font-bold">{env.name}</span>
              <div className="flex items-center gap-1 mt-1">
                <span
                  className={`w-1 h-1 rounded-full ${env.color} animate-pulse`}
                />
                <span className="text-[7px] text-white/40">{env.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOptimizationMock = () => {
    return (
      <div className="bg-background-elevated/60 border border-border-subtle p-3 rounded-lg font-mono text-[9px] mt-4 space-y-2">
        <div className="flex justify-between items-center text-white/40">
          <span>CAPACITY MONITOR</span>
          <span>{isBalancing ? 'BALANCING...' : 'SKEWED'}</span>
        </div>
        <div className="space-y-1.5">
          {['Sarah', 'Alex', 'John'].map((name, i) => (
            <div key={name} className="space-y-0.5">
              <div className="flex justify-between text-[7px] text-white/40 uppercase">
                <span>{name}</span>
                <span>{workloads[i]}%</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    workloads[i] > 80
                      ? 'bg-status-error'
                      : workloads[i] < 50
                        ? 'bg-status-warning'
                        : 'bg-status-success'
                  }`}
                  style={{ width: `${workloads[i]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center gap-2 pt-1">
          {workloads[1] === 90 ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleBalanceWorkload();
              }}
              disabled={isBalancing}
              className="w-full text-center py-1.5 bg-text text-background font-black uppercase text-[8px] tracking-wider rounded hover:opacity-90 transition-colors cursor-pointer"
            >
              {isBalancing ? 'Optimizing...' : 'Optimize Load Balance'}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleResetWorkload();
              }}
              className="w-full text-center py-1.5 border border-border-subtle text-text font-black uppercase text-[8px] tracking-wider rounded hover:bg-text/10 transition-colors cursor-pointer"
            >
              Reset Simulation
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderOverviewTab = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block mb-1">
            Active Projects
          </span>
          <span className="text-xl font-black text-white">3</span>
          <span className="text-[8px] text-status-success font-bold block mt-1 uppercase">
            All Tracked
          </span>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block mb-1">
            Workspace Members
          </span>
          <span className="text-xl font-black text-white">12</span>
          <span className="text-[8px] text-white/20 font-bold block mt-1 uppercase">
            Active Now
          </span>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block mb-1">
            System Health
          </span>
          <span className="text-xl font-black text-status-success">100%</span>
          <span className="text-[8px] text-status-success font-bold block mt-1 uppercase">
            Operational
          </span>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
            Workspace Velocity (Last 30 Days)
          </span>
          <span className="text-[10px] text-status-success font-bold uppercase tracking-widest">
            +12% Trend
          </span>
        </div>
        <div className="h-24 w-full opacity-70">
          <svg
            className="w-full h-full"
            viewBox="0 0 300 80"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 60 Q 30 45, 60 55 T 120 30 T 180 40 T 240 15 T 300 10 L 300 80 L 0 80 Z"
              fill="url(#chartGrad)"
            />
            <path
              d="M 0 60 Q 30 45, 60 55 T 120 30 T 180 40 T 240 15 T 300 10"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  const renderSprintsTab = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl">
        <div>
          <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] block mb-1">
            Current Active Cycle
          </span>
          <span className="text-sm font-black text-white uppercase tracking-wider">
            Sprint 3
          </span>
        </div>
        <div className="text-right">
          <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] block mb-1">
            Status
          </span>
          <span className="text-[10px] text-status-success font-bold uppercase tracking-widest bg-status-success/10 px-2 py-0.5 border border-status-success/10">
            Active
          </span>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
              Project Progress
            </span>
            <span className="text-[11px] font-black text-primary">
              {currentProgress}%
            </span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
            <div
              className="bg-primary h-full transition-all duration-500 ease-out"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 space-y-2.5">
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] block">
            AI Sprint Summary
          </span>
          <p className="text-[11px] text-white/85 leading-relaxed bg-black/40 border border-white/10 p-3 rounded-lg uppercase tracking-wide font-medium">
            Team velocity increased this week. All major database optimizations
            are completed. 1 resolution of task blockages reported on database
            indexings.
          </p>
        </div>
      </div>
    </div>
  );

  const renderWorkloadTab = () => (
    <div className="space-y-5 animate-in fade-in duration-300">
      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block px-1">
        Team Capacity & Distribution
      </span>
      <div className="space-y-3.5">
        {[
          {
            name: 'Sarah Chen',
            role: 'Lead Developer',
            tasks: 3,
            pct: 30,
            color: 'bg-status-success',
          },
          {
            name: 'Alex Miller',
            role: 'Senior Engineer',
            tasks: 5,
            pct: 75,
            color: 'bg-status-warning',
          },
          {
            name: 'John Davis',
            role: 'Junior Developer',
            tasks: 2,
            pct: 20,
            color: 'bg-status-success',
          },
        ].map((member) => (
          <div
            key={member.name}
            className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded bg-black border border-white/10 flex items-center justify-center text-[9px] font-bold text-white">
                {member.name.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] font-bold text-white block uppercase tracking-tight">
                  {member.name}
                </span>
                <span className="text-[8px] text-white/30 uppercase font-semibold">
                  {member.role}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 w-1/2">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[8px] font-bold text-white/30 uppercase">
                  <span>Workload</span>
                  <span>{member.tasks} Active</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${member.color}`}
                    style={{ width: `${member.pct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-white selection:text-black antialiased overflow-x-hidden nexa-grid">
      <Navbar />

      <header className="relative min-h-[60vh] md:min-h-[80vh] flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <div className="max-w-[1440px] w-full flex flex-col items-center justify-center">
          <h1 className="text-[9vw] sm:text-[7vw] md:text-[5vw] lg:text-[5.5vw] font-bold leading-[0.95] tracking-[-0.05em] uppercase mb-8 max-w-[20ch] mx-auto">
            NexaSetu:{' '}
            <span className="text-white/40">AI-Powered GitHub Project Orchestration for Engineering Teams</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 font-normal tracking-tight leading-relaxed">
            Turn GitHub activity into real-time execution intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
            <Link
              to="/register"
              className="w-full sm:w-auto px-10 md:px-12 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] hover:invert transition-all flex items-center justify-center gap-4"
            >
              Launch Dashboard <Icons.ArrowRight />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-10 md:px-12 py-5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </header>

      {/* Platform Preview Section */}
      <section className="max-w-[1440px] mx-auto px-6 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Interactive Dashboard Preview */}
          <div className="lg:col-span-8 bg-background-dark border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl">
            {/* Header / Tabs */}
            <div className="px-6 py-4 bg-white/[0.02] border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-status-error" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-warning" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-success" />
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-3">
                  NexaSetu Sandbox
                </span>
              </div>
              <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-lg w-full sm:w-auto">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'sprints', label: 'Sprints' },
                  { id: 'workload', label: 'Workload' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex-1 sm:flex-none px-3.5 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all rounded-md ${
                      activeTab === t.id
                        ? 'bg-white text-black'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard Panel View */}
            <div className="p-6 md:p-8 flex-1 min-h-[350px] flex flex-col justify-center">
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'sprints' && renderSprintsTab()}
              {activeTab === 'workload' && renderWorkloadTab()}
            </div>
          </div>

          {/* Right: Live Telemetry Event stream */}
          <div className="lg:col-span-4 bg-black border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl font-mono">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/55 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  Live Event Stream
                </span>
                <span className="text-[8px] text-white/20 uppercase font-black">
                  Telemetric
                </span>
              </div>
              <div className="space-y-4 text-[9px] leading-relaxed break-all">
                {logs.map((log, idx) => {
                  let colorClass = 'text-white/40';
                  if (log.type === 'commit') colorClass = 'text-status-success';
                  if (log.type === 'sync') colorClass = 'text-primary-light';
                  if (log.type === 'progress') colorClass = 'text-secondary';
                  if (log.type === 'blocker') colorClass = 'text-status-error';
                  if (log.type === 'ai') colorClass = 'text-status-warning';

                  return (
                    <div key={idx} className={`${colorClass} animate-fade-in`}>
                      {log.text}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="border-t border-white/10 pt-4 mt-6 flex justify-between items-center text-[8px] text-white/20 font-black uppercase tracking-widest">
              <span>Websocket Connected</span>
              <span className="animate-pulse text-status-success">Online</span>
            </div>
          </div>
        </div>
      </section>

      {/* "How It Works" Section */}
      <section className="max-w-[1440px] mx-auto px-6 pb-20 md:pb-28 border-t border-white/15 pt-20 md:pt-28">
        <div className="mb-16 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">
            Workflows
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mt-4">
            Enterprise GitHub Sync & Velocity Tracking
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 bg-white/10 gap-[1px] border border-white/10">
          <div className="bg-background-light p-8 sm:p-12 flex flex-col justify-between min-h-[260px] group hover:bg-background-elevated transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-3xl font-black text-white/10 group-hover:text-primary transition-all">
                01
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-primary">
                Integrate
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold uppercase tracking-tight mb-3">
                Connect Git Provider
              </h3>
              <p className="text-white/60 text-xs font-normal leading-relaxed">
                Connect NexaSetu to GitHub in seconds. Our webhooks listen to
                commits, PR status, and branch updates automatically.
              </p>
            </div>
          </div>

          <div className="bg-background-light p-8 sm:p-12 flex flex-col justify-between min-h-[260px] group hover:bg-background-elevated transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-3xl font-black text-white/10 group-hover:text-secondary transition-all">
                02
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
                Map
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold uppercase tracking-tight mb-3">
                Align Projects & Sprints
              </h3>
              <p className="text-white/60 text-xs font-normal leading-relaxed">
                Reorganize repositories into project cycles, configure teams,
                and map sprint deliverables. NexaSetu automatically structures
                tasks and capacities.
              </p>
            </div>
          </div>

          <div className="bg-background-light p-8 sm:p-12 flex flex-col justify-between min-h-[260px] group hover:bg-background-elevated transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-3xl font-black text-white/10 group-hover:text-status-success transition-all">
                03
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-status-success">
                Extract
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold uppercase tracking-tight mb-3">
                Continuous Intelligence
              </h3>
              <p className="text-white/60 text-xs font-normal leading-relaxed">
                Instantly track team velocity, flow efficiency, and blockages.
                Get daily updates and automated AI-driven summaries without
                manual documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUST BANNER MARQUEE --- */}
      <div className="w-full border-y border-white/10 py-12 bg-black overflow-hidden relative">
        <div className="flex whitespace-nowrap gap-24 items-center animate-marquee">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-24 text-[11px] font-black uppercase tracking-[0.6em] text-white/20"
            >
              <span>Enterprise Security</span>
              <span className="w-1.5 h-1.5 bg-white/20 rotate-45" />
              <span>Zero Data Loss</span>
              <span className="w-1.5 h-1.5 bg-white/20 rotate-45" />
              <span>Proactive Risk Analysis</span>
              <span className="w-1.5 h-1.5 bg-white/20 rotate-45" />
              <span>Live Codebase Sync</span>
              <span className="w-1.5 h-1.5 bg-white/20 rotate-45" />
            </div>
          ))}
        </div>
      </div>

      {/* --- PLATFORM FEATURES SECTION --- */}
      <section
        id="matrix"
        className="max-w-[1440px] mx-auto px-6 py-20 md:py-28"
      >
        <div className="mb-16 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">
            Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mt-4">
            Proactive Risk Analysis for Sprints
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 bg-white/15 gap-[1px] border border-white/10 overflow-hidden rounded-xl">
          {/* Feature 1: Access Control */}
          <div className="md:col-span-4 bg-background-light p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[300px]">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 border border-white/10 rounded-lg group-hover:border-primary/30 group-hover:text-primary transition-colors text-white/40">
                  <Icons.Shield />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">
                  Governance
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-white">
                  Access Control
                </h3>
                <p className="text-white/60 text-xs font-normal leading-relaxed">
                  Secure organizational workspaces with precise, role-based
                  visibility controls.
                </p>
              </div>
            </div>
            {renderAccessControlMock()}
          </div>

          {/* Feature 2: Codebase Sync */}
          <div className="md:col-span-8 bg-background-light p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[300px] border-t md:border-t-0 md:border-l border-white/10">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 border border-white/10 rounded-lg group-hover:border-primary/30 group-hover:text-primary transition-colors text-white/40">
                  <Icons.Refresh />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">
                  Integrations
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-white">
                  Codebase Sync
                </h3>
                <p className="text-white/60 text-xs font-normal leading-relaxed max-w-md">
                  Sync GitHub repositories to track PRs, commits, and deployment
                  status in real-time.
                </p>
              </div>
            </div>
            {renderCodebaseSyncMock()}
          </div>

          {/* Feature 3: Health Metrics */}
          <div className="md:col-span-8 bg-background-light p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[300px] border-t border-white/10">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 border border-white/10 rounded-lg group-hover:border-primary/30 group-hover:text-primary transition-colors text-white/40">
                  <Icons.Activity />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">
                  Analytics
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-white">
                  Health Metrics
                </h3>
                <p className="text-white/60 text-xs font-normal leading-relaxed max-w-md">
                  Monitor sprint velocity and eliminate project blockages with
                  predictive insights.
                </p>
              </div>
            </div>
            {renderHealthMetricsMock()}
          </div>

          {/* Feature 4: Command Bar */}
          <div className="md:col-span-4 bg-background-light p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[300px] border-t md:border-t-0 md:border-l border-white/10 md:border-t border-white/10">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 border border-white/10 rounded-lg group-hover:border-primary/30 group-hover:text-primary transition-colors text-white/40">
                  <Icons.Terminal />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">
                  Control
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-white">
                  Command Bar
                </h3>
                <p className="text-white/60 text-xs font-normal leading-relaxed">
                  Manage workspace operations through a natural language
                  interface.
                </p>
              </div>
            </div>
            {renderCommandBarMock()}
          </div>

          {/* Feature 5: Environments */}
          <div className="md:col-span-6 bg-background-light p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[300px] border-t border-white/10">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 border border-white/10 rounded-lg group-hover:border-primary/30 group-hover:text-primary transition-colors text-white/40">
                  <Icons.Layers />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">
                  Infrastructure
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-white">
                  Environments
                </h3>
                <p className="text-white/60 text-xs font-normal leading-relaxed">
                  Configure multiple workspaces and projects for different
                  teams.
                </p>
              </div>
            </div>
            {renderEnvironmentsMock()}
          </div>

          {/* Feature 6: Optimization */}
          <div className="md:col-span-6 bg-background-light p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[300px] border-t md:border-t-1 md:border-l border-white/10">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 border border-white/10 rounded-lg group-hover:border-primary/30 group-hover:text-primary transition-colors text-white/40">
                  <Icons.PieChart />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">
                  Optimization
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-white">
                  Workload Balancing
                </h3>
                <p className="text-white/60 text-xs font-normal leading-relaxed">
                  Visualize cross-team dependencies and optimize team workload
                  distribution.
                </p>
              </div>
            </div>
            {renderOptimizationMock()}
          </div>
        </div>
      </section>

      {/* --- BUILT FOR EVERY ROLE SECTION (TABBED PREVIEW) --- */}
      <section
        id="verticals"
        className="max-w-[1440px] mx-auto px-6 py-20 md:py-28 border-t border-white/10"
      >
        <div className="mb-16 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">
            Role Alignment
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mt-4">
            Real-Time Project Intelligence for Engineering Teams
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Role Selection Tabs */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2.5 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
            {[
              {
                id: 'executive',
                label: 'Executive Leadership',
                desc: 'CTOs & Engineering VPs',
              },
              {
                id: 'delivery',
                label: 'Product Delivery',
                desc: 'EMs & Product Managers',
              },
              {
                id: 'engineering',
                label: 'Software Engineers',
                desc: 'Individual Contributors',
              },
              {
                id: 'devops',
                label: 'DevOps & Admins',
                desc: 'System Administrators',
              },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`w-full text-left p-5 rounded-xl border transition-all flex flex-col justify-center min-w-[200px] lg:min-w-0 cursor-pointer ${
                  activeRole === role.id
                    ? 'bg-white border-white text-black'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/[0.08]'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block mb-1">
                  {role.label}
                </span>
                <span
                  className={`text-[8px] uppercase tracking-widest ${
                    activeRole === role.id ? 'text-black/60' : 'text-white/40'
                  }`}
                >
                  {role.desc}
                </span>
              </button>
            ))}
          </div>

          {/* Right: Role Details and Preview Box */}
          <div className="lg:col-span-8 bg-background-dark border border-white/10 rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-center justify-between shadow-2xl">
            <div className="flex-1 space-y-6 text-left">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
                  {activeRole === 'executive' && 'CTOs & VPs'}
                  {activeRole === 'delivery' && 'EMs & Product Leads'}
                  {activeRole === 'engineering' && 'Software Engineers'}
                  {activeRole === 'devops' && 'DevOps & Admins'}
                </span>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mt-1">
                  {activeRole === 'executive' && 'Portfolio Clarity'}
                  {activeRole === 'delivery' && 'Delivery Predictability'}
                  {activeRole === 'engineering' && 'Automated Progress'}
                  {activeRole === 'devops' && 'Environment Governance'}
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest block mb-1">
                    The Challenge
                  </span>
                  <p className="text-white/60 text-xs leading-relaxed font-normal">
                    {activeRole === 'executive' &&
                      'CTOs lack real-time visibility into whether engineering output is actually aligned with strategic roadmaps, resulting in manual sync calls.'}
                    {activeRole === 'delivery' &&
                      'Managers spend hours chasing updates to figure out if a sprint is on track, only discovering blockages at the end of the sprint.'}
                    {activeRole === 'engineering' &&
                      'Developers are forced to manually update Jira tickets, write sprint updates, and break their focus with administrative overhead.'}
                    {activeRole === 'devops' &&
                      'Admins need secure role-based controls and workspace access management that automatically aligns with corporate compliance rules.'}
                  </p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest block mb-1">
                    The NexaSetu Solution
                  </span>
                  <p className="text-white/80 text-xs leading-relaxed font-normal">
                    {activeRole === 'executive' &&
                      'NexaSetu compiles repository activities into executive dashboards, displaying high-level project statuses and roadmap metrics automatically.'}
                    {activeRole === 'delivery' &&
                      'NexaSetu auto-tracks progress and alerts leads when sprint deliverables are blocked by pending pull requests or active developer fatigue.'}
                    {activeRole === 'engineering' &&
                      'NexaSetu works in the background. Simply write commits and open pull requests—the platform automatically maps commits to active sprint tasks.'}
                    {activeRole === 'devops' &&
                      'Secure organizational workspaces with precise, role-based controls and audit logs. Verify branch sync statuses in real-time.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 flex gap-8">
                <div>
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest block mb-1">
                    Outcome Metric
                  </span>
                  <span className="text-sm font-bold text-status-success uppercase tracking-wide">
                    {activeRole === 'executive' && '92% Fewer Status Meetings'}
                    {activeRole === 'delivery' &&
                      '3.4x Faster Issue Resolution'}
                    {activeRole === 'engineering' && '100% Automated Updates'}
                    {activeRole === 'devops' && 'Zero Config Overhead'}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated mini screen representing the Role View */}
            <div className="w-full md:w-[280px] shrink-0">
              {activeRole === 'executive' && (
                <div className="bg-background-elevated/60 border border-border-subtle rounded-xl p-5 space-y-4 font-mono text-[9px] w-full animate-fade-in">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="font-bold text-white/60">
                      PORTFOLIO OVERVIEW
                    </span>
                    <span className="text-primary">Q2 ROADMAP</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-full border-4 border-primary border-r-transparent flex items-center justify-center font-bold text-xs text-white shrink-0">
                      82%
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex justify-between">
                        <span className="truncate mr-2">Active Sprints</span>
                        <span className="font-bold text-white">3/3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="truncate mr-2">Budget Burn</span>
                        <span className="font-bold text-status-success">
                          On Track
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="truncate mr-2">Avg Velocity</span>
                        <span className="font-bold text-white">48 pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeRole === 'delivery' && (
                <div className="bg-background-elevated/60 border border-border-subtle rounded-xl p-5 space-y-4 font-mono text-[9px] w-full animate-fade-in">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="font-bold text-white/60">
                      DELIVERY SPEED
                    </span>
                    <span className="text-secondary">SPRINT 3</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[8px] border border-white/5 p-1.5 rounded bg-white/[0.01]">
                      <span className="truncate mr-2">
                        TASK #42: DB Indexing
                      </span>
                      <span className="px-1.5 py-0.5 bg-status-error/10 border border-status-error/20 text-status-error font-bold rounded shrink-0">
                        BLOCKED
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[8px] border border-white/5 p-1.5 rounded bg-white/[0.01]">
                      <span className="truncate mr-2">TASK #44: OAuth API</span>
                      <span className="px-1.5 py-0.5 bg-status-success/10 border border-status-success/20 text-status-success font-bold rounded shrink-0">
                        IN REVIEW
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {activeRole === 'engineering' && (
                <div className="bg-background-elevated/60 border border-border-subtle rounded-xl p-5 space-y-4 font-mono text-[9px] w-full animate-fade-in">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="font-bold text-white/60">
                      MY WORKSPACE
                    </span>
                    <span className="text-status-success">CONNECTED</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white/5 border border-white/5 p-2.5 rounded">
                      <div className="flex justify-between font-bold">
                        <span className="truncate mr-2">
                          #31 Fix SSO redirect
                        </span>
                        <span className="text-primary shrink-0">
                          In Progress
                        </span>
                      </div>
                      <p className="text-[7.5px] text-white/40 mt-1.5">
                        Last commit: 'fix: clear cookie store' 10m ago
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {activeRole === 'devops' && (
                <div className="bg-background-elevated/60 border border-border-subtle rounded-xl p-5 space-y-4 font-mono text-[9px] w-full animate-fade-in">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="font-bold text-white/60">
                      SECURITY GATEWAY
                    </span>
                    <span className="text-status-warning">ENFORCED</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="truncate mr-2">SSO Authentication</span>
                      <span className="text-status-success font-bold shrink-0">
                        SAML2 Ok
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="truncate mr-2">
                        Repository Audit Logs
                      </span>
                      <span className="text-status-success font-bold shrink-0">
                        Synced
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="truncate mr-2">Token Expiry Range</span>
                      <span className="text-white/60 shrink-0">30 Days</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING PLANS SECTION --- */}
      <section
        id="tiers"
        className="max-w-[1440px] mx-auto px-6 py-12 md:py-16 border-t border-white/10"
      >
        <div className="mb-8 text-center space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">
            Pricing Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mt-2">
            Simple, transparent plans
          </h2>

          {/* Billing Cycle & Currency Toggles */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-2">
            {/* Billing Cycle Toggle */}
            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                  billingCycle === 'monthly' ? 'text-white' : 'text-white/40'
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() =>
                  setBillingCycle(
                    billingCycle === 'monthly' ? 'annual' : 'monthly'
                  )
                }
                className={`w-9 h-5 border rounded-full p-0.5 relative transition-all duration-300 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-status-success/20 border-status-success/30'
                    : 'bg-white/10 border-white/10'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                    billingCycle === 'annual'
                      ? 'translate-x-4 bg-status-success'
                      : 'translate-x-0 bg-white'
                  }`}
                >
                  <div
                    className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                      billingCycle === 'annual' ? 'bg-white' : 'bg-black/30'
                    }`}
                  />
                </div>
              </button>
              <span
                className={`text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5 ${
                  billingCycle === 'annual' ? 'text-white' : 'text-white/40'
                }`}
              >
                Annually
                <span className="bg-status-success/15 border border-status-success/20 text-status-success text-[7px] font-black px-1.5 py-0.5 rounded tracking-wide">
                  SAVE 20%
                </span>
              </span>
            </div>

            {/* Currency Toggle */}
            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                  currency === 'inr' ? 'text-white' : 'text-white/40'
                }`}
              >
                INR (₹)
              </span>
              <button
                onClick={() => setCurrency(currency === 'inr' ? 'usd' : 'inr')}
                className={`w-9 h-5 border rounded-full p-0.5 relative transition-all duration-300 cursor-pointer ${
                  currency === 'usd'
                    ? 'bg-primary/20 border-primary/30'
                    : 'bg-white/10 border-white/10'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                    currency === 'usd'
                      ? 'translate-x-4 bg-primary'
                      : 'translate-x-0 bg-white'
                  }`}
                >
                  <div
                    className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                      currency === 'usd' ? 'bg-white' : 'bg-black/30'
                    }`}
                  />
                </div>
              </button>
              <span
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                  currency === 'usd' ? 'text-white' : 'text-white/40'
                }`}
              >
                USD ($)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 bg-white/10 gap-[1px] border border-white/10 rounded-xl shadow-2xl">
          {[
            {
              plan: 'FREE',
              price: currency === 'inr' ? '₹0' : '$0',
              desc: 'Perfect for solo developers and small side projects.',
              features: [
                '2 Projects',
                '5 Sprints',
                '3 Users',
                '100 AI Credits',
                'Basic GitHub Sync',
              ],
              cta: 'ACTIVATE PLAN',
            },
            {
              plan: 'PRO',
              price:
                currency === 'inr'
                  ? billingCycle === 'monthly'
                    ? '₹799'
                    : '₹639'
                  : billingCycle === 'monthly'
                    ? '$10'
                    : '$8',
              priceAnnualNum: currency === 'inr' ? 639 : 8,
              desc: 'Advanced features for growing teams and serious engineering.',
              features: [
                '20 Projects',
                '50 Sprints',
                '15 Users',
                '1,500 AI Credits',
                'Webhooks + Auto-Approvals',
                'Proactive Risk Analysis',
              ],
              cta: 'ACTIVATE PLAN',
              recommended: true,
            },
            {
              plan: 'ENTERPRISE',
              price:
                currency === 'inr'
                  ? billingCycle === 'monthly'
                    ? '₹2,999'
                    : '₹2,399'
                  : billingCycle === 'monthly'
                    ? '$36'
                    : '$29',
              priceAnnualNum: currency === 'inr' ? 2399 : 29,
              desc: 'Maximum scale, priority support, and unlimited intelligence.',
              features: [
                'Unlimited Projects',
                'Unlimited Sprints',
                'Unlimited Users',
                'Unlimited AI Credits',
                'Enterprise Integrations',
                'Dedicated Audits',
              ],
              cta: 'ACTIVATE PLAN',
            },
          ].map((p, i) => (
            <div
              key={i}
              className={`bg-background-light p-6 sm:p-8 flex flex-col text-left justify-between ${
                p.recommended ? 'relative bg-background-elevated/40' : ''
              } ${
                i === 0 ? 'rounded-t-xl md:rounded-l-xl md:rounded-tr-none' : ''
              } ${
                i === 2 ? 'rounded-b-xl md:rounded-r-xl md:rounded-bl-none' : ''
              }`}
            >
              <div>
                {p.recommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-sm border border-white">
                    Most Recommended
                  </div>
                )}
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-2 block">
                  {p.plan}
                </span>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black tracking-tighter text-white">
                    {p.price}
                  </span>
                  <span className="text-[10px] font-bold text-white/40 uppercase">
                    / MO
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold block mb-4 ${
                    billingCycle === 'annual' && p.plan !== 'FREE'
                      ? 'text-status-success'
                      : 'text-white/40'
                  }`}
                >
                  {p.plan === 'FREE'
                    ? 'Free forever'
                    : billingCycle === 'monthly'
                      ? 'Billed monthly'
                      : `Billed annually: ${currency === 'inr' ? '₹' : '$'}${((p.priceAnnualNum || 0) * 12).toLocaleString()}/yr`}
                </span>
                <p className="text-white/40 text-[10px] font-normal leading-relaxed mb-6 min-h-[2.5rem]">
                  {p.desc}
                </p>

                <Link
                  to="/register"
                  className={`w-full py-3 text-[10px] font-bold uppercase tracking-widest transition-all text-center mb-6 rounded cursor-pointer block ${
                    p.recommended
                      ? 'bg-white text-black hover:invert'
                      : 'border border-white/10 text-white hover:bg-white hover:text-black'
                  }`}
                >
                  {p.cta}
                </Link>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-white/5">
                {p.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <svg
                      className="w-3 h-3 text-status-success shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section className="max-w-[1440px] mx-auto px-6 py-20 md:py-28 border-t border-white/10">
        <div className="mb-16 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">
            About NexaSetu
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mt-4">
            Unified Strategic Operations & Engineering Command
          </h2>
        </div>
        <div className="max-w-4xl mx-auto space-y-6 text-white/60 text-xs sm:text-sm font-normal leading-relaxed">
          <p>
            NexaSetu is an enterprise-grade AI-powered project orchestration platform designed to streamline software engineering operations by integrating directly with GitHub. By establishing a direct, real-time codebase sync with your repository pipelines, NexaSetu eliminates manual tracking and transforms developer activity into actionable operational intelligence.
          </p>
          <p>
            At the core of the platform is our proactive risk analysis engine. Instead of waiting for post-sprint retrospectives to identify delay patterns, NexaSetu constantly monitors active sprints, code commits, pull requests, and deployment schedules to detect bottlenecks before they impact delivery. It automatically maps progress, calculates team velocity trends, and warns leads about pending code blockages or skewed workload distributions.
          </p>
          <p>
            Connecting GitHub webhooks to NexaSetu takes only seconds. Once the codebase sync is active, our background agents process incoming telemetry logs, associate commits with active projects, and update project boards instantly. This automated workflow keeps the entire organization aligned—from developers tracking their daily pull requests to engineering managers monitoring velocity metrics and CTOs reviewing strategic command dashboards.
          </p>
          <p>
            Engineering velocity is more than just closing tickets; it is about maintaining a healthy, balanced workload. NexaSetu's capacity monitor evaluates individual workloads and identifies engineers who are overloaded or underutilized. Using advanced heuristics, the platform suggests load balancing adjustments to ensure that sprint targets are achieved without causing burnout. Our predictive risk analysis uses historically tracked sprint velocity to estimate completion dates with extreme accuracy, giving executives and stakeholders clear, data-driven delivery timelines.
          </p>
          <p>
            Built with data privacy and enterprise compliance in mind, NexaSetu operates under a zero data loss framework. All data sync processes are encrypted, and access levels are controlled by rigid role-based permissions (from Developer to Workspace Admin). NexaSetu does not store your source code; it only analyzes structural metadata and activity logs to construct the orchestration model. This ensures complete security and compliance with your organization's internal standards.
          </p>
          <p>
            Whether you are managing a small squad or coordinating projects across multiple enterprise engineering verticals, NexaSetu provides the visibility, automation, and predictive intelligence needed to build software with absolute reliability and speed.
          </p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/10 py-16 md:py-24 px-6 bg-black/40">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-16 md:gap-24">
          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 text-white">
              NexaSetu
            </h2>
            <p className="text-white/40 text-[10px] md:text-xs font-normal leading-relaxed tracking-wider uppercase">
              Standardizing engineering execution through unified tools. Built
              for team reliability.
            </p>
          </div>
          <div className="flex flex-col gap-8 text-left md:text-right w-full md:w-auto">
            <div className="flex flex-wrap gap-8 md:gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 justify-start md:justify-end">
              <a
                href="https://github.com/nexasetu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NexaSetu on GitHub"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://x.com/nexasetu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NexaSetu on X"
                className="hover:text-white transition-colors"
              >
                Twitter/X
              </a>
              <a
                href="https://instagram.com/nexasetu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NexaSetu on Instagram"
                className="hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://youtube.com/@nexasetu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NexaSetu on YouTube"
                className="hover:text-white transition-colors"
              >
                YouTube
              </a>
              <a
                href="https://facebook.com/nexasetu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NexaSetu on Facebook"
                className="hover:text-white transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://linkedin.com/in/yashshinde8585"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Yash Shinde on LinkedIn"
                className="hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </div>
            <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/30 not-italic">
              © 2026 NEXASETU INC. ALL RIGHTS RESERVED.
            </div>
            <div className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/20 not-italic mt-2">
              NexaSetu Systems • Mumbai, Maharashtra, IN • Tel: +91-XXXXXXXXXX
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default memo(Home);
