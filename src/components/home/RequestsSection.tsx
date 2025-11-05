import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ChevronRight, Clock } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import { formatPostTime } from '@/types/feed.types';

export const RequestsSection: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const messageRequests = useAppSelector((state) => state.user.messageRequests);

  const pendingRequests = messageRequests.filter(r => r.status === 'pending').slice(0, 3);

  return (
    <div className={`rounded-2xl p-6 ${
      theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Whisper Requests
            </h2>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {pendingRequests.length} pending
            </p>
          </div>
        </div>
        
        {pendingRequests.length > 0 && (
          <button 
            className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            } hover:underline flex items-center gap-1`}
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Requests List */}
      {pendingRequests.length === 0 ? (
        <div className={`text-center py-8 rounded-xl ${
          theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
        }`}>
          <MessageSquare className={`w-12 h-12 mx-auto mb-3 ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            No pending requests
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((request) => (
            <motion.div
              key={request.request_id}
              whileHover={{ scale: 1.01 }}
              className={`p-4 rounded-xl cursor-pointer transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-900/50 hover:bg-gray-900' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {request.from_display_name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {request.from_display_name}
                  </p>
                  <p className={`text-xs truncate ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {request.message_preview}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
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
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsSection;