// Generates two-letter uppercase initials from a full name string.
export const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].substring(0, 2).toUpperCase();
};

// Returns a semantic color theme identifier based on a progress percentage.
export const getProgressTheme = (percentage) => {
  if (percentage === 100) return 'success';
  if (percentage >= 50) return 'warning';
  if (percentage > 0) return 'info';
  return 'neutral';
};

// Formats a date object or string into a short local time string.
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};
