import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, Smile, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientBackground } from '../common/GradientBackground';
import { Button } from '../common/Button';
import { useAppSelector } from '../../store/hooks';

interface FaceRecognitionProps {
  onNext: () => void;
}

type CaptureStep = 'instructions' | 'neutral' | 'smile' | 'complete';

export const FaceRecognition: React.FC<FaceRecognitionProps> = ({ onNext }) => {
  const [step, setStep] = useState<CaptureStep>('instructions');
  const [cameraActive, setCameraActive] = useState(false);
  const [neutralImage, setNeutralImage] = useState<string | null>(null);
  const [smileImage, setSmileImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    if (step === 'neutral' || step === 'smile') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [step]);

  const startCamera = async () => {
    try {
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                setCameraActive(true);
                console.log('Camera started successfully');
              })
              .catch((err) => {
                console.error('Error playing video:', err);
                setError('Failed to start video playback');
              });
          }
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera permission denied. Please allow camera access to continue.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else if (err.name === 'NotReadableError') {
          setError('Camera is already in use by another application.');
        } else {
          setError(`Camera error: ${err.message}`);
        }
      } else {
        setError('Failed to access camera. Please check your browser settings.');
      }
      
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Camera not ready. Please try again.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      setError('Failed to get canvas context.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg', 0.9);

    if (step === 'neutral') {
      setNeutralImage(imageData);
      setStep('smile');
    } else if (step === 'smile') {
      setSmileImage(imageData);
      stopCamera();
      setStep('complete');
    }
  };

  const handleStartCapture = () => {
    setStep('neutral');
  };

  const handleSkip = () => {
    stopCamera();
    onNext();
  };

  const handleComplete = () => {
    if (neutralImage && smileImage) {
      localStorage.setItem('face_neutral', neutralImage);
      localStorage.setItem('face_smile', smileImage);
    }
    onNext();
  };

  const handleRetry = () => {
    setNeutralImage(null);
    setSmileImage(null);
    setStep('neutral');
  };

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl ${
              theme === 'dark' ? 'bg-gray-800/30 backdrop-blur-sm' : 'bg-white shadow-xl'
            }`}
          >
            {/* Header - Responsive sizing */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Face Recognition Setup
              </h2>
              <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Help us recognize you with a quick photo
              </p>
            </div>

            <AnimatePresence mode="wait">
              {/* INSTRUCTIONS SCREEN */}
              {step === 'instructions' && (
                <motion.div
                  key="instructions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 ${
                    theme === 'dark' ? 'bg-blue-900/20 border-2 border-blue-500/30' : 'bg-blue-50 border-2 border-blue-200'
                  }`}>
                    <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
                      theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                    }`}>
                      📸 What to Expect
                    </h3>
                    <ul className={`space-y-2 sm:space-y-3 ${
                      theme === 'dark' ? 'text-blue-200' : 'text-blue-600'
                    }`}>
                      <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                        <span>We'll take two photos: one neutral and one smiling</span>
                      </li>
                      <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                        <span>Make sure you're in a well-lit area</span>
                      </li>
                      <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                        <span>Remove glasses or masks if possible</span>
                      </li>
                      <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                        <span>Look directly at the camera</span>
                      </li>
                    </ul>
                  </div>

                  {/* Buttons - Stack on mobile */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button onClick={handleSkip} variant="outline" className="w-full sm:flex-1" size="lg">
                      Skip for Now
                    </Button>
                    <Button onClick={handleStartCapture} className="w-full sm:flex-1" size="lg">
                      Start Camera
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* CAPTURE SCREEN (Neutral & Smile) */}
              {(step === 'neutral' || step === 'smile') && (
                <motion.div
                  key="capture"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Instruction Banner */}
                  <div className={`p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 text-center ${
                    step === 'neutral'
                      ? theme === 'dark'
                        ? 'bg-blue-900/20 border-2 border-blue-500/30'
                        : 'bg-blue-50 border-2 border-blue-200'
                      : theme === 'dark'
                      ? 'bg-yellow-900/20 border-2 border-yellow-500/30'
                      : 'bg-yellow-50 border-2 border-yellow-200'
                  }`}>
                    <p className={`text-base sm:text-lg font-semibold ${
                      step === 'neutral'
                        ? theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                        : theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
                    }`}>
                      {step === 'neutral' ? '📷 Keep a neutral expression' : '😊 Now smile!'}
                    </p>
                  </div>

                  {/* Video Container - Responsive height */}
                  <div className="relative mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-900">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-auto transform scale-x-[-1]"
                      style={{ 
                        maxHeight: '50vh', // Reduced for mobile
                        minHeight: '300px' // Minimum height for usability
                      }}
                    />

                    {/* Face Guide Overlay - Responsive sizing */}
                    {cameraActive && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-80 border-4 border-white/50 rounded-full">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 sm:-translate-y-8 bg-white/90 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg">
                            <p className="text-xs sm:text-sm font-semibold text-gray-900">
                              {step === 'neutral' ? 'Neutral Face' : 'Smile!'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Loading State */}
                    {!cameraActive && !error && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                        <div className="text-center p-4">
                          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-white border-t-transparent mx-auto mb-3 sm:mb-4"></div>
                          <p className="text-white font-semibold text-sm sm:text-base">Starting camera...</p>
                        </div>
                      </div>
                    )}

                    {/* Error State */}
                    {error && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90">
                        <div className="text-center p-4 sm:p-6 max-w-md mx-4">
                          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
                          <p className="text-white font-semibold text-sm sm:text-base mb-2">Camera Error</p>
                          <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">{error}</p>
                          <Button onClick={startCamera} variant="outline" size="sm">
                            Try Again
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <canvas ref={canvasRef} className="hidden" />

                  {/* Buttons - Stack on mobile */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button onClick={handleSkip} variant="outline" className="w-full sm:flex-1" size="lg">
                      Skip
                    </Button>
                    <Button
                      onClick={captureImage}
                      disabled={!cameraActive}
                      className="w-full sm:flex-1"
                      size="lg"
                    >
                      {step === 'neutral' ? (
                        <>
                          <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Capture Neutral
                        </>
                      ) : (
                        <>
                          <Smile className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Capture Smile
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* COMPLETE SCREEN */}
              {step === 'complete' && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Photos Captured Successfully!
                    </h3>
                    <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Your face recognition is set up
                    </p>
                  </div>

                  {/* Preview Images - Responsive grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {neutralImage && (
                      <div className="rounded-xl overflow-hidden">
                        <img 
                          src={neutralImage} 
                          alt="Neutral" 
                          className="w-full h-auto transform scale-x-[-1]"
                          style={{ maxHeight: '250px', objectFit: 'cover' }}
                        />
                        <p className={`text-center mt-2 text-xs sm:text-sm font-semibold ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Neutral Expression
                        </p>
                      </div>
                    )}
                    {smileImage && (
                      <div className="rounded-xl overflow-hidden">
                        <img 
                          src={smileImage} 
                          alt="Smile" 
                          className="w-full h-auto transform scale-x-[-1]"
                          style={{ maxHeight: '250px', objectFit: 'cover' }}
                        />
                        <p className={`text-center mt-2 text-xs sm:text-sm font-semibold ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Smiling
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Buttons - Stack on mobile */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button onClick={handleRetry} variant="outline" className="w-full sm:flex-1" size="lg">
                      Retake Photos
                    </Button>
                    <Button onClick={handleComplete} className="w-full sm:flex-1" size="lg">
                      Continue
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default FaceRecognition;
