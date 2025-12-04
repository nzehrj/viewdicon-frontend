import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  MessageCircle,
  Phone,
  Video,
  MoreVertical,
  UserPlus,
  Briefcase,
  Calendar
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface Connection {
  id: string;
  name: string;
  role: string;
  village: string;
  villageColor: string;
  crestTier: number;
  relationshipType: 'friend' | 'business' | 'mentor';
  lastContact: Date;
  sessionsCompleted: number;
  mutualConnections: number;
  avatar?: string;
}

/**
 * MY CIRCLE COMPONENT - MOBILE FRIENDLY
 * 
 * Shows people you have mutual access with after Business Sessions.
 * 
 * Mobile Optimizations:
 * - Responsive padding and text sizes
 * - Touch-optimized buttons (min 44px)
 * - Horizontal scrollable filters
 * - Flexible card layouts
 * - Larger tap targets
 * - Truncated text handling
 * 
 * Location: src/components/circle/MyCircle.tsx
 */
export const MyCircle: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'friend' | 'business' | 'mentor'>('all');
  
  // Mock connections data - TODO: Replace with API call
  const connections: Connection[] = [
    {
      id: '1',
      name: 'Adebayo Johnson',
      role: 'Electrician',
      village: 'Construction Village',
      villageColor: '#10b981',
      crestTier: 4,
      relationshipType: 'business',
      lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      sessionsCompleted: 12,
      mutualConnections: 8,
    },
    {
      id: '2',
      name: 'Chioma Okafor',
      role: 'Midwife',
      village: 'Healthcare Village',
      villageColor: '#3b82f6',
      crestTier: 5,
      relationshipType: 'friend',
      lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      sessionsCompleted: 3,
      mutualConnections: 15,
    },
    {
      id: '3',
      name: 'Emeka Nwosu',
      role: 'Solar Technician',
      village: 'Technology Village',
      villageColor: '#8b5cf6',
      crestTier: 3,
      relationshipType: 'mentor',
      lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      sessionsCompleted: 7,
      mutualConnections: 4,
    },
    {
      id: '4',
      name: 'Fatima Ahmed',
      role: 'Fashion Designer',
      village: 'Crafts Village',
      villageColor: '#f59e0b',
      crestTier: 4,
      relationshipType: 'business',
      lastContact: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      sessionsCompleted: 5,
      mutualConnections: 6,
    },
  ];
  
  const getRelationshipLabel = (type: Connection['relationshipType']) => {
    switch (type) {
      case 'friend': return 'Friend (Standing Beside)';
      case 'business': return 'Business Partner';
      case 'mentor': return 'Mentor/Guide';
    }
  };
  
  const getRelationshipColor = (type: Connection['relationshipType']) => {
    switch (type) {
      case 'friend': return '#8b5cf6';
      case 'business': return '#3b82f6';
      case 'mentor': return '#f59e0b';
    }
  };
  
  const formatLastContact = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };
  
  const filteredConnections = connections.filter(conn => {
    const matchesFilter = filterType === 'all' || conn.relationshipType === filterType;
    const matchesSearch = conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conn.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conn.village.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  return (
    <div className="p-1 sm:p-4 space-y-4 sm:space-y-6">
      {/* Header - Mobile Responsive */}
      <div>
        <h1 className={`text-xl sm:text-2xl font-bold mb-1 sm:mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          My Circle
        </h1>
        <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          People you've built trust with through completed work
        </p>
      </div>
      
      {/* Stats Bar - Mobile Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <p className={`text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {connections.length}
          </p>
          <p className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Connections
          </p>
        </div>
        <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <p className={`text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {connections.reduce((sum, c) => sum + c.sessionsCompleted, 0)}
          </p>
          <p className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Sessions Done
          </p>
        </div>
        <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <p className={`text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {connections.filter(c => c.crestTier >= 4).length}
          </p>
          <p className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            High Trust
          </p>
        </div>
      </div>
      
      {/* Search Bar - Mobile Responsive */}
      <div className="relative">
        <Search className={`absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`} />
        <input
          type="text"
          placeholder="Search connections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border text-sm sm:text-base ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          } focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
      </div>
      
      {/* Filter Tabs - Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto hide-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 min-w-max">
          {(['all', 'friend', 'business', 'mentor'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterType(filter)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                filterType === filter
                  ? theme === 'dark'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter === 'all' ? 'All' : getRelationshipLabel(filter).split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
      
      {/* Connections List - Mobile Optimized */}
      <div className="space-y-3">
        {filteredConnections.map((connection) => (
          <motion.div
            key={connection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 sm:p-4 rounded-xl border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start gap-2.5 sm:gap-4">
              {/* Avatar - Smaller on Mobile */}
              <div 
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-white text-sm sm:text-lg shrink-0"
                style={{ backgroundColor: connection.villageColor }}
              >
                {connection.name.charAt(0)}
              </div>
              
              {/* Info - Flexible Layout */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1.5 sm:mb-2 gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                      <h3 className={`font-bold text-sm sm:text-base truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {connection.name}
                      </h3>
                      <span className="text-[10px] sm:text-xs shrink-0">
                        {'⭐'.repeat(connection.crestTier)}
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {connection.role} • {connection.village}
                    </p>
                  </div>
                  
                  <button className={`p-1 sm:p-1.5 rounded-lg shrink-0 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    <MoreVertical className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
                </div>
                
                {/* Relationship Badge */}
                <span 
                  className="inline-block px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium mb-2 sm:mb-3"
                  style={{ 
                    backgroundColor: `${getRelationshipColor(connection.relationshipType)}20`,
                    color: getRelationshipColor(connection.relationshipType)
                  }}
                >
                  {getRelationshipLabel(connection.relationshipType)}
                </span>
                
                {/* Stats - Responsive Wrap */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2 sm:mb-3 text-[10px] sm:text-xs">
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {connection.sessionsCompleted} sessions
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {connection.mutualConnections} mutual
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {formatLastContact(connection.lastContact)}
                    </span>
                  </div>
                </div>
                
                {/* Actions - Mobile Optimized */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button 
                    className="flex-1 px-2.5 sm:px-3 py-2 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-colors"
                    style={{ 
                      backgroundColor: `${connection.villageColor}20`,
                      color: connection.villageColor
                    }}
                  >
                    <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Message</span>
                    <span className="xs:hidden">Chat</span>
                  </button>
                  <button className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors`}>
                    <Phone className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                  </button>
                  <button className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors`}>
                    <Video className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Empty State - Mobile Responsive */}
      {filteredConnections.length === 0 && (
        <div className={`p-8 sm:p-12 text-center rounded-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Users className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={`text-base sm:text-lg font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            No connections yet
          </p>
          <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Complete work sessions and keep connections to build your circle
          </p>
          <button className="px-3 sm:px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium flex items-center gap-2 mx-auto transition-colors">
            <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Find People in Discover
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCircle;