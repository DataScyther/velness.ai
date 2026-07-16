import { describe, it, expect } from 'vitest';
import { DEFAULT_PROGRAMS, DEFAULT_LESSONS } from '../programs';
import { CATEGORY_ID } from '../../constants';

describe('CBT Curriculum and Lesson Blueprint validation', () => {
  it('should have exactly 1 CBT program', () => {
    const cbtPrograms = DEFAULT_PROGRAMS.filter(p => p.categoryId === CATEGORY_ID.CBT);
    expect(cbtPrograms.length).toBe(1);

    const programIds = cbtPrograms.map(p => p.id).sort();
    const expectedIds = ['cbt-foundations'];

    expect(programIds).toEqual(expectedIds);
  });

  it('should verify every CBT lesson has all blueprint fields populated', () => {
    const cbtPrograms = DEFAULT_PROGRAMS.filter(p => p.categoryId === CATEGORY_ID.CBT);
    const cbtProgramIds = new Set(cbtPrograms.map(p => p.id));

    const cbtLessons = DEFAULT_LESSONS.filter(l => cbtProgramIds.has(l.programId));

    // There should be exactly 6 lessons for the cbt-foundations program
    expect(cbtLessons.length).toBe(6);

    for (const lesson of cbtLessons) {
      // 1. Learning Goal (learningObjective)
      expect(lesson.learningObjective).toBeDefined();
      expect(typeof lesson.learningObjective).toBe('string');
      expect(lesson.learningObjective?.trim().length).toBeGreaterThan(0);

      // 2. Estimated Time (duration)
      expect(lesson.duration).toBeDefined();
      expect(typeof lesson.duration).toBe('number');
      expect(lesson.duration).toBeGreaterThan(0);

      // 3. Preparation
      expect(lesson.preparation).toBeDefined();
      expect(typeof lesson.preparation).toBe('string');
      expect(lesson.preparation?.trim().length).toBeGreaterThan(0);

      // 4. Guided Exercise (introduction)
      expect(lesson.introduction).toBeDefined();
      expect(typeof lesson.introduction).toBe('string');
      expect(lesson.introduction?.trim().length).toBeGreaterThan(0);

      // 5. Reflection (reflectionPrompt)
      expect(lesson.reflectionPrompt).toBeDefined();
      expect(typeof lesson.reflectionPrompt).toBe('string');
      expect(lesson.reflectionPrompt?.trim().length).toBeGreaterThan(0);

      // 6. Takeaway
      expect(lesson.takeaway).toBeDefined();
      expect(typeof lesson.takeaway).toBe('string');
      expect(lesson.takeaway?.trim().length).toBeGreaterThan(0);

      // 7. Completion (completionSummary)
      expect(lesson.completionSummary).toBeDefined();
      expect(typeof lesson.completionSummary).toBe('string');
      expect(lesson.completionSummary?.trim().length).toBeGreaterThan(0);
    }
  });

  it('should verify all 6 CBT Foundations exercises have guided steps config', async () => {
    const { GUIDED_STEPS_CONFIG } = await import('../guidedSteps');
    const expectedExerciseIds = [
      'cbt-foundations-l1-ex1',
      'cbt-foundations-l2-ex1',
      'cbt-foundations-l3-ex1',
      'cbt-foundations-l4-ex1',
      'cbt-foundations-l5-ex1',
      'cbt-foundations-l6-ex1',
    ];

    for (const exId of expectedExerciseIds) {
      expect(GUIDED_STEPS_CONFIG[exId]).toBeDefined();
      expect(GUIDED_STEPS_CONFIG[exId].length).toBeGreaterThan(0);
    }
  });

  it('should have exactly 7 breathing programs (sessions)', () => {
    const breathingPrograms = DEFAULT_PROGRAMS.filter(p => p.categoryId === CATEGORY_ID.BREATHING);
    expect(breathingPrograms.length).toBe(7);

    const programIds = breathingPrograms.map(p => p.id).sort();
    const expectedIds = [
      '1-minute-reset',
      '3-minute-calm',
      'box-breathing',
      '4-7-8-breathing',
      'deep-relaxation',
      'focus-breathing',
      'sleep-breathing'
    ].sort();

    expect(programIds).toEqual(expectedIds);
  });

  it('should verify every breathing lesson has all blueprint fields populated', () => {
    const breathingPrograms = DEFAULT_PROGRAMS.filter(p => p.categoryId === CATEGORY_ID.BREATHING);
    const breathingProgramIds = new Set(breathingPrograms.map(p => p.id));

    const breathingLessons = DEFAULT_LESSONS.filter(l => breathingProgramIds.has(l.programId));

    // There should be exactly 7 lessons total (1 per program)
    expect(breathingLessons.length).toBe(7);

    for (const lesson of breathingLessons) {
      expect(lesson.learningObjective).toBeDefined();
      expect(typeof lesson.learningObjective).toBe('string');
      expect(lesson.learningObjective?.trim().length).toBeGreaterThan(0);

      expect(lesson.duration).toBeDefined();
      expect(typeof lesson.duration).toBe('number');
      expect(lesson.duration).toBeGreaterThan(0);

      expect(lesson.introduction).toBeDefined();
      expect(typeof lesson.introduction).toBe('string');
      expect(lesson.introduction?.trim().length).toBeGreaterThan(0);

      expect(lesson.reflectionPrompt).toBeDefined();
      expect(typeof lesson.reflectionPrompt).toBe('string');
      expect(lesson.reflectionPrompt?.trim().length).toBeGreaterThan(0);

      expect(lesson.completionSummary).toBeDefined();
      expect(typeof lesson.completionSummary).toBe('string');
      expect(lesson.completionSummary?.trim().length).toBeGreaterThan(0);
    }
  });

  it('should have exactly 7 meditation programs (sessions)', () => {
    const meditationPrograms = DEFAULT_PROGRAMS.filter(p => p.categoryId === CATEGORY_ID.MEDITATION);
    expect(meditationPrograms.length).toBe(7);

    const programIds = meditationPrograms.map(p => p.id).sort();
    const expectedIds = [
      'sleep-meditation',
      'stress-meditation',
      'focus-meditation',
      'anxiety-meditation',
      'confidence-meditation',
      'gratitude-meditation',
      'self-compassion-meditation'
    ].sort();

    expect(programIds).toEqual(expectedIds);
  });

  it('should verify every meditation lesson has all blueprint fields populated', () => {
    const meditationPrograms = DEFAULT_PROGRAMS.filter(p => p.categoryId === CATEGORY_ID.MEDITATION);
    const meditationProgramIds = new Set(meditationPrograms.map(p => p.id));

    const meditationLessons = DEFAULT_LESSONS.filter(l => meditationProgramIds.has(l.programId));

    expect(meditationLessons.length).toBe(7);

    for (const lesson of meditationLessons) {
      expect(lesson.learningObjective).toBeDefined();
      expect(typeof lesson.learningObjective).toBe('string');
      expect(lesson.learningObjective?.trim().length).toBeGreaterThan(0);

      expect(lesson.duration).toBeDefined();
      expect(typeof lesson.duration).toBe('number');
      expect(lesson.duration).toBeGreaterThan(0);

      expect(lesson.introduction).toBeDefined();
      expect(typeof lesson.introduction).toBe('string');
      expect(lesson.introduction?.trim().length).toBeGreaterThan(0);

      expect(lesson.reflectionPrompt).toBeDefined();
      expect(typeof lesson.reflectionPrompt).toBe('string');
      expect(lesson.reflectionPrompt?.trim().length).toBeGreaterThan(0);

      expect(lesson.completionSummary).toBeDefined();
      expect(typeof lesson.completionSummary).toBe('string');
      expect(lesson.completionSummary?.trim().length).toBeGreaterThan(0);
    }
  });

  it('should have exactly 8 wellness studio programs (sessions)', () => {
    const wellnessPrograms = DEFAULT_PROGRAMS.filter(p => p.categoryId === CATEGORY_ID.WELLNESS);
    expect(wellnessPrograms.length).toBe(8);

    const programIds = wellnessPrograms.map(p => p.id).sort();
    const expectedIds = [
      'gratitude-journal',
      'positive-affirmations',
      'digital-detox',
      'sleep-preparation',
      'mindful-walking',
      'body-scan',
      'self-check-in',
      'grounding-exercise'
    ].sort();

    expect(programIds).toEqual(expectedIds);
  });

  it('should verify every wellness lesson has all blueprint fields populated', () => {
    const wellnessPrograms = DEFAULT_PROGRAMS.filter(p => p.categoryId === CATEGORY_ID.WELLNESS);
    const wellnessProgramIds = new Set(wellnessPrograms.map(p => p.id));

    const wellnessLessons = DEFAULT_LESSONS.filter(l => wellnessProgramIds.has(l.programId));

    expect(wellnessLessons.length).toBe(8);

    for (const lesson of wellnessLessons) {
      expect(lesson.learningObjective).toBeDefined();
      expect(typeof lesson.learningObjective).toBe('string');
      expect(lesson.learningObjective?.trim().length).toBeGreaterThan(0);

      expect(lesson.duration).toBeDefined();
      expect(typeof lesson.duration).toBe('number');
      expect(lesson.duration).toBeGreaterThan(0);

      expect(lesson.introduction).toBeDefined();
      expect(typeof lesson.introduction).toBe('string');
      expect(lesson.introduction?.trim().length).toBeGreaterThan(0);

      expect(lesson.reflectionPrompt).toBeDefined();
      expect(typeof lesson.reflectionPrompt).toBe('string');
      expect(lesson.reflectionPrompt?.trim().length).toBeGreaterThan(0);

      expect(lesson.completionSummary).toBeDefined();
      expect(typeof lesson.completionSummary).toBe('string');
      expect(lesson.completionSummary?.trim().length).toBeGreaterThan(0);
    }
  });
});
