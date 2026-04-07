/**
 * Formats a date/string into HH:MM time (12h or 24h, locale-aware).
 * Extracted from the duplicated inline expression in NotificationTray and TaskComments.
 *
 * @param {string|Date} date - Any value accepted by `new Date()`
 * @returns {string} e.g. "09:41" or "9:41 AM"
 */
export const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
