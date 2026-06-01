import React, { useState, useEffect, useRef } from 'react';
import MagicService from '../../api/magicApi';
import { useAuth } from '../../context/AuthContext';
import { useMagicState, useMagicActions } from '../../context/MagicContext';
import magicData from '../../data/magicCommands.json';
import ErrorBoundary from '../atoms/ErrorBoundary';

// A command interface that processes natural language inputs.
const MagicBar = () => {
  const { user } = useAuth();
  const { setGlobalResult, setPendingCommand } = useMagicActions();
  const { pendingCommand, activeProjects, dashboardContext } = useMagicState();
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const paletteRef = useRef(null);
  const inputRef = useRef(null);

  const getSuggestions = () => {
    const role = user?.role || 'TEAM_MEMBER';
    const dynamicCommands = magicData[role] || magicData['TEAM_MEMBER'];
    const globalCommands = magicData['GLOBAL'] || [];

    // Inject dynamic project context into suggestions
    const projectCommands =
      activeProjects?.flatMap((p) => [
        {
          id: `proj-opt-${p._id}`,
          label: `Optimize ${p.name}`,
          prompt: `Optimize path for ${p.name}`,
          type: 'project',
        },
        {
          id: `proj-health-${p._id}`,
          label: `${p.name} Health`,
          prompt: `Show health status for ${p.name}`,
          type: 'project',
        },
        {
          id: `proj-tasks-${p._id}`,
          label: `${p.name} Tasks`,
          prompt: `List incomplete tasks for ${p.name}`,
          type: 'project',
        },
      ]) || [];

    return [...projectCommands, ...dynamicCommands, ...globalCommands];
  };

  const currentSuggestions = getSuggestions();

  // Filter suggestions strictly based on word-starts
  const filteredSuggestions = currentSuggestions
    .filter((s) => {
      const q = query.toLowerCase().trim();
      if (!q) return false;

      const words = (s.label + ' ' + s.prompt).toLowerCase().split(/\s+/);
      return words.some((word) => word.startsWith(q));
    })
    .slice(0, 4); // Keep it executive and focused

  const handleSuggestionClick = (prompt) => {
    setQuery(prompt);
    setIsFocused(false);
    executeCommand(prompt);
  };

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleGlobalKeydown = (e) => {
      if (!isFocused) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredSuggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length
        );
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        handleSuggestionClick(filteredSuggestions[selectedIndex].prompt);
      } else if (e.key === 'Escape') {
        setIsFocused(false);
      }
    };

    document.addEventListener('keydown', handleGlobalKeydown);
    return () => document.removeEventListener('keydown', handleGlobalKeydown);
  }, [isFocused, selectedIndex, filteredSuggestions]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const startVoiceCommand = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tactical Comms offline.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      executeCommand(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const executeCommand = async (commandText) => {
    const activeQuery = commandText || query;
    if (!activeQuery.trim()) return;

    setIsProcessing(true);
    setGlobalResult(null);

    try {
      // Send the query with the current project and dashboard context.
      const res = await MagicService.executeCommand(activeQuery, {
        stats: dashboardContext?.stats,
        visibleProjects: activeProjects.map((p) => ({
          name: p.name,
          health: p.healthScore,
          percentage: p.percentage,
        })),
      });
      setGlobalResult(res.data);
      setQuery('');
      setIsFocused(false);
    } catch (error) {
      setGlobalResult({ message: 'System offline. Command execution failed.' });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (pendingCommand) {
      setQuery(pendingCommand);
      executeCommand(pendingCommand);
      setPendingCommand(null);
    }
  }, [pendingCommand]);

  return (
    <div
      ref={paletteRef}
      className="relative w-full transition-all duration-300"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeCommand();
        }}
        className="relative group h-9 w-full bg-[#161622]/40 hover:bg-[#161622]/70 border border-white/[0.05] focus-within:bg-[#161622]/90 focus-within:border-primary/40 focus-within:shadow-[0_0_20px_rgba(var(--color-primary),0.1)] rounded-full transition-all duration-300 backdrop-blur-md"
      >
        <div className={`relative flex items-center h-full px-4 w-full`}>
          <span className="text-[12px] mr-2 opacity-60 hover:scale-110 transition-transform cursor-default">
            ✨
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Nexa..."
            className="flex-1 w-full bg-transparent border-none outline-none text-white text-[13px] placeholder:text-text-muted/30 font-medium tracking-wide"
            disabled={isProcessing}
            autoComplete="off"
          />
          {isProcessing ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin ml-3"></div>
          ) : (
            <div className="flex items-center ml-3 gap-3">
              {activeProjects.length > 0 && isFocused && (
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-lg animate-in fade-in zoom-in duration-500">
                  <div className="w-1 h-1 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary/80 leading-none">
                    {activeProjects.length} Projects Scoped
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={startVoiceCommand}
                className={`${isListening ? 'text-status-danger animate-pulse scale-110' : 'text-text-muted hover:text-white'} transition-all`}
                title="Voice Command"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
              <button
                type="submit"
                className="text-white hover:text-white hover:scale-110 transition-all bg-primary/20 hover:bg-primary/30 p-1.5 rounded-full flex items-center justify-center -mr-2"
              >
                <svg
                  className="w-3.5 h-3.5 stroke-primary-light"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Show dynamic suggestions while the user is typing. */}
      {isFocused &&
        query.trim().length > 0 &&
        filteredSuggestions.length > 0 && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#161622]/95 backdrop-blur-2xl border border-white/10 rounded-2xl py-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 z-[60] overflow-hidden">
            {filteredSuggestions.map((s, index) => (
              <button
                key={s.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(s.prompt);
                }}
                className={`w-full text-left px-4 py-3 transition-all group border-b border-white/[0.02] last:border-0 flex items-center justify-between ${
                  selectedIndex === index
                    ? 'bg-white/[0.08] translate-x-1'
                    : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex flex-col">
                  <span
                    className={`text-[12px] font-bold group-hover:text-primary transition-colors flex items-center gap-3 ${
                      selectedIndex === index ? 'text-primary' : 'text-white/90'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        selectedIndex === index
                          ? 'bg-primary animate-pulse'
                          : 'bg-primary/40'
                      }`}
                    ></span>
                    {s.label}
                  </span>
                  <span className="text-[10px] text-text-muted/60 font-medium ml-4.5">
                    {s.prompt}
                  </span>
                </div>
                {selectedIndex === index && (
                  <span className="text-[10px] text-primary/40 flex items-center gap-1 font-black uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
                    Enter
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M11 5L18 12L11 19M6 12H18"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
    </div>
  );
};

const SafeMagicBar = (props) => (
  <ErrorBoundary>
    <MagicBar {...props} />
  </ErrorBoundary>
);

export default SafeMagicBar;
