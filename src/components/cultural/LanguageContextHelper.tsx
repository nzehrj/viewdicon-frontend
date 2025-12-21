// src/components/cultural/LanguageContextHelper.tsx
// Language Context Helper - Cultural & Linguistic Explanations

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Languages,
  Book,
  Lightbulb,
  Heart,
  Sparkles,
  Volume2,
  ChevronDown,
  ChevronUp,
  Share2,
  Bookmark
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface ContextEntry {
  word: string;
  language: string;
  pronunciation: string;
  literalTranslation: string;
  culturalMeaning: string;
  usage: string[];
  relatedTerms: string[];
  historicalContext?: string;
  audioUrl?: string;
}

interface LanguageContextHelperProps {
  word: string;
  language: string;
  onRequestMore?: (word: string) => void;
}

export const LanguageContextHelper: React.FC<LanguageContextHelperProps> = ({
  word,
  language,
  onRequestMore,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['meaning']));

  // Mock context data
  const context: ContextEntry = {
    word: word || 'Ubuntu',
    language: language || 'Nguni Bantu',
    pronunciation: 'oo-BOON-too',
    literalTranslation: 'I am because we are',
    culturalMeaning: 'Ubuntu is a profound African philosophy that emphasizes our interconnectedness as human beings. It recognizes that individual identity and wellbeing are inseparable from the community. When you have Ubuntu, you understand that your humanity is inextricably bound up with others.',
    usage: [
      'Used to describe compassionate, community-oriented behavior',
      'Invoked in conflict resolution and reconciliation',
      'Foundation of restorative justice practices in South Africa',
      'Used as a guiding principle in business and leadership'
    ],
    relatedTerms: ['Ujamaa (Swahili)', 'Harambee (Swahili)', 'Sankofa (Akan)'],
    historicalContext: 'Ubuntu gained international recognition through Archbishop Desmond Tutu during South Africa\'s Truth and Reconciliation Commission. However, the concept predates colonialism and has been central to many African societies for centuries.',
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const Section: React.FC<{
    id: string;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }> = ({ id, title, icon, children }) => {
    const isExpanded = expandedSections.has(id);

    return (
      <div className={`rounded-xl overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={() => toggleSection(id)}
          className={`w-full p-4 flex items-center justify-between ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
          } transition-colors`}
        >
          <div className="flex items-center gap-3">
            {icon}
            <span className={`font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className={`p-4 border-t ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    } pb-20`}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 opacity-90" />
        
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
              <div className="flex items-center gap-3 mb-6">
                <Languages className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <h1 className="text-2xl sm:text-4xl font-bold text-white">
                  Cultural Context
                </h1>
              </div>

              {/* Word Display */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                      {context.word}
                    </h2>
                    <p className="text-white/90 text-lg mb-1">
                      /{context.pronunciation}/
                    </p>
                    <p className="text-white/80 text-sm">
                      {context.language}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                      <Volume2 className="w-6 h-6 text-white" />
                    </button>
                    <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                      <Bookmark className="w-6 h-6 text-white" />
                    </button>
                    <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                      <Share2 className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/80 text-sm mb-1">Literal Translation</p>
                  <p className="text-white text-xl font-semibold">
                    "{context.literalTranslation}"
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-4">
        {/* Cultural Meaning */}
        <Section
          id="meaning"
          title="Cultural Meaning"
          icon={<Heart className="w-5 h-5 text-red-500" />}
        >
          <p className={`text-sm sm:text-base leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {context.culturalMeaning}
          </p>
        </Section>

        {/* Usage Examples */}
        <Section
          id="usage"
          title="How It's Used"
          icon={<Book className="w-5 h-5 text-blue-500" />}
        >
          <ul className="space-y-3">
            {context.usage.map((use, index) => (
              <li
                key={index}
                className={`flex items-start gap-3 text-sm sm:text-base ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{use}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Historical Context */}
        {context.historicalContext && (
          <Section
            id="history"
            title="Historical Context"
            icon={<Lightbulb className="w-5 h-5 text-amber-500" />}
          >
            <p className={`text-sm sm:text-base leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {context.historicalContext}
            </p>
          </Section>
        )}

        {/* Related Terms */}
        <Section
          id="related"
          title="Related Concepts"
          icon={<Sparkles className="w-5 h-5 text-purple-500" />}
        >
          <div className="space-y-3">
            {context.relatedTerms.map((term) => (
              <button
                key={term}
                onClick={() => onRequestMore?.(term)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <p className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {term}
                </p>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Tap to explore this concept
                </p>
              </button>
            ))}
          </div>
        </Section>

        {/* Did You Know */}
        <div className={`p-6 rounded-2xl ${
          theme === 'dark' ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50' : 'bg-gradient-to-r from-purple-100 to-pink-100'
        } border-2 border-purple-500`}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-600 rounded-xl">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Did You Know?
              </h3>
              <p className={`text-sm leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                The concept of Ubuntu was famously summarized by Archbishop Desmond Tutu: 
                "A person with Ubuntu is open and available to others, affirming of others, 
                does not feel threatened that others are able and good, for he or she has a 
                proper self-assurance that comes from knowing that he or she belongs in a 
                greater whole."
              </p>
            </div>
          </div>
        </div>

        {/* Learn More Button */}
        <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
          <Book className="w-6 h-6" />
          Explore More African Philosophy
        </button>
      </div>
    </div>
  );
};

export default LanguageContextHelper;