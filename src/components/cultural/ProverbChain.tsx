// src/components/cultural/ProverbChain.tsx
// Proverb Chain - Collaborative Proverb Building Game

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Link,
  Sparkles,
  Users,
  Crown,
  Heart,
  Zap,
  Send,
  Flame
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface ChainLink {
  id: string;
  userId: string;
  userName: string;
  text: string;
  language: string;
  translation: string;
  hearts: number;
  addedAt: string;
  isAccepted: boolean;
}

interface ProverbChainProps {
  chainId: string;
  onContribute?: (text: string, language: string, translation: string) => void;
}

export const ProverbChain: React.FC<ProverbChainProps> = ({
  chainId: _chainId,
  onContribute,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [newLink, setNewLink] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('yoruba');

  // Mock chain data
  const chain: ChainLink[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Amara Okafor',
      text: 'Ọmọ tó kò gbọ́n kò lè ṣe àṣeyẹ',
      language: 'Yoruba',
      translation: 'A child who is not wise cannot run an errand',
      hearts: 45,
      addedAt: '2025-01-15T10:00:00Z',
      isAccepted: true,
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Kwame Mensah',
      text: 'Onye wetara oji wetara ndu',
      language: 'Igbo',
      translation: 'He who brings kola nut brings life',
      hearts: 38,
      addedAt: '2025-01-15T10:30:00Z',
      isAccepted: true,
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Fatima Hassan',
      text: 'Gaskiya ta fi ƙarfi',
      language: 'Hausa',
      translation: 'Truth is stronger',
      hearts: 52,
      addedAt: '2025-01-15T11:00:00Z',
      isAccepted: true,
    },
  ];

  const languages = [
    { code: 'yoruba', name: 'Yoruba', flag: '🇳🇬' },
    { code: 'igbo', name: 'Igbo', flag: '🇳🇬' },
    { code: 'hausa', name: 'Hausa', flag: '🇳🇬' },
    { code: 'swahili', name: 'Swahili', flag: '🇰🇪' },
    { code: 'zulu', name: 'Zulu', flag: '🇿🇦' },
    { code: 'amharic', name: 'Amharic', flag: '🇪🇹' },
    { code: 'twi', name: 'Twi', flag: '🇬🇭' },
  ];

  const handleSubmit = () => {
    if (!newLink.trim() || !newTranslation.trim()) return;
    onContribute?.(newLink, selectedLanguage, newTranslation);
    setNewLink('');
    setNewTranslation('');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    } pb-20`}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 opacity-90" />
        
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-32 h-32 border-4 border-white rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-24 h-24 border-4 border-white rounded-full"
          />
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-white" />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Link className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <h1 className="text-2xl sm:text-4xl font-bold text-white">
                  Proverb Chain
                </h1>
              </div>
              <p className="text-base sm:text-lg text-white/90 mb-6">
                Build wisdom together, one proverb at a time
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Link className="w-5 h-5 text-white" />
                    <span className="text-xs text-white/80">Links</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{chain.length}</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-white" />
                    <span className="text-xs text-white/80">Contributors</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{new Set(chain.map(c => c.userId)).size}</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-5 h-5 text-white" />
                    <span className="text-xs text-white/80">Total Hearts</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{chain.reduce((sum, c) => sum + c.hearts, 0)}</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-5 h-5 text-white" />
                    <span className="text-xs text-white/80">Heat</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{chain.reduce((sum, c) => sum + c.hearts * 2, 0)}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        {/* How It Works */}
        <div className={`p-6 rounded-2xl mb-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                How to Build the Chain
              </h2>
              <p className={`text-sm leading-relaxed ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Add a proverb in any African language that connects to the theme of wisdom. 
                Each link should complement the previous one, building a tapestry of cultural knowledge. 
                The community votes on the best additions!
              </p>
            </div>
          </div>
        </div>

        {/* The Chain */}
        <div className="mb-6">
          <h3 className={`text-xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            The Wisdom Chain
          </h3>

          <div className="space-y-4">
            {chain.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector */}
                {index > 0 && (
                  <div className="absolute -top-4 left-8 w-0.5 h-4 bg-gradient-to-b from-green-600 to-emerald-600" />
                )}

                <div className={`p-5 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } border-2 ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                } hover:border-green-600 transition-all shadow-lg`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {link.userName}
                          </p>
                          {index === 0 && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`px-2 py-0.5 rounded-full ${
                            theme === 'dark' ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700'
                          } font-semibold`}>
                            {link.language}
                          </span>
                          <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                            •
                          </span>
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            {formatTimestamp(link.addedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {link.isAccepted && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
                        <Zap className="w-3 h-3 text-green-500" />
                        <span className="text-xs font-bold text-green-500">Accepted</span>
                      </div>
                    )}
                  </div>

                  {/* Proverb */}
                  <div className={`mb-3 p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <p className={`text-lg sm:text-xl font-bold mb-2 italic ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-700'
                    }`}>
                      "{link.text}"
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {link.translation}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}>
                      <Heart className="w-4 h-4" />
                      <span className="font-semibold">{link.hearts}</span>
                    </button>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 text-orange-500 rounded-lg">
                      <Flame className="w-4 h-4" />
                      <span className="font-semibold">{link.hearts * 2}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Add Link Form */}
        <div className={`p-6 rounded-2xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
          <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <Link className="w-6 h-6 text-green-600" />
            Add Your Link
          </h3>

          {/* Language Selector */}
          <div className="mb-4">
            <label className={`block text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              Language
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedLanguage === lang.code
                      ? 'border-green-600 bg-green-600/10'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl mb-1 block">{lang.flag}</span>
                  <span className={`text-sm font-semibold ${
                    selectedLanguage === lang.code 
                      ? 'text-green-600' 
                      : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {lang.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Proverb Input */}
          <div className="mb-4">
            <label className={`block text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              Proverb (in {languages.find(l => l.code === selectedLanguage)?.name})
            </label>
            <textarea
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="Enter a proverb in the selected language..."
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                theme === 'dark'
                  ? 'border-gray-700 bg-gray-700 text-white'
                  : 'border-gray-200 bg-white'
              } focus:outline-none focus:border-green-600 transition-colors`}
            />
          </div>

          {/* Translation Input */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              English Translation
            </label>
            <textarea
              value={newTranslation}
              onChange={(e) => setNewTranslation(e.target.value)}
              placeholder="Provide the English translation..."
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                theme === 'dark'
                  ? 'border-gray-700 bg-gray-700 text-white'
                  : 'border-gray-200 bg-white'
              } focus:outline-none focus:border-green-600 transition-colors`}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!newLink.trim() || !newTranslation.trim()}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-6 h-6" />
            Add to Chain
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProverbChain;