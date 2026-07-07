export interface Lesson {
  id: string;
  programId: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  exerciseIds: string[];
  introduction?: string;
  learningObjective?: string;
  reflectionPrompt?: string;
  completionSummary?: string;
}
