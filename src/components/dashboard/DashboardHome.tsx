import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  MessageSquare, 
  CreditCard, 
  Bot, 
  ChevronRight,
  User,
  Settings,
  Bell,
  Search,
  Plus,
  Wheat,
  Fish,
  Milk,
  Droplet,
  ShoppingBag,
  Hammer,
  Package,
  Briefcase,
  Home,
  Users,
  Heart,
  Calendar
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import { GradientBackground } from '@components/common/GradientBackground';

const DashboardHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'tools' | 'social' | 'banking' | 'ai'>('home');
  const theme = useAppSelector((state) => state.theme.theme);
  const userRole = useAppSelector((state) => state.auth.userRole);
  const userVillage = useAppSelector((state) => state.auth.userVillage);
  const userName = useAppSelector((state) => state.auth.userName || 'User');
  const phoneNumber = useAppSelector((state) => state.auth.phoneNumber);

  // Role-based tools configuration
  const getRoleTools = () => {
    const toolsMap: Record<string, Array<{
      icon: any;
      title: string;
      color: string;
      bgColor: string;
      description: string;
    }>> = {
      // FARMERS VILLAGE
      'Crop Farmer': [
        { icon: Wheat, title: 'Crop Management', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30', description: 'Manage your crops and planting schedules' },
        { icon: Calendar, title: 'Planting Calendar', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30', description: 'Plan your planting and harvest times' },
        { icon: Droplet, title: 'Irrigation System', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', description: 'Monitor and control irrigation' },
        { icon: Package, title: 'Crop Storage', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30', description: 'Track stored produce' },
        { icon: ShoppingBag, title: 'Market Connect', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30', description: 'Connect with buyers' },
        { icon: Bot, title: 'AI Crop Advisor', color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30', description: 'Get AI-powered farming tips' },
      ],
      'Livestock Farmer': [
        { icon: Milk, title: 'Livestock Management', color: 'text-brown-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30', description: 'Track your animals health' },
        { icon: Heart, title: 'Health Monitor', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30', description: 'Animal health tracking' },
        { icon: Calendar, title: 'Breeding Schedule', color: 'text-pink-600', bgColor: 'bg-pink-100 dark:bg-pink-900/30', description: 'Plan breeding cycles' },
        { icon: Package, title: 'Feed Management', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', description: 'Track feed inventory' },
        { icon: ShoppingBag, title: 'Livestock Market', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30', description: 'Buy and sell livestock' },
        { icon: Bot, title: 'AI Vet Assistant', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', description: 'Virtual veterinary help' },
      ],
      'Fishery': [
        { icon: Fish, title: 'Fish Farm Manager', color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30', description: 'Manage your fish ponds' },
        { icon: Droplet, title: 'Water Quality', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', description: 'Monitor water conditions' },
        { icon: Package, title: 'Feed Tracker', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30', description: 'Track fish feed' },
        { icon: Calendar, title: 'Harvest Planner', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30', description: 'Plan harvest cycles' },
        { icon: ShoppingBag, title: 'Fish Market', color: 'text-teal-600', bgColor: 'bg-teal-100 dark:bg-teal-900/30', description: 'Sell your catch' },
        { icon: Bot, title: 'AI Aquaculture', color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30', description: 'Smart farming tips' },
      ],

      // BUSINESS VILLAGE
      'Entrepreneur': [
        { icon: Briefcase, title: 'Business Hub', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', description: 'Manage your business' },
        { icon: Package, title: 'Inventory', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30', description: 'Track your stock' },
        { icon: CreditCard, title: 'Finances', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30', description: 'Financial management' },
        { icon: Users, title: 'Team Manager', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30', description: 'Manage your team' },
        { icon: ShoppingBag, title: 'Sales Portal', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30', description: 'Track sales and orders' },
        { icon: Bot, title: 'Business AI', color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30', description: 'AI business insights' },
      ],
      'Trader': [
        { icon: ShoppingBag, title: 'Trade Hub', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30', description: 'Manage your trades' },
        { icon: Package, title: 'Product Catalog', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', description: 'List your products' },
        { icon: CreditCard, title: 'Payments', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30', description: 'Track transactions' },
        { icon: Users, title: 'Suppliers', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30', description: 'Manage suppliers' },
        { icon: Calendar, title: 'Orders', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30', description: 'Order management' },
        { icon: Bot, title: 'Trade AI', color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30', description: 'Market predictions' },
      ],

      // CRAFTSMEN VILLAGE
      'Artisan': [
        { icon: Hammer, title: 'Craft Workshop', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30', description: 'Manage your crafts' },
        { icon: Package, title: 'Materials', color: 'text-brown-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30', description: 'Track raw materials' },
        { icon: ShoppingBag, title: 'Craft Store', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30', description: 'Sell your crafts' },
        { icon: Calendar, title: 'Orders', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', description: 'Custom orders' },
        { icon: Users, title: 'Gallery', color: 'text-pink-600', bgColor: 'bg-pink-100 dark:bg-pink-900/30', description: 'Showcase your work' },
        { icon: Bot, title: 'Design AI', color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30', description: 'AI design assistant' },
      ],
    };

    return toolsMap[userRole || ''] || [
      { icon: Wrench, title: 'General Tools', color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-900/30', description: 'Coming soon' },
    ];
  };

  const tools = getRoleTools();

  // Get role color scheme
  const getRoleColorScheme = () => {
    const colorMap: Record<string, { bg: string; text: string; accent: string }> = {
      'Crop Farmer': { bg: 'bg-gradient-to-br from-green-500 to-emerald-600', text: 'text-green-600', accent: 'bg-green-500' },
      'Livestock Farmer': { bg: 'bg-gradient-to-br from-orange-500 to-amber-600', text: 'text-orange-600', accent: 'bg-orange-500' },
      'Fishery': { bg: 'bg-gradient-to-br from-cyan-500 to-blue-600', text: 'text-cyan-600', accent: 'bg-cyan-500' },
      'Entrepreneur': { bg: 'bg-gradient-to-br from-blue-500 to-indigo-600', text: 'text-blue-600', accent: 'bg-blue-500' },
      'Trader': { bg: 'bg-gradient-to-br from-amber-500 to-yellow-600', text: 'text-amber-600', accent: 'bg-amber-500' },
      'Artisan': { bg: 'bg-gradient-to-br from-purple-500 to-pink-600', text: 'text-purple-600', accent: 'bg-purple-500' },
    };

    return colorMap[userRole || ''] || { bg: 'bg-gradient-to-br from-gray-500 to-gray-600', text: 'text-gray-600', accent: 'bg-gray-500' };
  };

  const roleColors = getRoleColorScheme();

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col">
        {/* Header - WeChat Style Profile */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`${roleColors.bg} text-white p-6 rounded-b-3xl shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Profile Picture */}
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50">
                <User className="w-8 h-8 text-white" />
              </div>
              
              {/* User Info */}
              <div>
                <h2 className="text-xl font-bold">{userName}</h2>
                <p className="text-sm text-white/80">{phoneNumber}</p>
                <p className="text-xs text-white/60">{userRole} • {userVillage}</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-white/70">Active Tools</p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-2xl font-bold">45</p>
              <p className="text-xs text-white/70">Connections</p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-white/70">Tasks</p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Quick Actions */}
                <div className="mb-6">
                  <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <button
                      onClick={() => setActiveTab('tools')}
                      className={`${roleColors.bg} text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow`}
                    >
                      <Wrench className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-semibold">My Tools</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('social')}
                      className="bg-gradient-to-br from-pink-500 to-red-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-semibold">Social</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('banking')}
                      className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <CreditCard className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-semibold">Banking</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('ai')}
                      className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <Bot className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-semibold">AI Help</p>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className={`p-6 rounded-3xl ${theme === 'dark' ? 'bg-gray-800/30 backdrop-blur-sm' : 'bg-white shadow-lg'}`}>
                  <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 dark:bg-gray-700/30">
                        <div className={`w-12 h-12 rounded-full ${roleColors.accent} flex items-center justify-center`}>
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Activity {i}
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            2 hours ago
                          </p>
                        </div>
                        <ChevronRight className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tools' && (
              <motion.div
                key="tools"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {userRole} Tools
                  </h3>
                  <button className={`${roleColors.bg} text-white p-3 rounded-full shadow-lg`}>
                    <Plus className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tools.map((tool, index) => {
                    const Icon = tool.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-3xl cursor-pointer hover:shadow-xl transition-all ${
                          theme === 'dark' ? 'bg-gray-800/30 backdrop-blur-sm hover:bg-gray-800/50' : 'bg-white shadow-lg hover:shadow-2xl'
                        }`}
                      >
                        <div className={`w-16 h-16 rounded-2xl ${tool.bgColor} flex items-center justify-center mb-4`}>
                          <Icon className={`w-8 h-8 ${tool.color}`} />
                        </div>
                        <h4 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {tool.title}
                        </h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {tool.description}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm font-semibold" style={{ color: tool.color.replace('text-', '') }}>
                          <span>Open Tool</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'social' && (
              <motion.div
                key="social"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <MessageSquare className="w-20 h-20 mx-auto mb-4 text-pink-500" />
                <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  ViewDicon Social Media
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Connect with your community
                </p>
              </motion.div>
            )}

            {activeTab === 'banking' && (
              <motion.div
                key="banking"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <CreditCard className="w-20 h-20 mx-auto mb-4 text-green-500" />
                <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Banking Services
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage your finances
                </p>
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <Bot className="w-20 h-20 mx-auto mb-4 text-purple-500" />
                <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  AI Assistant
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Get intelligent help
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation Bar */}
        <div className={`border-t ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
          <div className="flex justify-around p-4">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'home' ? roleColors.text : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>
            
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'tools' ? roleColors.text : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <Wrench className="w-6 h-6" />
              <span className="text-xs font-medium">Tools</span>
            </button>
            
            <button
              onClick={() => setActiveTab('social')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'social' ? 'text-pink-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-xs font-medium">Social</span>
            </button>
            
            <button
              onClick={() => setActiveTab('banking')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'banking' ? 'text-green-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-xs font-medium">Banking</span>
            </button>
            
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'ai' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <Bot className="w-6 h-6" />
              <span className="text-xs font-medium">AI</span>
            </button>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default DashboardHome;