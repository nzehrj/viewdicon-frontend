import React from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight, UserPlus } from 'lucide-react';
import { useAppSelector } from '@store/hooks';

export const ConnectionsSection: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);

  // Mock data - TODO: Get from Redux
  const connectionsCount = 47;
  const recentConnections = [
    { id: '1', name: 'Amina Okafor', role: 'Traditional Healer', avatar: '' },
    { id: '2', name: 'Kwame Asante', role: 'Musician', avatar: '' },
    { id: '3', name: 'Zawadi Mwangi', role: 'Software Engineer', avatar: '' },
  ];

  return (
    <div className={`rounded-2xl p-6 ${
      theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Connections
            </h2>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {connectionsCount} connections
            </p>
          </div>
        </div>
        
        <button 
          className={`text-sm font-semibold ${
            theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
          } hover:underline flex items-center gap-1`}
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Recent Connections */}
      <div className="space-y-3 mb-4">
        {recentConnections.map((connection) => (
          <motion.div
            key={connection.id}
            whileHover={{ scale: 1.01 }}
            className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 ${
              theme === 'dark' 
                ? 'bg-gray-900/50 hover:bg-gray-900' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
              {connection.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm truncate ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {connection.name}
              </p>
              <p className={`text-xs truncate ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {connection.role}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Find More Button */}
      <button className={`
        w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2
        transition-colors
        ${theme === 'dark'
          ? 'bg-purple-600 hover:bg-purple-700 text-white'
          : 'bg-purple-600 hover:bg-purple-700 text-white'
        }
      `}>
        <UserPlus className="w-4 h-4" />
        Find More Connections
      </button>
    </div>
  );
};

export default ConnectionsSection;