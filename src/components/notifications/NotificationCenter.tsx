import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell,
  MessageSquare,
  Heart,
  UserPlus,
  Briefcase,
  Shield,
  Award,
  Gift,
  TrendingUp,
  X,
  Check,
  Trash2,
  EyeOff,
  Circle,
  Users,
  Clock
} from 'lucide-react';

// Types
type NotificationType = 
  | 'whisper_request'
  | 'message' 
  | 'like' 
  | 'comment' 
  | 'connection' 
  | 'session' 
  | 'security' 
  | 'achievement' 
  | 'transaction' 
  | 'system'
  | 'milestone';

type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  imageUrl?: string;
  sender?: {
    name: string;
    avatar?: string;
    afroId?: string;
  };
  metadata?: Record<string, any>;
}

interface MessageRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderVillage: string;
  senderCrest: number;
  message: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

interface TrustedConnection {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  village: string;
  afroId: string;
  connectedSince: Date;
  lastMessage?: Date;
  unreadCount?: number;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: Notification[];
  messageRequests?: MessageRequest[];
  trustedConnections?: TrustedConnection[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (notificationId: string) => void;
  onClearAll?: () => void;
  onActionClick?: (notification: Notification) => void;
  onAcceptRequest?: (requestId: string) => void;
  onRejectRequest?: (requestId: string) => void;
  onOpenChat?: (connectionId: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications = [],
  messageRequests = [],
  trustedConnections = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  onActionClick,
  onAcceptRequest,
  onRejectRequest,
  onOpenChat
}) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'whispers' | 'trusted'>('notifications');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const getNotificationIcon = (type: NotificationType) => {
    const iconMap = {
      whisper_request: MessageSquare,
      message: MessageSquare,
      like: Heart,
      comment: MessageSquare,
      connection: UserPlus,
      session: Briefcase,
      security: Shield,
      achievement: Award,
      transaction: TrendingUp,
      system: Bell,
      milestone: Gift
    };
    return iconMap[type];
  };

  const getNotificationColor = (type: NotificationType) => {
    const colorMap = {
      whisper_request: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        border: 'border-purple-200'
      },
      message: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        border: 'border-blue-200'
      },
      like: {
        bg: 'bg-pink-100',
        text: 'text-pink-600',
        border: 'border-pink-200'
      },
      comment: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        border: 'border-purple-200'
      },
      connection: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        border: 'border-green-200'
      },
      session: {
        bg: 'bg-cyan-100',
        text: 'text-cyan-600',
        border: 'border-cyan-200'
      },
      security: {
        bg: 'bg-red-100',
        text: 'text-red-600',
        border: 'border-red-200'
      },
      achievement: {
        bg: 'bg-amber-100',
        text: 'text-amber-600',
        border: 'border-amber-200'
      },
      transaction: {
        bg: 'bg-emerald-100',
        text: 'text-emerald-600',
        border: 'border-emerald-200'
      },
      system: {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        border: 'border-gray-200'
      },
      milestone: {
        bg: 'bg-orange-100',
        text: 'text-orange-600',
        border: 'border-orange-200'
      }
    };
    return colorMap[type];
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => {
    const readMatch = !showUnreadOnly || !notification.isRead;
    return readMatch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const pendingRequestsCount = messageRequests.filter(r => r.status === 'pending').length;
  const unreadMessagesCount = trustedConnections.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const tabs = [
    { 
      id: 'notifications' as const, 
      label: 'All', 
      icon: Bell,
      count: unreadCount,
    },
    { 
      id: 'whispers' as const, 
      label: 'Whisper Requests', 
      icon: MessageSquare,
      count: pendingRequestsCount,
    },
    { 
      id: 'trusted' as const, 
      label: 'Trusted', 
      icon: Shield,
      count: unreadMessagesCount,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] bg-white shadow-2xl overflow-y-auto z-50"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6" />
                  <div>
                    <h2 className="text-xl font-bold">Notifications</h2>
                    <p className="text-purple-100 text-sm">
                      {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Tabs */}
              <div className="flex gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-white text-purple-600'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      
                      {tab.count > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions (Only for Notifications Tab) */}
              {activeTab === 'notifications' && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      showUnreadOnly
                        ? 'bg-white text-purple-600'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    <EyeOff className="w-3.5 h-3.5 inline mr-1.5" />
                    Unread Only
                  </button>
                  
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllAsRead}
                      className="px-3 py-1.5 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 inline mr-1.5" />
                      Mark All Read
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <AnimatePresence mode="wait">
                {/* All Notifications Tab */}
                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {filteredNotifications.length === 0 ? (
                      <div className="bg-gray-50 rounded-xl p-12 text-center">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No notifications
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {showUnreadOnly 
                            ? "You're all caught up! No unread notifications."
                            : "You don't have any notifications yet."}
                        </p>
                      </div>
                    ) : (
                      filteredNotifications.map((notification) => {
                        const Icon = getNotificationIcon(notification.type);
                        const colors = getNotificationColor(notification.type);

                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all ${
                              !notification.isRead 
                                ? 'border-purple-200 bg-purple-50/50' 
                                : 'border-gray-100'
                            }`}
                            onClick={() => {
                              if (!notification.isRead) {
                                onMarkAsRead?.(notification.id);
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              {/* Icon */}
                              <div className={`${colors.bg} ${colors.border} border-2 p-2.5 rounded-xl flex-shrink-0`}>
                                <Icon className={`w-5 h-5 ${colors.text}`} />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900 text-sm">
                                    {notification.title}
                                  </h3>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDelete?.(notification.id);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                                  >
                                    <X className="w-4 h-4 text-gray-400" />
                                  </button>
                                </div>

                                {notification.sender && (
                                  <p className="text-xs text-gray-600 mb-1">
                                    {notification.sender.name}
                                  </p>
                                )}

                                <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                                  {notification.message}
                                </p>

                                {/* Timestamp & Actions */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatTimestamp(notification.timestamp)}</span>
                                    {!notification.isRead && (
                                      <>
                                        <Circle className="w-1.5 h-1.5 fill-current text-purple-600" />
                                        <span className="text-purple-600 font-medium">New</span>
                                      </>
                                    )}
                                  </div>

                                  {notification.actionLabel && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onActionClick?.(notification);
                                      }}
                                      className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                                    >
                                      {notification.actionLabel}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </motion.div>
                )}

                {/* Whisper Requests Tab */}
                {activeTab === 'whispers' && (
                  <motion.div
                    key="whispers"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {messageRequests.filter(r => r.status === 'pending').length === 0 ? (
                      <div className="bg-gray-50 rounded-xl p-12 text-center">
                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No pending requests
                        </h3>
                        <p className="text-gray-600 text-sm">
                          You don't have any whisper requests at the moment.
                        </p>
                      </div>
                    ) : (
                      messageRequests
                        .filter(r => r.status === 'pending')
                        .map((request) => (
                          <div
                            key={request.id}
                            className="bg-white rounded-xl p-4 shadow-sm border-2 border-purple-200"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              {request.senderAvatar ? (
                                <img
                                  src={request.senderAvatar}
                                  alt={request.senderName}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                  <Users className="w-6 h-6 text-purple-600" />
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                  {request.senderName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {request.senderVillage} • Crest Level {request.senderCrest}
                                </p>
                              </div>
                            </div>

                            <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                              {request.message}
                            </p>

                            <div className="text-xs text-gray-500 mb-3">
                              {formatTimestamp(request.timestamp)}
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => onAcceptRequest?.(request.id)}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => onRejectRequest?.(request.id)}
                                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ))
                    )}
                  </motion.div>
                )}

                {/* Trusted Connections Tab */}
                {activeTab === 'trusted' && (
                  <motion.div
                    key="trusted"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {trustedConnections.length === 0 ? (
                      <div className="bg-gray-50 rounded-xl p-12 text-center">
                        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No trusted connections
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Accept whisper requests to build your trusted network.
                        </p>
                      </div>
                    ) : (
                      trustedConnections.map((connection) => (
                        <div
                          key={connection.id}
                          onClick={() => onOpenChat?.(connection.id)}
                          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-purple-300 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-3">
                            {connection.avatar ? (
                              <img
                                src={connection.avatar}
                                alt={connection.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {connection.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {connection.village} • {connection.afroId}
                              </p>
                              {connection.lastMessage && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Last message: {formatTimestamp(connection.lastMessage)}
                                </p>
                              )}
                            </div>
                            {connection.unreadCount && connection.unreadCount > 0 && (
                              <div className="w-6 h-6 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                {connection.unreadCount}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clear All Button (Only for Notifications Tab) */}
            {activeTab === 'notifications' && filteredNotifications.length > 0 && (
              <div className="p-4 pt-0">
                <button
                  onClick={onClearAll}
                  className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear All Notifications
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;