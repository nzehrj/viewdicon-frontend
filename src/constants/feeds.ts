// constants/feeds.ts
// Four Feed System Configuration

export type FeedType = 'performance' | 'marketplace' | 'social-voice' | 'family-root';

/**
 * Feed configurations
 */
export const FEEDS = {
  performance: {
    id: 'performance' as const,
    name: 'Performance Feed',
    nativeName: 'ORÍKÌ',
    englishName: 'The Drum of Performance',
    icon: '🎬',
    color: '#a855f7', // Purple
    description: 'Show talent, skill, craft, power, testimony, transformation',
    
    // Entry points (maps to identity skins)
    entryPoints: [
      {
        id: 'show-work',
        name: 'Show My Work',
        skin: 'work', // Orí Ìṣẹ́
        icon: '🛠️',
        color: '#f97316',
        description: 'From Village dashboard - prove work, teach technique',
      },
      {
        id: 'bless-crowd',
        name: 'Bless My Crowd',
        skin: 'public', // Orí Àgbàlá
        icon: '🎭',
        color: '#ec4899',
        description: 'From Social tab - freestyle, dance, comedy, lifestyle',
      },
      {
        id: 'speak-for-people',
        name: 'Speak For My People',
        skin: 'clan', // Orí Ìdílé
        icon: '🗣️',
        color: '#10b981',
        description: 'From Clan tab - ancestral, collective, survival voice',
      },
    ],
    
    // Recording modes
    recordingModes: [
      {
        id: 'quick-clip',
        name: 'Quick Clip',
        duration: { min: 15, max: 60 },
        destination: 'feed',
        icon: '⚡',
      },
      {
        id: 'knowledge-drop',
        name: 'Knowledge Drop',
        duration: { min: 60, max: 300 },
        destination: 'knowledge-basket',
        icon: '🧠',
      },
      {
        id: 'proof-of-hand',
        name: 'Proof of Hand',
        duration: { min: 30, max: 180 },
        destination: 'feed',
        icon: '🧰',
      },
      {
        id: 'clan-voice',
        name: 'Clan Voice',
        duration: { min: 30, max: 90 },
        destination: 'feed',
        icon: '💬',
      },
      {
        id: 'live-classroom',
        name: 'Live Classroom',
        duration: { min: 300, max: 7200 },
        destination: 'live',
        icon: '🎓',
      },
      {
        id: 'open-drum',
        name: 'Open Drum (Live)',
        duration: { min: 60, max: 14400 },
        destination: 'live',
        icon: '🔴',
      },
      {
        id: 'whisper-mode',
        name: 'Whisper Mode',
        duration: { min: 15, max: 30 },
        destination: 'safety',
        icon: '🕯️',
      },
    ],
    
    // Audience scopes
    audienceScopes: [
      { id: 'village', name: 'My Village Only', icon: '🏘️' },
      { id: 'clan', name: 'My Clan/State Only', icon: '👥' },
      { id: 'nation', name: 'Whole Nation', icon: '🌍' },
      { id: 'private', name: 'Paid Students/Clients Only', icon: '🔒' },
    ],
  },
  
  marketplace: {
    id: 'marketplace' as const,
    name: 'Marketplace Feed',
    nativeName: 'ÀWÒRÁN',
    englishName: 'The Market Wall',
    icon: '🛒',
    color: '#eab308', // Yellow
    description: 'Goods, services, results, events, performances',
    
    // Marketplace sections
    sections: [
      {
        id: 'market',
        name: 'Market',
        icon: '🏪',
        color: '#eab308',
        description: 'Physical & digital goods',
      },
      {
        id: 'stage',
        name: 'Stage',
        icon: '🎤',
        color: '#ec4899',
        description: 'Performances & entertainment',
      },
      {
        id: 'hall',
        name: 'Hall',
        icon: '🧠',
        color: '#3b82f6',
        description: 'Knowledge & conferences',
      },
      {
        id: 'collab',
        name: 'Collab Zone',
        icon: '🤝',
        color: '#10b981',
        description: 'Networking & partnerships',
      },
      {
        id: 'fair',
        name: 'Global Fair',
        icon: '🌍',
        color: '#8b5cf6',
        description: 'Monthly featured events',
      },
    ],
    
    // Price models
    priceModels: [
      { id: 'fixed', name: 'Fixed Price', icon: '💰' },
      { id: 'range', name: 'Price Range', icon: '↔️' },
      { id: 'bid', name: 'Auction/Bid', icon: '🔨' },
      { id: 'slots', name: 'Limited Slots', icon: '🎫' },
      { id: 'bulk', name: 'Bulk Pricing', icon: '📦' },
    ],
    
    // Delivery modes
    deliveryModes: [
      { id: 'pickup', name: 'Pickup Now', icon: '🚶' },
      { id: 'courier', name: 'Courier Delivery', icon: '🛵' },
      { id: 'bulk', name: 'Bulk/Wholesale', icon: '🚚' },
      { id: 'digital', name: 'Digital Delivery', icon: '📧' },
    ],
  },
  
  'social-voice': {
    id: 'social-voice' as const,
    name: 'Social Voice Feed',
    nativeName: 'ÌRÒYÌN / SÒRÒ-SÒKÈ',
    englishName: 'The Drum of the People',
    icon: '📢',
    color: '#3b82f6', // Blue
    description: 'Voice, truth, witness, politics, community dialogue',
    
    // Voice classes
    voiceClasses: [
      {
        id: 'citizen',
        name: 'Citizen',
        symbol: '🟢',
        description: 'Verified user with personal Crest and Shield',
      },
      {
        id: 'witness',
        name: 'Witness',
        symbol: '👁️',
        description: 'I saw it myself - geo-locked proof posters',
      },
      {
        id: 'voice-of-record',
        name: 'Voice of Record',
        symbol: '🗞️',
        description: 'Journalists, storytellers, community scribes',
      },
      {
        id: 'council-elder',
        name: 'Council / Elder',
        symbol: '⚖️',
        description: 'Leaders, chiefs, lawmakers, union heads',
      },
      {
        id: 'guardian',
        name: 'Guardian Voice',
        symbol: '🛡️',
        description: 'Safety responders, medics, warriors',
      },
      {
        id: 'creator',
        name: 'Creator Voice',
        symbol: '🎙️',
        description: 'Artists, poets, griots, comedians',
      },
    ],
    
    // Post types
    postTypes: [
      {
        id: 'voice-burst',
        name: 'Voice Burst',
        duration: 90,
        icon: '🗣️',
        description: '90-second audio with optional image',
      },
      {
        id: 'thread-chain',
        name: 'Thread Chain',
        maxPosts: 10,
        icon: '🧵',
        description: 'Multi-post thread with voice + text + media',
      },
      {
        id: 'image-caption',
        name: 'Image + Caption',
        icon: '🖼️',
        description: 'Visual tweet with purpose tag',
      },
      {
        id: 'live-room',
        name: 'Live Micro-Room',
        maxSpeakers: 50,
        maxListeners: 500,
        icon: '🔴',
        description: 'Voice conversation with live translation',
      },
      {
        id: 'echo-snapshot',
        name: 'Echo Snapshot',
        duration: 30,
        icon: '📸',
        description: 'Auto-curated highlight clip',
      },
      {
        id: 'proverb',
        name: 'Proverb / Quote Drop',
        icon: '📜',
        description: 'Elder wisdom or correction',
      },
    ],
    
    // Feed scopes
    feedScopes: [
      {
        id: 'local-drum',
        name: 'Local Drum',
        radius: '0-10km',
        icon: '📍',
        description: 'Immediate neighborhood',
      },
      {
        id: 'regional-stream',
        name: 'Regional Stream',
        scope: 'Province/State',
        icon: '🗺️',
        description: 'Province or state level',
      },
      {
        id: 'national-beat',
        name: 'National Beat',
        scope: 'Country',
        icon: '🌍',
        description: 'Country-wide voices',
      },
      {
        id: 'pan-african',
        name: 'Pan-African Current',
        scope: 'Continental',
        icon: '🌐',
        description: 'Continental reach',
      },
    ],
    
    // Tone badges
    toneBadges: [
      { id: 'alert', name: 'Alert', icon: '⚠️', color: '#dc2626' },
      { id: 'banter', name: 'Banter', icon: '😄', color: '#eab308' },
      { id: 'joy', name: 'Joy', icon: '🎉', color: '#10b981' },
      { id: 'call', name: 'Call', icon: '📢', color: '#f97316' },
      { id: 'proof', name: 'Proof', icon: '✓', color: '#3b82f6' },
      { id: 'wisdom', name: 'Wisdom', icon: '🧠', color: '#8b5cf6' },
    ],
  },
  
  'family-root': {
    id: 'family-root' as const,
    name: 'Family Root Feed',
    nativeName: 'ÌDÍLẸ / ÒRÍLẸ̀ / UBUNTU ROOT',
    englishName: 'The House of Our People',
    icon: '🏠',
    color: '#10b981', // Emerald
    description: 'Family, clan, hometown, tribe, diaspora connections',
    
    // House types
    houses: [
      {
        id: 'blood',
        name: 'Blood House',
        icon: '👨‍👩‍👧‍👦',
        color: '#dc2626',
        description: 'Extended family tree',
      },
      {
        id: 'hometown',
        name: 'Hometown House',
        icon: '🏘️',
        color: '#10b981',
        description: 'Town, village, state, province origin',
      },
      {
        id: 'tribe',
        name: 'Tribe / Nation House',
        icon: '🌍',
        color: '#f59e0b',
        description: 'Ethnic nation (Yoruba, Igbo, Zulu, etc.)',
      },
      {
        id: 'diaspora',
        name: 'Diaspora House',
        icon: '✈️',
        color: '#3b82f6',
        description: 'Same people scattered globally',
      },
      {
        id: 'age-grade',
        name: 'Age Grade / Cohort House',
        icon: '🎓',
        color: '#8b5cf6',
        description: 'Same initiation year or school set',
      },
    ],
    
    // Post types
    postTypes: [
      {
        id: 'announcement',
        name: 'Clan Announcement',
        icon: '📢',
        description: 'Naming, burial, wedding, etc.',
      },
      {
        id: 'contribution',
        name: 'Contribution Board',
        icon: '💰',
        description: 'Ajo/Esusu/Stokvel tracking',
      },
      {
        id: 'heritage',
        name: 'Heritage Drop',
        icon: '📜',
        description: 'Stories, photos, praise songs',
      },
      {
        id: 'call-for-hands',
        name: 'Call for Hands',
        icon: '🙋',
        description: 'Practical help requests',
      },
      {
        id: 'quiet-cry',
        name: 'Quiet Cry',
        icon: '🔒',
        description: 'Private need (elders only)',
      },
      {
        id: 'ceremony',
        name: 'Ceremony Record',
        icon: '🎊',
        description: 'Life events documentation',
      },
      {
        id: 'blessing',
        name: 'Blessing Chain',
        icon: '🪔',
        description: 'Elder prayers and charges',
      },
    ],
    
    // Privacy modes
    privacyModes: [
      {
        id: 'true-face',
        name: 'True Face',
        icon: '👤',
        description: 'Full identity visible',
      },
      {
        id: 'masked-cousin',
        name: 'Masked Cousin',
        icon: '🎭',
        description: 'Partial identity (council knows)',
      },
      {
        id: 'ghost-seat',
        name: 'Ghost Seat',
        icon: '👻',
        description: 'Observer only (hidden)',
      },
    ],
    
    // Cowrie flows
    cowrieFlows: [
      {
        id: 'clan-purse',
        name: 'Clan Purse',
        icon: '💰',
        description: 'Shared wallet for obligations',
      },
      {
        id: 'pledge-stone',
        name: 'Pledge Stone',
        icon: '🪨',
        description: 'Public commitment tracking',
      },
      {
        id: 'diaspora-wire',
        name: 'Diaspora Wire',
        icon: '💸',
        description: 'International transfers',
      },
      {
        id: 'bride-support',
        name: 'Bride/Groom Circle Support',
        icon: '💍',
        description: 'Wedding contributions',
      },
    ],
  },
} as const;

/**
 * Get feed configuration
 */
export const getFeed = (type: FeedType) => {
  return FEEDS[type];
};

/**
 * Get feed color
 */
export const getFeedColor = (type: FeedType): string => {
  return FEEDS[type]?.color || '#6b7280';
};

/**
 * Get feed icon
 */
export const getFeedIcon = (type: FeedType): string => {
  return FEEDS[type]?.icon || '📱';
};