// src/components/cultural/ChallengeJudging.tsx
// Challenge Judging Interface (For Judges/Moderators)

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Star,
  ThumbsUp,
  MessageSquare,
  Flag,
  Eye,
  CheckCircle,
  XCircle,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface Submission {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'text';
  submittedAt: string;
  currentScore?: number;
  tags: string[];
}

interface JudgingCriteria {
  name: string;
  weight: number;
  description: string;
}

interface ChallengeJudgingProps {
  challengeId: string;
  challengeTitle: string;
  criteria: JudgingCriteria[];
  onSubmitJudgment?: (submissionId: string, scores: Record<string, number>, feedback: string) => void;
}

export const ChallengeJudging: React.FC<ChallengeJudgingProps> = ({
  challengeId: _challengeId,
  challengeTitle,
  criteria,
  onSubmitJudgment,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  // Mock submissions - replace with API
  const submissions: Submission[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Chioma Eze',
      title: 'Modern Adire Fusion',
      description: 'A contemporary take on traditional Yoruba Adire patterns, blending indigo dye techniques with geometric modern design. This piece honors my grandmother\'s textile work while pushing creative boundaries.',
      mediaUrl: '',
      mediaType: 'image',
      submittedAt: '2025-01-05',
      tags: ['traditional', 'modern', 'indigo', 'geometric'],
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Tunde Williams',
      title: 'Digital Adire Interpretation',
      description: 'Using digital tools to reimagine classic tie-dye patterns. Each element represents a different aspect of Yoruba culture and heritage.',
      mediaUrl: '',
      mediaType: 'image',
      submittedAt: '2025-01-06',
      tags: ['digital', 'cultural', 'innovative'],
    },
  ];

  const currentSubmission = submissions[currentIndex];

  const handleScoreChange = (criterionName: string, score: number) => {
    setScores({
      ...scores,
      [criterionName]: score,
    });
  };

  const calculateTotalScore = () => {
    let total = 0;
    criteria.forEach((criterion) => {
      const score = scores[criterion.name] || 0;
      total += (score / 5) * criterion.weight;
    });
    return Math.round(total);
  };

  const handleSubmit = () => {
    if (!currentSubmission) return;
    
    onSubmitJudgment?.(currentSubmission.id, scores, feedback);
    
    // Move to next submission
    if (currentIndex < submissions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setScores({});
      setFeedback('');
      setShowFeedback(false);
    }
  };

  const handleSkip = () => {
    if (currentIndex < submissions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setScores({});
      setFeedback('');
      setShowFeedback(false);
    }
  };

  const allScoresProvided = criteria.every(c => scores[c.name] !== undefined);

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    } pb-20`}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-amber-600 opacity-90" />
        
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-32 h-32 border-4 border-white rounded-full"
          />
          <Sparkles className="absolute bottom-0 left-0 w-24 h-24 text-white" />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-8 h-8 text-yellow-400" />
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  Judge Submissions
                </h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                {challengeTitle}
              </p>
              <div className="flex items-center gap-4 text-white/80">
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {submissions.length} Submissions
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {currentIndex + 1} / {submissions.length}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 sm:p-8">
        {currentSubmission && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Submission */}
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                {/* Submission Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {currentSubmission.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                        {currentSubmission.userName.charAt(0)}
                      </div>
                      <div>
                        <p className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {currentSubmission.userName}
                        </p>
                        <p className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Submitted {new Date(currentSubmission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media Display */}
                <div className={`h-64 rounded-xl mb-4 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                } flex items-center justify-center`}>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {currentSubmission.mediaType.toUpperCase()} Preview
                  </p>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h3 className={`text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    DESCRIPTION
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {currentSubmission.description}
                  </p>
                </div>

                {/* Tags */}
                {currentSubmission.tags.length > 0 && (
                  <div>
                    <h3 className={`text-sm font-semibold mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      TAGS
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentSubmission.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            theme === 'dark' ? 'bg-amber-600/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Scoring */}
            <div className="space-y-6">
              {/* Criteria Scoring */}
              <div className={`p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <Star className="w-6 h-6 text-amber-500" />
                  Score Criteria
                </h3>

                <div className="space-y-6">
                  {criteria.map((criterion) => (
                    <div key={criterion.name}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h4 className={`font-semibold mb-1 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {criterion.name}
                          </h4>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {criterion.description} • Weight: {criterion.weight}%
                          </p>
                        </div>
                        <span className={`text-2xl font-bold ${
                          scores[criterion.name] 
                            ? 'text-amber-500' 
                            : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {scores[criterion.name] || '-'}/5
                        </span>
                      </div>

                      {/* Star Rating */}
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleScoreChange(criterion.name, star)}
                            className="flex-1"
                          >
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`h-12 rounded-lg flex items-center justify-center font-bold transition-all ${
                                scores[criterion.name] >= star
                                  ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg'
                                  : theme === 'dark'
                                  ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {star}
                            </motion.div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Score */}
                <div className={`mt-6 p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50' : 'bg-gradient-to-br from-purple-100 to-pink-100'
                } border-2 border-purple-500`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                      <span className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Total Score
                      </span>
                    </div>
                    <span className="text-3xl font-bold text-purple-600">
                      {calculateTotalScore()}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className={`p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  onClick={() => setShowFeedback(!showFeedback)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <h3 className={`text-lg font-bold flex items-center gap-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    Feedback (Optional)
                  </h3>
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {showFeedback ? 'Hide' : 'Show'}
                  </span>
                </button>

                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share constructive feedback for the creator..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        theme === 'dark'
                          ? 'border-gray-700 bg-gray-700 text-white'
                          : 'border-gray-200 bg-white'
                      } focus:outline-none focus:border-blue-500 transition-colors`}
                    />
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  <XCircle className="w-5 h-5" />
                  Skip
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={!allScoresProvided}
                  className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5" />
                  Submit Judgment
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button
                  className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  } transition-colors`}
                >
                  <Flag className="w-4 h-4" />
                  Flag
                </button>
                
                <button
                  className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  } transition-colors`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Recommend
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeJudging;