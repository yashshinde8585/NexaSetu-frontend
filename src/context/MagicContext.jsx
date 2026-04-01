import React, { createContext, useContext, useState } from 'react';

const MagicContext = createContext();

export const MagicProvider = ({ children }) => {
  const [magicResult, setMagicResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [pendingCommand, setPendingCommand] = useState(null);
  const [activeProjects, setActiveProjects] = useState([]);
  const [dashboardContext, setDashboardContext] = useState(null);

  const setGlobalResult = React.useCallback((result) => {
    setMagicResult(result);
    setShowResults(!!result);
  }, []);

  const closeGlobalResults = React.useCallback(() => {
    setMagicResult(null);
    setShowResults(false);
  }, []);

  const triggerCommand = React.useCallback((command) => {
    setPendingCommand(command);
  }, []);

  const setProjects = React.useCallback((projects) => {
    setActiveProjects(projects || []);
  }, []);

  const contextValue = React.useMemo(() => ({
    magicResult,
    showResults,
    setGlobalResult,
    closeGlobalResults,
    triggerCommand,
    pendingCommand,
    setPendingCommand,
    activeProjects,
    setProjects,
    dashboardContext,
    setDashboardContext
  }), [
    magicResult,
    showResults,
    setGlobalResult,
    closeGlobalResults,
    triggerCommand,
    pendingCommand,
    activeProjects,
    setProjects,
    dashboardContext,
    setDashboardContext
  ]);

  return (
    <MagicContext.Provider value={contextValue}>
      {children}
    </MagicContext.Provider>
  );
};

export const useMagic = () => useContext(MagicContext);
