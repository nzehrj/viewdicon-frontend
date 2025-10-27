/**
 * Afro-ID Generator
 * Format: [HERITAGE][DIASPORA][GENERATION][TIMESTAMP][CHECKSUM]
 * Example: YOR-US-G3-2024-A7B9
 */

// Heritage code mappings (3-letter codes for African ethnic groups)
export const HERITAGE_CODES: Record<string, string> = {
  // Nigeria
  yoruba: 'YOR',
  igbo: 'IGB',
  hausa: 'HAU',
  fulani: 'FUL',
  ijaw: 'IJA',
  kanuri: 'KAN',
  ibibio: 'IBI',
  tiv: 'TIV',
  
  // Ghana
  akan: 'AKN',
  ewe: 'EWE',
  ga: 'GAA',
  dagbani: 'DAG',
  
  // Kenya
  kikuyu: 'KIK',
  luhya: 'LUH',
  kalenjin: 'KAL',
  luo: 'LUO',
  kamba: 'KAM',
  
  // South Africa
  zulu: 'ZUL',
  xhosa: 'XHO',
  sotho: 'SOT',
  tswana: 'TSW',
  pedi: 'PED',
  venda: 'VEN',
  tsonga: 'TSO',
  swazi: 'SWA',
  ndebele: 'NDE',
  
  // East Africa
  swahili: 'SWH',
  amhara: 'AMH',
  oromo: 'ORM',
  tigray: 'TIG',
  somali: 'SOM',
  
  // West Africa
  wolof: 'WOL',
  mandinka: 'MAN',
  bambara: 'BAM',
  
  // Central Africa
  lingala: 'LIN',
  kongo: 'KON',
  
  // Generic/Other
  african: 'AFR',
  mixed: 'MIX',
  other: 'OTH',
};

// Country/Diaspora code mappings (2-letter ISO codes)
export const DIASPORA_CODES: Record<string, string> = {
  // Africa
  nigeria: 'NG',
  kenya: 'KE',
  ghana: 'GH',
  'south africa': 'ZA',
  egypt: 'EG',
  ethiopia: 'ET',
  uganda: 'UG',
  tanzania: 'TZ',
  senegal: 'SN',
  cameroon: 'CM',
  'ivory coast': 'CI',
  
  // Diaspora - Americas
  'united states': 'US',
  canada: 'CA',
  brazil: 'BR',
  jamaica: 'JM',
  'trinidad and tobago': 'TT',
  barbados: 'BB',
  haiti: 'HT',
  
  // Diaspora - Europe
  'united kingdom': 'GB',
  france: 'FR',
  germany: 'DE',
  netherlands: 'NL',
  belgium: 'BE',
  italy: 'IT',
  spain: 'ES',
  portugal: 'PT',
  
  // Diaspora - Middle East
  'saudi arabia': 'SA',
  'united arab emirates': 'AE',
  
  // Diaspora - Asia
  china: 'CN',
  india: 'IN',
  
  // Other
  other: 'XX',
};

interface AfroIDComponents {
  heritage: string;      // 3-letter heritage code
  diaspora: string;      // 2-letter location code
  generation: string;    // Generation number (G1, G2, G3, etc.)
  year: string;          // Registration year (2024, 2025, etc.)
  checksum: string;      // 4-character encrypted checksum
}

/**
 * Generate a random alphanumeric checksum
 * Format: 2 random letters + 2 random digits (e.g., A7B9)
 */
function generateChecksum(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excluding I, O for clarity
  const digits = '0123456789';
  
  const randomLetter1 = letters[Math.floor(Math.random() * letters.length)];
  const randomDigit1 = digits[Math.floor(Math.random() * digits.length)];
  const randomLetter2 = letters[Math.floor(Math.random() * letters.length)];
  const randomDigit2 = digits[Math.floor(Math.random() * digits.length)];
  
  return `${randomLetter1}${randomDigit1}${randomLetter2}${randomDigit2}`;
}

/**
 * Calculate generation number based on family tree or user input
 * G1 = First generation on platform
 * G2 = Second generation (child of G1)
 * G3 = Third generation (grandchild of G1)
 */
function calculateGeneration(familyTreeDepth?: number, userGeneration?: number): string {
  const generation = userGeneration || familyTreeDepth || 1;
  return `G${Math.min(generation, 99)}`; // Max G99
}

/**
 * Get heritage code from user's ethnic group/tribe
 */
function getHeritageCode(heritage: string): string {
  const normalizedHeritage = heritage.toLowerCase().trim();
  return HERITAGE_CODES[normalizedHeritage] || 'AFR'; // Default to generic African
}

/**
 * Get diaspora code from user's country
 */
function getDiasporaCode(country: string): string {
  const normalizedCountry = country.toLowerCase().trim();
  return DIASPORA_CODES[normalizedCountry] || 'XX'; // Default to other
}

/**
 * Generate a complete Afro-ID
 */
export function generateAfroID(params: {
  heritage: string;           // User's ethnic group (e.g., "Yoruba", "Zulu")
  country: string;            // User's current country (e.g., "Nigeria", "United States")
  generation?: number;        // Generation number (optional, defaults to 1)
  familyTreeDepth?: number;   // Calculated from family tree (optional)
}): string {
  const { heritage, country, generation, familyTreeDepth } = params;
  
  const heritageCode = getHeritageCode(heritage);
  const diasporaCode = getDiasporaCode(country);
  const generationCode = calculateGeneration(familyTreeDepth, generation);
  const year = new Date().getFullYear().toString();
  const checksum = generateChecksum();
  
  // Format: YOR-US-G3-2024-A7B9
  return `${heritageCode}-${diasporaCode}-${generationCode}-${year}-${checksum}`;
}

/**
 * Parse an Afro-ID into its components
 */
export function parseAfroID(afroId: string): AfroIDComponents | null {
  // Validate format
  const parts = afroId.split('-');
  if (parts.length !== 5) return null;
  
  const [heritage, diaspora, generation, year, checksum] = parts;
  
  // Validate each part
  if (
    heritage.length !== 3 ||
    diaspora.length !== 2 ||
    !generation.startsWith('G') ||
    year.length !== 4 ||
    checksum.length !== 4
  ) {
    return null;
  }
  
  return {
    heritage,
    diaspora,
    generation,
    year,
    checksum,
  };
}

/**
 * Validate an Afro-ID
 */
export function validateAfroID(afroId: string): boolean {
  return parseAfroID(afroId) !== null;
}

/**
 * Get heritage name from code
 */
export function getHeritageName(code: string): string {
  const entry = Object.entries(HERITAGE_CODES).find(([_, c]) => c === code);
  return entry ? entry[0].charAt(0).toUpperCase() + entry[0].slice(1) : 'Unknown';
}

/**
 * Get country name from diaspora code
 */
export function getCountryName(code: string): string {
  const entry = Object.entries(DIASPORA_CODES).find(([_, c]) => c === code);
  if (!entry) return 'Unknown';
  
  // Capitalize each word
  return entry[0]
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get full Afro-ID details in readable format
 */
export function getAfroIDDetails(afroId: string): {
  valid: boolean;
  heritage?: string;
  heritageName?: string;
  location?: string;
  locationName?: string;
  generation?: string;
  generationNumber?: number;
  year?: string;
  checksum?: string;
} {
  const parsed = parseAfroID(afroId);
  
  if (!parsed) {
    return { valid: false };
  }
  
  const generationNumber = parseInt(parsed.generation.substring(1));
  
  return {
    valid: true,
    heritage: parsed.heritage,
    heritageName: getHeritageName(parsed.heritage),
    location: parsed.diaspora,
    locationName: getCountryName(parsed.diaspora),
    generation: parsed.generation,
    generationNumber,
    year: parsed.year,
    checksum: parsed.checksum,
  };
}

/**
 * Example usage:
 * 
 * // Generate an Afro-ID
 * const afroId = generateAfroID({
 *   heritage: 'Yoruba',
 *   country: 'United States',
 *   generation: 3
 * });
 * // Result: YOR-US-G3-2024-A7B9
 * 
 * // Parse an Afro-ID
 * const details = getAfroIDDetails('YOR-US-G3-2024-A7B9');
 * // Result: {
 * //   valid: true,
 * //   heritage: 'YOR',
 * //   heritageName: 'Yoruba',
 * //   location: 'US',
 * //   locationName: 'United States',
 * //   generation: 'G3',
 * //   generationNumber: 3,
 * //   year: '2024',
 * //   checksum: 'A7B9'
 * // }
 */

export default {
  generateAfroID,
  parseAfroID,
  validateAfroID,
  getHeritageName,
  getCountryName,
  getAfroIDDetails,
  HERITAGE_CODES,
  DIASPORA_CODES,
};