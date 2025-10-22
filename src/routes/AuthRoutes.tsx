import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SplashScreen } from '../components/auth/SplashScreen';
import { Greeting } from '../components/auth/Greeting';
import { TermsOfService } from '../components/auth/TermsOfService';
import { ConsentSheet } from '../components/auth/ConsentSheet';
import { PhoneVerification } from '../components/auth/PhoneVerification';
import { OTPVerification } from '../components/auth/OTPVerification';
import { ThreeCircles } from '../components/auth/ThreeCircles';
import { DeviceBinding } from '../components/auth/DeviceBinding';
import { FingerprintSetup } from '../components/auth/FingerprintSetup';
import { FaceRecognition } from '../components/auth/FaceRecognition';
import { KYCBinding } from '../components/auth/KYCBinding';
import { VoicePhrase } from '../components/auth/VoicePhrase';
import { VoiceAuthentication } from '../components/auth/VoiceAuthentication';
import { FamilyTree } from '../components/auth/FamilyTree';
import { VillageSelection } from '../components/auth/VillageSelection';
import { HeritagePrompt } from '../components/auth/HeritagePrompt';
import { HeritageChallenge } from '../components/auth/HeritageChallenge';
import { useAppSelector } from '../store/hooks';

let phoneNumber = '+234 000 000 0000';
let userLocation: 'africa' | 'diaspora' | 'other' = 'africa';

// === THE STORYTELLING JOURNEY HOME ===

const SplashScreenWrapper = () => {
  const navigate = useNavigate();
  return <SplashScreen onComplete={() => navigate('/auth/greeting')} />;
};

const GreetingWrapper = () => {
  const navigate = useNavigate();
  return <Greeting onNext={() => navigate('/auth/terms')} />;
};

const TermsWrapper = () => {
  const navigate = useNavigate();
  return (
    <TermsOfService
      onAccept={() => navigate('/auth/consent')}
      onDecline={() => navigate('/auth/greeting')}
    />
  );
};

const ConsentWrapper = () => {
  const navigate = useNavigate();
  return <ConsentSheet onAccept={() => navigate('/auth/phone')} />;
};

const PhoneWrapper = () => {
  const navigate = useNavigate();
  return <PhoneVerification onNext={() => navigate('/auth/otp')} />;
};

const OTPWrapper = () => {
  const navigate = useNavigate();

  const handleOTPSuccess = () => {
    const countryCode = phoneNumber.substring(1, 4);

    if (countryCode === '234' || countryCode === '254' || countryCode === '233') {
      userLocation = 'africa';
    } else if (countryCode === '001' || countryCode === '044') {
      userLocation = 'diaspora';
    } else {
      userLocation = 'other';
    }

    if (userLocation === 'africa' || userLocation === 'diaspora') {
      navigate('/auth/three-circles');
    } else {
      navigate('/auth/device');
    }
  };

  return <OTPVerification phone={phoneNumber} onNext={handleOTPSuccess} />;
};

const ThreeCirclesWrapper = () => {
  const navigate = useNavigate();

  const handleContinue = (circle: 'C1' | 'C2' | 'C3') => {
    // Future: API call to record circle selection can go here.
    if (circle === 'C2') {
      navigate('/auth/heritage');
    } else {
      navigate('/auth/device');
    }
  };

  return <ThreeCircles detectedLocation={userLocation} onContinue={handleContinue} />;
};

// HERITAGE PROMPT
const HeritagePromptWrapper = () => {
  const navigate = useNavigate();
  return (
    <HeritagePrompt
      onStart={() => navigate('/auth/heritage-challenge')}
      onSkip={() => navigate('/auth/device')}
    />
  );
};

// HERITAGE CHALLENGE
const HeritageChallengeWrapper = () => {
  const navigate = useNavigate();
  return (
    <HeritageChallenge
      onComplete={() => navigate('/auth/device')}
      onSkip={() => navigate('/auth/device')}
    />
  );
};

const DeviceWrapper = () => {
  const navigate = useNavigate();
  return <DeviceBinding onComplete={() => navigate('/auth/fingerprint')} />;
};

const FingerprintWrapper = () => {
  const navigate = useNavigate();
  return <FingerprintSetup onNext={() => navigate('/auth/face')} />;
};

const FaceWrapper = () => {
  const navigate = useNavigate();
  return <FaceRecognition onNext={() => navigate('/auth/kyc')} />;
};

const KYCWrapper = () => {
  const navigate = useNavigate();
  return <KYCBinding onComplete={() => navigate('/auth/voice-phrase')} />;
};

const VoicePhraseWrapper = () => {
  const navigate = useNavigate();
  const language = useAppSelector((state) => state.i18n.language);
  const phrase = 'I am proud of my African heritage';

  return (
    <VoicePhrase
      phrase={phrase}
      language={language}
      onVerify={() => navigate('/auth/voice-auth')}
    />
  );
};

const VoiceAuthWrapper = () => {
  const navigate = useNavigate();
  return <VoiceAuthentication onNext={() => navigate('/auth/family-tree')} />;
};

const FamilyTreeWrapper = () => {
  const navigate = useNavigate();
  return <FamilyTree onComplete={() => navigate('/auth/village')} />;
};

const VillageWrapper = () => {
  const navigate = useNavigate();
  // Future: API will handle selected village & role.
  return <VillageSelection onSelect={() => navigate('/dashboard')} />;
};

const AuthRoutes: React.FC = () => {
  return (
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
  );
};

export default AuthRoutes;
