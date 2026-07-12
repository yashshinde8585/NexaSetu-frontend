import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layouts/Navbar';

const Home = () => {
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
      text: 'commit: sarah_dev pushed "feat: add oauth2 flow" to master',
      type: 'commit',
      val: 68,
    },
    {
      text: 'NexaSetu: auto-mapped commit to Sprint 3 (Task #45)',
      type: 'sync',
    },
    {
      text: 'NexaSetu: Sprint progress updated to 68% (+3%)',
      type: 'progress',
      val: 68,
    },
    {
      text: 'PR opened: alex_dev opened PR #114 "refactor: db indexing"',
      type: 'pr',
    },
    {
      text: 'NexaSetu: Blocker alert resolved for Task #42',
      type: 'blocker',
    },
    {
      text: 'NexaSetu: Sprint progress updated to 74% (+6%)',
      type: 'progress',
      val: 74,
    },
    {
      text: 'commit: john_dev pushed "fix: cookie redirect" to master',
      type: 'commit',
      val: 80,
    },
    {
      text: 'NexaSetu: auto-mapped commit to Sprint 3 (Task #12)',
      type: 'sync',
    },
    {
      text: 'NexaSetu: Sprint progress updated to 80% (+6%)',
      type: 'progress',
      val: 80,
    },
    { text: 'NexaSetu: Sprint 3 summary compiled from 14 commits', type: 'ai' },
  ];

  const [logs, setLogs] = useState([
    { text: 'System: Synced 14 commits from GitHub...', type: 'system' },
    {
      text: 'System: Active webhooks tracking 3 repositories...',
      type: 'system',
    },
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
        cmd: '/sprint-report',
        output: 'Sprint 3: 82% complete. 1 blocker resolved.',
      },
      {
        cmd: '/assign #42 @alex',
        output: 'Assigned Alex to Task #42.',
      },
      {
        cmd: '/velocity',
        output: 'Sprint velocity: 48 pts (up 12% this week).',
      },
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
      <div className="bg-card border border-border-subtle p-3 rounded-lg font-mono text-[9px] mt-4 space-y-2.5 transition-all duration-300">
        <div className="flex bg-background-elevated border border-border-subtle p-0.5 rounded gap-1">
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
                  ? 'bg-primary text-background'
                  : 'text-text-subtle hover:text-text'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-text-muted">VIEW_REPOSITORIES</span>
            <span className="text-status-success font-black">ALLOWED</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-muted">TRIGGER_DEPLOYMENT</span>
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
            <span className="text-text-muted">MANAGE_INTEGRATIONS</span>
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
      <div className="bg-card border border-border-subtle p-3 rounded-lg font-mono text-[9px] mt-4 space-y-2">
        <div className="flex items-center justify-between text-text-subtle border-b border-border-subtle pb-1">
          <span>REPOSITORY SYNC</span>
          <span className="animate-pulse text-status-success">ACTIVE</span>
        </div>
        <div className="space-y-1 text-left text-text-muted overflow-hidden h-[54px] flex flex-col justify-end">
          <div className="opacity-40 scale-95 origin-left transition-all">
            github-webhook: main branch updated
          </div>
          <div className="opacity-70 scale-95 origin-left transition-all">
            sync-agent: linked 4 commits to Task #12
          </div>
          <div className="text-primary animate-pulse font-bold">
            NexaSetu: Sprint 3 progress updated to 78%
          </div>
        </div>
      </div>
    );
  };

  const renderHealthMetricsMock = () => {
    return (
      <div className="bg-card border border-border-subtle p-3 rounded-lg font-mono text-[9px] mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-text-subtle">SPRINT VELOCITY</span>
          <span className="text-status-success font-bold">48 PTS / WEEK</span>
        </div>
        <div className="h-10 flex items-end gap-1 px-1">
          {[40, 55, 45, 60, 50, 70, 65, 80, 75, 94].map((val, idx) => (
            <div
              key={idx}
              className="flex-1 bg-primary/20 hover:bg-primary border border-primary/10 rounded-sm transition-all duration-300 relative group"
              style={{ height: `${val}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-text text-background text-[7px] font-black px-1 rounded">
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
      <div className="bg-card border border-border-subtle p-3 rounded-lg font-mono text-[9px] mt-4 space-y-1.5 min-h-[82px] flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span className="text-primary font-bold">&gt;</span>
            <span className="text-text font-medium">{commandText}</span>
            <span className="w-1.5 h-3 bg-text/70 animate-pulse inline-block" />
          </div>
          {commandOutput && (
            <div className="text-status-success/90 bg-status-success/5 border border-status-success/10 p-1.5 rounded animate-fade-in text-[8px] leading-tight">
              {commandOutput}
            </div>
          )}
        </div>
        <div className="text-[7px] text-text-subtle uppercase tracking-widest text-right">
          Type / to manage tasks & runs
        </div>
      </div>
    );
  };

  const renderEnvironmentsMock = () => {
    return (
      <div className="bg-card border border-border-subtle p-3 rounded-lg font-mono text-[9px] mt-4 space-y-2">
        <div className="flex justify-between items-center text-text-subtle">
          <span>TRACKED REPOSITORIES</span>
          <span>3 SYNCED</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { name: 'frontend-app', status: 'Synced', color: 'bg-primary' },
            { name: 'backend-api', status: 'Synced', color: 'bg-secondary' },
            {
              name: 'infra-terraform',
              status: 'Synced',
              color: 'bg-status-success',
            },
          ].map((env) => (
            <div
              key={env.name}
              className="border border-border-subtle p-1.5 rounded bg-background-elevated flex flex-col items-center"
            >
              <span className="text-text font-bold truncate max-w-full">
                {env.name}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${env.color} animate-pulse`}
                />
                <span className="text-[7px] text-text-subtle">
                  {env.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOptimizationMock = () => {
    return (
      <div className="bg-card border border-border-subtle p-3 rounded-lg font-mono text-[9px] mt-4 space-y-2">
        <div className="flex justify-between items-center text-text-subtle">
          <span>TEAM CAPACITY</span>
          <span>{isBalancing ? 'BALANCING...' : 'UNBALANCED'}</span>
        </div>
        <div className="space-y-1.5">
          {['Sarah', 'Alex', 'John'].map((name, i) => (
            <div key={name} className="space-y-0.5">
              <div className="flex justify-between text-[7px] text-text-subtle uppercase">
                <span>{name}</span>
                <span>{workloads[i]}%</span>
              </div>
              <div className="w-full bg-background-elevated h-1 rounded-full overflow-hidden">
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
              {isBalancing ? 'Balancing...' : 'Balance Capacity'}
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
              Reset View
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderOverviewTab = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border-subtle p-4 rounded-xl shadow-sm">
          <span className="text-[9px] font-bold text-text-subtle uppercase tracking-widest block mb-1">
            Repositories Linked
          </span>
          <span className="text-xl font-black text-text">3</span>
          <span className="text-[8px] text-status-success font-bold block mt-1 uppercase">
            Synced
          </span>
        </div>
        <div className="bg-card border border-border-subtle p-4 rounded-xl shadow-sm">
          <span className="text-[9px] font-bold text-text-subtle uppercase tracking-widest block mb-1">
            Team Members
          </span>
          <span className="text-xl font-black text-text">12</span>
          <span className="text-[8px] text-text-subtle font-bold block mt-1 uppercase">
            Active
          </span>
        </div>
        <div className="bg-card border border-border-subtle p-4 rounded-xl shadow-sm">
          <span className="text-[9px] font-bold text-text-subtle uppercase tracking-widest block mb-1">
            Webhooks Status
          </span>
          <span className="text-xl font-black text-status-success">100%</span>
          <span className="text-[8px] text-status-success font-bold block mt-1 uppercase">
            Connected
          </span>
        </div>
      </div>

      <div className="bg-card border border-border-subtle p-5 rounded-xl flex flex-col justify-between shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold text-text-subtle uppercase tracking-widest">
            Sprint Velocity (30d)
          </span>
          <span className="text-[10px] text-status-success font-bold uppercase tracking-widest">
            +12% Flow Speed
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
                <stop
                  offset="0%"
                  stopColor="var(--color-primary)"
                  stopOpacity="0.2"
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-primary)"
                  stopOpacity="0"
                />
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
      <div className="flex justify-between items-center bg-card border border-border-subtle p-4 rounded-xl shadow-sm">
        <div>
          <span className="text-[8px] font-bold text-text-subtle uppercase tracking-[0.2em] block mb-1">
            Active Cycle
          </span>
          <span className="text-sm font-black text-text uppercase tracking-wider">
            Sprint 3
          </span>
        </div>
        <div className="text-right">
          <span className="text-[8px] font-bold text-text-subtle uppercase tracking-[0.2em] block mb-1">
            Status
          </span>
          <span className="text-[10px] text-status-success font-bold uppercase tracking-widest bg-status-success/10 px-2 py-0.5 border border-status-success/10">
            Active
          </span>
        </div>
      </div>

      <div className="bg-card border border-border-subtle p-5 rounded-xl space-y-4 shadow-sm">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-bold text-text-subtle uppercase tracking-widest">
              Sprint 3 Progress
            </span>
            <span className="text-[11px] font-black text-primary">
              {currentProgress}%
            </span>
          </div>
          <div className="w-full bg-background-elevated h-2 rounded-full overflow-hidden border border-border-subtle">
            <div
              className="bg-primary h-full transition-all duration-500 ease-out"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border-subtle space-y-2.5">
          <span className="text-[9px] font-bold text-text-subtle uppercase tracking-[0.2em] block">
            Sprint Summary
          </span>
          <p className="text-[11px] text-text leading-relaxed bg-background-elevated border border-border-subtle p-3 rounded-lg uppercase tracking-wide font-medium">
            VELOCITY STABLE AT 48 POINTS. DATABASE REFACTORING MERGED. RESOLVED
            BLOCKER ON TASK #42 (DATABASE INDEXING) FOLLOWING CODE REVIEW
            APPROVAL.
          </p>
        </div>
      </div>
    </div>
  );

  const renderWorkloadTab = () => (
    <div className="space-y-5 animate-in fade-in duration-300">
      <span className="text-[10px] font-bold text-text-subtle uppercase tracking-widest block px-1">
        Developer Workload Distribution
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
            className="bg-card border border-border-subtle p-4 rounded-xl flex items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded bg-background border border-border-subtle flex items-center justify-center text-[9px] font-bold text-text">
                {member.name.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] font-bold text-text block uppercase tracking-tight">
                  {member.name}
                </span>
                <span className="text-[8px] text-text-subtle uppercase font-semibold">
                  {member.role}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 w-1/2">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[8px] font-bold text-text-subtle uppercase">
                  <span>Capacity</span>
                  <span>{member.tasks} Tasks</span>
                </div>
                <div className="w-full bg-background-elevated h-1.5 rounded-full overflow-hidden">
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
    <div className="min-h-screen bg-background text-text font-sans selection:bg-text selection:text-background antialiased overflow-x-hidden nexa-grid">
      <Navbar />

      <header className="relative min-h-[60vh] md:min-h-[80vh] flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <div className="max-w-[1440px] w-full flex flex-col items-center justify-center">
          <h1 className="text-[9vw] sm:text-[7vw] md:text-[5vw] lg:text-[5.5vw] font-bold leading-[0.95] tracking-[-0.05em] uppercase mb-8 max-w-[20ch] mx-auto">
            NexaSetu Connect GitHub repositories and turn commits into sprint
            updates
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 font-normal tracking-tight leading-relaxed">
            Link repositories in two clicks. NexaSetu listens to webhook events
            to automatically update task boards, map commits to open issues, and
            generate sprint summaries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
            <Link
              to="/register"
              className="w-full sm:w-auto px-10 md:px-12 py-5 bg-text text-background text-[10px] font-bold uppercase tracking-[0.4em] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all flex items-center justify-center gap-4"
            >
              Connect GitHub <Icons.ArrowRight />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-10 md:px-12 py-5 border border-border-subtle text-text text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-text hover:text-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Platform Preview Section */}
      <section className="max-w-[1440px] mx-auto px-6 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Interactive Dashboard Preview */}
          <div className="lg:col-span-8 bg-background border border-border-subtle rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl">
            {/* Header / Tabs */}
            <div className="px-6 py-4 bg-background-elevated border-b border-border-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-status-error" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-warning" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-success" />
                <span className="text-[9px] font-black text-text-subtle uppercase tracking-widest ml-3">
                  Workspace Telemetry
                </span>
              </div>
              <div className="flex bg-background border border-border-subtle p-0.5 rounded-lg w-full sm:w-auto">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'sprints', label: 'Sprints' },
                  { id: 'workload', label: 'Workload' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex-1 sm:flex-none px-3.5 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all rounded-md cursor-pointer ${
                      activeTab === t.id
                        ? 'bg-text text-background'
                        : 'text-text-subtle hover:text-text'
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
          <div className="lg:col-span-4 bg-background-dark border border-border-subtle rounded-2xl p-6 flex flex-col justify-between shadow-2xl font-mono">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-4">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  Active Sync Stream
                </span>
                <span className="text-[8px] text-text-subtle uppercase font-black">
                  Real-time
                </span>
              </div>
              <div className="space-y-4 text-[9px] leading-relaxed break-all">
                {logs.map((log, idx) => {
                  let colorClass = 'text-text-subtle';
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
            <div className="border-t border-border-subtle pt-4 mt-6 flex justify-between items-center text-[8px] text-text-subtle font-black uppercase tracking-widest">
              <span>Websocket Connected</span>
              <span className="animate-pulse text-status-success">Online</span>
            </div>
          </div>
        </div>
      </section>

      {/* "How It Works" Section */}
      <section className="max-w-[1440px] mx-auto px-6 pb-20 md:pb-28 border-t border-border-subtle pt-20 md:pt-28">
        <div className="mb-16 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-text-subtle">
            Git Integration
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mt-4">
            From commit webhook to task status update
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 bg-border-subtle gap-[1px] border border-border-subtle rounded-xl overflow-hidden shadow-sm">
          <div className="bg-card p-8 sm:p-12 flex flex-col justify-between min-h-[260px] group hover:bg-background-elevated transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-3xl font-black text-text/10 group-hover:text-primary transition-all">
                01
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-primary">
                CONNECT
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold uppercase tracking-tight mb-3">
                Connect GitHub
              </h3>
              <p className="text-text-muted text-xs font-normal leading-relaxed">
                Link your repositories in two clicks. NexaSetu registers
                webhooks to sync codebase activity automatically.
              </p>
            </div>
          </div>

          <div className="bg-card p-8 sm:p-12 flex flex-col justify-between min-h-[260px] group hover:bg-background-elevated transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-3xl font-black text-text/10 group-hover:text-secondary transition-all">
                02
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
                TRACK
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold uppercase tracking-tight mb-3">
                Track Development
              </h3>
              <p className="text-text-muted text-xs font-normal leading-relaxed">
                Write code and push commits. NexaSetu reads commit details and
                pull request events to link them to open issues.
              </p>
            </div>
          </div>

          <div className="bg-card p-8 sm:p-12 flex flex-col justify-between min-h-[260px] group hover:bg-background-elevated transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-3xl font-black text-text/10 group-hover:text-status-success transition-all">
                03
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-status-success">
                REPORT
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold uppercase tracking-tight mb-3">
                Generate Sprint Reports
              </h3>
              <p className="text-text-muted text-xs font-normal leading-relaxed">
                Compile commit lists, pull request cycles, and velocity trends
                into sprint summaries without manual status logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUST BANNER MARQUEE --- */}
      <div className="w-full border-y border-border-subtle py-12 bg-background-dark overflow-hidden relative">
        <div className="flex whitespace-nowrap gap-24 items-center animate-marquee">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-24 text-[11px] font-black uppercase tracking-[0.6em] text-text-subtle/30"
            >
              <span>SSO & Role Control</span>
              <span className="w-1.5 h-1.5 bg-text-subtle/30 rotate-45" />
              <span>Zero Code Storage</span>
              <span className="w-1.5 h-1.5 bg-text-subtle/30 rotate-45" />
              <span>Predictive Sprint Health</span>
              <span className="w-1.5 h-1.5 bg-text-subtle/30 rotate-45" />
              <span>Real-time Webhook Sync</span>
              <span className="w-1.5 h-1.5 bg-text-subtle/30 rotate-45" />
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
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-text-subtle">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mt-4">
            Ship code, not status updates
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 bg-border-subtle gap-[1px] border border-border-subtle overflow-hidden rounded-xl shadow-sm">
          {/* Feature 1: Access Control */}
          <div className="md:col-span-4 bg-card p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[300px]">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 border border-border-subtle rounded-lg group-hover:border-primary/30 group-hover:text-primary transition-colors text-text-subtle">
                  <Icons.Shield />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-subtle">
                  Governance
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-text">
                  Role-Based Visibility
                </h3>
                <p className="text-text-muted text-xs font-normal leading-relaxed">
                  Control team visibility and read/write repository access with
                  role-based workspace permissions.
                </p>
              </div>
            </div>
            {renderAccessControlMock()}
          </div>

          {/* Feature 2: Codebase Sync */}
          <div className="md:col-span-8 bg-card p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[300px] border-t md:border-t-0 md:border-l border-border-subtle">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 border border-border-subtle rounded-lg group-hover:border-primary/30 group-hover:text-primary transition-colors text-text-subtle">
                  <Icons.Refresh />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-subtle">
                  Integrations
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-text">
                  Native Repository Sync
                </h3>
                <p className="text-text-muted text-xs font-normal leading-relaxed max-w-md">
                  Sync repositories in real time. Track pull request statuses,
                  commits, and deployment events as they occur.
                </p>
              </div>
            </div>
            {renderCodebaseSyncMock()}
          </div>

          {/* Feature 3: Health Metrics */}
          <div className="md:col-span-8 bg-card p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[300px] border-t border-border-subtle">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 border border-border-subtle rounded-lg group-hover:border-primary/30 group-hover:text-primary transition-colors text-text-subtle">
                  <Icons.Activity />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-subtle">
                  Analytics
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-text">
                  Sprint Velocity Tracking
                </h3>
                <p className="text-text-muted text-xs font-normal leading-relaxed max-w-md">
                  Analyze commit velocity and cycle times to identify blockers
                  and forecast sprint completion dates.
                </p>
              </div>
            </div>
            {renderHealthMetricsMock()}
          </div>

          {/* Feature 4: Command Bar */}
          <div className="md:col-span-4 bg-card p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[300px] border-t md:border-t-0 md:border-l border-border-subtle md:border-t border-border-subtle">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 border border-border-subtle rounded-lg group-hover:border-primary/30 group-hover:text-primary transition-colors text-text-subtle">
                  <Icons.Terminal />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-subtle">
                  Control
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-text">
                  Command Bar Interface
                </h3>
                <p className="text-text-muted text-xs font-normal leading-relaxed">
                  Manage tasks, assign issues, and compile reports directly from
                  a keyboard-friendly command interface.
                </p>
              </div>
            </div>
            {renderCommandBarMock()}
          </div>

          {/* Feature 5: Environments */}
          <div className="md:col-span-6 bg-card p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[300px] border-t border-border-subtle">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 border border-border-subtle rounded-lg group-hover:border-primary/30 group-hover:text-primary transition-colors text-text-subtle">
                  <Icons.Layers />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-subtle">
                  Workspaces
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-text">
                  Multi-Project Workspaces
                </h3>
                <p className="text-text-muted text-xs font-normal leading-relaxed">
                  Separate client work, internal products, and open-source
                  repositories without switching user accounts.
                </p>
              </div>
            </div>
            {renderEnvironmentsMock()}
          </div>

          {/* Feature 6: Optimization */}
          <div className="md:col-span-6 bg-card p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[300px] border-t md:border-t-1 md:border-l border-border-subtle">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 border border-border-subtle rounded-lg group-hover:border-primary/30 group-hover:text-primary transition-colors text-text-subtle">
                  <Icons.PieChart />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-subtle">
                  Capacity
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-text">
                  Capacity Balancer
                </h3>
                <p className="text-text-muted text-xs font-normal leading-relaxed">
                  Monitor developer capacity from commit frequency to prevent
                  burnout and reassign tasks in one click.
                </p>
              </div>
            </div>
            {renderOptimizationMock()}
          </div>
        </div>
      </section>

      {/* --- WHY TEAMS CHOOSE NEXASETU (COMPARISON SECTION) --- */}
      <section className="max-w-[1440px] mx-auto px-6 py-20 md:py-28 border-t border-border-subtle">
        <div className="mb-16 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-text-subtle">
            Why NexaSetu
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mt-4">
            Why Teams Choose NexaSetu
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border-subtle text-left text-xs font-mono">
            <thead>
              <tr className="bg-background-elevated border-b border-border-subtle">
                <th className="p-4 uppercase tracking-widest text-text-subtle font-bold">
                  Feature
                </th>
                <th className="p-4 uppercase tracking-widest text-primary font-black">
                  NexaSetu
                </th>
                <th className="p-4 uppercase tracking-widest text-text-muted font-bold">
                  Jira
                </th>
                <th className="p-4 uppercase tracking-widest text-text-muted font-bold">
                  Trello
                </th>
                <th className="p-4 uppercase tracking-widest text-text-muted font-bold">
                  ClickUp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-background-dark/20">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-bold text-text uppercase tracking-wider">
                  Native GitHub Integration
                </td>
                <td className="p-4 text-status-success font-bold uppercase">
                  Native webhook integration (2-way sync)
                </td>
                <td className="p-4 text-text-muted uppercase">
                  Requires installing marketplace integrations
                </td>
                <td className="p-4 text-text-muted uppercase">
                  Manual link attachment per card
                </td>
                <td className="p-4 text-text-muted uppercase">
                  Requires third-party sync integrations
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-bold text-text uppercase tracking-wider">
                  Sprint Summarization
                </td>
                <td className="p-4 text-status-success font-bold uppercase">
                  Generated from commit diffs & PR descriptions
                </td>
                <td className="p-4 text-text-muted uppercase">
                  Manual report generation and configuration
                </td>
                <td className="p-4 text-text-muted uppercase">Not available</td>
                <td className="p-4 text-text-muted uppercase">
                  AI summaries written from manual inputs
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-bold text-text uppercase tracking-wider">
                  Real-Time Collaboration
                </td>
                <td className="p-4 text-status-success font-bold uppercase">
                  Instantly syncs updates using WebSockets
                </td>
                <td className="p-4 text-text-muted uppercase">
                  Requires page reload or delayed sync
                </td>
                <td className="p-4 text-text-muted uppercase">
                  Requires manual board refresh
                </td>
                <td className="p-4 text-text-muted uppercase">
                  Standard socket-based updates
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-bold text-text uppercase tracking-wider">
                  Automated Workflows
                </td>
                <td className="p-4 text-status-success font-bold uppercase">
                  Code merges trigger status updates natively
                </td>
                <td className="p-4 text-text-muted uppercase">
                  Requires complex workflow editor setups
                </td>
                <td className="p-4 text-text-muted uppercase">
                  Requires setting up manual automation rules
                </td>
                <td className="p-4 text-text-muted uppercase">
                  Requires configuring custom automation steps
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-bold text-text uppercase tracking-wider">
                  Developer Friction
                </td>
                <td className="p-4 text-status-success font-bold uppercase">
                  Zero administrative work; runs in background
                </td>
                <td className="p-4 text-text-muted uppercase">
                  Requires manual ticket keys in commit messages
                </td>
                <td className="p-4 text-text-muted uppercase">
                  Requires manual card movement and updates
                </td>
                <td className="p-4 text-text-muted uppercase">
                  Requires manual status changes in complex UI
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* --- BUILT FOR EVERY ROLE SECTION (TABBED PREVIEW) --- */}
      <section
        id="verticals"
        className="max-w-[1440px] mx-auto px-6 py-20 md:py-28 border-t border-border-subtle"
      >
        <div className="mb-16 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-text-subtle">
            Roles
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mt-4">
            Tailored for your entire engineering stack
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Role Selection Tabs */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2.5 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
            {[
              {
                id: 'executive',
                label: 'CTOs & VPs',
                desc: 'Portfolio Metrics',
              },
              {
                id: 'delivery',
                label: 'Product Managers',
                desc: 'Sprint Delivery',
              },
              {
                id: 'engineering',
                label: 'Developers',
                desc: 'Zero Admin Work',
              },
              {
                id: 'devops',
                label: 'Platform Leads',
                desc: 'Workspace Security',
              },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`w-full text-left p-5 rounded-xl border transition-all flex flex-col justify-center min-w-[200px] lg:min-w-0 cursor-pointer ${
                  activeRole === role.id
                    ? 'bg-text border-text text-background'
                    : 'bg-card border-border-subtle text-text hover:bg-background-elevated'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block mb-1">
                  {role.label}
                </span>
                <span
                  className={`text-[8px] uppercase tracking-widest ${
                    activeRole === role.id
                      ? 'text-background/80'
                      : 'text-text-subtle'
                  }`}
                >
                  {role.desc}
                </span>
              </button>
            ))}
          </div>

          {/* Right: Role Details and Preview Box */}
          <div className="lg:col-span-8 bg-background border border-border-subtle rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-center justify-between shadow-2xl">
            <div className="flex-1 space-y-6 text-left">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
                  {activeRole === 'executive' && 'CTOs & VPs'}
                  {activeRole === 'delivery' && 'Product Managers'}
                  {activeRole === 'engineering' && 'Developers'}
                  {activeRole === 'devops' && 'Platform Leads'}
                </span>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-text mt-1">
                  {activeRole === 'executive' &&
                    'Real-time repository roadmap sync'}
                  {activeRole === 'delivery' &&
                    'Sprint status tracking from git events'}
                  {activeRole === 'engineering' &&
                    'Zero manual task board updates'}
                  {activeRole === 'devops' &&
                    'Compliance auditing and role visibility'}
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-[8px] font-bold text-text-subtle uppercase tracking-widest block mb-1">
                    The Challenge
                  </span>
                  <p className="text-text-muted text-xs leading-relaxed font-normal">
                    {activeRole === 'executive' &&
                      'Engineering leaders lack direct visibility into active code changes, requiring status meetings to confirm roadmap progress.'}
                    {activeRole === 'delivery' &&
                      'Product managers spend hours requesting status updates, only to discover blocker patterns late in the sprint.'}
                    {activeRole === 'engineering' &&
                      'Developers lose focus updating task cards, writing daily reports, and context switching out of the IDE.'}
                    {activeRole === 'devops' &&
                      'Security administrators need compliance logs and access management that aligns with repository permission structures.'}
                  </p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-text-subtle uppercase tracking-widest block mb-1">
                    The NexaSetu Solution
                  </span>
                  <p className="text-text text-xs leading-relaxed font-normal">
                    {activeRole === 'executive' &&
                      'NexaSetu reads commit webhooks to compile roadmap progress dashboards directly from repository branches.'}
                    {activeRole === 'delivery' &&
                      'NexaSetu tracks branch merges and flags open pull requests to alert you about delayed deliverables.'}
                    {activeRole === 'engineering' &&
                      'Work in the terminal. Pushing commits and merging pull requests updates task boards and maps issues automatically.'}
                    {activeRole === 'devops' &&
                      'Audit workspace events, enforce role permissions, and sync repository access controls automatically.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-border-subtle flex gap-8">
                <div>
                  <span className="text-[8px] font-bold text-text-subtle uppercase tracking-widest block mb-1">
                    Outcome Metric
                  </span>
                  <span className="text-sm font-bold text-status-success uppercase tracking-wide">
                    {activeRole === 'executive' && '92% fewer status meetings'}
                    {activeRole === 'delivery' && '3.4x faster cycle time'}
                    {activeRole === 'engineering' &&
                      '100% automated progress tracking'}
                    {activeRole === 'devops' &&
                      'Zero-touch compliance auditing'}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated mini screen representing the Role View */}
            <div className="w-full md:w-[280px] shrink-0">
              {activeRole === 'executive' && (
                <div className="bg-card border border-border-subtle rounded-xl p-5 space-y-4 font-mono text-[9px] w-full animate-fade-in">
                  <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                    <span className="font-bold text-text-muted">
                      ROADMAP TRACKING
                    </span>
                    <span className="text-primary">Q2 RELEASES</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-full border-4 border-primary border-r-transparent flex items-center justify-center font-bold text-xs text-text shrink-0">
                      82%
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex justify-between">
                        <span className="truncate mr-2">Active Repos</span>
                        <span className="font-bold text-text">3/3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="truncate mr-2">Resource Load</span>
                        <span className="font-bold text-status-success">
                          On Track
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="truncate mr-2">Delivery Rate</span>
                        <span className="font-bold text-text">48 pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeRole === 'delivery' && (
                <div className="bg-card border border-border-subtle rounded-xl p-5 space-y-4 font-mono text-[9px] w-full animate-fade-in">
                  <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                    <span className="font-bold text-text-muted">
                      SPRINT HEALTH
                    </span>
                    <span className="text-secondary">SPRINT 3 ACTIVE</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[8px] border border-border-subtle p-1.5 rounded bg-background-elevated">
                      <span className="truncate mr-2">
                        Task #42: DB Optimization
                      </span>
                      <span className="px-1.5 py-0.5 bg-status-error/10 border border-status-error/20 text-status-error font-bold rounded shrink-0">
                        BLOCKED
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[8px] border border-border-subtle p-1.5 rounded bg-background-elevated">
                      <span className="truncate mr-2">
                        Task #44: OAuth Flow
                      </span>
                      <span className="px-1.5 py-0.5 bg-status-success/10 border border-status-success/20 text-status-success font-bold rounded shrink-0">
                        IN REVIEW
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {activeRole === 'engineering' && (
                <div className="bg-card border border-border-subtle rounded-xl p-5 space-y-4 font-mono text-[9px] w-full animate-fade-in">
                  <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                    <span className="font-bold text-text-muted">
                      DEV WORKSPACE
                    </span>
                    <span className="text-status-success">SYNCED</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-background-elevated border border-border-subtle p-2.5 rounded">
                      <div className="flex justify-between font-bold">
                        <span className="truncate mr-2">
                          Task #31: SSO Redirect
                        </span>
                        <span className="text-primary shrink-0">
                          In Progress
                        </span>
                      </div>
                      <p className="text-[7.5px] text-text-subtle mt-1.5">
                        Last commit: &apos;fix: cookie redirect&apos; 10m ago
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {activeRole === 'devops' && (
                <div className="bg-card border border-border-subtle rounded-xl p-5 space-y-4 font-mono text-[9px] w-full animate-fade-in">
                  <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                    <span className="font-bold text-text-muted">
                      COMPLIANCE GATEWAY
                    </span>
                    <span className="text-status-warning">SECURED</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="truncate mr-2">SAML SSO</span>
                      <span className="text-status-success font-bold shrink-0">
                        ACTIVE
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="truncate mr-2">Webhook Audits</span>
                      <span className="text-status-success font-bold shrink-0">
                        SYNCED
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="truncate mr-2">Session Limits</span>
                      <span className="text-text-muted shrink-0">30d</span>
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
        className="max-w-[1440px] mx-auto px-6 py-12 md:py-16 border-t border-border-subtle"
      >
        <div className="mb-8 text-center space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-text-subtle">
            Pricing Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mt-2">
            Flexible plans for teams of all sizes
          </h2>

          {/* Billing Cycle & Currency Toggles */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-2">
            {/* Billing Cycle Toggle */}
            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                  billingCycle === 'monthly' ? 'text-text' : 'text-text-subtle'
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
                    : 'bg-background-elevated border-border-subtle'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                    billingCycle === 'annual'
                      ? 'translate-x-4 bg-status-success'
                      : 'translate-x-0 bg-text'
                  }`}
                >
                  <div
                    className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                      billingCycle === 'annual' ? 'bg-text' : 'bg-background/30'
                    }`}
                  />
                </div>
              </button>
              <span
                className={`text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5 ${
                  billingCycle === 'annual' ? 'text-text' : 'text-text-subtle'
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
                  currency === 'inr' ? 'text-text' : 'text-text-subtle'
                }`}
              >
                INR (₹)
              </span>
              <button
                onClick={() => setCurrency(currency === 'inr' ? 'usd' : 'inr')}
                className={`w-9 h-5 border rounded-full p-0.5 relative transition-all duration-300 cursor-pointer ${
                  currency === 'usd'
                    ? 'bg-primary/20 border-primary/30'
                    : 'bg-background-elevated border-border-subtle'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                    currency === 'usd'
                      ? 'translate-x-4 bg-primary'
                      : 'translate-x-0 bg-text'
                  }`}
                >
                  <div
                    className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                      currency === 'usd' ? 'bg-text' : 'bg-background/30'
                    }`}
                  />
                </div>
              </button>
              <span
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                  currency === 'usd' ? 'text-text' : 'text-text-subtle'
                }`}
              >
                USD ($)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 bg-border-subtle gap-[1px] border border-border-subtle rounded-xl shadow-2xl overflow-hidden">
          {[
            {
              plan: 'FREE',
              price: currency === 'inr' ? '₹0' : '$0',
              desc: 'For solo developers and small open-source projects.',
              features: [
                'Unlimited repositories',
                'Up to 3 workspace members',
                '100 webhook runs / mo',
                'Basic sprint reports',
                'Native GitHub webhook sync',
              ],
              cta: 'CONNECT GITHUB',
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
              desc: 'For fast-moving startup teams automating their sprints.',
              features: [
                'Unlimited repositories',
                'Up to 15 workspace members',
                '10,000 webhook runs / mo',
                'Detailed sprint summaries',
                'Sprint velocity tracking',
                'Automated capacity balancing',
              ],
              cta: 'CREATE YOUR WORKSPACE',
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
              desc: 'For organizations requiring advanced compliance and support.',
              features: [
                'Unlimited repositories',
                'Unlimited workspace members',
                'Unlimited webhook runs',
                'Custom webhook integrations',
                'SAML SSO & compliance logs',
                'Priority SLA support',
              ],
              cta: 'CONNECT GITHUB',
            },
          ].map((p, i) => (
            <div
              key={i}
              className={`bg-card p-6 sm:p-8 flex flex-col text-left justify-between ${
                p.recommended
                  ? 'relative bg-card border border-primary/20 shadow-md z-10'
                  : ''
              } ${
                i === 0 ? 'rounded-t-xl md:rounded-l-xl md:rounded-tr-none' : ''
              } ${
                i === 2 ? 'rounded-b-xl md:rounded-r-xl md:rounded-bl-none' : ''
              }`}
            >
              {p.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-text text-background text-[9px] font-black uppercase tracking-widest rounded-sm border border-text">
                  Most Recommended
                </div>
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-subtle mb-2 block">
                  {p.plan}
                </span>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black tracking-tighter text-text">
                    {p.price}
                  </span>
                  <span className="text-[10px] font-bold text-text-subtle uppercase">
                    / MO
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold block mb-4 ${
                    billingCycle === 'annual' && p.plan !== 'FREE'
                      ? 'text-status-success'
                      : 'text-text-subtle'
                  }`}
                >
                  {p.plan === 'FREE'
                    ? 'Free forever'
                    : billingCycle === 'monthly'
                      ? 'Billed monthly'
                      : `Billed annually: ${currency === 'inr' ? '₹' : '$'}${((p.priceAnnualNum || 0) * 12).toLocaleString()}/yr`}
                </span>
                <p className="text-text-muted text-[10px] font-normal leading-relaxed mb-6 min-h-[2.5rem]">
                  {p.desc}
                </p>

                <Link
                  to="/register"
                  className={`w-full py-3 text-[10px] font-bold uppercase tracking-widest transition-all text-center mb-6 rounded cursor-pointer block ${
                    p.recommended
                      ? 'bg-text text-background hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                      : 'border border-border-subtle text-text hover:bg-text hover:text-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                  }`}
                >
                  {p.cta}
                </Link>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-border-subtle">
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
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="max-w-[1440px] mx-auto px-6 py-20 md:py-28 border-t border-border-subtle text-center">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-6 text-text">
          Ready to Automate Your Sprint Tracking?
        </h2>
        <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          Connect your GitHub repository and let NexaSetu update your task
          boards from commit logs. Setup takes less than 2 minutes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            to="/register"
            className="w-full sm:w-auto px-10 md:px-12 py-5 bg-text text-background text-[10px] font-bold uppercase tracking-[0.4em] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all flex items-center justify-center gap-4 animate-bounce-subtle"
          >
            Connect GitHub
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto px-10 md:px-12 py-5 border border-border-subtle text-text text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-text hover:text-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
          >
            Create Workspace
          </Link>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section className="max-w-[1440px] mx-auto px-6 py-20 md:py-28 border-t border-border-subtle">
        <div className="mb-16 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-text-subtle">
            About NexaSetu
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mt-4">
            Unified Git-to-Sprint Orchestration
          </h2>
        </div>
        <div className="max-w-4xl mx-auto space-y-6 text-text-muted text-xs sm:text-sm font-normal leading-relaxed text-center">
          <p>
            NexaSetu synchronizes project management boards directly with
            codebase commits, pull requests, and merges to eliminate
            administrative status reporting.
          </p>
          <ul className="inline-block text-left space-y-2 max-w-md mx-auto">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-text-muted">
                Zero-retention model: We never store your repository source
                code.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-border-subtle py-16 md:py-24 px-6 bg-background-dark/40">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-16 md:gap-24">
          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 text-text">
              NexaSetu
            </h2>
            <p className="text-text-subtle text-[10px] md:text-xs font-normal leading-relaxed tracking-wider uppercase">
              Automating sprint tracking directly from GitHub commits.
              Zero-admin project management.
            </p>
          </div>
          <div className="flex flex-col gap-8 text-left md:text-right w-full md:w-auto">
            <div className="flex flex-wrap gap-8 md:gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-text-subtle justify-start md:justify-end">
              <a
                href="https://github.com/yashshinde8585"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Yash Shinde on GitHub"
                className="hover:text-text transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/yashshinde8585"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Yash Shinde on LinkedIn"
                className="hover:text-text transition-colors"
              >
                LinkedIn
              </a>
            </div>
            <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-text-subtle not-italic">
              © 2026 NEXASETU INC. ALL RIGHTS RESERVED.
            </div>
            <div className="text-[8px] font-medium uppercase tracking-[0.2em] text-text-subtle not-italic mt-2">
              NexaSetu Systems • Pune, Maharashtra, IN • Tel: +91-9325741775
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default memo(Home);
