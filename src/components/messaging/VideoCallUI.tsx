import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Camera,
  Volume2,
  VolumeX,
  User,
} from 'lucide-react';

// --- Types and Interfaces ---

interface VideoCallUIProps {
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  contactVillage?: string;
  callType: 'incoming' | 'outgoing' | 'active';
  onAccept?: () => void;
  onDecline?: () => void;
  onEnd?: () => void;
  onToggleVideo?: (enabled: boolean) => void;
  onToggleMute?: (muted: boolean) => void;
  onToggleSpeaker?: (enabled: boolean) => void;
  onSwitchCamera?: () => void;
  hasRemoteVideo?: boolean; 
}

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  color?: string;
  isActive?: boolean;
  children: React.ReactNode;
}

// --- Helper Components ---

/**
 * Professional Action Button with subtle tap animation.
 */
const ActionButton: React.FC<ActionButtonProps> = ({ 
  label, 
  onClick, 
  color, 
  isActive, 
  children 
}) => {
  const buttonColor = isActive 
    ? 'bg-red-600' 
    : color || 'bg-white/20 backdrop-blur-md hover:bg-white/30';
  
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        // Subtle tap animation for a professional feel
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
        onClick={onClick}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors shadow-lg ${buttonColor}`}
      >
        {children}
      </motion.button>
      <span className="text-white text-xs font-medium">{label}</span>
    </div>
  );
};

// --- Main Component ---

/**
 * Professional Full-Screen Video Call UI Component.
 */
export const VideoCallUI: React.FC<VideoCallUIProps> = ({
  contactName,
  contactAvatar,
  contactVillage,
  callType,
  onAccept,
  onDecline,
  onEnd,
  onToggleVideo,
  onToggleMute,
  onToggleSpeaker,
  onSwitchCamera,
  hasRemoteVideo = false,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  // Media Stream Management
  useEffect(() => {
    let stream: MediaStream | null = null;

    const getMedia = async () => {
      if (isVideoOn && callType === 'active') { 
        try {
          // Use 'user' for front camera, 'environment' for back
          const facingMode = isFrontCamera ? 'user' : 'environment'; 
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode },
            audio: true 
          });

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing media devices.", err);
          setIsVideoOn(false); 
        }
      }
    };

    getMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoOn, isFrontCamera, callType]);

  // Call duration timer
  useEffect(() => {
    if (callType !== 'active') return;
    const interval = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [callType]);
  
  // Auto-hide controls
  useEffect(() => {
    if (!showControls || callType !== 'active') return;
    const timeout = setTimeout(() => setShowControls(false), 4000);
    return () => clearTimeout(timeout);
  }, [showControls, callType]);

  // Format the call duration (MM:SS)
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleVideoToggle = () => {
    const newState = !isVideoOn;
    setIsVideoOn(newState);
    onToggleVideo?.(newState);
  };

  const handleMuteToggle = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    onToggleMute?.(newState);
  };
  
  const handleSpeakerToggle = () => {
    const newState = !isSpeakerOn;
    setIsSpeakerOn(newState);
    onToggleSpeaker?.(newState);
  };

  const handleSwitchCamera = () => {
    setIsFrontCamera(!isFrontCamera);
    onSwitchCamera?.();
  };

  const getCallStatus = () => {
    if (callType === 'incoming') return 'Incoming video call...';
    if (callType === 'outgoing') return 'Calling...';
    if (callType === 'active') return formatDuration(callDuration);
    return '';
  };

  // --- FIX for TypeScript Error 2322 ---
  // Variants for smooth top/bottom control bar slide.
  // The 'hidden' property must be a function to accept the 'custom' prop (yOffset)
  // and resolve the value at runtime, which fixes the type mismatch.
  const controlVariants: Variants = {
    hidden: (yOffset: number) => ({ 
      y: yOffset, 
      opacity: 0 
    }),
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "tween", duration: 0.3 } 
    },
  };

  return (
    <div 
      className={`fixed max-w-4xl mx-auto inset-0 z-50 bg-black flex items-center justify-center font-sans`}
      onClick={() => callType === 'active' && setShowControls(true)}
    >
      {/* 1. Local User's Camera Feed (Full Screen Background) */}
      <div className="absolute inset-0 w-full h-full">
        {isVideoOn ? (
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover transform scale-x-[-1]" // Selfie-style mirror effect
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <VideoOff className="w-20 h-20 text-gray-700 mx-auto" />
              <p className="mt-4 text-gray-300 font-light">Your camera is off</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* 2. Remote User's Video (Draggable Picture-in-Picture Window) */}
      {callType === 'active' && (
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} 
          className="absolute top-6 right-4 w-28 h-44 sm:w-32 sm:h-48 rounded-xl overflow-hidden shadow-2xl border-2 border-white/40 cursor-grab active:cursor-grabbing bg-gray-800"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="w-full h-full flex items-center justify-center">
            {hasRemoteVideo ? (
              // Placeholder for remote video stream
              <div className="w-full h-full bg-blue-500/50 flex items-center justify-center">
                <p className="text-white text-sm">Remote Stream</p>
              </div>
            ) : contactAvatar ? (
              <img src={contactAvatar} alt={contactName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-gray-500" />
            )}
          </div>
        </motion.div>
      )}
      
      {/* 3. UI Overlays (Info and Controls) */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        
        {/* Top Bar: Contact Info & Status */}
        <AnimatePresence>
          {(showControls || callType !== 'active') && (
            <motion.div
              custom={-100} // Custom y offset for top bar
              variants={controlVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-6 pt-12 bg-gradient-to-b from-black/70 to-transparent pointer-events-auto"
            >
              <h2 className="text-white text-3xl font-semibold leading-tight">{contactName}</h2>
              {contactVillage && <p className="text-white/80 text-lg font-light">{contactVillage}</p>}
              <p className="text-white/80 text-lg mt-1">{getCallStatus()}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Bar: Call Controls */}
        <AnimatePresence>
          {(showControls || callType !== 'active') && (
            <motion.div
              custom={100} // Custom y offset for bottom bar
              variants={controlVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-6 pb-12 bg-gradient-to-t from-black/70 to-transparent pointer-events-auto"
            >
              {callType === 'incoming' ? (
                <div className="flex items-center justify-around">
                  {/* Decline Button (Red) */}
                  <ActionButton label="Decline" onClick={onDecline} color="bg-red-600 hover:bg-red-700">
                    <PhoneOff className="w-8 h-8 text-white" />
                  </ActionButton>
                  {/* Accept Button (Green) */}
                  <ActionButton label="Accept" onClick={onAccept} color="bg-green-600 hover:bg-green-700">
                    <Video className="w-8 h-8 text-white" />
                  </ActionButton>
                </div>
              ) : (
                <div className="flex items-center justify-around gap-2">
                  {/* Active Call Controls */}
                  <ActionButton label="Speaker" onClick={handleSpeakerToggle} isActive={!isSpeakerOn} color={isSpeakerOn ? 'bg-white/20' : 'bg-gray-800/80'}>
                    {isSpeakerOn ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white" />}
                  </ActionButton>
                  <ActionButton label="Mute" onClick={handleMuteToggle} isActive={isMuted} color={isMuted ? 'bg-gray-800/80' : 'bg-white/20'}>
                    {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                  </ActionButton>
                  <ActionButton label="Video" onClick={handleVideoToggle} isActive={!isVideoOn} color={!isVideoOn ? 'bg-gray-800/80' : 'bg-white/20'}>
                    {isVideoOn ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
                  </ActionButton>
                  <ActionButton label="Switch" onClick={handleSwitchCamera} color="bg-white/20">
                    <Camera className="w-6 h-6 text-white" />
                  </ActionButton>
                  {/* End Call Button */}
                  <ActionButton label="End" onClick={onEnd} color="bg-red-600 hover:bg-red-700">
                    <PhoneOff className="w-8 h-8 text-white" />
                  </ActionButton>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VideoCallUI;