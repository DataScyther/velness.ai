import { SessionMemory, UserContext, AIContext } from './types';
import { getTimeOfDay } from '@/prompts/mentalWellnessPrompt';

export class MemoryManager {
  private session: SessionMemory;
  private user: UserContext;

  readonly DEFAULT_SUMMARY_TURNS = 8;

  constructor(conversationId: string, userContext?: Partial<UserContext>) {
    this.session = {
      conversationId,
      turnCount: 0,
      summary: null,
      summaryTurnCount: 0,
      recentTopics: [],
      recentMood: null,
    };

    this.user = {
      name: userContext?.name ?? null,
      tone: userContext?.tone ?? 'auto',
      goals: userContext?.goals ?? [],
      initialMood: userContext?.initialMood ?? null,
      returningUser: userContext?.returningUser ?? false,
    };
  }

  incrementTurn(): void {
    this.session.turnCount++;
  }

  addTopic(topic: string): void {
    if (!this.session.recentTopics.includes(topic)) {
      this.session.recentTopics.push(topic);
      if (this.session.recentTopics.length > 10) {
        this.session.recentTopics.shift();
      }
    }
  }

  setMood(mood: string): void {
    this.session.recentMood = mood;
  }

  setSummary(summary: string): void {
    this.session.summary = summary;
    this.session.summaryTurnCount = this.session.turnCount;
  }

  needsSummarization(): boolean {
    return this.session.turnCount - this.session.summaryTurnCount >= this.DEFAULT_SUMMARY_TURNS;
  }

  buildContext(): AIContext {
    return {
      userName: this.user.name ?? undefined,
      preferredTone: this.user.tone,
      timeOfDay: getTimeOfDay(),
      returningUser: this.user.returningUser || undefined,
      previousMood: this.session.recentMood ?? undefined,
      summary: this.session.summary ?? undefined,
      goals: this.user.goals.length > 0 ? this.user.goals : undefined,
    };
  }

  buildCondensedHistory(
    fullHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Array<{ role: 'user' | 'assistant' | 'system'; content: string }> {
    if (!this.session.summary) {
      return fullHistory;
    }

    const last6 = fullHistory.slice(-6);
    return [
      { role: 'system', content: `Previous conversation summary: ${this.session.summary}` },
      ...last6,
    ];
  }

  getSession(): Readonly<SessionMemory> {
    return { ...this.session };
  }
}
