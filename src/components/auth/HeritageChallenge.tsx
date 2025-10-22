import React, { useState } from 'react';
import { Award, ArrowRight, ArrowLeft, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientBackground } from '../common/GradientBackground';
import { Button } from '../common/Button';
import { useAppSelector } from '../../store/hooks';

interface HeritageChallengeProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Which ancient African kingdom was known for its wealth in gold and the legendary pilgrimage of Mansa Musa?",
    options: ["Kingdom of Kush", "Mali Empire", "Kingdom of Axum", "Songhai Empire"],
    correctAnswer: 1,
    explanation: "The Mali Empire, under Mansa Musa's rule, was renowned for its immense wealth in gold. His pilgrimage to Mecca in 1324 showcased this wealth to the world."
  },
  {
    id: 2,
    question: "What is the meaning of 'Ubuntu', the African philosophy?",
    options: [
      "Strength in numbers",
      "I am because we are",
      "Knowledge is power",
      "Unity through diversity"
    ],
    correctAnswer: 1,
    explanation: "Ubuntu means 'I am because we are' - emphasizing our interconnectedness and shared humanity. It's a core African philosophical concept."
  },
  {
    id: 3,
    question: "The Great Zimbabwe was a medieval city in Southeast Africa. What does 'Zimbabwe' mean?",
    options: [
      "Land of gold",
      "Great house of stone",
      "River of life",
      "Mountain fortress"
    ],
    correctAnswer: 1,
    explanation: "Zimbabwe comes from 'dzimba-dze-mabwe' meaning 'great house of stone' in Shona, referring to the impressive stone structures built there."
  },
  {
    id: 4,
    question: "Which African language is the most widely spoken native language on the continent?",
    options: ["Yoruba", "Amharic", "Swahili", "Hausa"],
    correctAnswer: 2,
    explanation: "Swahili is the most widely spoken native language in Africa, with over 200 million speakers across East and Central Africa."
  },
  {
    id: 5,
    question: "The ancient city of Timbuktu was a center of what?",
    options: [
      "Trade and Islamic scholarship",
      "Military conquest",
      "Agricultural innovation",
      "Maritime exploration"
    ],
    correctAnswer: 0,
    explanation: "Timbuktu was a renowned center of Islamic learning and trans-Saharan trade, housing thousands of manuscripts and attracting scholars from across the world."
  },
  {
    id: 6,
    question: "What does the Adinkra symbol 'Sankofa' represent?",
    options: [
      "Strength and courage",
      "Return and learn from the past",
      "Unity in diversity",
      "Wisdom of the elders"
    ],
    correctAnswer: 1,
    explanation: "Sankofa (often depicted as a bird looking backward) means 'go back and fetch it' - teaching us to learn from our past to build a better future."
  },
  {
    id: 7,
    question: "Which African country was never colonized by European powers?",
    options: ["Liberia", "Ethiopia", "Both Liberia and Ethiopia", "Somalia"],
    correctAnswer: 2,
    explanation: "Both Ethiopia and Liberia maintained their independence throughout the colonial period, though their paths were different."
  },
  {
    id: 8,
    question: "The Griots of West Africa are known for being:",
    options: [
      "Warriors and soldiers",
      "Oral historians and storytellers",
      "Religious priests",
      "Farmers and herders"
    ],
    correctAnswer: 1,
    explanation: "Griots are traditional storytellers, musicians, and oral historians who preserve and pass down the history, genealogies, and traditions of their communities."
  },
  {
    id: 9,
    question: "Kwanzaa, celebrated by African diaspora, is based on which African harvest festivals?",
    options: [
      "East African festivals",
      "West African festivals",
      "Southern African festivals",
      "North African festivals"
    ],
    correctAnswer: 1,
    explanation: "Kwanzaa, created in 1966, draws from West African harvest festivals, particularly those of the Zulu and Ashanti peoples."
  },
  {
    id: 10,
    question: "What is the significance of the Baobab tree in African culture?",
    options: [
      "It's only used for food",
      "It's the 'Tree of Life' - central to community gatherings, medicine, and spirituality",
      "It marks burial grounds",
      "It's considered bad luck"
    ],
    correctAnswer: 1,
    explanation: "The Baobab is called the 'Tree of Life' because it provides food, water, shelter, and medicine. It's a central gathering place and holds deep spiritual significance in many African cultures."
  }
];

export const HeritageChallenge: React.FC<HeritageChallengeProps> = ({ onComplete, onSkip }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return; // Prevent changing answer after submission
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setChallengeComplete(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  if (challengeComplete) {
    const passed = score >= 7; // Need 70% to pass
    const percentage = (score / questions.length) * 100;

    return (
      <GradientBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`max-w-2xl w-full p-12 rounded-3xl text-center ${
              theme === 'dark' ? 'bg-gray-800/30 backdrop-blur-sm' : 'bg-white shadow-xl'
            }`}
          >
            <motion.div
              animate={{ rotate: passed ? 0 : [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                passed
                  ? 'bg-gradient-to-br from-green-500 to-green-600'
                  : 'bg-gradient-to-br from-amber-500 to-amber-600'
              }`}
            >
              {passed ? (
                <Check className="w-12 h-12 text-white" />
              ) : (
                <Award className="w-12 h-12 text-white" />
              )}
            </motion.div>

            <h2 className={`text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {passed ? 'Challenge Passed!' : 'Good Effort!'}
            </h2>

            <p className={`text-2xl font-semibold mb-2 ${
              passed ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
            }`}>
              {score} / {questions.length} Correct
            </p>

            <p className={`text-xl mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {percentage.toFixed(0)}% Score
            </p>

            {passed ? (
              <div className={`p-6 rounded-xl mb-8 ${
                theme === 'dark' ? 'bg-green-900/20 border-2 border-green-500/30' : 'bg-green-50 border-2 border-green-200'
              }`}>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-green-300' : 'text-green-700'
                }`}>
                  Your knowledge of African heritage has been verified! <br />
                  You have proven your connection to the motherland. 🌍
                </p>
              </div>
            ) : (
              <div className={`p-6 rounded-xl mb-8 ${
                theme === 'dark' ? 'bg-amber-900/20 border-2 border-amber-500/30' : 'bg-amber-50 border-2 border-amber-200'
              }`}>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-amber-300' : 'text-amber-700'
                }`}>
                  You can retake the challenge later from your dashboard. <br />
                  Keep learning about your heritage! 📚
                </p>
              </div>
            )}

            <Button onClick={onComplete} className="w-full" size="lg">
              Continue to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-3xl ${
              theme === 'dark' ? 'bg-gray-800/30 backdrop-blur-sm' : 'bg-white shadow-xl'
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Heritage Challenge
                </h2>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Score
                </p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                }`}>
                  {score} / {answeredQuestions.length}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className={`h-2 rounded-full mb-8 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`p-6 rounded-xl mb-6 ${
                  theme === 'dark' ? 'bg-amber-900/20 border-2 border-amber-500/30' : 'bg-amber-50 border-2 border-amber-200'
                }`}>
                  <p className={`text-lg font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {question.question}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === question.correctAnswer;
                    const showCorrect = showExplanation && isCorrect;
                    const showWrong = showExplanation && isSelected && !isCorrect;

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showExplanation}
                        whileHover={!showExplanation ? { scale: 1.02 } : {}}
                        whileTap={!showExplanation ? { scale: 0.98 } : {}}
                        className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                          showCorrect
                            ? 'border-green-500 bg-green-500/10'
                            : showWrong
                            ? 'border-red-500 bg-red-500/10'
                            : isSelected
                            ? 'border-amber-500 bg-amber-500/10'
                            : theme === 'dark'
                            ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${
                            showCorrect
                              ? 'text-green-600 dark:text-green-400'
                              : showWrong
                              ? 'text-red-600 dark:text-red-400'
                              : theme === 'dark'
                              ? 'text-white'
                              : 'text-gray-900'
                          }`}>
                            {option}
                          </span>
                          {showCorrect && (
                            <Check className="w-6 h-6 text-green-500" />
                          )}
                          {showWrong && (
                            <X className="w-6 h-6 text-red-500" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl mb-6 ${
                      theme === 'dark' ? 'bg-blue-900/20 border-2 border-blue-500/30' : 'bg-blue-50 border-2 border-blue-200'
                    }`}
                  >
                    <p className={`text-sm font-semibold mb-2 ${
                      theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                    }`}>
                      Explanation:
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-blue-200' : 'text-blue-600'
                    }`}>
                      {question.explanation}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3">
              {currentQuestion > 0 && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  disabled={showExplanation}
                  className="flex-1"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
              )}

              <Button
                onClick={onSkip}
                variant="outline"
                className="flex-1"
              >
                Skip Challenge
              </Button>

              {!showExplanation ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="flex-1"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex-1"
                >
                  {isLastQuestion ? 'See Results' : 'Next Question'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </GradientBackground>
  );
};