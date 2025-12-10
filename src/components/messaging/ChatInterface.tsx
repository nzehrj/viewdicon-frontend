import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  Check,
  CheckCheck,
  Mic,
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import { VoiceCallUI } from './VoiceCallUI';
import { VideoCallUI } from './VideoCallUI';

interface ChatInterfaceProps {
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  contactVillage?: string;
  isOnline?: boolean;
  onBack?: () => void;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
  onViewProfile?: () => void;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
  replyTo?: string;
}

type CallType = 'voice' | 'video' | null;
type CallState = 'incoming' | 'outgoing' | 'active';

/**
 * CHAT INTERFACE COMPONENT
 * 
 * 1-on-1 messaging interface with real-time feel
 * Integrated voice and video calling
 * Mobile-first design with smooth animations
 * Message status indicators (sending, sent, delivered, read)
 * 
 * Location: src/components/messaging/ChatInterface.tsx
 */
export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  contactId,
  contactName,
  contactAvatar,
  contactVillage,
  isOnline = false,
  onBack,
  onViewProfile,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);

  // Call state
  const [activeCall, setActiveCall] = useState<CallType>(null);
  const [callState, setCallState] = useState<CallState>('outgoing');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: contactId,
      content: 'Hey! How are you doing?',
      timestamp: '2024-12-10T09:30:00',
      status: 'read',
      type: 'text',
    },
    {
      id: '2',
      senderId: user?.id || 'me',
      content: 'I\'m good! Just working on the new project.',
      timestamp: '2024-12-10T09:31:00',
      status: 'read',
      type: 'text',
    },
    {
      id: '3',
      senderId: contactId,
      content: 'That\'s great! Need any help with it?',
      timestamp: '2024-12-10T09:32:00',
      status: 'read',
      type: 'text',
    },
    {
      id: '4',
      senderId: user?.id || 'me',
      content: 'Actually yes! Could use your feedback on the design.',
      timestamp: '2024-12-10T09:33:00',
      status: 'delivered',
      type: 'text',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  // Simulate call connection after 2 seconds
  useEffect(() => {
    if (callState === 'outgoing' && activeCall) {
      const timeout = setTimeout(() => {
        setCallState('active');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [callState, activeCall]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user?.id || 'me',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      status: 'sending',
      type: 'text',
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate message being sent
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      );
    }, 500);

    // Simulate delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' as const }
            : msg
        )
      );
    }, 1000);

    // Simulate contact typing
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate response
        const response: Message = {
          id: (Date.now() + 1).toString(),
          senderId: contactId,
          content: 'Sure! I\'d love to help. Send me the designs.',
          timestamp: new Date().toISOString(),
          status: 'sent',
          type: 'text',
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Call handlers
  const handleVoiceCall = () => {
    setActiveCall('voice');
    setCallState('outgoing');
  };

  const handleVideoCall = () => {
    setActiveCall('video');
    setCallState('outgoing');
  };

  const handleEndCall = () => {
    setActiveCall(null);
    setCallState('outgoing');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
      });
    }
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
    }
  };

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {};
  messages.forEach(msg => {
    const dateKey = formatDate(msg.timestamp);
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(msg);
  });

  // Render active call UI
  if (activeCall === 'voice') {
    return (
      <VoiceCallUI
        contactId={contactId}
        contactName={contactName}
        contactAvatar={contactAvatar}
        contactVillage={contactVillage}
        callType={callState}
        onEnd={handleEndCall}
        onToggleMute={(muted) => console.log('Muted:', muted)}
        onToggleSpeaker={(enabled) => console.log('Speaker:', enabled)}
        onUpgradeToVideo={() => {
          setActiveCall('video');
          setCallState('active');
        }}
        onSendMessage={() => {
          setActiveCall(null);
          // Return to chat
        }}
      />
    );
  }

  if (activeCall === 'video') {
    return (
      <VideoCallUI
        contactId={contactId}
        contactName={contactName}
        contactAvatar={contactAvatar}
        contactVillage={contactVillage}
        callType={callState}
        onEnd={handleEndCall}
        onToggleVideo={(enabled) => console.log('Video:', enabled)}
        onToggleMute={(muted) => console.log('Muted:', muted)}
        onToggleSpeaker={(enabled) => console.log('Speaker:', enabled)}
        onSwitchCamera={() => console.log('Switch camera')}
        
      />
    );
  }

  // Regular chat interface
  return (
    <div className={`flex flex-col mx-auto max-w-4xl h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${
        theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className={`p-2 rounded-lg -ml-2 ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          <button
            onClick={onViewProfile}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <div className="relative flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                {contactAvatar ? (
                  <img src={contactAvatar} alt={contactName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {contactName.charAt(0)}
                  </span>
                )}
              </div>
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
              )}
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              <p className={`font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {contactName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleVoiceCall}
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <Phone className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleVideoCall}
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <Video className="w-5 h-5" />
          </button>
          
          <button
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {Object.keys(groupedMessages).map((dateKey) => (
          <div key={dateKey}>
            {/* Date Separator */}
            <div className="flex items-center justify-center mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
              }`}>
                {dateKey}
              </span>
            </div>

            {/* Messages */}
            {groupedMessages[dateKey].map((message, idx) => {
              const isMe = message.senderId === (user?.id || 'me');
              const showAvatar = !isMe && (
                idx === groupedMessages[dateKey].length - 1 ||
                groupedMessages[dateKey][idx + 1]?.senderId !== message.senderId
              );

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <div className="w-8 h-8 flex-shrink-0">
                      {showAvatar && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          {contactAvatar ? (
                            <img src={contactAvatar} alt={contactName} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold">
                              {contactName.charAt(0)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isMe
                          ? 'bg-purple-600 text-white rounded-br-md'
                          : theme === 'dark'
                          ? 'bg-gray-800 text-white rounded-bl-md'
                          : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                    
                    <div className={`flex items-center gap-1 mt-1 px-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                      </span>
                      {isMe && getStatusIcon(message.status)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex gap-2 items-end"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <span className="text-xs font-bold">
                  {contactName.charAt(0)}
                </span>
              </div>
              
              <div className={`px-4 py-3 rounded-2xl rounded-bl-md ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
              }`}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`px-4 py-3 border-t ${
        theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-end gap-2">
          <button
            className={`p-2 rounded-lg flex-shrink-0 ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className={`flex-1 flex items-end gap-2 px-4 py-2 rounded-2xl border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className={`flex-1 bg-transparent resize-none outline-none text-sm max-h-32 ${
                theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
              }`}
              rows={1}
            />
            
            <button
              className={`p-1 rounded-lg flex-shrink-0 ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          {inputMessage.trim() ? (
            <button
              onClick={handleSendMessage}
              className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full flex-shrink-0 transition-colors"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          ) : (
            <button
              className={`p-3 rounded-full flex-shrink-0 ${
                theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;