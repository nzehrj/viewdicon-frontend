import React from 'react';
import { Shield, Award } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface IdentityStripProps {
  // Optional: can be used to show someone else's identity (in Discover, Business Sessions)
  userId?: string;
  displayName?: string;
  villageName?: string;
  villageId?: string;
  roleName?: string;
  roleIcon?: string;
  crestTier?: number;
  honorStage?: string;
  shieldState?: 'green' | 'amber' | 'red';
  villageColor?: string;
  
  // Display mode
  variant?: 'full' | 'compact' | 'minimal';
  showVillage?: boolean;
  showRole?: boolean;
  showCrest?: boolean;
  showHonor?: boolean;
  showShield?: boolean;
}

/**
 * IDENTITY STRIP COMPONENT
 * 
 * This is the user's "passport" across the platform.
 * Shows: Name, Village, Role, Crest, Honor Stage, Nkisi Shield
 * 
 * Used in:
 * - Dashboard header
 * - Discover cards
 * - Business Session rooms (pinned at top)
 * - Profile views
 * - Feed posts (when user chooses to show Work Skin)
 */
export const IdentityStrip: React.FC<IdentityStripProps> = ({
  displayName: propDisplayName,
  villageName: propVillageName,
  roleName: propRoleName,
  roleIcon: propRoleIcon,
  crestTier: propCrestTier,
  honorStage: propHonorStage,
  shieldState: propShieldState,
  villageColor: propVillageColor,
  variant = 'full',
  showVillage = true,
  showRole = true,
  showCrest = true,
  showHonor = true,
  showShield = true,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  // Get current user data from Redux (if no props provided)
  const currentUser = useAppSelector((state) => state.user.user);
  const currentVillage = useAppSelector((state) => state.user.village);
  const currentRole = useAppSelector((state) => state.user.role);
  
  // Use props if provided (for showing other users), otherwise use current user
  const displayName = propDisplayName || currentUser?.full_name || currentUser?.name || 'User';
  const villageName = propVillageName || currentVillage?.villageName || 'Village';
  const roleName = propRoleName || currentRole?.roleName || 'Role';
  const roleIcon = propRoleIcon || 'User';
  const crestTier = propCrestTier || 1; // Default tier 1
  const honorStage = propHonorStage || 'Newcomer';
  const shieldState = propShieldState || 'green';
  const villageColor = propVillageColor || '#10b981';
  
  // Resolve icon component
  const RoleIcon = (Icons as any)[roleIcon] || Icons.User;
  
  // Shield colors
  const shieldColors = {
    green: '#10b981',
    amber: '#f59e0b',
    red: '#ef4444',
  };
  
  // Crest display (beads/medals based on tier)
  const getCrestDisplay = (tier: number) => {
    if (tier >= 5) return '⭐⭐⭐⭐⭐'; // 5 stars
    if (tier >= 4) return '⭐⭐⭐⭐';
    if (tier >= 3) return '⭐⭐⭐';
    if (tier >= 2) return '⭐⭐';
    return '⭐'; // Tier 1
  };
  
  // Minimal variant (just name + shield)
  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2">
        <span className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {displayName}
        </span>
        {showShield && (
          <Shield 
            className="w-4 h-4" 
            style={{ color: shieldColors[shieldState] }}
            fill={shieldColors[shieldState]}
          />
        )}
      </div>
    );
  }
  
  // Compact variant (name + role + shield)
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        {/* Role Icon */}
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
        >
          <RoleIcon className="w-5 h-5" />
        </div>
        
        {/* Name & Role */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`font-semibold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {displayName}
            </p>
            {showShield && (
              <Shield 
                className="w-4 h-4 flex-shrink-0" 
                style={{ color: shieldColors[shieldState] }}
                fill={shieldColors[shieldState]}
              />
            )}
          </div>
          {showRole && (
            <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {roleName}
            </p>
          )}
        </div>
        
        {/* Crest */}
        {showCrest && (
          <div className="text-xs">
            {getCrestDisplay(crestTier)}
          </div>
        )}
      </div>
    );
  }
  
  // Full variant (complete identity card)
  return (
    <div className={`p-4 rounded-xl border-2 ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Top Row: Name + Shield */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Role Icon with Village Color */}
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
          >
            <RoleIcon className="w-6 h-6" />
          </div>
          
          {/* Name & Village */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-base truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {displayName}
            </h3>
            {showVillage && (
              <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {villageName}
              </p>
            )}
          </div>
        </div>
        
        {/* Shield State */}
        {showShield && (
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <Shield 
              className="w-6 h-6" 
              style={{ color: shieldColors[shieldState] }}
              fill={shieldColors[shieldState]}
            />
            <span className="text-[10px] font-medium uppercase" style={{ color: shieldColors[shieldState] }}>
              {shieldState}
            </span>
          </div>
        )}
      </div>
      
      {/* Middle Row: Role & Honor Stage */}
      <div className="space-y-2 mb-3">
        {showRole && (
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Role:
            </span>
            <span 
              className="text-xs font-semibold px-2 py-1 rounded"
              style={{ backgroundColor: `${villageColor}15`, color: villageColor }}
            >
              {roleName}
            </span>
          </div>
        )}
        
        {showHonor && honorStage && (
          <div className="flex items-center gap-2">
            <Award className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`} />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {honorStage}
            </span>
          </div>
        )}
      </div>
      
      {/* Bottom Row: Crest */}
      {showCrest && (
        <div className={`pt-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Trust Level:
            </span>
            <div className="flex items-center gap-1">
              <span className="text-sm">
                {getCrestDisplay(crestTier)}
              </span>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Tier {crestTier}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentityStrip;