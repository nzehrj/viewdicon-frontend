import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Lock, 
  Globe, 
  Crown,
  MapPin,
  ChevronRight,
  Search
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface Room {
  id: string;
  name: string;
  type: 'public' | 'sacred' | 'age_grade' | 'clan';
  description: string;
  memberCount: number;
  activeNow: number;
  requiresCrest?: number;
  requiresHonorStage?: string;
  requiresApproval?: boolean;
  allowsTranslation?: boolean;
  icon?: string;
  color?: string;
  category?: string;
}

/**
 * ROOMS COMPONENT
 * 
 * Displays different types of conversation spaces:
 * 1. Public Rooms - Open to all (Wrestling Ground, Marketplace Shout, etc.)
 * 2. Sacred Groves - Invite/request only, encrypted
 * 3. Age-Grade Huts - Based on Honor Stage (Birth, Initiation, Warrior, Elder)
 * 4. Clan/Language Rooms - Tribal/cultural spaces (Igbo Court, Zulu Kraal, etc.)
 * 
 * Location: src/components/circle/Rooms.tsx
 */
export const Rooms: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'public' | 'sacred' | 'age_grade' | 'clan'>('all');
  
  // Mock rooms data - TODO: Replace with API call
  const rooms: Room[] = [
    // Public Rooms
    {
      id: '1',
      name: 'Wrestling Ground',
      type: 'public',
      description: 'Debate, challenge ideas, test arguments. Keep it respectful.',
      memberCount: 2847,
      activeNow: 134,
      category: 'Debate',
      icon: '🤼',
      color: '#ef4444',
    },
    {
      id: '2',
      name: 'Marketplace Shout',
      type: 'public',
      description: 'Quick deals, urgent sales, limited offers. Fast talk only.',
      memberCount: 5621,
      activeNow: 289,
      category: 'Commerce',
      icon: '📢',
      color: '#f59e0b',
    },
    {
      id: '3',
      name: 'Moonlight Tales',
      type: 'public',
      description: 'Stories, wisdom, folklore from the old ones. Evening gathering.',
      memberCount: 1234,
      activeNow: 67,
      category: 'Culture',
      icon: '🌙',
      color: '#8b5cf6',
    },
    
    // Sacred Groves
    {
      id: '4',
      name: 'Healing Sanctuary',
      type: 'sacred',
      description: 'Private counseling, trauma support, crisis intervention.',
      memberCount: 456,
      activeNow: 23,
      requiresApproval: true,
      requiresCrest: 3,
      category: 'Support',
      icon: '🕊️',
      color: '#10b981',
    },
    {
      id: '5',
      name: 'Builders Council',
      type: 'sacred',
      description: 'High-level construction planning, contracts, disputes.',
      memberCount: 178,
      activeNow: 12,
      requiresApproval: true,
      requiresCrest: 4,
      category: 'Professional',
      icon: '🏗️',
      color: '#3b82f6',
    },
    
    // Age-Grade Huts
    {
      id: '6',
      name: 'Youth Circle',
      type: 'age_grade',
      description: 'For newcomers and apprentices. Learn from each other.',
      memberCount: 3421,
      activeNow: 156,
      requiresHonorStage: 'Newcomer',
      category: 'Learning',
      icon: '🌱',
      color: '#22c55e',
    },
    {
      id: '7',
      name: 'Warrior Lodge',
      type: 'age_grade',
      description: 'Active workers building reputation. Share victories.',
      memberCount: 1876,
      activeNow: 89,
      requiresHonorStage: 'Warrior',
      category: 'Achievement',
      icon: '⚔️',
      color: '#dc2626',
    },
    {
      id: '8',
      name: 'Elder Council Chamber',
      type: 'age_grade',
      description: 'Seasoned professionals. Guide the next generation.',
      memberCount: 234,
      activeNow: 34,
      requiresHonorStage: 'Elder',
      requiresCrest: 5,
      category: 'Leadership',
      icon: '👴',
      color: '#a855f7',
    },
    
    // Clan/Language Rooms
    {
      id: '9',
      name: 'Igbo Court',
      type: 'clan',
      description: 'Ndi Igbo kwenu! Speak in our tongue, share our heritage.',
      memberCount: 4562,
      activeNow: 234,
      allowsTranslation: false,
      category: 'Heritage',
      icon: '🦅',
      color: '#16a34a',
    },
    {
      id: '10',
      name: 'Zulu Kraal',
      type: 'clan',
      description: 'AmAzulu! Warriors and builders of the south.',
      memberCount: 2341,
      activeNow: 145,
      allowsTranslation: true,
      category: 'Heritage',
      icon: '🛡️',
      color: '#b91c1c',
    },
    {
      id: '11',
      name: 'Yoruba Palace',
      type: 'clan',
      description: 'Omo Yoruba! Ancient wisdom, modern solutions.',
      memberCount: 5879,
      activeNow: 312,
      allowsTranslation: false,
      category: 'Heritage',
      icon: '👑',
      color: '#ca8a04',
    },
  ];
  
  const categories = ['all', 'public', 'sacred', 'age_grade', 'clan'] as const;
  
  const getCategoryLabel = (cat: typeof categories[number]) => {
    switch (cat) {
      case 'all': return 'All Rooms';
      case 'public': return 'Public';
      case 'sacred': return 'Sacred Groves';
      case 'age_grade': return 'Age Grades';
      case 'clan': return 'Clan & Language';
    }
  };
  
  const getRoomTypeIcon = (type: Room['type']) => {
    switch (type) {
      case 'public': return Globe;
      case 'sacred': return Lock;
      case 'age_grade': return Crown;
      case 'clan': return MapPin;
    }
  };
  
  const filteredRooms = rooms.filter(room => {
    const matchesCategory = selectedCategory === 'all' || room.type === selectedCategory;
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const canEnterRoom = (room: Room): { canEnter: boolean; reason?: string } => {
    // Check crest requirement
    if (room.requiresCrest && room.requiresCrest > 3) {
      return { canEnter: false, reason: `Requires ${room.requiresCrest}⭐ trust level` };
    }
    
    // Check approval requirement
    if (room.requiresApproval) {
      return { canEnter: false, reason: 'Request access required' };
    }
    
    // Check honor stage
    if (room.requiresHonorStage && room.requiresHonorStage !== 'Newcomer') {
      return { canEnter: false, reason: `Requires ${room.requiresHonorStage} stage` };
    }
    
    return { canEnter: true };
  };
  
  const handleRoomClick = (room: Room) => {
    const access = canEnterRoom(room);
    
    if (!access.canEnter) {
      alert(access.reason); // TODO: Replace with proper modal
      return;
    }
    
    // TODO: Navigate to room or open room modal
    console.log('Entering room:', room.name);
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Rooms & Huts
        </h1>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Conversation spaces for different purposes and communities
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`} />
        <input
          type="text"
          placeholder="Search rooms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          } focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
      </div>
      
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? theme === 'dark'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-500 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>
      
      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => {
          const TypeIcon = getRoomTypeIcon(room.type);
          const access = canEnterRoom(room);
          
          return (
            <motion.button
              key={room.id}
              onClick={() => handleRoomClick(room)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl text-left transition-all border-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Room Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{room.icon}</span>
                  <TypeIcon className="w-4 h-4" style={{ color: room.color }} />
                </div>
                
                {!access.canEnter && (
                  <Lock className="w-4 h-4 text-red-500" />
                )}
              </div>
              
              {/* Room Name */}
              <h3 className={`font-bold text-base mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {room.name}
              </h3>
              
              {/* Category Badge */}
              {room.category && (
                <span 
                  className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-2"
                  style={{ backgroundColor: `${room.color}20`, color: room.color }}
                >
                  {room.category}
                </span>
              )}
              
              {/* Description */}
              <p className={`text-xs mb-3 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {room.description}
              </p>
              
              {/* Room Stats */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-gray-500" />
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {room.memberCount > 1000 
                        ? `${(room.memberCount / 1000).toFixed(1)}k` 
                        : room.memberCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {room.activeNow} online
                    </span>
                  </div>
                </div>
                
                {access.canEnter ? (
                  <ChevronRight className="w-4 h-4" style={{ color: room.color }} />
                ) : (
                  <span className="text-red-500 text-[10px]">
                    {access.reason}
                  </span>
                )}
              </div>
              
              {/* Requirements */}
              {(room.requiresCrest || room.requiresHonorStage || room.allowsTranslation === false) && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 flex-wrap">
                  {room.requiresCrest && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500">
                      {room.requiresCrest}⭐ Required
                    </span>
                  )}
                  {room.requiresHonorStage && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-500">
                      {room.requiresHonorStage} Stage
                    </span>
                  )}
                  {room.allowsTranslation === false && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-500">
                      No Translation
                    </span>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <div className={`p-12 text-center rounded-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Users className={`w-16 h-16 mx-auto mb-4 ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={`text-lg font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            No rooms found
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Try adjusting your search or category filter
          </p>
        </div>
      )}
    </div>
  );
};

export default Rooms;