import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home,
  Settings,
  Bell,
  Search,
  User,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Grid,
  BarChart,
  Calendar,
  MessageSquare,
  FileText,
  Users
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { useAppSelector } from '@store/hooks';

// Import all village configs
import healersConfig from '@config/villages/healers.json';
import farmersConfig from '@config/villages/farmers.json';
import buildersConfig from '@config/villages/builders.json';
import tradersConfig from '@config/villages/traders.json';
import artistsConfig from '@config/villages/artists.json';
import teachersConfig from '@config/villages/teachers.json';
import civicConfig from '@config/villages/civic.json';
import transportConfig from '@config/villages/transport.json';
import techConfig from '@config/villages/tech.json';
import hospitalityConfig from '@config/villages/hospitality.json';
import financeConfig from '@config/villages/finance.json';
import environmentConfig from '@config/villages/environment.json';

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
  toolId: string;
  toolName: string;
  description: string;
  icon?: string;
  category?: string;
}

const DashboardHome: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'tools' | 'analytics'>('overview');
  
  const theme = useAppSelector((state) => state.theme.theme);
  const userVillage = useAppSelector((state) => state.user.village);
  const userRole = useAppSelector((state) => state.user.role);
  const phoneNumber = useAppSelector((state) => state.auth.phoneNumber);

  // Get village config and role-specific tools
  const villageConfig = userVillage?.villageId ? villageConfigs[userVillage.villageId] : null;
  const roleConfig = villageConfig?.roles?.find((r: any) => r.roleId === userRole?.roleId);
  const tools: Tool[] = roleConfig?.tools || [];
  const villageColor = villageConfig?.color || '#10b981';

  // Helper to resolve Lucide icons
  const resolveIcon = (iconName?: string) => {
    if (!iconName) return Grid;
    const IconComp = (Icons as any)[iconName];
    return IconComp || Grid;
  };

  // Get role icon
  const RoleIcon = resolveIcon(roleConfig?.icon);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Header */}
      <header className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
            >
              <RoleIcon className="w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {roleConfig?.roleName || 'Dashboard'}
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {villageConfig?.villageName}
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <button className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            <button className={`p-2 rounded-lg relative ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Settings className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
          >
            <nav className="px-4 py-4 space-y-2">
              <button
                onClick={() => { setActiveView('overview'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'overview'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Overview</span>
              </button>
              <button
                onClick={() => { setActiveView('tools'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'tools'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-5 h-5" />
                <span className="font-medium">My Tools</span>
              </button>
              <button
                onClick={() => { setActiveView('analytics'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'analytics'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart className="w-5 h-5" />
                <span className="font-medium">Analytics</span>
              </button>
            </nav>
          </motion.div>
        )}
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:block w-64 h-[calc(100vh-73px)] sticky top-[73px] ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-r`}>
          <div className="p-6">
            {/* User Profile */}
            <div className={`p-4 rounded-xl mb-6 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  <User className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {phoneNumber || 'User'}
                  </p>
                  <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {roleConfig?.roleName}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {tools.length} tools available
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <button
                onClick={() => setActiveView('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'overview'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Overview</span>
              </button>
              <button
                onClick={() => setActiveView('tools')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'tools'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Grid className="w-5 h-5" />
                <span className="font-medium">My Tools</span>
                <span 
                  className="ml-auto px-2 py-0.5 text-xs rounded-full"
                  style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
                >
                  {tools.length}
                </span>
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'analytics'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <BarChart className="w-5 h-5" />
                <span className="font-medium">Analytics</span>
              </button>
            </nav>

            {/* Quick Links */}
            <div className="mt-8">
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-4 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Quick Links
              </h3>
              <div className="space-y-2">
                <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}>
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Calendar</span>
                </button>
                <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}>
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Messages</span>
                </button>
                <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}>
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Community</span>
                </button>
                <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}>
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Reports</span>
                </button>
              </div>
            </div>

            {/* Logout */}
            <div className="mt-auto pt-6">
              <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                theme === 'dark' ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
              }`}>
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Overview */}
            {activeView === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Welcome Banner */}
                <div 
                  className="p-6 sm:p-8 rounded-2xl text-white relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${villageColor} 0%, ${villageColor}dd 100%)` }}
                >
                  <div className="relative z-10">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                      Welcome back! 👋
                    </h2>
                    <p className="text-white/90 text-sm sm:text-base">
                      You have {tools.length} tools ready to help you succeed as a {roleConfig?.roleName}
                    </p>
                  </div>
                  <div className="absolute right-0 top-0 w-32 h-32 sm:w-48 sm:h-48 opacity-10">
                    <RoleIcon className="w-full h-full" />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`p-4 sm:p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <Grid className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    </div>
                    <p className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {tools.length}
                    </p>
                    <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Tools
                    </p>
                  </div>
                  <div className={`p-4 sm:p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <BarChart className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    </div>
                    <p className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      85%
                    </p>
                    <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Progress
                    </p>
                  </div>
                  <div className={`p-4 sm:p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <Calendar className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    </div>
                    <p className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      12
                    </p>
                    <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Tasks Today
                    </p>
                  </div>
                  <div className={`p-4 sm:p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <Users className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    </div>
                    <p className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      248
                    </p>
                    <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Community
                    </p>
                  </div>
                </div>

                {/* Quick Access Tools */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Quick Access
                    </h3>
                    <button 
                      onClick={() => setActiveView('tools')}
                      className="text-sm font-medium flex items-center gap-1"
                      style={{ color: villageColor }}
                    >
                      View All
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tools.slice(0, 6).map((tool) => {
                      const ToolIcon = resolveIcon(tool.icon);
                      return (
                        <button
                          key={tool.toolId}
                          className={`p-4 rounded-xl text-left transition-all hover:shadow-lg ${
                            theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-md'
                          }`}
                        >
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                            style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
                          >
                            <ToolIcon className="w-6 h-6" />
                          </div>
                          <h4 className={`font-semibold mb-1 text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {tool.toolName}
                          </h4>
                          <p className={`text-xs sm:text-sm line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {tool.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tools View */}
            {activeView === 'tools' && (
              <motion.div
                key="tools"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    My Tools
                  </h2>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {tools.length} tools available for {roleConfig?.roleName}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {tools.map((tool) => {
                    const ToolIcon = resolveIcon(tool.icon);
                    return (
                      <motion.button
                        key={tool.toolId}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-6 rounded-xl text-left transition-all ${
                          theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'
                        }`}
                      >
                        <div 
                          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
                        >
                          <ToolIcon className="w-7 h-7" />
                        </div>
                        <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {tool.toolName}
                        </h4>
                        <p className={`text-sm line-clamp-2 mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {tool.description}
                        </p>
                        {tool.category && (
                          <span 
                            className="inline-block px-2 py-1 text-xs rounded-full"
                            style={{ backgroundColor: `${villageColor}15`, color: villageColor }}
                          >
                            {tool.category}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Analytics View */}
            {activeView === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Analytics
                  </h2>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Track your progress and performance
                  </p>
                </div>

                <div className={`p-12 rounded-xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <BarChart className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Analytics Coming Soon
                  </p>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Track your activity and see detailed insights
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardHome;