/**
 * Date utility functions for handling timezone conversions
 * Backend stores all dates in UTC, frontend displays in user's local timezone
 */

/**
 * Parse a date string from backend and ensure it's treated as UTC
 * Handles both ISO 8601 with Z and without Z
 * @param dateString Date string from backend
 * @returns Date object
 */
const parseUTCDate = (dateString: string): Date => {
  // If the string doesn't end with Z, append it to treat as UTC
  if (!dateString.endsWith('Z') && !dateString.includes('+') && !dateString.includes('Z')) {
    return new Date(dateString + 'Z');
  }
  return new Date(dateString);
};

/**
 * Format a date string to the user's local date
 * @param dateString ISO 8601 date string from backend (UTC)
 * @returns Formatted date string in user's locale
 */
export const formatLocalDate = (dateString: string): string => {
  const date = parseUTCDate(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a date string to the user's local date and time
 * @param dateString ISO 8601 date string from backend (UTC)
 * @returns Formatted date and time string in user's locale
 */
export const formatLocalDateTime = (dateString: string): string => {
  const date = parseUTCDate(dateString);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a date string to the user's local time only
 * @param dateString ISO 8601 date string from backend (UTC)
 * @returns Formatted time string in user's locale
 */
export const formatLocalTime = (dateString: string): string => {
  const date = parseUTCDate(dateString);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get relative time string (e.g., "2 hours ago", "just now")
 * @param dateString ISO 8601 date string from backend (UTC)
 * @param t Translation function from i18next
 * @returns Relative time string
 */
export const getRelativeTime = (dateString: string, t: (key: string, options?: any) => string): string => {
  const date = parseUTCDate(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return t('notifications.justNow');
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return t('notifications.minutesAgo', { count: minutes });
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t('notifications.hoursAgo', { count: hours });
  
  const days = Math.floor(hours / 24);
  if (days < 7) return t('notifications.daysAgo', { count: days });
  
  return formatLocalDate(dateString);
};

/**
 * Get days ago text (e.g., "Today", "Yesterday", "3 days ago")
 * @param dateString ISO 8601 date string from backend (UTC)
 * @param t Translation function from i18next
 * @returns Days ago string
 */
export const getDaysAgo = (dateString: string, t: (key: string, options?: any) => string): string => {
  const date = parseUTCDate(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t('date.today');
  if (diffDays === 1) return t('date.yesterday');
  return t('date.daysAgo', { count: diffDays });
};

/**
 * Check if a date is today
 * @param dateString ISO 8601 date string from backend (UTC)
 * @returns true if date is today in user's timezone
 */
export const isToday = (dateString: string): boolean => {
  const date = parseUTCDate(dateString);
  const now = new Date();
  return date.toDateString() === now.toDateString();
};

/**
 * Check if a date is within the last N days
 * @param dateString ISO 8601 date string from backend (UTC)
 * @param days Number of days to check
 * @returns true if date is within the last N days
 */
export const isWithinLastDays = (dateString: string, days: number): boolean => {
  const date = parseUTCDate(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days;
};
