import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WifiOff,
  Wifi,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  MessageCircle,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Trash2,
  Play,
  Pause,
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface QueuedAction {
  id: string;
  type: 'message' | 'post' | 'upload' | 'transaction' | 'update';
  action: string;
  timestamp: Date;
  status: 'pending' | 'syncing' | 'success' | 'failed';
  retryCount: number;
  data: any;
  error?: string;
}

interface OfflineSyncProps {
  isOpen?: boolean;
  onClose?: () => void;
  queuedActions?: QueuedAction[];
  onRetry?: (actionId: string) => void;
  onDelete?: (actionId: string) => void;
  onRetryAll?: () => void;
  onPauseSync?: () => void;
  onResumeSync?: () => void;
}

/**
 * OFFLINE SYNC COMPONENT
 * 
 * Manages offline actions queue and sync status
 * Features: Queue visualization, retry logic, sync controls
 * Displays pending actions and sync progress
 * 
 * Location: src/components/sync/OfflineSync.tsx
 */
export const OfflineSync: React.FC<OfflineSyncProps> = ({
  isOpen = false,
  onClose,
  queuedActions = [],
  onRetry,
  onDelete,
  onRetryAll,
  onPauseSync,
  onResumeSync,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Listen to online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Mock queued actions if none provided
  const mockActions: QueuedAction[] = queuedActions.length > 0 ? queuedActions : [
    {
      id: '1',
      type: 'message',
      action: 'Send message to Chioma Adeyemi',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'pending',
      retryCount: 0,
      data: { message: 'Hello, how are you?' }
    },
    {
      id: '2',
      type: 'post',
      action: 'Publish post about professional networking',
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      status: 'pending',
      retryCount: 0,
      data: { content: 'Excited to share...' }
    },
    {
      id: '3',
      type: 'upload',
      action: 'Upload profile photo',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      status: 'failed',
      retryCount: 2,
      data: { file: 'profile.jpg' },
      error: 'Connection timeout'
    },
  ];

  const actions = mockActions;
  const pendingCount = actions.filter(a => a.status === 'pending').length;
  const failedCount = actions.filter(a => a.status === 'failed').length;
  const successCount = actions.filter(a => a.status === 'success').length;

  const getActionIcon = (type: QueuedAction['type']) => {
    switch (type) {
      case 'message': return MessageCircle;
      case 'post': return FileText;
      case 'upload': return Upload;
      case 'transaction': return RefreshCw;
      case 'update': return FileText;
      default: return FileText;
    }
  };

  const getStatusIcon = (status: QueuedAction['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'syncing': return RefreshCw;
      case 'success': return CheckCircle;
      case 'failed': return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: QueuedAction['status']) => {
    switch (status) {
      case 'pending': return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
      case 'syncing': return theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
      case 'success': return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 'failed': return theme === 'dark' ? 'text-red-400' : 'text-red-600';
      default: return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const handleToggleSync = () => {
    if (isPaused) {
      onResumeSync?.();
      setIsPaused(false);
    } else {
      onPauseSync?.();
      setIsPaused(true);
    }
  };

  const formatTimestamp = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Sync Panel */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full sm:max-w-2xl sm:mx-4 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}
          style={{ maxHeight: '80vh' }}
        >
          {/* Header */}
          <div className={`sticky top-0 z-10 px-6 py-4 border-b ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isOnline 
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-red-500/20 text-red-500'
                }`}>
                  {isOnline ? (
                    <Wifi className="w-6 h-6" />
                  ) : (
                    <WifiOff className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Offline Sync Queue
                  </h2>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {isOnline ? 'Connected' : 'Offline Mode'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Pending
                  </span>
                </div>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {pendingCount}
                </p>
              </div>

              <div className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Synced
                  </span>
                </div>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {successCount}
                </p>
              </div>

              <div className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Failed
                  </span>
                </div>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {failedCount}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleToggleSync}
                disabled={!isOnline}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isOnline
                    ? theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    : 'opacity-50 cursor-not-allowed bg-gray-700 text-gray-400'
                }`}
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                )}
              </button>

              {failedCount > 0 && (
                <button
                  onClick={onRetryAll}
                  disabled={!isOnline}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isOnline
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'opacity-50 cursor-not-allowed bg-purple-600 text-white'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry All
                </button>
              )}
            </div>
          </div>

          {/* Queue List */}
          <div className="overflow-y-auto p-6 space-y-3" style={{ maxHeight: 'calc(80vh - 300px)' }}>
            {actions.length === 0 ? (
              <div className={`text-center py-12 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="font-medium">All synced up!</p>
                <p className="text-sm">No pending actions in queue</p>
              </div>
            ) : (
              actions.map((action, index) => {
                const ActionIcon = getActionIcon(action.type);
                const StatusIcon = getStatusIcon(action.status);
                const statusColor = getStatusColor(action.status);

                return (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <ActionIcon className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={`font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {action.action}
                          </p>
                          <StatusIcon className={`w-5 h-5 flex-shrink-0 ${statusColor} ${
                            action.status === 'syncing' ? 'animate-spin' : ''
                          }`} />
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            {formatTimestamp(action.timestamp)}
                          </span>
                          {action.retryCount > 0 && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              theme === 'dark'
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'bg-orange-100 text-orange-600'
                            }`}>
                              Retry {action.retryCount}
                            </span>
                          )}
                        </div>

                        {action.error && (
                          <div className={`flex items-center gap-2 p-2 rounded-lg text-sm mb-2 ${
                            theme === 'dark'
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-red-50 text-red-600'
                          }`}>
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{action.error}</span>
                          </div>
                        )}

                        {action.status === 'failed' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onRetry?.(action.id)}
                              disabled={!isOnline}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                isOnline
                                  ? theme === 'dark'
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                                  : 'opacity-50 cursor-not-allowed bg-gray-600 text-gray-400'
                              }`}
                            >
                              <RefreshCw className="w-3 h-3" />
                              Retry
                            </button>

                            <button
                              onClick={() => onDelete?.(action.id)}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                theme === 'dark'
                                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OfflineSync;