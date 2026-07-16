import { DIFFICULTY, CATEGORY_ID, PROGRAM_STATUS } from '../constants';
import type { Program } from '../models/Program';
import type { Lesson } from '../models/Lesson';

export const DEFAULT_PROGRAMS: Program[] = [
  // ─── CBT ───────────────────────────────────────────────────────────
  {
    id: 'cbt-foundations',
    title: 'CBT Foundations',
    description: 'Learn evidence-based tools to observe, challenge, and replace negative automatic thoughts.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 48,
    thumbnail: '',
    categoryId: CATEGORY_ID.CBT,
    lessonCount: 6,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 0,
    benefits: ['Recognize thinking patterns', 'Identify cognitive distortions', 'Formulate balanced reframes'],
    estimatedTime: '6 days'
  },

  // ─── Breathing ─────────────────────────────────────────────────────
  {
    id: '1-minute-reset',
    title: '1 Minute Reset',
    description: 'A quick 1-minute breathing space to reset and ground yourself.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 1,
    thumbnail: '',
    categoryId: CATEGORY_ID.BREATHING,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 0,
    benefits: ['Quick stress relief', 'Grounding energy', 'Instant pause'],
    estimatedTime: '1 min'
  },
  {
    id: '3-minute-calm',
    title: '3 Minute Calm',
    description: 'Paced breathing to calm the mind and body.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 3,
    thumbnail: '',
    categoryId: CATEGORY_ID.BREATHING,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 1,
    benefits: ['Down-regulate physiology', 'Reduce heart rate', 'Release tension'],
    estimatedTime: '3 min'
  },
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    description: 'The classic 4-second equal-count breathing technique used for focus and stress relief.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 5,
    thumbnail: '',
    categoryId: CATEGORY_ID.BREATHING,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 2,
    benefits: ['Autonomic nervous system balance', 'Sharpen focus', 'Reduce anxiety'],
    estimatedTime: '5 min'
  },
  {
    id: '4-7-8-breathing',
    title: '4-7-8 Breathing',
    description: 'A deeply relaxing breathing pattern that acts as a natural tranquilizer for the nervous system.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 5,
    thumbnail: '',
    categoryId: CATEGORY_ID.BREATHING,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 3,
    benefits: ['Deep parasympathetic activation', 'Curb anxiety', 'Calm overactive mind'],
    estimatedTime: '5 min'
  },
  {
    id: 'deep-relaxation',
    title: 'Deep Relaxation',
    description: 'Sustained slow breathing to release deep-seated physical and mental tension.',
    difficulty: DIFFICULTY.INTERMEDIATE,
    duration: 10,
    thumbnail: '',
    categoryId: CATEGORY_ID.BREATHING,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 4,
    benefits: ['Deconstruct stress patterns', 'Deep somatic relaxation', 'Emotional soothing'],
    estimatedTime: '10 min'
  },
  {
    id: 'focus-breathing',
    title: 'Focus Breathing',
    description: 'Energising breathing cycles to boost alertness and mental clarity.',
    difficulty: DIFFICULTY.INTERMEDIATE,
    duration: 3,
    thumbnail: '',
    categoryId: CATEGORY_ID.BREATHING,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 5,
    benefits: ['Clear brain fog', 'Oxygenate brain cells', 'Increase alertness'],
    estimatedTime: '3 min'
  },
  {
    id: 'sleep-breathing',
    title: 'Sleep Breathing',
    description: 'Slow diaphragmatic breathing with extended exhales to prepare for deep rest.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 15,
    thumbnail: '',
    categoryId: CATEGORY_ID.BREATHING,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 6,
    benefits: ['Transition to sleep state', 'Somatic sleep preparation', 'Quiet evening thoughts'],
    estimatedTime: '15 min'
  },
  // ─── Meditation ────────────────────────────────────────────────────
  {
    id: 'sleep-meditation',
    title: 'Sleep Meditation',
    description: 'Wind down your body and mind with calming body scans and visualizations.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 15,
    thumbnail: '',
    categoryId: CATEGORY_ID.MEDITATION,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 0,
    benefits: ['Physical body release', 'Calm thoughts', 'Restful transition'],
    estimatedTime: '15 min'
  },
  {
    id: 'stress-meditation',
    title: 'Stress Meditation',
    description: 'Somatic calming and releasing daily mental chatter.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 10,
    thumbnail: '',
    categoryId: CATEGORY_ID.MEDITATION,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 1,
    benefits: ['Release anxiety', 'Somatic grounding', 'Calm nervous system'],
    estimatedTime: '10 min'
  },
  {
    id: 'focus-meditation',
    title: 'Focus Meditation',
    description: 'Train your brain to anchor attention, recognize distraction, and return to focus.',
    difficulty: DIFFICULTY.INTERMEDIATE,
    duration: 10,
    thumbnail: '',
    categoryId: CATEGORY_ID.MEDITATION,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 2,
    benefits: ['Anchor attention', 'Recognize distraction', 'Boost mental clarity'],
    estimatedTime: '10 min'
  },
  {
    id: 'anxiety-meditation',
    title: 'Anxiety Meditation',
    description: 'Mindfulness practices specifically designed to create space around anxious feelings and stories.',
    difficulty: DIFFICULTY.INTERMEDIATE,
    duration: 15,
    thumbnail: '',
    categoryId: CATEGORY_ID.MEDITATION,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 3,
    benefits: ['Soften anxiety loops', 'Anchor in the present', 'Self-soothing'],
    estimatedTime: '15 min'
  },
  {
    id: 'confidence-meditation',
    title: 'Confidence Meditation',
    description: 'Inner strength alignment and positive self-visualization.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 10,
    thumbnail: '',
    categoryId: CATEGORY_ID.MEDITATION,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 4,
    benefits: ['Boost self-worth', 'Release self-doubt', 'Inner capability alignment'],
    estimatedTime: '10 min'
  },
  {
    id: 'gratitude-meditation',
    title: 'Gratitude Meditation',
    description: 'Rewire your focus toward the positive aspects of your life through active appreciation.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 10,
    thumbnail: '',
    categoryId: CATEGORY_ID.MEDITATION,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 5,
    benefits: ['Neural positivity focus', 'Appreciate simple moments', 'Cultivate joy'],
    estimatedTime: '10 min'
  },
  {
    id: 'self-compassion-meditation',
    title: 'Self Compassion Meditation',
    description: 'Cultivating warmth, understanding, and kind acceptance of ourselves.',
    difficulty: DIFFICULTY.INTERMEDIATE,
    duration: 12,
    thumbnail: '',
    categoryId: CATEGORY_ID.MEDITATION,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 6,
    benefits: ['Cultivate inner kindness', 'Soften self-criticism', 'Accept emotional discomfort'],
    estimatedTime: '12 min'
  },

  // ─── Wellness Studio ───────────────────────────────────────────────
  {
    id: 'gratitude-journal',
    title: 'Gratitude Journal',
    description: 'Write down small things that brought you comfort, joy, or satisfaction today.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 5,
    thumbnail: '',
    categoryId: CATEGORY_ID.WELLNESS,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 0,
    benefits: ['Focus on positive items', 'Written appreciation', 'Cultivate daily joy'],
    estimatedTime: '5 min'
  },
  {
    id: 'positive-affirmations',
    title: 'Positive Affirmations',
    description: 'Ground yourself in supportive, self-directed beliefs to counter self-doubt.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 5,
    thumbnail: '',
    categoryId: CATEGORY_ID.WELLNESS,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 1,
    benefits: ['Release self-criticism', 'Empowering statements', 'Emotional resilience'],
    estimatedTime: '5 min'
  },
  {
    id: 'digital-detox',
    title: 'Digital Detox',
    description: 'Step away from screen activities and clear cognitive stimulation.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 15,
    thumbnail: '',
    categoryId: CATEGORY_ID.WELLNESS,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 2,
    benefits: ['Quiet overstimulated brain', 'Reduce sensory fatigue', 'Present grounding'],
    estimatedTime: '15 min'
  },
  {
    id: 'sleep-preparation',
    title: 'Sleep Preparation',
    description: 'Slowing down breathing patterns and body cues to prepare for deep rest.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 10,
    thumbnail: '',
    categoryId: CATEGORY_ID.WELLNESS,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 3,
    benefits: ['Somatic sleep cues', 'Calm thoughts', 'Restful transition'],
    estimatedTime: '10 min'
  },
  {
    id: 'mindful-walking',
    title: 'Mindful Walking',
    description: 'Bring sensory awareness to your physical steps and surrounding environment.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 10,
    thumbnail: '',
    categoryId: CATEGORY_ID.WELLNESS,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 4,
    benefits: ['Connect body to ground', 'Sensory observation', 'Active presence'],
    estimatedTime: '10 min'
  },
  {
    id: 'body-scan',
    title: 'Body Scan',
    description: 'Progressively scanning your body to release stored somatic tension.',
    difficulty: DIFFICULTY.INTERMEDIATE,
    duration: 15,
    thumbnail: '',
    categoryId: CATEGORY_ID.WELLNESS,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 5,
    benefits: ['Dissolve somatic tension', 'Mind-body awareness', 'Slowing brain waves'],
    estimatedTime: '15 min'
  },
  {
    id: 'self-check-in',
    title: 'Self Check-in',
    description: 'Scan your current physical, mental, and emotional state.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 5,
    thumbnail: '',
    categoryId: CATEGORY_ID.WELLNESS,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 6,
    benefits: ['Label current feelings', 'Observe body state', 'Self-awareness'],
    estimatedTime: '5 min'
  },
  {
    id: 'grounding-exercise',
    title: 'Grounding Exercise',
    description: 'Somatic pauses to stabilize your state in stressful transitions.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 5,
    thumbnail: '',
    categoryId: CATEGORY_ID.WELLNESS,
    lessonCount: 1,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 7,
    benefits: ['Instant calm pause', 'Release chest pressure', 'Transition grounding'],
    estimatedTime: '5 min'
  }
];

// ─── Custom Lesson Content Database (Sprint 4.9 Content Quality Review) ───
interface LessonContentInput {
  title: string;
  description: string;
  introduction: string;
  learningObjective: string;
  preparation?: string;
  reflectionPrompt: string;
  takeaway?: string;
  completionSummary: string;
  duration?: number;
}

// ─── Lesson Blueprint Engineering (Sprint 7 — CBT Therapeutic Content Layer) ───
// Per-lesson Preparation (setup before practice) and Takeaway (closing insight)
// for the eight CBT programs. Keyed by program id, ordered by lesson position.
const LESSON_BLUEPRINT: Record<string, Array<{ preparation: string; takeaway: string }>> = {
  'cbt-foundations': [
    {
      preparation: 'Find a quiet spot where you won’t be interrupted for about 8 minutes. Keep this device nearby so you can capture your first observation.',
      takeaway: 'You’ve taken the first step in cognitive awareness: noticing that thoughts are mental events you can observe, not commands you must obey.'
    },
    {
      preparation: 'Recall a worry that keeps resurfacing. You’ll hold it up to the light and name the cognitive distortion behind it.',
      takeaway: 'Labeling a distortion—catastrophizing, mind reading—breaks the illusion that the thought is simply “the truth.”'
    },
    {
      preparation: 'Choose one negative belief about yourself that feels heavy. You’ll act as a fair judge weighing the evidence for and against it.',
      takeaway: 'When you put a thought on trial, the verdict is almost always kinder and far more accurate than the accusation.'
    },
    {
      preparation: 'Pick one persistent negative belief you’d like to reshape into a balanced, supportive statement.',
      takeaway: 'Daily reframing is a habit, not a one-time fix—each balanced thought weakens the old negative groove.'
    },
    {
      preparation: 'Think of one recurring daily stressor. You will establish a commitment to a daily check-in routine.',
      takeaway: 'Consistency builds a solid foundation for resilience. A daily thought-checking routine keeps you grounded.'
    },
    {
      preparation: 'Reflect on the tools you’ve gathered during this program. You will complete your long-term self-care playbook.',
      takeaway: 'Congratulations! You have completed the CBT Foundations program. Continue practicing your tools to build lasting mental well-being.'
    }
  ]
};

const LESSON_CONTENT: Record<string, LessonContentInput[]> = {
  // CBT Programs
  'cbt-foundations': [
    {
      title: 'Understanding Thoughts',
      description: 'Observe your thoughts as temporary mental events, not absolute facts.',
      introduction: 'Welcome! Today we begin by observing the voice in our head. **Thoughts are not facts**—they are simply mental occurrences that come and go.',
      learningObjective: 'Observe your automatic thoughts without immediately reacting or accepting them as truth.',
      reflectionPrompt: 'What is one automatic thought you noticed today? Was it a fact or an opinion?',
      completionSummary: 'Wonderful start! By observing your thoughts with healthy distance, you\'re building mental flexibility. ✨',
      duration: 8
    },
    {
      title: 'Identify Distortions',
      description: 'Recognize common thinking patterns and cognitive distortions.',
      introduction: 'Welcome back. Today we learn to spot **cognitive distortions**—mental shortcuts that warp reality and amplify distress.',
      learningObjective: 'Identify which cognitive distortions are active in your automatic thoughts.',
      reflectionPrompt: 'What common distortion did you notice in your thoughts today?',
      completionSummary: 'Great job. Labeling distortions takes away their power. 🧠',
      duration: 8
    },
    {
      title: 'Challenge Thoughts',
      description: 'Examine the factual evidence for and against your thoughts.',
      introduction: 'Today we put our thoughts on trial. By looking for objective facts instead of feelings, we can test their validity.',
      learningObjective: 'Examine the evidence for and against a negative automatic thought.',
      reflectionPrompt: 'What evidence did you find that contradicts your automatic thought today?',
      completionSummary: 'Fascinating work! Challenging your assumptions creates room for growth. 🌱',
      duration: 8
    },
    {
      title: 'Replace Thoughts',
      description: 'Develop balanced, realistic alternative thoughts based on facts.',
      introduction: 'Once we challenge a thought, we replace it. Not with toxic positivity, but with a balanced, realistic alternative.',
      learningObjective: 'Formulate a realistic middle-ground thought based on facts.',
      reflectionPrompt: 'Write down a balanced replacement thought you formulated today.',
      completionSummary: 'Excellent! Balanced thinking helps you respond to life with clarity. 🌟',
      duration: 8
    },
    {
      title: 'Daily Practice',
      description: 'Integrate cognitive reframing into your daily routine.',
      introduction: 'Like any skill, CBT requires consistency. Today we establish a daily thought-checking routine.',
      learningObjective: 'Commit to a specific practice routine for cognitive restructuring.',
      reflectionPrompt: 'What time of day works best for your daily thought check?',
      completionSummary: 'Commitment is key! You are building a solid foundation for resilience. 💪',
      duration: 8
    },
    {
      title: 'Reflection',
      description: 'Consolidate your progress and celebrate your journey.',
      introduction: 'In this final lesson, we reflect on our progress, consolidate our insights, and look ahead.',
      learningObjective: 'Synthesize your learnings into a long-term self-care playbook.',
      reflectionPrompt: 'What is the most valuable insight you have gained from this program?',
      completionSummary: 'Congratulations! You have completed the CBT Foundations program. Keep applying these tools! 🎉',
      duration: 8
    }
  ],
  'challenging-negative-thinking': [
    {
      title: 'Automatic Negativity',
      description: 'Catch automatic negative thoughts (ANTs) before they dominate your mindset.',
      introduction: 'Automatic negative thoughts arise without conscious effort. Today we learn to **catch these ANTs** in real-time.',
      learningObjective: 'Notice negative thoughts as they appear and flag them immediately for evaluation.',
      reflectionPrompt: 'What is one automatic negative thought you caught today? What did you label it?',
      completionSummary: 'Excellent catch! Flagging automatic negative thoughts takes away their immediate power. ✨'
    },
    {
      title: 'Thinking Traps',
      description: 'Learn to identify common cognitive distortions, such as catastrophizing and mind reading.',
      introduction: 'Our brains use shortcuts that distort reality. Today we examine **thinking traps** (like catastrophizing or mind reading) and call them out.',
      learningObjective: 'Identify which cognitive distortions are most active in your daily negative thoughts.',
      reflectionPrompt: 'Which thinking trap (e.g. mind reading, catastrophizing, all-or-nothing) did you spot today?',
      completionSummary: 'Great spotting! Naming the distortion helps you disengage from its emotional grip. 🌱'
    },
    {
      title: 'Checking Evidence',
      description: 'Examine the factual evidence supporting or refuting your negative beliefs.',
      introduction: 'Don\'t believe everything you think. Today we **put our thoughts on trial** and examine the objective evidence for and against them.',
      learningObjective: 'Evaluate a negative thought by listing evidence that supports it and evidence that contradicts it.',
      reflectionPrompt: 'What is the objective evidence against your main stressful thought today?',
      completionSummary: 'A thorough trial! Looking at the facts instead of your fears helps ground your perspective. 💜'
    },
    {
      title: 'Alternative Explanations',
      description: 'Formulate realistic, alternative interpretations of challenging situations.',
      introduction: 'There is always more than one way to view a situation. Today we practice **generating alternative explanations**.',
      learningObjective: 'Brainstorm at least two realistic alternative interpretations for a stressful situation.',
      reflectionPrompt: 'What is a more realistic, objective explanation for the situation you analyzed today?',
      completionSummary: 'Well done. Opening your mind to alternatives breaks the rigidity of negative thinking. ✨'
    },
    {
      title: 'Reframing Daily',
      description: 'Establish cognitive reframing as a daily habit to support psychological flexibility.',
      introduction: 'In our final lesson, we practice **daily reframing**. We will build the habit of replacing negative biases with balanced thoughts.',
      learningObjective: 'Reframe a persistent negative belief into a balanced, constructive statement based on facts.',
      reflectionPrompt: 'Write down a balanced thought you formulated today. How does it make you feel compared to the original?',
      completionSummary: 'Fantastic job completing this program! You now possess the power to actively reshape your perspective. 🌟'
    }
  ],
  // Breathing Programs
  '1-minute-reset': [
    {
      title: '1 Minute Reset',
      description: 'A quick 1-minute breathing space to reset and ground yourself.',
      introduction: 'Welcome to your **1 Minute Reset**. Let\'s take a short pause to bring your awareness back to the present moment.',
      learningObjective: 'Observe your breath and reset somatic tension with a simple 1-minute coherent breathing cycle.',
      reflectionPrompt: 'How does your mind feel after this short pause?',
      completionSummary: 'Clean reset. You are ready to resume your day with presence. ✨'
    }
  ],
  '3-minute-calm': [
    {
      title: '3 Minute Calm',
      description: 'Paced breathing to calm the mind and body.',
      introduction: 'Welcome. The **3 Minute Calm** uses resonant breathing to slow your heart rate and down-regulate stress.',
      learningObjective: 'Establish a steady 5-second inhale and 5-second exhale rhythm for 3 minutes.',
      reflectionPrompt: 'Where did you feel tension release during the paced breaths?',
      completionSummary: 'Beautifully calmed. Carry this steady somatic state with you. 😌'
    }
  ],
  'box-breathing': [
    {
      title: 'Box Breathing',
      description: 'The classic 4-second equal-count breathing technique used for focus and stress relief.',
      introduction: 'Welcome. Today we practice **Box Breathing**, an equal-paced breathing method used by high-performance professionals to balance the nervous system.',
      learningObjective: 'Maintain a steady, rhythmic cycle of 4-second inhale, 4-second hold, 4-second exhale, and 4-second hold.',
      reflectionPrompt: 'How did the breath holds help steady your thoughts?',
      completionSummary: 'Well focused. You\'ve successfully balanced your autonomic state. 🌟'
    }
  ],
  '4-7-8-breathing': [
    {
      title: '4-7-8 Breathing',
      description: 'A deeply relaxing breathing pattern that acts as a natural tranquilizer for the nervous system.',
      introduction: 'Welcome. **4-7-8 Breathing** is a classic technique designed to activate your parasympathetic system rapidly.',
      learningObjective: 'Practice the classic ratio: 4s inhale, 7s hold, and a slow, audible 8s exhalation.',
      reflectionPrompt: 'Describe how the long 8-second sigh affected your level of calm.',
      completionSummary: 'Deeply relaxed. Your nervous system is now in a restorative rest state. 💜'
    }
  ],
  'deep-relaxation': [
    {
      title: 'Deep Relaxation',
      description: 'Sustained slow breathing to release deep-seated physical and mental tension.',
      introduction: 'Welcome to **Deep Relaxation**. We will use slow, sustained diaphragmatic cycles to dissolve chronic daily stress.',
      learningObjective: 'Maintain a slow, comfortable respiration pace for 10 minutes to soothe your nervous system.',
      reflectionPrompt: 'What parts of your body feel lighter or more relaxed now?',
      completionSummary: 'Somatic stress patterns dissolved. Rest in this space of ease. 🌱'
    }
  ],
  'focus-breathing': [
    {
      title: 'Focus Breathing',
      description: 'Energising breathing cycles to boost alertness and mental clarity.',
      introduction: 'Need a focus boost? **Focus Breathing** uses rapid, energizing cycles to increase oxygenation and clear brain fog.',
      learningObjective: 'Sustain a fast-paced 2-second inhale and 2-second exhale rhythm for 3 minutes.',
      reflectionPrompt: 'How does your level of focus and alertness feel compared to before?',
      completionSummary: 'Fully energized. Step into your next task with absolute clarity. 🚀'
    }
  ],
  'sleep-breathing': [
    {
      title: 'Sleep Breathing',
      description: 'Slow diaphragmatic breathing with extended exhales to prepare for deep rest.',
      introduction: 'Welcome. Let\'s quiet the mind. **Sleep Breathing** uses extended exhalations to trigger the sleep centers in your brain.',
      learningObjective: 'Cue the brain for deep sleep using slow, silent, extended 6-second exhalations.',
      reflectionPrompt: 'How ready for rest does your body feel right now?',
      completionSummary: 'Beautifully relaxed. Rest deeply and sleep well. 🌙'
    }
  ],
  // Meditation Programs
  'sleep-meditation': [
    {
      title: 'Sleep Meditation',
      description: 'Wind down your body and mind with calming body scans and visualizations.',
      introduction: 'Welcome. Settle into a comfortable lying position. Let\'s prepare your body and mind for restorative, deep sleep.',
      learningObjective: 'Release daily muscle tension and settle active thoughts using progressive body scanning.',
      reflectionPrompt: 'How relaxed do you feel after scanning your body?',
      completionSummary: 'Restful transition complete. Rest deeply. 🌙'
    }
  ],
  'stress-meditation': [
    {
      title: 'Stress Meditation',
      description: 'Somatic calming and releasing daily mental chatter.',
      introduction: 'Welcome. Let\'s pause and take a step back from today\'s mental demands. It is time to release somatic stress.',
      learningObjective: 'Soothe sympathetic activation and park active stressors using slow breathing anchors.',
      reflectionPrompt: 'What stressor did you consciously release during today\'s session?',
      completionSummary: 'Somatic stress calmed. Carry this space of peace with you. 😌'
    }
  ],
  'focus-meditation': [
    {
      title: 'Focus Meditation',
      description: 'Train your brain to anchor attention, recognize distraction, and return to focus.',
      introduction: 'Welcome. Attention is a muscle. Today we train focus by anchoring your mind on a single point.',
      learningObjective: 'Maintain attention on physical breath sensations and practice neutral distraction labeling.',
      reflectionPrompt: 'How many times did you notice your attention drift today?',
      completionSummary: 'Congratulations! You have completed the Focus Training program. Mind strong and clear. 🌟'
    }
  ],
  'anxiety-meditation': [
    {
      title: 'Anxiety Meditation',
      description: 'Mindfulness practices specifically designed to create space around anxious feelings and stories.',
      introduction: 'Welcome. Anxiety is a storm in the mind. Let\'s build space to observe thoughts without getting swept away.',
      learningObjective: 'Practice cognitive defusion by observing anxious feelings like clouds passing in the sky.',
      reflectionPrompt: 'Describe how it felt to observe your anxiety as a passing event rather than your identity.',
      completionSummary: 'Anxiety softened. You are the sky, not the clouds. 💜'
    }
  ],
  'confidence-meditation': [
    {
      title: 'Confidence Meditation',
      description: 'Inner strength alignment and positive self-visualization.',
      introduction: 'Welcome. Let\'s anchor in your capabilities and align your mind with your core strengths.',
      learningObjective: 'Cultivate self-worth and release self-doubt through capability-anchoring visualization.',
      reflectionPrompt: 'Write down one personal strength you visualized today.',
      completionSummary: 'Confidence aligned. Step forward with self-belief. 🌟'
    }
  ],
  'gratitude-meditation': [
    {
      title: 'Gratitude Meditation',
      description: 'Rewire your focus toward the positive aspects of your life through active appreciation.',
      introduction: 'Welcome. Today we rewire our neural pathways to focus on what is already abundant and good in our lives.',
      learningObjective: 'Develop active appreciation by bringing specific positive memories into clear focus.',
      reflectionPrompt: 'List three simple things you felt grateful for during this session.',
      completionSummary: 'Joy cultivated. Carry this abundance mindset with you. ✨'
    }
  ],
  'self-compassion-meditation': [
    {
      title: 'Self Compassion Meditation',
      description: 'Cultivating warmth, understanding, and kind acceptance of ourselves.',
      introduction: 'Welcome. We often criticize ourselves for mistakes. Today we cultivate kindness and understanding for our challenges.',
      learningObjective: 'Direct warm, compassionate phrases to yourself during moments of difficulty.',
      reflectionPrompt: 'How did offering kindness to yourself feel compared to self-criticism?',
      completionSummary: 'Kindness cultivated. Be gentle with yourself. 🌱'
    }
  ],
  'gratitude-journal': [
    {
      title: 'Gratitude Journal',
      description: 'Write down small things that brought you comfort, joy, or satisfaction today.',
      introduction: 'Welcome. Let\'s capture the good. Take a few moments to write down elements of comfort or joy in your day.',
      learningObjective: 'Identify and document positive daily events to strengthen appreciation habits.',
      reflectionPrompt: 'Read what you wrote. How does reflecting on these items shift your mood?',
      completionSummary: 'Journal updated. Abundance logged. 🌟'
    }
  ],
  'positive-affirmations': [
    {
      title: 'Positive Affirmations',
      description: 'Ground yourself in supportive, self-directed beliefs to counter self-doubt.',
      introduction: 'Welcome. Affirmations help anchor our self-talk. Let\'s repeat supportive, empowering statements.',
      learningObjective: 'Re-align your internal voice with affirmations of strength, resilience, and growth.',
      reflectionPrompt: 'Which affirmation felt the most powerful or needed today?',
      completionSummary: 'Self-talk grounded. You are capable. ✨'
    }
  ],
  'digital-detox': [
    {
      title: 'Digital Detox',
      description: 'Step away from screen activities and clear cognitive stimulation.',
      introduction: 'Welcome. Place your phone down after setting the timer. Let\'s rest your eyes and mind from the digital stream.',
      learningObjective: 'Reduce sensory overstimulation and practice screen-free presence.',
      reflectionPrompt: 'Describe how your mental focus felt after stepping away from notifications.',
      completionSummary: 'Detox complete. Return to screens with intentional choice. 📱'
    }
  ],
  'sleep-preparation': [
    {
      title: 'Sleep Preparation',
      description: 'Slowing down breathing patterns and body cues to prepare for deep rest.',
      introduction: 'Welcome. Let\'s ease somatic transition. Settle down and follow the slow unwinding breathing cycles.',
      learningObjective: 'Cue your nervous system for sleep using slow diaphragmatic exhalations.',
      reflectionPrompt: 'How relaxed do you feel after this somatic unwind?',
      completionSummary: 'Somatic unwinding complete. Ready for a peaceful night. 🌙'
    }
  ],
  'mindful-walking': [
    {
      title: 'Mindful Walking',
      description: 'Bring sensory awareness to your physical steps and surrounding environment.',
      introduction: 'Welcome. Take this walking session outside or in a long hallway. Let\'s bring sensory presence to each step.',
      learningObjective: 'Sync breath with physical movement and expand sensory awareness to your environment.',
      reflectionPrompt: 'What did you notice in your surroundings that you usually overlook?',
      completionSummary: 'Mindful steps completed. Carry this active presence with you. 🚶'
    }
  ],
  'body-scan': [
    {
      title: 'Body Scan',
      description: 'Progressively scanning your body to release stored somatic tension.',
      introduction: 'Welcome. Find a comfortable seat or lie down. Let\'s scan your body to release stored physical tension.',
      learningObjective: 'Direct mindful awareness sequentially from head to toe to dissolve muscle constriction.',
      reflectionPrompt: 'Which muscle group did you feel release the most tension today?',
      completionSummary: 'Somatic scan complete. Rest in this relaxed state. 😌'
    }
  ],
  'self-check-in': [
    {
      title: 'Self Check-in',
      description: 'Scan your current physical, mental, and emotional state.',
      introduction: 'Welcome. Let\'s pause and take an honest audit of how you are doing right now, without judgment.',
      learningObjective: 'Identify and name physical sensations, active thoughts, and primary emotions.',
      reflectionPrompt: 'Write down a brief summary of your physical, mental, and emotional state today.',
      completionSummary: 'Check-in completed. Acknowledging your state is the first step of self-care. 💜'
    }
  ],
  'grounding-exercise': [
    {
      title: 'Grounding Exercise',
      description: 'Somatic pauses to stabilize your state in stressful transitions.',
      introduction: 'Welcome. When transitions feel chaotic, a simple grounding pause stabilizes your focus.',
      learningObjective: 'Anchor yourself in the present using 5-4-3-2-1 sensory awareness and resonant breaths.',
      reflectionPrompt: 'How did grounding your senses help stabilize your stress level?',
      completionSummary: 'Postured and grounded. Ready for what comes next. 🌱'
    }
  ]
};

// Helper to generate lessons list
const lessons: Lesson[] = [];

// ─── Generate CBT Lessons ───────────────────────────────────────────
const cbtPrograms = [
  'cbt-foundations'
];

cbtPrograms.forEach((progId) => {
  const customLessons = LESSON_CONTENT[progId];
  if (customLessons) {
    customLessons.forEach((custom, idx) => {
      const order = idx + 1;
      const id = `${progId}-l${order}`;
      const blueprint = LESSON_BLUEPRINT[progId]?.[idx];
      const exerciseIds = [`${id}-ex1`];
      lessons.push({
        id,
        programId: progId,
        title: custom.title,
        description: custom.description,
        order,
        duration: custom.duration || 8,
        exerciseIds,
        introduction: custom.introduction,
        learningObjective: custom.learningObjective,
        preparation: blueprint?.preparation || '',
        reflectionPrompt: custom.reflectionPrompt,
        takeaway: blueprint?.takeaway || '',
        completionSummary: custom.completionSummary
      });
    });
  }
});

// ─── Generate Breathing, Meditation, and Wellness Lessons ────────────────
const otherProgramsList = [
  // Breathing
  '1-minute-reset',
  '3-minute-calm',
  'box-breathing',
  '4-7-8-breathing',
  'deep-relaxation',
  'focus-breathing',
  'sleep-breathing',
  // Meditation
  'sleep-meditation',
  'stress-meditation',
  'focus-meditation',
  'anxiety-meditation',
  'confidence-meditation',
  'gratitude-meditation',
  'self-compassion-meditation',
  // Wellness Studio
  'gratitude-journal',
  'positive-affirmations',
  'digital-detox',
  'sleep-preparation',
  'mindful-walking',
  'body-scan',
  'self-check-in',
  'grounding-exercise'
];

otherProgramsList.forEach((progId) => {
  const customLessons = LESSON_CONTENT[progId];
  if (customLessons) {
    const isWell = ['gratitude-journal', 'positive-affirmations', 'digital-detox', 'sleep-preparation', 'mindful-walking', 'body-scan', 'self-check-in', 'grounding-exercise'].includes(progId);
    customLessons.forEach((custom, idx) => {
      const order = idx + 1;
      const id = `${progId}-l${order}`;
      lessons.push({
        id,
        programId: progId,
        title: custom.title,
        description: custom.description,
        order,
        duration: custom.duration || (isWell ? 10 : 15),
        exerciseIds: [`${id}-ex1`],
        introduction: custom.introduction,
        learningObjective: custom.learningObjective,
        reflectionPrompt: custom.reflectionPrompt,
        completionSummary: custom.completionSummary
      });
    });
  }
});

export const DEFAULT_LESSONS: Lesson[] = lessons;

