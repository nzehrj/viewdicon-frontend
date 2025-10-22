// Voice Authentication & Heritage Challenge Types

// Voice Challenge
export interface VoiceStartResponse {
  nonce_id: string;
  phrase: string;
  lang: string;
  phonetic_hint?: string;
  sample_audio_url?: string;
}

export interface VoiceVerifyRequest {
  nonce_id: string;
  audio_b64: string;
  lang: string;
}

export interface VoiceVerifyResponse {
  score: number;
  passed: boolean;
  feedback?: string;
  retry_allowed?: boolean;
}

// Heritage Challenge (C2 Gate)
export type QuestionType = 'free' | 'choice' | 'multiple';

export interface HeritageQuestion {
  id: string;
  prompt: string;
  type: QuestionType;
  choices?: string[];
  hint?: string;
}

export interface HeritageStartResponse {
  challenge_id: string;
  questions: HeritageQuestion[];
  time_limit_seconds?: number;
}

export interface HeritageAnswerRequest {
  challenge_id: string;
  answers: Record<string, string | string[]>;
}

export interface HeritageAnswerResponse {
  correct: number;
  total: number;
  passed: boolean;
  feedback?: string;
}

export interface HeritageStateResponse {
  status: 'pending' | 'passed' | 'failed';
  score?: number;
  attempts_remaining?: number;
}