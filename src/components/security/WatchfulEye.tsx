import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye,
  Camera,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader,
  RefreshCw,
  Shield,
  Info,
  X
} from 'lucide-react';

// Types
type CaptureStatus = 'idle' | 'initializing' | 'capturing' | 'verifying' | 'success' | 'failed';
type CaptureReason = 'transaction' | 'login' | 'sensitive_action' | 'scheduled_check';

interface FaceCapture {
  imageData: string;
  timestamp: string;
  quality: number;
  confidence: number;
}

interface WatchfulEyeProps {
  isActive: boolean;
  reason: CaptureReason;
  transactionAmount?: number;
  silentMode?: boolean;
  onCaptureComplete: (capture: FaceCapture) => Promise<boolean>;
  onCancel?: () => void;
  onSkip?: () => void;
  autoCapture?: boolean;
  showPreview?: boolean;
}

const WatchfulEye: React.FC<WatchfulEyeProps> = ({
  isActive,
  reason,
  transactionAmount,
  silentMode = false,
  onCaptureComplete,
  onCancel,
  onSkip,
  autoCapture = true,
  showPreview = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<CaptureStatus>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);

  useEffect(() => {
    if (isActive && status === 'idle') {
      initializeCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (status === 'capturing' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === 'capturing' && countdown === 0) {
      captureImage();
    }
  }, [status, countdown]);

  const initializeCamera = async () => {
    setStatus('initializing');
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      // Simulate face detection (in production, use actual face detection library)
      setTimeout(() => {
        setFaceDetected(true);
        if (autoCapture) {
          setStatus('capturing');
          setCountdown(3);
        } else {
          setStatus('idle');
        }
      }, 2000);
    } catch (err) {
      console.error('Camera initialization failed:', err);
      setError('Unable to access camera. Please check permissions.');
      setStatus('failed');
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);

    setStatus('verifying');

    // Simulate quality and confidence scores (in production, use actual ML model)
    const quality = Math.random() * 30 + 70; // 70-100
    const confidence = Math.random() * 20 + 80; // 80-100

    const capture: FaceCapture = {
      imageData,
      timestamp: new Date().toISOString(),
      quality,
      confidence
    };

    try {
      const verified = await onCaptureComplete(capture);
      
      if (verified) {
        setStatus('success');
        // Auto-close after success
        setTimeout(() => {
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        }, 2000);
      } else {
        setStatus('failed');
        setError('Face verification failed. Please try again.');
      }
    } catch (err) {
      console.error('Verification failed:', err);
      setStatus('failed');
      setError('Verification failed. Please try again.');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setError(null);
    setCapturedImage(null);
    setCountdown(3);
    setFaceDetected(false);
    initializeCamera();
  };

  const handleManualCapture = () => {
    if (faceDetected) {
      setStatus('capturing');
      setCountdown(3);
    }
  };

  const getReasonMessage = () => {
    const messages = {
      transaction: `Verifying your identity for transaction${transactionAmount ? ` of ₦${transactionAmount.toLocaleString()}` : ''}`,
      login: 'Verifying your identity for secure login',
      sensitive_action: 'Verifying your identity for this sensitive action',
      scheduled_check: 'Routine security verification'
    };
    return messages[reason];
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">The Watchful Eye</h3>
                  <p className="text-sm text-indigo-100">Silent face verification</p>
                </div>
              </div>
              {onCancel && status !== 'success' && (
                <button
                  onClick={onCancel}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Reason Message */}
            <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-900 font-medium mb-1">
                    Why we need this
                  </p>
                  <p className="text-sm text-blue-700">
                    {getReasonMessage()}
                  </p>
                </div>
              </div>
            </div>

            {/* Camera View */}
            <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
              {/* Video Feed */}
              {showPreview && (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              )}

              {/* Canvas for capture (hidden) */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Captured Image Preview */}
              {capturedImage && showPreview && (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {/* Face Detection Overlay */}
              {faceDetected && status !== 'success' && status !== 'failed' && !capturedImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-48 h-64 border-4 border-green-500 rounded-xl relative">
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-xl" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-xl" />
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-xl" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-xl" />
                  </div>
                </motion.div>
              )}

              {/* Countdown */}
              {status === 'capturing' && countdown > 0 && (
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50"
                >
                  <div className="text-white text-8xl font-bold">{countdown}</div>
                </motion.div>
              )}

              {/* Status Overlays */}
              {status === 'initializing' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <div className="text-center text-white">
                    <Loader className="w-12 h-12 mx-auto mb-3 animate-spin" />
                    <p className="text-sm">Initializing camera...</p>
                  </div>
                </div>
              )}

              {status === 'verifying' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <div className="text-center text-white">
                    <Loader className="w-12 h-12 mx-auto mb-3 animate-spin" />
                    <p className="text-sm">Verifying your blessing...</p>
                  </div>
                </div>
              )}

              {status === 'success' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-green-600/90"
                >
                  <div className="text-center text-white">
                    <CheckCircle className="w-16 h-16 mx-auto mb-3" />
                    <p className="text-lg font-bold mb-1">Verified!</p>
                    <p className="text-sm">Your blessing is confirmed</p>
                  </div>
                </motion.div>
              )}

              {status === 'failed' && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-600/90">
                  <div className="text-center text-white">
                    <XCircle className="w-16 h-16 mx-auto mb-3" />
                    <p className="text-lg font-bold mb-1">Verification Failed</p>
                    <p className="text-sm">{error || 'Please try again'}</p>
                  </div>
                </div>
              )}

              {/* Face Detection Indicator */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${
                  faceDetected ? 'bg-green-500' : 'bg-yellow-500'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    faceDetected ? 'bg-white' : 'bg-white animate-pulse'
                  }`} />
                  <span className="text-white text-xs font-semibold">
                    {faceDetected ? 'Face Detected' : 'Looking for face...'}
                  </span>
                </div>
                
                {status === 'capturing' && (
                  <div className="px-3 py-1 bg-red-500 rounded-full">
                    <span className="text-white text-xs font-semibold flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      Capturing
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            {status === 'idle' && faceDetected && (
              <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-green-900 font-medium mb-1">
                      Ready to capture
                    </p>
                    <p className="text-sm text-green-700">
                      Position your face in the frame and look at the camera
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 rounded-xl p-4 mb-4 border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-red-900 font-medium mb-1">
                      Error
                    </p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {status === 'idle' && faceDetected && !autoCapture && (
                <button
                  onClick={handleManualCapture}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Capture Now
                </button>
              )}

              {status === 'failed' && (
                <>
                  <button
                    onClick={handleRetry}
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                  </button>
                  {onSkip && (
                    <button
                      onClick={onSkip}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
                    >
                      Skip
                    </button>
                  )}
                </>
              )}

              {(status === 'initializing' || status === 'capturing' || status === 'verifying') && (
                <div className="flex-1 px-4 py-3 bg-gray-100 rounded-xl flex items-center justify-center gap-2">
                  <Loader className="w-5 h-5 text-gray-600 animate-spin" />
                  <span className="text-gray-700 font-medium">
                    {status === 'initializing' && 'Preparing...'}
                    {status === 'capturing' && 'Capturing...'}
                    {status === 'verifying' && 'Verifying...'}
                  </span>
                </div>
              )}
            </div>

            {/* Security Notice */}
            {!silentMode && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-purple-700">
                    Your face data is encrypted and processed securely. We never store your biometric data permanently.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WatchfulEye;