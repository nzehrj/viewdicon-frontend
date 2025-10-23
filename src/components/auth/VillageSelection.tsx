// src/components/auth/VillageSelection.tsx
import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, Loader2, Globe } from 'lucide-react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GradientBackground } from '@components/common/GradientBackground';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { setUserRole, setUserVillage } from '@store/slices/userSlice';
import { setAuthenticated } from '@store/slices/authSlice'; // ✅ ADDED: Import setAuthenticated
import { nextStep } from '@store/slices/authFlowSlice';

// ✅ Village JSON imports
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

interface VillageSelectionProps {
  onSelect: (village: string, role: string) => void;
}

export const VillageSelection: React.FC<VillageSelectionProps> = ({ onSelect }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.theme.theme);

  const [selectedVillageId, setSelectedVillageId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const villages = useMemo(() => {
    return Object.keys(villageConfigs).map((key) => {
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

  const resolveIcon = (iconName?: string) => {
    if (!iconName) return Icons.User;
    const IconComp = (Icons as any)[iconName];
    return IconComp || Icons.User;
  };

  const handleVillageSelect = (id: string) => {
    console.log('🏘️ Village selected:', id);
    setSelectedVillageId(id);
    setSelectedRoleId(null);
  };

  const handleRoleSelect = (id: string) => {
    console.log('👤 Role selected:', id);
    setSelectedRoleId(id);
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

    // ✅ CRITICAL: Mark user as authenticated
    dispatch(setAuthenticated(true));
    console.log('✓ Authentication set to true');

    // Dispatch next step
    dispatch(nextStep());
    console.log('✓ Next step dispatched');

    // Call parent callback
    console.log('🎯 Calling onSelect callback...');
    onSelect(villageCfg.villageId, roleCfg.roleId);

    // Navigate to dashboard
    console.log('🚀 Navigating to dashboard...');
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 400);
  };

  return (
    <GradientBackground>
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <div
            className={`mb-8 p-6 rounded-2xl border-l-4 ${
              theme === 'dark'
                ? 'border-gray-700 bg-gray-800/50'
                : 'border-green-600 bg-white shadow-lg'
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              } flex items-center gap-2`}
            >
              <Globe className="w-6 h-6 text-green-600" />
              Choose Your Village & Role
            </h2>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              Explore the village map and choose where your story begins.
            </p>
          </div>

          {/* Progress indicator */}
          {selectedVillageId && (
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Village Selected
                </span>
              </div>
              <div
                className={`w-24 h-1 ${
                  selectedRoleId ? 'bg-green-500' : 'bg-gray-300'
                }`}
              ></div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedRoleId
                      ? 'bg-green-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {selectedRoleId ? <Check className="w-4 h-4" /> : <span>2</span>}
                </div>
                <span
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Role Selection
                </span>
              </div>
            </div>
          )}

          {/* Main area */}
          <AnimatePresence mode="wait">
            {!selectedVillageId && (
              <motion.div
                key="villages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
              >
                {villages.map((v) => {
                  const Icon = resolveIcon(v.iconName);
                  return (
                    <motion.button
                      key={v.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      onClick={() => handleVillageSelect(v.id)}
                      className={`relative p-6 rounded-2xl border-2 transition-all group ${
                        theme === 'dark'
                          ? 'bg-gray-800/50 border-gray-700 hover:border-green-500'
                          : 'bg-white border-gray-200 hover:border-green-600 hover:shadow-md'
                      }`}
                    >
                      <div
                        className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                        style={{
                          background: `linear-gradient(135deg, ${v.color}20 0%, ${v.color}40 100%)`,
                          color: v.color,
                        }}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3
                        className={`font-semibold text-center mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {v.name}
                      </h3>
                      <p
                        className={`text-xs text-center ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {v.roles.length} roles
                      </p>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}

            {/* Role grid */}
            {selectedVillageId && !selectedRoleId && (
              <motion.div
                key="roles"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
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
                  className={`p-4 rounded-2xl ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-lg'
                  }`}
                >
                  <h2
                    className={`text-xl font-bold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Select Your Role in {selectedVillage?.villageName}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {availableRoles.map((r: any) => {
                      const Icon = resolveIcon(r.icon);
                      return (
                        <motion.button
                          key={r.roleId}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                          onClick={() => handleRoleSelect(r.roleId)}
                          className={`p-6 rounded-2xl border-2 transition-all group ${
                            theme === 'dark'
                              ? 'bg-gray-800/50 border-gray-700 hover:border-green-500'
                              : 'bg-white border-gray-200 hover:border-green-600 hover:shadow-md'
                          }`}
                        >
                          <div
                            className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                            style={{
                              background: `linear-gradient(135deg, ${selectedVillage?.color}20 0%, ${selectedVillage?.color}40 100%)`,
                              color: selectedVillage?.color,
                            }}
                          >
                            <Icon className="w-7 h-7" />
                          </div>
                          <h3
                            className={`font-semibold text-center ${
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

            {/* Confirmation */}
            {selectedVillageId && selectedRoleId && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-8 rounded-3xl ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-xl'
                }`}
              >
                <h2
                  className={`text-2xl font-bold mb-6 text-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Confirm Your Selection
                </h2>

                <div className="flex items-center justify-center gap-8 mb-8">
                  <div className="text-center">
                    {(() => {
                      const Icon = resolveIcon(selectedVillage?.icon);
                      return <Icon className="w-12 h-12 mx-auto mb-2" style={{ color: selectedVillage?.color }} />;
                    })()}
                    <h3
                      className={`text-lg font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {selectedVillage?.villageName}
                    </h3>
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Village
                    </p>
                  </div>

                  <div className="text-4xl">→</div>

                  <div className="text-center">
                    {(() => {
                      const role = selectedVillage?.roles.find(
                        (r: any) => r.roleId === selectedRoleId
                      );
                      const Icon = resolveIcon(role?.icon);
                      return (
                        <Icon
                          className="w-12 h-12 mx-auto mb-2"
                          style={{ color: selectedVillage?.color }}
                        />
                      );
                    })()}
                    <h3
                      className={`text-lg font-bold ${
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
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Role
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setSelectedRoleId(null)}
                    disabled={isSubmitting}
                    className={`w-full sm:flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${
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
                    className="w-full sm:flex-1 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      <>
                        Complete & Go to Dashboard
                        <ArrowRight className="w-5 h-5" />
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
