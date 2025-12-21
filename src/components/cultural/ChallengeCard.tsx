// src/components/cultural/ChallengeCard.tsx
// Individual Challenge Detail Card

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Users, 
  Share2,
  Flag,
  Heart,
  MessageCircle,
  Award,
  Calendar,
  Target,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface ChallengeCardProps {
  challengeId: string;
  onSubmit?: () => void;
  onViewSubmissions?: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challengeId,
  onSubmit,
  onViewSubmissions,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [isLiked, setIsLiked] = useState(false);

  // Mock data - replace with API
  const challenge = {
    id: challengeId,
    title: 'Adire Pattern Design Challenge',
    description: 'Create a modern twist on traditional Yoruba Adire fabric patterns. Show us how you blend ancestral techniques with contemporary design.',
    longDescription: 'Adire is a traditional Yoruba textile art that dates back centuries. This challenge invites you to explore the rich heritage of tie-dye patterns while bringing your unique creative vision. Submit your original designs that honor tradition while pushing boundaries.',
    category: 'art',
    difficulty: 'intermediate',
    heat: 1250,
    participants: 47,
    submissions: 32,
    deadline: '2025-01-15',
    prize: 50000,
    rules: [
      'Must be original work created for this challenge',
      'Traditional Adire techniques must be clearly incorporated',
      'Digital or physical medium accepted',
      'Include explanation of your design choices',
      'Respect cultural significance'
    ],
    criteria: [
      { name: 'Creativity', weight: 30 },
      { name: 'Technical Skill', weight: 25 },
      { name: 'Cultural Authenticity', weight: 25 },
      { name: 'Innovation', weight: 20 },
    ],
    creator: {
      name: 'Amara Okafor',
      avatar: '',
      title: 'Master Textile Artist',
    },
    topSubmissions: [
      {
        id: '1',
        userId: 'user1',
        userName: 'Chioma Eze',
        content: 'Modern Adire fusion with geometric patterns',
        heat: 234,
        comments: 18,
        submittedAt: '2025-01-05',
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Tunde Williams',
        content: 'Digital interpretation of traditional indigo dye',
        heat: 189,
        comments: 12,
        submittedAt: '2025-01-06',
      },
    ],
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Ended';
    if (days === 0) return 'Ending today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    } pb-20`}>
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 opacity-90" />
        
        {/* Animated Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-64 h-64 border-4 border-white rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-48 h-48 border-4 border-white rounded-full"
          />
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 text-white" />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                {challenge.category.toUpperCase()} • {challenge.difficulty.toUpperCase()}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {challenge.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/90 mb-6"
            >
              {challenge.description}
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">{challenge.prize.toLocaleString()}</span>
                </div>
                <span className="text-sm text-white/80">Prize (₵)</span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-green-400" />
                  <span className="text-2xl font-bold text-white">{challenge.participants}</span>
                </div>
                <span className="text-sm text-white/80">Participants</span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-2xl font-bold text-white">{challenge.heat}</span>
                </div>
                <span className="text-sm text-white/80">Heat</span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-red-400" />
                  <span className={`text-2xl font-bold ${
                    formatDeadline(challenge.deadline) === 'Ending today' ? 'text-red-400' : 'text-white'
                  }`}>
                    {formatDeadline(challenge.deadline).split(' ')[0]}
                  </span>
                </div>
                <span className="text-sm text-white/80">
                  {formatDeadline(challenge.deadline).split(' ').slice(1).join(' ')}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSubmit}
                className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
              >
                <Target className="w-6 h-6" />
                Submit Your Entry
              </motion.button>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-4 rounded-xl ${
                    isLiked 
                      ? 'bg-red-500 text-white' 
                      : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
                  } hover:scale-105 transition-transform`}
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                </button>

                <button
                  className={`p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
                  } hover:scale-105 transition-transform`}
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* About Challenge */}
            <div className={`p-6 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <Sparkles className="w-6 h-6 text-amber-500" />
                About This Challenge
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {challenge.longDescription}
              </p>
            </div>

            {/* Rules */}
            <div className={`p-6 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <Flag className="w-6 h-6 text-green-500" />
                Rules & Guidelines
              </h2>
              <ul className="space-y-3">
                {challenge.rules.map((rule, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start gap-3 text-sm sm:text-base ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Judging Criteria */}
            <div className={`p-6 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <Award className="w-6 h-6 text-purple-500" />
                Judging Criteria
              </h2>
              <div className="space-y-4">
                {challenge.criteria.map((criterion, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className={`font-semibold ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {criterion.name}
                      </span>
                      <span className="text-amber-500 font-bold">{criterion.weight}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${criterion.weight}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Submissions Preview */}
            {challenge.topSubmissions.length > 0 && (
              <div className={`p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-bold flex items-center gap-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Top Submissions
                  </h2>
                  <button
                    onClick={onViewSubmissions}
                    className="text-amber-600 hover:text-amber-700 font-semibold text-sm flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {challenge.topSubmissions.map((submission, index) => (
                    <div
                      key={submission.id}
                      className={`p-4 rounded-xl ${
                        theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                      } hover:scale-[1.02] transition-transform cursor-pointer`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            'bg-amber-600 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className={`font-semibold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {submission.userName}
                            </p>
                            <p className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {submission.content}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                              {submission.heat}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4 text-blue-500" />
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                              {submission.comments}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Creator Info */}
          <div className="space-y-6">
            {/* Creator Card */}
            <div className={`p-6 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} sticky top-6`}>
              <h3 className={`text-sm font-semibold mb-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                CHALLENGE CREATOR
              </h3>
              
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {challenge.creator.name.charAt(0)}
                  </span>
                </div>
                <h4 className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {challenge.creator.name}
                </h4>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {challenge.creator.title}
                </p>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all">
                Follow Creator
              </button>
            </div>

            {/* Quick Stats */}
            <div className={`p-6 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-sm font-semibold mb-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                QUICK STATS
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Submissions
                  </span>
                  <span className={`font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {challenge.submissions}/{challenge.participants}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Deadline
                  </span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span className={`font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {new Date(challenge.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;