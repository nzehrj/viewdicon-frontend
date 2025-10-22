import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

/**
 * Validate E.164 phone number format
 */
export const validatePhone = (phone: string, countryCode: string = 'NG'): boolean => {
  try {
    return isValidPhoneNumber(phone, countryCode as any);
  } catch {
    return false;
  }
};

/**
 * Format phone number to E.164 format
 */
export const formatPhoneE164 = (phone: string, countryCode: string = 'NG'): string | null => {
  try {
    const phoneNumber = parsePhoneNumber(phone, countryCode as any);
    return phoneNumber ? phoneNumber.format('E.164') : null;
  } catch {
    return null;
  }
};

/**
 * Validate OTP code (6 digits)
 */
export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

/**
 * Validate Afro ID format
 */
export const validateAfroId = (afroId: string): boolean => {
  // Example format: AFRO-1234-5678-90AB
  return /^AFRO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(afroId);
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate name (at least 2 characters, letters and spaces only)
 */
export const validateName = (name: string): boolean => {
  return /^[a-zA-Z\s]{2,}$/.test(name.trim());
};

/**
 * Validate date of birth (must be at least 13 years old)
 */
export const validateDOB = (dob: string): boolean => {
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 13;
  }
  
  return age >= 13;
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};