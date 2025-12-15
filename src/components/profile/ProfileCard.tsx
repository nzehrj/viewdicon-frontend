import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Award, 
  Users, 
  Edit3,
  Menu,
  X,
  Home as HomeIcon,
  Grid,
  Shield,
  Settings,
  LogOut,
  Link as LinkIcon,
  ChevronRight,
  Globe,
  FileText,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import { formatHandle } from '@/types/profile.types';
import { VerificationBadge } from '@components/verification/VerificationBadge';
import { NkisiShield } from '@components/verification/NkisiShield';
import { ProfessionalBadge } from '@components/verification/ProfessionalBadge';
import { EventCalendar } from '@components/events/EventCalendar';
import { AnalyticsDashboard } from '@components/profile/AnalyticsDashboard';
import type { VerificationTier, ShieldState, ProfessionalBadge as ProfessionalBadgeType } from '@/types/verification.types';

interface ProfileCardProps {
  viewType: 'self' | 'stranger' | 'trusted';
  isVisible?: boolean;
  onEditProfile?: () => void;
  onNavigate?: (view: 'home' | 'profile' | 'tools' | 'business' | 'network' | 'security') => void;
  onLogout?: () => void;
  onOpenSettings?: () => void;
  currentView?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  viewType,
  isVisible = false,
  onEditProfile,
  onNavigate,
  onLogout,
  onOpenSettings,
  currentView = 'home'
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  const publicProfile = useAppSelector((state) => state.user.publicProfile);
  const afroIdentity = useAppSelector((state) => state.user.afroIdentity);
  const village = useAppSelector((state) => state.user.village);
  const role = useAppSelector((state) => state.user.role);
  const rank = useAppSelector((state) => state.user.rank);

  // Menu sidebar state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEventCalendar, setShowEventCalendar] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Use publicProfile if available, fallback to legacy user data
  const displayName = publicProfile?.display_name || user?.full_name || user?.name || 'User';
  const handle = publicProfile?.handle || `@${user?.phoneNumber?.slice(-4)}` || '@user';
  const bio = publicProfile?.bio || '';
  const location = publicProfile?.location || user?.country || '';
  const avatarUrl = publicProfile?.avatar_url || '';
  const coverUrl = publicProfile?.cover_url || '';

  // Stats (only Posts now)
  const postCount = publicProfile?.post_count || 0;

  // Village & role display
  const villageName = village?.villageName || 'No Village';
  const roleName = role?.roleName || 'No Role';
  const villageRoleBadge = publicProfile?.village_role_badge || `${villageName} • ${roleName}`;

  // Rank display
  const rankLevel = rank?.level || user?.iwa_score || 0;
  const rankTitle = rank?.title || 'Novice';
  const rankColor = rank?.color || '#6b7280';

  // Heritage display (only if allowed)
  const showHeritage = publicProfile?.show_heritage || false;
  const heritage = user?.tribe || afroIdentity?.heritage || '';

  // Verification & Nkisi data
  const verificationTier: VerificationTier = 'bronze';
  const shieldState: ShieldState = 'calm';
  const professionalBadges: ProfessionalBadgeType[] = [];

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  // Menu items configuration - Business removed (now in Chat → Business tab)
  const menuSections = [
    {
      title: 'Navigate',
      items: [
        { 
          icon: HomeIcon, 
          label: 'Home', 
          action: () => onNavigate?.('home'),
          active: currentView === 'home'
        },
        { 
          icon: LinkIcon, 
          label: 'Network', 
          action: () => onNavigate?.('network'),
          active: currentView === 'network'
        },
        { 
          icon: Shield, 
          label: 'Security', 
          action: () => onNavigate?.('security'),
          active: currentView === 'security'
        },
        { 
          icon: Grid, 
          label: 'My Tools', 
          action: () => onNavigate?.('tools'),
          active: currentView === 'tools'
        },
        { 
          icon: BarChart3, 
          label: 'Analytics', 
          action: () => setShowAnalytics(true)
        },
        { 
          icon: Calendar, 
          label: 'Events', 
          action: () => setShowEventCalendar(true)
        },
      ]
    },
    {
      title: 'Settings',
      items: [
        { 
          icon: Settings, 
          label: 'Settings', 
          action: () => onOpenSettings?.()
        },
        { 
          icon: Globe, 
          label: 'Language', 
          action: () => console.log('Language')
        },
      ]
    },
    {
      title: 'Legal',
      items: [
        { 
          icon: FileText, 
          label: 'Terms & Privacy', 
          action: () => console.log('Terms')
        },
      ]
    }
  ];

  //Don't return null - always render for self view
  if (viewType !== 'self') return null;

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 overflow-y-auto max-w-4xl mx-auto ${isVisible ? 'block' : 'hidden'} ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}
        style={{ 
          top: 0,  
          paddingBottom: '88px'
        }}
      >
        {/* ProfileCard Header with Menu Button */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-4 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}>
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Profile
          </h2>
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Content  */}
        <div className="p-[2px] pb-24">
          {/* Profile Card Content  */}
          <div className={`overflow-hidden mb-6 ${
            theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'
          }`}>
            {/* Cover Image */}
            <div className="relative h-32 sm:h-48 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700">
              {coverUrl ? (
                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="text-6xl">🌍</div>
                </div>
              )}

              {/* Edit button */}
              <button
                onClick={onEditProfile}
                className={`absolute top-4 right-4 p-2 rounded-xl backdrop-blur-xl transition-transform active:scale-95 ${
                  theme === 'dark' ? 'bg-gray-800/80 hover:bg-gray-700/80 text-white' : 'bg-white/80 hover:bg-white/90 text-gray-900'
                }`}
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="px-4 sm:px-6 pb-6">
              {/* Avatar with Nkisi Shield */}
              <div className="flex items-end justify-between -mt-12 sm:-mt-16 mb-4">
                <div className="relative">
                  <NkisiShield state={shieldState} size="lg" showTooltip={false}>
                    <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 ${
                      theme === 'dark' ? 'border-gray-800' : 'border-white'
                    } bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl`}>
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-3xl sm:text-5xl">
                          {displayName.charAt(0)}
                        </div>
                      )}
                    </div>
                  </NkisiShield>

                  <div className="absolute -bottom-2 -right-2">
                    <VerificationBadge tier={verificationTier} size="md" showTooltip />
                  </div>
                </div>

                {/* Edit Button (Mobile) */}
                <button
                  onClick={onEditProfile}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                    theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <Edit3 className="w-4 h-4 inline mr-1" />
                  Edit
                </button>
              </div>

              {/* Name & Handle */}
              <div className="mb-3">
                <h1 className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {displayName}
                </h1>
                <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatHandle(handle)}
                </p>
              </div>

              {/* Bio */}
              {bio && (
                <p className={`text-sm sm:text-base mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {bio}
                </p>
              )}

              {/* Professional Badges */}
              {professionalBadges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {professionalBadges.map((badge, idx) => (
                    <ProfessionalBadge key={idx} badge={badge} size="sm" showVerifier={false} />
                  ))}
                </div>
              )}

              {/* Village & Role Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold ${
                  theme === 'dark' ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  <Users className="w-4 h-4" />
                  {villageRoleBadge}
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold"
                  style={{ backgroundColor: `${rankColor}20`, color: rankColor, border: `1px solid ${rankColor}40` }}>
                  <Award className="w-4 h-4" />
                  {rankTitle} • Lv.{rankLevel}
                </div>

                {showHeritage && heritage && (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold ${
                    theme === 'dark' ? 'bg-amber-900/30 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    🌍 {heritage} Heritage
                  </div>
                )}
              </div>

              {/* Location */}
              {location && (
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {location}
                  </span>
                </div>
              )}

              {/* Stats */}
              <div className={`py-4 border-t border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {postCount}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                    Posts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed right-0 top-0 bottom-0 w-[85vw] sm:w-80 md:w-96 max-w-md z-[80] overflow-y-auto ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
              } shadow-2xl`}
            >
              <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${
                theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
              }`}>
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Menu
                </h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={`p-2 rounded-lg transition-colors active:scale-95 ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 space-y-6">
                {menuSections.map((section, sectionIdx) => (
                  <div key={sectionIdx}>
                    <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-2 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item, itemIdx) => {
                        const Icon = item.icon;
                        const isActive = 'active' in item && item.active;
                        
                        return (
                          <button
                            key={itemIdx}
                            onClick={() => handleMenuItemClick(item.action)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all active:scale-95 ${
                              isActive
                                ? theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                                : theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 flex-shrink-0" />
                              <span className="font-medium text-sm sm:text-base">{item.label}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className={`pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <button
                    onClick={() => handleMenuItemClick(() => onLogout?.())}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all active:scale-95 ${
                      theme === 'dark' ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base">Logout</span>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Analytics Dashboard - Full Page Slide-In */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed inset-0 z-[90] ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            {/* Header with Close Button */}
            <div className={`flex items-center justify-between max-w-4xl mx-auto px-4 sm:px-6 py-4 border-b ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Analytics
              </h2>
              <button
                onClick={() => setShowAnalytics(false)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="h-[calc(100vh-73px)] overflow-y-auto">
              <AnalyticsDashboard
                userId={user?.id || undefined}
                timeRange="30d"
                onTimeRangeChange={(range) => console.log('Time range:', range)}
                onExport={() => console.log('Export analytics')}
                onRefresh={() => console.log('Refresh analytics')}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Calendar Modal */}
      <AnimatePresence>
        {showEventCalendar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEventCalendar(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            />
            
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto rounded-2xl ${
                  theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                }`}
              >
                {/* Modal Header */}
                <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b backdrop-blur-sm ${
                  theme === 'dark' ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
                }`}>
                  <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Events Calendar
                  </h2>
                  <button
                    onClick={() => setShowEventCalendar(false)}
                    className={`p-2 rounded-lg ${
                      theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Event Calendar Component */}
                <div className="p-4">
                  <EventCalendar
                    onCreateEvent={() => console.log('Create event')}
                    onEventClick={(id) => console.log('Event clicked:', id)}
                    onRSVP={(id, status) => console.log('RSVP:', id, status)}
                  />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileCard;