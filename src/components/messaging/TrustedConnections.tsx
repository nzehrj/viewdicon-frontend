import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  //Heart, 
  Phone, 
  //Video,
  MessageSquare,
  Wallet,
  UserMinus,
  UserPlus,
  Search,
  //Filter,
  //ChevronRight,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { 
  removeTrustedConnection,
  addTrustedConnection 
} from '@store/slices/userSlice';
import type { CircleTier } from '@/types/connection.types';
import { 
  getCircleName, 
  getCircleColor, 
  getCircleIcon 
} from '@/types/connection.types';
import * as Icons from 'lucide-react';

interface TrustedConnection {
  afro_id: string;
  display_name: string;
  handle: string;
  avatar_url: string;
  village_role: string;
  circle_tier: CircleTier;
  last_interaction: Date;
  connection_since: Date;
  can_direct_message: boolean;
  can_voice_call: boolean;
  can_video_call: boolean;
  can_tip_direct: boolean;
}

interface TrustRequestItem {
  request_id: string;
  from_afro_id: string;
  from_display_name: string;
  from_handle: string;
  from_avatar_url: string;
  message: string;
  requested_circle: CircleTier;
  created_at: Date;
}

export const TrustedConnections: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  // const trustedConnectionIds = useAppSelector((state) => state.user.trustedConnections); // ❌ REMOVED - not used
  // const connections = useAppSelector((state) => state.user.connections); // ❌ REMOVED - not used

  const [activeTab, setActiveTab] = useState<'all' | 'requests'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCircle, setFilterCircle] = useState<CircleTier | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAfroId, setNewAfroId] = useState('');
  const [addError, setAddError] = useState('');

  // Mock data - Replace with actual data from Redux
  const mockTrustedConnections: TrustedConnection[] = [
    {
      afro_id: 'AFR-NG-G1-2024-ABC1',
      display_name: 'Chinwe Okonkwo',
      handle: '@ChinweHeals',
      avatar_url: '',
      village_role: 'Healthcare • Nurse',
      circle_tier: 'inner_fire',
      last_interaction: new Date(Date.now() - 2 * 60 * 60 * 1000),
      connection_since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      can_direct_message: true,
      can_voice_call: true,
      can_video_call: true,
      can_tip_direct: true,
    },
    {
      afro_id: 'AFR-GH-G1-2025-XYZ2',
      display_name: 'Kofi Mensah',
      handle: '@KofiBuilds',
      avatar_url: '',
      village_role: 'Construction • Architect',
      circle_tier: 'village',
      last_interaction: new Date(Date.now() - 5 * 60 * 60 * 1000),
      connection_since: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      can_direct_message: true,
      can_voice_call: false,
      can_video_call: false,
      can_tip_direct: false,
    },
    {
      afro_id: 'AFR-KE-G1-2024-DEF3',
      display_name: 'Amara Njeri',
      handle: '@AmaraCodes',
      avatar_url: '',
      village_role: 'Technology • Developer',
      circle_tier: 'village',
      last_interaction: new Date(Date.now() - 12 * 60 * 60 * 1000),
      connection_since: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      can_direct_message: true,
      can_voice_call: false,
      can_video_call: false,
      can_tip_direct: false,
    },
  ];

  const mockTrustRequests: TrustRequestItem[] = [
    {
      request_id: 'req_1',
      from_afro_id: 'AFR-ZA-G1-2025-GHI4',
      from_display_name: 'Thabo Dlamini',
      from_handle: '@ThDlamini',
      from_avatar_url: '',
      message: 'We worked together on the Ubuntu project. Would love to connect at the trust level!',
      requested_circle: 'village',
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
  ];

  // Filter connections
  const filteredConnections = mockTrustedConnections.filter(conn => {
    const matchesSearch = 
      conn.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conn.handle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCircle = 
      filterCircle === 'all' || conn.circle_tier === filterCircle;
    
    return matchesSearch && matchesCircle;
  });

  const handleRemoveConnection = async (afroId: string, displayName: string) => {
    if (!confirm(`Remove ${displayName} from your trusted connections?`)) {
      return;
    }

    try {
      // TODO: API call
      dispatch(removeTrustedConnection(afroId));
    } catch (error) {
      console.error('Failed to remove connection:', error);
    }
  };

  const handleAddByAfroId = async () => {
    setAddError('');

    if (!newAfroId.trim()) {
      setAddError('Please enter an Afro-ID');
      return;
    }

    // Basic validation
    if (!newAfroId.match(/^AFR-[A-Z]{2}-G\d+-\d{4}-[A-Z0-9]{4}$/)) {
      setAddError('Invalid Afro-ID format');
      return;
    }

    try {
      // TODO: Replace with actual API call to send trust request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(addTrustedConnection(newAfroId));
      setShowAddModal(false);
      setNewAfroId('');
    } catch (error) {
      setAddError('Failed to send trust request');
    }
  };

  const handleApproveTrustRequest = async (_: string, afroId: string) => { // ✅ Changed 'requestId' to '_'
    try {
      // TODO: API call
      dispatch(addTrustedConnection(afroId));
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleDeclineTrustRequest = async (_: string) => { // ✅ Changed 'requestId' to '_'
    try {
      // TODO: API call
      console.log('Declined request');
    } catch (error) {
      console.error('Failed to decline request:', error);
    }
  };

  const formatTimeSince = (date: Date): string => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const circles: { id: CircleTier | 'all'; label: string; color: string }[] = [
    { id: 'all', label: 'All', color: '#6b7280' },
    { id: 'inner_fire', label: 'Inner Fire', color: getCircleColor('inner_fire') },
    { id: 'village', label: 'Village', color: getCircleColor('village') },
    { id: 'kingdom', label: 'Kingdom', color: getCircleColor('kingdom') },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className={`w-5 h-5 ${
            theme === 'dark' ? 'text-green-400' : 'text-green-600'
          }`} />
          <h2 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Trusted Connections
          </h2>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Add by Afro-ID</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Info Banner */}
      <div className={`
        p-4 rounded-xl flex items-start gap-3 text-sm
        ${theme === 'dark'
          ? 'bg-green-900/20 border border-green-500/30 text-green-300'
          : 'bg-green-50 border border-green-200 text-green-700'
        }
      `}>
        <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Afro-ID Level Access</p>
          <p>
            These people have exchanged Afro-IDs with you. They can message you directly,
            send money instantly, and access deeper trust features.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`
        flex gap-2 p-1 rounded-xl
        ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'}
      `}>
        <button
          onClick={() => setActiveTab('all')}
          className={`
            flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all relative
            ${activeTab === 'all'
              ? theme === 'dark'
                ? 'bg-gray-700 text-white'
                : 'bg-white text-gray-900 shadow-sm'
              : theme === 'dark'
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          Connections
          <span className={`
            ml-2 px-2 py-0.5 rounded-full text-xs
            ${activeTab === 'all'
              ? 'bg-green-500 text-white'
              : theme === 'dark'
              ? 'bg-gray-700 text-gray-400'
              : 'bg-gray-200 text-gray-600'
            }
          `}>
            {filteredConnections.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`
            flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all relative
            ${activeTab === 'requests'
              ? theme === 'dark'
                ? 'bg-gray-700 text-white'
                : 'bg-white text-gray-900 shadow-sm'
              : theme === 'dark'
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          Requests
          {mockTrustRequests.length > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-red-500 text-white">
              {mockTrustRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Search & Filter */}
      {activeTab === 'all' && (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search connections..."
              className={`
                w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all
                ${theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-green-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-500'
                }
                border-2 outline-none
              `}
            />
          </div>

          {/* Circle Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {circles.map((circle) => (
              <button
                key={circle.id}
                onClick={() => setFilterCircle(circle.id)}
                className={`
                  px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
                  ${filterCircle === circle.id
                    ? 'text-white shadow-md'
                    : theme === 'dark'
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                style={filterCircle === circle.id ? { backgroundColor: circle.color } : {}}
              >
                {circle.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'all' ? (
          /* Connections List */
          <motion.div
            key="connections"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filteredConnections.length === 0 ? (
              <div className={`
                text-center py-16 px-6 rounded-2xl
                ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}
              `}>
                <Shield className={`w-12 h-12 mx-auto mb-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <h3 className={`text-lg font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  No Trusted Connections Yet
                </h3>
                <p className={`text-sm mb-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Add people by their Afro-ID to create trust connections
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all"
                >
                  Add Your First Connection
                </button>
              </div>
            ) : (
              filteredConnections.map((conn, index) => {
                const CircleIcon = Icons[getCircleIcon(conn.circle_tier) as keyof typeof Icons] as React.FC<any>;
                
                return (
                  <motion.div
                    key={conn.afro_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      rounded-2xl p-4 border transition-all
                      ${theme === 'dark'
                        ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                        : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 relative">
                          {conn.avatar_url ? (
                            <img 
                              src={conn.avatar_url} 
                              alt={conn.display_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                              {conn.display_name.charAt(0)}
                            </div>
                          )}
                          
                          {/* Circle indicator */}
                          <div 
                            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                            style={{ 
                              backgroundColor: getCircleColor(conn.circle_tier),
                              borderColor: theme === 'dark' ? '#1f2937' : '#ffffff'
                            }}
                          >
                            <CircleIcon className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-base truncate ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {conn.display_name}
                        </h3>
                        <p className={`text-sm truncate ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {conn.handle}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span 
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${getCircleColor(conn.circle_tier)}20`,
                              color: getCircleColor(conn.circle_tier)
                            }}
                          >
                            {getCircleName(conn.circle_tier)}
                          </span>
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                          }`}>
                            • {formatTimeSince(conn.connection_since)}
                          </span>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex-shrink-0 flex items-center gap-1">
                        {conn.can_direct_message && (
                          <button
                            className={`p-2 rounded-lg transition-all ${
                              theme === 'dark'
                                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                            }`}
                            title="Message"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        )}
                        
                        {conn.can_voice_call && (
                          <button
                            className={`p-2 rounded-lg transition-all ${
                              theme === 'dark'
                                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                            }`}
                            title="Voice Call"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                        )}
                        
                        {conn.can_tip_direct && (
                          <button
                            className={`p-2 rounded-lg transition-all ${
                              theme === 'dark'
                                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                            }`}
                            title="Send Cowries"
                          >
                            <Wallet className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleRemoveConnection(conn.afro_id, conn.display_name)}
                          className={`p-2 rounded-lg transition-all ${
                            theme === 'dark'
                              ? 'hover:bg-red-900/30 text-gray-400 hover:text-red-400'
                              : 'hover:bg-red-50 text-gray-600 hover:text-red-600'
                          }`}
                          title="Remove connection"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        ) : (
          /* Trust Requests */
          <motion.div
            key="requests"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {mockTrustRequests.length === 0 ? (
              <div className={`
                text-center py-16 px-6 rounded-2xl
                ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}
              `}>
                <Check className={`w-12 h-12 mx-auto mb-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <h3 className={`text-lg font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  No Pending Requests
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  When someone wants Afro-ID level access, they'll appear here
                </p>
              </div>
            ) : (
              mockTrustRequests.map((request, index) => (
                <motion.div
                  key={request.request_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    rounded-2xl p-4 sm:p-6 border
                    ${theme === 'dark'
                      ? 'bg-gray-800/50 border-amber-500/30'
                      : 'bg-white border-amber-200 shadow-sm'
                    }
                  `}
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 sm:gap-4 mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600">
                      {request.from_avatar_url ? (
                        <img 
                          src={request.from_avatar_url} 
                          alt={request.from_display_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                          {request.from_display_name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-base mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {request.from_display_name}
                      </h3>
                      <p className={`text-sm mb-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {request.from_handle}
                      </p>
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${getCircleColor(request.requested_circle)}20`,
                            color: getCircleColor(request.requested_circle)
                          }}
                        >
                          Wants {getCircleName(request.requested_circle)} Access
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className={`
                    p-3 rounded-xl mb-4 text-sm
                    ${theme === 'dark'
                      ? 'bg-gray-900/50 text-gray-300'
                      : 'bg-gray-50 text-gray-700'
                    }
                  `}>
                    <p className="italic">"{request.message}"</p>
                  </div>

                  {/* Warning */}
                  <div className={`
                    p-3 rounded-xl mb-4 flex items-start gap-2 text-xs
                    ${theme === 'dark'
                      ? 'bg-amber-900/20 text-amber-300'
                      : 'bg-amber-50 text-amber-700'
                    }
                  `}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>
                      This will grant them priority messaging, instant tipping, 
                      and potentially voice/video access depending on the circle.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveTrustRequest(request.request_id, request.from_afro_id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>

                    <button
                      onClick={() => handleDeclineTrustRequest(request.request_id)}
                      className={`
                        flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
                        transition-all
                        ${theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        }
                      `}
                    >
                      <X className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add by Afro-ID Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`
                max-w-md w-full rounded-2xl p-6
                ${theme === 'dark'
                  ? 'bg-gray-800 border-2 border-gray-700'
                  : 'bg-white shadow-2xl'
                }
              `}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Add Trusted Connection
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Enter someone's Afro-ID to send them a trust request
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Afro-ID
                  </label>
                  <input
                    type="text"
                    value={newAfroId}
                    onChange={(e) => {
                      setNewAfroId(e.target.value.toUpperCase());
                      setAddError('');
                    }}
                    placeholder="AFR-NG-G1-2025-W1Y5"
                    className={`
                      w-full px-4 py-3 rounded-xl text-sm font-mono transition-all
                      ${theme === 'dark'
                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-600 focus:border-green-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-500'
                      }
                      border-2 outline-none
                    `}
                  />
                  {addError && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {addError}
                    </p>
                  )}
                </div>

                <div className={`
                  p-3 rounded-xl text-xs flex items-start gap-2
                  ${theme === 'dark'
                    ? 'bg-amber-900/20 text-amber-300'
                    : 'bg-amber-50 text-amber-700'
                  }
                `}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>
                    They'll receive a request and can approve or decline. 
                    Only share Afro-IDs with people you trust.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className={`
                      flex-1 px-4 py-3 rounded-xl font-semibold transition-all
                      ${theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }
                    `}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddByAfroId}
                    disabled={!newAfroId.trim()}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrustedConnections;