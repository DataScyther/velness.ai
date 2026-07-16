export interface GuidedStep {
  id: string;
  type: 'welcome' | 'purpose' | 'breathing' | 'question' | 'reflection' | 'summary' | 'save' | 'celebrate' | 'learn' | 'apply';
  title: string;
  explanation?: string;
  prompt?: string;
  example?: string;
  placeholder?: string;
  required?: boolean;
  aiInstruction?: string;
}

export const GUIDED_STEPS_CONFIG: Record<string, GuidedStep[]> = {
  // Lesson 1: Understanding Thoughts
  'cbt-foundations-l1-ex1': [
    {
      id: 'cbt-foundations-l1-ex1-step1',
      type: 'learn',
      title: 'Step 1: Learn',
      explanation: 'Thoughts are not facts. They are simply brain signals—temporary mental events that come and go like clouds. Observing them without believing them immediately is the key to emotional freedom.'
    },
    {
      id: 'cbt-foundations-l1-ex1-step2',
      type: 'question',
      title: 'Step 2: Practice',
      prompt: 'Observe the commentary in your mind right now. Write down one automatic thought you are currently having.',
      explanation: 'Check in with your mind. What story is it telling you?',
      example: "e.g., 'I will never finish all these tasks on time.'",
      placeholder: 'Type your automatic thought here...',
      required: true
    },
    {
      id: 'cbt-foundations-l1-ex1-ai-reflection',
      type: 'reflection',
      title: 'AI Companion Guidance',
      aiInstruction: 'Review the user\'s automatic thought. Validate their feelings with compassion and empathy. Encourage them gently and suggest looking at it as a passing cloud. Keep it under 60 words.'
    },
    {
      id: 'cbt-foundations-l1-ex1-step3',
      type: 'question',
      title: 'Step 3: Reflect',
      prompt: 'Write one sentence about how it feels to view this thought as just a passing mental event.',
      explanation: 'Write a single, honest sentence checking in with yourself.',
      placeholder: 'It feels...',
      required: true
    },
    {
      id: 'cbt-foundations-l1-ex1-step4',
      type: 'apply',
      title: 'Step 4: Apply',
      explanation: 'Today, whenever you feel a spike of stress, pause and repeat to yourself: "I am having the thought that...", rather than treating the thought as an absolute truth.'
    },
    {
      id: 'save',
      type: 'save',
      title: 'Saving Your Progress',
      explanation: 'Updating your profile and saving your reflection summary...'
    },
    {
      id: 'celebrate',
      type: 'celebrate',
      title: 'Step 5: Complete',
      explanation: 'Congratulations! You have completed your first CBT step. Your progress has been saved.'
    }
  ],

  // Lesson 2: Identify Distortions
  'cbt-foundations-l2-ex1': [
    {
      id: 'cbt-foundations-l2-ex1-step1',
      type: 'learn',
      title: 'Step 1: Learn',
      explanation: 'Our brains use shortcuts called cognitive distortions (like all-or-nothing thinking or catastrophizing). These traps warp reality, making things seem much worse than they actually are.'
    },
    {
      id: 'cbt-foundations-l2-ex1-step2',
      type: 'question',
      title: 'Step 2: Practice',
      prompt: 'Identify a cognitive trap you frequently fall into (e.g., Catastrophizing, Mind Reading, or Black-and-White thinking) and describe a recent example.',
      explanation: 'Recall a moment when your mind jumped to an extreme conclusion.',
      example: "e.g., 'Black-and-white thinking: Because I made one small mistake, I failed completely.'",
      placeholder: 'The distortion I notice is...',
      required: true
    },
    {
      id: 'cbt-foundations-l2-ex1-ai-reflection',
      type: 'reflection',
      title: 'AI Companion Guidance',
      aiInstruction: 'Analyze the distortion mentioned by the user. Explain how this trap (e.g. catastrophizing, mind reading) warps their view. Offer a gentle validation. Keep it under 60 words.'
    },
    {
      id: 'cbt-foundations-l2-ex1-step3',
      type: 'question',
      title: 'Step 3: Reflect',
      prompt: 'Write one sentence on how recognizing this trap can help you pause when stress arises.',
      explanation: 'Checking in. How does labeling this distortion help?',
      placeholder: 'Recognizing this trap...',
      required: true
    },
    {
      id: 'cbt-foundations-l2-ex1-step4',
      type: 'apply',
      title: 'Step 4: Apply',
      explanation: 'Choose one distortion today. Catch yourself whenever you use extreme words like "always", "never", or "nothing".'
    },
    {
      id: 'save',
      type: 'save',
      title: 'Saving Your Progress',
      explanation: 'Updating your profile and saving your reflection summary...'
    },
    {
      id: 'celebrate',
      type: 'celebrate',
      title: 'Step 5: Complete',
      explanation: 'Excellent work! Identifying distortions is a major milestone in cognitive awareness.'
    }
  ],

  // Lesson 3: Challenge Thoughts
  'cbt-foundations-l3-ex1': [
    {
      id: 'cbt-foundations-l3-ex1-step1',
      type: 'learn',
      title: 'Step 1: Learn',
      explanation: 'To challenge a thought, we put it on trial. We look for objective, factual evidence—both for and against the thought—rather than relying on emotional reasoning.'
    },
    {
      id: 'cbt-foundations-l3-ex1-step2',
      type: 'question',
      title: 'Step 2: Practice',
      prompt: 'Take a stressful thought and list one piece of objective, hard evidence that contradicts this thought.',
      explanation: 'What are the objective facts? What would a camera see?',
      example: "e.g., 'Thought: I am bad at my job. Evidence against: My manager gave me positive feedback on my last project.'",
      placeholder: 'Evidence against this thought...',
      required: true
    },
    {
      id: 'cbt-foundations-l3-ex1-ai-reflection',
      type: 'reflection',
      title: 'AI Companion Guidance',
      aiInstruction: 'Review the user\'s contradicting evidence. Highlight their resilience and facts. Provide a warm validation and a brief encouragement. Keep it under 60 words.'
    },
    {
      id: 'cbt-foundations-l3-ex1-step3',
      type: 'question',
      title: 'Step 3: Reflect',
      prompt: 'Write one sentence about whether your belief in that stressful thought has weakened after looking at the facts.',
      explanation: 'Observe the shift. Does the thought feel as true now?',
      placeholder: 'My belief has...',
      required: true
    },
    {
      id: 'cbt-foundations-l3-ex1-step4',
      type: 'apply',
      title: 'Step 4: Apply',
      explanation: 'The next time you make a negative prediction today, ask yourself: "What is the actual, objective evidence for this?"'
    },
    {
      id: 'save',
      type: 'save',
      title: 'Saving Your Progress',
      explanation: 'Updating your profile and saving your reflection summary...'
    },
    {
      id: 'celebrate',
      type: 'celebrate',
      title: 'Step 5: Complete',
      explanation: 'Fantastic! Testing your thoughts against reality prevents emotional spirals.'
    }
  ],

  // Lesson 4: Replace Thoughts
  'cbt-foundations-l4-ex1': [
    {
      id: 'cbt-foundations-l4-ex1-step1',
      type: 'learn',
      title: 'Step 1: Learn',
      explanation: 'Once we challenge a thought, we replace it with a balanced, realistic alternative. This is not positive thinking; it is factual, grounded thinking.'
    },
    {
      id: 'cbt-foundations-l4-ex1-step2',
      type: 'question',
      title: 'Step 2: Practice',
      prompt: 'Rephrase a stressful thought into a balanced, realistic middle-ground statement based on the facts.',
      explanation: 'Find the middle ground between the absolute worst and absolute best outcomes.',
      example: "e.g., 'Old thought: I will fail this presentation. Balanced thought: I am prepared, and while I might feel nervous, I can communicate clearly.'",
      placeholder: 'A more balanced thought is...',
      required: true
    },
    {
      id: 'cbt-foundations-l4-ex1-ai-reflection',
      type: 'reflection',
      title: 'AI Companion Guidance',
      aiInstruction: 'Review the user\'s new balanced thought. Reinforce how much more constructive it is. Offer a short validation of their cognitive work. Keep it under 60 words.'
    },
    {
      id: 'cbt-foundations-l4-ex1-step3',
      type: 'question',
      title: 'Step 3: Reflect',
      prompt: 'Write one sentence describing how your emotional state changes when you focus on this balanced thought.',
      explanation: 'Tune in to your body and mood.',
      placeholder: 'I feel...',
      required: true
    },
    {
      id: 'cbt-foundations-l4-ex1-step4',
      type: 'apply',
      title: 'Step 4: Apply',
      explanation: 'Repeat your balanced thought three times today whenever you feel a wave of anxiety.'
    },
    {
      id: 'save',
      type: 'save',
      title: 'Saving Your Progress',
      explanation: 'Updating your profile and saving your reflection summary...'
    },
    {
      id: 'celebrate',
      type: 'celebrate',
      title: 'Step 5: Complete',
      explanation: 'Great progress! Replacing distorted thoughts rewires your neural pathways for resilience.'
    }
  ],

  // Lesson 5: Daily Practice
  'cbt-foundations-l5-ex1': [
    {
      id: 'cbt-foundations-l5-ex1-step1',
      type: 'learn',
      title: 'Step 1: Learn',
      explanation: 'CBT is a skill, like learning an instrument. Practicing daily—even for just a few minutes—helps turn cognitive reframing into an automatic, healthy habit.'
    },
    {
      id: 'cbt-foundations-l5-ex1-step2',
      type: 'question',
      title: 'Step 2: Practice',
      prompt: 'Identify one specific stressor you expect to face tomorrow, and write down a balanced thought to prepare for it.',
      explanation: 'Pre-frame tomorrow\'s challenge so you meet it with mindfulness.',
      example: "e.g., 'Stressor: A difficult meeting. Balanced thought: I will share my points calmly and listen constructively.'",
      placeholder: 'When faced with this stressor, I will tell myself...',
      required: true
    },
    {
      id: 'cbt-foundations-l5-ex1-ai-reflection',
      type: 'reflection',
      title: 'AI Companion Guidance',
      aiInstruction: 'Review the user\'s plan for tomorrow\'s stressor. Validate their preparedness. Offer a brief, encouraging note on how daily practices build long-term strength. Keep it under 60 words.'
    },
    {
      id: 'cbt-foundations-l5-ex1-step3',
      type: 'question',
      title: 'Step 3: Reflect',
      prompt: 'Write one sentence committing to a daily mental check-in time (e.g., morning coffee or bedtime).',
      explanation: 'Pick a consistent, recurring anchor in your day.',
      placeholder: 'I will check in at...',
      required: true
    },
    {
      id: 'cbt-foundations-l5-ex1-step4',
      type: 'apply',
      title: 'Step 4: Apply',
      explanation: 'Set a reminder on your phone for your chosen daily check-in time tomorrow.'
    },
    {
      id: 'save',
      type: 'save',
      title: 'Saving Your Progress',
      explanation: 'Updating your profile and saving your reflection summary...'
    },
    {
      id: 'celebrate',
      type: 'celebrate',
      title: 'Step 5: Complete',
      explanation: 'Superb! Commitment to practice is the foundation of long-term mental well-being.'
    }
  ],

  // Lesson 6: Reflection
  'cbt-foundations-l6-ex1': [
    {
      id: 'cbt-foundations-l6-ex1-step1',
      type: 'learn',
      title: 'Step 1: Learn',
      explanation: 'Taking a step back to reflect on your journey consolidates your gains. Celebrate how far you have come since starting this program.'
    },
    {
      id: 'cbt-foundations-l6-ex1-step2',
      type: 'question',
      title: 'Step 2: Practice',
      prompt: 'Summarize the most important insight or tool you have learned about your mind during this CBT program.',
      explanation: 'What key learning will you take with you?',
      example: "e.g., 'Learning that thoughts are opinions, not objective facts, completely changed how I react to anxiety.'",
      placeholder: 'The biggest insight for me was...',
      required: true
    },
    {
      id: 'cbt-foundations-l6-ex1-ai-reflection',
      type: 'reflection',
      title: 'AI Companion Guidance',
      aiInstruction: 'Review the user\'s final insights. Celebrate their growth and dedication. Offer a warm, professional closing blessing on their mental fitness journey. Keep it under 60 words.'
    },
    {
      id: 'cbt-foundations-l6-ex1-step3',
      type: 'question',
      title: 'Step 3: Reflect',
      prompt: 'Write one sentence about who you are becoming as you master your thought patterns.',
      explanation: 'Envision your resilient future self.',
      placeholder: 'I am becoming...',
      required: true
    },
    {
      id: 'cbt-foundations-l6-ex1-step4',
      type: 'apply',
      title: 'Step 4: Apply',
      explanation: 'Share one insight you\'ve learned here with a friend, or write it down in a physical journal.'
    },
    {
      id: 'save',
      type: 'save',
      title: 'Saving Your Progress',
      explanation: 'Updating your profile and saving your reflection summary...'
    },
    {
      id: 'celebrate',
      type: 'celebrate',
      title: 'Step 5: Complete',
      explanation: 'Congratulations! You have completed the entire CBT Foundations program. Continue practicing your tools!'
    }
  ]
};
