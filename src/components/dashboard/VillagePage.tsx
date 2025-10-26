import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Briefcase, Star, Clock, TrendingUp } from 'lucide-react';
import * as Icons from 'lucide-react';
import ToolCard from './ToolCard';
import { useAppSelector } from '../../store/hooks';
import healthcareManifest from '../../config/villages/healthcare.json';
import farmingManifest from '../../config/villages/farming.json';
import constructionManifest from '../../config/villages/construction.json';
import businessManifest from '../../config/villages/business.json';
import creativeManifest from '../../config/villages/creative.json';
import educationManifest from '../../config/villages/education.json';
import governmentManifest from '../../config/villages/government.json';
import transportManifest from '../../config/villages/transport.json';
import technologyManifest from '../../config/villages/technology.json';
import hospitalityManifest from '../../config/villages/hospitality.json';
import financeManifest from '../../config/villages/finance.json';
import environmentManifest from '../../config/villages/environment.json';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Tool {
  id: string;
  name: string;
  icon: string;
  description: string;
  component: string;
  status?: 'active' | 'coming-soon';
  category?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tools: Tool[];
}

interface VillageManifest {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  emoji: string;
  roles: Role[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const VILLAGE_MANIFESTS: Record<string, VillageManifest> = {
  healthcare: healthcareManifest as any,
  farming: farmingManifest as any,
  construction: constructionManifest as any,
  business: businessManifest as any,
  creative: creativeManifest as any,
  education: educationManifest as any,
  government: governmentManifest as any,
  transport: transportManifest as any,
  technology: technologyManifest as any,
  hospitality: hospitalityManifest as any,
  finance: financeManifest as any,
  environment: environmentManifest as any,
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const VillagePage: React.FC = () => {
  const { villageId } = useParams<{ villageId: string }>();
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.theme.theme);

  const [manifest, setManifest] = useState<VillageManifest | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get user's selected role from localStorage
  const userSelectedRole = localStorage.getItem('selected_role');

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (villageId && VILLAGE_MANIFESTS[villageId]) {
      const loadedManifest = VILLAGE_MANIFESTS[villageId];
      setManifest(loadedManifest);

      // Auto-select user's role or first role
      const roleToSelect =
        loadedManifest.roles.find((r) => r.id === userSelectedRole) ||
        loadedManifest.roles[0];
      if (roleToSelect) {
        setSelectedRole(roleToSelect);
      }
    } else {
      navigate('/dashboard');
    }
  }, [villageId, navigate, userSelectedRole]);

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (!manifest) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Loading village...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const VillageIcon =
    (Icons[manifest.icon as keyof typeof Icons] as Icons.LucideIcon) ||
    Icons.Home;

  // Filter tools based on search
  const filteredTools =
    selectedRole?.tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Count stats
  const totalTools = selectedRole?.tools.length || 0;
  const activeTools =
    selectedRole?.tools.filter((t) => t.status === 'active').length || 0;
  const comingSoon =
    selectedRole?.tools.filter((t) => t.status === 'coming-soon').length || 0;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-8">
      {/* ================================================================== */}
      {/* HEADER SECTION */}
      {/* ================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8"
        style={{
          background:
            theme === 'dark'
              ? `linear-gradient(135deg, ${manifest.color}20 0%, ${manifest.color}10 100%)`
              : `linear-gradient(135deg, ${manifest.color}15 0%, ${manifest.color}05 100%)`,
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex items-center gap-2 mb-6 transition-colors group ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-green-400'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>

        <div className="flex items-start gap-6">
          {/* Village Icon */}
          <div className="flex-shrink-0">
            <div className="text-7xl mb-2">{manifest.emoji}</div>
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: manifest.color }}
            >
              <VillageIcon className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Village Info */}
          <div className="flex-1">
            <h1
              className={`text-4xl md:text-5xl font-bold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {manifest.name}
            </h1>
            <p
              className={`text-lg mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {manifest.description}
            </p>

            {/* Village Stats */}
            <div className="flex flex-wrap gap-4">
              <div
                className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                }`}
              >
                <Users className="w-5 h-5" style={{ color: manifest.color }} />
                <span
                  className={
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }
                >
                  {manifest.roles.length} Roles
                </span>
              </div>
              <div
                className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                }`}
              >
                <Briefcase
                  className="w-5 h-5"
                  style={{ color: manifest.color }}
                />
                <span
                  className={
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }
                >
                  {totalTools} Tools
                </span>
              </div>
              <div
                className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                }`}
              >
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span
                  className={
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }
                >
                  {activeTools} Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================================================================== */}
      {/* ROLE SELECTION */}
      {/* ================================================================== */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            👤 Select Your Role
          </h2>
          {userSelectedRole && (
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                theme === 'dark'
                  ? 'bg-green-900/30 text-green-400'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              Your Role:{' '}
              {manifest.roles.find((r) => r.id === userSelectedRole)?.name}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {manifest.roles.map((role, index) => {
            const RoleIcon =
              (Icons[role.icon as keyof typeof Icons] as Icons.LucideIcon) ||
              Icons.User;
            const isUserRole = role.id === userSelectedRole;
            const isSelected = selectedRole?.id === role.id;

            return (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedRole(role)}
                className={`p-6 rounded-2xl text-left transition-all ${
                  isSelected
                    ? theme === 'dark'
                      ? 'bg-gray-800 border-2 shadow-lg'
                      : 'bg-white border-2 shadow-lg'
                    : theme === 'dark'
                    ? 'bg-gray-800/50 border-2 border-transparent hover:bg-gray-800'
                    : 'bg-white/50 border-2 border-transparent hover:bg-white'
                }`}
                style={{
                  borderColor: isSelected ? role.color : 'transparent',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${role.color}20`,
                      color: role.color,
                    }}
                  >
                    <RoleIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={`font-bold text-lg ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {role.name}
                      </h3>
                      {isUserRole && (
                        <Star
                          className="w-4 h-4 fill-amber-500 text-amber-500"
                          aria-label="Your role"
                        />
                      )}
                    </div>
                    <p
                      className={`text-sm line-clamp-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {role.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${role.color}20`,
                          color: role.color,
                        }}
                      >
                        {role.tools.length} tools
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ================================================================== */}
      {/* TOOLS SECTION */}
      {/* ================================================================== */}
      <AnimatePresence mode="wait">
        {selectedRole && (
          <motion.div
            key={selectedRole.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Search Bar */}
            <div className="flex items-center justify-between gap-4">
              <h2
                className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                🛠️ {selectedRole.name} Tools
              </h2>
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`px-4 py-2 rounded-xl border-2 transition-colors max-w-xs ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-green-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-500'
                }`}
              />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p
                      className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {totalTools}
                    </p>
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Total Tools
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p
                      className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {activeTools}
                    </p>
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Active
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p
                      className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {comingSoon}
                    </p>
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Coming Soon
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool, index) => {
                const ToolIcon =
                  (Icons[tool.icon as keyof typeof Icons] as Icons.LucideIcon) ||
                  Icons.Wrench;
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ToolCard
                      icon={ToolIcon}
                      name={tool.name}
                      description={tool.description}
                      color={selectedRole.color}
                      onClick={() => setSelectedTool(tool)}
                      isActive={selectedTool?.id === tool.id}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredTools.length === 0 && (
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
                  className={
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }
                >
                  Try adjusting your search query
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
                          backgroundColor: `${selectedRole?.color}20`,
                          color: selectedRole?.color,
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
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow">
                    Launch Tool
                  </button>
                  <button
                    className={`px-6 py-3 rounded-xl font-semibold border-2 transition-colors ${
                      theme === 'dark'
                        ? 'border-gray-700 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Learn More
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

export default VillagePage;