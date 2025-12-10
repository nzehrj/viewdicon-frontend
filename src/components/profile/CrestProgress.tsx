import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award,
  TrendingUp,
  CheckCircle,
  Circle,
  Lock,
  Star,
  Trophy,
  Target,
  ChevronRight,
  Info,
  Gift,
  Zap,
  Shield,
  Crown
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface CrestProgressProps {
  showHistory?: boolean;
}

interface CrestTier {
  level: number;
  name: string;
  color: string;
  icon: React.ElementType;
  minScore: number;
  maxScore: number;
  benefits: string[];
  requirements: {
    id: string;
    label: string;
    current: number;
    required: number;
    completed: boolean;
  }[];
}

/**
 * CREST PROGRESS COMPONENT
 * 
 * Track verification tier advancement (Crest 0-10)
 * Shows current level, progress, requirements, and benefits
 * Mobile-first design with full width layout
 * 
 * Location: src/components/profile/CrestProgress.tsx
 */
export const CrestProgress: React.FC<CrestProgressProps> = ({
  showHistory = false,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const rank = useAppSelector((state) => state.user.rank);
  const user = useAppSelector((state) => state.user.user);

  const [showAllBenefits, setShowAllBenefits] = useState(false);
  const [activeTab, setActiveTab] = useState<'progress' | 'benefits' | 'history'>('progress');

  // Current crest level
  const currentCrest = rank?.level || user?.iwa_score || 0;
  const currentScore = 0; // TODO: Connect to actual score system

  // Crest tier definitions
  const crestTiers: CrestTier[] = [
    {
      level: 0,
      name: 'Newcomer',
      color: '#9ca3af',
      icon: Circle,
      minScore: 0,
      maxScore: 99,
      benefits: ['Basic profile access', 'Join villages', 'View public content'],
      requirements: [
        { id: 'profile', label: 'Complete profile', current: 0, required: 1, completed: false },
        { id: 'village', label: 'Join a village', current: 0, required: 1, completed: false },
      ]
    },
    {
      level: 1,
      name: 'Explorer',
      color: '#78716c',
      icon: Star,
      minScore: 100,
      maxScore: 249,
      benefits: ['Send connection requests', 'Post content', 'Join 1 circle'],
      requirements: [
        { id: 'connections', label: 'Make 5 connections', current: 0, required: 5, completed: false },
        { id: 'posts', label: 'Create 3 posts', current: 0, required: 3, completed: false },
        { id: 'active', label: 'Active for 7 days', current: 0, required: 7, completed: false },
      ]
    },
    {
      level: 2,
      name: 'Builder',
      color: '#a16207',
      icon: Target,
      minScore: 250,
      maxScore: 499,
      benefits: ['Create circles', 'Host events', 'Lower transaction fees (8%)'],
      requirements: [
        { id: 'connections', label: 'Have 15 connections', current: 0, required: 15, completed: false },
        { id: 'engagement', label: '50 post interactions', current: 0, required: 50, completed: false },
        { id: 'sessions', label: 'Complete 2 business sessions', current: 0, required: 2, completed: false },
      ]
    },
    {
      level: 3,
      name: 'Connector',
      color: '#c2410c',
      icon: Zap,
      minScore: 500,
      maxScore: 999,
      benefits: ['Priority support', 'Featured listings', 'Transaction fees (6%)'],
      requirements: [
        { id: 'connections', label: 'Have 30 connections', current: 0, required: 30, completed: false },
        { id: 'rating', label: 'Maintain 4.5+ rating', current: 0, required: 4.5, completed: false },
        { id: 'sessions', label: 'Complete 5 sessions', current: 0, required: 5, completed: false },
      ]
    },
    {
      level: 4,
      name: 'Contributor',
      color: '#ea580c',
      icon: Award,
      minScore: 1000,
      maxScore: 1999,
      benefits: ['Verified badge', 'API access', 'Transaction fees (4%)'],
      requirements: [
        { id: 'connections', label: 'Have 50 connections', current: 0, required: 50, completed: false },
        { id: 'value', label: '₦100k in transactions', current: 0, required: 100000, completed: false },
        { id: 'mentoring', label: 'Mentor 2 members', current: 0, required: 2, completed: false },
      ]
    },
    {
      level: 5,
      name: 'Leader',
      color: '#f59e0b',
      icon: Trophy,
      minScore: 2000,
      maxScore: 3999,
      benefits: ['Premium badge', 'Event hosting', 'Transaction fees (2%)'],
      requirements: [
        { id: 'connections', label: 'Have 100 connections', current: 0, required: 100, completed: false },
        { id: 'impact', label: 'Help 10 members succeed', current: 0, required: 10, completed: false },
        { id: 'value', label: '₦500k in transactions', current: 0, required: 500000, completed: false },
      ]
    },
    {
      level: 6,
      name: 'Expert',
      color: '#eab308',
      icon: Shield,
      minScore: 4000,
      maxScore: 7999,
      benefits: ['Gold badge', 'Moderator access', 'No transaction fees'],
      requirements: [
        { id: 'connections', label: 'Have 200 connections', current: 0, required: 200, completed: false },
        { id: 'excellence', label: 'Maintain 4.8+ rating', current: 0, required: 4.8, completed: false },
        { id: 'leadership', label: 'Lead a circle', current: 0, required: 1, completed: false },
      ]
    },
    {
      level: 7,
      name: 'Master',
      color: '#84cc16',
      icon: Crown,
      minScore: 8000,
      maxScore: 15999,
      benefits: ['Platinum badge', 'Governance voting', 'Revenue sharing'],
      requirements: [
        { id: 'influence', label: '500+ connections', current: 0, required: 500, completed: false },
        { id: 'mastery', label: '5.0 rating', current: 0, required: 5.0, completed: false },
        { id: 'value', label: '₦2M in transactions', current: 0, required: 2000000, completed: false },
      ]
    },
    {
      level: 8,
      name: 'Elder',
      color: '#22c55e',
      icon: Shield,
      minScore: 16000,
      maxScore: 31999,
      benefits: ['Diamond badge', 'Platform advisory', 'Special perks'],
      requirements: [
        { id: 'legacy', label: '1000+ connections', current: 0, required: 1000, completed: false },
        { id: 'wisdom', label: 'Mentor 50 members', current: 0, required: 50, completed: false },
        { id: 'trust', label: 'No disputes in 6 months', current: 0, required: 1, completed: false },
      ]
    },
    {
      level: 9,
      name: 'Legend',
      color: '#10b981',
      icon: Trophy,
      minScore: 32000,
      maxScore: 63999,
      benefits: ['Legendary badge', 'Lifetime benefits', 'Hall of Fame'],
      requirements: [
        { id: 'impact', label: 'Transform 100+ lives', current: 0, required: 100, completed: false },
        { id: 'excellence', label: 'Sustained excellence', current: 0, required: 1, completed: false },
        { id: 'recognition', label: 'Community nomination', current: 0, required: 1, completed: false },
      ]
    },
    {
      level: 10,
      name: 'Ancestor',
      color: '#059669',
      icon: Crown,
      minScore: 64000,
      maxScore: 999999,
      benefits: ['Immortal legacy', 'Platform ownership', 'Shape the future'],
      requirements: [
        { id: 'legendary', label: 'Legendary achievements', current: 0, required: 1, completed: false },
        { id: 'appointed', label: 'Community consensus', current: 0, required: 1, completed: false },
      ]
    },
  ];

  const currentTier = crestTiers.find(tier => tier.level === currentCrest) || crestTiers[0];
  const nextTier = crestTiers.find(tier => tier.level === currentCrest + 1);
  
  // Calculate progress to next level
  const progressPercent = nextTier 
    ? ((currentScore - currentTier.minScore) / (nextTier.minScore - currentTier.minScore)) * 100 
    : 100;

  // Mock history data
  const history = [
    { date: '2024-12-01', level: 3, action: 'Reached Connector' },
    { date: '2024-11-15', level: 2, action: 'Reached Builder' },
    { date: '2024-11-01', level: 1, action: 'Reached Explorer' },
  ];

  return (
    <div className="w-full p-2">
      {/* Header */}
      <div className="mb-4">
        <h2 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Crest Progress
        </h2>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Track your advancement through verification tiers
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        
        {['progress', 'benefits', showHistory && 'history'].filter(Boolean).map((tab) => (
          <button
            key={tab as string}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-purple-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab === 'progress' && 'Progress'}
            {tab === 'benefits' && 'Benefits'}
            {tab === 'history' && 'History'}
          </button>
        ))}
      </div>

      {/* PROGRESS TAB */}
      {activeTab === 'progress' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Current Tier Card */}
          <div className={`p-4 rounded-2xl border-2`} style={{ 
            borderColor: currentTier.color,
            background: theme === 'dark' 
              ? `linear-gradient(135deg, ${currentTier.color}20, ${currentTier.color}10)` 
              : `linear-gradient(135deg, ${currentTier.color}10, ${currentTier.color}05)`
          }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: currentTier.color }}>
                  {React.createElement(currentTier.icon, { className: 'w-7 h-7 text-white' })}
                </div>
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Current Tier
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Crest {currentCrest}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: currentTier.color }}>
                    {currentTier.name}
                  </p>
                </div>
              </div>
              
              <div className={`text-right`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Score
                </p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {currentScore.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {nextTier && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Progress to Crest {nextTier.level}
                  </p>
                  <p className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {Math.round(progressPercent)}%
                  </p>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: nextTier.color }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    {currentTier.minScore.toLocaleString()}
                  </p>
                  <p className="text-xs font-bold" style={{ color: nextTier.color }}>
                    {nextTier.minScore.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Requirements Checklist */}
          {nextTier && (
            <div className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Requirements for Crest {nextTier.level}
                </h3>
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  {nextTier.requirements.filter(r => r.completed).length}/{nextTier.requirements.length}
                </div>
              </div>

              <div className="space-y-3">
                {nextTier.requirements.map((req) => (
                  <div key={req.id} className="flex items-start gap-3">
                    <div className="mt-1">
                      {req.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {req.label}
                      </p>
                      <div className={`h-1.5 rounded-full overflow-hidden ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${Math.min((req.current / req.required) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {req.current} / {req.required}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Tier Preview */}
          {nextTier && (
            <div className={`p-4 rounded-xl border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Next: {nextTier.name}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {nextTier.benefits.map((benefit, idx) => (
                  <div key={idx} className={`px-3 py-1 rounded-full text-xs font-medium ${
                    theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <Gift className="w-3 h-3 inline mr-1" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* BENEFITS TAB */}
      {activeTab === 'benefits' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {crestTiers.slice(0, showAllBenefits ? undefined : currentCrest + 3).map((tier) => {
            const isUnlocked = tier.level <= currentCrest;
            const TierIcon = tier.icon;
            
            return (
              <div
                key={tier.level}
                className={`p-4 rounded-xl border ${
                  isUnlocked
                    ? theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    : theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50 border-gray-200'
                } ${!isUnlocked && 'opacity-60'}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: tier.color }}
                  >
                    {isUnlocked ? (
                      <TierIcon className="w-5 h-5 text-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Crest {tier.level} · {tier.name}
                      </p>
                      {isUnlocked && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {tier.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Star className={`w-3 h-3 flex-shrink-0 mt-0.5 ${
                            isUnlocked ? 'text-amber-500' : 'text-gray-400'
                          }`} />
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {benefit}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {!showAllBenefits && (
            <button
              onClick={() => setShowAllBenefits(true)}
              className={`w-full p-3 rounded-xl border flex items-center justify-center gap-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white'
                  : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900'
              }`}
            >
              <span className="text-sm font-medium">View All Tiers</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && showHistory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {history.length > 0 ? (
            history.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {item.action}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <Award className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            ))
          ) : (
            <div className={`p-12 rounded-xl text-center ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <Info className={`w-12 h-12 mx-auto mb-3 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                No advancement history yet
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CrestProgress;