/**
 * Extracts initials from a full name.
 * @param {string} name 
 * @returns {string} Initials (e.g., "John Doe" -> "JD")
 */
export const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    return parts.length > 1 
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : parts[0].substring(0, 2).toUpperCase();
};

/**
 * Maps a percentage to a color/status theme.
 * @param {number} percentage 
 */
export const getProgressTheme = (percentage) => {
    if (percentage === 100) return 'success';
    if (percentage >= 50) return 'warning';
    if (percentage > 0) return 'info';
    return 'neutral';
};

/**
 * Format a date to a human-readable string.
 * @param {string|Date} date 
 */
export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
