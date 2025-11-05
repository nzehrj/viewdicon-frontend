import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronRight, TrendingUp, Users, Calendar } from 'lucide-react';
import { useAppSelector } from '@store/hooks';

export const CommunitySection: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const userVillage = useAppSelector((state) => state.user.village);

  // Mock data - TODO: Get from API
  const communityStats = {
    totalMembers: 248,
    activeToday: 89,
    upcomingEvents: 3,
  };

  const recentActivity = [
    { id: '1', title: 'Monthly Village Meeting', time: 'Tomorrow at 3:00 PM', icon: Calendar },
    { id: '2', title: 'New members joined this week', count: 12, icon: Users },
    { id: '3', title: 'Trending discussions', count: 5, icon: TrendingUp },
  ];

  return (
    <div className={`rounded-2xl p-6 ${
      theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Community
            </h2>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {userVillage?.villageName || 'Your Village'}
            </p>
          </div>
        </div>
        
        <button 
          className={`text-sm font-semibold ${
            theme === 'dark' ? 'text-pink-400' : 'text-pink-600'
          } hover:underline flex items-center gap-1`}
        >
          Explore
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className={`p-3 rounded-xl text-center ${
          theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
        }`}>
          <p className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {communityStats.totalMembers}
          </p>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Members
          </p>
        </div>

        <div className={`p-3 rounded-xl text-center ${
          theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
        }`}>
          <p className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-green-400' : 'text-green-600'
          }`}>
            {communityStats.activeToday}
          </p>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Active
          </p>
        </div>

        <div className={`p-3 rounded-xl text-center ${
          theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
        }`}>
          <p className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {communityStats.upcomingEvents}
          </p>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Events
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-2">
        {recentActivity.map((activity) => {
          const Icon = activity.icon;
          
          return (
            <motion.div
              key={activity.id}
              whileHover={{ scale: 1.01 }}
              className={`p-3 rounded-xl cursor-pointer transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-900/50 hover:bg-gray-900' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  theme === 'dark' ? 'bg-pink-900/30' : 'bg-pink-100'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-pink-400' : 'text-pink-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {activity.title}
                  </p>
                  {'time' in activity && (
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {activity.time}
                    </p>
                  )}
                  {'count' in activity && (
                    <p className={`text-xs font-semibold ${
                      theme === 'dark' ? 'text-pink-400' : 'text-pink-600'
                    }`}>
                      {activity.count} new
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CommunitySection;