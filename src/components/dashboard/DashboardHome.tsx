import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  TrendingUp,
  Zap,
  Target,
  Calendar,
  Star,
  Clock,
  Grid3x3,
  List,
  Search,
  Briefcase,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import ToolCard from './ToolCard';

// Import all village configurations
import healersConfig from '../../config/villages/healers.json';
import farmersConfig from '../../config/villages/farmers.json';
import buildersConfig from '../../config/villages/builders.json';
import tradersConfig from '../../config/villages/traders.json';
import artistsConfig from '../../config/villages/artists.json';
import teachersConfig from '../../config/villages/teachers.json';
import civicConfig from '../../config/villages/civic.json';
import transportConfig from '../../config/villages/transport.json';
import techConfig from '../../config/villages/tech.json';
import hospitalityConfig from '../../config/villages/hospitality.json';
import financeConfig from '../../config/villages/finance.json';
import environmentConfig from '../../config/villages/environment.json';

const villageConfigs: Record<string, any> = {
  healers: healersConfig,
  farmers: farmersConfig,
  builders: buildersConfig,
  traders: tradersConfig,
  artists: artistsConfig,
  teachers: teachersConfig,
  civic: civicConfig,
  transport: transportConfig,
  tech: techConfig,
  hospitality: hospitalityConfig,
  finance: financeConfig,
  environment: environmentConfig,
};

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  status: 'active' | 'coming-soon';
  component: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tools: Tool[];
}

interface Village {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  emoji: string;
  roles: Role[];
}

const DashboardHome: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);

  // Get user's selected village and role
  const selectedVillageId = localStorage.getItem('selected_village') || 'healers';
  const selectedRoleId = localStorage.getItem('selected_role') || 'physician';
  const selectedCircle = localStorage.getItem('selected_circle') || 'C1';

  // State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favoriteTools, setFavoriteTools] = useState<string[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Get village and role configuration
  const villageConfig: Village = villageConfigs[selectedVillageId];
  const roleConfig: Role | undefined = villageConfig?.roles.find((r: any) => r.id === selectedRoleId);
  const userTools: Tool[] = roleConfig?.tools || [];

  // Get categories from tools
  const categories = ['all', ...new Set(userTools.map((tool) => tool.category))];

  // Filter tools based on search and category
  const filteredTools = userTools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Active and coming soon counts
  const activeToolsCount = userTools.filter((t) => t.status === 'active').length;
  const comingSoonCount = userTools.filter((t) => t.status === 'coming-soon').length;
  const favoriteToolsCount = favoriteTools.length;

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favorite_tools');
    if (saved) {
      setFavoriteTools(JSON.parse(saved));
    }
  }, []);

  // Toggle favorite
  const toggleFavorite = (toolId: string) => {
    const updated = favoriteTools.includes(toolId)
      ? favoriteTools.filter((id) => id !== toolId)
      : [...favoriteTools, toolId];
    setFavoriteTools(updated);
    localStorage.setItem('favorite_tools', JSON.stringify(updated));
  };

  // Get icon component
  const VillageIcon =
    (Icons[villageConfig?.icon as keyof typeof Icons] as Icons.LucideIcon) || Icons.Home;
  const RoleIcon = (Icons[roleConfig?.icon as keyof typeof Icons] as Icons.LucideIcon) || Icons.User;

  if (!villageConfig || !roleConfig) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================================================================== */}
      {/* WELCOME BANNER */}
      {/* ================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8"
        style={{
          background:
            theme === 'dark'
              ? `linear-gradient(135deg, ${roleConfig.color}20 0%, ${roleConfig.color}10 100%)`
              : `linear-gradient(135deg, ${roleConfig.color}15 0%, ${roleConfig.color}05 100%)`,
        }}
      >
        {/* African Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, ${roleConfig.color} 0, ${roleConfig.color} 2px, transparent 0, transparent 50%)`,
              backgroundSize: '20px 20px',
            }}
          ></div>
        </div>

        <div className="relative z-10 flex items-start gap-6">
          {/* Village & Role Icons */}
          <div className="flex-shrink-0">
            <div className="text-6xl mb-3">{villageConfig.emoji}</div>
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: roleConfig.color }}
            >
              <RoleIcon className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Welcome Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1
                className={`text-4xl md:text-5xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {roleConfig.name} Dashboard
              </h1>
              {selectedCircle && (
                <span
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: `${roleConfig.color}30`,
                    color: roleConfig.color,
                  }}
                >
                  {selectedCircle === 'C1' ? '🌍 Continental' : selectedCircle === 'C2' ? '✈️ Diaspora' : '❤️ Ally'}
                </span>
              )}
            </div>

            <p
              className={`text-lg mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {roleConfig.description}
            </p>

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
              }`}
            >
              <VillageIcon className="w-5 h-5" style={{ color: villageConfig.color }} />
              <span
                className={`font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {villageConfig.name}
              </span>
            </div>

            {/* Ubuntu Quote */}
            <div className="mt-6 pl-4 border-l-4" style={{ borderColor: roleConfig.color }}>
              <p
                className={`italic text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                "Ubuntu: I am because we are. Together, we build our community."
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================================================================== */}
      {/* STATS CARDS */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${roleConfig.color}20`, color: roleConfig.color }}
            >
              <Briefcase className="w-6 h-6" />
            </div>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <p
            className={`text-3xl font-bold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {userTools.length}
          </p>
          <p
            className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Total Tools
          </p>
        </motion.div>

        {/* Active Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <Zap className="w-5 h-5 text-gray-400" />
          </div>
          <p
            className={`text-3xl font-bold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {activeToolsCount}
          </p>
          <p
            className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Active Tools
          </p>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <p
            className={`text-3xl font-bold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {comingSoonCount}
          </p>
          <p
            className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Coming Soon
          </p>
        </motion.div>

        {/* Favorites */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-pink-500" />
            </div>
            <Award className="w-5 h-5 text-gray-400" />
          </div>
          <p
            className={`text-3xl font-bold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {favoriteToolsCount}
          </p>
          <p
            className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Favorite Tools
          </p>
        </motion.div>
      </div>

      {/* ================================================================== */}
      {/* TOOLS SECTION */}
      {/* ================================================================== */}
      <div className="space-y-6">
        {/* Section Header with Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2
              className={`text-2xl font-bold mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              🛠️ Your Tools
            </h2>
            <p
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {filteredTools.length} tools available
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-xl border-2 transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-green-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-500'
                }`}
              />
            </div>

            {/* View Mode Toggle */}
            <div
              className={`flex items-center gap-1 p-1 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-green-500 text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-green-500 text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === category
                  ? 'text-white shadow-lg'
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
              style={
                selectedCategory === category
                  ? { backgroundColor: roleConfig.color }
                  : {}
              }
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Tools Grid/List */}
        {filteredTools.length > 0 ? (
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}
          >
            {filteredTools.map((tool, index) => {
              const ToolIcon =
                (Icons[tool.icon as keyof typeof Icons] as Icons.LucideIcon) ||
                Icons.Wrench;
              const isFavorite = favoriteTools.includes(tool.id);

              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group"
                >
                  <ToolCard
                    icon={ToolIcon}
                    name={tool.name}
                    description={tool.description}
                    color={roleConfig.color}
                    onClick={() => setSelectedTool(tool)}
                    isActive={selectedTool?.id === tool.id}
                  />
                  
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(tool.id);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        isFavorite
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>

                  {/* Status Badge */}
                  {tool.status === 'coming-soon' && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                      Coming Soon
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3
              className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              No tools found
            </h3>
            <p
              className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
            >
              Try adjusting your search or filter
            </p>
          </motion.div>
        )}
      </div>

      {/* ================================================================== */}
      {/* TOOL DETAIL MODAL */}
      {/* ================================================================== */}
      <AnimatePresence>
        {selectedTool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTool(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-2xl w-full rounded-3xl p-8 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-2 border-gray-700'
                  : 'bg-white shadow-2xl'
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {(() => {
                    const Icon =
                      (Icons[
                        selectedTool.icon as keyof typeof Icons
                      ] as Icons.LucideIcon) || Icons.Wrench;
                    return (
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{
                          backgroundColor: `${roleConfig.color}20`,
                          color: roleConfig.color,
                        }}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                    );
                  })()}
                  <div>
                    <h3
                      className={`text-2xl font-bold mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {selectedTool.name}
                    </h3>
                    {selectedTool.status === 'coming-soon' && (
                      <span className="text-sm px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTool(null)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-400'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <Icons.X className="w-6 h-6" />
                </button>
              </div>

              <p
                className={`text-lg mb-6 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {selectedTool.description}
              </p>

              <div
                className={`text-center py-12 rounded-2xl ${
                  theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
                }`}
              >
                <div className="text-5xl mb-4">⚙️</div>
                <p
                  className={`font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Widget Component
                </p>
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}
                >
                  {selectedTool.component}
                </p>
                <p
                  className={`text-xs mt-4 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  Widget implementation coming soon
                </p>
              </div>

              {selectedTool.status === 'active' && (
                <div className="mt-6 flex gap-3">
                  <button
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
                    style={{
                      background: `linear-gradient(135deg, ${roleConfig.color} 0%, ${roleConfig.color}dd 100%)`,
                    }}
                  >
                    Launch Tool
                  </button>
                  <button
                    onClick={() => toggleFavorite(selectedTool.id)}
                    className={`px-6 py-3 rounded-xl font-semibold border-2 transition-colors ${
                      favoriteTools.includes(selectedTool.id)
                        ? 'bg-yellow-500/20 border-yellow-500 text-yellow-600'
                        : theme === 'dark'
                        ? 'border-gray-700 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Star
                      className={`w-5 h-5 inline ${
                        favoriteTools.includes(selectedTool.id)
                          ? 'fill-current'
                          : ''
                      }`}
                    />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardHome;