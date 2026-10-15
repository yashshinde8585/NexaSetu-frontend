// Returns initials for user profile avatars. Assumes space-separated full name
// (e.g. "Jane Doe" -> "JD"). If a single word is provided, takes the first two characters.
// Returns a fallback value of '??' if name is null/undefined to prevent runtime errors.
export const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].substring(0, 2).toUpperCase();
};

// Map progress thresholds to dashboard status colors. A progress of 100% signifies completion
// ('success'), while thresholds >= 50% indicate active warning/intervention states, and any progress
// below 50% represents default info states. Defaults to 'neutral' for unstarted tasks.
export const getProgressTheme = (percentage) => {
  if (percentage === 100) return 'success';
  if (percentage >= 50) return 'warning';
  if (percentage > 0) return 'info';
  return 'neutral';
};

// Formats absolute times into short 2-digit local time strings for UI activity logs.
// WARNING: Relies on browser's local timezone. Will throw an error if the input 'date' is
// unparseable by the Date constructor; caller should ensure input validation.
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};
