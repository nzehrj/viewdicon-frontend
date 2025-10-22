import { useState, useCallback, useRef } from 'react';
import { AudioRecorder } from '@services/audio/recorder';
import { VoiceActivityDetector } from '@services/audio/vad';

export const useAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const vadRef = useRef<VoiceActivityDetector | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      const permission = await AudioRecorder.requestPermission();
      setHasPermission(permission);
      return permission;
    } catch (error) {
      console.error('Permission denied:', error);
      return false;
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (!recorderRef.current) {
      recorderRef.current = new AudioRecorder();
    }

    try {
      await recorderRef.current.startRecording();
      setIsRecording(true);

      // Start VAD
      if (!vadRef.current) {
        vadRef.current = new VoiceActivityDetector(30);
      }

      return true;
    } catch (error) {
      console.error('Recording failed:', error);
      return false;
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    if (!recorderRef.current) return null;

    try {
      const audioBlob = await recorderRef.current.stopRecording();
      setIsRecording(false);
      setAudioLevel(0);

      if (vadRef.current) {
        vadRef.current.cleanup();
        vadRef.current = null;
      }

      return audioBlob;
    } catch (error) {
      console.error('Stop recording failed:', error);
      return null;
    }
  }, []);

  const cancelRecording = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.cancelRecording();
      setIsRecording(false);
      setAudioLevel(0);
    }

    if (vadRef.current) {
      vadRef.current.cleanup();
      vadRef.current = null;
    }
  }, []);

  return {
    isRecording,
    audioLevel,
    hasPermission,
    requestPermission,
    startRecording,
    stopRecording,
    cancelRecording,
  };
};