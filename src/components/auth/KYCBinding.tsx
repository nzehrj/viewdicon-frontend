import React, { useState } from 'react';
import { Feather, MapPin, Calendar, Heart, Home, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { updateUserProfile } from '@store/slices/userSlice';

interface KYCBindingProps {
  onComplete: () => void;
}

type Scene = 'naming' | 'origins' | 'seasons' | 'totem' | 'present';

interface KYCData {
  fullName: string;
  aliases: string;
  country: string;
  state: string;
  village: string;
  birthDate: string;
  birthSeason: string;
  tribe: string;
  totem: string;
  currentAddress: string;
  altPhone: string;
}

export const KYCBinding: React.FC<KYCBindingProps> = ({ onComplete }) => {
  const [scene, setScene] = useState<Scene>('naming');
  const [kycData, setKYCData] = useState<KYCData>({
    fullName: '',
    aliases: '',
    country: 'Nigeria',
    state: '',
    village: '',
    birthDate: '',
    birthSeason: '',
    tribe: '',
    totem: '',
    currentAddress: '',
    altPhone: '',
  });
  const theme = useAppSelector((state) => state.theme.theme);
  const dispatch = useAppDispatch();

  const scenes = {
    naming: {
      icon: Feather,
      color: 'from-purple-500 to-purple-600',
      title: 'Your Names',
      question: 'In the tongue of your people, speak the name you are called at home.',
      description: 'We honor all your names—the ones given at birth, those earned in life, and the names whispered by those who love you.',
      fields: [
        { key: 'fullName', label: 'Full Name', placeholder: 'Adebayo Oluwaseun Johnson', required: true },
        { key: 'aliases', label: 'Other Names or Aliases (optional)', placeholder: 'Seun, AJ, Chief' },
      ],
    },
    origins: {
      icon: MapPin,
      color: 'from-blue-500 to-blue-600',
      title: 'Your Origins',
      question: 'From which land and village did your line emerge?',
      description: 'Every river knows its source. Tell us of the soil that first held your ancestors\' footsteps.',
      fields: [
        { key: 'country', label: 'Country', placeholder: 'Nigeria', required: true },
        { key: 'state', label: 'State/Region', placeholder: 'Lagos, Oyo, Enugu', required: true },
        { key: 'village', label: 'Village or Town', placeholder: 'Ibadan, Owerri, Kano' },
      ],
    },
    seasons: {
      icon: Calendar,
      color: 'from-amber-500 to-amber-600',
      title: 'Your Seasons',
      question: 'Tell the season and year of your first cry.',
      description: 'Time is measured differently across our lands—by harvests, by rains, by festivals. Share what you remember.',
      fields: [
        { key: 'birthDate', label: 'Birth Date (approximate is fine)', placeholder: 'DD/MM/YYYY or Year only', required: true },
        { key: 'birthSeason', label: 'Season or Festival (optional)', placeholder: 'Harmattan, Planting season, After Eid' },
      ],
    },
    totem: {
      icon: Heart,
      color: 'from-red-500 to-red-600',
      title: 'Your People',
      question: 'Name your people and the mark that protects them.',
      description: 'Every clan carries symbols, every people hold sacred their totems. What is yours?',
      fields: [
        { key: 'tribe', label: 'Tribe or Ethnic Group', placeholder: 'Yoruba, Igbo, Hausa, Zulu, Akan', required: true },
        { key: 'totem', label: 'Totem or Clan Symbol (optional)', placeholder: 'Lion, Eagle, Baobab tree' },
      ],
    },
    present: {
      icon: Home,
      color: 'from-green-500 to-green-600',
      title: 'Your Present Path',
      question: 'Where do you lay your head today?',
      description: 'Home is where we return after the day\'s journey. Tell us where you dwell now.',
      fields: [
        { key: 'currentAddress', label: 'Current Address', placeholder: '123 Lagos Street, Victoria Island', required: true },
        { key: 'altPhone', label: 'Alternative Contact (optional)', placeholder: '+234 801 234 5678' },
      ],
    },
  };

  const currentScene = scenes[scene as keyof typeof scenes];
  const sceneKeys = Object.keys(scenes) as Scene[];
  const currentIndex = sceneKeys.indexOf(scene);
  const progress = ((currentIndex + 1) / sceneKeys.length) * 100;

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < sceneKeys.length) {
      setScene(sceneKeys[nextIndex]);
    } else {
      // ✅ Save KYC data to Redux before completing
      dispatch(updateUserProfile({
        full_name: kycData.fullName,
        name: kycData.fullName.split(' ')[0], // First name
        country: kycData.country,
        tribe: kycData.tribe,
        // Add other fields as needed
      }));
      
      // ✅ Proceed directly to next step (no completion scene)
      onComplete();
    }
  };

  const isLastScene = currentIndex >= sceneKeys.length - 1;

  const handleBack = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setScene(sceneKeys[prevIndex]);
    }
  };

  const canProceed = () => {
    const requiredFields = currentScene.fields
      .filter((field) => field.required)
      .every((field) => kycData[field.key as keyof KYCData].trim() !== '');
    return requiredFields;
  };

  const IconComponent = currentScene.icon;

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          <motion.div
            key={scene}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className={`p-6 sm:p-8 rounded-3xl ${
              theme === 'dark' ? 'bg-gray-800/30 backdrop-blur-sm' : 'bg-white shadow-xl'
            }`}
          >
            {/* Progress Bar */}
            <div className={`h-2 rounded-full mb-6 sm:mb-8 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${currentScene.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${currentScene.color} flex items-center justify-center`}>
                <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {currentScene.title}
            </h2>

            {/* Question */}
            <p className={`text-center text-base sm:text-lg mb-3 italic ${
              theme === 'dark' ? 'text-amber-300' : 'text-amber-600'
            }`}>
              "{currentScene.question}"
            </p>

            {/* Description */}
            <p className={`text-center text-sm sm:text-base mb-6 sm:mb-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {currentScene.description}
            </p>

            {/* Fields */}
            <div className="space-y-4 mb-6 sm:mb-8">
              {currentScene.fields.map((field) => (
                <Input
                  key={field.key}
                  label={field.label}
                  value={kycData[field.key as keyof KYCData]}
                  onChange={(e) =>
                    setKYCData({ ...kycData, [field.key]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  required={field.required}
                />
              ))}
            </div>

            {/* Navigation - STACKED ON MOBILE */}
            <div className="flex flex-col sm:flex-row gap-3">
              {currentIndex > 0 && (
                <Button 
                  variant="outline" 
                  onClick={handleBack} 
                  className="w-full sm:flex-1"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="w-full sm:flex-1"
              >
                {isLastScene ? 'Complete' : 'Continue'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Step Indicator */}
            <p className={`text-center text-sm mt-6 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Scene {currentIndex + 1} of {sceneKeys.length}
            </p>
          </motion.div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default KYCBinding;