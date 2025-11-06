import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ChevronRight, Users, Shield } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import * as Icons from 'lucide-react';
import { Button } from '@components/common/Button';

// Import village configs
import healthcareConfig from '../../config/villages/healthcare.json';
import farmingConfig from '../../config/villages/farming.json';
import constructionConfig from '../../config/villages/construction.json';
import businessConfig from '../../config/villages/business.json';
import creativeConfig from '../../config/villages/creative.json';
import educationConfig from '../../config/villages/education.json';
import governmentConfig from '../../config/villages/government.json';
import transportConfig from '../../config/villages/transport.json';
import technologyConfig from '../../config/villages/technology.json';
import hospitalityConfig from '../../config/villages/hospitality.json';
import financeConfig from '../../config/villages/finance.json';
import environmentConfig from '../../config/villages/environment.json';

const villageConfigs: Record<string, any> = {
  healthcare: healthcareConfig,
  farming: farmingConfig,
  construction: constructionConfig,
  business: businessConfig,
  creative: creativeConfig,
  education: educationConfig,
  government: governmentConfig,
  transport: transportConfig,
  technology: technologyConfig,
  hospitality: hospitalityConfig,
  finance: financeConfig,
  environment: environmentConfig,
};

interface VillageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVillage: (villageId: string, roleId: string) => void;
}

export const VillageSelector: React.FC<VillageSelectorProps> = ({ isOpen, onClose, onSelectVillage }) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const userVillage = useAppSelector((state) => state.user.village);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const villages = Object.entries(villageConfigs).map(([id, config]) => ({
    id,
    name: config.villageName,
    description: config.description,
    icon: config.icon,
    color: config.color,
    roles: config.roles || [],
  }));

  const filteredVillages = villages.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resolveIcon = (iconName: string) => {
    const IconComp = (Icons as any)[iconName];
    return IconComp || Shield;
  };

  const selectedVillageData = selectedVillage 
    ? villages.find(v => v.id === selectedVillage)
    : null;

  const handleSelectRole = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleConfirm = () => {
    if (selectedVillage && selectedRole) {
      onSelectVillage(selectedVillage, selectedRole);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal Container - Centered with Flexbox */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`
                w-full max-w-4xl max-h-[90vh]
                ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
                rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col
              `}
            >
              {/* Header */}
              <div className={`p-4 sm:p-6 border-b ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl sm:text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedVillage ? 'Select Your Role' : 'Choose Your Village'}
                  </h2>
                  <button
                    onClick={onClose}
                    className={`p-2 rounded-lg ${
                      theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search Bar */}
                {!selectedVillage && (
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      placeholder="Search villages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                )}

                {/* Breadcrumb */}
                {selectedVillage && (
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      onClick={() => {
                        setSelectedVillage(null);
                        setSelectedRole(null);
                      }}
                      className={`font-medium ${
                        theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                      }`}
                    >
                      All Villages
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      {selectedVillageData?.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {/* Village Selection */}
                {!selectedVillage && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredVillages.map((village) => {
                      const VillageIcon = resolveIcon(village.icon);
                      const isCurrentVillage = userVillage?.villageId === village.id;
                      
                      return (
                        <motion.button
                          key={village.id}
                          onClick={() => setSelectedVillage(village.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isCurrentVillage}
                          className={`p-4 sm:p-6 rounded-xl text-left transition-all border-2 ${
                            isCurrentVillage
                              ? 'opacity-50 cursor-not-allowed'
                              : theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div 
                              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${village.color}20`, color: village.color }}
                            >
                              <VillageIcon className="w-7 h-7" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className={`font-bold text-base truncate ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {village.name}
                                </h3>
                                {isCurrentVillage && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                                  }`}>
                                    Current
                                  </span>
                                )}
                              </div>
                              <p className={`text-sm mb-3 line-clamp-2 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {village.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5" style={{ color: village.color }} />
                                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                    {village.roles.length} roles
                                  </span>
                                </div>
                              </div>
                            </div>

                            <ChevronRight className={`w-5 h-5 flex-shrink-0 ${
                              isCurrentVillage ? 'text-gray-600' : 'text-gray-400'
                            }`} />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Role Selection */}
                {selectedVillage && selectedVillageData && (
                  <div>
                    {/* Village Info */}
                    <div className={`p-4 sm:p-6 rounded-xl mb-6 border-2`}
                      style={{ borderColor: selectedVillageData.color }}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div 
                          className="w-16 h-16 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${selectedVillageData.color}20`, color: selectedVillageData.color }}
                        >
                          {React.createElement(resolveIcon(selectedVillageData.icon), { className: 'w-8 h-8' })}
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold mb-1 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {selectedVillageData.name}
                          </h3>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {selectedVillageData.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Roles Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedVillageData.roles.map((role: any) => {
                        const RoleIcon = resolveIcon(role.icon);
                        const isSelected = selectedRole === role.roleId;
                        
                        return (
                          <motion.button
                            key={role.roleId}
                            onClick={() => handleSelectRole(role.roleId)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-4 rounded-xl text-left transition-all border-2 ${
                              isSelected
                                ? `border-[${selectedVillageData.color}]`
                                : theme === 'dark'
                                ? 'border-gray-700 hover:border-gray-600'
                                : 'border-gray-200 hover:border-gray-300'
                            } ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                            }`}
                            style={isSelected ? { borderColor: selectedVillageData.color } : {}}
                          >
                            <div className="flex items-start gap-3">
                              <div 
                                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${selectedVillageData.color}20`, color: selectedVillageData.color }}
                              >
                                <RoleIcon className="w-6 h-6" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h4 className={`font-bold text-base mb-1 ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {role.roleName}
                                </h4>
                                <p className={`text-sm mb-2 line-clamp-2 ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {role.description}
                                </p>
                                <div className="flex items-center gap-1 text-xs">
                                  <Shield className="w-3.5 h-3.5" style={{ color: selectedVillageData.color }} />
                                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                    {role.tools?.length || 0} tools
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {selectedVillage && (
                <div className={`p-4 sm:p-6 border-t ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedVillage(null);
                        setSelectedRole(null);
                      }}
                      className="w-full sm:flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      disabled={!selectedRole}
                      className="w-full sm:flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      Continue to Application
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VillageSelector;