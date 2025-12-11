import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home as HomeIcon,
  Bell,
  Search,
  User,
  Tv,
  Plus,
  Scale,
  X,
  Grid,
  Shield,
  Share2,
  Building2,
  Bot,
  MessageSquare,
  Heart,
  Users,
  RefreshCw,
  MessageCircle,
  Eye,
  CreditCard,
  Monitor,
  Activity,
  Briefcase,
} from 'lucide-react';

// ✅ PHASE 9: Onboarding Tour
import { OnboardingTour } from '@components/onboarding/OnboardingTour';

// ✅ FEED COMPONENTS
import { FeedComposer } from '@components/feeds/FeedComposer';
import { UnifiedFeedView } from '@components/feeds/UnifiedFeedView';
import { CircleHub } from '@components/feeds/CircleHub';

// ✅ DISCOVER COMPONENTS
import { RequestWorkFlow } from '@components/discover/RequestWorkFlow';


import { useNavigate } from 'react-router-dom';
import { GuardianDashboard } from './GuardianDashboard';
import * as Icons from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { logout as authLogout } from '@store/slices/authSlice';
import { clearUser } from '@store/slices/userSlice';

// Village Configurations
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

// ✅ PHASE 1-5: Core Components
import { JollofTVBubble } from '@components/common/JollofTVBubble';
import { ProfileCard } from './ProfileCard';
import { AfroIDSection } from './AfroIDSection';
import { SettingsPanel } from '@components/settings/SettingsPanel';
import NotificationCenter from '@components/notifications/NotificationCenter';
import { TwinPresenceToggle } from '@components/dashboard/TwinPresenceToggle';
import { RequestsSection } from '@components/home/RequestsSection';
import { ConnectionsSection } from '@components/home/ConnectionsSection';
import { CommunitySection } from '@components/home/CommunitySection';
import { FamilyTreeSection } from '@components/home/FamilyTreeSection';
import { ContentPreferencesSection } from '@components/home/ContentPreferencesSection';
import { VillageChangeSection } from '@components/home/VillageChangeSection';
import { VillageSelector } from '@components/village/VillageSelector';
import { RoleChangeRequest } from '@components/village/RoleChangeRequest';

// ✅ CHAT Components - DEFAULT IMPORTS
import MessageRequests from '@components/messaging/MessageRequests';
import TrustedConnections from '@components/messaging/TrustedConnections';
import { ChatInterface } from '@components/messaging/ChatInterface';

// ✅ PHASE 6: Business Session Components - DEFAULT IMPORTS
import BusinessSession from '@components/business/BusinessSession';
import EscrowManager from '@components/business/EscrowManager';
import DisputeResolution from '@components/business/DisputeResolution';
import SessionHistory from '@components/business/SessionHistory';
import  BusinessLinkBadge from '@components/business/BusinessLinkBadge';
import  PaymentReceipt  from '@components/business/PaymentReceipt';
import { RatingReview } from '@components/business/RatingReview';
import  WorkProofGallery from '@components/business/WorkProofGallery';
import { CAWSLawBanner } from '@components/business/CAWSLawBanner';
import { CallWitness } from '@components/business/CallWitness';
import { CircleMembershipOffer } from '@components/business/CircleMembershipOffer';

// ✅ PHASE 7: LINK Tab (Networking) Components - DEFAULT IMPORTS
import KinshipNetwork from '@components/network/KinshipNetwork';
import LinkRequest from '@components/network/LinkRequest';
import NetworkStats from '@components/network/NetworkStats';
import ConnectionCard from '@/components/network/ConnectionCard';

// ✅ PHASE 8: GUARD Tab (Security) Components - DEFAULT IMPORTS
import SecurityDashboard from '@components/security/SecurityDashboard';
import WatchfulEye from '@components/security/WatchfulEye';
import VerificationTiers from '@components/security/VerificationTiers';
import DeviceManager from '@components/security/DeviceManager';
import SessionMonitor from '@components/security/SessionMonitor';
import ProtectionModeScreen  from '@components/security/ProtectionModeScreen';
import EmergencyContactsManager from '@components/security/EmergencyContactsManager';
import CircleAlertFlow from '@components/security/CircleAlertFlow';

import type { ProtectionMode, EmergencyContact, CircleAlert } from '@/types/security.types';


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


interface Tool {
  toolId: string;
  toolName: string;
  description: string;
  icon?: string;
  category?: string;
}

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Navigation States
  const [showBusinessSession, setShowBusinessSession] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'profile' | 'tools' | 'business' | 'network' | 'security'>('home');
  const [activeBottomTab, setActiveBottomTab] = useState<'home' | 'social' | 'banking' | 'ai' | 'chat' | 'profile'>('home');
  const [activeHomeApp, setActiveHomeApp] = useState<string | null>(null);

  const [activeChatTab, setActiveChatTab] = useState<'requests' | 'trusted' | 'all'>('all');

  // Onboarding Tour State
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Jollof TV state
  const [isJollofTVVisible, setIsJollofTVVisible] = useState(false); 

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isJollofTVLive, _setIsJollofTVLive] = useState(true); // Set to true when live

  const [activeFeedType, setActiveFeedType] = useState<'feed' | 'circle'>('feed');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  
  // ✅ Sub-tab states for Phase 6, 7, 8
  const [activeBusinessTab, setActiveBusinessTab] = useState<'sessions' | 'escrow' | 'history' | 'disputes'>('sessions');
  const [activeNetworkTab, setActiveNetworkTab] = useState<'kinship' | 'requests' | 'stats'>('kinship');
  const [activeSecurityTab, setActiveSecurityTab] = useState<'dashboard' | 'watchful-eye' | 'verification' | 'devices' | 'sessions'>('dashboard');
  const [showCircleOffer, setShowCircleOffer] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showWorkProof, setShowWorkProof] = useState(false);
  const [currentProfessional, setCurrentProfessional] = useState<any>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  // Emergency Contacts & Circle Alert State
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      afro_id: 'AFR-001',
      display_name: 'Adebayo Johnson',
      relationship: 'Brother',
      phone: '8012345678'
    },
    {
      afro_id: 'AFR-002',
      display_name: 'Chidinma Okafor',
      relationship: 'Sister',
      phone: '8098765432'
    }
  ]);

  const [circleAlert, setCircleAlert] = useState<CircleAlert | null>(null);
  const [showCircleAlert, setShowCircleAlert] = useState(false);

    
  // Modal States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isVillageSelectorOpen, setIsVillageSelectorOpen] = useState(false);
  const [isRoleChangeRequestOpen, setIsRoleChangeRequestOpen] = useState(false);
  const [selectedVillageForChange, setSelectedVillageForChange] = useState<{
    villageId: string;
    villageName: string;
    villageColor: string;
    roleId: string;
    roleName: string;
    roleIcon: string;
  } | null>(null);

  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [showRequestWorkFlow, setShowRequestWorkFlow] = useState(false);
  
  // User States
  const [presenceMode, setPresenceMode] = useState<'spirit' | 'flesh'>('spirit');
  const [protectionMode, setProtectionMode] = useState<ProtectionMode | null>(null);

  // Chat Interface State
  const [selectedChat, setSelectedChat] = useState<{
    contactId: string;
    contactName: string;
    contactAvatar?: string;
    isOnline: boolean;
  } | null>(null);

  const [isChatFullScreen, setIsChatFullScreen] = useState(false);

  // Mock conversations (add this too)
  const mockConversations = [
    {
      id: 'user-1',
      name: 'Chioma Adeyemi',
      avatar: undefined,
      lastMessage: 'Thanks for your help with the project!',
      lastMessageTime: '2m ago',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: 'user-2',
      name: 'Kwame Osei',
      avatar: undefined,
      lastMessage: 'See you at the meeting tomorrow',
      lastMessageTime: '1h ago',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: 'user-3',
      name: 'Amara Nwosu',
      avatar: undefined,
      lastMessage: 'That sounds great! Let me know when you\'re ready',
      lastMessageTime: '3h ago',
      unreadCount: 1,
      isOnline: true
    }
  ];
  
  // Redux State
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  const userVillage = useAppSelector((state) => state.user.village);
  const userRole = useAppSelector((state) => state.user.role);
  const phoneNumber = useAppSelector((state) => state.auth.phoneNumber);
  const messageRequests = useAppSelector((state) => state.user.messageRequests);

  // Scroll-based Navigation Visibility
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll-based Navigation
  useEffect(() => {
    const handleScroll = () => {
      // Get scroll position - works for both window and containers
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      
      // Hide when scrolling down (past 100px)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      } 
      // Show when scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsNavVisible(true);
      }
      
      // Always show at very top
      if (currentScrollY < 50) {
        setIsNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };


    // Also listen to scroll on main container
    const handleContainerScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const currentScrollY = target.scrollTop;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsNavVisible(true);
      }
      
      if (currentScrollY < 50) {
        setIsNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Listen to window scroll
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Listen to scroll on all scrollable containers
    const scrollableContainers = document.querySelectorAll('[class*="overflow"]');
    scrollableContainers.forEach((container) => {
      container.addEventListener('scroll', handleContainerScroll, { passive: true });
    });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      scrollableContainers.forEach((container) => {
        container.removeEventListener('scroll', handleContainerScroll);
      });
    };
  }, [lastScrollY]);

  // Check onboarding status on mount
  useEffect(() => {
    if (user) {
      const hasCompletedTour = localStorage.getItem('onboardingCompleted');
      
      // Show tour for new users who haven't completed it
      if (!hasCompletedTour) {
        // Small delay for better UX (1 second)
        setTimeout(() => {
          setShowOnboarding(true);
        }, 1000);
      }
    }
  }, [user]);


  // Sample connections for testing ConnectionCard 
  const sampleConnections = [
    {
      id: '1',
      afroId: 'AFRO-2024-001',
      name: 'Chinwe Okafor',
      displayName: 'Chinwe Okafor',
      village: 'Technology',
      role: 'Senior Software Engineer',
      crest: 8,
      kinshipTier: 'C1' as const,
      location: { city: 'Lagos', country: 'Nigeria' },
      stats: { connections: 245, sessions: 32, rating: 4.8 },
      businessLink: {
        tier: 'verified' as const,
        totalSessions: 15,
        totalValue: 2500000
      },
      isOnline: true,
      mutualConnections: [
        { id: '2', name: 'Adewale Johnson' },
        { id: '3', name: 'Fatima Ahmed' },
        { id: '4', name: 'Emeka Nwankwo' }
      ]
    },
    {
      id: '2',
      afroId: 'AFRO-2024-002',
      name: 'Kwame Mensah',
      displayName: 'Kwame Mensah',
      village: 'Creative',
      role: 'UI/UX Designer',
      crest: 7,
      kinshipTier: 'C2' as const,
      location: { city: 'Accra', country: 'Ghana' },
      stats: { connections: 189, sessions: 24, rating: 4.6 },
      businessLink: {
        tier: 'trusted' as const,
        totalSessions: 8,
        totalValue: 1200000
      },
      isOnline: false,
      mutualConnections: [
        { id: '5', name: 'Aisha Mohammed' }
      ]
    },
    {
      id: '3',
      afroId: 'AFRO-2024-003',
      name: 'Amara Nkrumah',
      displayName: 'Amara Nkrumah',
      village: 'Business',
      role: 'Business Consultant',
      crest: 9,
      kinshipTier: 'C1' as const,
      location: { city: 'Nairobi', country: 'Kenya' },
      stats: { connections: 312, sessions: 48, rating: 4.9 },
      businessLink: {
        tier: 'elite' as const,
        totalSessions: 25,
        totalValue: 5000000
      },
      isOnline: true,
      mutualConnections: [
        { id: '6', name: 'Oluwaseun Balogun' },
        { id: '7', name: 'Thandiwe Moyo' }
      ]
    }
  ];


  // Village Configuration
  const villageConfig = userVillage?.villageId ? villageConfigs[userVillage.villageId] : null;
  const rolesOrGuilds = villageConfig?.roles || villageConfig?.guilds || [];
  const roleConfig = rolesOrGuilds.find((r: any) => 
    r.roleId === userRole?.roleId || r.guildId === userRole?.roleId
  );
  const tools: Tool[] = roleConfig?.tools || roleConfig?.extraTools || [];
  const villageColor = villageConfig?.color || villageConfig?.visual?.colorPrimary || '#10b981';
  const pendingRequestsCount = messageRequests.filter(r => r.status === 'pending').length;






  // Helper Functions
  const resolveIcon = (iconName?: string) => {
    if (!iconName) return Grid;
    const IconComp = (Icons as any)[iconName];
    return IconComp || Grid;
  };

  const RoleIcon = resolveIcon(roleConfig?.icon);
  const displayName = user?.full_name || user?.name || phoneNumber || 'User';
  const villageName = villageConfig?.villageName || villageConfig?.displayName || 'Dashboard';
  const roleName = roleConfig?.roleName || roleConfig?.guildName || 'User';
  
  // Mock Data
  const spiritAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=spirit';
  const fleshPhoto = 'https://api.dicebear.com/7.x/avataaars/svg?seed=real';
  const photoStatus: 'verified_real' | 'flagged_filtered' | 'rejected_ai' | 'not_uploaded' = 'verified_real';


  // ====== ONBOARDING HANDLERS ======
  const handleOnboardingComplete = async () => {
    // Save to localStorage immediately
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Optional: Save to backend asynchronously
    try {
      // await api.post('/api/user/complete-onboarding');
      console.log('Onboarding completed!');
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
    
    // Close tour
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('onboardingSkipped', 'true');
    setShowOnboarding(false);
  };

  // Event Handlers
  const handlePresenceToggle = (mode: 'spirit' | 'flesh') => {
    setPresenceMode(mode);
  };


  const handleCallWitness = (witnessData: any) => {
    console.log('Witness Alert:', witnessData);
    alert('Safety team alerted!');
  };


  const handleAcceptCircle = () => {
    console.log('Circle membership accepted');
    alert('Welcome to the Circle! You now have priority access.');
    setShowCircleOffer(false);
  };

  const handleSubmitRating = (ratingData: any) => {
    console.log('Rating submitted:', ratingData);
    alert('Thank you for your rating!');
    setShowRating(false);
  };

  const handleProofUpload = async (file: File, type: string, caption?: string) => {
    console.log('Uploading proof:', file.name, type, caption);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Proof uploaded successfully!');
  };

  const handleProofDelete = async (proofId: string) => {
    console.log('Deleting proof:', proofId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Proof deleted');
  };

  const handleCaptionUpdate = async (proofId: string, caption: string) => {
    console.log('Updating caption:', proofId, caption);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Caption updated');
  };

  const handleSessionComplete = () => {
    setCurrentProfessional({
      id: 'prof-123',
      name: 'John Doe',
      village: 'Construction Village',
      villageColor: '#10b981',
      crest: 4,
    });
    setShowCircleOffer(true);
  };

  const handleContactSupport = () => {
    console.log('Contacting support...');
  };

  const handleOpenVillageSelector = () => {
    setIsVillageSelectorOpen(true);
  };

  const handleSelectVillage = (villageId: string, roleId: string) => {
    const selectedVillage = villageConfigs[villageId];
    const selectedRole = selectedVillage?.roles?.find((r: any) => r.roleId === roleId);
    
    if (selectedVillage && selectedRole) {
      setSelectedVillageForChange({
        villageId,
        villageName: selectedVillage.villageName,
        villageColor: selectedVillage.color,
        roleId,
        roleName: selectedRole.roleName,
        roleIcon: selectedRole.icon,
      });
      setIsVillageSelectorOpen(false);
      setIsRoleChangeRequestOpen(true);
    }
  };

  const handleSubmitRoleChange = (data: any) => {
    console.log('Submitting role change:', data);
  };

  const handleLogout = () => {
    dispatch(authLogout());
    dispatch(clearUser());
    navigate('/auth/login', { replace: true });
  };

  const handleJollofTVClose = () => {
    setIsJollofTVVisible(false);
  };

  const handleJollofTVMaximize = () => {
    // TODO: Navigate to full-screen Jollof TV page or open modal
    console.log('Maximize Jollof TV - open full screen');
    alert('Full-screen Jollof TV coming soon!');
  };

  const handleSprayCowrie = (amount: number) => {
    // TODO: Process Cowrie payment
    console.log(`Sprayed ${amount} Cowries! 💰`);
    alert(`You sprayed ${amount} Cowries! 🪙`);
  };

  const handleRequestWork = (professional: any) => {
    setSelectedProfessional({
      id: professional.id,
      name: professional.name,
      role: professional.role,
      village: professional.village,
      villageColor: professional.villageColor,
      priceHint: professional.priceHint,
    });
    setShowRequestWorkFlow(true);
  };

  const handleSubmitWorkRequest = (requestData: any) => {
    console.log('Work Request Submitted:', requestData);
    alert(`Work request sent to ${selectedProfessional?.name}! They will respond soon.`);
    setShowRequestWorkFlow(false);
    setSelectedProfessional(null);
  };

  // Helper to check if view should be full-screen
  const isFullScreenView = activeView !== 'home';


  // handler functions for connection card
  const handleViewConnectionProfile = (connectionId: string) => {
    console.log('Viewing connection profile:', connectionId);
    // TODO: Navigate to connection profile or open modal
    // navigate(`/profile/${connectionId}`);
  };

  const handleSendConnectionMessage = (connectionId: string) => {
    console.log('Sending message to connection:', connectionId);
    // TODO: Open chat with connection
    // navigate(`/chat/${connectionId}`);
  };

  const handleRemoveConnection = (connectionId: string) => {
    console.log('Removing connection:', connectionId);
    // TODO: Show confirmation dialog and remove connection
    // if (confirm('Are you sure you want to remove this connection?')) {
    //   removeConnection(connectionId);
    // }
  };


  // ====== EMERGENCY CONTACTS HANDLERS ======
  const handleAddEmergencyContact = (contact: Omit<EmergencyContact, 'afro_id'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      afro_id: `AFR-${Date.now()}`
    };
    setEmergencyContacts([...emergencyContacts, newContact]);
    console.log('Emergency contact added:', newContact);
  };

  const handleRemoveEmergencyContact = (afroId: string) => {
    setEmergencyContacts(emergencyContacts.filter(c => c.afro_id !== afroId));
    console.log('Emergency contact removed:', afroId);
  };

  const handleUpdateEmergencyContact = (afroId: string, contact: Omit<EmergencyContact, 'afro_id'>) => {
    setEmergencyContacts(emergencyContacts.map(c => 
      c.afro_id === afroId ? { ...contact, afro_id: afroId } : c
    ));
    console.log('Emergency contact updated:', afroId);
  };

  // ====== CIRCLE ALERT HANDLERS ======
  const handleSendCircleAlert = async () => {
    console.log('Sending alert to circle...');
    
    const alert: CircleAlert = {
      alert_id: `ALERT-${Date.now()}`,
      status: 'pending',
      reason: 'suspicious_behavior',
      confirmations: [],
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    };
    
    setCircleAlert(alert);
    setShowCircleAlert(true);
    
    // Simulate sending notifications
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Alert sent to all contacts');
  };

  const handleCancelCircleAlert = () => {
    setCircleAlert(null);
    setShowCircleAlert(false);
    console.log('Circle alert cancelled');
  };

  // ====== PROTECTION MODE HANDLERS ======
  const handleRequestCircleFromProtection = () => {
    console.log('Requesting circle verification from protection mode');
    handleSendCircleAlert();
  };

  const handleTestProtectionMode = () => {
    const testMode: ProtectionMode = {
      active: true,
      reason: 'suspicious_behavior',
      restrictions: [
        'Large transactions',
        'Profile changes',
        'Adding new devices',
        'Changing security settings'
      ],
    };
    setProtectionMode(testMode);
  };

   // Helper function to determine which bottom tab should appear active
  const getActiveBottomTab = () => {
    // If we're in these views, they came from Profile menu, so keep Profile active
    if (['business', 'network', 'security', 'tools'].includes(activeView)) {
      return 'profile';
    }
    return activeBottomTab;
  };

  // Bottom Navigation Items
  const bottomNavItems = [
    { id: 'home', icon: HomeIcon, label: 'Home', color: '#10b981' },
    { id: 'social', icon: Share2, label: 'Social', color: '#3b82f6' },
    { id: 'banking', icon: Building2, label: 'Banking', color: '#f59e0b' },
    { id: 'ai', icon: Bot, label: 'AI Agent', color: '#8b5cf6' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', color: '#ec4899' },
    { id: 'profile', icon: User, label: 'Profile', color: '#6b7280' },
  ];

  // ✅ Business Tab Configuration
  const businessTabs = [
    { id: 'sessions', label: 'Sessions', icon: Briefcase },
    { id: 'escrow', label: 'Escrow', icon: Shield },
    { id: 'history', label: 'History', icon: Activity },
    { id: 'disputes', label: 'Disputes', icon: MessageSquare },
  ];

  // ✅ Network Tab Configuration
  const networkTabs = [
    { id: 'kinship', label: 'Kinship', icon: Users },
    { id: 'requests', label: 'Requests', icon: Heart },
    { id: 'stats', label: 'Stats', icon: Activity },
  ];

  // ✅ Security Tab Configuration
  const securityTabs = [
    { id: 'dashboard', label: 'Overview', icon: Shield },
    { id: 'watchful-eye', label: 'Watchful Eye', icon: Eye },
    { id: 'verification', label: 'Verification', icon: CreditCard },
    { id: 'devices', label: 'Devices', icon: Monitor },
    { id: 'sessions', label: 'Sessions', icon: Activity },
  ];

  // ✅ Feed Tab Configuration
   const feedTabs = [
    { id: 'feed', label: 'Soro soke', icon: Users, color: '#10b981' },
    { id: 'circle', label: 'Circle', icon: Users, color: '#8b5cf6' },
  ];

  // ✅ Chat Tab Configuration
  const chatTabs = [
    { id: 'all', label: 'All Chats', icon: MessageCircle },
    { id: 'requests', label: 'Requests', icon: MessageSquare },
    { id: 'trusted', label: 'Trusted', icon: Shield },
  ];

  return (
    <div className={`min-h-screen pb-20 mb-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Header */}
      <AnimatePresence>
        {isNavVisible && activeBottomTab !== 'profile' && (activeView === 'home' || !isFullScreenView) && !isChatFullScreen && !isChatFullScreen && (
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30 
            }}
            className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-none`}
          >
            {/* Main Header Content */}
            <div className="flex items-center justify-between px-1 py-4 max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
                >
                  <RoleIcon className="w-6 h-6" />
                </div>
                <div className="hidden sm:block">
                  <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {roleName}
                  </h1>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {villageName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
                <button 
                  className={`p-2 rounded-lg relative ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  onClick={() => setIsNotificationOpen(true)}
                >
                  <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  {pendingRequestsCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto max-w-4xl mx-auto mt-4" style={{ height: 'calc(100vh - 88px)' }}>
          <div className={isFullScreenView ? 'h-screen' : ''}>
            <AnimatePresence mode="wait">
              {/* HOME VIEW */}
              {activeView === 'home' && activeBottomTab === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8 p-2 max-w-6xl mx-auto"
                >
                  <div 
                    className=" p-4 sm:p-6 rounded-2xl text-white relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${villageColor} 0%, ${villageColor}dd 100%)` }}
                  >
                    <div className="relative z-10">
                      <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                        Welcome Home, {displayName}!
                      </h2>
                      <p className="text-white/90 text-sm sm:text-base mb-1">
                        You are now part of the digital Motherland
                      </p>
                      {user?.tribe && (
                        <p className="text-white font-semibold text-base sm:text-lg">
                          {user.tribe}
                        </p>
                      )}
                    </div>
                    <div className="absolute right-0 top-0 w-32 h-32 sm:w-48 sm:h-48 opacity-10">
                      <RoleIcon className="w-full h-full" />
                    </div>
                  </div>

                  {/* 6 App Icons */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-4">
                    <motion.button
                      onClick={() => setActiveHomeApp('requests')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 outline-none"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow relative">
                        <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        {pendingRequestsCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {pendingRequestsCount}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs sm:text-sm font-medium text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Requests
                      </span>
                    </motion.button>

                    <motion.button
                      onClick={() => setActiveHomeApp('connections')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 outline-none"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                        <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <span className={`text-xs sm:text-sm font-medium text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Connections
                      </span>
                    </motion.button>

                    <motion.button
                      onClick={() => setActiveHomeApp('community')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                        <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <span className={`text-xs sm:text-sm font-medium text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Community
                      </span>
                    </motion.button>

                    <motion.button
                      onClick={() => setActiveHomeApp('familytree')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 outline-none"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                        <span className="text-3xl sm:text-4xl">🌳</span>
                      </div>
                      <span className={`text-xs sm:text-sm font-medium text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Family Tree
                      </span>
                    </motion.button>

                    <motion.button
                      onClick={() => setActiveHomeApp('preferences')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 outline-none"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                        <span className="text-3xl sm:text-4xl">🎨</span>
                      </div>
                      <span className={`text-xs sm:text-sm font-medium text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Preferences
                      </span>
                    </motion.button>

                    <motion.button
                      onClick={() => setActiveHomeApp('village')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 outline-none"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                        <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <span className={`text-xs sm:text-sm font-medium text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Change Village
                      </span>
                    </motion.button>

                    {/* ICON 7: Jollof TV */}
                    <motion.button
                      onClick={() => setIsJollofTVVisible(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 outline-none"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow relative">
                        <Tv className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        {/* Live indicator */}
                        {isJollofTVLive && (
                          <div className="absolute -top-1 -right-1 flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded-full">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-white">LIVE</span>
                          </div>
                        )}
                      </div>
                      <span className={`text-xs sm:text-sm font-medium text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Jollof TV
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* SOCIAL VIEW */}
              {activeView === 'home' && activeBottomTab === 'social' && (
                <motion.div key="social" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="relative">
                  
                  {/* Feed Type Tabs - MUST BE INSIDE motion.header */}
                  {activeView === 'home' && activeBottomTab === 'social' && (
                    <div className="overflow-x-auto pb-2 hide-scrollbar max-w-4xl mx-auto">
                      <style>{`
                        .hide-scrollbar::-webkit-scrollbar {
                          display: none !important;
                        }
                        .hide-scrollbar {
                          -ms-overflow-style: none !important;
                          scrollbar-width: none !important;
                        }
                      `}</style>
                      
                      <div className="flex items-center gap-2 min-w-max">
                        {feedTabs.map((tab) => {
                          const Icon = tab.icon;
                          const isActive = activeFeedType === tab.id;
                          
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveFeedType(tab.id as any)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                                isActive
                                  ? 'text-white'
                                  : theme === 'dark'
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                              style={isActive ? { backgroundColor: tab.color } : {}}
                            >
                              <Icon className="w-4 h-4" />
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {activeFeedType === 'feed' && (
                      <motion.div key="feed-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <UnifiedFeedView onRequestWork={handleRequestWork} />
                      </motion.div>
                    )}
                    
                    {activeFeedType === 'circle' && (
                      <motion.div key="circle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <CircleHub />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {selectedProfessional && (
                    <RequestWorkFlow
                      isOpen={showRequestWorkFlow}
                      onClose={() => {
                        setShowRequestWorkFlow(false);
                        setSelectedProfessional(null);
                      }}
                      professional={selectedProfessional}
                      onSubmitRequest={handleSubmitWorkRequest}
                    />
                  )}

                  {/* Floating Create Post Button */}
                  <AnimatePresence>
                    {isNavVisible && (
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ 
                          type: 'spring', 
                          stiffness: 300, 
                          damping: 30 
                        }}
                        onClick={() => setIsComposerOpen(true)}
                        className="fixed bottom-24 right-6 outline-none md:right-12 md:bottom-28 w-12 h-12 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
                      >
                        <Plus className="w-6 h-6" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* BANKING VIEW */}
              {activeView === 'home' && activeBottomTab === 'banking' && (
                <motion.div key="banking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`p-12 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <Building2 className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Cowrie Banking</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Send, receive, and manage your Cowries (Wari tokens)</p>
                </motion.div>
              )}

              {/* AI AGENT VIEW */}
              {activeView === 'home' && activeBottomTab === 'ai' && (
                <motion.div key="ai" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`p-12 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <Bot className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>AI Agent</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Your intelligent assistant for professional guidance</p>
                </motion.div>
              )}

              {/* CHAT VIEW */}
              {activeView === 'home' && activeBottomTab === 'chat' && (
                <motion.div 
                  key="chat" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 p-1"
                >
                  <div>
                    <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Messages & Whispers
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Your conversations and connection requests
                    </p>
                  </div>

                  {/* Chat Tabs */}
                  <div className={`flex gap-2 overflow-x-auto pb-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    {chatTabs.map((tab) => {
                      const TabIcon = tab.icon;
                      const isActive = activeChatTab === tab.id;
                      
                      // Count badges
                      const requestCount = tab.id === 'requests' 
                        ? messageRequests.filter(r => r.status === 'pending').length 
                        : 0;
                      
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveChatTab(tab.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors relative ${
                            isActive
                              ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                              : theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <TabIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">{tab.label}</span>
                          {requestCount > 0 && tab.id === 'requests' && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                              {requestCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Chat Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeChatTab === 'all' && (
                      <motion.div 
                        key="all-chats" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                      >
                        {selectedChat ? (
                          <div className="fixed inset-0 z-[60] bg-white dark:bg-gray-900">
                            <ChatInterface
                              contactId={selectedChat.contactId}
                              contactName={selectedChat.contactName}
                              contactAvatar={selectedChat.contactAvatar}
                              isOnline={selectedChat.isOnline}
                              onBack={() => {
                                setSelectedChat(null);
                                setIsChatFullScreen(false);
                              }}
                              onVoiceCall={() => {
                                console.log('Voice call:', selectedChat.contactId);
                              }}
                              onVideoCall={() => {
                                console.log('Video call:', selectedChat.contactId);
                              }}
                              onViewProfile={() => {
                                console.log('View profile:', selectedChat.contactId);
                              }}
                            />
                          </div>
                        ) : (
                          // Chat list UI
                          <div className="space-y-3">
                            <h3 className={`text-lg font-bold px-2 ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              Recent Conversations
                            </h3>
                            
                            {mockConversations.length > 0 ? (
                              <div className="space-y-2">
                                {mockConversations.map((conversation) => (
                                  <button
                                    key={conversation.id}
                                    onClick={() => {
                                      setSelectedChat({
                                        contactId: conversation.id,
                                        contactName: conversation.name,
                                        contactAvatar: conversation.avatar,
                                        isOnline: conversation.isOnline
                                      });
                                      setIsChatFullScreen(true); // 👈 SET FULL-SCREEN MODE
                                    }}
                                    className={`w-full p-4 rounded-xl flex items-center gap-3 transition-colors ${
                                      theme === 'dark' 
                                        ? 'bg-gray-800 hover:bg-gray-750' 
                                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                                    }`}
                                  >
                                    {/* Chat list item content */}
                                    <div className="relative flex-shrink-0">
                                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                      }`}>
                                        {conversation.avatar ? (
                                          <img 
                                            src={conversation.avatar} 
                                            alt={conversation.name}
                                            className="w-full h-full rounded-full object-cover"
                                          />
                                        ) : (
                                          <span className={`text-lg font-bold ${
                                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                                          }`}>
                                            {conversation.name.charAt(0)}
                                          </span>
                                        )}
                                      </div>
                                      {conversation.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                                      )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 text-left">
                                      <div className="flex items-center justify-between mb-1">
                                        <p className={`font-semibold truncate ${
                                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                          {conversation.name}
                                        </p>
                                        <span className={`text-xs flex-shrink-0 ml-2 ${
                                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                        }`}>
                                          {conversation.lastMessageTime}
                                        </span>
                                      </div>
                                      <p className={`text-sm truncate ${
                                        conversation.unreadCount > 0
                                          ? theme === 'dark' ? 'text-white font-medium' : 'text-gray-900 font-medium'
                                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                      }`}>
                                        {conversation.lastMessage}
                                      </p>
                                    </div>
                                    
                                    {conversation.unreadCount > 0 && (
                                      <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {conversation.unreadCount}
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className={`p-12 rounded-2xl text-center ${
                                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                              }`}>
                                <MessageCircle className={`w-16 h-16 mx-auto mb-4 ${
                                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                                }`} />
                                <h3 className={`text-xl font-bold mb-2 ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  No conversations yet
                                </h3>
                                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Start a conversation from your connections
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                    
                    {activeChatTab === 'requests' && (
                      <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <MessageRequests />
                      </motion.div>
                    )}
                    
                    {activeChatTab === 'trusted' && (
                      <motion.div key="trusted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <TrustedConnections />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* PROFILE VIEW */}
              {activeView === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 max-w-4xl mx-auto p-4">
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
                  <ProfileCard viewType="self" onEditProfile={() => console.log('Edit profile')} />
                  <GuardianDashboard
                    shield={{
                      afro_id: user?.afro_id || '',
                      overall_state: 'calm',
                      last_updated: new Date(),
                      guardians: {
                        voice_spirit: { status: 'ok', last_check: new Date(), message: 'Voice pattern matches your blessing', voiceprint_match_score: 95 },
                        drum_binding: { status: 'ok', last_check: new Date(), message: 'This device is blessed and recognized', registered_devices: 2, current_device_blessed: true },
                        footsteps: { status: 'ok', last_check: new Date(), message: 'Your movements are consistent and familiar', anomaly_score: 5 },
                        cultural_memory: { status: 'ok', last_check: new Date(), message: 'Your identity remains true to your oath', consistency_score: 92 },
                      },
                      recommended_restrictions: [],
                      requires_clan_blessing: false,
                    }}
                    showDetails={true}
                  />
                  <AfroIDSection showWarning={true} allowDownload={true} allowShare={true} />
                  
                  {/* Analytics Section */}
                  <div className={`p-8 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                    <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Analytics
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>248</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Connections</p>
                      </div>
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1.2k</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Views</p>
                      </div>
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>42</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Posts</p>
                      </div>
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>89%</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Engagement</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ✅ PHASE 6: BUSINESS VIEW - WITH SUB-TABS */}
              {activeView === 'business' && (
                <motion.div key="business" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 p-4">
                  <div>
                    <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Business Sessions
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Manage your professional engagements
                    </p>
                  </div>

                  {/* Business Tabs */}
                  <div className={`flex gap-2 overflow-x-auto pb-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    {businessTabs.map((tab) => {
                      const TabIcon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveBusinessTab(tab.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                            activeBusinessTab === tab.id
                              ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                              : theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <TabIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Business Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeBusinessTab === 'sessions' && (
                      <motion.div key="sessions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {showBusinessSession ? (
                          <div className="space-y-6">
                            {/* 1. CAWS LAW BANNER */}
                            <CAWSLawBanner 
                              sessionType="work"
                              isExpanded={false}
                            />
                            
                            {/* 2. BUSINESS SESSION COMPONENT */}
                            <BusinessSession 
                              professionalId="prof-123"
                              professionalName="John Doe"
                              professionalVillage={villageName}
                              professionalVillageColor={villageColor}
                              professionalCrest={8}
                              serviceType="Professional Service"
                              onClose={() => {
                                console.log('Closing BusinessSession');
                                setShowBusinessSession(false);
                              }}
                            />
                            
                            {/* 4. BUSINESS LINK BADGE */}
                            <div className={`p-4 rounded-xl ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            }`}>
                              <h3 className={`text-sm font-semibold mb-3 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                Your Partnership Status
                              </h3>
                              <BusinessLinkBadge
                                otherParty={{
                                  id: 'prof-123',
                                  name: 'John Doe',
                                  afroId: 'CONS-ELEC-001',
                                  village: 'Construction Village',
                                  crest: 8
                                }}
                                linkTier="trusted"
                                stats={{
                                  totalSessions: 5,
                                  completedSessions: 5,
                                  totalValue: 125000,
                                  averageRating: 4.8,
                                  firstSessionDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                                  lastSessionDate: new Date().toISOString(),
                                  successRate: 100
                                }}
                                size="large"
                                showDetails={true}
                              />
                            </div>
                            
                            {/* ACTION BUTTONS ROW */}
                            <div className="flex items-center gap-3 flex-wrap">
                              {/* 3. CALL WITNESS BUTTON */}
                              <CallWitness
                                sessionId="sess-123"
                                location="Port Harcourt, Rivers State"
                                onCallWitness={handleCallWitness}
                              />
                              
                              {/* 7. VIEW WORK PROOF BUTTON */}
                              <button
                                onClick={() => setShowWorkProof(true)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                  theme === 'dark'
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                              >
                                View Work Proof
                              </button>
                              
                              {/* COMPLETE SESSION BUTTON (triggers Circle offer) */}
                              <button
                                onClick={handleSessionComplete}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                  theme === 'dark'
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                              >
                                Complete Session
                              </button>
                              
                              {/* 6. LEAVE RATING BUTTON */}
                              <button
                                onClick={() => setShowRating(true)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                  theme === 'dark'
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                                }`}
                              >
                                Leave Rating
                              </button>
                              
                              {/* 5. VIEW RECEIPT BUTTON */}
                              <button
                                onClick={() => setShowReceipt(true)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                  theme === 'dark'
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                                }`}
                              >
                                View Receipt
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className={`p-6 rounded-xl border text-center ${
                              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`}>
                              <Briefcase className={`w-12 h-12 mx-auto mb-3 ${
                                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                              }`} />
                              <h3 className={`text-lg font-bold mb-2 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                No Active Sessions
                              </h3>
                              <p className={`text-sm mb-4 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                Start a new business session with a professional
                              </p>
                              <button
                                onClick={() => setShowBusinessSession(true)}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                              >
                                Start New Session
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                    
                    {/* ESCROW TAB */}
                    {activeBusinessTab === 'escrow' && (
                      <motion.div key="escrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <EscrowManager 
                          escrowId="esc-456"
                          amount={45000}
                          currency="NGN"
                          payerId={user?.id || 'user-123'}
                          beneficiaryId="prof-123"
                          payerName={displayName}
                          beneficiaryName="John Doe"
                          status="locked"
                          createdAt={new Date().toISOString()}
                          onFund={() => console.log('Fund escrow')}
                          onRelease={() => console.log('Release escrow')}
                          onRefund={() => console.log('Refund escrow')}
                          onRaiseDispute={(reason, evidence) => console.log('Raise dispute', reason, evidence)}
                        />
                      </motion.div>
                    )}
                    
                    {/* HISTORY TAB */}
                    {activeBusinessTab === 'history' && (
                      <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <SessionHistory 
                          userId={user?.id || 'user-123'}
                          transactions={[]}
                          isLoading={false}
                          onViewDetails={(sessionId) => console.log('View details', sessionId)}
                          onDownloadReceipt={(receiptId) => console.log('Download receipt', receiptId)}
                          onViewDispute={(sessionId) => console.log('View dispute', sessionId)}
                        />
                      </motion.div>
                    )}
                    
                    {/* DISPUTES TAB */}
                    {activeBusinessTab === 'disputes' && (
                      <motion.div key="disputes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {/* Disputes List/Button to Open Modal */}
                        <div className="space-y-4">
                          <div className={`p-6 rounded-xl border text-center ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                          }`}>
                            <Scale className={`w-12 h-12 mx-auto mb-3 ${
                              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                            }`} />
                            <h3 className={`text-lg font-bold mb-2 ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              Active Dispute
                            </h3>
                            <p className={`text-sm mb-4 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              You have an ongoing dispute that needs resolution
                            </p>
                            <button
                              onClick={() => setShowDisputeModal(true)}
                              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
                            >
                              View Dispute Details
                            </button>
                          </div>
                        </div>

                        {/* Dispute Resolution Modal */}
                        {showDisputeModal && (
                          <DisputeResolution 
                            escrowId="esc-456"
                            disputeId="disp-789"
                            mootId="moot-101"
                            sessionId="sess-202"
                            amount={45000}
                            raisedBy="payer"
                            status="evidence_submission"
                            parties={{
                              payer: { id: user?.id || 'user-123', name: displayName, crest: 7 },
                              beneficiary: { id: 'prof-123', name: 'John Doe', crest: 8 }
                            }}
                            mediator={{
                              id: 'med-303',
                              name: 'Elder Smith',
                              village: villageName,
                              crest: 10,
                              mootsResolved: 45
                            }}
                            evidence={[]}
                            messages={[]}
                            timeline={{
                              initiated: new Date().toISOString(),
                              mediatorAssigned: new Date().toISOString(),
                              evidenceDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                            }}
                            onFileUpload={async (file, description) => console.log('File upload', file, description)}
                            onSendMessage={async (message, isPrivate) => console.log('Send message', message, isPrivate)}
                            onAcceptResolution={async () => {
                              console.log('Accept resolution');
                              setShowDisputeModal(false); // ✅ Close modal
                            }}
                            onRejectResolution={async () => {
                              console.log('Reject resolution');
                              setShowDisputeModal(false); // ✅ Close modal
                            }}
                            onEscalate={async (reason) => {
                              console.log('Escalate', reason);
                              setShowDisputeModal(false); // ✅ Close modal
                            }}
                            onClose={() => setShowDisputeModal(false)} 
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  
                  
                  {/* 3. CIRCLE MEMBERSHIP OFFER MODAL */}
                  {currentProfessional && (
                    <CircleMembershipOffer
                      isOpen={showCircleOffer}
                      onClose={() => setShowCircleOffer(false)}
                      professionalId={currentProfessional.id}
                      professionalName={currentProfessional.name}
                      professionalVillage={currentProfessional.village}
                      professionalVillageColor={currentProfessional.villageColor}
                      professionalCrest={currentProfessional.crest}
                      onAccept={handleAcceptCircle}
                    />
                  )}
                  
                  {/* 5. PAYMENT RECEIPT MODAL */}
                  {showReceipt && (
                    <PaymentReceipt
                      receiptId="REC-2024-001"
                      sessionId="SESS-123"
                      escrowId="ESC-456"
                      date={new Date().toISOString()}
                      payer={{
                        name: displayName,
                        afroId: user?.afro_id || 'AFR-000',
                        village: villageName
                      }}
                      beneficiary={{
                        name: 'John Doe',
                        afroId: 'CONS-ELEC-001',
                        village: 'Construction Village'
                      }}
                      service={{
                        name: 'Electrical Installation',
                        category: 'Construction Services'
                      }}
                      subtotal={45000}
                      platformFee={2250}
                      total={47250}
                      paymentMethod="escrow"
                      status="paid"
                      completedAt={new Date().toISOString()}
                      notes="Payment released after successful completion and client approval"
                      onClose={() => setShowReceipt(false)}
                    />
                  )}
                  
                  {/* 6. RATING & REVIEW MODAL */}
                  {currentProfessional && (
                    <RatingReview
                      isOpen={showRating}
                      onClose={() => setShowRating(false)}
                      sessionId="SESS-123"
                      ratingFor="professional"
                      targetUserId={currentProfessional.id}
                      targetUserName={currentProfessional.name}
                      targetUserVillage={currentProfessional.village}
                      targetUserVillageColor={currentProfessional.villageColor}
                      serviceType="Electrical Installation"
                      onSubmit={handleSubmitRating}
                      onSkip={() => setShowRating(false)}
                    />
                  )}
                  
                  {/* 7. WORK PROOF GALLERY MODAL */}
                  {showWorkProof && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                      <div className="max-w-6xl w-full max-h-[90vh] overflow-auto relative">
                        <WorkProofGallery
                          sessionId="SESS-123"
                          proofs={[
                            {
                              id: 'proof-1',
                              type: 'before',
                              mediaType: 'image',
                              url: 'https://via.placeholder.com/400',
                              fileName: 'before-1.jpg',
                              fileSize: 1024000,
                              uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                              uploadedBy: 'beneficiary',
                              caption: 'Initial state before work started',
                              order: 1
                            },
                            {
                              id: 'proof-2',
                              type: 'progress',
                              mediaType: 'image',
                              url: 'https://via.placeholder.com/400',
                              fileName: 'progress-1.jpg',
                              fileSize: 1024000,
                              uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                              uploadedBy: 'beneficiary',
                              caption: 'Work in progress - wiring completed',
                              order: 2
                            },
                            {
                              id: 'proof-3',
                              type: 'after',
                              mediaType: 'image',
                              url: 'https://via.placeholder.com/400',
                              fileName: 'after-1.jpg',
                              fileSize: 1024000,
                              uploadedAt: new Date().toISOString(),
                              uploadedBy: 'beneficiary',
                              caption: 'Final result - all installations complete',
                              order: 3
                            }
                          ]}
                          canUpload={true}
                          userRole="payer"
                          sessionStatus="in_progress"
                          onUpload={handleProofUpload}
                          onDelete={handleProofDelete}
                          onUpdateCaption={handleCaptionUpdate}
                        />
                        
                        {/* Close Button */}
                        <button
                          onClick={() => setShowWorkProof(false)}
                          className="absolute top-4 right-4 p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors z-10"
                        >
                          <X className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ✅ PHASE 7: NETWORK VIEW - WITH SUB-TABS */}
              {activeView === 'network' && (
                <motion.div key="network" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  {/* Header */}
                  <div className="p-2 md:p-4">
                    <h2 className={`text-xl md:text-3xl font-bold mb-1 md:mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Kinship Network
                    </h2>
                    <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Your professional connections and community
                    </p>
                  </div>

                  {/* Network Tabs */}
                  <div className={`flex gap-2 overflow-x-auto px-2 md:px-4 pb-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b hide-scrollbar`}>
                    {networkTabs.map((tab) => {
                      const TabIcon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveNetworkTab(tab.id as any)}
                          className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg whitespace-nowrap transition-colors ${
                            activeNetworkTab === tab.id
                              ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                              : theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <TabIcon className="w-4 h-4" />
                          <span className="text-xs md:text-sm font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Network Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeNetworkTab === 'kinship' && (
                      <motion.div key="kinship" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="space-y-4 md:space-y-6">
                          {/* Featured Connection - Detailed View */}
                          <div className="p-2 md:p-4">
                            <h3 className={`text-base md:text-lg font-bold mb-3 md:mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              Featured Connection
                            </h3>
                            <ConnectionCard
                              connection={sampleConnections[0]}
                              size="detailed"
                              showActions={true}
                              onViewProfile={handleViewConnectionProfile}
                              onSendMessage={handleSendConnectionMessage}
                              onRemove={handleRemoveConnection}
                            />
                          </div>

                          {/* All Connections - Grid View */}
                          <div className="p-2 md:p-4">
                            <h3 className={`text-base md:text-lg font-bold mb-3 md:mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              Your Connections
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                              {sampleConnections.map((connection) => (
                                <ConnectionCard
                                  key={connection.id}
                                  connection={connection}
                                  size="default"
                                  showActions={true}
                                  onViewProfile={handleViewConnectionProfile}
                                  onSendMessage={handleSendConnectionMessage}
                                  onRemove={handleRemoveConnection}
                                />
                              ))}
                            </div>
                          </div>

                          {/* KinshipNetwork Component - NO EXTRA PADDING */}
                          <div>
                            <KinshipNetwork 
                              userId={user?.id || 'user-123'}
                              userVillage={villageName}
                              connections={[]}
                              pendingRequests={0}
                              isLoading={false}
                              onViewProfile={handleViewConnectionProfile}
                              onSendMessage={handleSendConnectionMessage}
                              onViewRequests={() => setActiveNetworkTab('requests')}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {activeNetworkTab === 'requests' && (
                      <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-2 md:p-4">
                        <LinkRequest 
                          currentUserId={user?.id || 'user-123'}
                          receivedRequests={[]}
                          sentRequests={[]}
                          suggestions={[]}
                          isLoading={false}
                          onAcceptRequest={async (requestId) => console.log('Accept request', requestId)}
                          onRejectRequest={async (requestId) => console.log('Reject request', requestId)}
                          onCancelRequest={async (requestId) => console.log('Cancel request', requestId)}
                          onSendRequest={async (userId, message) => console.log('Send request', userId, message)}
                          onViewProfile={(userId) => console.log('View profile', userId)}
                        />
                      </motion.div>
                    )}
                    
                    {activeNetworkTab === 'stats' && (
                      <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-2 md:p-4">
                        <NetworkStats 
                          userId={user?.id || 'user-123'}
                          metrics={{
                            totalConnections: 248,
                            newConnectionsThisWeek: 12,
                            connectionGrowthRate: 15.5,
                            averageCrest: 7.2,
                            totalSessions: 156,
                            activeConnections: 189,
                            mutualConnectionRate: 0.68
                          }}
                          villageDistribution={[
                            { village: villageName, count: 85, percentage: 34 },
                            { village: 'Technology', count: 62, percentage: 25 },
                            { village: 'Creative', count: 48, percentage: 19 },
                            { village: 'Business', count: 35, percentage: 14 },
                            { village: 'Healthcare', count: 18, percentage: 8 }
                          ]}
                          tierDistribution={[
                            { tier: 'C1', count: 156, percentage: 63 },
                            { tier: 'C2', count: 68, percentage: 27 },
                            { tier: 'C3', count: 24, percentage: 10 }
                          ]}
                          engagementData={{
                            messagesExchanged: 1247,
                            profileViews: 3456,
                            sessionRequests: 89,
                            averageResponseTime: '2h'
                          }}
                          growthData={[
                            { period: 'Jan', connections: 180, sessions: 45 },
                            { period: 'Feb', connections: 195, sessions: 52 },
                            { period: 'Mar', connections: 210, sessions: 63 },
                            { period: 'Apr', connections: 228, sessions: 78 },
                            { period: 'May', connections: 248, sessions: 89 }
                          ]}
                          topConnections={[
                            { id: '1', name: 'Sarah Johnson', village: 'Technology', sessions: 23, mutualConnections: 45 },
                            { id: '2', name: 'Michael Chen', village: 'Creative', sessions: 18, mutualConnections: 38 },
                            { id: '3', name: 'Amina Okafor', village: villageName, sessions: 15, mutualConnections: 52 }
                          ]}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              // ✅ PHASE 8: SECURITY VIEW - WITH SUB-TABS (Fixed)
              {activeView === 'security' && (
                <motion.div key="security" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 p-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Ancestral Shield
                      </h2>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Your complete security and verification system
                      </p>
                    </div>
                  </div>

                  {/* Test Controls - Remove in Production */}
                  <div className={`rounded-xl p-4 border ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <h4 className={`text-sm font-semibold mb-3 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Security Testing (Remove in Production)</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleTestProtectionMode}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
                      >
                        Test Protection Mode
                      </button>
                      <button
                        onClick={() => {
                          handleSendCircleAlert();
                          setActiveSecurityTab('dashboard');
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                      >
                        Test Circle Alert
                      </button>
                    </div>
                  </div>

                  {/* Security Tabs */}
                  <div className={`flex gap-2 overflow-x-auto pb-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    {securityTabs.map((tab) => {
                      const TabIcon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveSecurityTab(tab.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                            activeSecurityTab === tab.id
                              ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                              : theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <TabIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Security Tab Content */}
                  <AnimatePresence mode="wait">
                    {/* DASHBOARD TAB */}
                    {activeSecurityTab === 'dashboard' && (
                      <motion.div key="security-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="space-y-6">
                          {/* Circle Alert Flow - Show when active */}
                          {showCircleAlert && circleAlert && (
                            <CircleAlertFlow
                              alert={circleAlert}
                              contacts={emergencyContacts}
                              onSendAlert={handleSendCircleAlert}
                              onCancel={handleCancelCircleAlert}
                            />
                          )}

                          {/* Emergency Contacts Manager */}
                          <EmergencyContactsManager
                            contacts={emergencyContacts}
                            maxContacts={5}
                            onAdd={handleAddEmergencyContact}
                            onRemove={handleRemoveEmergencyContact}
                            onUpdate={handleUpdateEmergencyContact}
                          />

                          {/* Security Dashboard */}
                          <SecurityDashboard 
                            userId={user?.id || 'user-123'}
                            metrics={{
                              overallScore: 85,
                              securityLevel: 'high',
                              threatLevel: 'low',
                              lastSecurityCheck: new Date().toISOString(),
                              protectionModesActive: 4
                            }}
                            verificationStatus={{
                              crest: 7,
                              shield: {
                                level: 3,
                                maxLevel: 5,
                                status: 'active'
                              },
                              honor: {
                                stage: 2,
                                maxStage: 5,
                                title: 'Trusted Member'
                              }
                            }}
                            recentActivity={[
                              {
                                id: '1',
                                type: 'login',
                                description: 'Successful login from Lagos',
                                timestamp: new Date().toISOString(),
                                location: 'Lagos, Nigeria',
                                device: 'iPhone 14',
                                status: 'success'
                              }
                            ]}
                            trustedDevices={[
                              {
                                id: 'dev-1',
                                name: 'iPhone 14',
                                type: 'mobile',
                                lastUsed: new Date().toISOString(),
                                location: 'Lagos, Nigeria',
                                isCurrentDevice: true
                              }
                            ]}
                            emergencyContacts={emergencyContacts.length}
                            activeSessions={1}
                            protectionModeActive={!!protectionMode}
                            onViewActivity={() => console.log('View activity')}
                            onManageDevices={() => setActiveSecurityTab('devices')}
                            onManageContacts={() => console.log('Manage contacts')}
                            onViewSessions={() => setActiveSecurityTab('sessions')}
                            onConfigureSecurity={() => console.log('Configure security')}
                            onActivateProtection={() => console.log('Activate protection')}
                          />
                        </div>
                      </motion.div>
                    )}
                    
                    {/* WATCHFUL-EYE TAB */}
                    {activeSecurityTab === 'watchful-eye' && (
                      <motion.div key="watchful-eye" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <WatchfulEye 
                          isActive={true}
                          reason="transaction"
                          transactionAmount={45000}
                          onCaptureComplete={async (capture) => {
                            console.log('Capture complete', capture);
                            return true;
                          }}
                          onCancel={() => setActiveSecurityTab('dashboard')}
                          onSkip={() => setActiveSecurityTab('dashboard')}
                        />
                      </motion.div>
                    )}
                    
                    {/* VERIFICATION TAB */}
                    {activeSecurityTab === 'verification' && (
                      <motion.div key="verification" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <VerificationTiers 
                          crest={{
                            level: 7,
                            maxLevel: 10,
                            progress: 65,
                            nextLevelRequirements: {
                              transactions: 50,
                              rating: 4.5,
                              timeInDays: 90
                            },
                            benefits: [
                              'Access to premium tools',
                              'Priority support',
                              'Lower transaction fees',
                              'Verified badge'
                            ]
                          }}
                          shield={{
                            level: 3,
                            maxLevel: 5,
                            status: 'active',
                            protections: [
                              {
                                name: 'Two-Factor Authentication',
                                enabled: true,
                                description: 'Extra layer of security for your account'
                              },
                              {
                                name: 'Device Recognition',
                                enabled: true,
                                description: 'Automatic detection of trusted devices'
                              },
                              {
                                name: 'Face Verification',
                                enabled: false,
                                description: 'Biometric verification for sensitive actions'
                              }
                            ],
                            vulnerabilities: []
                          }}
                          honor={{
                            stage: 2,
                            maxStage: 5,
                            title: 'Trusted Member',
                            description: 'You have established yourself as a reliable community member',
                            achievements: [
                              {
                                name: 'Complete Profile',
                                completed: true,
                                description: 'Fill out all profile information'
                              },
                              {
                                name: 'First Connection',
                                completed: true,
                                description: 'Make your first professional connection'
                              },
                              {
                                name: 'Verified Identity',
                                completed: false,
                                description: 'Complete identity verification process'
                              }
                            ],
                            nextStageRequirements: [
                              'Complete 100 successful transactions',
                              'Maintain 4.5+ rating for 6 months',
                              'Verify your identity with government ID'
                            ]
                          }}
                          onUpgradeCrest={() => console.log('Upgrade crest')}
                          onActivateShield={() => console.log('Activate shield')}
                          onViewAchievements={() => console.log('View achievements')}
                        />
                      </motion.div>
                    )}
                    
                    {/* DEVICES TAB */}
                    {activeSecurityTab === 'devices' && (
                      <motion.div key="devices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <DeviceManager 
                          devices={[
                            {
                              id: 'dev-1',
                              name: 'iPhone 14',
                              type: 'mobile',
                              browser: 'safari',
                              browserVersion: '17.0',
                              os: 'iOS',
                              osVersion: '17.0',
                              status: 'active',
                              location: {
                                city: 'Lagos',
                                country: 'Nigeria'
                              },
                              ipAddress: '197.210.x.x',
                              lastActive: new Date(),
                              firstSeen: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                              isCurrent: true,
                              trustScore: 95,
                              loginCount: 156
                            }
                          ]}
                          currentDeviceId="dev-1"
                          onTrustDevice={(deviceId) => console.log('Trust device', deviceId)}
                          onBlockDevice={(deviceId) => console.log('Block device', deviceId)}
                          onRemoveDevice={(deviceId) => console.log('Remove device', deviceId)}
                          onRefreshDevices={() => console.log('Refresh devices')}
                          onAddDevice={() => console.log('Add device')}
                        />
                      </motion.div>
                    )}
                    
                    {/* SESSIONS TAB */}
                    {activeSecurityTab === 'sessions' && (
                      <motion.div key="sessions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <SessionMonitor 
                          sessions={[
                            {
                              id: 'sess-1',
                              deviceName: 'iPhone 14',
                              deviceType: 'mobile',
                              browser: 'Safari',
                              browserVersion: '17.0',
                              os: 'iOS 17.0',
                              location: {
                                city: 'Lagos',
                                country: 'Nigeria',
                                ip: '197.210.x.x'
                              },
                              status: 'active',
                              startedAt: new Date(),
                              lastActivity: new Date(),
                              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                              isCurrent: true,
                              isSecure: true,
                              activities: [
                                {
                                  timestamp: new Date(),
                                  action: 'Logged in',
                                  details: 'From Lagos, Nigeria'
                                }
                              ]
                            }
                          ]}
                          onTerminateSession={(sessionId) => console.log('Terminate session', sessionId)}
                          onTerminateAllOthers={() => console.log('Terminate all others')}
                          onRefreshSessions={() => console.log('Refresh sessions')}
                          maxConcurrentSessions={5}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* TOOLS VIEW */}
              {activeView === 'tools' && (
                <motion.div key="tools" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 p-4">
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>My Tools</h2>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{tools.length} tools available for {roleName}</p>
                  </div>
                  
                  {tools.length === 0 ? (
                    <div className={`p-12 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                      <Grid className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                      <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>No Tools Available Yet</h3>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Complete your profile verification to access your professional tools
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {tools.map((tool) => {
                        const ToolIcon = resolveIcon(tool.icon);
                        return (
                          <motion.button 
                            key={tool.toolId} 
                            whileHover={{ scale: 1.02 }} 
                            whileTap={{ scale: 0.98 }} 
                            className={`p-6 rounded-xl text-left transition-all ${
                              theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'
                            }`}
                          >
                            <div 
                              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" 
                              style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
                            >
                              <ToolIcon className="w-7 h-7" />
                            </div>
                            <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {tool.toolName}
                            </h4>
                            <p className={`text-sm line-clamp-2 mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {tool.description}
                            </p>
                            {tool.category && (
                              <span 
                                className="inline-block px-2 py-1 text-xs rounded-full" 
                                style={{ backgroundColor: `${villageColor}15`, color: villageColor }}
                              >
                                {tool.category}
                              </span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {activeBottomTab === 'profile' && (
                <motion.div 
                  key="profile-tab-view" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <ProfileCard
                    viewType="self"
                    isVisible={true}
                    onEditProfile={() => console.log('Edit profile')}
                    onNavigate={(view) => {
                      setActiveView(view);
                      setActiveBottomTab('home');
                    }}
                    onLogout={handleLogout}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    currentView={activeView}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Bottom Navigation Bar */}
        <AnimatePresence>
          {isNavVisible && activeBottomTab !== 'profile' && (activeView === 'home' || !isFullScreenView) && !isChatFullScreen && (
            <motion.nav
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30 
              }}
              className={`fixed bottom-0 left-0 right-0 z-50 h-22 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border-t`}
            >
              <div className="flex items-center justify-between px-2 py-2 max-w-4xl mx-auto">
                {bottomNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = getActiveBottomTab() === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveBottomTab(item.id as any);
                        setActiveView('home');  
                      }}
                      className={`flex flex-col outline-none items-center gap-1 px-2 py-2 rounded-xl transition-all ${
                        isActive ? 'scale-105' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div 
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all ${
                          isActive ? 'scale-110' : ''
                        }`} 
                        style={{ 
                          backgroundColor: isActive ? `${item.color}20` : theme === 'dark' ? '#374151' : '#f3f4f6', 
                          color: isActive ? item.color : theme === 'dark' ? '#9ca3af' : '#6b7280' 
                        }}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <span 
                        className={`text-xs font-medium transition-colors ${
                          isActive 
                            ? theme === 'dark' ? 'text-white' : 'text-gray-900' 
                            : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`} 
                        style={{ color: isActive ? item.color : undefined }}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      

        {/* App Modals */}
        <AnimatePresence>
          {activeHomeApp && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setActiveHomeApp(null)} 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.9, y: 20 }} 
                  className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                  } rounded-2xl shadow-2xl`}
                >
                  <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
                    theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                  }`}>
                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {activeHomeApp === 'requests' && 'Message Requests'}
                      {activeHomeApp === 'connections' && 'My Connections'}
                      {activeHomeApp === 'community' && 'Community'}
                      {activeHomeApp === 'familytree' && 'Family Tree'}
                      {activeHomeApp === 'preferences' && 'Content Preferences'}
                      {activeHomeApp === 'village' && 'Change Village or Role'}
                    </h2>
                    <button 
                      onClick={() => setActiveHomeApp(null)} 
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6">
                    {activeHomeApp === 'requests' && <RequestsSection />}
                    {activeHomeApp === 'connections' && <ConnectionsSection />}
                    {activeHomeApp === 'community' && <CommunitySection />}
                    {activeHomeApp === 'familytree' && <FamilyTreeSection />}
                    {activeHomeApp === 'preferences' && <ContentPreferencesSection />}
                    {activeHomeApp === 'village' && (
                      <VillageChangeSection onOpenVillageSelector={handleOpenVillageSelector} />
                    )}
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Global Modals */}
        <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <NotificationCenter isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
        <VillageSelector 
          isOpen={isVillageSelectorOpen} 
          onClose={() => setIsVillageSelectorOpen(false)} 
          onSelectVillage={handleSelectVillage} 
        />
        
        {selectedVillageForChange && (
          <RoleChangeRequest
            isOpen={isRoleChangeRequestOpen}
            onClose={() => {
              setIsRoleChangeRequestOpen(false);
              setSelectedVillageForChange(null);
            }}
            villageId={selectedVillageForChange.villageId}
            villageName={selectedVillageForChange.villageName}
            villageColor={selectedVillageForChange.villageColor}
            roleId={selectedVillageForChange.roleId}
            roleName={selectedVillageForChange.roleName}
            roleIcon={selectedVillageForChange.roleIcon}
            onSubmit={handleSubmitRoleChange}
          />
        )}
        
        {protectionMode && (
          <ProtectionModeScreen 
            protectionMode={protectionMode} 
            onRequestCircle={handleRequestCircleFromProtection} 
            onContactSupport={handleContactSupport} 
          />
        )}

        {/* Feed Composer Modal */}
        <FeedComposer 
          isOpen={isComposerOpen} 
          onClose={() => setIsComposerOpen(false)}
          defaultFeedType="village"
          onPost={(postData) => {
            console.log('Post created:', postData);
            setIsComposerOpen(false);
            // TODO: Handle post submission
          }}
        />

        {/* Jollof TV Floating Bubble */}
        {isJollofTVVisible && (
          <JollofTVBubble
            isLive={isJollofTVLive}
            streamTitle="National Town Hall"
            streamerName="Governor's Address"
            viewerCount={1247}
            onClose={handleJollofTVClose}
            onMaximize={handleJollofTVMaximize}
            onSprayCowrie={handleSprayCowrie}
          />
        )}

        {/* Onboarding Tour - Shows automatically on first login */}
        <OnboardingTour
          isOpen={showOnboarding}
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
          
    </div>
  );
};

export default DashboardHome;