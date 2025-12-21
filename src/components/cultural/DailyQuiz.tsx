// src/components/cultural/DailyQuiz.tsx
// Daily Cultural Knowledge Quiz

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Flame,
  Award,
  Sparkles,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'history' | 'language' | 'culture' | 'geography' | 'tradition';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface DailyQuizProps {
  onComplete?: (score: number, heat: number) => void;
}

export const DailyQuiz: React.FC<DailyQuizProps> = ({ onComplete }) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [heat, setHeat] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  // Mock questions - replace with API
  const questions: QuizQuestion[] = [
    {
      id: '1',
      question: 'What does "Ubuntu" mean in African philosophy?',
      options: [
        'Strength in numbers',
        'I am because we are',
        'Unity is power',
        'Wisdom of the elders'
      ],
      correctAnswer: 1,
      explanation: 'Ubuntu is a Nguni Bantu term meaning "I am because we are" - emphasizing our interconnectedness and shared humanity.',
      category: 'culture',
      difficulty: 'medium',
      points: 10,
    },
    {
      id: '2',
      question: 'Which ancient African kingdom built the Great Walls of Benin?',
      options: [
        'Kingdom of Kush',
        'Mali Empire',
        'Kingdom of Benin',
        'Songhai Empire'
      ],
      correctAnswer: 2,
      explanation: 'The Kingdom of Benin in present-day Nigeria built walls that were four times longer than the Great Wall of China.',
      category: 'history',
      difficulty: 'hard',
      points: 15,
    },
    {
      id: '3',
      question: 'What is the traditional Yoruba greeting for "Good morning"?',
      options: [
        'Ẹ káàárọ̀',
        'Odabo',
        'Ẹ kú alẹ́',
        'Bawo ni'
      ],
      correctAnswer: 0,
      explanation: 'Ẹ káàárọ̀ is how you greet someone in the morning in Yoruba. The response is "Káàárọ̀".',
      category: 'language',
      difficulty: 'easy',
      points: 5,
    },
  ];

  const question = questions[currentQuestion];

  const getCategoryColor = (category: string) => {
    const colors = {
      history: 'from-amber-600 to-orange-600',
      language: 'from-green-600 to-emerald-600',
      culture: 'from-purple-600 to-pink-600',
      geography: 'from-blue-600 to-indigo-600',
      tradition: 'from-red-600 to-rose-600',
    };
    return colors[category as keyof typeof colors] || 'from-gray-600 to-gray-700';
  };

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const isCorrect = answerIndex === question.correctAnswer;
    
    if (isCorrect) {
      const bonusPoints = Math.max(0, timeLeft * 0.5); // Time bonus
      const streakBonus = streak * 2;
      const totalPoints = question.points + bonusPoints + streakBonus;
      
      setScore(score + totalPoints);
      setHeat(heat + totalPoints * 2);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      onComplete?.(score, heat);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    } pb-20`}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-90" />
        
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-32 h-32 border-4 border-white rounded-full"
          />
          <Sparkles className="absolute bottom-0 left-0 w-24 h-24 text-white" />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <h1 className="text-2xl sm:text-4xl font-bold text-white">
                  Daily Cultural Quiz
                </h1>
              </div>
              <p className="text-base sm:text-lg text-white/90 mb-6">
                Test your knowledge of African culture, history, and traditions
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-xs text-white/80">Score</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{Math.round(score)}</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span className="text-xs text-white/80">Heat</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{Math.round(heat)}</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-5 h-5 text-green-400" />
                    <span className="text-xs text-white/80">Streak</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{streak}</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-xs text-white/80">Time</span>
                  </div>
                  <p className={`text-2xl font-bold ${
                    timeLeft < 10 ? 'text-red-400' : 'text-white'
                  }`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className={`h-3 rounded-full overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
          }`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={`p-6 sm:p-8 rounded-2xl mb-6 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}
          >
            {/* Category & Difficulty */}
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r ${getCategoryColor(question.category)} text-white`}>
                {question.category.toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                question.difficulty === 'easy'
                  ? 'bg-green-500/20 text-green-500'
                  : question.difficulty === 'medium'
                  ? 'bg-amber-500/20 text-amber-500'
                  : 'bg-red-500/20 text-red-500'
              }`}>
                {question.difficulty.toUpperCase()}
              </span>
              <div className="flex items-center gap-1 ml-auto">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {question.points} pts
                </span>
              </div>
            </div>

            {/* Question */}
            <h2 className={`text-xl sm:text-2xl font-bold mb-8 leading-relaxed ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showResult = isAnswered;

                let bgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
                let borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-200';
                let textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

                if (showResult) {
                  if (isCorrect) {
                    bgColor = 'bg-green-500/20';
                    borderColor = 'border-green-500';
                    textColor = 'text-green-500';
                  } else if (isSelected) {
                    bgColor = 'bg-red-500/20';
                    borderColor = 'border-red-500';
                    textColor = 'text-red-500';
                  }
                } else if (isSelected) {
                  bgColor = 'bg-purple-600';
                  borderColor = 'border-purple-600';
                  textColor = 'text-white';
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                    whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                    onClick={() => handleAnswer(index)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-xl border-2 ${bgColor} ${borderColor} transition-all text-left font-semibold ${textColor} flex items-center justify-between disabled:cursor-not-allowed`}
                  >
                    <span>{option}</span>
                    {showResult && (
                      <span>
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : isSelected ? (
                          <XCircle className="w-6 h-6 text-red-500" />
                        ) : null}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`mt-6 p-4 rounded-xl ${
                  selectedAnswer === question.correctAnswer
                    ? 'bg-green-500/10 border-2 border-green-500'
                    : 'bg-red-500/10 border-2 border-red-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  {selectedAnswer === question.correctAnswer ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-bold mb-2 ${
                      selectedAnswer === question.correctAnswer ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect'}
                    </p>
                    <p className={`text-sm leading-relaxed ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Next Button */}
        {isAnswered && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                Next Question
                <ChevronRight className="w-6 h-6" />
              </>
            ) : (
              <>
                Complete Quiz
                <Trophy className="w-6 h-6" />
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default DailyQuiz;