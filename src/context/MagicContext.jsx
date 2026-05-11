import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const MagicStateContext = createContext();
const MagicActionsContext = createContext();

// Sustains global state for the AI-driven command system and strategic results.
export const MagicProvider = ({ children }) => {
  const [magicResult, setMagicResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [pendingCommand, setPendingCommand] = useState(null);
  const [activeProjects, setActiveProjects] = useState([]);
  const [dashboardContext, setDashboardContext] = useState(null);

  const setGlobalResult = useCallback((result) => {
    setMagicResult(result);
    setShowResults(!!result);
  }, []);

  const closeGlobalResults = useCallback(() => {
    setMagicResult(null);
    setShowResults(false);
  }, []);

  const triggerCommand = useCallback((command) => {
    setPendingCommand(command);
  }, []);

  const setProjects = useCallback((projects) => {
    setActiveProjects(projects || []);
  }, []);

  const stateValue = useMemo(() => ({
    magicResult,
    showResults,
    pendingCommand,
    activeProjects,
    dashboardContext
  }), [magicResult, showResults, pendingCommand, activeProjects, dashboardContext]);

  const actionsValue = useMemo(() => ({
    setGlobalResult,
    closeGlobalResults,
    triggerCommand,
    setPendingCommand,
    setProjects,
    setDashboardContext
  }), [setGlobalResult, closeGlobalResults, triggerCommand, setPendingCommand, setProjects, setDashboardContext]);

  return (
    <MagicStateContext.Provider value={stateValue}>
      <MagicActionsContext.Provider value={actionsValue}>
        {children}
      </MagicActionsContext.Provider>
    </MagicStateContext.Provider>
  );
};

// Unified hook for backward compatibility
export const useMagic = () => {
  const state = useContext(MagicStateContext);
  const actions = useContext(MagicActionsContext);
  return { ...state, ...actions };
};

// Specialized hooks for optimization
export const useMagicState = () => useContext(MagicStateContext);
export const useMagicActions = () => useContext(MagicActionsContext);
