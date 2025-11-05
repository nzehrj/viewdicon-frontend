import React from 'react';
import { RefreshCw, AlertCircle, ChevronRight, Clock, Shield } from 'lucide-react';
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

interface VillageChangeSectionProps {
  onOpenVillageSelector: () => void;
}

export const VillageChangeSection: React.FC<VillageChangeSectionProps> = ({ onOpenVillageSelector }) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const userVillage = useAppSelector((state) => state.user.village);
  const userRole = useAppSelector((state) => state.user.role);

  // Mock data - TODO: Get from Redux/API
  const lastVillageChange = new Date('2024-08-15'); // Example: User joined in August
  const monthsSinceChange = Math.floor((Date.now() - lastVillageChange.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const canChangeVillage = monthsSinceChange >= 6;
  const monthsRemaining = Math.max(0, 6 - monthsSinceChange);

  const currentVillageConfig = userVillage?.villageId ? villageConfigs[userVillage.villageId] : null;
  const currentVillageColor = currentVillageConfig?.color || '#10b981';

  const resolveIcon = (iconName: string) => {
    const IconComp = (Icons as any)[iconName];
    return IconComp || RefreshCw;
  };

  const VillageIcon = currentVillageConfig ? resolveIcon(currentVillageConfig.icon) : RefreshCw;

  return (
    <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 ${
        theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-sm'
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
            <div 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${currentVillageColor}20`, color: currentVillageColor }}
            >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
                <h2 className={`text-base sm:text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                Village & Role
                </h2>
                <p className={`text-xs sm:text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                Migration & Changes
                </p>
            </div>
            </div>
        </div>

        {/* Current Village Display - Mobile Optimized */}
        <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl mb-3 sm:mb-4 border-2`}
            style={{ borderColor: currentVillageColor }}
        >
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${currentVillageColor}20`, color: currentVillageColor }}
            >
                <VillageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
                <p className={`font-bold text-xs sm:text-sm ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                Current Village
                </p>
                <p className={`text-base sm:text-lg font-bold truncate ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                {currentVillageConfig?.villageName || 'No Village'}
                </p>
            </div>
            </div>

            <div className={`pt-2 sm:pt-3 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
            <p className={`text-xs font-semibold mb-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
                Current Role
            </p>
            <p className={`font-semibold text-sm sm:text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
                {userRole?.roleName || 'No Role'}
            </p>
            </div>
      </div>

      {/* Change Status */}
      {!canChangeVillage ? (
        <div className={`p-4 rounded-xl mb-4 ${
          theme === 'dark' 
            ? 'bg-amber-900/20 border-2 border-amber-500/30' 
            : 'bg-amber-50 border-2 border-amber-200'
        }`}>
          <div className="flex items-start gap-3">
            <Clock className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            }`} />
            <div>
              <p className={`text-sm font-semibold mb-1 ${
                theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
              }`}>
                Migration Cooldown Active
              </p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-amber-200' : 'text-amber-700'
              }`}>
                You can change your village or role in <strong>{monthsRemaining} {monthsRemaining === 1 ? 'month' : 'months'}</strong>
              </p>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                  style={{ width: `${(monthsSinceChange / 6) * 100}%` }}
                />
              </div>
              <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-amber-300' : 'text-amber-700'
              }`}>
                {monthsSinceChange} of 6 months completed
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={`p-4 rounded-xl mb-4 ${
          theme === 'dark' 
            ? 'bg-green-900/20 border-2 border-green-500/30' 
            : 'bg-green-50 border-2 border-green-200'
        }`}>
          <div className="flex items-start gap-3">
            <Shield className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`} />
            <div>
              <p className={`text-sm font-semibold mb-1 ${
                theme === 'dark' ? 'text-green-300' : 'text-green-800'
              }`}>
                Migration Available
              </p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-green-200' : 'text-green-700'
              }`}>
                You can now change your village or role. This will start a new 6-month cooldown period.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className={`p-4 rounded-xl mb-4 ${
        theme === 'dark' ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-start gap-3">
          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`} />
          <div>
            <p className={`text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
            }`}>
              Village Migration Process
            </p>
            <ul className={`text-xs space-y-1 ${
              theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
            }`}>
              <li>• Choose your new village and desired role</li>
              <li>• Submit required documents and proof of expertise</li>
              <li>• Wait for community verification (3-7 days)</li>
              <li>• Once approved, 6-month cooldown begins</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={onOpenVillageSelector}
          disabled={!canChangeVillage}
          fullWidth
          className={canChangeVillage 
            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
            : ''
          }
        >
          {canChangeVillage ? 'Change Village or Role' : 'View Migration Requirements'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>

        <button className={`
          w-full py-3 rounded-xl font-semibold text-sm transition-colors
          ${theme === 'dark'
            ? 'bg-gray-900/50 hover:bg-gray-900 text-white border border-gray-700'
            : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200'
          }
        `}>
          Explore All Villages
        </button>
      </div>
    </div>
  );
};

export default VillageChangeSection;