// Formatting utilities

/**
 * Format time from 24-hour format to 12-hour format
 * @param timeString - Time in 24-hour format (e.g., "14:30")
 * @returns Time in 12-hour format with AM/PM (e.g., "2:30 PM")
 */
export function formatTime(timeString: string): string {
  if (!timeString) return '';

  try {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
}

/**
 * Format price with currency symbol
 * @param price - Price as number
 * @returns Formatted price string (e.g., "$29.99")
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Format date to readable string
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}
