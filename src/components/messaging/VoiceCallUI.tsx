import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Video,
  MessageCircle,
  MoreVertical,
  UserPlus,
  PhoneForwarded,
  X,
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface VoiceCallUIProps {
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  contactVillage?: string;
  callType: 'incoming' | 'outgoing' | 'active';
  onAccept?: () => void;
  onDecline?: () => void;
  onEnd?: () => void;
  onToggleMute?: (muted: boolean) => void;
  onToggleSpeaker?: (enabled: boolean) => void;
  onUpgradeToVideo?: () => void;
  onAddParticipant?: () => void;
  onSendMessage?: () => void;
}

/**
 * VOICE CALL UI COMPONENT
 * 
 * Audio call interface with real-time call controls
 * Supports incoming, outgoing, and active call states
 * Mobile-first design matching VideoCallUI style
 * 
 * Location: src/components/messaging/VoiceCallUI.tsx
 */
export const VoiceCallUI: React.FC<VoiceCallUIProps> = ({
  contactName,
  contactAvatar,
  contactVillage,
  callType,
  onAccept,
  onDecline,
  onEnd,
  onToggleMute,
  onToggleSpeaker,
  onUpgradeToVideo,
  onAddParticipant,
  onSendMessage,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Call duration timer (only for active calls)
  useEffect(() => {
    if (callType !== 'active') return;

    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callType]);

  // Format call duration (MM:SS)
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    onToggleMute?.(newMutedState);
  };

  // Handle speaker toggle
  const handleSpeakerToggle = () => {
    const newSpeakerState = !isSpeakerOn;
    setIsSpeakerOn(newSpeakerState);
    onToggleSpeaker?.(newSpeakerState);
  };

  // Get call status text
  const getCallStatus = () => {
    switch (callType) {
      case 'incoming':
        return 'Incoming call...';
      case 'outgoing':
        return 'Calling...';
      case 'active':
        return formatDuration(callDuration);
      default:
        return '';
    }
  };

  return (
    <div className={`fixed max-w-4xl mx-auto inset-0 z-[80] ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      {/* Professional Background Pattern with Viewdicon Logos */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Elegant gradient overlay - STATIC, NO ANIMATION */}
        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-purple-900/10 via-gray-900 to-blue-900/10' 
            : 'bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50'
        }`} />
        
        {/* Viewdicon logo pattern - WhatsApp style */}
        <div className={`absolute inset-0 ${theme === 'dark' ? 'opacity-[0.02]' : 'opacity-[0.04]'}`}>
          {/* Use inline SVG or base64 if external image doesn't load */}
          {[...Array(15)].map((_, i) => {
            const positions = [
              { top: '10%', left: '10%', rotate: 12, size: 96 },
              { top: '15%', right: '15%', rotate: -15, size: 112 },
              { top: '25%', left: '35%', rotate: 45, size: 104 },
              { top: '30%', left: '12%', rotate: -30, size: 128 },
              { top: '35%', right: '18%', rotate: 90, size: 100 },
              { top: '40%', left: '55%', rotate: -45, size: 92 },
              { top: '50%', left: '20%', rotate: 180, size: 116 },
              { top: '50%', right: '30%', rotate: 25, size: 108 },
              { top: '60%', left: '45%', rotate: -60, size: 96 },
              { top: '65%', right: '20%', rotate: 135, size: 104 },
              { top: '70%', left: '25%', rotate: -90, size: 100 },
              { top: '75%', right: '35%', rotate: 15, size: 120 },
              { top: '22%', right: '40%', rotate: -25, size: 112 },
              { top: '58%', left: '65%', rotate: 75, size: 96 },
              { top: '80%', left: '15%', rotate: -75, size: 108 },
            ];
            const pos = positions[i];
            
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  top: pos.top,
                  left: pos.left,
                  right: pos.right,
                  width: `${pos.size}px`,
                  height: `${pos.size}px`,
                  transform: `rotate(${pos.rotate}deg)`,
                }}
              >
                {/* Viewdicon logo text as fallback pattern */}
                <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-6xl ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  vi
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Professional Header */}
        <div className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 ${
          theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/50'
        } backdrop-blur-xl border-b ${
          theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'
        }`}>
          <div className="flex-1" /> {/* Spacer */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              callType === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`} />
            <h1 className={`text-sm sm:text-base font-semibold tracking-wide ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {callType === 'incoming' ? 'Incoming Call' : callType === 'outgoing' ? 'Calling...' : 'Voice Call'}
            </h1>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className={`p-2 sm:p-2.5 rounded-xl transition-all ${
                theme === 'dark' ? 'hover:bg-gray-800/80' : 'hover:bg-gray-100/80'
              }`}
            >
              <MoreVertical className={`w-4 h-4 sm:w-5 sm:h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`} />
            </button>
          </div>
        </div>

        {/* Call Info - Professional Center Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6">
          {/* Enhanced Avatar - Static, No Layout Shifts */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-6 sm:mb-10"
          >
            <div className="relative">
              {/* Main Avatar Container - Fixed Size */}
              <div className={`relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700/50' 
                  : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/50'
              } backdrop-blur-xl border-2 flex items-center justify-center shadow-2xl`}>
                {contactAvatar ? (
                  <img 
                    src={contactAvatar} 
                    alt={contactName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className={`text-5xl sm:text-7xl lg:text-8xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {contactName.charAt(0)}
                  </span>
                )}

                {/* Active call indicator - subtle inner glow, no animation */}
                {callType === 'active' && (
                  <div className={`absolute inset-0 rounded-full border-2 ${
                    theme === 'dark' ? 'border-green-500' : 'border-green-600'
                  } opacity-80`} />
                )}
              </div>

              {/* Call type indicator badge - no animation */}
              {callType === 'incoming' && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-semibold shadow-lg">
                  Incoming
                </div>
              )}
            </div>
          </motion.div>

          {/* Contact Name with Professional Typography - Responsive */}
          <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 text-center tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {contactName}
          </h2>

          {/* Village with Subtle Styling */}
          {contactVillage && (
            <div className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full mb-3 sm:mb-4 ${
              theme === 'dark' ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-100/50 text-gray-600'
            } backdrop-blur-sm`}>
              <p className="text-xs sm:text-sm font-medium">
                {contactVillage}
              </p>
            </div>
          )}

          {/* Call Status - Static, No Layout Shifts */}
          <div className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full ${
            theme === 'dark' ? 'bg-gray-800/40' : 'bg-white/40'
          } backdrop-blur-md`}>
            <Phone className={`w-3 h-3 sm:w-4 sm:h-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <p className={`text-base sm:text-lg font-semibold ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {getCallStatus()}
            </p>
          </div>

          {/* Audio Wave Animation - Fixed Height Container */}
          {callType === 'active' && !isMuted && (
            <div className="h-8 flex items-center justify-center gap-1 sm:gap-1.5 mt-6 sm:mt-8">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    height: ['8px', '24px', '8px'],
                  }}
                  transition={{ 
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                  className={`w-1 sm:w-1.5 rounded-full ${
                    theme === 'dark' ? 'bg-purple-500' : 'bg-purple-600'
                  }`}
                  style={{ boxShadow: '0 0 8px rgba(168, 85, 247, 0.4)' }}
                />
              ))}
            </div>
          )}
          {/* Placeholder when not showing wave - maintains layout */}
          {(callType !== 'active' || isMuted) && (
            <div className="h-8 mt-6 sm:mt-8" />
          )}
        </div>

        {/* WhatsApp-Style Controls Section */}
        <div className={`px-4 sm:px-6 pb-8 sm:pb-10 pt-4 sm:pt-6 ${
          theme === 'dark' ? 'bg-gray-900/30' : 'bg-white/30'
        } backdrop-blur-xl border-t ${
          theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'
        }`}>
          {callType === 'incoming' ? (
            // Incoming call actions - WhatsApp style horizontal
            <div className="flex items-center justify-center gap-12 sm:gap-16">
              <ActionButton 
                label="Decline" 
                onClick={onDecline} 
                color="bg-red-500 hover:bg-red-600"
                size="large"
              >
                <PhoneOff className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
              </ActionButton>

              <ActionButton 
                label="Accept" 
                onClick={onAccept} 
                color="bg-green-500 hover:bg-green-600"
                size="large"
              >
                <Phone className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
              </ActionButton>
            </div>
          ) : (
            // Active/Outgoing call controls - WhatsApp grid layout
            <>
              {/* Control Icons Grid - WhatsApp 4-column Style */}
              <div className="grid grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Mute Button */}
                <ActionButton 
                  label={isMuted ? "Unmute" : "Mute"} 
                  onClick={handleMuteToggle}
                  isActive={isMuted}
                  whatsappStyle
                >
                  {isMuted ? (
                    <MicOff className="w-6 h-6 sm:w-7 sm:h-7" />
                  ) : (
                    <Mic className="w-6 h-6 sm:w-7 sm:h-7" />
                  )}
                </ActionButton>

                {/* Video Button */}
                {onUpgradeToVideo && (
                  <ActionButton 
                    label="Video" 
                    onClick={onUpgradeToVideo}
                    whatsappStyle
                  >
                    <Video className="w-6 h-6 sm:w-7 sm:h-7" />
                  </ActionButton>
                )}

                {/* Speaker Button */}
                <ActionButton 
                  label="Speaker" 
                  onClick={handleSpeakerToggle}
                  isActive={isSpeakerOn}
                  whatsappStyle
                >
                  {isSpeakerOn ? (
                    <Volume2 className="w-6 h-6 sm:w-7 sm:h-7" />
                  ) : (
                    <VolumeX className="w-6 h-6 sm:w-7 sm:h-7" />
                  )}
                </ActionButton>

                {/* Add Participant or Message Button */}
                {onAddParticipant ? (
                  <ActionButton 
                    label="Add" 
                    onClick={onAddParticipant}
                    whatsappStyle
                  >
                    <UserPlus className="w-6 h-6 sm:w-7 sm:h-7" />
                  </ActionButton>
                ) : onSendMessage && (
                  <ActionButton 
                    label="Message" 
                    onClick={onSendMessage}
                    whatsappStyle
                  >
                    <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                  </ActionButton>
                )}
              </div>

              {/* End Call Button - WhatsApp Style Centered Below */}
              <div className="flex justify-center">
                <ActionButton 
                  label="End Call" 
                  onClick={onEnd} 
                  color="bg-red-500 hover:bg-red-600"
                  size="large"
                >
                  <PhoneOff className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </ActionButton>
              </div>
            </>
          )}
        </div>

        {/* More Options Menu */}
        <AnimatePresence>
          {showMoreOptions && (
            <>
              <div
                onClick={() => setShowMoreOptions(false)}
                className="fixed inset-0 bg-black/50 z-[90]"
              />

              <div
                className={`fixed bottom-0 left-0 right-0 z-[100] rounded-t-2xl p-6 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    More Options
                  </h3>
                  <button
                    onClick={() => setShowMoreOptions(false)}
                    className={`p-2 rounded-lg ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      console.log('Forward call');
                      setShowMoreOptions(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <PhoneForwarded className="w-5 h-5" />
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      Forward Call
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Helper component for action buttons - WhatsApp Style
const ActionButton: React.FC<{
  label: string;
  onClick?: () => void;
  color?: string;
  isActive?: boolean;
  size?: 'normal' | 'large';
  whatsappStyle?: boolean;
  children: React.ReactNode;
}> = ({ label, onClick, color, isActive, size = 'normal', whatsappStyle, children }) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  // WhatsApp-style button
  if (whatsappStyle) {
    return (
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onClick}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg ${
            isActive
              ? 'bg-white text-gray-900'
              : theme === 'dark'
              ? 'bg-gray-800/60 text-white hover:bg-gray-700/60'
              : 'bg-white/60 text-gray-900 hover:bg-gray-50/60'
          } backdrop-blur-xl`}
        >
          {children}
        </button>
        <span className={`text-xs font-medium ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </span>
      </div>
    );
  }
  
  // Standard button (for incoming call actions)
  const buttonSize = size === 'large' ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-14 h-14 sm:w-16 sm:h-16';
  const buttonColor = color || 'bg-white/20 backdrop-blur-sm';
  
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <button
        onClick={onClick}
        className={`${buttonSize} rounded-full flex items-center justify-center transition-colors shadow-lg active:scale-95 ${buttonColor}`}
      >
        {children}
      </button>
      <span className={`text-xs sm:text-sm font-medium ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label}
      </span>
    </div>
  );
};

export default VoiceCallUI;