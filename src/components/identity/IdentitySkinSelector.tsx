import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Smile, Users, ChevronDown, Shield } from 'lucide-react';
import { useAppSelector } from '@store/hooks';

export type IdentitySkin = 'work' | 'public' | 'clan';

interface IdentitySkinSelectorProps {
  selectedSkin: IdentitySkin;
  onSkinChange: (skin: IdentitySkin) => void;
  showDescription?: boolean;
}

/**
 * IDENTITY SKIN SELECTOR COMPONENT
 * 
 * Allows user to choose which "face" they want to present:
 * 1. Work Skin - Professional identity (shows village, role, crest)
 * 2. Public Skin - Social identity (personal, creative, fun)
 * 3. Clan Skin - Family/tribal identity (heritage, homeland, can be masked)
 * 
 * Used in:
 * - Feed composer (before posting)
 * - Profile switcher
 * - Business session creation
 */
export const IdentitySkinSelector: React.FC<IdentitySkinSelectorProps> = ({
  selectedSkin,
  onSkinChange,
  showDescription = true,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  const userVillage = useAppSelector((state) => state.user.village);
  const userRole = useAppSelector((state) => state.user.role);
  
  const [isOpen, setIsOpen] = useState(false);
  
  const skins: Array<{
    id: IdentitySkin;
    label: string;
    icon: React.ElementType;
    color: string;
    description: string;
    preview: string;
  }> = [
    {
      id: 'work',
      label: 'Work Identity',
      icon: Briefcase,
      color: '#3b82f6',
      description: 'Professional identity with village, role, and trust level',
      preview: `${userRole?.roleName || 'Role'} • ${userVillage?.villageName || 'Village'}`,
    },
    {
      id: 'public',
      label: 'Public Identity',
      icon: Smile,
      color: '#8b5cf6',
      description: 'Social presence for entertainment, creativity, and personal expression',
      preview: user?.full_name || user?.name || 'Your Name',
    },
    {
      id: 'clan',
      label: 'Clan Identity',
      icon: Users,
      color: '#ea580c',
      description: 'Family, tribe, and homeland identity (can be masked for safety)',
      preview: user?.tribe ? `Child of ${user.tribe}` : 'Your Heritage',
    },
  ];
  
  const currentSkin = skins.find(s => s.id === selectedSkin) || skins[0];
  const CurrentIcon = currentSkin.icon;
  
  return (
    <div className="relative">
      {/* Selected Skin Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-4 rounded-xl border-2 transition-all ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
            : 'bg-white border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${currentSkin.color}20`, color: currentSkin.color }}
            >
              <CurrentIcon className="w-5 h-5" />
            </div>
            
            <div className="text-left">
              <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {currentSkin.label}
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {currentSkin.preview}
              </p>
            </div>
          </div>
          
          <ChevronDown className={`w-5 h-5 transition-transform ${
            isOpen ? 'rotate-180' : ''
          } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
        </div>
        
        {showDescription && (
          <p className={`text-xs mt-2 text-left ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            {currentSkin.description}
          </p>
        )}
      </button>
      
      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute top-full left-0 right-0 mt-2 rounded-xl border-2 shadow-xl z-50 overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              {skins.map((skin) => {
                const SkinIcon = skin.icon;
                const isSelected = skin.id === selectedSkin;
                
                return (
                  <button
                    key={skin.id}
                    onClick={() => {
                      onSkinChange(skin.id);
                      setIsOpen(false);
                    }}
                    className={`w-full p-4 text-left transition-colors ${
                      isSelected
                        ? theme === 'dark'
                          ? 'bg-gray-700'
                          : 'bg-gray-50'
                        : theme === 'dark'
                        ? 'hover:bg-gray-750'
                        : 'hover:bg-gray-50'
                    } ${
                      skin.id !== skins[skins.length - 1].id
                        ? theme === 'dark'
                          ? 'border-b border-gray-700'
                          : 'border-b border-gray-200'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${skin.color}20`, color: skin.color }}
                      >
                        <SkinIcon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {skin.label}
                          </p>
                          {isSelected && (
                            <Shield className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {skin.preview}
                        </p>
                        {showDescription && (
                          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            {skin.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * IDENTITY SKIN BADGE COMPONENT
 * 
 * Small badge that shows which skin is active
 * Used in: Feed posts, profile headers
 */
interface IdentitySkinBadgeProps {
  skin: IdentitySkin;
  size?: 'sm' | 'md' | 'lg';
}

export const IdentitySkinBadge: React.FC<IdentitySkinBadgeProps> = ({
  skin,
  size = 'md',
}) => {
  
  const skins = {
    work: {
      icon: Briefcase,
      label: 'Work',
      color: '#3b82f6',
    },
    public: {
      icon: Smile,
      label: 'Public',
      color: '#8b5cf6',
    },
    clan: {
      icon: Users,
      label: 'Clan',
      color: '#ea580c',
    },
  };
  
  const skinData = skins[skin];
  const SkinIcon = skinData.icon;
  
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };
  
  return (
    <div 
      className={`${sizes[size]} rounded-full flex items-center justify-center`}
      style={{ backgroundColor: `${skinData.color}20`, color: skinData.color }}
      title={`${skinData.label} Identity`}
    >
      <SkinIcon className={iconSizes[size]} />
    </div>
  );
};

export default IdentitySkinSelector;