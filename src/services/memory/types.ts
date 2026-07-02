export interface SessionMemory {
  conversationId: string;
  turnCount: number;
  summary: string | null;
  summaryTurnCount: number;
  recentTopics: string[];
  recentMood: string | null;
}

export interface UserContext {
  name: string | null;
  tone: 'warm' | 'motivational' | 'soothing' | 'auto';
  goals: string[];
  initialMood: string | null;
  returningUser: boolean;
}

export interface AIContext {
  userName?: string;
  preferredTone?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  returningUser?: boolean;
  previousMood?: string;
  summary?: string;
  goals?: string[];
}
