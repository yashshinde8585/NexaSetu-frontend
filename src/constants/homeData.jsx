import React from 'react';
import { Shield, Users, Code2, Bug } from 'lucide-react';

export const ROLE_SIM_DATA = {
  leadership: {
    id: 'leadership',
    title: "Organization Intelligence",
    icon: <Shield size={20} />,
    color: "primary",
    metrics: [
      { label: 'Portfolio Velocity', value: '94.2%', trend: '+2.1%' },
      { label: 'Technical Debt', value: 'Low', trend: 'Stable' },
      { label: 'Risk Index', value: '0.12', trend: '-0.04' }
    ],
    intelligence: [
      "Strategic alignment achieved in Team Alpha",
      "Resource optimization suggested for Q3 scaling",
      "Organizational velocity increased by 12% MoM"
    ],
    viewLabel: "Global Strategic View"
  },
  management: {
    id: 'management',
    title: "Delivery Command",
    icon: <Users size={20} />,
    color: "secondary",
    metrics: [
      { label: 'Team Capacity', value: '82%', trend: 'Optimum' },
      { label: 'Sprints On-Track', value: '18/20', trend: 'Healthy' },
      { label: 'Delivery Friction', value: 'None', trend: 'Cleared' }
    ],
    intelligence: [
      "Sprint burnout predicted to finish 2 days early",
      "Potential bottleneck in QA environment detected",
      "Load balancing recommendation: Move 2 tasks to Beta"
    ],
    viewLabel: "Delivery Management Hub"
  },
  engineering: {
    id: 'engineering',
    title: "Technical Excellence",
    icon: <Code2 size={20} />,
    color: "primary-light",
    metrics: [
      { label: 'System Uptime', value: '99.99%', trend: 'Peak' },
      { label: 'Build Latency', value: '45s', trend: '-5s' },
      { label: 'Unit Coverage', value: '92%', trend: '+4%' }
    ],
    intelligence: [
      "Microservice C: High latency detected in auth-flow",
      "Automatic deployment gate: All tests passed",
      "Refactoring suggestion: Duplicate logic in Utils.js"
    ],
    viewLabel: "Infrastructure & Code Health"
  },
  quality: {
    id: 'quality',
    title: "Quality Assurance Hub",
    icon: <Bug size={20} />,
    color: "status-error",
    metrics: [
      { label: 'Defect Density', value: '0.04', trend: 'Low' },
      { label: 'Regression Pass', value: '100%', trend: 'Verified' },
      { label: 'Release Gate', value: 'READY', trend: 'Stable' }
    ],
    intelligence: [
      "Regression suite completed: 1,240 tests passed",
      "Critical path verification: No blockers found",
      "Security scan: Zero vulnerabilities detected"
    ],
    viewLabel: "Mission Readiness Console"
  }
};
