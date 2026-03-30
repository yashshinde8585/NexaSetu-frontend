import React, { createContext, useContext, useState } from 'react';

const MagicContext = createContext();

export const MagicProvider = ({ children }) => {
  const [magicResult, setMagicResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [pendingCommand, setPendingCommand] = useState(null);
  const [activeProjects, setActiveProjects] = useState([]);
  const [dashboardContext, setDashboardContext] = useState(null);

  const setGlobalResult = (result) => {
    setMagicResult(result);
    setShowResults(!!result);
  };

  const closeGlobalResults = () => {
    setMagicResult(null);
    setShowResults(false);
  };

  const triggerCommand = (command) => {
    setPendingCommand(command);
  };

  const setProjects = (projects) => {
    setActiveProjects(projects || []);
  };

  return (
    <MagicContext.Provider value={{ 
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
    }}>
      {children}
    </MagicContext.Provider>
  );
};

export const useMagic = () => useContext(MagicContext);
