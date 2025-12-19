// src/components/tv/TVNativePiP.tsx
// Native Picture-in-Picture (System-Level)

import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTVMode } from '@/store/slices/tvSlice';
import type { TVChannel } from '@/types/tv/tv.types';

interface TVNativePiPProps {
  channel: TVChannel;
  isVisible: boolean;
}

export const TVNativePiP: React.FC<TVNativePiPProps> = ({
  channel,
  isVisible,
}) => {
  const dispatch = useAppDispatch();
  const player = useAppSelector((state) => state.tv.player);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [pipSupported, setPipSupported] = useState(false);
  const [isPiPActive, setIsPiPActive] = useState(false);

  // Check PiP support
  useEffect(() => {
    if ('pictureInPictureEnabled' in document) {
      setPipSupported(true);
    }
  }, []);

  // Activate PiP when mode changes
  useEffect(() => {
    if (isVisible && player.mode === 'native-pip' && pipSupported && videoRef.current) {
      enterPiP();
    }
  }, [isVisible, player.mode, pipSupported]);

  const enterPiP = async () => {
    if (!videoRef.current || !pipSupported) {
      // Fallback to floating mode
      dispatch(setTVMode('floating'));
      return;
    }

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }

      await videoRef.current.requestPictureInPicture();
      setIsPiPActive(true);
    } catch (error) {
      console.error('PiP error:', error);
      // Fallback to floating mode
      dispatch(setTVMode('floating'));
    }
  };

  // Listen to PiP events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnterPiP = () => {
      setIsPiPActive(true);
    };

    const handleLeavePiP = () => {
      setIsPiPActive(false);
      // Return to bubble mode
      dispatch(setTVMode('bubble'));
    };

    video.addEventListener('enterpictureinpicture', handleEnterPiP);
    video.addEventListener('leavepictureinpicture', handleLeavePiP);

    return () => {
      video.removeEventListener('enterpictureinpicture', handleEnterPiP);
      video.removeEventListener('leavepictureinpicture', handleLeavePiP);
    };
  }, [dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      }
    };
  }, []);

  if (!isVisible || !player.isActive) return null;

  return (
    <div className="fixed top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        autoPlay
        muted={player.isMuted}
        playsInline
        className="w-full h-full"
        // In production, this would be the actual stream URL
        poster={`https://via.placeholder.com/1920x1080/8B5CF6/FFFFFF?text=${encodeURIComponent(channel.name)}`}
      >
        {/* Stream source would go here */}
        <source src="" type="video/mp4" />
      </video>

      {/* PiP Status Overlay (shown briefly when entering PiP) */}
      {isPiPActive && (
        <div className="fixed top-4 right-4 z-50 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-out">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-sm font-semibold">TV in Picture-in-Picture</span>
        </div>
      )}

      {/* Not Supported Message */}
      {!pipSupported && isVisible && player.mode === 'native-pip' && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm">
          <p className="text-sm font-semibold mb-1">Picture-in-Picture not supported</p>
          <p className="text-xs opacity-90">Switching to floating mode...</p>
        </div>
      )}
    </div>
  );
};

export default TVNativePiP;