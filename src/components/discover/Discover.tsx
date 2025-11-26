import React, { useState } from 'react';
import { Search, MapPin, Zap, Award, SlidersHorizontal } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import { ProfessionalCard } from './ProfessionalCard';
import { DiscoverFilters, FilterState } from './DiscoverFilters';

// Type definitions
interface Village {
  villageId: string;
  villageName: string;
  primaryColor: string;
  roles?: Role[];
}

interface Role {
  roleId: string;
  roleName: string;
  roleIcon?: string;
}

interface Professional {
  id: string;
  name: string;
  role: string;
  roleId: string;
  village: string;
  villageId: string;
  villageColor: string;
  crestTier: number;
  honorStage: string;
  shieldState: 'green' | 'amber' | 'red';
  offerLine: string;
  priceHint?: string;
  distance?: number;
  isOnline: boolean;
  canBookNow: boolean;
  rating?: number;
  completedJobs?: number;
}

type DiscoverMode = 'nearby' | 'urgent' | 'trusted';

/**
 * DISCOVER PAGE COMPONENT
 * 
 * The national marketplace where users find professionals across all 17 villages.
 * 
 * Features:
 * - Village selector (17 villages)
 * - Guild/role filters
 * - Search by proximity, urgency, trust
 * - Result cards with "Request Work" CTA
 * 
 * TODO - Redux Integration:
 * Replace the mock villages array with:
 * const villages = useAppSelector((state) => state.yourVillageSlice.villages);
 * 
 * Or fetch from API:
 * useEffect(() => { dispatch(fetchVillages()); }, []);
 * 
 * Location: src/pages/Discover.tsx or src/components/discover/DiscoverPage.tsx
 */

interface DiscoverProps {
  onRequestWork?: (professional: Professional) => void;
}

export const Discover: React.FC<DiscoverProps> = ({ onRequestWork }) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  // TODO: Replace with actual Redux selector when villages are in state
  // For now, using mock data structure that matches your villages config
  const villages: Village[] = [
    { villageId: 'agriculture', villageName: 'Agriculture Village', primaryColor: '#10b981', roles: [] },
    { villageId: 'business', villageName: 'Business Village', primaryColor: '#f59e0b', roles: [] },
    { villageId: 'construction', villageName: 'Construction Village', primaryColor: '#3b82f6', roles: [] },
    { villageId: 'crafts', villageName: 'Crafts Village', primaryColor: '#8b5cf6', roles: [] },
    { villageId: 'creative', villageName: 'Creative Village', primaryColor: '#ec4899', roles: [] },
    { villageId: 'education', villageName: 'Education Village', primaryColor: '#14b8a6', roles: [] },
    { villageId: 'finance', villageName: 'Finance Village', primaryColor: '#eab308', roles: [] },
    { villageId: 'governance', villageName: 'Governance Village', primaryColor: '#dc2626', roles: [] },
    { villageId: 'government', villageName: 'Government Village', primaryColor: '#b91c1c', roles: [] },
    { villageId: 'healthcare', villageName: 'Healthcare Village', primaryColor: '#06b6d4', roles: [] },
    { villageId: 'hospitality', villageName: 'Hospitality Village', primaryColor: '#f97316', roles: [] },
    { villageId: 'media', villageName: 'Media Village', primaryColor: '#a855f7', roles: [] },
    { villageId: 'security', villageName: 'Security Village', primaryColor: '#ef4444', roles: [] },
    { villageId: 'spiritual', villageName: 'Spiritual Village', primaryColor: '#6366f1', roles: [] },
    { villageId: 'technology', villageName: 'Technology Village', primaryColor: '#0ea5e9', roles: [] },
    { villageId: 'transport', villageName: 'Transport Village', primaryColor: '#22c55e', roles: [] },
    { villageId: 'getting_started', villageName: 'Getting Started', primaryColor: '#6b7280', roles: [] },
  ];
  
  const [selectedVillageId, setSelectedVillageId] = useState<string>('');
  const [selectedGuildId, setSelectedGuildId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [discoverMode, setDiscoverMode] = useState<DiscoverMode>('nearby');
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({});
  
  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
    // TODO: Apply filters to results
  };
  
  // Mock professionals data - TODO: Replace with API call
  const professionals: Professional[] = [
    {
      id: '1',
      name: 'Adebayo Johnson',
      role: 'Electrician',
      roleId: 'electrician',
      village: 'Construction Village',
      villageId: 'construction',
      villageColor: '#10b981',
      crestTier: 4,
      honorStage: 'Master Builder',
      shieldState: 'green',
      offerLine: 'I fix inverters same day in Port Harcourt area',
      priceHint: '₵15,000 - ₵50,000',
      distance: 2.5,
      isOnline: true,
      canBookNow: true,
      rating: 4.8,
      completedJobs: 127,
    },
    {
      id: '2',
      name: 'Chioma Okafor',
      role: 'Midwife',
      roleId: 'midwife',
      village: 'Healthcare Village',
      villageId: 'healthcare',
      villageColor: '#3b82f6',
      crestTier: 5,
      honorStage: 'Hands of Life',
      shieldState: 'green',
      offerLine: 'Safe home delivery, prenatal and postnatal care',
      priceHint: '₵30,000 - ₵80,000',
      distance: 5.1,
      isOnline: true,
      canBookNow: true,
      rating: 4.9,
      completedJobs: 89,
    },
    {
      id: '3',
      name: 'Emeka Nwosu',
      role: 'Solar Technician',
      roleId: 'solar_tech',
      village: 'Technology Village',
      villageId: 'technology',
      villageColor: '#8b5cf6',
      crestTier: 3,
      honorStage: 'Tech Hand',
      shieldState: 'green',
      offerLine: 'Solar panel installation and maintenance for homes',
      priceHint: '₵100,000 - ₵500,000',
      distance: 8.3,
      isOnline: false,
      canBookNow: false,
      rating: 4.6,
      completedJobs: 45,
    },
  ];
  
  // Get guilds for selected village
  const selectedVillage = villages.find((v) => v.villageId === selectedVillageId);
  const guilds = selectedVillage?.roles || [];
  
  // Filter professionals
  const filteredProfessionals = professionals.filter(prof => {
    const matchesVillage = !selectedVillageId || prof.villageId === selectedVillageId;
    const matchesGuild = !selectedGuildId || prof.roleId === selectedGuildId;
    const matchesSearch = !searchQuery || 
      prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.offerLine.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesVillage && matchesGuild && matchesSearch;
  });
  
  // Sort by mode
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    if (discoverMode === 'nearby') {
      return (a.distance || 999) - (b.distance || 999);
    }
    if (discoverMode === 'urgent') {
      if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
      return 0;
    }
    if (discoverMode === 'trusted') {
      return b.crestTier - a.crestTier;
    }
    return 0;
  });
  
  const getModeLabel = (mode: DiscoverMode) => {
    switch (mode) {
      case 'nearby': return 'Nearby';
      case 'urgent': return 'Available Now';
      case 'trusted': return 'Most Trusted';
    }
  };
  
  const getModeIcon = (mode: DiscoverMode) => {
    switch (mode) {
      case 'nearby': return MapPin;
      case 'urgent': return Zap;
      case 'trusted': return Award;
    }
  };
  
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className={`sticky top-0 z-40 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      } border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto p-4 space-y-4">
          {/* Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Discover
              </h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Find professionals across the nation
              </p>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
              } transition-colors`}
            >
              <SlidersHorizontal className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search by name, role, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          
          {/* Village Selector - Horizontal Scroll */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex items-center gap-2 min-w-max">
              <button
                onClick={() => {
                  setSelectedVillageId('');
                  setSelectedGuildId('');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  !selectedVillageId
                    ? theme === 'dark'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-500 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Villages
              </button>
              
              {villages.map((village) => (
                <button
                  key={village.villageId}
                  onClick={() => {
                    setSelectedVillageId(village.villageId);
                    setSelectedGuildId('');
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedVillageId === village.villageId
                      ? 'text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  style={selectedVillageId === village.villageId ? { backgroundColor: village.primaryColor } : {}}
                >
                  {village.villageName}
                </button>
              ))}
            </div>
          </div>
          
          {/* Guild Filter (if village selected) */}
          {selectedVillageId && guilds.length > 0 && (
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex items-center gap-2 min-w-max">
                <button
                  onClick={() => setSelectedGuildId('')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    !selectedGuildId
                      ? theme === 'dark'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-200 text-gray-900'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Roles
                </button>
                
                {guilds.map((guild) => (
                  <button
                    key={guild.roleId}
                    onClick={() => setSelectedGuildId(guild.roleId)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedGuildId === guild.roleId
                        ? theme === 'dark'
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-200 text-gray-900'
                        : theme === 'dark'
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {guild.roleName}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Discovery Mode Tabs */}
          <div className="flex items-center gap-2">
            {(['nearby', 'urgent', 'trusted'] as const).map((mode) => {
              const Icon = getModeIcon(mode);
              const isActive = discoverMode === mode;
              
              return (
                <button
                  key={mode}
                  onClick={() => setDiscoverMode(mode)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {getModeLabel(mode)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Results Count */}
        <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {sortedProfessionals.length} professional{sortedProfessionals.length !== 1 ? 's' : ''} found
        </p>
        
        {/* Results Grid */}
        {sortedProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedProfessionals.map((professional) => (
              <ProfessionalCard
                key={professional.id}
                professional={professional}
                onRequestWork={() => onRequestWork && onRequestWork(professional)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className={`p-12 text-center rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Search className={`w-16 h-16 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <p className={`text-lg font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No professionals found
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
      
      {/* Filters Modal */}
      <DiscoverFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={appliedFilters}
      />
    </div>
  );
};

export default Discover;