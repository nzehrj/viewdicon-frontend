import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Filter,
  Users,
  MapPin,
  Briefcase,
  MessageCircle,
  UserPlus,
  Star,
  ChevronDown,
  X,
  Grid,
  List,
  Shield,
  CheckCircle,
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface KinsfolkDirectoryProps {
  villageId?: string;
  onMemberClick?: (memberId: string) => void;
  onMessageClick?: (memberId: string) => void;
  onConnectClick?: (memberId: string) => void;
}

interface Member {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
  role: string;
  crestLevel: number;
  location: string;
  bio: string;
  rating: number;
  connections: number;
  isOnline: boolean;
  isVerified: boolean;
  joinedAt: string;
  specialties: string[];
}

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'crest' | 'recent' | 'active' | 'rating';

/**
 * KINSFOLK DIRECTORY COMPONENT
 * 
 * Village member directory with search and filters
 * Shows all members of the user's village
 * Mobile-first design with grid/list views
 * 
 * Location: src/components/village/KinsfolkDirectory.tsx
 */
export const KinsfolkDirectory: React.FC<KinsfolkDirectoryProps> = ({
  villageId: _villageId,
  onMemberClick,
  onMessageClick,
  onConnectClick,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const village = useAppSelector((state) => state.user.village);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedCrest, setSelectedCrest] = useState<string>('all');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Mock member data
  const mockMembers: Member[] = [
    {
      id: '1',
      name: 'Chioma Adeyemi',
      handle: '@chioma',
      role: 'Software Engineer',
      crestLevel: 5,
      location: 'Lagos, Nigeria',
      bio: 'Full-stack developer specializing in React and Node.js',
      rating: 4.8,
      connections: 234,
      isOnline: true,
      isVerified: true,
      joinedAt: '2024-01-15',
      specialties: ['React', 'Node.js', 'TypeScript']
    },
    {
      id: '2',
      name: 'Kwame Osei',
      handle: '@kwame',
      role: 'Product Designer',
      crestLevel: 4,
      location: 'Accra, Ghana',
      bio: 'Creating beautiful and intuitive user experiences',
      rating: 4.9,
      connections: 189,
      isOnline: false,
      isVerified: true,
      joinedAt: '2024-02-20',
      specialties: ['UI/UX', 'Figma', 'Design Systems']
    },
    {
      id: '3',
      name: 'Amara Nwosu',
      handle: '@amara',
      role: 'Data Scientist',
      crestLevel: 6,
      location: 'Abuja, Nigeria',
      bio: 'AI/ML enthusiast working on predictive analytics',
      rating: 5.0,
      connections: 312,
      isOnline: true,
      isVerified: true,
      joinedAt: '2023-11-10',
      specialties: ['Python', 'Machine Learning', 'Data Analysis']
    },
    {
      id: '4',
      name: 'Jabari Mwangi',
      handle: '@jabari',
      role: 'DevOps Engineer',
      crestLevel: 3,
      location: 'Nairobi, Kenya',
      bio: 'Infrastructure automation and cloud architecture',
      rating: 4.7,
      connections: 156,
      isOnline: true,
      isVerified: false,
      joinedAt: '2024-05-01',
      specialties: ['AWS', 'Docker', 'Kubernetes']
    },
    {
      id: '5',
      name: 'Zuri Mensah',
      handle: '@zuri',
      role: 'Marketing Manager',
      crestLevel: 4,
      location: 'Cape Town, South Africa',
      bio: 'Digital marketing and brand strategy specialist',
      rating: 4.6,
      connections: 201,
      isOnline: false,
      isVerified: true,
      joinedAt: '2024-03-12',
      specialties: ['Digital Marketing', 'SEO', 'Content Strategy']
    },
    {
      id: '6',
      name: 'Kofi Asante',
      handle: '@kofi',
      role: 'Backend Developer',
      crestLevel: 5,
      location: 'Lagos, Nigeria',
      bio: 'Building scalable APIs and microservices',
      rating: 4.8,
      connections: 267,
      isOnline: true,
      isVerified: true,
      joinedAt: '2024-01-28',
      specialties: ['Python', 'Django', 'PostgreSQL']
    },
  ];

  // Filter members
  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    const matchesCrest = selectedCrest === 'all' || member.crestLevel.toString() === selectedCrest;
    const matchesOnline = !showOnlineOnly || member.isOnline;
    
    return matchesSearch && matchesRole && matchesCrest && matchesOnline;
  });

  // Sort members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'crest':
        return b.crestLevel - a.crestLevel;
      case 'recent':
        return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'active':
        return (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0);
      default:
        return 0;
    }
  });

  // Get unique roles for filter
  const roles = ['all', ...Array.from(new Set(mockMembers.map(m => m.role)))];

  const getCrestColor = (level: number): string => {
    if (level <= 2) return '#9ca3af';
    if (level <= 4) return '#f59e0b';
    if (level <= 6) return '#eab308';
    if (level <= 8) return '#84cc16';
    return '#10b981';
  };

  return (
    <div className="w-full p-2">
      {/* Header */}
      <div className="mb-4">
        <h2 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Kinsfolk Directory
        </h2>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {sortedMembers.length} members in {village?.villageName || 'your village'}
        </p>
      </div>

      {/* Search and Controls */}
      <div className="space-y-3 mb-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members..."
            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className={`w-full px-4 py-2 rounded-lg border text-sm font-medium appearance-none ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <option value="name">Sort by Name</option>
              <option value="crest">Sort by Crest</option>
              <option value="recent">Recently Joined</option>
              <option value="active">Active Now</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg border ${
              showFilters
                ? 'bg-purple-600 border-purple-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>

          {/* View Toggle */}
          <div className={`flex rounded-lg border ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } rounded-l-lg`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } rounded-r-lg border-l ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              {/* Role Filter */}
              <div className="mb-4">
                <label className={`text-xs font-semibold mb-2 block ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  ROLE
                </label>
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedRole === role
                          ? 'bg-purple-600 text-white'
                          : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {role === 'all' ? 'All Roles' : role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crest Filter */}
              <div className="mb-4">
                <label className={`text-xs font-semibold mb-2 block ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  CREST LEVEL
                </label>
                <div className="flex flex-wrap gap-2">
                  {['all', '3', '4', '5', '6', '7+'].map((crest) => (
                    <button
                      key={crest}
                      onClick={() => setSelectedCrest(crest)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedCrest === crest
                          ? 'bg-purple-600 text-white'
                          : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {crest === 'all' ? 'All Levels' : `Crest ${crest}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Online Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Show online only
                  </span>
                </div>
                <button
                  onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    showOnlineOnly ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full"
                    animate={{
                      x: showOnlineOnly ? 24 : 4,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Members Display */}
      {sortedMembers.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-3'}>
          {sortedMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-xl border cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onMemberClick?.(member.id)}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <Users className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  {member.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-bold text-sm truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {member.name}
                    </p>
                    {member.isVerified && (
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{member.handle}</p>
                </div>

                {/* Crest Badge */}
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-full"
                  style={{ backgroundColor: `${getCrestColor(member.crestLevel)}20` }}
                >
                  <Shield
                    className="w-3 h-3"
                    style={{ color: getCrestColor(member.crestLevel) }}
                  />
                  <span
                    className="text-xs font-bold"
                    style={{ color: getCrestColor(member.crestLevel) }}
                  >
                    {member.crestLevel}
                  </span>
                </div>
              </div>

              {/* Role and Location */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {member.role}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <p className="text-xs text-gray-500 truncate">{member.location}</p>
                </div>
              </div>

              {/* Bio */}
              {viewMode === 'list' && (
                <p className={`text-xs mb-3 line-clamp-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {member.bio}
                </p>
              )}

              {/* Specialties */}
              {viewMode === 'list' && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {member.specialties.slice(0, 3).map((specialty, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded text-xs ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 mb-3 text-xs">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {member.rating}
                  </span>
                </div>
                <div className={`text-gray-500`}>
                  {member.connections} connections
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMessageClick?.(member.id);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Message
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onConnectClick?.(member.id);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Connect
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className={`p-12 rounded-xl text-center ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <Users className={`w-12 h-12 mx-auto mb-3 ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={`text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            No members found
          </p>
          <p className="text-xs text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default KinsfolkDirectory;