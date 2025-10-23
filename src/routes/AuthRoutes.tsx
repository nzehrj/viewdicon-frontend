import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPhoneNumber, setUserLocation } from '../store/slices/authSlice';
import { Loader } from '../components/common/Loader';
import type { AuthState, AuthStep } from '@/types/auth.types';

// Wrap named exports for lazy loading
const SplashScreen = lazy(() => import('../components/auth/SplashScreen').then(module => ({ default: module.SplashScreen })));
const Greeting = lazy(() => import('../components/auth/Greeting').then(module => ({ default: module.Greeting })));
const TermsOfService = lazy(() => import('../components/auth/TermsOfService').then(module => ({ default: module.TermsOfService })));
const ConsentSheet = lazy(() => import('../components/auth/ConsentSheet').then(module => ({ default: module.ConsentSheet })));
const PhoneVerification = lazy(() => import('../components/auth/PhoneVerification').then(module => ({ default: module.PhoneVerification })));
const OTPVerification = lazy(() => import('../components/auth/OTPVerification').then(module => ({ default: module.OTPVerification })));
const ThreeCircles = lazy(() => import('../components/auth/ThreeCircles').then(module => ({ default: module.ThreeCircles })));
const DeviceBinding = lazy(() => import('../components/auth/DeviceBinding').then(module => ({ default: module.DeviceBinding })));
const FingerprintSetup = lazy(() => import('../components/auth/FingerprintSetup').then(module => ({ default: module.FingerprintSetup })));
const FaceRecognition = lazy(() => import('../components/auth/FaceRecognition').then(module => ({ default: module.FaceRecognition })));
const KYCBinding = lazy(() => import('../components/auth/KYCBinding').then(module => ({ default: module.KYCBinding })));
const VoicePhrase = lazy(() => import('../components/auth/VoicePhrase').then(module => ({ default: module.VoicePhrase })));
const VoiceAuthentication = lazy(() => import('../components/auth/VoiceAuthentication').then(module => ({ default: module.VoiceAuthentication })));
const FamilyTree = lazy(() => import('../components/auth/FamilyTree').then(module => ({ default: module.FamilyTree })));
const VillageSelection = lazy(() => import('../components/auth/VillageSelection').then(module => ({ default: module.VillageSelection })));
const HeritagePrompt = lazy(() => import('../components/auth/HeritagePrompt').then(module => ({ default: module.HeritagePrompt })));
const HeritageChallenge = lazy(() => import('../components/auth/HeritageChallenge').then(module => ({ default: module.HeritageChallenge })));

// === THE STORYTELLING JOURNEY HOME ===

const SplashScreenWrapper = () => {
  const navigate = useNavigate();
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);
  return <SplashScreen onComplete={() => goToStep('greeting')} />;
};

const GreetingWrapper = () => {
  const navigate = useNavigate();
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);
  return <Greeting onNext={() => goToStep('terms')} />;
};

const TermsWrapper = () => {
  const navigate = useNavigate();
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);
  return (
    <TermsOfService
      onAccept={() => goToStep('consent')}
      onDecline={() => goToStep('greeting')}
    />
  );
};

const ConsentWrapper = () => {
  const navigate = useNavigate();
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);
  return <ConsentSheet onAccept={() => goToStep('phone')} />;
};

const PhoneWrapper = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);
  return (
    <PhoneVerification
      onNext={(phone: string) => {
        dispatch(setPhoneNumber(phone));
        goToStep('otp');
      }}
    />
  );
};

const OTPWrapper = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const phoneNumber = useAppSelector((state) => state.auth.phoneNumber);
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);

  const handleOTPSuccess = () => {
    if (!phoneNumber) {
      goToStep('phone');
      return;
    }

    const countryCode = phoneNumber.split(' ')[0].substring(1); // e.g., "+234" -> "234"
    let userLocation: AuthState['userLocation'] = 'other';

    if (['234', '254', '233'].includes(countryCode)) {
      userLocation = 'africa';
    } else if (['1', '44'].includes(countryCode)) {
      userLocation = 'diaspora';
    }

    dispatch(setUserLocation(userLocation));

    if (userLocation === 'africa' || userLocation === 'diaspora') {
      goToStep('three-circles');
    } else {
      goToStep('device');
    }
  };

  return <OTPVerification phone={phoneNumber || ''} onNext={handleOTPSuccess} />;
};

const ThreeCirclesWrapper = () => {
  const navigate = useNavigate();
  const userLocation = useAppSelector((state) => state.auth.userLocation);
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);

  const handleContinue = (circle: 'C1' | 'C2' | 'C3') => {
    // Future: API call to record circle selection can go here.
    if (circle === 'C2') {
      goToStep('heritage');
    } else {
      goToStep('device');
    }
  };

  return <ThreeCircles detectedLocation={userLocation || 'other'} onContinue={handleContinue} />;
};

// HERITAGE PROMPT
const HeritagePromptWrapper = () => {
  const navigate = useNavigate();
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);
  return (
    <HeritagePrompt
      onStart={() => goToStep('heritage-challenge')}
      onSkip={() => goToStep('device')}
    />
  );
};

// HERITAGE CHALLENGE
const HeritageChallengeWrapper = () => {
  const navigate = useNavigate();
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);
  return (
    <HeritageChallenge
      onComplete={() => goToStep('device')}
      onSkip={() => goToStep('device')}
    />
  );
};

const DeviceWrapper = () => {
  const navigate = useNavigate();
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);
  return <DeviceBinding onComplete={() => goToStep('fingerprint')} />;
};

const FingerprintWrapper = () => {
  const navigate = useNavigate();
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);
  return <FingerprintSetup onNext={() => goToStep('face')} />;
};

const FaceWrapper = () => {
  const navigate = useNavigate();
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);
  return <FaceRecognition onNext={() => goToStep('kyc')} />;
};

const KYCWrapper = () => {
  const navigate = useNavigate();
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);
  return <KYCBinding onComplete={() => goToStep('voice-phrase')} />;
};

const VoicePhraseWrapper = () => {
  const navigate = useNavigate();
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);
  const language = useAppSelector((state) => state.i18n.language);
  const phrase = 'I am proud of my African heritage';

  return (
    <VoicePhrase
      phrase={phrase}
      language={language}
      onVerify={() => goToStep('voice-auth')}
    />
  );
};

const VoiceAuthWrapper = () => {
  const navigate = useNavigate();
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);
  return <VoiceAuthentication onNext={() => goToStep('family-tree')} />;
};

const FamilyTreeWrapper = () => {
  const navigate = useNavigate();
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);
  return <FamilyTree onComplete={() => goToStep('village')} />;
};

const VillageWrapper = () => {
  const navigate = useNavigate();
  const handleVillageSelect = (_village: string, _role: string) => {
    // VillageSelection already dispatches setUserVillage and setUserRole
    navigate('/dashboard');
  };

  return <VillageSelection onSelect={handleVillageSelect} />;
};

const AuthRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Loader size="lg" text="Loading..." />}>
      <Routes>
        <Route path="/" element={<SplashScreenWrapper />} />
        <Route path="/greeting" element={<GreetingWrapper />} />
        <Route path="/terms" element={<TermsWrapper />} />
        <Route path="/consent" element={<ConsentWrapper />} />
        <Route path="/phone" element={<PhoneWrapper />} />
        <Route path="/otp" element={<OTPWrapper />} />
        <Route path="/three-circles" element={<ThreeCirclesWrapper />} />
        <Route path="/heritage" element={<HeritagePromptWrapper />} />
        <Route path="/heritage-challenge" element={<HeritageChallengeWrapper />} />
        <Route path="/device" element={<DeviceWrapper />} />
        <Route path="/fingerprint" element={<FingerprintWrapper />} />
        <Route path="/face" element={<FaceWrapper />} />
        <Route path="/kyc" element={<KYCWrapper />} />
        <Route path="/voice-phrase" element={<VoicePhraseWrapper />} />
        <Route path="/voice-auth" element={<VoiceAuthWrapper />} />
        <Route path="/family-tree" element={<FamilyTreeWrapper />} />
        <Route path="/village" element={<VillageWrapper />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AuthRoutes;