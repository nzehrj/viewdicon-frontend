// src/components/feed/PostInteractionRenderer.tsx
// Post Interaction Renderer - Dynamically renders cultural components based on post type

import React from 'react';
import { ChallengeBoard } from '../cultural/ChallengeBoard';
import { ChallengeCard } from '../cultural/ChallengeCard';
import { ChallengeSubmission } from '../cultural/ChallengeSubmission';
import { ChallengeJudging } from '../cultural/ChallengeJudging';
import { StoryCircle } from '../cultural/StoryCircle';
import { StoryThread } from '../cultural/StoryThread';
import { StoryLineageTree } from '../cultural/StoryLineageTree';
import { DailyQuiz } from '../cultural/DailyQuiz';
import { ProverbChain } from '../cultural/ProverbChain';
import { CulturalDuel } from '../cultural/CulturalDuel';
import { QuizLeaderboard } from '../cultural/QuizLeaderboard';
import { LanguageContextHelper } from '../cultural/LanguageContextHelper';
import { ProverbNFTDisplay } from '../cultural/ProverbNFTDisplay';

// Post interaction types
export type PostInteractionType = 
  | 'challenge_board'
  | 'challenge_card'
  | 'challenge_submission'
  | 'challenge_judging'
  | 'story_circle'
  | 'story_thread'
  | 'story_lineage'
  | 'daily_quiz'
  | 'proverb_chain'
  | 'cultural_duel'
  | 'quiz_leaderboard'
  | 'language_context'
  | 'proverb_nft'
  | 'standard'; // Default like/comment/share

// Challenge-specific data
interface ChallengeData {
  challengeId: string;
  challengeTitle?: string;
  criteria?: Array<{
    name: string;
    weight: number;
    description: string;
  }>;
}

// Story-specific data
interface StoryData {
  storyId: string;
  storyTitle: string;
  word?: string;
  language?: string;
}

// Quiz-specific data
interface QuizData {
  quizId?: string;
}

// Duel-specific data
interface DuelData {
  opponentId: string;
  opponentName: string;
}

// Proverb-specific data
interface ProverbData {
  chainId?: string;
  word?: string;
  language?: string;
}

// Union type for all interaction data
type InteractionData = 
  | ChallengeData 
  | StoryData 
  | QuizData 
  | DuelData 
  | ProverbData 
  | null;

// Main Post interface
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  heat: number;
  
  // Cultural interaction fields
  interactionType: PostInteractionType;
  interactionData?: InteractionData;
}

interface PostInteractionRendererProps {
  post: Post;
  onInteraction?: (interactionType: string, data?: any) => void;
}

export const PostInteractionRenderer: React.FC<PostInteractionRendererProps> = ({
  post,
  onInteraction,
}) => {
  
  // Render the appropriate cultural component based on post type
  const renderInteraction = () => {
    switch (post.interactionType) {
      
      // ==================== CHALLENGES ====================
      case 'challenge_board':
        return (
          <ChallengeBoard
            onCreateChallenge={() => onInteraction?.('create_challenge')}
            onViewChallenge={(challengeId) => onInteraction?.('view_challenge', { challengeId })}
          />
        );

      case 'challenge_card':
        const challengeData = post.interactionData as ChallengeData;
        return (
          <ChallengeCard
            challengeId={challengeData?.challengeId || post.id}
            onSubmit={() => onInteraction?.('submit_entry', { challengeId: challengeData?.challengeId })}
            onViewSubmissions={() => onInteraction?.('view_submissions', { challengeId: challengeData?.challengeId })}
          />
        );

      case 'challenge_submission':
        const submissionData = post.interactionData as ChallengeData;
        return (
          <ChallengeSubmission
            challengeId={submissionData?.challengeId || post.id}
            challengeTitle={submissionData?.challengeTitle || 'Challenge'}
            onSubmit={(submission) => onInteraction?.('submit_challenge_entry', submission)}
            onCancel={() => onInteraction?.('cancel_submission')}
          />
        );

      case 'challenge_judging':
        const judgingData = post.interactionData as ChallengeData;
        return (
          <ChallengeJudging
            challengeId={judgingData?.challengeId || post.id}
            challengeTitle={judgingData?.challengeTitle || 'Challenge'}
            criteria={judgingData?.criteria || []}
            onSubmitJudgment={(submissionId, scores, feedback) => 
              onInteraction?.('submit_judgment', { submissionId, scores, feedback })
            }
          />
        );

      // ==================== STORYTELLING ====================
      case 'story_circle':
        return (
          <StoryCircle
            onJoinCircle={() => onInteraction?.('join_story_circle')}
            onShareStory={() => onInteraction?.('share_story')}
          />
        );

      case 'story_thread':
        const storyThreadData = post.interactionData as StoryData;
        return (
          <StoryThread
            storyId={storyThreadData?.storyId || post.id}
            storyTitle={storyThreadData?.storyTitle || 'Story Discussion'}
            onAddComment={(content, parentId) => 
              onInteraction?.('add_comment', { content, parentId })
            }
          />
        );

      case 'story_lineage':
        const lineageData = post.interactionData as StoryData;
        return (
          <StoryLineageTree
            storyId={lineageData?.storyId || post.id}
            onViewVersion={(nodeId) => onInteraction?.('view_story_version', { nodeId })}
          />
        );

      // ==================== EDUCATION ====================
      case 'daily_quiz':
        return (
          <DailyQuiz
            onComplete={(score, heat) => 
              onInteraction?.('quiz_complete', { score, heat })
            }
          />
        );

      case 'cultural_duel':
        const duelData = post.interactionData as DuelData;
        return (
          <CulturalDuel
            opponentId={duelData?.opponentId || 'ai'}
            opponentName={duelData?.opponentName || 'AI Challenger'}
            onComplete={(won, score) => 
              onInteraction?.('duel_complete', { won, score })
            }
          />
        );

      case 'quiz_leaderboard':
        return (
          <QuizLeaderboard
            onViewProfile={(userId) => onInteraction?.('view_profile', { userId })}
          />
        );

      // ==================== LANGUAGE & PROVERBS ====================
      case 'language_context':
        const languageData = post.interactionData as ProverbData;
        return (
          <LanguageContextHelper
            word={languageData?.word || 'Ubuntu'}
            language={languageData?.language || 'Nguni Bantu'}
            onRequestMore={(word) => onInteraction?.('request_more_context', { word })}
          />
        );

      case 'proverb_chain':
        const proverbChainData = post.interactionData as ProverbData;
        return (
          <ProverbChain
            chainId={proverbChainData?.chainId || post.id}
            onContribute={(text, language, translation) => 
              onInteraction?.('contribute_proverb', { text, language, translation })
            }
          />
        );

      case 'proverb_nft':
        return (
          <ProverbNFTDisplay
            onViewDetails={(nftId) => onInteraction?.('view_nft_details', { nftId })}
            onShare={(nftId) => onInteraction?.('share_nft', { nftId })}
          />
        );

      // ==================== STANDARD POST ====================
      case 'standard':
      default:
        return (
          <StandardPostInteraction
            post={post}
            onInteraction={onInteraction}
          />
        );
    }
  };

  return (
    <div className="post-interaction-container">
      {renderInteraction()}
    </div>
  );
};

// Standard Post Interaction (like/comment/share)
const StandardPostInteraction: React.FC<{
  post: Post;
  onInteraction?: (interactionType: string, data?: any) => void;
}> = ({ post, onInteraction }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onInteraction?.('like', { postId: post.id, liked: !isLiked });
  };

  const handleComment = () => {
    setShowComments(!showComments);
    onInteraction?.('toggle_comments', { postId: post.id });
  };

  const handleShare = () => {
    onInteraction?.('share', { postId: post.id });
  };

  return (
    <div className="flex items-center gap-6 p-4 border-t border-gray-700">
      {/* Like Button */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 transition-colors ${
          isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
        }`}
      >
        <svg
          className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span className="font-semibold">{post.likes}</span>
      </button>

      {/* Comment Button */}
      <button
        onClick={handleComment}
        className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span className="font-semibold">{post.comments}</span>
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        <span className="font-semibold">{post.shares}</span>
      </button>

      {/* Heat Indicator */}
      <div className="flex items-center gap-2 ml-auto">
        <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
        </svg>
        <span className="font-semibold text-orange-500">{post.heat}</span>
      </div>
    </div>
  );
};

export default PostInteractionRenderer;