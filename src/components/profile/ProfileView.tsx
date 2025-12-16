import React from 'react';
import { motion } from 'framer-motion';

// Profile Components - ONLY ProfileCard!
import { ProfileCard } from '@components/profile/ProfileCard';

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
  return (
    <motion.div 
      key="profile" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
    >
      {/* ✅ ONLY ProfileCard - Everything else removed! */}
      <ProfileCard 
        viewType="self"
        isVisible={true}
        onEditProfile={onEditProfile}
        onNavigate={onNavigate}
        onLogout={onLogout}
        onOpenSettings={onOpenSettings}
        currentView={currentView}
      />
    </motion.div>
  );
};

export default ProfileView;