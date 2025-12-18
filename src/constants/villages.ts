// src/constants/villages.ts
// 17 Professional Villages Configuration

export type VillageId = 
  | 'agriculture'
  | 'business'
  | 'construction'
  | 'crafts'
  | 'creative'
  | 'education'
  | 'finance'
  | 'governance'
  | 'government'
  | 'healthcare'
  | 'getting_started'
  | 'hospitality'
  | 'media'
  | 'security'
  | 'spiritual'
  | 'technology'
  | 'transport';

export const VILLAGES = {
  agriculture: {
    id: 'agriculture',
    name: 'Agriculture Village',
    nativeName: 'Ìlú Àgbẹ̀',
    icon: '🌾',
    color: '#65a30d',
    description: 'Farming, food production, livestock',
  },
  
  business: {
    id: 'business',
    name: 'Business Village',
    nativeName: 'Ìlú Oníṣòwò',
    icon: '💼',
    color: '#0891b2',
    description: 'Commerce, trade, entrepreneurship',
  },
  
  construction: {
    id: 'construction',
    name: 'Construction Village',
    nativeName: 'Ìlú Ọ̀nà',
    icon: '🏗️',
    color: '#dc2626',
    description: 'Building, repair, infrastructure',
  },
  
  crafts: {
    id: 'crafts',
    name: 'Crafts Village',
    nativeName: 'Ìlú Oníṣẹ́-ọwọ́',
    icon: '🛠️',
    color: '#f97316',
    description: 'Skilled trades, handcraft, artisan work',
  },
  
  creative: {
    id: 'creative',
    name: 'Creative Village',
    nativeName: 'Ìlú Akéwì',
    icon: '🎨',
    color: '#ec4899',
    description: 'Arts, entertainment, performance',
  },
  
  education: {
    id: 'education',
    name: 'Education Village',
    nativeName: 'Ìlú Ọmọ́wé',
    icon: '📚',
    color: '#3b82f6',
    description: 'Teaching, training, knowledge sharing',
  },
  
  finance: {
    id: 'finance',
    name: 'Finance Village',
    nativeName: 'Ìlú Owó',
    icon: '💰',
    color: '#eab308',
    description: 'Banking, investment, financial services',
  },
  
  governance: {
    id: 'governance',
    name: 'Governance Village',
    nativeName: 'Ìlú Aláṣẹ',
    icon: '⚖️',
    color: '#8b5cf6',
    description: 'Leadership, law, policy, civic service',
  },
  
  government: {
    id: 'government',
    name: 'Government Village',
    nativeName: 'Ìlú Ìjọba',
    icon: '🏛️',
    color: '#6366f1',
    description: 'Public service, administration',
  },
  
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare Village',
    nativeName: 'Ìlú Aláwòsàn',
    icon: '⚕️',
    color: '#10b981',
    description: 'Medical services, wellness, healing',
  },
  
  getting_started: {
    id: 'getting_started',
    name: 'Getting Started',
    nativeName: 'Ìbẹ̀rẹ̀',
    icon: '🌱',
    color: '#84cc16',
    description: 'New users, onboarding',
  },
  
  hospitality: {
    id: 'hospitality',
    name: 'Hospitality Village',
    nativeName: 'Ìlú Àlejò',
    icon: '🍽️',
    color: '#f59e0b',
    description: 'Food service, tourism, events',
  },
  
  media: {
    id: 'media',
    name: 'Media Village',
    nativeName: 'Ìlú Ọ̀rọ̀',
    icon: '📡',
    color: '#06b6d4',
    description: 'Journalism, broadcasting, content',
  },
  
  security: {
    id: 'security',
    name: 'Security Village',
    nativeName: 'Ìlú Jagunjagun',
    icon: '🛡️',
    color: '#dc2626',
    description: 'Protection, safety services',
  },
  
  spiritual: {
    id: 'spiritual',
    name: 'Spiritual Village',
    nativeName: 'Ìlú Àwọn Amọ́nà',
    icon: '🕯️',
    color: '#a855f7',
    description: 'Faith, spirituality, guidance',
  },
  
  technology: {
    id: 'technology',
    name: 'Technology Village',
    nativeName: 'Ìlú Ìmúpadàbọ̀sípò',
    icon: '💻',
    color: '#8b5cf6',
    description: 'Tech, innovation, software',
  },
  
  transport: {
    id: 'transport',
    name: 'Transport Village',
    nativeName: 'Ìlú Ọ̀kọ̀',
    icon: '🚗',
    color: '#14b8a6',
    description: 'Transportation, logistics, delivery',
  },
};

export const getVillage = (id: VillageId) => {
  return VILLAGES[id];
};

export const getVillageColor = (id: VillageId): string => {
  return VILLAGES[id]?.color || '#6b7280';
};

export const getVillageIcon = (id: VillageId): string => {
  return VILLAGES[id]?.icon || '🏘️';
};

export const ALL_VILLAGE_IDS: VillageId[] = Object.keys(VILLAGES) as VillageId[];