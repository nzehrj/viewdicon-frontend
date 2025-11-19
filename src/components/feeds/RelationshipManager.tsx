import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus,
  UserMinus,
  Users,
  Briefcase,
  Bell,
  BellOff,
  Check,
  X,
  Star,
  MessageCircle,
  Clock
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface RelationshipManagerProps {
  targetUserId: string;
  targetUserName: string;
  targetUserVillage?: string;
  targetUserVillageColor?: string;
  targetUserCrest?: number;
  currentRelationship?: RelationshipStatus;
  onRelationshipChange?: (newStatus: RelationshipStatus) => void;
}

interface RelationshipStatus {
  isFollowing: boolean;
  isSubscribed: boolean; // For premium content
  isFriend: boolean; // Mutual connection
  isBusinessLink: boolean; // Professional connection
  isPending: boolean; // Friend request pending
  notifications: boolean; // Get notifications
}

/**
 * RELATIONSHIP MANAGER COMPONENT
 * 
 * Manages all types of connections between users.
 * 
 * Connection Types:
 * 
 * 1. FOLLOW (Twitter-style)
 *    - One-way connection
 *    - See public posts
 *    - Free
 *    - Can enable/disable notifications
 * 
 * 2. SUBSCRIBE (Patreon-style)
 *    - Paid connection
 *    - Access premium content
 *    - Monthly Cowrie fee
 *    - Auto-notification
 * 
 * 3. FRIEND (Facebook-style)
 *    - Mutual connection
 *    - Requires approval
 *    - See semi-private content
 *    - Can chat directly
 * 
 * 4. BUSINESS LINK (LinkedIn-style)
 *    - Professional connection
 *    - Verified by Business Session
 *    - Can request work
 *    - Build reputation together
 * 
 * Location: src/components/feeds/RelationshipManager.tsx
 */
export const RelationshipManager: React.FC<RelationshipManagerProps> = ({
  targetUserId,
  targetUserName,
  targetUserVillage,
  targetUserVillageColor,
  targetUserCrest,
  currentRelationship = {
    isFollowing: false,
    isSubscribed: false,
    isFriend: false,
    isBusinessLink: false,
    isPending: false,
    notifications: false,
  },
  onRelationshipChange,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [relationship, setRelationship] = useState<RelationshipStatus>(currentRelationship);
  const [showOptions, setShowOptions] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  
  const handleFollow = () => {
    const newStatus = {
      ...relationship,
      isFollowing: !relationship.isFollowing,
    };
    setRelationship(newStatus);
    onRelationshipChange?.(newStatus);
    // TODO: API call
    console.log(relationship.isFollowing ? 'Unfollow' : 'Follow', targetUserId);
  };
  
  const handleSubscribe = () => {
    setShowSubscribeModal(true);
  };
  
  const confirmSubscribe = (plan: 'basic' | 'premium') => {
    const newStatus = {
      ...relationship,
      isSubscribed: true,
      isFollowing: true, // Auto-follow when subscribing
      notifications: true, // Auto-enable notifications
    };
    setRelationship(newStatus);
    onRelationshipChange?.(newStatus);
    setShowSubscribeModal(false);
    // TODO: Payment flow and API call
    console.log('Subscribe to', targetUserId, 'plan:', plan);
  };
  
  const handleUnsubscribe = () => {
    const newStatus = {
      ...relationship,
      isSubscribed: false,
      notifications: false,
    };
    setRelationship(newStatus);
    onRelationshipChange?.(newStatus);
    // TODO: API call
    console.log('Unsubscribe from', targetUserId);
  };
  
  const handleFriendRequest = () => {
    if (relationship.isFriend) {
      // Unfriend
      const newStatus = {
        ...relationship,
        isFriend: false,
        isPending: false,
      };
      setRelationship(newStatus);
      onRelationshipChange?.(newStatus);
      console.log('Unfriend', targetUserId);
    } else if (relationship.isPending) {
      // Cancel request
      const newStatus = {
        ...relationship,
        isPending: false,
      };
      setRelationship(newStatus);
      onRelationshipChange?.(newStatus);
      console.log('Cancel friend request to', targetUserId);
    } else {
      // Send request
      const newStatus = {
        ...relationship,
        isPending: true,
      };
      setRelationship(newStatus);
      onRelationshipChange?.(newStatus);
      console.log('Send friend request to', targetUserId);
    }
    // TODO: API call
  };
  
  const handleBusinessLink = () => {
    // TODO: Verify through Business Session
    const newStatus = {
      ...relationship,
      isBusinessLink: !relationship.isBusinessLink,
    };
    setRelationship(newStatus);
    onRelationshipChange?.(newStatus);
    console.log(relationship.isBusinessLink ? 'Remove' : 'Add', 'business link with', targetUserId);
  };
  
  const toggleNotifications = () => {
    const newStatus = {
      ...relationship,
      notifications: !relationship.notifications,
    };
    setRelationship(newStatus);
    onRelationshipChange?.(newStatus);
    // TODO: API call
    console.log('Toggle notifications for', targetUserId);
  };
  
  return (
    <div className="relative">
      {/* Main Action Button */}
      <div className="flex items-center gap-2">
        {/* Primary Action */}
        {!relationship.isFollowing && !relationship.isSubscribed && !relationship.isFriend ? (
          <button
            onClick={handleFollow}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-2 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Follow
          </button>
        ) : (
          <button
            onClick={() => setShowOptions(!showOptions)}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            <Check className="w-4 h-4" />
            {relationship.isSubscribed ? 'Subscribed' : relationship.isFriend ? 'Friends' : 'Following'}
          </button>
        )}
        
        {/* Message Button (if friends or business link) */}
        {(relationship.isFriend || relationship.isBusinessLink) && (
          <button
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <MessageCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
          </button>
        )}
      </div>
      
      {/* Options Dropdown */}
      <AnimatePresence>
        {showOptions && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowOptions(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute top-full right-0 mt-2 w-64 rounded-xl shadow-xl border z-50 overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              {/* User Info Header */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ backgroundColor: targetUserVillageColor || '#8b5cf6' }}
                  >
                    {targetUserName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {targetUserName}
                    </p>
                    {targetUserVillage && (
                      <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {targetUserVillage}
                      </p>
                    )}
                  </div>
                  {targetUserCrest && (
                    <span className="text-xs">
                      {'⭐'.repeat(targetUserCrest)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Options */}
              <div className="p-2">
                {/* Follow/Unfollow */}
                <button
                  onClick={() => {
                    handleFollow();
                    setShowOptions(false);
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-3 transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  {relationship.isFollowing ? (
                    <>
                      <UserMinus className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Unfollow
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Stop seeing their posts
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <UserPlus className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Follow
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          See their public posts
                        </p>
                      </div>
                    </>
                  )}
                </button>
                
                {/* Subscribe */}
                {!relationship.isSubscribed ? (
                  <button
                    onClick={() => {
                      handleSubscribe();
                      setShowOptions(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-3 transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Star className="w-5 h-5 text-amber-500" />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Subscribe
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Access premium content
                      </p>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleUnsubscribe();
                      setShowOptions(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-3 transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className="w-5 h-5 text-red-500" />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Unsubscribe
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Cancel subscription
                      </p>
                    </div>
                  </button>
                )}
                
                {/* Friend Request */}
                <button
                  onClick={() => {
                    handleFriendRequest();
                    setShowOptions(false);
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-3 transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  {relationship.isFriend ? (
                    <>
                      <Users className="w-5 h-5 text-red-500" />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Unfriend
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Remove friend connection
                        </p>
                      </div>
                    </>
                  ) : relationship.isPending ? (
                    <>
                      <Clock className="w-5 h-5 text-amber-500" />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Cancel Request
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Pending approval
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Users className="w-5 h-5 text-green-500" />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Add Friend
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Send friend request
                        </p>
                      </div>
                    </>
                  )}
                </button>
                
                {/* Business Link */}
                <button
                  onClick={() => {
                    handleBusinessLink();
                    setShowOptions(false);
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-3 transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Briefcase className={`w-5 h-5 ${relationship.isBusinessLink ? 'text-blue-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {relationship.isBusinessLink ? 'Remove Business Link' : 'Add Business Link'}
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Professional connection
                    </p>
                  </div>
                </button>
                
                {/* Notifications */}
                {relationship.isFollowing && (
                  <button
                    onClick={() => {
                      toggleNotifications();
                      setShowOptions(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-3 transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    {relationship.notifications ? (
                      <>
                        <BellOff className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Turn Off Notifications
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Stop getting alerts
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Turn On Notifications
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Get alerts for new posts
                          </p>
                        </div>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Subscribe Modal */}
      <AnimatePresence>
        {showSubscribeModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubscribeModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-2xl p-6 w-[90%] max-w-md ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Subscribe to {targetUserName}
              </h3>
              
              <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Get exclusive content and support this creator
              </p>
              
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => confirmSubscribe('basic')}
                  className={`w-full p-4 rounded-xl border-2 transition-colors ${
                    theme === 'dark'
                      ? 'border-gray-700 hover:border-purple-500 bg-gray-750'
                      : 'border-gray-200 hover:border-purple-500 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Basic
                    </span>
                    <span className="text-purple-600 font-bold">₵5,000/mo</span>
                  </div>
                  <p className={`text-xs text-left ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Access to exclusive posts and priority support
                  </p>
                </button>
                
                <button
                  onClick={() => confirmSubscribe('premium')}
                  className={`w-full p-4 rounded-xl border-2 transition-colors ${
                    theme === 'dark'
                      ? 'border-amber-500 bg-gradient-to-br from-amber-500/20 to-orange-500/20'
                      : 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Premium
                      </span>
                      <Star className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="text-amber-600 font-bold">₵15,000/mo</span>
                  </div>
                  <p className={`text-xs text-left ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    All Basic benefits + early access, 1-on-1 sessions, and exclusive workshops
                  </p>
                </button>
              </div>
              
              <button
                onClick={() => setShowSubscribeModal(false)}
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RelationshipManager;