// utils/cowrie/currencyFormatter.ts
// Cowrie Currency Formatting Utilities
// Handles all currency display, conversion, and formatting

/**
 * Format Cowrie amount for display
 */
export const formatCowrie = (
  amount: number,
  options?: {
    showSymbol?: boolean;
    compact?: boolean;
    decimals?: number;
  }
): string => {
  const {
    showSymbol = true,
    compact = false,
    decimals = 2,
  } = options || {};
  
  let formatted: string;
  
  if (compact) {
    // Compact format (1.2K, 5.3M, etc.)
    if (amount >= 1_000_000) {
      formatted = `${(amount / 1_000_000).toFixed(1)}M`;
    } else if (amount >= 1_000) {
      formatted = `${(amount / 1_000).toFixed(1)}K`;
    } else {
      formatted = amount.toFixed(0);
    }
  } else {
    // Full format with commas
    formatted = amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });
  }
  
  return showSymbol ? `₵${formatted}` : formatted;
};

/**
 * Format Cowrie with word suffix (e.g., "5 Cowrie", "100 Cowries")
 */
export const formatCowrieWithWord = (amount: number): string => {
  const word = amount === 1 ? 'Cowrie' : 'Cowries';
  return `${formatCowrie(amount, { showSymbol: false })} ${word}`;
};

/**
 * Parse Cowrie string to number
 */
export const parseCowrie = (value: string): number => {
  // Remove symbol and commas
  const cleaned = value.replace(/[₵,\s]/g, '');
  
  // Handle K/M suffixes
  if (cleaned.endsWith('K')) {
    return parseFloat(cleaned.slice(0, -1)) * 1_000;
  }
  if (cleaned.endsWith('M')) {
    return parseFloat(cleaned.slice(0, -1)) * 1_000_000;
  }
  
  return parseFloat(cleaned) || 0;
};

/**
 * Format Cowrie range (e.g., "₵100 - ₵500")
 */
export const formatCowrieRange = (
  min: number,
  max: number,
  compact: boolean = false
): string => {
  const formattedMin = formatCowrie(min, { compact });
  const formattedMax = formatCowrie(max, { compact });
  
  return `${formattedMin} - ${formattedMax}`;
};

/**
 * Format Cowrie for input fields (no symbol, formatted)
 */
export const formatCowrieInput = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

/**
 * Validate Cowrie amount
 */
export const validateCowrieAmount = (
  amount: number,
  min: number = 0,
  max: number = Infinity
): {
  valid: boolean;
  error?: string;
} => {
  if (isNaN(amount)) {
    return { valid: false, error: 'Invalid amount' };
  }
  
  if (amount < min) {
    return { valid: false, error: `Minimum amount is ${formatCowrie(min)}` };
  }
  
  if (amount > max) {
    return { valid: false, error: `Maximum amount is ${formatCowrie(max)}` };
  }
  
  if (amount < 0) {
    return { valid: false, error: 'Amount cannot be negative' };
  }
  
  return { valid: true };
};

/**
 * Calculate Cowrie with percentage
 */
export const calculatePercentage = (
  amount: number,
  percentage: number
): number => {
  return Math.round(amount * (percentage / 100));
};

/**
 * Calculate platform fee
 */
export const calculatePlatformFee = (
  amount: number,
  feePercentage: number = 5
): {
  fee: number;
  netAmount: number;
} => {
  const fee = calculatePercentage(amount, feePercentage);
  const netAmount = amount - fee;
  
  return { fee, netAmount };
};

/**
 * Split Cowrie among multiple recipients
 */
export const splitCowrie = (
  totalAmount: number,
  splits: Array<{ recipientId: string; percentage: number }>
): Array<{ recipientId: string; amount: number }> => {
  // Ensure percentages add up to 100
  const totalPercentage = splits.reduce((sum, s) => sum + s.percentage, 0);
  
  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new Error(`Split percentages must add up to 100% (got ${totalPercentage}%)`);
  }
  
  // Calculate amounts
  const results = splits.map((split) => ({
    recipientId: split.recipientId,
    amount: Math.round((totalAmount * split.percentage) / 100),
  }));
  
  // Handle rounding discrepancies (give remainder to first recipient)
  const totalAllocated = results.reduce((sum, r) => sum + r.amount, 0);
  const remainder = totalAmount - totalAllocated;
  
  if (remainder !== 0 && results.length > 0) {
    results[0].amount += remainder;
  }
  
  return results;
};

/**
 * Format transaction amount with sign
 */
export const formatTransaction = (
  amount: number,
  type: 'credit' | 'debit'
): string => {
  const sign = type === 'credit' ? '+' : '-';
  
  return `${sign}${formatCowrie(Math.abs(amount))}`;
};

/**
 * Format transaction with color class
 */
export const formatTransactionWithColor = (
  amount: number,
  type: 'credit' | 'debit'
): {
  text: string;
  color: string;
} => {
  const sign = type === 'credit' ? '+' : '-';
  const color = type === 'credit' ? 'text-green-600' : 'text-red-600';
  
  return {
    text: `${sign}${formatCowrie(Math.abs(amount))}`,
    color,
  };
};

/**
 * Calculate Cowrie to fiat conversion
 * (Rate would come from API, hardcoded for now)
 */
export const convertToFiat = (
  cowrieAmount: number,
  fiatCurrency: 'NGN' | 'USD' | 'GHS' | 'KES' = 'NGN',
  exchangeRate?: number
): {
  amount: number;
  currency: string;
  formatted: string;
} => {
  // Example exchange rates (would come from API)
  const rates = {
    NGN: exchangeRate || 100, // 1 Cowrie = 100 NGN
    USD: exchangeRate || 0.12, // 1 Cowrie = $0.12
    GHS: exchangeRate || 1.5, // 1 Cowrie = 1.5 GHS
    KES: exchangeRate || 15, // 1 Cowrie = 15 KES
  };
  
  const amount = cowrieAmount * rates[fiatCurrency];
  
  const currencySymbols = {
    NGN: '₦',
    USD: '$',
    GHS: '₵',
    KES: 'KSh',
  };
  
  const formatted = `${currencySymbols[fiatCurrency]}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  
  return {
    amount,
    currency: fiatCurrency,
    formatted,
  };
};

/**
 * Format Cowrie balance with tier indicator
 */
export const formatBalance = (
  balance: number
): {
  formatted: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  color: string;
} => {
  let tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  let color: string;
  
  if (balance >= 100_000) {
    tier = 'platinum';
    color = '#e5e7eb'; // Platinum gray
  } else if (balance >= 50_000) {
    tier = 'gold';
    color = '#f59e0b'; // Gold
  } else if (balance >= 10_000) {
    tier = 'silver';
    color = '#9ca3af'; // Silver
  } else {
    tier = 'bronze';
    color = '#cd7f32'; // Bronze
  }
  
  return {
    formatted: formatCowrie(balance, { compact: true }),
    tier,
    color,
  };
};

/**
 * Calculate minimum tip amount based on context
 */
export const getMinimumTip = (context: 'post' | 'performance' | 'service' | 'event'): number => {
  const minimums = {
    post: 1,
    performance: 5,
    service: 10,
    event: 20,
  };
  
  return minimums[context];
};

/**
 * Suggest tip amounts
 */
export const suggestTipAmounts = (
  context: 'post' | 'performance' | 'service' | 'event'
): number[] => {
  const suggestions = {
    post: [1, 5, 10, 20],
    performance: [10, 25, 50, 100],
    service: [50, 100, 200, 500],
    event: [100, 250, 500, 1000],
  };
  
  return suggestions[context];
};

/**
 * Format Cowrie flow rate (per time period)
 */
export const formatCowrieRate = (
  amountPerPeriod: number,
  period: 'hour' | 'day' | 'week' | 'month'
): string => {
  const periodLabels = {
    hour: '/hr',
    day: '/day',
    week: '/wk',
    month: '/mo',
  };
  
  return `${formatCowrie(amountPerPeriod, { compact: true })}${periodLabels[period]}`;
};

export default {
  formatCowrie,
  formatCowrieWithWord,
  parseCowrie,
  formatCowrieRange,
  formatCowrieInput,
  validateCowrieAmount,
  calculatePercentage,
  calculatePlatformFee,
  splitCowrie,
  formatTransaction,
  convertToFiat,
  formatBalance,
  getMinimumTip,
  suggestTipAmounts,
  formatCowrieRate,
};