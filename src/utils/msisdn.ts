import { parsePhoneNumber, CountryCode } from 'libphonenumber-js';

/**
 * Parse and format MSISDN (Mobile Station International Subscriber Directory Number)
 */
export const parseMSISDN = (phone: string, defaultCountry: CountryCode = 'NG') => {
  try {
    const phoneNumber = parsePhoneNumber(phone, defaultCountry);
    
    if (!phoneNumber) {
      return null;
    }
    
    return {
      e164: phoneNumber.format('E.164'),
      international: phoneNumber.format('INTERNATIONAL'),
      national: phoneNumber.format('NATIONAL'),
      countryCode: phoneNumber.country,
      nationalNumber: phoneNumber.nationalNumber,
      isValid: phoneNumber.isValid(),
    };
  } catch (error) {
    return null;
  }
};

/**
 * Get carrier hints from MCC/MNC
 */
export const getCarrierHint = (mcc: string, mnc: string): { carrier: string; country: string } | null => {
  // Nigeria carriers
  const nigeriaCarriers: Record<string, string> = {
    '62130': 'MTN Nigeria',
    '62140': 'Globacom',
    '62150': 'Airtel Nigeria',
    '62160': '9mobile',
  };
  
  const mccMnc = `${mcc}${mnc}`;
  const carrier = nigeriaCarriers[mccMnc];
  
  if (carrier) {
    return { carrier, country: 'Nigeria' };
  }
  
  return null;
};

/**
 * Auto-detect country code from phone number
 */
export const detectCountryCode = (phone: string): CountryCode | null => {
  try {
    const phoneNumber = parsePhoneNumber(phone);
    return phoneNumber?.country || null;
  } catch {
    return null;
  }
};

/**
 * Format phone for display with country flag
 */
export const formatPhoneWithFlag = (phone: string): string => {
  const parsed = parseMSISDN(phone);
  if (!parsed) return phone;
  
  const flags: Record<string, string> = {
    NG: '🇳🇬',
    KE: '🇰🇪',
    ZA: '🇿🇦',
    GH: '🇬🇭',
    TZ: '🇹🇿',
  };
  
  const flag = flags[parsed.countryCode || ''] || '🌍';
  return `${flag} ${parsed.international}`;
};