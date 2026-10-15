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
      text: 'Alex Miller moved NX-104 (OAuth2 Flow) to In Review',
      type: 'task',
      val: 68,
    },
    {
      text: 'GitHub PR #114 merged: linked to ticket NX-104',
      type: 'pr',
    },
    {
      text: 'Sprint 3 progress updated to 68% (28/42 tasks completed)',
      type: 'progress',
      val: 68,
    },
    {
      text: 'Sarah Chen completed ticket NX-42: "DB Indexing & Query Tuning"',
      type: 'completed',
      val: 71,
    },
    {
      text: 'Blocker alert resolved on NX-42 following code review approval',
      type: 'blocker',
    },
    {
      text: 'Sprint 3 progress updated to 74% (+6%)',
      type: 'progress',
      val: 74,
    },
    {
      text: 'John Davis moved NX-12 (Cookie Redirect) to In Progress',
      type: 'task',
      val: 74,
    },
    {
      text: 'GitHub PR #118 opened: "fix: cookie redirect" linked to NX-12',
      type: 'pr',
    },
    {
      text: 'Sprint 3 progress updated to 80% (34/42 tasks completed)',
      type: 'progress',
      val: 80,
    },
    {
      text: 'Sprint 3 summary compiled: 34 tasks completed, 1 blocker cleared',
      type: 'sprint',
    },
  ];

  const [logs, setLogs] = useState([
    {
      text: 'Sprint 3 initialized: 42 tasks planned across 3 repositories',
      type: 'sprint',
    },
    {
      text: 'Sarah Chen completed ticket NX-38: "API Authentication Middleware"',
      type: 'completed',
    },
    {
      text: 'GitHub PR #112 merged: linked to ticket NX-38',
      type: 'pr',
    },
    {
      text: 'Sprint 3 progress updated to 65% (27/42 tasks completed)',
      type: 'progress',
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
                  ? 'bg-primary text-white'
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
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-card border border-border-subtle text-text text-[7px] font-black px-1.5 py-0.5 rounded shadow-md">
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
              className="w-full text-center py-1.5 bg-primary text-white font-black uppercase text-[8px] tracking-wider rounded hover:bg-primary-dark transition-colors cursor-pointer"
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
              className="w-full text-center py-1.5 border border-border-subtle bg-card text-text font-black uppercase text-[8px] tracking-wider rounded hover:bg-background-elevated transition-colors cursor-pointer"
            >
              Reset View
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderOverviewTab = () => {
    const completedTasks = Math.round(42 * (currentProgress / 100));

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-card border border-border-subtle p-2.5 sm:p-4 rounded-xl shadow-sm text-center sm:text-left">
            <span className="text-[8px] sm:text-[9px] font-bold text-text-subtle uppercase tracking-wider sm:tracking-widest block mb-1 truncate">
              Total Tasks
            </span>
            <span className="text-lg sm:text-xl font-black text-text">42</span>
            <span className="text-[7.5px] sm:text-[8px] text-text-subtle font-bold block mt-1 uppercase truncate">
              Sprint 3 Scope
            </span>
          </div>
          <div className="bg-card border border-border-subtle p-2.5 sm:p-4 rounded-xl shadow-sm text-center sm:text-left">
            <span className="text-[8px] sm:text-[9px] font-bold text-text-subtle uppercase tracking-wider sm:tracking-widest block mb-1 truncate">
              In Progress
            </span>
            <span className="text-lg sm:text-xl font-black text-text">14</span>
            <span className="text-[7.5px] sm:text-[8px] text-status-warning font-bold block mt-1 uppercase truncate">
              4 In Review
            </span>
          </div>
          <div className="bg-card border border-border-subtle p-2.5 sm:p-4 rounded-xl shadow-sm text-center sm:text-left">
            <span className="text-[8px] sm:text-[9px] font-bold text-text-subtle uppercase tracking-wider sm:tracking-widest block mb-1 truncate">
              Completed
            </span>
            <span className="text-lg sm:text-xl font-black text-status-success">
              {completedTasks}
            </span>
            <span className="text-[7.5px] sm:text-[8px] text-status-success font-bold block mt-1 uppercase truncate">
              {currentProgress}% On Track
            </span>
          </div>
        </div>

        <div className="bg-card border border-border-subtle p-3.5 sm:p-5 rounded-xl flex flex-col justify-between shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[9px] sm:text-[10px] font-bold text-text-subtle uppercase tracking-wider sm:tracking-widest block">
                Sprint 3 Task Completion & Burnup
              </span>
              <span className="text-[8px] sm:text-[9px] text-text-muted font-mono mt-0.5 block">
                {completedTasks} of 42 tasks finished ({currentProgress}%) • Day 10 of 14
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] sm:text-[9px] text-status-success font-bold uppercase tracking-wider bg-status-success/10 border border-status-success/20 px-2 py-0.5 rounded">
                +6% Ahead of Target
              </span>
            </div>
          </div>

          <div className="w-full h-32 sm:h-36 pt-2">
            <svg
              className="w-full h-full"
              viewBox="0 0 500 130"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="completionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-status-success)"
                    stopOpacity="0.25"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-status-success)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              <line x1="40" y1="20" x2="480" y2="20" stroke="var(--color-border-subtler)" strokeDasharray="3 3" />
              <line x1="40" y1="55" x2="480" y2="55" stroke="var(--color-border-subtler)" strokeDasharray="3 3" />
              <line x1="40" y1="90" x2="480" y2="90" stroke="var(--color-border-subtler)" strokeDasharray="3 3" />

              <text x="32" y="23" textAnchor="end" fill="var(--color-text-subtle)" fontSize="8" fontFamily="monospace">42</text>
              <text x="32" y="58" textAnchor="end" fill="var(--color-text-subtle)" fontSize="8" fontFamily="monospace">28</text>
              <text x="32" y="93" textAnchor="end" fill="var(--color-text-subtle)" fontSize="8" fontFamily="monospace">14</text>

              <line
                x1="40"
                y1="115"
                x2="480"
                y2="20"
                stroke="var(--color-text-subtle)"
                strokeOpacity="0.35"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              <path
                d="M 40 115 L 100 100 L 160 84 L 230 68 L 300 56 L 360 48 L 360 115 Z"
                fill="url(#completionGrad)"
              />

              <path
                d="M 40 115 L 100 100 L 160 84 L 230 68 L 300 56 L 360 48"
                fill="none"
                stroke="var(--color-status-success)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle cx="360" cy="48" r="4" fill="var(--color-status-success)" />
              <circle cx="360" cy="48" r="7.5" fill="var(--color-status-success)" fillOpacity="0.25" className="animate-pulse" />

              <rect x="330" y="24" width="60" height="15" rx="3" fill="var(--color-background-elevated)" stroke="var(--color-border)" />
              <text x="360" y="34.5" textAnchor="middle" fill="var(--color-text)" fontSize="7" fontWeight="bold" fontFamily="monospace">
                DAY 10: {completedTasks} DONE
              </text>

              <line x1="40" y1="115" x2="480" y2="115" stroke="var(--color-border-subtle)" />
              <text x="40" y="126" textAnchor="middle" fill="var(--color-text-subtle)" fontSize="8" fontFamily="monospace">Day 1</text>
              <text x="120" y="126" textAnchor="middle" fill="var(--color-text-subtle)" fontSize="8" fontFamily="monospace">Day 3</text>
              <text x="200" y="126" textAnchor="middle" fill="var(--color-text-subtle)" fontSize="8" fontFamily="monospace">Day 6</text>
              <text x="280" y="126" textAnchor="middle" fill="var(--color-text-subtle)" fontSize="8" fontFamily="monospace">Day 8</text>
              <text x="360" y="126" textAnchor="middle" fill="var(--color-status-success)" fontSize="8" fontWeight="bold" fontFamily="monospace">Day 10</text>
              <text x="440" y="126" textAnchor="middle" fill="var(--color-text-subtle)" fontSize="8" fontFamily="monospace">Day 12</text>
              <text x="480" y="126" textAnchor="middle" fill="var(--color-text-subtle)" fontSize="8" fontFamily="monospace">Day 14</text>
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-border-subtle pt-3 mt-3 text-[8px] font-mono text-text-subtle gap-2">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-status-success inline-block rounded" />
                Actual ({completedTasks} tasks)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 border-b border-dashed border-text-subtle inline-block" />
                Target (25 tasks)
              </span>
            </div>
            <span className="text-status-success font-bold uppercase">
              Target: 42 Tasks by Day 14
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderMyTasksTab = () => {
    const myTasks = [
      {
        key: 'NX-104',
        title: 'Implement OAuth2 token refresh & session revocation',
        type: 'Story',
        priority: 'High',
        status: 'In Review',
        assignee: 'Alex Miller',
        initials: 'AM',
        pr: '#114',
      },
      {
        key: 'NX-98',
        title: 'Migrate workspace permissions schema to RBAC',
        type: 'Task',
        priority: 'Medium',
        status: 'In Progress',
        assignee: 'Sarah Chen',
        initials: 'SC',
        pr: '#118',
      },
      {
        key: 'NX-42',
        title: 'Refactor database indexing & resolve task query blocker',
        type: 'Bug',
        priority: 'High',
        status: 'Done',
        assignee: 'Sarah Chen',
        initials: 'SC',
        pr: '#109',
      },
      {
        key: 'NX-12',
        title: 'Fix cookie redirect issue on authentication callback',
        type: 'Bug',
        priority: 'Medium',
        status: 'In Progress',
        assignee: 'John Davis',
        initials: 'JD',
        pr: '#125',
      },
      {
        key: 'NX-76',
        title: 'Add real-time websocket heartbeat for sprint boards',
        type: 'Story',
        priority: 'Low',
        status: 'Done',
        assignee: 'Alex Miller',
        initials: 'AM',
        pr: '#92',
      },
    ];

    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <div className="flex justify-between items-center px-1">
          <span className="text-[9px] sm:text-[10px] font-bold text-text-subtle uppercase tracking-wider sm:tracking-widest truncate">
            Sprint 3 Assigned Tickets ({myTasks.length})
          </span>
          <span className="text-[7.5px] sm:text-[8px] font-mono text-status-success uppercase font-bold shrink-0 ml-2">
            2 Done • 2 In Progress
          </span>
        </div>

        <div className="space-y-2">
          {myTasks.map((task) => (
            <div
              key={task.key}
              className="bg-card border border-border-subtle hover:border-border p-2.5 sm:p-3 rounded-xl flex items-center justify-between gap-2 sm:gap-3 shadow-sm transition-colors"
            >
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <span className="text-[8px] sm:text-[9px] font-mono font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 shrink-0">
                  {task.key}
                </span>
                <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-background-elevated border border-border-subtle text-text-subtle shrink-0 hidden sm:inline-block">
                  {task.type}
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-text truncate">
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                {task.pr && (
                  <span className="text-[8px] font-mono text-text-subtle border border-border-subtle px-1.5 py-0.5 rounded hidden md:inline-block">
                    PR {task.pr}
                  </span>
                )}
                <span
                  className={`text-[7.5px] sm:text-[8px] font-bold uppercase px-1.5 sm:px-2 py-0.5 rounded border ${
                    task.status === 'Done'
                      ? 'bg-status-success/10 text-status-success border-status-success/20'
                      : task.status === 'In Review'
                        ? 'bg-primary/10 text-primary-light border-primary/20'
                        : 'bg-status-warning/10 text-status-warning border-status-warning/20'
                  }`}
                >
                  {task.status}
                </span>
                <div
                  title={task.assignee}
                  className="w-5 h-5 rounded-full bg-background-elevated border border-border-subtle flex items-center justify-center text-[7px] font-bold text-text-muted"
                >
                  {task.initials}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSprintsTab = () => (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-card border border-border-subtle p-4 rounded-xl shadow-sm gap-2">
        <div>
          <span className="text-[8px] font-bold text-text-subtle uppercase tracking-[0.2em] block mb-1">
            Active Cycle
          </span>
          <span className="text-sm font-black text-text uppercase tracking-wider">
            Sprint 3 — Core Platform & Git Sync
          </span>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-[8px] font-bold text-text-subtle uppercase tracking-[0.2em] block mb-1">
            Timeline
          </span>
          <span className="text-[10px] text-status-success font-bold uppercase tracking-widest bg-status-success/10 px-2 py-0.5 rounded border border-status-success/20">
            Day 10 of 14 • 4 Days Left
          </span>
        </div>
      </div>

      <div className="bg-card border border-border-subtle p-5 rounded-xl space-y-4 shadow-sm">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-bold text-text-subtle uppercase tracking-widest">
              Sprint 3 Progress & Work Distribution
            </span>
            <span className="text-[11px] font-black text-status-success">
              {currentProgress}% Completed
            </span>
          </div>

          <div className="w-full bg-background-elevated h-2.5 rounded-full overflow-hidden border border-border-subtle flex">
            <div
              className="bg-status-success h-full transition-all duration-500 ease-out"
              style={{ width: `${currentProgress}%` }}
              title={`Done: ${Math.round(42 * (currentProgress / 100))} tasks`}
            />
            <div
              className="bg-primary h-full transition-all duration-500 ease-out"
              style={{ width: '14%' }}
              title="In Review: 6 tasks"
            />
            <div
              className="bg-status-warning h-full transition-all duration-500 ease-out"
              style={{ width: '10%' }}
              title="In Progress: 4 tasks"
            />
            <div
              className="bg-text-subtle/30 h-full"
              style={{ width: `${Math.max(0, 100 - currentProgress - 24)}%` }}
              title="To Do"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-[8px] font-mono text-text-subtle pt-2 gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-success" />
              Done: {Math.round(42 * (currentProgress / 100))}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              In Review: 6
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-warning" />
              In Progress: 4
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-text-subtle/40" />
              To Do: {Math.max(0, 42 - Math.round(42 * (currentProgress / 100)) - 10)}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-border-subtle space-y-2.5">
          <span className="text-[9px] font-bold text-text-subtle uppercase tracking-[0.2em] block">
            Sprint Goal & Summary
          </span>
          <p className="text-[11px] text-text leading-relaxed bg-background-elevated border border-border-subtle p-3 rounded-lg uppercase tracking-wide font-medium">
            DELIVER AUTOMATED PR LINKING, TASK BOARD SYNCHRONIZATION, AND
            REAL-TIME SPRINT HEALTH METRICS. VELOCITY STABLE AT 48 STORY POINTS
            WITH 1 BLOCKER RESOLVED ON TICKET NX-42.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="home-page-theme min-h-screen bg-background text-text font-sans selection:bg-primary selection:text-white antialiased overflow-x-hidden nexa-grid">
      <Navbar />

      <header className="relative min-h-[auto] sm:min-h-screen sm:min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 pt-24 sm:pt-20 pb-14 sm:pb-16 overflow-hidden">
        {/* Soft Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] md:w-[700px] h-[240px] sm:h-[320px] md:h-[380px] bg-primary/15 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none -z-10"
        />

        <div className="max-w-[1440px] w-full flex flex-col items-center justify-center relative z-10">
          {/* Pill Badge */}
          <div className="inline-flex items-center justify-center px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full bg-card/80 backdrop-blur-sm mb-6 sm:mb-7 max-w-full">
            <span className="text-[10px] sm:text-xs font-medium tracking-wider text-text-muted uppercase text-center">
              PROJECT MANAGEMENT FOR DEVELOPMENT TEAMS
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text mb-4 sm:mb-5 max-w-4xl mx-auto leading-[1.15] sm:leading-[1.12]">
            Plan Projects. Track Progress. Ship Better.
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-text-muted max-w-xl md:max-w-2xl mx-auto mb-8 sm:mb-9 font-normal leading-relaxed px-2 sm:px-0">
            Bring tasks, sprints, and team workflows together in one workspace.
            Keep projects organized, follow progress, and spend less time managing
            updates.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium text-sm sm:text-base rounded-lg shadow-sm hover:shadow-primary/25 transition-all flex items-center justify-center active:scale-[0.98]"
            >
              Explore Demo
            </Link>
            <a
              href="#matrix"
              className="w-full sm:w-auto px-6 py-3 bg-card hover:bg-background-elevated border border-border-subtle hover:border-border text-text font-medium text-sm sm:text-base rounded-lg transition-all flex items-center justify-center active:scale-[0.98]"
            >
              Explore Features
            </a>
          </div>
        </div>
      </header>

      {/* Platform Preview Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-12 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Left: Interactive Dashboard Preview */}
          <div className="lg:col-span-8 bg-card border border-border-subtle rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl">
            {/* Header / Tabs */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-background-elevated border-b border-border-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-status-error" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-warning" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-success" />
                <span className="text-[9px] font-black text-text-subtle uppercase tracking-widest ml-3">
                  Project Workspace
                </span>
              </div>
              <div className="flex bg-background border border-border-subtle p-0.5 rounded-lg w-full sm:w-auto">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'tasks', label: 'My Tasks' },
                  { id: 'sprints', label: 'Sprints' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex-1 sm:flex-none px-3.5 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all rounded-md cursor-pointer ${
                      activeTab === t.id
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard Panel View */}
            <div className="p-4 sm:p-6 md:p-8 flex-1 min-h-[300px] sm:min-h-[350px] flex flex-col justify-center">
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'tasks' && renderMyTasksTab()}
              {activeTab === 'sprints' && renderSprintsTab()}
            </div>
          </div>

          {/* Right: Recent Activity stream */}
          <div className="lg:col-span-4 bg-card border border-border-subtle rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-2xl font-mono">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-4">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-ping" />
                  Recent Activity
                </span>
                <span className="text-[8px] text-status-success font-black uppercase tracking-wider bg-status-success/10 px-1.5 py-0.5 rounded border border-status-success/20">
                  Real-time
                </span>
              </div>
              <div className="space-y-3.5 text-[9px] leading-relaxed break-words">
                {logs.map((log, idx) => {
                  let colorClass = 'text-text-subtle';
                  let badge = 'EVENT';
                  let badgeClass = 'text-text-subtle bg-background-elevated border-border-subtle';

                  if (log.type === 'completed') {
                    colorClass = 'text-status-success';
                    badge = 'DONE';
                    badgeClass = 'text-status-success bg-status-success/10 border-status-success/20';
                  } else if (log.type === 'task') {
                    colorClass = 'text-text';
                    badge = 'TASK';
                    badgeClass = 'text-primary-light bg-primary/10 border-primary/20';
                  } else if (log.type === 'pr') {
                    colorClass = 'text-primary-light';
                    badge = 'GITHUB';
                    badgeClass = 'text-primary bg-primary/10 border-primary/20';
                  } else if (log.type === 'progress') {
                    colorClass = 'text-status-success font-medium';
                    badge = 'SPRINT';
                    badgeClass = 'text-status-success bg-status-success/10 border-status-success/20';
                  } else if (log.type === 'blocker') {
                    colorClass = 'text-status-warning';
                    badge = 'ALERT';
                    badgeClass = 'text-status-warning bg-status-warning/10 border-status-warning/20';
                  } else if (log.type === 'sprint') {
                    colorClass = 'text-text';
                    badge = 'CYCLE';
                    badgeClass = 'text-text-subtle bg-background-elevated border-border-subtle';
                  }

                  return (
                    <div key={idx} className="flex items-start gap-2 animate-fade-in">
                      <span className={`text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 mt-0.5 ${badgeClass}`}>
                        {badge}
                      </span>
                      <span className={colorClass}>{log.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="border-t border-border-subtle pt-4 mt-6 flex justify-between items-center text-[8px] text-text-subtle font-black uppercase tracking-widest">
              <span>Project Activity Feed</span>
              <span className="flex items-center gap-1.5 text-status-success">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                Live Sync
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* "How It Works" Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 pb-16 md:pb-24 border-t border-border-subtle pt-16 md:pt-24">
        <div className="mb-10 sm:mb-16 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-text-subtle">
            HOW NEXASETU WORKS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight uppercase mt-3 sm:mt-4">
            FROM TASK PLANNING TO PROJECT DELIVERY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 bg-border-subtle gap-[1px] border border-border-subtle rounded-xl overflow-hidden shadow-sm">
          <div className="bg-card p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between min-h-0 sm:min-h-[260px] group hover:bg-background-elevated transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-3xl font-black text-text/10 group-hover:text-primary transition-all">
                01
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-primary">
                PLAN
              </span>
            </div>
            <div className="mt-6 sm:mt-8">
              <h3 className="text-xl font-bold uppercase tracking-tight mb-3">
                ORGANIZE YOUR WORK
              </h3>
              <p className="text-text-muted text-xs font-normal leading-relaxed">
                Create projects, break work into manageable tasks, assign
                owners, and set priorities. Give your team a clear view of what
                needs to get done.
              </p>
            </div>
          </div>

          <div className="bg-card p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between min-h-0 sm:min-h-[260px] group hover:bg-background-elevated transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-3xl font-black text-text/10 group-hover:text-secondary transition-all">
                02
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
                COLLABORATE
              </span>
            </div>
            <div className="mt-6 sm:mt-8">
              <h3 className="text-xl font-bold uppercase tracking-tight mb-3">
                KEEP WORK MOVING
              </h3>
              <p className="text-text-muted text-xs font-normal leading-relaxed">
                Track task statuses, manage sprint progress, and connect GitHub
                activity to development work. Everyone can see where things
                stand without chasing updates.
              </p>
            </div>
          </div>

          <div className="bg-card p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between min-h-0 sm:min-h-[260px] group hover:bg-background-elevated transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-3xl font-black text-text/10 group-hover:text-status-success transition-all">
                03
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-status-success">
                DELIVER
              </span>
            </div>
            <div className="mt-6 sm:mt-8">
              <h3 className="text-xl font-bold uppercase tracking-tight mb-3">
                SEE YOUR PROJECT PROGRESS
              </h3>
              <p className="text-text-muted text-xs font-normal leading-relaxed">
                Review sprint progress, follow completed work, and use project
                insights to understand how your team is moving toward its
                goals.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* --- PLATFORM FEATURES SECTION --- */}
      <section
        id="matrix"
        className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24"
      >
        <div className="mb-10 sm:mb-16 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-text-subtle">
            FEATURES
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight uppercase mt-3 sm:mt-4">
            EVERYTHING YOUR TEAM NEEDS TO KEEP WORK MOVING
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 bg-border-subtle gap-[1px] border border-border-subtle overflow-hidden rounded-xl shadow-sm">
          {/* Feature 1: Access Control */}
          <div className="md:col-span-4 bg-card p-6 sm:p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-0 sm:min-h-[300px]">
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
                  01. ROLE-BASED ACCESS
                </h3>
                <p className="text-text-muted text-xs font-normal leading-relaxed">
                  Give team members access to the projects, tasks, and actions
                  relevant to their roles. Keep permissions organized across your
                  workspace.
                </p>
              </div>
            </div>
            {renderAccessControlMock()}
          </div>

          {/* Feature 2: Codebase Sync */}
          <div className="md:col-span-8 bg-card p-6 sm:p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-0 sm:min-h-[300px]">
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
                  02. GITHUB INTEGRATION
                </h3>
                <p className="text-text-muted text-xs font-normal leading-relaxed max-w-md">
                  Connect repositories to your projects and link commits and
                  pull requests to development tasks. Keep code activity
                  connected to the work behind it.
                </p>
              </div>
            </div>
            {renderCodebaseSyncMock()}
          </div>

          {/* Feature 3: Health Metrics */}
          <div className="md:col-span-8 bg-card p-6 sm:p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-0 sm:min-h-[300px]">
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
                  03. SPRINT ANALYTICS
                </h3>
                <p className="text-text-muted text-xs font-normal leading-relaxed max-w-md">
                  Follow sprint progress, review completed work, and spot
                  potential blockers. Use development insights to understand how
                  work is progressing.
                </p>
              </div>
            </div>
            {renderHealthMetricsMock()}
          </div>

          {/* Feature 4: Command Bar */}
          <div className="md:col-span-4 bg-card p-6 sm:p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-0 sm:min-h-[300px]">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 border border-border-subtle rounded-lg group-hover:border-primary/30 group-hover:text-primary transition-colors text-text-subtle">
                  <Icons.Terminal />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-subtle">
                  Navigation
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-text">
                  04. COMMAND BAR
                </h3>
                <p className="text-text-muted text-xs font-normal leading-relaxed">
                  Find tasks, move between projects, and run common actions
                  without navigating through multiple screens. Keep everyday
                  work moving with keyboard-friendly controls.
                </p>
              </div>
            </div>
            {renderCommandBarMock()}
          </div>

          {/* Feature 5: Environments */}
          <div className="md:col-span-6 bg-card p-6 sm:p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-0 sm:min-h-[300px]">
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
                  05. MULTI-PROJECT WORKSPACES
                </h3>
                <p className="text-text-muted text-xs font-normal leading-relaxed">
                  Manage multiple projects from one workspace. Keep tasks,
                  teams, and repository connections organized without switching
                  between separate accounts.
                </p>
              </div>
            </div>
            {renderEnvironmentsMock()}
          </div>

          {/* Feature 6: Optimization */}
          <div className="md:col-span-6 bg-card p-6 sm:p-8 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-0 sm:min-h-[300px]">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 border border-border-subtle rounded-lg group-hover:border-primary/30 group-hover:text-primary transition-colors text-text-subtle">
                  <Icons.PieChart />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-subtle">
                  Workload
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-text">
                  06. TEAM WORKLOAD
                </h3>
                <p className="text-text-muted text-xs font-normal leading-relaxed">
                  Get a clearer view of task assignments and team capacity.
                  Identify uneven workloads and make informed decisions when
                  priorities change.
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
        className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24 border-t border-border-subtle"
      >
        <div className="mb-10 sm:mb-16 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-text-subtle">
            BUILT FOR YOUR TEAM
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight uppercase mt-3 sm:mt-4">
            ONE WORKSPACE. DIFFERENT WAYS TO WORK.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Left: Role Selection Tabs */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:flex lg:flex-col gap-2 sm:gap-2.5">
            {[
              {
                id: 'executive',
                label: 'CTOs & Leaders',
                desc: 'Project Visibility',
              },
              {
                id: 'delivery',
                label: 'Product Managers',
                desc: 'Sprint Planning',
              },
              {
                id: 'engineering',
                label: 'Developers',
                desc: 'Less Admin Work',
              },
              {
                id: 'devops',
                label: 'Platform Leads',
                desc: 'Access & Permissions',
              },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`w-full text-left p-3.5 sm:p-4 lg:p-5 rounded-xl border transition-all flex flex-col justify-center cursor-pointer ${
                  activeRole === role.id
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-card border-border-subtle text-text hover:bg-background-elevated'
                }`}
              >
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider block mb-1">
                  {role.label}
                </span>
                <span
                  className={`text-[8px] sm:text-[9px] uppercase tracking-widest ${
                    activeRole === role.id
                      ? 'text-white/80'
                      : 'text-text-muted'
                  }`}
                >
                  {role.desc}
                </span>
              </button>
            ))}
          </div>

          {/* Right: Role Details and Preview Box */}
          <div className="lg:col-span-8 bg-card border border-border-subtle rounded-2xl p-5 sm:p-8 lg:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch md:items-center justify-between shadow-2xl">
            <div className="flex-1 space-y-6 text-left">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
                  {activeRole === 'executive' && 'CTOs & Engineering Leaders'}
                  {activeRole === 'delivery' && 'Product Managers'}
                  {activeRole === 'engineering' && 'Developers'}
                  {activeRole === 'devops' && 'Platform Leads'}
                </span>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-text mt-1">
                  {activeRole === 'executive' &&
                    'See how development is progressing'}
                  {activeRole === 'delivery' &&
                    'Keep sprint work on track'}
                  {activeRole === 'engineering' &&
                    'Spend more time building'}
                  {activeRole === 'devops' &&
                    'Keep project access under control'}
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-[8px] font-bold text-text-subtle uppercase tracking-widest block mb-1">
                    The Challenge
                  </span>
                  <p className="text-text-muted text-xs leading-relaxed font-normal">
                    {activeRole === 'executive' &&
                      'Keeping track of multiple projects is difficult when progress updates depend on meetings and manual reports.'}
                    {activeRole === 'delivery' &&
                      'Product managers need to know which tasks are moving forward, where work is blocked, and what might miss the deadline.'}
                    {activeRole === 'engineering' &&
                      'Updating task boards and reporting progress can interrupt development and pull attention away from writing code.'}
                    {activeRole === 'devops' &&
                      'Managing access across teams and repositories becomes harder as projects grow and responsibilities change.'}
                  </p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-text-subtle uppercase tracking-widest block mb-1">
                    The NexaSetu Solution
                  </span>
                  <p className="text-text text-xs leading-relaxed font-normal">
                    {activeRole === 'executive' &&
                      'Bring project progress and GitHub activity together to give engineering leaders a clearer view of ongoing work.'}
                    {activeRole === 'delivery' &&
                      'Track task statuses, review sprint progress, and connect development activity to the work planned for each sprint.'}
                    {activeRole === 'engineering' &&
                      'Connect GitHub activity with project tasks to make development progress easier to follow without relying entirely on manual updates.'}
                    {activeRole === 'devops' &&
                      'Use workspace roles and permissions to manage who can view and work with project resources.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-border-subtle flex gap-8">
                <div>
                  <span className="text-[8px] font-bold text-text-subtle uppercase tracking-widest block mb-1">
                    Outcome
                  </span>
                  <span className="text-sm font-bold text-status-success uppercase tracking-wide">
                    {activeRole === 'executive' &&
                      'Better visibility across projects'}
                    {activeRole === 'delivery' &&
                      'Clearer sprint progress'}
                    {activeRole === 'engineering' &&
                      'Less time spent on status updates'}
                    {activeRole === 'devops' &&
                      'Clearer access management'}
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
        className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24 border-t border-border-subtle"
      >
        <div className="mb-8 sm:mb-10 text-center space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-text-subtle">
            PRICING PLANS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight uppercase mt-2">
            THE RIGHT PLAN FOR YOUR TEAM
          </h2>
          <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-normal">
            Choose a plan that fits your workflow, whether you&apos;re managing
            projects on your own or coordinating work across an engineering
            team.
          </p>

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-[1px] md:bg-border-subtle md:border md:border-border-subtle rounded-xl md:shadow-2xl mt-8 sm:mt-10">
          {[
            {
              plan: 'FREE',
              price: currency === 'inr' ? '₹0' : '$0',
              tagline: 'Free forever',
              desc: 'Get started with project management and GitHub integration at no cost.',
              features: [
                'GitHub repository integration',
                'Up to 3 workspace members',
                '100 webhook runs per month',
                'Basic sprint reports',
                'Task and status tracking',
              ],
              cta: 'Get Started Free',
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
              tagline: 'For growing development teams',
              desc: "Bring your team's projects, sprint tracking, and development activity together in one workspace.",
              features: [
                'Unlimited repositories',
                'Up to 15 workspace members',
                '10,000 webhook runs per month',
                'Detailed sprint reports',
                'Sprint progress analytics',
                'Team workload management',
              ],
              cta: 'Start with Pro',
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
              tagline: 'For larger teams managing multiple projects',
              desc: 'Manage projects across your organization with expanded access controls and integration options.',
              features: [
                'Unlimited repositories',
                'Unlimited workspace members',
                'Unlimited webhook runs',
                'Custom webhook integrations',
                'Advanced access controls',
                'Priority support',
              ],
              cta: 'Choose Enterprise',
            },
          ].map((p, i) => (
            <div
              key={i}
              className={`bg-card p-6 sm:p-8 flex flex-col text-left justify-between rounded-xl md:rounded-none ${
                p.recommended
                  ? 'relative border border-primary/40 shadow-lg shadow-primary/10 z-10'
                  : 'relative border border-border-subtle md:border-0'
              } ${
                i === 0 ? 'md:rounded-l-xl' : ''
              } ${
                i === 2 ? 'md:rounded-r-xl' : ''
              }`}
            >
              {p.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full border border-primary shadow-lg z-20 whitespace-nowrap">
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
                  <span className="text-[10px] font-bold text-text-subtle">
                    / month
                  </span>
                </div>
                <span className="text-[10px] font-bold text-text-subtle block mb-1">
                  {p.tagline}
                </span>
                {billingCycle === 'annual' && p.plan !== 'FREE' ? (
                  <span className="text-[9px] font-bold text-status-success block mb-3">
                    Billed annually: {currency === 'inr' ? '₹' : '$'}{((p.priceAnnualNum || 0) * 12).toLocaleString()}/yr
                  </span>
                ) : (
                  <div className="mb-3" />
                )}
                <p className="text-text-muted text-[10px] font-normal leading-relaxed mb-6 min-h-[2.5rem]">
                  {p.desc}
                </p>

                <Link
                  to="/register"
                  className={`w-full py-3 text-[10px] font-bold uppercase tracking-widest transition-all text-center mb-6 rounded cursor-pointer block ${
                    p.recommended
                      ? 'bg-primary text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                      : 'border border-border-subtle text-text hover:bg-background-elevated focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
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
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24 border-t border-border-subtle text-center">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight uppercase mb-4 text-text">
          READY TO BRING YOUR PROJECTS TOGETHER?
        </h2>
        <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto mb-8 leading-relaxed font-normal">
          Manage tasks, keep sprints on track, and bring your team&apos;s development workflow into one place with NexaSetu.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all flex items-center justify-center shadow-md shadow-primary/25"
          >
            GET STARTED
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 border border-border-subtle bg-card text-text text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-background-elevated focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all flex items-center justify-center"
          >
            EXPLORE DEMO
          </Link>
        </div>
      </section>


      {/* --- FOOTER --- */}
      <footer className="border-t border-border-subtle py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-background">
        <div className="max-w-[1440px] mx-auto">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-8 md:gap-12 pb-8 border-b border-border-subtle">
            <div className="max-w-md">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight uppercase mb-3 text-text">
                NexaSetu
              </h2>
              <p className="text-text-muted text-xs sm:text-sm font-normal leading-relaxed">
                Project management for development teams. Organize tasks, track
                sprints, and keep your team&apos;s work moving.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-left md:text-right w-full md:w-auto">
              <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wider text-text-muted justify-start md:justify-end">
                <a
                  href="https://github.com/yashshinde8585"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Yash Shinde on GitHub"
                  className="hover:text-text transition-colors flex items-center gap-1"
                >
                  GITHUB ↗
                </a>
                <a
                  href="https://linkedin.com/in/yashshinde8585"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Yash Shinde on LinkedIn"
                  className="hover:text-text transition-colors flex items-center gap-1"
                >
                  LINKEDIN ↗
                </a>
              </div>
              <div className="text-xs text-text-subtle">
                &copy; 2026 NexaSetu. All rights reserved.
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 text-xs text-text-subtle">
            <span>Built for teams that build software.</span>
            <span>Pune, Maharashtra, India</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default memo(Home);
