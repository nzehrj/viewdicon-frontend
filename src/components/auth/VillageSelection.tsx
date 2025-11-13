// src/components/auth/VillageSelection.tsx
import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, Loader2, Globe } from 'lucide-react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { setUserRole, setUserVillage, setUser } from '@store/slices/userSlice';
import { setAuthenticated } from '@store/slices/authSlice';
import { nextStep } from '@store/slices/authFlowSlice';

// ✅ Updated Village JSON imports - All 17 Villages
import agricultureConfig from '../../config/villages/agriculture.json';
import businessConfig from '../../config/villages/business.json';
import constructionConfig from '../../config/villages/construction.json';
import craftsConfig from '../../config/villages/crafts.json';
import creativeConfig from '../../config/villages/creative.json';
import educationConfig from '../../config/villages/education.json';
import financeConfig from '../../config/villages/finance.json';
import governanceConfig from '../../config/villages/governance.json';
import governmentConfig from '../../config/villages/government.json';
import healthcareConfig from '../../config/villages/healthcare.json';
import gettingStartedConfig from '../../config/villages/getting_started.json';
import hospitalityConfig from '../../config/villages/hospitality.json';
import mediaConfig from '../../config/villages/media.json';
import securityConfig from '../../config/villages/security.json';
import spiritualConfig from '../../config/villages/spiritual.json';
import technologyConfig from '../../config/villages/technology.json';
import transportConfig from '../../config/villages/transport.json';

const villageConfigs: Record<string, any> = {
  agriculture: agricultureConfig,
  business: businessConfig,
  construction: constructionConfig,
  crafts: craftsConfig,
  creative: creativeConfig,
  education: educationConfig,
  finance: financeConfig,
  governance: governanceConfig,
  government: governmentConfig,
  healthcare: healthcareConfig,
  getting_started: gettingStartedConfig,
  hospitality: hospitalityConfig,
  media: mediaConfig,
  security: securityConfig,
  spiritual: spiritualConfig,
  technology: technologyConfig,
  transport: transportConfig,
};

interface VillageSelectionProps {
  onSelect: (village: string, role: string) => void;
}

export const VillageSelection: React.FC<VillageSelectionProps> = ({ onSelect }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.theme.theme);
  const phoneNumber = useAppSelector((s) => s.auth.phoneNumber);
  const userName = useAppSelector((s) => s.auth.userName);
  const existingUser = useAppSelector((s) => s.user.user);

  const [selectedVillageId, setSelectedVillageId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Show ALL 17 villages including getting_started
  const villages = useMemo(() => {
    return Object.keys(villageConfigs)
      .map((key) => {
        const cfg = villageConfigs[key];
        return {
          id: cfg.villageId || key,
          name: cfg.villageName || cfg.name || key,
          description: cfg.description || '',
          color: cfg.color || '#888',
          iconName: cfg.icon || 'Home',
          roles: cfg.roles || [],
        };
      });
  }, []);

  const selectedVillage = selectedVillageId ? villageConfigs[selectedVillageId] : null;
  const availableRoles = selectedVillage?.roles || [];
  
  // ✅ Check if selected village is getting_started (no role required)
  const isGettingStarted = selectedVillageId === 'getting_started';

  const resolveIcon = (iconName?: string) => {
    if (!iconName) return Icons.User;
    const IconComp = (Icons as any)[iconName];
    return IconComp || Icons.User;
  };

  const handleVillageSelect = (id: string) => {
    console.log('🏘️ Village selected:', id);
    setSelectedVillageId(id);
    setSelectedRoleId(null);
    
    // ✅ If getting_started is selected, auto-set a default role/guild
    if (id === 'getting_started') {
      const gettingStartedGuilds = villageConfigs[id]?.guilds || villageConfigs[id]?.roles || [];
      if (gettingStartedGuilds.length > 0) {
        // Auto-select the first guild/role
        setSelectedRoleId(gettingStartedGuilds[0].guildId || gettingStartedGuilds[0].roleId);
      }
    }
  };

  const handleRoleSelect = (id: string) => {
    console.log('👤 Role selected:', id);
    setSelectedRoleId(id);
  };

  // ✅ Handle getting_started village completion (no role selection needed)
  const handleGettingStartedComplete = async () => {
    console.log('🚀 Getting Started - Proceeding without role selection');
    setIsSubmitting(true);

    const villageCfg = villageConfigs[selectedVillageId!];
    // Support both "guilds" and "roles" structure
    const defaultRole = villageCfg.guilds?.[0] || villageCfg.roles?.[0] || { 
      guildId: 'unclassified_worker', 
      guildName: 'Worker Under Review',
      roleId: 'unclassified_worker',
      roleName: 'Worker Under Review'
    };

    console.log('📝 Dispatching to Redux...');
    console.log('Village:', villageCfg.villageName || villageCfg.displayName);
    console.log('Role/Guild:', defaultRole.guildName || defaultRole.roleName);

    // ✅ CRITICAL: Create user object with phone number and preserve any existing data
    dispatch(setUser({
      id: existingUser?.id || `temp-${Date.now()}`,
      phoneNumber: phoneNumber || existingUser?.phoneNumber || 'unknown',
      name: userName || existingUser?.name || existingUser?.full_name || phoneNumber || 'User',
      full_name: existingUser?.full_name || userName || phoneNumber || 'User',
      // ✅ Preserve tribe/heritage from KYC if it exists - convert null to undefined
      tribe: existingUser?.tribe || undefined,
      country: existingUser?.country || undefined,
      afro_id: existingUser?.afro_id || undefined,
      kinship_tier: existingUser?.kinship_tier || undefined,
      sankofa_totem: existingUser?.sankofa_totem || undefined,
      iwa_score: existingUser?.iwa_score || undefined,
    }));
    console.log('✓ User object created');

    // Dispatch village info
    dispatch(
      setUserVillage({
        villageId: villageCfg.villageId,
        villageName: villageCfg.villageName || villageCfg.displayName,
      })
    );
    console.log('✓ Village dispatched');

    // Dispatch role info
    dispatch(
      setUserRole({
        roleId: defaultRole.guildId || defaultRole.roleId,
        roleName: defaultRole.guildName || defaultRole.roleName,
      })
    );
    console.log('✓ Role dispatched');

    // Mark user as authenticated
    dispatch(setAuthenticated(true));
    console.log('✓ Authentication set to true');

    // Dispatch next step
    dispatch(nextStep());
    console.log('✓ Next step dispatched');

    console.log('🎯 Calling onSelect callback...');
    onSelect(villageCfg.villageId, defaultRole.guildId || defaultRole.roleId);
  };

  const handleComplete = async () => {
    if (!selectedVillageId || !selectedRoleId) return;
    
    console.log('🚀 Complete button clicked');
    console.log('Selected Village ID:', selectedVillageId);
    console.log('Selected Role ID:', selectedRoleId);
    
    setIsSubmitting(true);

    const villageCfg = villageConfigs[selectedVillageId];
    const roleCfg = villageCfg.roles.find((r: any) => r.roleId === selectedRoleId);

    console.log('📝 Dispatching to Redux...');
    console.log('Village:', villageCfg.villageName);
    console.log('Role:', roleCfg.roleName);

    // ✅ CRITICAL: Create user object with phone number and preserve any existing data
    dispatch(setUser({
      id: existingUser?.id || `temp-${Date.now()}`,
      phoneNumber: phoneNumber || existingUser?.phoneNumber || 'unknown',
      name: userName || existingUser?.name || existingUser?.full_name || phoneNumber || 'User',
      full_name: existingUser?.full_name || userName || phoneNumber || 'User',
      // ✅ Preserve tribe/heritage from KYC if it exists - convert null to undefined
      tribe: existingUser?.tribe || undefined,
      country: existingUser?.country || undefined,
      afro_id: existingUser?.afro_id || undefined,
      kinship_tier: existingUser?.kinship_tier || undefined,
      sankofa_totem: existingUser?.sankofa_totem || undefined,
      iwa_score: existingUser?.iwa_score || undefined,
    }));
    console.log('✓ User object created');

    // Dispatch village info
    dispatch(
      setUserVillage({
        villageId: villageCfg.villageId,
        villageName: villageCfg.villageName,
      })
    );
    console.log('✓ Village dispatched');

    // Dispatch role info
    dispatch(
      setUserRole({
        roleId: roleCfg.roleId,
        roleName: roleCfg.roleName,
      })
    );
    console.log('✓ Role dispatched');

    // Mark user as authenticated
    dispatch(setAuthenticated(true));
    console.log('✓ Authentication set to true');

    // Dispatch next step
    dispatch(nextStep());
    console.log('✓ Next step dispatched');

    console.log('🎯 Calling onSelect callback...');
    onSelect(villageCfg.villageId, roleCfg.roleId);
  };

  return (
    <GradientBackground>
      <div className="min-h-screen p-3 sm:p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl">
          {/* Header - Mobile Optimized */}
          <div
            className={`mb-4 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl border-l-4 ${
              theme === 'dark'
                ? 'border-gray-700 bg-gray-800/50'
                : 'border-green-600 bg-white shadow-lg'
            }`}
          >
            <h2
              className={`text-lg sm:text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              } flex items-center gap-2`}
            >
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              Choose Your Village {!isGettingStarted && '& Role'}
            </h2>
            <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {isGettingStarted 
                ? "Perfect! Let's get you started - no role selection needed."
                : "Select the industry that matches your work, then choose your specific role."
              }
            </p>
          </div>

          {/* Progress indicator - Mobile Optimized */}
          {selectedVillageId && !isGettingStarted && (
            <div className="flex items-center justify-center gap-3 sm:gap-6 mb-4 sm:mb-8 px-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span
                  className={`text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Village
                </span>
              </div>
              <div
                className={`w-12 sm:w-24 h-1 ${
                  selectedRoleId ? 'bg-green-500' : 'bg-gray-300'
                }`}
              ></div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    selectedRoleId
                      ? 'bg-green-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {selectedRoleId ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <span className="text-xs sm:text-sm font-bold">2</span>
                  )}
                </div>
                <span
                  className={`text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Role
                </span>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Village grid - Shows ALL 17 villages */}
            {!selectedVillageId && (
              <motion.div
                key="villages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
              >
                {villages.map((v) => {
                  const Icon = resolveIcon(v.iconName);
                  return (
                    <motion.button
                      key={v.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      onClick={() => handleVillageSelect(v.id)}
                      className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all group ${
                        theme === 'dark'
                          ? 'bg-gray-800/50 border-gray-700 hover:border-green-500'
                          : 'bg-white border-gray-200 hover:border-green-600 hover:shadow-xl'
                      }`}
                    >
                      <div
                        className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-xl flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform"
                        style={{
                          background: `linear-gradient(135deg, ${v.color}20 0%, ${v.color}40 100%)`,
                          color: v.color,
                        }}
                      >
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <h3
                        className={`text-xs sm:text-base font-bold mb-1 sm:mb-2 text-center ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {v.name}
                      </h3>
                      <p
                        className={`text-[10px] sm:text-xs text-center line-clamp-2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {v.description}
                      </p>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}

            {/* ✅ NEW: Getting Started Confirmation (No role selection) */}
            {selectedVillageId && isGettingStarted && (
              <motion.div
                key="getting-started-confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4 sm:p-8 rounded-2xl sm:rounded-3xl ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-xl'
                }`}
              >
                <div className="text-center mb-6">
                  {(() => {
                    const iconName = selectedVillage?.visual?.iconSet?.[0] || selectedVillage?.icon || 'Compass';
                    const Icon = resolveIcon(iconName);
                    const color = selectedVillage?.visual?.colorPrimary || selectedVillage?.color || '#6366f1';
                    return (
                      <div
                        className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl flex items-center justify-center mb-4"
                        style={{
                          background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`,
                          color: color,
                        }}
                      >
                        <Icon className="w-10 h-10 sm:w-12 sm:h-12" />
                      </div>
                    );
                  })()}
                  <h2
                    className={`text-lg sm:text-2xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {selectedVillage?.displayName || selectedVillage?.villageName}
                  </h2>
                  <p
                    className={`text-sm sm:text-base mb-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {selectedVillage?.promiseTagline || "You're all set! No role selection needed - let's explore together."}
                  </p>
                  <p
                    className={`text-xs sm:text-sm ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}
                  >
                    {selectedVillage?.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={() => setSelectedVillageId(null)}
                    disabled={isSubmitting}
                    className={`w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ← Back to Villages
                  </button>
                  <button
                    onClick={handleGettingStartedComplete}
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to Dashboard</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Role grid - Only shown for non-getting_started villages */}
            {selectedVillageId && !isGettingStarted && !selectedRoleId && (
              <motion.div
                key="roles"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 sm:space-y-6"
              >
                <button
                  onClick={() => setSelectedVillageId(null)}
                  className={`text-sm ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ← Back to Villages
                </button>

                <div
                  className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-lg'
                  }`}
                >
                  <h2
                    className={`text-base sm:text-xl font-bold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Select Your Role in {selectedVillage?.villageName}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
                    {availableRoles.map((r: any) => {
                      const Icon = resolveIcon(r.icon);
                      return (
                        <motion.button
                          key={r.roleId}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                          onClick={() => handleRoleSelect(r.roleId)}
                          className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all group ${
                            theme === 'dark'
                              ? 'bg-gray-800/50 border-gray-700 hover:border-green-500'
                              : 'bg-white border-gray-200 hover:border-green-600 hover:shadow-md'
                          }`}
                        >
                          <div
                            className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform"
                            style={{
                              background: `linear-gradient(135deg, ${selectedVillage?.color}20 0%, ${selectedVillage?.color}40 100%)`,
                              color: selectedVillage?.color,
                            }}
                          >
                            <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                          </div>
                          <h3
                            className={`text-xs sm:text-sm font-semibold text-center ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {r.roleName}
                          </h3>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Confirmation - For villages with roles */}
            {selectedVillageId && !isGettingStarted && selectedRoleId && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4 sm:p-8 rounded-2xl sm:rounded-3xl ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-xl'
                }`}
              >
                <h2
                  className={`text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Confirm Your Selection
                </h2>

                <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6 sm:mb-8">
                  <div className="text-center">
                    {(() => {
                      const Icon = resolveIcon(selectedVillage?.icon);
                      return <Icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" style={{ color: selectedVillage?.color }} />;
                    })()}
                    <h3
                      className={`text-sm sm:text-lg font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {selectedVillage?.villageName}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Village
                    </p>
                  </div>

                  <div className="text-2xl sm:text-4xl">→</div>

                  <div className="text-center">
                    {(() => {
                      const role = selectedVillage?.roles.find(
                        (r: any) => r.roleId === selectedRoleId
                      );
                      const Icon = resolveIcon(role?.icon);
                      return (
                        <Icon
                          className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2"
                          style={{ color: selectedVillage?.color }}
                        />
                      );
                    })()}
                    <h3
                      className={`text-sm sm:text-lg font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {
                        selectedVillage?.roles.find(
                          (r: any) => r.roleId === selectedRoleId
                        )?.roleName
                      }
                    </h3>
                    <p
                      className={`text-xs sm:text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Role
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={() => setSelectedRoleId(null)}
                    disabled={isSubmitting}
                    className={`w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ← Change Role
                  </button>
                  <button
                    onClick={handleComplete}
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        <span className="hidden sm:inline">Completing...</span>
                        <span className="sm:hidden">Loading...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Confirm Selection</span>
                        <span className="sm:hidden">Confirm</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GradientBackground>
  );
};

export default VillageSelection;