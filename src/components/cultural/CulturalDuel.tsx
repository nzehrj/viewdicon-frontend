// src/components/cultural/CulturalDuel.tsx
// Cultural Duel - 1v1 Knowledge Battle

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Swords,
  Trophy,
  Flame,
  Clock,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface Player {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  streak: number;
  answersCorrect: number;
  answersTotal: number;
}

interface DuelQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  timeLimit: number;
}

interface CulturalDuelProps {
  opponentId: string;
  opponentName: string;
  onComplete?: (won: boolean, score: number) => void;
}

export const CulturalDuel: React.FC<CulturalDuelProps> = ({
  opponentId: _opponentId,
  opponentName,
  onComplete,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  const [player, setPlayer] = useState<Player>({
    id: 'me',
    name: 'You',
    score: 0,
    streak: 0,
    answersCorrect: 0,
    answersTotal: 0,
  });

  const [opponent, setOpponent] = useState<Player>({
    id: 'opponent',
    name: opponentName,
    score: 0,
    streak: 0,
    answersCorrect: 0,
    answersTotal: 0,
  });

  // Mock questions
  const questions: DuelQuestion[] = [
    {
      id: '1',
      question: 'Which African country was never colonized?',
      options: ['Kenya', 'Ethiopia', 'Ghana', 'Senegal'],
      correctAnswer: 1,
      category: 'History',
      timeLimit: 15,
    },
    {
      id: '2',
      question: 'What does "Jambo" mean in Swahili?',
      options: ['Goodbye', 'Hello', 'Thank you', 'Please'],
      correctAnswer: 1,
      category: 'Language',
      timeLimit: 15,
    },
    {
      id: '3',
      question: 'Which fabric is traditionally hand-woven in Ghana?',
      options: ['Ankara', 'Kente', 'Dashiki', 'Adire'],
      correctAnswer: 1,
      category: 'Culture',
      timeLimit: 15,
    },
  ];

  const question = questions[currentQuestion];

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const isCorrect = answerIndex === question.correctAnswer;
    const timeBonus = timeLeft * 10;
    const streakBonus = player.streak * 50;
    
    if (isCorrect) {
      const points = 100 + timeBonus + streakBonus;
      setPlayer({
        ...player,
        score: player.score + points,
        streak: player.streak + 1,
        answersCorrect: player.answersCorrect + 1,
        answersTotal: player.answersTotal + 1,
      });
    } else {
      setPlayer({
        ...player,
        streak: 0,
        answersTotal: player.answersTotal + 1,
      });
    }

    // Simulate opponent answer (AI)
    setTimeout(() => {
      const opponentCorrect = Math.random() > 0.4; // 60% correct rate
      const opponentTime = Math.floor(Math.random() * 10) + 5;
      const opponentTimeBonus = opponentTime * 10;
      const opponentStreakBonus = opponent.streak * 50;

      if (opponentCorrect) {
        const opponentPoints = 100 + opponentTimeBonus + opponentStreakBonus;
        setOpponent({
          ...opponent,
          score: opponent.score + opponentPoints,
          streak: opponent.streak + 1,
          answersCorrect: opponent.answersCorrect + 1,
          answersTotal: opponent.answersTotal + 1,
        });
      } else {
        setOpponent({
          ...opponent,
          streak: 0,
          answersTotal: opponent.answersTotal + 1,
        });
      }
    }, 1000);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      const won = player.score > opponent.score;
      onComplete?.(won, player.score);
    }
  };

  const playerWinning = player.score > opponent.score;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    } pb-20`}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-orange-600 to-amber-600 opacity-90" />
        
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
              <div className="flex items-center justify-center gap-3 mb-6">
                <Swords className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <h1 className="text-2xl sm:text-4xl font-bold text-white">
                  Cultural Duel
                </h1>
              </div>

              {/* Player vs Opponent */}
              <div className="grid grid-cols-3 gap-4 items-center mb-6">
                {/* Player */}
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-xl">
                    Y
                  </div>
                  <p className="text-white font-bold text-lg">{player.name}</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-2xl font-bold text-white">{player.score}</span>
                  </div>
                  {player.streak > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-white">{player.streak}x</span>
                    </div>
                  )}
                </div>

                {/* VS */}
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl font-bold text-white"
                  >
                    VS
                  </motion.div>
                </div>

                {/* Opponent */}
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 rounded-full bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-xl">
                    {opponent.name.charAt(0)}
                  </div>
                  <p className="text-white font-bold text-lg">{opponent.name}</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-2xl font-bold text-white">{opponent.score}</span>
                  </div>
                  {opponent.streak > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-white">{opponent.streak}x</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress & Time */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white font-semibold">
                    Round {currentQuestion + 1}/{questions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white" />
                    <span className={`text-lg font-bold ${
                      timeLeft < 5 ? 'text-red-400' : 'text-white'
                    }`}>
                      {timeLeft}s
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-white"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`p-6 sm:p-8 rounded-2xl mb-6 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } border-2 ${
              playerWinning 
                ? 'border-blue-600' 
                : player.score === opponent.score
                ? 'border-gray-600'
                : 'border-red-600'
            } shadow-xl`}
          >
            {/* Category */}
            <div className="flex items-center justify-between mb-6">
              <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 text-white">
                {question.category}
              </span>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                <span className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  100 pts + bonuses
                </span>
              </div>
            </div>

            {/* Question Text */}
            <h2 className={`text-xl sm:text-2xl font-bold mb-8 leading-relaxed ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {question.question}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showResult = isAnswered;

                let className = `p-4 rounded-xl border-2 font-semibold transition-all cursor-pointer `;
                
                if (showResult) {
                  if (isCorrect) {
                    className += 'bg-green-500/20 border-green-500 text-green-500';
                  } else if (isSelected) {
                    className += 'bg-red-500/20 border-red-500 text-red-500';
                  } else {
                    className += theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-gray-400'
                      : 'bg-gray-100 border-gray-200 text-gray-500';
                  }
                } else if (isSelected) {
                  className += 'bg-blue-600 border-blue-600 text-white';
                } else {
                  className += theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white hover:border-blue-600'
                    : 'bg-gray-100 border-gray-200 text-gray-900 hover:border-blue-600';
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                    whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                    onClick={() => handleAnswer(index)}
                    disabled={isAnswered}
                    className={className}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next Button */}
        {isAnswered && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                Next Round
                <Zap className="w-6 h-6" />
              </>
            ) : (
              <>
                See Results
                <Trophy className="w-6 h-6" />
              </>
            )}
          </motion.button>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className={`p-4 rounded-xl ${
            theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-100'
          }`}>
            <p className={`text-sm mb-2 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
            }`}>
              Your Accuracy
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {player.answersTotal > 0 
                ? Math.round((player.answersCorrect / player.answersTotal) * 100)
                : 0}%
            </p>
          </div>

          <div className={`p-4 rounded-xl ${
            theme === 'dark' ? 'bg-red-600/20' : 'bg-red-100'
          }`}>
            <p className={`text-sm mb-2 ${
              theme === 'dark' ? 'text-red-400' : 'text-red-700'
            }`}>
              Opponent Accuracy
            </p>
            <p className="text-2xl font-bold text-red-600">
              {opponent.answersTotal > 0 
                ? Math.round((opponent.answersCorrect / opponent.answersTotal) * 100)
                : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalDuel;