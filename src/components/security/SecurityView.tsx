import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, CreditCard, Monitor, Activity } from 'lucide-react';
import { useAppSelector } from '@store/hooks';

// Security Components
import SecurityDashboard from '@components/security/SecurityDashboard';
import WatchfulEye from '@components/security/WatchfulEye';
import VerificationTiers from '@components/security/VerificationTiers';
import DeviceManager from '@components/security/DeviceManager';
import SessionMonitor from '@components/security/SessionMonitor';
import EmergencyContactsManager from '@components/security/EmergencyContactsManager';
import CircleAlertFlow from '@components/security/CircleAlertFlow';

import type { ProtectionMode, EmergencyContact, CircleAlert } from '@/types/security.types';

type SecurityTab = 'dashboard' | 'watchful-eye' | 'verification' | 'devices' | 'sessions';

interface SecurityViewProps {
  villageName?: string;
  userId?: string | null; 
  protectionMode?: ProtectionMode | null;
  onRequestCircle?: () => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({
  userId,
  protectionMode
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  
  const [activeSecurityTab, setActiveSecurityTab] = useState<SecurityTab>('dashboard');
  
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

  const currentUserId = userId || user?.id || 'user-123';

  // ✅ Security Tab Configuration
  const securityTabs = [
    { id: 'dashboard' as SecurityTab, label: 'Overview', icon: Shield },
    { id: 'watchful-eye' as SecurityTab, label: 'Watchful Eye', icon: Eye },
    { id: 'verification' as SecurityTab, label: 'Verification', icon: CreditCard },
    { id: 'devices' as SecurityTab, label: 'Devices', icon: Monitor },
    { id: 'sessions' as SecurityTab, label: 'Sessions', icon: Activity },
  ];

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

  // Test handler for protection mode
  const handleTestProtectionMode = () => {
    console.log('Test protection mode - trigger from parent');
    // This should be handled by parent component
  };

  const handleTestCircleAlert = () => {
    handleSendCircleAlert();
    setActiveSecurityTab('dashboard');
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl sm:text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Ancestral Shield
          </h2>
          <p className={`text-xs sm:text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
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
        }`}>
          Security Testing (Remove in Production)
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleTestProtectionMode}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
          >
            Test Protection Mode
          </button>
          <button
            onClick={handleTestCircleAlert}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
          >
            Test Circle Alert
          </button>
        </div>
      </div>

      {/* Security Tabs */}
      <div className={`flex gap-2 overflow-x-auto pb-2 ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      } border-b hide-scrollbar`}>
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none !important;
          }
          .hide-scrollbar {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
        `}</style>
        
        {securityTabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeSecurityTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSecurityTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-sm font-medium ${
                isActive
                  ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                  : theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Security Tab Content */}
      <AnimatePresence mode="wait">
        {/* DASHBOARD TAB */}
        {activeSecurityTab === 'dashboard' && (
          <motion.div 
            key="security-dashboard" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <div className="space-y-4 sm:space-y-6">
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
                userId={currentUserId}
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
          <motion.div 
            key="watchful-eye" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
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
          <motion.div 
            key="verification" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
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
          <motion.div 
            key="devices" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
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
          <motion.div 
            key="sessions" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
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
    </div>
  );
};

export default SecurityView;