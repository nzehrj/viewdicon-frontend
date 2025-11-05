import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import * as Icons from 'lucide-react';

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

export const ContentPreferencesSection: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedVillages, setSelectedVillages] = useState<string[]>(['healthcare', 'creative', 'technology']);

  const villages = Object.entries(villageConfigs).map(([id, config]) => ({
    id,
    name: config.villageName,
    description: config.description,
    icon: config.icon,
    color: config.color,
  }));

  const resolveIcon = (iconName: string) => {
    const IconComp = (Icons as any)[iconName];
    return IconComp || Eye;
  };

  const toggleVillage = (villageId: string) => {
    setSelectedVillages(prev => 
      prev.includes(villageId)
        ? prev.filter(id => id !== villageId)
        : [...prev, villageId]
    );
  };

  return (
    <div className={`rounded-2xl p-6 ${
      theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Content Preferences
            </h2>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {selectedVillages.length} of {villages.length} villages selected
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Info */}
      <div className={`p-3 rounded-xl mb-4 ${
        theme === 'dark' ? 'bg-indigo-900/20 border border-indigo-500/30' : 'bg-indigo-50 border border-indigo-200'
      }`}>
        <p className={`text-xs ${
          theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
        }`}>
          Choose which villages' content you want to see in your feed
        </p>
      </div>

      {/* Selected Villages Preview */}
      {!isExpanded && (
        <div className="flex flex-wrap gap-2">
          {selectedVillages.slice(0, 3).map((villageId) => {
            const village = villages.find(v => v.id === villageId);
            if (!village) return null;
            
            const VillageIcon = resolveIcon(village.icon);
            
            return (
              <div
                key={villageId}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
                  theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-100'
                }`}
                style={{ borderLeft: `3px solid ${village.color}` }}
              >
                <VillageIcon className="w-4 h-4" style={{ color: village.color }} />
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {village.name}
                </span>
              </div>
            );
          })}
          {selectedVillages.length > 3 && (
            <div className={`px-3 py-2 rounded-lg text-sm ${
              theme === 'dark' ? 'bg-gray-900/50 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}>
              +{selectedVillages.length - 3} more
            </div>
          )}
        </div>
      )}

      {/* Expanded Village Selection */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3"
         >
            {villages.map((village) => {
              const VillageIcon = resolveIcon(village.icon);
              const isSelected = selectedVillages.includes(village.id);
              
              return (
                <motion.button
                  key={village.id}
                  onClick={() => toggleVillage(village.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl text-left transition-all border-2 ${
                    isSelected
                      ? `border-[${village.color}]`
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${
                    theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
                  }`}
                  style={isSelected ? { borderColor: village.color } : {}}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${village.color}20`, color: village.color }}
                    >
                      <VillageIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-semibold text-sm truncate ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {village.name}
                        </p>
                        {isSelected && (
                          <Check className="w-4 h-4 flex-shrink-0" style={{ color: village.color }} />
                        )}
                      </div>
                      <p className={`text-xs line-clamp-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {village.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Button */}
      {isExpanded && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            w-full mt-4 py-3 rounded-xl font-semibold text-sm
            transition-colors
            ${theme === 'dark'
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }
          `}
        >
          Save Preferences
        </motion.button>
      )}
    </div>
  );
};

export default ContentPreferencesSection;