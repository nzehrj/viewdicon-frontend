import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield,
  Award,
  Star,
  TrendingUp,
  Lock,
  Unlock,
  Crown,
  ChevronRight,
  Info,
  CheckCircle,
  AlertCircle,
  Zap,
  Target
} from 'lucide-react';

import { useAppSelector } from '@store/hooks';

// Types
type ShieldStatus = 'active' | 'inactive' | 'warning' | 'locked';

interface CrestLevel {
  level: number;
  maxLevel: number;
  progress: number; // 0-100
  nextLevelRequirements: {
    transactions: number;
    rating: number;
    timeInDays: number;
  };
  benefits: string[];
}

interface ShieldLevel {
  level: number;
  maxLevel: number;
  status: ShieldStatus;
  protections: {
    name: string;
    enabled: boolean;
    description: string;
  }[];
  vulnerabilities: string[];
}

interface HonorStage {
  stage: number;
  maxStage: number;
  title: string;
  description: string;
  achievements: {
    name: string;
    completed: boolean;
    description: string;
  }[];
  nextStageRequirements: string[];
}

interface VerificationTiersProps {
  crest: CrestLevel;
  shield: ShieldLevel;
  honor: HonorStage;
  onUpgradeCrest?: () => void;
  onActivateShield?: () => void;
  onViewAchievements?: () => void;
}

const VerificationTiers: React.FC<VerificationTiersProps> = ({
  crest,
  shield,
  honor,
  onUpgradeCrest,
  onActivateShield,
  onViewAchievements
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [selectedTier, setSelectedTier] = useState<'crest' | 'shield' | 'honor'>('crest');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const getShieldStatusInfo = (status: ShieldStatus) => {
    const statusMap = {
      active: {
        color: 'green',
        bgColor: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50',
        textColor: theme === 'dark' ? 'text-green-400' : 'text-green-700',
        borderColor: theme === 'dark' ? 'border-green-700' : 'border-green-200',
        icon: CheckCircle,
        label: 'Active Protection'
      },
      inactive: {
        color: 'gray',
        bgColor: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50',
        textColor: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
        borderColor: theme === 'dark' ? 'border-gray-600' : 'border-gray-200',
        icon: AlertCircle,
        label: 'Inactive'
      },
      warning: {
        color: 'yellow',
        bgColor: theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-50',
        textColor: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700',
        borderColor: theme === 'dark' ? 'border-yellow-700' : 'border-yellow-200',
        icon: AlertCircle,
        label: 'Warning'
      },
      locked: {
        color: 'red',
        bgColor: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50',
        textColor: theme === 'dark' ? 'text-red-400' : 'text-red-700',
        borderColor: theme === 'dark' ? 'border-red-700' : 'border-red-200',
        icon: Lock,
        label: 'Locked'
      }
    };
    return statusMap[status];
  };

  const getCrestColor = (level: number): string => {
    if (level <= 2) return 'from-orange-400 to-orange-600';
    if (level <= 4) return 'from-gray-300 to-gray-500';
    if (level <= 6) return 'from-yellow-400 to-yellow-600';
    if (level <= 8) return 'from-purple-400 to-purple-600';
    return 'from-blue-400 to-blue-600';
  };

  const getCrestTitle = (level: number): string => {
    if (level === 1) return 'Newcomer';
    if (level === 2) return 'Apprentice';
    if (level === 3) return 'Trader';
    if (level === 4) return 'Craftsman';
    if (level === 5) return 'Merchant';
    if (level === 6) return 'Master';
    if (level === 7) return 'Elder';
    if (level === 8) return 'Chief';
    if (level === 9) return 'King/Queen';
    return 'Legend';
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className={`min-h-screen pb-20 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`p-4 sm:p-6 text-white ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-purple-900 to-blue-900'
          : 'bg-gradient-to-r from-purple-600 to-blue-600'
      }`}>
        <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Verification Tiers</h1>
        <p className={`text-sm ${
          theme === 'dark' ? 'text-purple-200' : 'text-purple-100'
        }`}>Your trust, protection, and honor levels</p>
      </div>

      {/* Tier Selection Tabs */}
      <div className={`border-b ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex">
          <button
            onClick={() => setSelectedTier('crest')}
            className={`flex-1 py-3 sm:py-4 px-2 sm:px-4 font-medium transition-colors ${
              selectedTier === 'crest'
                ? theme === 'dark'
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-900/30'
                  : 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Award className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" />
            <span className="text-xs sm:text-sm">Crest</span>
          </button>
          <button
            onClick={() => setSelectedTier('shield')}
            className={`flex-1 py-3 sm:py-4 px-2 sm:px-4 font-medium transition-colors ${
              selectedTier === 'shield'
                ? theme === 'dark'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-900/30'
                  : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" />
            <span className="text-xs sm:text-sm">Shield</span>
          </button>
          <button
            onClick={() => setSelectedTier('honor')}
            className={`flex-1 py-3 sm:py-4 px-2 sm:px-4 font-medium transition-colors ${
              selectedTier === 'honor'
                ? theme === 'dark'
                  ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-900/30'
                  : 'text-amber-600 border-b-2 border-amber-600 bg-amber-50'
                : theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" />
            <span className="text-xs sm:text-sm">Honor</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* CREST TAB */}
        {selectedTier === 'crest' && (
          <motion.div
            key="crest"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4 sm:p-6"
          >
            {/* Crest Level Display */}
            <div className={`rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 min-w-0 pr-3">
                  <h2 className={`text-lg sm:text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {getCrestTitle(crest.level)}
                  </h2>
                  <p className={`text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Level {crest.level} of {crest.maxLevel}
                  </p>
                </div>
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${getCrestColor(crest.level)} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <Award className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs sm:text-sm mb-2">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Progress to Next Level
                  </span>
                  <span className="font-semibold text-purple-600">{crest.progress}%</span>
                </div>
                <div className={`h-2 sm:h-3 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${crest.progress}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                </div>
              </div>

              {/* Current Benefits */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('crest-benefits')}
                  className="w-full flex items-center justify-between py-2"
                >
                  <span className={`font-semibold text-sm sm:text-base ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Current Benefits</span>
                  <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  } ${expandedSection === 'crest-benefits' ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {expandedSection === 'crest-benefits' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2 mt-2"
                    >
                      {crest.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className={`text-xs sm:text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>{benefit}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Next Level Requirements */}
              <div className={`rounded-lg p-3 sm:p-4 border ${
                theme === 'dark'
                  ? 'bg-purple-900/30 border-purple-700'
                  : 'bg-purple-50 border-purple-200'
              }`}>
                <h3 className={`font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base ${
                  theme === 'dark' ? 'text-purple-300' : 'text-purple-900'
                }`}>
                  <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Requirements for Level {crest.level + 1}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className={theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}>
                      Complete Transactions
                    </span>
                    <span className={`font-semibold ${
                      theme === 'dark' ? 'text-purple-300' : 'text-purple-900'
                    }`}>
                      {crest.nextLevelRequirements.transactions}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className={theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}>
                      Maintain Rating
                    </span>
                    <span className={`font-semibold ${
                      theme === 'dark' ? 'text-purple-300' : 'text-purple-900'
                    }`}>
                      {crest.nextLevelRequirements.rating}+ stars
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className={theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}>
                      Active Time
                    </span>
                    <span className={`font-semibold ${
                      theme === 'dark' ? 'text-purple-300' : 'text-purple-900'
                    }`}>
                      {crest.nextLevelRequirements.timeInDays} days
                    </span>
                  </div>
                </div>
              </div>

              {/* Upgrade Button */}
              {crest.progress >= 100 && (
                <motion.button
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onUpgradeCrest}
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow text-sm sm:text-base"
                >
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  Upgrade to Level {crest.level + 1}
                </motion.button>
              )}
            </div>

            {/* Crest Levels Overview */}
            <div className={`rounded-xl p-4 sm:p-6 shadow-sm ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`font-bold mb-4 text-sm sm:text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>All Crest Levels</h3>
              <div className="space-y-2 sm:space-y-3">
                {Array.from({ length: crest.maxLevel }, (_, i) => i + 1).map((level) => (
                  <div
                    key={level}
                    className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg ${
                      level === crest.level
                        ? theme === 'dark'
                          ? 'bg-purple-900/30 border-2 border-purple-700'
                          : 'bg-purple-50 border-2 border-purple-200'
                        : level < crest.level
                        ? theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                        : theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${getCrestColor(level)} flex items-center justify-center flex-shrink-0 ${level > crest.level ? 'opacity-40' : ''}`}>
                      {level <= crest.level ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      ) : (
                        <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-xs sm:text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Level {level}: {getCrestTitle(level)}
                      </div>
                      {level === crest.level && (
                        <div className="text-xs text-purple-600 font-medium">Current Level</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SHIELD TAB */}
        {selectedTier === 'shield' && (
          <motion.div
            key="shield"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4 sm:p-6"
          >
            {/* Shield Status */}
            <div className={`rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 min-w-0 pr-3">
                  <h2 className={`text-lg sm:text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Security Shield</h2>
                  <p className={`text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Level {shield.level} of {shield.maxLevel}
                  </p>
                </div>
                <div className={`${getShieldStatusInfo(shield.status).bgColor} ${getShieldStatusInfo(shield.status).borderColor} border-2 rounded-full p-3 sm:p-4 flex-shrink-0`}>
                  {React.createElement(getShieldStatusInfo(shield.status).icon, {
                    className: `w-6 h-6 sm:w-8 sm:h-8 ${getShieldStatusInfo(shield.status).textColor}`
                  })}
                </div>
              </div>

              {/* Status Badge */}
              <div className={`${getShieldStatusInfo(shield.status).bgColor} ${getShieldStatusInfo(shield.status).borderColor} border rounded-lg p-2.5 sm:p-3 mb-4`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${shield.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className={`font-semibold text-xs sm:text-sm ${getShieldStatusInfo(shield.status).textColor}`}>
                    {getShieldStatusInfo(shield.status).label}
                  </span>
                </div>
              </div>

              {/* Active Protections */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('shield-protections')}
                  className="w-full flex items-center justify-between py-2"
                >
                  <span className={`font-semibold text-sm sm:text-base ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Active Protections</span>
                  <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  } ${expandedSection === 'shield-protections' ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {expandedSection === 'shield-protections' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2 sm:space-y-3 mt-3"
                    >
                      {shield.protections.map((protection, index) => (
                        <div key={index} className={`flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          <div className="mt-0.5">
                            {protection.enabled ? (
                              <Unlock className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                            ) : (
                              <Lock className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                              }`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium text-xs sm:text-sm ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>{protection.name}</div>
                            <div className={`text-xs sm:text-sm mt-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>{protection.description}</div>
                          </div>
                          <div className={`px-2 py-0.5 sm:py-1 rounded text-xs font-semibold flex-shrink-0 ${
                            protection.enabled
                              ? 'bg-green-100 text-green-700'
                              : theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {protection.enabled ? 'ON' : 'OFF'}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Vulnerabilities */}
              {shield.vulnerabilities.length > 0 && (
                <div className={`rounded-lg p-3 sm:p-4 border ${
                  theme === 'dark'
                    ? 'bg-amber-900/30 border-amber-700'
                    : 'bg-amber-50 border-amber-200'
                }`}>
                  <h3 className={`font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base ${
                    theme === 'dark' ? 'text-amber-300' : 'text-amber-900'
                  }`}>
                    <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Security Recommendations
                  </h3>
                  <div className="space-y-2">
                    {shield.vulnerabilities.map((vulnerability, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                        <span className={`text-xs sm:text-sm ${
                          theme === 'dark' ? 'text-amber-400' : 'text-amber-800'
                        }`}>{vulnerability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activate Shield Button */}
              {shield.status !== 'active' && (
                <motion.button
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onActivateShield}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow text-sm sm:text-base"
                >
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Activate Full Shield Protection</span>
                  <span className="sm:hidden">Activate Shield</span>
                </motion.button>
              )}
            </div>

            {/* Shield Info */}
            <div className={`rounded-xl p-4 sm:p-6 border ${
              theme === 'dark'
                ? 'bg-blue-900/30 border-blue-700'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start gap-2 sm:gap-3">
                <Info className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div className="text-xs sm:text-sm">
                  <p className={`font-semibold mb-2 ${
                    theme === 'dark' ? 'text-blue-300' : 'text-blue-900'
                  }`}>About Security Shield</p>
                  <p className={theme === 'dark' ? 'text-blue-400' : 'text-blue-800'}>
                    Your Shield protects your account from unauthorized access, fraud, and suspicious activities.
                    Higher shield levels unlock advanced security features like biometric authentication,
                    device verification, and real-time threat monitoring.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* HONOR TAB */}
        {selectedTier === 'honor' && (
          <motion.div
            key="honor"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4 sm:p-6"
          >
            {/* Honor Stage Display */}
            <div className={`rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 min-w-0 pr-3">
                  <h2 className={`text-lg sm:text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{honor.title}</h2>
                  <p className={`text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Stage {honor.stage} of {honor.maxStage}
                  </p>
                  <p className={`text-xs sm:text-sm mt-1 ${
                    theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                  }`}>{honor.description}</p>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-4">
                <h3 className={`font-semibold mb-3 text-sm sm:text-base ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Achievements</h3>
                <div className="space-y-2">
                  {honor.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border ${
                        achievement.completed
                          ? theme === 'dark'
                            ? 'bg-green-900/30 border-green-700'
                            : 'bg-green-50 border-green-200'
                          : theme === 'dark'
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="mt-0.5">
                        {achievement.completed ? (
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        ) : (
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 ${
                            theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-xs sm:text-sm ${
                          achievement.completed 
                            ? theme === 'dark' ? 'text-green-300' : 'text-green-900'
                            : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {achievement.name}
                        </div>
                        <div className={`text-xs sm:text-sm mt-1 ${
                          achievement.completed 
                            ? theme === 'dark' ? 'text-green-400' : 'text-green-700'
                            : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {achievement.description}
                        </div>
                      </div>
                      {achievement.completed && (
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-current flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Stage Requirements */}
              {honor.stage < honor.maxStage && (
                <div className={`rounded-lg p-3 sm:p-4 border ${
                  theme === 'dark'
                    ? 'bg-amber-900/30 border-amber-700'
                    : 'bg-amber-50 border-amber-200'
                }`}>
                  <h3 className={`font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base ${
                    theme === 'dark' ? 'text-amber-300' : 'text-amber-900'
                  }`}>
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Requirements for Next Stage
                  </h3>
                  <div className="space-y-2">
                    {honor.nextStageRequirements.map((requirement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                        <span className={`text-xs sm:text-sm ${
                          theme === 'dark' ? 'text-amber-400' : 'text-amber-800'
                        }`}>{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View All Achievements Button */}
              <motion.button
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onViewAchievements}
                className="w-full mt-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow text-sm sm:text-base"
              >
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                View All Achievements
              </motion.button>
            </div>

            {/* Honor Stages Overview */}
            <div className={`rounded-xl p-4 sm:p-6 shadow-sm ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`font-bold mb-4 text-sm sm:text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Honor Journey</h3>
              <div className="space-y-2 sm:space-y-3">
                {Array.from({ length: honor.maxStage }, (_, i) => i + 1).map((stage) => (
                  <div
                    key={stage}
                    className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg ${
                      stage === honor.stage
                        ? theme === 'dark'
                          ? 'bg-amber-900/30 border-2 border-amber-700'
                          : 'bg-amber-50 border-2 border-amber-200'
                        : stage < honor.stage
                        ? theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                        : theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center flex-shrink-0 ${stage > honor.stage ? 'opacity-40' : ''}`}>
                      {stage <= honor.stage ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      ) : (
                        <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-xs sm:text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>Stage {stage}</div>
                      {stage === honor.stage && (
                        <div className="text-xs text-amber-600 font-medium">Current Stage</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerificationTiers;