import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Heart,
  Sprout,
  HardHat,
  TrendingUp,
  Palette,
  GraduationCap,
  Flag,
  Truck,
  Code,
  Utensils,
  Coins,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@utils/cn';
import { useAppSelector } from '@store/hooks';

const villages = [
  { id: 'healers', name: 'Healers', icon: Heart, color: '#10b981', emoji: '🏥' },
  { id: 'farmers', name: 'Harvesters', icon: Sprout, color: '#f59e0b', emoji: '🌾' },
  { id: 'builders', name: 'Builders', icon: HardHat, color: '#3b82f6', emoji: '🏗️' },
  { id: 'traders', name: 'Traders', icon: TrendingUp, color: '#8b5cf6', emoji: '🛒' },
  { id: 'artists', name: 'Creatives', icon: Palette, color: '#ec4899', emoji: '🎨' },
  { id: 'teachers', name: 'Scholars', icon: GraduationCap, color: '#06b6d4', emoji: '📚' },
  { id: 'civic', name: 'Leaders', icon: Flag, color: '#f97316', emoji: '🏛️' },
  { id: 'transport', name: 'Movers', icon: Truck, color: '#eab308', emoji: '🚚' },
  { id: 'tech', name: 'Innovators', icon: Code, color: '#6366f1', emoji: '💻' },
  { id: 'hospitality', name: 'Hosts', icon: Utensils, color: '#14b8a6', emoji: '🍽️' },
  { id: 'finance', name: 'Wealth Keepers', icon: Coins, color: '#a855f7', emoji: '💰' },
  { id: 'environment', name: 'Earth Stewards', icon: Leaf, color: '#22c55e', emoji: '🌳' },
];

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);
  const selectedVillageId = localStorage.getItem('selected_village');

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={cn(
        'relative border-r transition-all duration-300',
        theme === 'dark'
          ? 'bg-gray-900/95 backdrop-blur-xl border-gray-800'
          : 'bg-white/95 backdrop-blur-xl border-gray-200 shadow-xl'
      )}
    >
      {/* African Pattern Decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="h-full w-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Logo & Toggle */}
      <div className="relative z-10 h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-amber-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">
                Viewdicon
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'p-2 rounded-lg transition-colors',
            theme === 'dark'
              ? 'hover:bg-gray-800 text-gray-400'
              : 'hover:bg-gray-100 text-gray-600'
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
        {/* Dashboard Home */}
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-3 rounded-xl transition-all group',
              isActive
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            )
          }
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-semibold"
              >
                Dashboard
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>

        {/* Villages Section */}
        <div className="pt-6">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 mb-3"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Villages
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            {villages.map((village) => {
              const Icon = village.icon;
              const isUserVillage = village.id === selectedVillageId;
              
              return (
                <NavLink
                  key={village.id}
                  to={`/dashboard/village/${village.id}`}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative',
                      isActive
                        ? theme === 'dark'
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-900'
                        : theme === 'dark'
                        ? 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )
                  }
                >
                  {isUserVillage && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-green-500 to-amber-500 rounded-r"></div>
                  )}
                  
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {isCollapsed ? (
                      <div className="text-2xl">{village.emoji}</div>
                    ) : (
                      <>
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${village.color}20` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: village.color }} />
                        </div>
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-sm font-medium truncate"
                        >
                          {village.name}
                        </motion.span>
                      </>
                    )}
                  </div>
                  
                  {isUserVillage && !isCollapsed && (
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Ubuntu Quote at Bottom */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y:20 }}
              className={cn(
              'mt-auto pt-6 px-3 pb-4 text-center',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}
              >
              <div className="text-3xl mb-2">🌍</div>
                <p className="text-xs italic leading-relaxed">
                  "I am because we are"
                </p>
              <p className="text-xs font-semibold mt-1">Ubuntu</p>
          </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.aside>
    );
  };
export default Sidebar;