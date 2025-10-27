import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPhoneNumber, setUserLocation } from '../store/slices/authSlice';
import { updateUserProfile } from '../store/slices/userSlice';
import { generateAfroID } from '../utils/afroIdGenerator';
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
const AfroIDWelcome = lazy(() => import('../components/auth/AfroIDWelcome').then(module => ({ default: module.AfroIDWelcome })));

// Centered Loading Fallback Component
const CenteredLoader: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-amber-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Loader size="lg" text="Loading..." />
    </div>
  );
};

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
        console.log('📞 Phone number saved:', phone);
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
    console.log('🎉 OTP Verification Success!');
    console.log('📱 Phone Number:', phoneNumber);

    if (!phoneNumber) {
      console.error('❌ No phone number found, redirecting to phone step');
      goToStep('phone');
      return;
    }

    // Clean phone number - remove spaces, dashes, parentheses
    const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    console.log('🧹 Cleaned Number:', cleanNumber);

    // Extract country code (first 1-3 digits after +)
    let countryCode = '';
    if (cleanNumber.startsWith('+')) {
      countryCode = cleanNumber.substring(1, 4);
    } else {
      countryCode = cleanNumber.substring(0, 3);
    }

    console.log('🔢 Extracted Country Code:', countryCode);

    let userLocation: AuthState['userLocation'] = 'other';

    // African country codes
    const africanCodes = [
      '234', // Nigeria
      '254', // Kenya
      '233', // Ghana
      '27',  // South Africa
      '256', // Uganda
      '255', // Tanzania
      '263', // Zimbabwe
      '251', // Ethiopia
      '20',  // Egypt
    ];

    // Check if country code starts with any African code
    const isAfrican = africanCodes.some(code => countryCode.startsWith(code));

    if (isAfrican) {
      userLocation = 'africa';
      console.log('🌍 Detected: African country');
    }
    // Diaspora - USA/Canada (country code starts with 1)
    else if (countryCode.startsWith('1')) {
      userLocation = 'diaspora';
      console.log('🇺🇸 Detected: USA/Canada (Diaspora)');
    }
    // Diaspora - UK (country code starts with 44)
    else if (countryCode.startsWith('44')) {
      userLocation = 'diaspora';
      console.log('🇬🇧 Detected: UK (Diaspora)');
    }
    else {
      console.log('🌎 Detected: Other country');
    }

    console.log('🌍 Final User Location:', userLocation);

    // Save location to Redux
    dispatch(setUserLocation(userLocation));

    // Navigate based on location
    if (userLocation === 'africa' || userLocation === 'diaspora') {
      console.log('✅ Showing ThreeCircles step');
      goToStep('three-circles');
    } else {
      console.log('⏭️ Skipping ThreeCircles, going to Device Binding');
      goToStep('device');
    }
  };

  return <OTPVerification phone={phoneNumber || ''} onNext={handleOTPSuccess} />;
};

const ThreeCirclesWrapper = () => {
  const navigate = useNavigate();
  const userLocation = useAppSelector((state) => state.auth.userLocation);
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);

  console.log('🎯 ThreeCircles Wrapper - User Location:', userLocation);

  const handleContinue = (circle: 'C1' | 'C2' | 'C3') => {
    console.log('⭕ Circle Selected:', circle);
    
    if (circle === 'C2') {
      console.log('🌍 C2 Diaspora - Showing Heritage Challenge');
      goToStep('heritage');
    } else {
      console.log('✅ C1/C3 - Going to Device Binding');
      goToStep('device');
    }
  };

  return <ThreeCircles detectedLocation={userLocation || 'other'} onContinue={handleContinue} />;
};

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
  const goToStep = (step: AuthStep) => navigate(`/auth/${step}`);
  
  const handleVillageSelect = (_village: string, _role: string) => {
    console.log('🏘️ AuthRoutes: Village and Role callback received');
    console.log('Village:', _village, 'Role:', _role);
    
    // VillageSelection component already dispatches:
    // - setUserVillage(village)
    // - setUserRole(role)
    // - setAuthenticated(true)
    
    // Navigate to Afro-ID Welcome (Step 18)
    console.log('🆔 Navigating to Afro-ID Welcome...');
    goToStep('afro-id-welcome');
  };

  return <VillageSelection onSelect={handleVillageSelect} />;
};

const AfroIDWelcomeWrapper = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  
  // Generate Afro-ID (in production, this should come from backend after saving)
  const afroId = React.useMemo(() => {
    if (user?.afro_id) {
      return user.afro_id;
    }
    
    // Generate new Afro-ID
    return generateAfroID({
      heritage: user?.tribe || 'African',     // From KYC "Your People" step
      country: user?.country || 'Nigeria',    // From KYC "Your Origins" step
      generation: 1,                          // Default to G1, or calculate from family tree
    });
  }, [user]);

  const handleContinue = () => {
    console.log('🎉 Afro-ID copied! Proceeding to dashboard...');
    
    // Update Redux with afro_id
    dispatch(updateUserProfile({ afro_id: afroId }));
    
    // TODO: Save afroId to backend here
    // await api.saveAfroID(afroId);
    
    navigate('/dashboard', { replace: true });
  };

  return (
    <AfroIDWelcome
      afroId={afroId}
      userName={user?.full_name?.split(' ')[0] || user?.name || 'Friend'}
      heritage={user?.tribe || 'African'}
      onContinue={handleContinue}
    />
  );
};

const AuthRoutes: React.FC = () => {
  return (
    <Suspense fallback={<CenteredLoader />}>
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
        <Route path="/afro-id-welcome" element={<AfroIDWelcomeWrapper />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AuthRoutes;