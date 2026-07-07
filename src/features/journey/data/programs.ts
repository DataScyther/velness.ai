import { DIFFICULTY, CATEGORY_ID, PROGRAM_STATUS } from '../constants';
import type { Program } from '../models/Program';
import type { Lesson } from '../models/Lesson';

export const DEFAULT_PROGRAMS: Program[] = [
  // ─── CBT ───────────────────────────────────────────────────────────
  {
    id: 'understanding-thoughts',
    title: 'Understanding Thoughts',
    description: 'Build a strong foundation in observing and understanding how your thoughts impact your feelings.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 25,
    thumbnail: '',
    categoryId: CATEGORY_ID.CBT,
    lessonCount: 5,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 0,
    benefits: ['Recognize thinking patterns', 'Awareness of mind-body connection', 'Reduce cognitive distortions'],
    estimatedTime: '5 days'
  },
  {
    id: 'challenging-negative-thinking',
    title: 'Challenging Negative Thinking',
    description: 'Learn evidence-based cognitive restructuring to challenge negative beliefs and automatic thoughts.',
    difficulty: DIFFICULTY.INTERMEDIATE,
    duration: 35,
    thumbnail: '',
    categoryId: CATEGORY_ID.CBT,
    lessonCount: 5,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 1,
    benefits: ['Identify automatic thoughts', 'Analyze evidence', 'Formulate balanced perspectives'],
    estimatedTime: '5 days'
  },
  {
    id: 'managing-anxiety',
    title: 'Managing Anxiety',
    description: 'Target somatic, emotional, and cognitive anxiety through targeted exposure and reframing.',
    difficulty: DIFFICULTY.INTERMEDIATE,
    duration: 40,
    thumbnail: '',
    categoryId: CATEGORY_ID.CBT,
    lessonCount: 5,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 2,
    benefits: ['Calm somatic anxiety', 'Identify anxiety triggers', 'Reframe catastrophic thinking'],
    estimatedTime: '5 days'
  },
  {
    id: 'emotional-regulation',
    title: 'Emotional Regulation',
    description: 'Navigate intense emotions without feeling overwhelmed or reacting impulsively.',
    difficulty: DIFFICULTY.ADVANCED,
    duration: 45,
    thumbnail: '',
    categoryId: CATEGORY_ID.CBT,
    lessonCount: 5,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 3,
    benefits: ['Identify primary emotions', 'Create a pause before reacting', 'De-escalate intense feelings'],
    estimatedTime: '5 days'
  },
  {
    id: 'building-confidence',
    title: 'Building Confidence',
    description: 'Silence your inner critic and reinforce positive core beliefs about yourself.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 30,
    thumbnail: '',
    categoryId: CATEGORY_ID.CBT,
    lessonCount: 5,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 4,
    benefits: ['Identify core beliefs', 'Acknowledge strengths', 'Silence the inner critic'],
    estimatedTime: '5 days'
  },
  {
    id: 'healthy-habits',
    title: 'Healthy Habits',
    description: 'Use behavioral activation and habit-building strategies to build consistency.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 30,
    thumbnail: '',
    categoryId: CATEGORY_ID.CBT,
    lessonCount: 5,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 5,
    benefits: ['Habit loop awareness', 'Small behavior shifts', 'Consistent daily practice'],
    estimatedTime: '5 days'
  },

  // ─── Breathing ─────────────────────────────────────────────────────
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    description: 'Regulate your autonomic nervous system using equal-count breath holding.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 15,
    thumbnail: '',
    categoryId: CATEGORY_ID.BREATHING,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 0,
    benefits: ['Regulate nervous system', 'Improve focus', 'Instant calm'],
    estimatedTime: '3 days'
  },
  {
    id: '4-7-8-breathing',
    title: '4-7-8 Breathing',
    description: 'Master the classic relaxing breath method designed to activate the parasympathetic system.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 15,
    thumbnail: '',
    categoryId: CATEGORY_ID.BREATHING,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 1,
    benefits: ['Reduce stress', 'Prepare for sleep', 'Lower heart rate'],
    estimatedTime: '3 days'
  },
  {
    id: 'calm-reset',
    title: 'Calm Reset',
    description: 'Quick breathing routines to quickly down-regulate stress levels in high-pressure moments.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 10,
    thumbnail: '',
    categoryId: CATEGORY_ID.BREATHING,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 2,
    benefits: ['Release physical tension', 'Slow down respiration', 'Mental clarity'],
    estimatedTime: '3 days'
  },
  {
    id: 'stress-relief-breathing',
    title: 'Stress Relief',
    description: 'Deeper breathing sessions for long-term reduction in chronic stress and physiological anxiety.',
    difficulty: DIFFICULTY.INTERMEDIATE,
    duration: 20,
    thumbnail: '',
    categoryId: CATEGORY_ID.BREATHING,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 3,
    benefits: ['Soothe sympathetic nervous system', 'Deep relaxation', 'Anxiety relief'],
    estimatedTime: '3 days'
  },
  {
    id: 'focus-breathing',
    title: 'Focus Breathing',
    description: 'Energising and balancing breathing exercises to improve focus, alertness, and mental stamina.',
    difficulty: DIFFICULTY.INTERMEDIATE,
    duration: 15,
    thumbnail: '',
    categoryId: CATEGORY_ID.BREATHING,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 4,
    benefits: ['Oxygenate brain', 'Alertness and concentration', 'Clear brain fog'],
    estimatedTime: '3 days'
  },
  {
    id: 'sleep-preparation',
    title: 'Sleep Preparation',
    description: 'Slowing down breathing patterns to cue the body for restorative, deep sleep.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 20,
    thumbnail: '',
    categoryId: CATEGORY_ID.BREATHING,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 5,
    benefits: ['Transition to sleep state', 'Deep slow breathing', 'Quiet the mind'],
    estimatedTime: '3 days'
  },

  // ─── Meditation ────────────────────────────────────────────────────
  {
    id: 'morning-calm',
    title: 'Morning Calm',
    description: 'Begin your day with grounding meditations to set positive intentions and improve presence.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 15,
    thumbnail: '',
    categoryId: CATEGORY_ID.MEDITATION,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 0,
    benefits: ['Set daily intentions', 'Mindful awakening', 'Grounding energy'],
    estimatedTime: '3 days'
  },
  {
    id: 'anxiety-relief-meditation',
    title: 'Anxiety Relief',
    description: 'Mindfulness practices specifically designed to create space around anxious feelings and stories.',
    difficulty: DIFFICULTY.INTERMEDIATE,
    duration: 25,
    thumbnail: '',
    categoryId: CATEGORY_ID.MEDITATION,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 1,
    benefits: ['Soften anxiety loops', 'Anchor in the present', 'Self-soothing'],
    estimatedTime: '3 days'
  },
  {
    id: 'better-sleep',
    title: 'Better Sleep',
    description: 'Wind down your body and mind with calming body scans and visualizations.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 30,
    thumbnail: '',
    categoryId: CATEGORY_ID.MEDITATION,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 2,
    benefits: ['Physical body release', 'Calm thoughts', 'Restful transition'],
    estimatedTime: '3 days'
  },
  {
    id: 'focus-training',
    title: 'Focus Training',
    description: 'Train your brain to anchor attention, recognize distraction, and return to focus.',
    difficulty: DIFFICULTY.ADVANCED,
    duration: 20,
    thumbnail: '',
    categoryId: CATEGORY_ID.MEDITATION,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 3,
    benefits: ['Strengthen attention span', 'Recognize distractions', 'Mental discipline'],
    estimatedTime: '3 days'
  },
  {
    id: 'self-compassion',
    title: 'Self Compassion',
    description: 'Cultivate friendliness and acceptance toward yourself, particularly in moments of struggle.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 20,
    thumbnail: '',
    categoryId: CATEGORY_ID.MEDITATION,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 4,
    benefits: ['Develop kind self-talk', 'Accept vulnerabilities', 'Empathy building'],
    estimatedTime: '3 days'
  },
  {
    id: 'mindfulness-basics',
    title: 'Mindfulness Basics',
    description: 'Learn the primary pillars of mindfulness: breathing, body awareness, and sensory connection.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 15,
    thumbnail: '',
    categoryId: CATEGORY_ID.MEDITATION,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 5,
    benefits: ['Understand mindfulness principles', 'Observe without judging', 'Sensory anchoring'],
    estimatedTime: '3 days'
  },

  // ─── Wellness Studio ───────────────────────────────────────────────
  {
    id: 'guided-journaling',
    title: 'Guided Journaling',
    description: 'Reflective prompts to untangle feelings, examine experiences, and build clarity.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 15,
    thumbnail: '',
    categoryId: CATEGORY_ID.WELLNESS,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 0,
    benefits: ['Clarify chaotic thoughts', 'Process emotions', 'Creative reflection'],
    estimatedTime: '3 days'
  },
  {
    id: 'gratitude-practice',
    title: 'Gratitude Practice',
    description: 'Rewire your focus toward the positive aspects of your life through active appreciation.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 10,
    thumbnail: '',
    categoryId: CATEGORY_ID.WELLNESS,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 1,
    benefits: ['Rewire neural focus to positive', 'Appreciate daily moments', 'Joy cultivation'],
    estimatedTime: '3 days'
  },
  {
    id: 'emotional-reflection',
    title: 'Emotional Reflection',
    description: 'Slow down and trace your emotions to identify patterns and develop healthy outlets.',
    difficulty: DIFFICULTY.INTERMEDIATE,
    duration: 20,
    thumbnail: '',
    categoryId: CATEGORY_ID.WELLNESS,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 2,
    benefits: ['Name complex feelings', 'Understand emotional patterns', 'Release suppressed energy'],
    estimatedTime: '3 days'
  },
  {
    id: 'goal-setting',
    title: 'Goal Setting',
    description: 'Align your goals with your core values and design achievable, motivating action plans.',
    difficulty: DIFFICULTY.INTERMEDIATE,
    duration: 20,
    thumbnail: '',
    categoryId: CATEGORY_ID.WELLNESS,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 3,
    benefits: ['Define values-aligned goals', 'Action planning', 'Habit scheduling'],
    estimatedTime: '3 days'
  },
  {
    id: 'weekly-review',
    title: 'Weekly Review',
    description: 'Establish accountability with weekly audits of your emotional state and achievements.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 25,
    thumbnail: '',
    categoryId: CATEGORY_ID.WELLNESS,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 4,
    benefits: ['Track habits and progress', 'Reflect on wins and challenges', 'Plan next week'],
    estimatedTime: '3 days'
  },
  {
    id: 'daily-reset',
    title: 'Daily Reset',
    description: 'Fast, daily checkpoints to re-ground yourself, clarify intentions, and release stress.',
    difficulty: DIFFICULTY.BEGINNER,
    duration: 10,
    thumbnail: '',
    categoryId: CATEGORY_ID.WELLNESS,
    lessonCount: 3,
    status: PROGRAM_STATUS.NOT_STARTED,
    sortOrder: 5,
    benefits: ['Quick mental check-in', 'Re-align focus', 'Somatic grounding'],
    estimatedTime: '3 days'
  }
];

// ─── Custom Lesson Content Database (Sprint 4.9 Content Quality Review) ───
interface LessonContentInput {
  title: string;
  description: string;
  introduction: string;
  learningObjective: string;
  reflectionPrompt: string;
  completionSummary: string;
  duration?: number;
}

const LESSON_CONTENT: Record<string, LessonContentInput[]> = {
  // CBT Programs
  'understanding-thoughts': [
    {
      title: 'What are thoughts?',
      description: 'Learn to observe your thoughts as temporary mental events, not absolute facts.',
      introduction: 'Welcome! Today we begin by observing the voice in our head. **Thoughts are not facts**—they are simply mental occurrences that come and go.',
      learningObjective: 'Observe your automatic thoughts without immediately reacting or accepting them as truth.',
      reflectionPrompt: 'What is one automatic thought you noticed today? Was it a fact or an opinion?',
      completionSummary: 'Wonderful start! By observing your thoughts with healthy distance, you\'re building mental flexibility. ✨'
    },
    {
      title: 'The Thinking Loop',
      description: 'Explore the cognitive loop: how thoughts influence feelings and drive behaviors.',
      introduction: 'Welcome back. Today we map the **CBT triangle**. A single automatic thought can trigger a wave of emotions and subsequent behaviors.',
      learningObjective: 'Identify and diagram a thought loop (Situation -> Thought -> Emotion -> Behavior) from your day.',
      reflectionPrompt: 'Describe a situation today where a thought quickly escalated your emotions. What was the loop?',
      completionSummary: 'Great work. Recognizing these loops is the essential first step to breaking negative cycles. 💜'
    },
    {
      title: 'Thoughts vs Facts',
      description: 'Learn to separate objective facts from subjective cognitive interpretations.',
      introduction: 'Today we focus on objectivity. The mind often presents **opinions as facts**. We will learn to test their validity.',
      learningObjective: 'Distinguish objective reality (what a camera would record) from your subjective interpretation.',
      reflectionPrompt: 'List a thought that felt like a fact today. What makes it just an interpretation?',
      completionSummary: 'Excellent! Separating interpretations from facts creates the space needed for balanced choices. 🌱'
    },
    {
      title: 'Identifying Triggers',
      description: 'Identify the external situations or internal states that trigger automatic thoughts.',
      introduction: 'Welcome to Lesson 4. **Triggers** are the cues that start our automatic thinking loops. Today, we learn to spot them early.',
      learningObjective: 'Locate environmental, social, or physiological cues that initiate your automatic thought patterns.',
      reflectionPrompt: 'What external trigger or physical sensation did you identify today? How did your mind respond?',
      completionSummary: 'Great tracking! Recognizing triggers prepares you to respond mindfully instead of reacting impulsively. ✨'
    },
    {
      title: 'Integration',
      description: 'Consolidate your observation tools and establish a daily practice of thought awareness.',
      introduction: 'In this final lesson, we bring everything together. We combine **noticing thoughts**, **mapping loops**, and **spotting triggers**.',
      learningObjective: 'Synthesize your new tools to maintain daily cognitive awareness and self-compassion.',
      reflectionPrompt: 'How has observing your thoughts changed your overall relationship with stress this week?',
      completionSummary: 'Congratulations on completing this program! You now have a foundational toolkit for cognitive resilience. 🌟'
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
  'managing-anxiety': [
    {
      title: 'Understanding Anxiety',
      description: 'Learn how anxiety functions in the brain and body as a protective mechanism.',
      introduction: 'Anxiety is a physical alarm system. Today we learn how **fight-or-flight** works and why your body reacts the way it does.',
      learningObjective: 'Understand the biological basis of anxiety and recognize it as a safety signal rather than a danger.',
      reflectionPrompt: 'How does knowing anxiety is a misfired safety alarm change how you view your anxious feelings?',
      completionSummary: 'Great work. Demystifying anxiety reduces the fear of the feeling itself. 😌'
    },
    {
      title: 'Physical Sensations',
      description: 'Recognize somatic anxiety symptoms and learn to observe them without fear.',
      introduction: 'Anxiety speaks through the body. Today we focus on **observing somatic signals**—like a racing heart or tight chest—without panic.',
      learningObjective: 'Locate and sit with physical sensations of anxiety, describing them objectively without judgment.',
      reflectionPrompt: 'Where in your body do you feel anxiety most strongly? How does it feel when you just observe it?',
      completionSummary: 'Amazing bravery. Sitting with physical sensations helps your nervous system realize it is safe. 💜'
    },
    {
      title: 'Grounding Somatic Panic',
      description: 'Master somatic grounding techniques to stabilize your nervous system in high-stress moments.',
      introduction: 'When anxiety surges, we need to anchor ourselves. Today we practice **somatic grounding** to bring attention back to the present.',
      learningObjective: 'Apply the 5-4-3-2-1 sensory grounding technique to anchor your focus in the physical environment.',
      reflectionPrompt: 'Which of the five senses helped ground you the most during today\'s practice?',
      completionSummary: 'Grounded and steady. You can return to this anchor whenever the mental storm gets too loud. 🌙'
    },
    {
      title: 'Cognitive Restructuring',
      description: 'Apply cognitive restructuring to catastrophic thoughts and worst-case scenarios.',
      introduction: 'Anxiety loves the worst-case scenario. Today we challenge **catastrophic thinking** by analyzing probability and coping capability.',
      learningObjective: 'Reframe "what-if" catastrophic thoughts by assessing realistic outcomes and your ability to cope.',
      reflectionPrompt: 'What is the actual, realistic probability of your worst-case scenario occurring? How would you cope?',
      completionSummary: 'Excellent reframing. Shifting from panic to preparation builds lasting confidence. ✨'
    },
    {
      title: 'Daily Coping Plan',
      description: 'Create a personalized anxiety response plan for stressful triggers.',
      introduction: 'We finish by building your **personal anxiety playbook**. We will outline exact actions to take when you feel anxiety rising.',
      learningObjective: 'Design a step-by-step coping plan combining somatic grounding, breathing, and cognitive reframing.',
      reflectionPrompt: 'What are the first three steps you will take the next time you feel anxiety taking over?',
      completionSummary: 'Congratulations on completing this program! You are now fully equipped to guide yourself back to calm. 🌟'
    }
  ],
  'emotional-regulation': [
    {
      title: 'Emotional Awareness',
      description: 'Learn to identify and accept primary emotions as temporary signals.',
      introduction: 'Emotions are raw data, not directives. Today we learn to **welcome and observe** primary emotional waves.',
      learningObjective: 'Identify your current primary emotion and observe its rise and fall without trying to change it.',
      reflectionPrompt: 'What primary emotion did you notice today? Where did you feel it in your body?',
      completionSummary: 'Beautiful awareness. Allowing emotions to exist without fighting them is the key to regulation. 🌱'
    },
    {
      title: 'Naming Complex Emotions',
      description: 'Expand your emotional vocabulary to increase self-understanding and control.',
      introduction: 'Vague feelings are hard to regulate. Today we **label complex emotions** with specificity to reduce their intense grip.',
      learningObjective: 'Translate general "bad" or "stressed" feelings into specific, nuanced emotional terms.',
      reflectionPrompt: 'What specific, secondary emotions (e.g. feeling unseen, disappointed, overwhelmed) did you uncover today?',
      completionSummary: 'Highly precise! Naming an emotion accurately acts as a natural neurological dimmer switch. 💜'
    },
    {
      title: 'Creating a Pause',
      description: 'Learn the STOP technique to create space between stimulus and response.',
      introduction: 'Between stimulus and response, there is a space. Today we master the **STOP technique** to lengthen that space.',
      learningObjective: 'Practice pausing (Stop, Take a breath, Observe, Proceed) before reacting to emotional triggers.',
      reflectionPrompt: 'In what daily situation could you apply the STOP technique to prevent impulsive reactions?',
      completionSummary: 'A powerful pause. This small gap is where your freedom to choose a response lives. ✨'
    },
    {
      title: 'De-escalating Intensity',
      description: 'Discover somatic and cognitive strategies to lower emotional arousal.',
      introduction: 'When emotional intensity is high, logic goes offline. Today we practice **de-escalation tools** to cool down your nervous system.',
      learningObjective: 'Use physical resets and paced respiration to lower high emotional arousal in real-time.',
      reflectionPrompt: 'Which de-escalation tool (e.g., cold water, paced breathing, changing environment) works best for you?',
      completionSummary: 'Cooled down and centered. You\'ve learned to de-escalate the fire before it spreads. 😌'
    },
    {
      title: 'Emotional Balance',
      description: 'Synthesize your regulation skills to maintain stability through life\'s ups and downs.',
      introduction: 'We conclude by integrating all tools to foster **emotional balance** and dialectical thinking—accepting emotions while taking action.',
      learningObjective: 'Integrate emotional labeling, pausing, and physical resets into a unified daily regulation strategy.',
      reflectionPrompt: 'How will you combine awareness and action to stay balanced during stressful weeks?',
      completionSummary: 'Congratulations! You have completed the Emotional Regulation program. You are the steady anchor in your own storm. 🌟'
    }
  ],
  'building-confidence': [
    {
      title: 'Self-Esteem Audit',
      description: 'Examine current self-beliefs and identify areas of critical self-talk.',
      introduction: 'Confidence starts with self-awareness. Today we audit the **beliefs you hold about yourself** and identify the inner critic\'s voice.',
      learningObjective: 'Audit your current self-evaluation and locate where negative self-talk is most prominent.',
      reflectionPrompt: 'What is one critical statement your inner voice frequently tells you? Where does it come from?',
      completionSummary: 'Honest and insightful. Exposing the inner critic is the first step to silencing it. ✨'
    },
    {
      title: 'Quieting the Critic',
      description: 'Develop self-compassion tools to counter harsh self-criticism.',
      introduction: 'Your inner critic is not objective. Today we practice **quieting the critic** using supportive, compassionate reframing.',
      learningObjective: 'Respond to a critical self-thought with the same warmth and evidence you would offer to a close friend.',
      reflectionPrompt: 'How would you rephrase your critic\'s harshest comment in a supportive, constructive way?',
      completionSummary: 'So much gentler. You deserve the same kindness you so freely give to others. 💜'
    },
    {
      title: 'Strengths Spotting',
      description: 'Identify and anchor your sense of self in personal strengths and values.',
      introduction: 'We often focus on our deficits. Today we focus on **strengths spotting**—rediscovering your core competencies and resources.',
      learningObjective: 'Document three distinct personal strengths and recall times when you utilized them successfully.',
      reflectionPrompt: 'Which of your core strengths did you highlight today? How has it helped you in the past?',
      completionSummary: 'Strong and capable. Remembering your strengths builds a solid foundation for confidence. 🌱'
    },
    {
      title: 'Affirming Values',
      description: 'Connect your daily actions to your core values to reinforce self-worth.',
      introduction: 'True confidence is value-driven, not performance-driven. Today we **clarify your core values** and align self-worth with them.',
      learningObjective: 'Identify your top three core values and design one simple action that reflects them.',
      reflectionPrompt: 'How does aligning your self-worth with your core values protect you from external criticism?',
      completionSummary: 'Values-centered. When you know what you stand for, confidence flows naturally. ✨'
    },
    {
      title: 'Stepping Confidently',
      description: 'Practice taking small, value-aligned risks to reinforce self-efficacy.',
      introduction: 'Confidence is built through action. In this final lesson, we plan a **courageous step** to reinforce your belief in yourself.',
      learningObjective: 'Commit to one micro-challenge or boundary-setting action that aligns with your values.',
      reflectionPrompt: 'What micro-challenge will you tackle tomorrow to practice stepping confidently?',
      completionSummary: 'Congratulations! You\'ve completed the Building Confidence program. Walk tall—you\'ve got this. 🌟'
    }
  ],
  'healthy-habits': [
    {
      title: 'Habit Cycles',
      description: 'Understand the neurological cue-routine-reward habit loop.',
      introduction: 'Habits shape our lives. Today we explore the **habit loop** (Cue -> Routine -> Reward) and map your existing routines.',
      learningObjective: 'Map the neurological loop of one positive habit and one negative habit in your life.',
      reflectionPrompt: 'What is the specific cue and reward for the daily habit you mapped today?',
      completionSummary: 'Brilliant analysis. Understanding the loop is key to redesigning your behavior. 🌱'
    },
    {
      title: 'Trigger Hacking',
      description: 'Optimize your environment to make good habits easy and bad habits difficult.',
      introduction: 'Environment dictates behavior. Today we look at **trigger hacking**—changing your environment to support your goals.',
      learningObjective: 'Modify your physical or digital surroundings to reduce triggers for bad habits and make good cues visible.',
      reflectionPrompt: 'What changes did you make to your environment today to make your positive habit easier?',
      completionSummary: 'Environment optimized! Designing your space removes friction and supports consistency. ✨'
    },
    {
      title: 'Micro-Commitments',
      description: 'Use the 2-minute rule to start new habits without resistance.',
      introduction: 'Starting is the hardest part. Today we practice **micro-commitments**—scaling habits down to a 2-minute version.',
      learningObjective: 'Define a 2-minute version of your target habit to eliminate friction and build initial momentum.',
      reflectionPrompt: 'What is the 2-minute version of the habit you want to establish?',
      completionSummary: 'Consistency over intensity. Starting small makes it impossible to say no. 💜'
    },
    {
      title: 'Habit Stacking',
      description: 'Anchor new habits onto established daily routines to automate consistency.',
      introduction: 'Build on what already works. Today we practice **habit stacking**—anchoring a new habit directly onto a current routine.',
      learningObjective: 'Create a habit stacking formula: "After I [current habit], I will [new habit]."',
      reflectionPrompt: 'Write down your habit stacking formula. How does it leverage your existing routine?',
      completionSummary: 'Perfect stack. Linking behaviors creates a natural flow in your day. ✨'
    },
    {
      title: 'Consistency Mindset',
      description: 'Learn to bounce back from setbacks and maintain long-term habit systems.',
      introduction: 'Consistency is not about perfection; it\'s about resilience. Today we learn how to **never miss twice**.',
      learningObjective: 'Develop a recovery plan for when you inevitably miss a day, ensuring long-term consistency.',
      reflectionPrompt: 'How will you respond to your next habit setback with compassion and immediate action?',
      completionSummary: 'Congratulations! You have completed the Healthy Habits program. Systemized habits build your wellness future. 🌟'
    }
  ],

  // Breathing Programs
  'box-breathing': [
    {
      title: 'Box Breathing Basics',
      description: 'Learn the foundational 4-second equal-count breathing cycle.',
      introduction: 'Welcome. Today we learn **Box Breathing**, a technique used to rapidly calm the nervous system.',
      learningObjective: 'Establish a steady rhythm of 4-second inhale, hold, exhale, and empty hold.',
      reflectionPrompt: 'How did your physical tension change during this session?',
      completionSummary: 'Great job! You\'ve completed the Box Breathing Basics. 😌'
    },
    {
      title: 'Deepening the Box',
      description: 'Extend your breath capacity and hold time to increase autonomic control.',
      introduction: 'Welcome back. Today we extend the breath hold to deepen relaxation and balance carbon dioxide levels.',
      learningObjective: 'Practice box breathing with sustained, relaxed holds to train respiratory efficiency.',
      reflectionPrompt: 'Did you feel any urge to gasp, and how did you manage it with calm focus?',
      completionSummary: 'Beautiful focus. Extending the hold trains autonomic resilience. 🌙'
    },
    {
      title: 'Everyday Calming',
      description: 'Integrate box breathing into high-pressure moments in your daily life.',
      introduction: 'Box breathing is a superpower in stressful situations. Today we practice applying it dynamically.',
      learningObjective: 'Apply box breathing while visualizing a stressful event to build stress resistance.',
      reflectionPrompt: 'In what upcoming daily scenario will you use box breathing to stay calm?',
      completionSummary: 'Fantastic! You have completed the Box Breathing program. Calm is in your control. 🌟'
    }
  ],
  '4-7-8-breathing': [
    {
      title: '4-7-8 Foundations',
      description: 'Master the relaxing ratio designed to activate the parasympathetic system.',
      introduction: 'Welcome to the classic sleep and anxiety-relief breath: **4-7-8 Breathing**. Let\'s learn the ratio.',
      learningObjective: 'Learn the exact ratio: 4s inhale, 7s hold, 8s audible exhalation.',
      reflectionPrompt: 'How did the long 8-second sigh affect your muscle tension?',
      completionSummary: 'Excellent foundation! The parasympathetic system is starting to activate. 😌'
    },
    {
      title: 'Nervous System Tuning',
      description: 'Use the 4-7-8 breath to down-regulate physiological stress.',
      introduction: 'Today we use 4-7-8 to tune your nervous system, slowing heart rate and lowering blood pressure.',
      learningObjective: 'Complete multiple cycles of 4-7-8 breathing to deeply down-regulate body tension.',
      reflectionPrompt: 'Did you notice a slowing of your heart rate or thoughts during today\'s practice?',
      completionSummary: 'Wonderfully tuned. You are retraining your body to enter deep relaxation on command. 💜'
    },
    {
      title: 'Sleep Aid Breathing',
      description: 'Apply the 4-7-8 technique as a pre-sleep routine to quiet the mind.',
      introduction: 'In this final lesson, we establish 4-7-8 breathing as a bedtime or wind-down routine.',
      learningObjective: 'Transition your body into a deep rest state ready for high-quality, restorative sleep.',
      reflectionPrompt: 'How will you incorporate 4-7-8 into your nightly wind-down ritual?',
      completionSummary: 'Congratulations! You have completed the 4-7-8 Breathing program. Rest deeply. 🌙'
    }
  ],
  'calm-reset': [
    {
      title: 'Grounding Resets',
      description: 'Quick somatic breathing to reset during transitions.',
      introduction: 'Transitions between tasks can carry residual stress. Today we learn a **quick grounding reset**.',
      learningObjective: 'Reset physiological activation in under three minutes during your day.',
      reflectionPrompt: 'How did a brief pause help reset your mental posture?',
      completionSummary: 'Grounded and ready. A clean transition makes a productive day. ✨'
    },
    {
      title: 'Rapid De-escalation',
      description: 'Use extended exhales to quickly cool down high-stress moments.',
      introduction: 'When stress spikes, lengthen your exhale. Today we focus on **rapid physiological de-escalation**.',
      learningObjective: 'Lower acute stress indicators (racing heart, shallow breath) using 1:2 ratio breathing.',
      reflectionPrompt: 'How quickly did your physiological state calm down during the extended exhales?',
      completionSummary: 'De-escalated successfully. You\'ve mastered the autonomic brake. 😌'
    },
    {
      title: 'Steady Grounding',
      description: 'Build a solid, daily somatic anchor using resonant frequency breathing.',
      introduction: 'Consistency build stamina. Today we lock in a **steady grounding practice** to anchor your week.',
      learningObjective: 'Maintain a coherent, balanced breathing rhythm for sustained focus and calm.',
      reflectionPrompt: 'How does somatic grounding support your mental clarity today?',
      completionSummary: 'Congratulations! You have completed the Calm Reset program. Steady as you go. 🌟'
    }
  ],
  'stress-relief-breathing': [
    {
      title: 'Deep Calm Breath',
      description: 'Diaphragmatic breathing to reverse chronic chest-breathing habits.',
      introduction: 'Stress makes us breathe shallowly from the chest. Today we learn **deep diaphragmatic breathing**.',
      learningObjective: 'Engage the diaphragm to maximize oxygen exchange and signal safety to the brain.',
      reflectionPrompt: 'How did breathing deeply into your abdomen feel compared to chest breathing?',
      completionSummary: 'Deeply calming. Diaphragmatic breathing is the foundation of somatic wellness. 🌱'
    },
    {
      title: 'Relaxing Respiration',
      description: 'Paced breathing to balance carbon dioxide and soothe physiological anxiety.',
      introduction: 'Welcome back. Today we practice paced breathing at 6 breaths per minute to balance your physiology.',
      learningObjective: 'Maintain a slow, comfortable respiration pace to balance your blood chemistry.',
      reflectionPrompt: 'How did the steady, slow pacing affect your busy mind?',
      completionSummary: 'Beautifully relaxed. Resonant breathing helps harmonize your heart and brain. 💜'
    },
    {
      title: 'Quiet Mind Techniques',
      description: 'Consolidate slow, deep breathing to silence mental chatter.',
      introduction: 'We conclude by combining diaphragmatic depth and slow pacing to **quiet the mind**.',
      learningObjective: 'Achieve a state of physiological coherence that naturally silences overthinking.',
      reflectionPrompt: 'What mental clarity did you experience after today\'s breathing session?',
      completionSummary: 'Congratulations! You have completed the Stress Relief program. Carry this quiet space with you. 🌟'
    }
  ],
  'focus-breathing': [
    {
      title: 'Focus Resets',
      description: 'Energize your brain and clear fatigue with rhythmic activation breathing.',
      introduction: 'Fatigued? Today we use active, rhythmic breathing to **invigorate the mind** and oxygenate cells.',
      learningObjective: 'Clear brain fog and increase subjective alertness using active respiration.',
      reflectionPrompt: 'How did your energy level shift during the active breathing cycles?',
      completionSummary: 'Energized and focused. Clear away the fog and step into clarity. 🚀'
    },
    {
      title: 'Mind Energizer',
      description: 'Practice the bellows breath (Bhastrika) to boost attention and clarity.',
      introduction: 'Bhastrika, or bellows breath, is a powerful energizer. Today we practice it safely.',
      learningObjective: 'Generate clean energy and focus using structured, active diaphragmatic breaths.',
      reflectionPrompt: 'Did you feel a sense of warmth or alertness? Describe your experience.',
      completionSummary: 'Mind fully energized. You\'ve unlocked a natural, caffeine-free focus boost. ✨'
    },
    {
      title: 'Alert Mind Practice',
      description: 'Combine energizing breathing with focus anchoring for mental endurance.',
      introduction: 'We finish by combining energizing breathing with focus exercises for **maximum mental stamina**.',
      learningObjective: 'Synthesize physiological arousal with attentional control for peak performance.',
      reflectionPrompt: 'How will you use this focus routine before your next complex task?',
      completionSummary: 'Congratulations! You have completed the Focus Breathing program. Stay sharp. 🌟'
    }
  ],
  'sleep-preparation': [
    {
      title: 'Unwinding Breath',
      description: 'Slow down respiration to release physiological tension from the day.',
      introduction: 'Let go of the day. Today we use slow, gentle breathing to **unwind somatic tension**.',
      learningObjective: 'Soothe your autonomic system to prepare your body for natural transitions into rest.',
      reflectionPrompt: 'What muscle group did you feel release tension during the unwinding breaths?',
      completionSummary: 'Wonderfully unwound. Your body is starting to prepare for rest. 😌'
    },
    {
      title: 'Sleep Activation',
      description: 'Slightly longer exhalations to trigger the sleep centers of the brain.',
      introduction: 'Sleep is a parasympathetic state. Today we lengthen the exhale to **activate sleep chemistry**.',
      learningObjective: 'Cue the brain for deep sleep using slow, silent, extended exhalations.',
      reflectionPrompt: 'How relaxed do you feel on a scale of 1-10 after today\'s practice?',
      completionSummary: 'Deeply relaxed. The mind is settling, and the body is ready for restoration. 🌙'
    },
    {
      title: 'Nighttime Transition',
      description: 'A complete breathing routine to transition from active day to restorative sleep.',
      introduction: 'In our final lesson, we establish your bedtime transition routine to **ensure restorative sleep**.',
      learningObjective: 'Establish a seamless sleep-onset routine using breathing as your primary somatic cue.',
      reflectionPrompt: 'Write down a commitment to your sleep health tonight. How will you wind down?',
      completionSummary: 'Congratulations! You have completed the Sleep Preparation program. Sleep well. 😌'
    }
  ],

  // Meditation Programs
  'morning-calm': [
    {
      title: 'Mindful Waking',
      description: 'Ground yourself immediately after waking to start the day with presence.',
      introduction: 'Good morning. Before checking notifications, let\'s ground ourselves in the **physical presence** of a new day.',
      learningObjective: 'Anchor attention in somatic sensations to start the day centered.',
      reflectionPrompt: 'How does checking in with your body before your phone change your morning energy?',
      completionSummary: 'A beautiful morning start. Present and awake. 🌟'
    },
    {
      title: 'Intention Setting',
      description: 'Clarify how you want to show up today and align your mind with your values.',
      introduction: 'Intentions guide our actions. Today we dedicate our meditation to **setting positive, value-aligned intentions**.',
      learningObjective: 'Formulate a clear, personal intention statement to guide your decisions today.',
      reflectionPrompt: 'What is your core intention for today? How will you remind yourself of it?',
      completionSummary: 'Intention set. Let your values lead the way today. ✨'
    },
    {
      title: 'Radiant Day Starter',
      description: 'Cultivate gratitude and energy to meet the day\'s opportunities with confidence.',
      introduction: 'Start with abundance. Today we meditate on **appreciation and self-efficacy** to start the day strong.',
      learningObjective: 'Generate positive mental energy and resilience through active appreciation.',
      reflectionPrompt: 'What are you most excited to bring your energy to today?',
      completionSummary: 'Congratulations! You have completed the Morning Calm program. Have a radiant day. 🚀'
    }
  ],
  'anxiety-relief-meditation': [
    {
      title: 'Anchoring in Chaos',
      description: 'Locate a stable physical anchor in your body to return to when anxious.',
      introduction: 'Anxiety is a storm. Today we locate your **somatic anchor**—a physical sensation that remains stable.',
      learningObjective: 'Establish a reliable physical focal point (e.g., soles of feet, breathing) to anchor attention.',
      reflectionPrompt: 'Where did you find your most reliable physical anchor today?',
      completionSummary: 'Anchored and secure. You can return to this anchor whenever the storm surges. 😌'
    },
    {
      title: 'Observing Anxiety',
      description: 'Practice observing anxious thoughts as passing clouds rather than identifying with them.',
      introduction: 'You are the sky, not the clouds. Today we practice **observing thoughts and feelings** with non-judgmental distance.',
      learningObjective: 'Develop cognitive defusion—observing anxiety as a temporary mental event, not who you are.',
      reflectionPrompt: 'How did it feel to observe anxiety as something you *experience* rather than *are*?',
      completionSummary: 'Beautifully detached. Creating space around anxiety weakens its power. 💜'
    },
    {
      title: 'Gentle Releasing',
      description: 'Softly release physical resistance to anxious feelings to allow them to pass.',
      introduction: 'Resistance amplifies pain. Today we practice **softening and releasing physical resistance** to anxiety.',
      learningObjective: 'Relax muscle tension around anxious sensations to allow them to flow and dissipate.',
      reflectionPrompt: 'What physical area did you soften today? Did the emotional intensity shift?',
      completionSummary: 'Congratulations! You have completed the Anxiety Relief program. Float, don\'t fight. 🌟'
    }
  ],
  'better-sleep': [
    {
      title: 'Sleep Body Scan',
      description: 'Progressively relax body parts to trigger somatic sleep readiness.',
      introduction: 'Welcome. Lie down and let\'s perform a **somatic body scan** to release physical tension from the day.',
      learningObjective: 'Release muscle tension sequentially from head to toe to signal safety to the brain.',
      reflectionPrompt: 'Which part of your body held the most tension today, and did it release?',
      completionSummary: 'Relaxed and heavy. The body is ready to sleep. 😌'
    },
    {
      title: 'Let Thoughts Go',
      description: 'Use mental imagery to let active thoughts float away without engagement.',
      introduction: 'An active mind prevents sleep. Today we use **calming imagery** to let thoughts float away.',
      learningObjective: 'Practice mental defusion, letting worries drift by like leaves on a river.',
      reflectionPrompt: 'What visual metaphor worked best to help you let go of active thoughts?',
      completionSummary: 'Quiet and peaceful. The mental noise is fading. 🌙'
    },
    {
      title: 'Deep Resting',
      description: 'Settle into a deep state of non-sleep deep rest (NSDR) to transition into sleep.',
      introduction: 'Allow yourself to fully surrender. Today we practice **deep rest integration** for smooth sleep onset.',
      learningObjective: 'Enter a state of deep somatic relaxation and mental stillness, letting sleep happen naturally.',
      reflectionPrompt: 'Commit to letting sleep arrive on its own terms tonight. How does that feel?',
      completionSummary: 'Congratulations! You have completed the Better Sleep program. Goodnight. 😌'
    }
  ],
  'focus-training': [
    {
      title: 'Attention Anchoring',
      description: 'Develop focus stamina by keeping attention fixed on a single object.',
      introduction: 'Attention is a muscle. Today we train **attention anchoring** using the breath as our focus point.',
      learningObjective: 'Keep attention fixed on a single somatic sensation for increasing intervals.',
      reflectionPrompt: 'How many times did you notice your attention drift today?',
      completionSummary: 'Great focus training! Every drift noticed is a rep in your attention workout. 🚀'
    },
    {
      title: 'Distraction Noticing',
      description: 'Recognize distractions without self-blame and return gently to the anchor.',
      introduction: 'Drifting is natural. Today we practice **distraction noticing**—simply labeling distractions and returning.',
      learningObjective: 'Label distractions neutrally (e.g., "thinking", "planning") and redirect focus without judgment.',
      reflectionPrompt: 'How did labeling distractions neutrally change your emotional response to drifting?',
      completionSummary: 'Brilliant discipline. Gently returning is the core of focus training. ✨'
    },
    {
      title: 'Mind Strengthening',
      description: 'Maintain focus through longer sessions to build daily attention stamina.',
      introduction: 'Let\'s build endurance. Today we enter a **sustained focus practice** to lock in your training.',
      learningObjective: 'Maintain attention coherence over a longer period, building focus stamina.',
      reflectionPrompt: 'What strategies helped you maintain focus during the longer stretches?',
      completionSummary: 'Congratulations! You have completed the Focus Training program. Mind strong and clear. 🌟'
    }
  ],
  'self-compassion': [
    {
      title: 'Loving-Kindness Intro',
      description: 'Cultivate friendly, accepting attitudes toward yourself and your struggles.',
      introduction: 'We are often our own harshest critics. Today we introduce **Loving-Kindness (Metta)** to cultivate self-support.',
      learningObjective: 'Offer supportive, warm phrases (May I be safe, happy, at ease) to yourself.',
      reflectionPrompt: 'How did offering kindness to yourself make you feel compared to critical self-talk?',
      completionSummary: 'Warm and supportive. You deserve your own kindness. 💜'
    },
    {
      title: 'Softening Self-Talk',
      description: 'Identify critical self-judgment and actively replace it with self-compassion.',
      introduction: 'Welcome back. Today we locate our critical inner voice and practice **softening self-talk** with empathy.',
      learningObjective: 'Reflect on a setback and write a compassionate response to yourself, acknowledging common humanity.',
      reflectionPrompt: 'What compassionate phrase did you write to yourself today? How did it resonate?',
      completionSummary: 'Gently reframed. Treating yourself as a friend is a superpower. 🌱'
    },
    {
      title: 'Embracing Imperfections',
      description: 'Accept personal flaws as part of the shared human experience.',
      introduction: 'To err is human. Today we practice **embracing imperfections** and realizing we are not alone in struggling.',
      learningObjective: 'Integrate self-kindness and common humanity to accept personal limitations without shame.',
      reflectionPrompt: 'What imperfection did you sit with today? How can you show it some kindness?',
      completionSummary: 'Congratulations! You have completed the Self Compassion program. Walk in peace. 🌟'
    }
  ],
  'mindfulness-basics': [
    {
      title: 'Observing Breath',
      description: 'Establish the core practice of observing the breath without controlling it.',
      introduction: 'Welcome to the foundation. Today we learn to **observe the breath** simply as it is, without trying to change it.',
      learningObjective: 'Observe the raw sensations of respiration without interference or judgment.',
      reflectionPrompt: 'Did you feel an urge to control your breathing? How did you practice letting go?',
      completionSummary: 'Foundational step complete. You are learning to observe reality as it is. 😌'
    },
    {
      title: 'Body Awareness',
      description: 'Practice somatic mindfulness to anchor attention in physical sensations.',
      introduction: 'Your body is always in the present. Today we practice **somatic mindfulness** to ground ourselves in physical reality.',
      learningObjective: 'Perform a gentle body check-in to observe somatic temperature, pressure, and contact.',
      reflectionPrompt: 'What did you notice about your posture or body weight during the check-in?',
      completionSummary: 'Grounded and somatic. Connect with the body to silence the busy mind. 💜'
    },
    {
      title: 'Living Mindfully',
      description: 'Bring mindful presence into routine daily activities.',
      introduction: 'Meditation is training for life. Today we learn to **bring presence into routine actions**.',
      learningObjective: 'Design a plan to perform one routine daily task (eating, walking) with full sensory presence.',
      reflectionPrompt: 'Which daily activity will you practice with complete mindfulness tomorrow?',
      completionSummary: 'Congratulations! You have completed the Mindfulness Basics program. Live in the now. 🌟'
    }
  ],

  // Wellness Studio Programs
  'guided-journaling': [
    {
      title: 'Stream of Consciousness',
      description: 'Untangle chaotic thoughts by writing freely without filtering or editing.',
      introduction: 'Empty your mind. Today we practice **stream of consciousness writing** to clear mental clutter.',
      learningObjective: 'Write continuously for five minutes, releasing thoughts onto the page without editing.',
      reflectionPrompt: 'What recurring theme or worry did you clear from your mind today?',
      completionSummary: 'Clutter cleared. A blank page leads to a clear mind. ✨'
    },
    {
      title: 'Emotional Labeling',
      description: 'Write about complex emotions and trace them to specific boundaries or needs.',
      introduction: 'Unpack your feelings. Today we write to **label emotions** and discover what needs they highlight.',
      learningObjective: 'Identify a strong emotion from today, trace its origin, and write down the boundaries it points to.',
      reflectionPrompt: 'What emotional trigger or boundary need did your writing uncover today?',
      completionSummary: 'Incredibly insightful. Writing is a mirror to your inner wisdom. 💜'
    },
    {
      title: 'Future Scripting',
      description: 'Write about your future self to clarify values and near-term aspirations.',
      introduction: 'Design your path. Today we practice **future scripting** to align your current habits with your goals.',
      learningObjective: 'Write a vivid description of your ideal day six months from now, focusing on character and wellness.',
      reflectionPrompt: 'What is one micro-habit your future self performs that you can start today?',
      completionSummary: 'Congratulations! You have completed the Guided Journaling program. Write your own story. 🌟'
    }
  ],
  'gratitude-practice': [
    {
      title: 'Daily Three Blessings',
      description: 'Train your brain to scan for positive variables by documenting daily wins.',
      introduction: 'Rewire your focus. Today we document **three specific positives** from your last 24 hours.',
      learningObjective: 'Locate and describe three positive daily occurrences, noting why they happened.',
      reflectionPrompt: 'What was the most unexpected positive moment you recorded today?',
      completionSummary: 'Rewired for joy. Gratitude is a muscle that gets stronger with every list. 🌟'
    },
    {
      title: 'Micro-Gratitudes',
      description: 'Find appreciation in small, routine things to cultivate everyday joy.',
      introduction: 'Appreciate the small. Today we focus on **micro-gratitudes**—small things like hot coffee or a warm bed.',
      learningObjective: 'Identify three ordinary sensory pleasures from today and describe their value.',
      reflectionPrompt: 'What ordinary, daily detail did you appreciate today that you usually ignore?',
      completionSummary: 'Beautifully present. Joy is hidden in the ordinary moments. ✨'
    },
    {
      title: 'Compassionate Appreciation',
      description: 'Express gratitude for key people and supportive relationships in your life.',
      introduction: 'Gratitude is relational. Today we practice **relational appreciation**—focusing on people who support you.',
      learningObjective: 'Reflect on a person who has made a positive impact on your life and write a brief appreciation statement.',
      reflectionPrompt: 'Who did you focus on today? How does reflecting on them change your mood?',
      completionSummary: 'Congratulations! You have completed the Gratitude Practice program. Share the warmth. 🌟'
    }
  ],
  'emotional-reflection': [
    {
      title: 'Naming the Emotion',
      description: 'Slow down and trace your emotions to identify patterns and develop healthy outlets.',
      introduction: 'Emotions carry messages. Today we practice **naming the emotion** to understand its message.',
      learningObjective: 'Translate a vague physical sensation into a specific, named emotional state.',
      reflectionPrompt: 'What emotion did you name today? What is it trying to tell you?',
      completionSummary: 'Clear and aware. Emotions understood are emotions regulated. 💜'
    },
    {
      title: 'Tracking Triggers',
      description: 'Observe how specific events or environments affect your mood states.',
      introduction: 'Welcome back. Today we write to **track triggers**—mapping our external events to our inner emotions.',
      learningObjective: 'List three emotional shifts from today and link them to their external or somatic trigger.',
      reflectionPrompt: 'What trigger-to-mood connection did you discover today?',
      completionSummary: 'Excellent tracking. Knowing the trigger gives you the choice of response. 🌱'
    },
    {
      title: 'Emotional Release',
      description: 'Write to release suppressed feelings and outline healthy behavioral outlets.',
      introduction: 'Release the pressure. Today we write to **express suppressed feelings** and plan constructive outlets.',
      learningObjective: 'Identify a lingering frustration or worry, write it down fully, and define a healthy physical release.',
      reflectionPrompt: 'What physical or creative outlet will you use to release residual emotional energy tonight?',
      completionSummary: 'Congratulations! You have completed the Emotional Reflection program. Lighter and free. 🌟'
    }
  ],
  'goal-setting': [
    {
      title: 'Values Alignment',
      description: 'Align your goals with your core values and design achievable, motivating action plans.',
      introduction: 'Goals without values are hollow. Today we align your **personal goals with core values**.',
      learningObjective: 'Ensure your current focus goals are directly supporting a core personal value.',
      reflectionPrompt: 'What value does your primary goal support? Why does this matter to you?',
      completionSummary: 'Values aligned. You are building a life of purpose. ✨'
    },
    {
      title: 'Smart Habits',
      description: 'Break large values-aligned goals into small, trackable daily habits.',
      introduction: 'Goals are destinations; habits are the systems. Today we build **smart wellness habits**.',
      learningObjective: 'Translate a large value-aligned goal into a specific, daily habit statement.',
      reflectionPrompt: 'What specific daily habit will you track to progress towards your main goal?',
      completionSummary: 'System designed. Focus on the daily step, and the goal will take care of itself. 🌱'
    },
    {
      title: 'Progress Tracking',
      description: 'Establish accountability loops to measure your daily growth.',
      introduction: 'What gets measured gets managed. Today we build your **weekly habit progress check-in**.',
      learningObjective: 'Establish a clear, simple weekly review loop to audit your habit execution.',
      reflectionPrompt: 'How will you audit your habits weekly to maintain accountability?',
      completionSummary: 'Congratulations! You have completed the Goal Setting program. Systems ready. 🌟'
    }
  ],
  'weekly-review': [
    {
      title: 'Habit Check-in',
      description: 'Establish accountability with weekly audits of your emotional state and achievements.',
      introduction: 'Welcome to your weekly checkpoint. Let\'s **audit your habits and successes** from the past week.',
      learningObjective: 'Calculate habit consistency and document three key achievements from the week.',
      reflectionPrompt: 'What was your highest-performing habit this week? What made it succeed?',
      completionSummary: 'Successes documented. Celebrate your consistency, no matter how small. 💜'
    },
    {
      title: 'Lessons Learned',
      description: 'Evaluate weekly friction points and outline adjustments for next week.',
      introduction: 'Setbacks are data. Today we analyze **weekly struggles** and design modifications.',
      learningObjective: 'Identify the main source of stress or friction this week and write a specific adjustment.',
      reflectionPrompt: 'What friction point did you identify? How will you modify your plan to adapt?',
      completionSummary: 'Adjusted and prepared. Learning from friction is how we grow. 🌱'
    },
    {
      title: 'Intentional Next Week',
      description: 'Set clear, value-aligned objectives and habit targets for the upcoming week.',
      introduction: 'Design the week ahead. Today we set **clear habit targets and focus intentions** for next week.',
      learningObjective: 'Commit to three specific habit targets and one core focus value for the upcoming week.',
      reflectionPrompt: 'What is your core objective for next week? Write it as a commitment.',
      completionSummary: 'Congratulations! You have completed the Weekly Review program. Ready for growth. 🌟'
    }
  ],
  'daily-reset': [
    {
      title: 'Mid-Day Grounding',
      description: 'Fast, daily checkpoints to re-ground yourself, clarify intentions, and release stress.',
      introduction: 'Take a breath. Let\'s pause mid-day to **ground somatic energy** and clear morning stress.',
      learningObjective: 'Re-align attention and somatic posture in under three minutes.',
      reflectionPrompt: 'How did pausing mid-day help reset your physical tension?',
      completionSummary: 'Reset complete. Return to your day with clean presence. ✨'
    },
    {
      title: 'Stress Release Reset',
      description: 'Release daily mental and physical tension before transitioning to evening.',
      introduction: 'Transition mindfully. Let\'s **release work stress** before entering your evening space.',
      learningObjective: 'Audit somatic tension and release residual stressors using a physical write-off technique.',
      reflectionPrompt: 'Write down one work issue you are consciously parking for tomorrow. How does it feel?',
      completionSummary: 'Stress released. The evening is yours to enjoy. 😌'
    },
    {
      title: 'Evening Reflection',
      description: 'A gentle nightly review to clear thoughts and set intentions for restorative sleep.',
      introduction: 'Close the day. Let\'s perform a **gentle end-of-day reflection** to quiet the mind before bed.',
      learningObjective: 'Reflect on one win from today and set a soft intention for sleep and recovery.',
      reflectionPrompt: 'What is one thing that went well today? Write it down to close your day.',
      completionSummary: 'Congratulations! You have completed the Daily Reset program. Sleep in peace. 🌙'
    }
  ]
};

// Helper to generate lessons list
const lessons: Lesson[] = [];

// ─── Generate CBT Lessons ───────────────────────────────────────────
const cbtPrograms = [
  'understanding-thoughts',
  'challenging-negative-thinking',
  'managing-anxiety',
  'emotional-regulation',
  'building-confidence',
  'healthy-habits'
];

cbtPrograms.forEach((progId) => {
  const customLessons = LESSON_CONTENT[progId];
  if (customLessons) {
    customLessons.forEach((custom, idx) => {
      const order = idx + 1;
      const id = `${progId}-l${order}`;
      lessons.push({
        id,
        programId: progId,
        title: custom.title,
        description: custom.description,
        order,
        duration: custom.duration || 8,
        exerciseIds: [`${id}-ex1`],
        introduction: custom.introduction,
        learningObjective: custom.learningObjective,
        reflectionPrompt: custom.reflectionPrompt,
        completionSummary: custom.completionSummary
      });
    });
  }
});

// ─── Generate Breathing, Meditation, and Wellness Lessons ────────────────
const otherProgramsList = [
  // Breathing
  'box-breathing',
  '4-7-8-breathing',
  'calm-reset',
  'stress-relief-breathing',
  'focus-breathing',
  'sleep-preparation',
  // Meditation
  'morning-calm',
  'anxiety-relief-meditation',
  'better-sleep',
  'focus-training',
  'self-compassion',
  'mindfulness-basics',
  // Wellness Studio
  'guided-journaling',
  'gratitude-practice',
  'emotional-reflection',
  'goal-setting',
  'weekly-review',
  'daily-reset'
];

otherProgramsList.forEach((progId) => {
  const customLessons = LESSON_CONTENT[progId];
  if (customLessons) {
    const isWell = progId === 'guided-journaling' || progId === 'gratitude-practice' || progId === 'emotional-reflection' || progId === 'goal-setting' || progId === 'weekly-review' || progId === 'daily-reset';
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

