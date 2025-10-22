/**
 * Sleep/delay utility
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if device is mobile
 */
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Get device platform
 */
export const getDevicePlatform = (): 'web' | 'android' | 'ios' => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/android/.test(userAgent)) return 'android';
  if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
  return 'web';
};

/**
 * Get current timezone
 */
export const getTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Get greeting based on time of day
 */
export const getGreeting = (language: string = 'en'): string => {
  const hour = new Date().getHours();
  
  const greetings: Record<string, { morning: string; afternoon: string; evening: string }> = {
    en: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' },
    yo: { morning: 'Ẹ káàrọ̀', afternoon: 'Ẹ káàsàn', evening: 'Ẹ kú alẹ́' },
    ig: { morning: 'Ụtụtụ ọma', afternoon: 'Ehihie ọma', evening: 'Mgbede ọma' },
    ha: { morning: 'Barka da safe', afternoon: 'Barka da rana', evening: 'Barka da yamma' },
    sw: { morning: 'Habari za asubuhi', afternoon: 'Habari za mchana', evening: 'Habari za jioni' },
    zu: { morning: 'Sawubona', afternoon: 'Sawubona', evening: 'Sawubona' },
    xh: { morning: 'Molo', afternoon: 'Molo', evening: 'Molo' },
  };
  
  const langGreetings = greetings[language] || greetings.en;
  
  if (hour < 12) return langGreetings.morning;
  if (hour < 17) return langGreetings.afternoon;
  return langGreetings.evening;
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Generate random color
 */
export const generateRandomColor = (): string => {
  const colors = [
    '#10b981', '#f59e0b', '#3b82f6', '#a855f7', '#ef4444',
    '#06b6d4', '#8b5cf6', '#ec4899', '#84cc16',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: any): boolean => {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};