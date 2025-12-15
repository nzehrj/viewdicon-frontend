import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '@store/hooks';

// Profile Components - FIXED: ProfileCard is in @components/dashboard/
import { ProfileCard } from '@components/profile/ProfileCard';
import { TwinPresenceToggle } from '@components/dashboard/TwinPresenceToggle';
import { GuardianDashboard } from '@components/dashboard/GuardianDashboard';
import { AfroIDSection } from '@components/dashboard/AfroIDSection';

interface ProfileViewProps {
  onEditProfile?: () => void;
  onNavigate?: (view: 'home' | 'profile' | 'tools' | 'business' | 'network' | 'security') => void;
  onLogout?: () => void;
  onOpenSettings?: () => void;
  currentView?: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onEditProfile,
  onNavigate,
  onLogout,
  onOpenSettings,
  currentView = 'profile'
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  
  const [presenceMode, setPresenceMode] = useState<'spirit' | 'flesh'>('spirit');

  // Mock data - TODO: Replace with real data
  const spiritAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=spirit';
  const fleshPhoto = 'https://api.dicebear.com/7.x/avataaars/svg?seed=real';
  const photoStatus: 'verified_real' | 'flagged_filtered' | 'rejected_ai' | 'not_uploaded' = 'verified_real';

  const handlePresenceToggle = (mode: 'spirit' | 'flesh') => {
    setPresenceMode(mode);
  };

  return (
    <motion.div 
      key="profile" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      className="space-y-6 max-w-4xl mx-auto p-4"
    >
      {/* Twin Presence Toggle */}
      <div className="flex justify-end mb-4">
        <TwinPresenceToggle 
          spiritAvatar={spiritAvatar} 
          fleshPhoto={fleshPhoto} 
          hasFleshAccess={true} 
          currentMode={presenceMode} 
          onToggle={handlePresenceToggle} 
          photoStatus={photoStatus} 
        />
      </div>

      {/* Profile Card - CRITICAL: Add isVisible={true} prop! */}
      <ProfileCard 
        viewType="self"
        isVisible={true}
        onEditProfile={onEditProfile}
        onNavigate={onNavigate}
        onLogout={onLogout}
        onOpenSettings={onOpenSettings}
        currentView={currentView}
      />

      {/* Guardian Dashboard */}
      <GuardianDashboard
        shield={{
          afro_id: user?.afro_id || '',
          overall_state: 'calm',
          last_updated: new Date(),
          guardians: {
            voice_spirit: { 
              status: 'ok', 
              last_check: new Date(), 
              message: 'Voice pattern matches your blessing', 
              voiceprint_match_score: 95 
            },
            drum_binding: { 
              status: 'ok', 
              last_check: new Date(), 
              message: 'This device is blessed and recognized', 
              registered_devices: 2, 
              current_device_blessed: true 
            },
            footsteps: { 
              status: 'ok', 
              last_check: new Date(), 
              message: 'Your movements are consistent and familiar', 
              anomaly_score: 5 
            },
            cultural_memory: { 
              status: 'ok', 
              last_check: new Date(), 
              message: 'Your identity remains true to your oath', 
              consistency_score: 92 
            },
          },
          recommended_restrictions: [],
          requires_clan_blessing: false,
        }}
        showDetails={true}
      />

      {/* Afro-ID Section */}
      <AfroIDSection 
        showWarning={true} 
        allowDownload={true} 
        allowShare={true} 
      />
      
      {/* Analytics Section */}
      <div className={`p-8 rounded-xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'
      }`}>
        <h3 className={`text-xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Analytics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              248
            </p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Connections
            </p>
          </div>
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              1.2k
            </p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Views
            </p>
          </div>
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              42
            </p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Posts
            </p>
          </div>
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              89%
            </p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Engagement
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileView;