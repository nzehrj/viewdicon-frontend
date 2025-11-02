import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Check, 
  X, 
  Clock,
  AlertCircle,
  //User,
  Shield
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { updateMessageRequest, removeMessageRequest } from '@store/slices/userSlice';
//import type { MessageRequest } from '@/types/connection.types';
import { formatPostTime } from '@/types/feed.types';

export const MessageRequests: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const messageRequests = useAppSelector((state) => state.user.messageRequests);

  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filter pending requests
  const pendingRequests = messageRequests.filter(r => r.status === 'pending');

  const handleAccept = async (requestId: string) => {
    setProcessingId(requestId);
    
    try {
      // TODO: API call to accept request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch(updateMessageRequest({ 
        request_id: requestId, 
        status: 'accepted' 
      }));
      
      // Remove from list after 1 second
      setTimeout(() => {
        dispatch(removeMessageRequest(requestId));
      }, 1000);
    } catch (error) {
      console.error('Failed to accept request:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    setProcessingId(requestId);
    
    try {
      // TODO: API call to decline request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch(updateMessageRequest({ 
        request_id: requestId, 
        status: 'declined' 
      }));
      
      // Remove from list after 1 second
      setTimeout(() => {
        dispatch(removeMessageRequest(requestId));
      }, 1000);
    } catch (error) {
      console.error('Failed to decline request:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleBlock = async (requestId: string) => {
    if (!confirm('Block this user? They won\'t be able to contact you again.')) {
      return;
    }

    setProcessingId(requestId);
    
    try {
      // TODO: API call to block user
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch(updateMessageRequest({ 
        request_id: requestId, 
        status: 'blocked' 
      }));
      
      dispatch(removeMessageRequest(requestId));
    } catch (error) {
      console.error('Failed to block user:', error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className={`w-5 h-5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <h2 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Whisper Requests
          </h2>
        </div>
        
        {pendingRequests.length > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
            {pendingRequests.length}
          </span>
        )}
      </div>

      {/* Info Banner */}
      <div className={`
        p-4 rounded-xl flex items-start gap-3 text-sm
        ${theme === 'dark'
          ? 'bg-blue-900/20 border border-blue-500/30 text-blue-300'
          : 'bg-blue-50 border border-blue-200 text-blue-700'
        }
      `}>
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>
          People can request to whisper (message) you. Accept to open a chat, 
          or decline to ignore. Blocked users cannot contact you again.
        </p>
      </div>

      {/* Requests List */}
      <AnimatePresence mode="popLayout">
        {pendingRequests.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
              text-center py-16 px-6 rounded-2xl
              ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}
            `}
          >
            <div className="text-5xl mb-4">💬</div>
            <h3 className={`text-lg font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No Pending Requests
            </h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              When someone wants to message you, they'll appear here
            </p>
          </motion.div>
        ) : (
          pendingRequests.map((request, index) => (
            <motion.div
              key={request.request_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.1 }}
              className={`
                rounded-2xl p-4 sm:p-6 border transition-all
                ${theme === 'dark'
                  ? 'bg-gray-800/50 border-gray-700'
                  : 'bg-white border-gray-200 shadow-sm'
                }
                ${processingId === request.request_id ? 'opacity-50' : ''}
              `}
            >
              {/* Header */}
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
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
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-bold text-base truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {request.from_display_name}
                    </h3>
                    
                    {/* Verification badge (if verified) */}
                    <Shield className="w-4 h-4 text-blue-500" />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {request.from_handle}
                    </span>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      •
                    </span>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {request.from_village_role}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className={`w-3 h-3 ${
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                    }`}>
                      {formatPostTime(request.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Preview */}
              <div className={`
                p-3 rounded-xl mb-4 text-sm
                ${theme === 'dark'
                  ? 'bg-gray-900/50 text-gray-300'
                  : 'bg-gray-50 text-gray-700'
                }
              `}>
                <p className="italic">"{request.message_preview}"</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(request.request_id)}
                  disabled={processingId === request.request_id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  Accept
                </button>

                <button
                  onClick={() => handleDecline(request.request_id)}
                  disabled={processingId === request.request_id}
                  className={`
                    flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
                    transition-all disabled:opacity-50
                    ${theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }
                  `}
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Decline</span>
                </button>

                <button
                  onClick={() => handleBlock(request.request_id)}
                  disabled={processingId === request.request_id}
                  className={`
                    p-2.5 rounded-xl transition-all disabled:opacity-50
                    ${theme === 'dark'
                      ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400'
                      : 'bg-red-50 hover:bg-red-100 text-red-600'
                    }
                  `}
                  title="Block user"
                >
                  <AlertCircle className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageRequests;