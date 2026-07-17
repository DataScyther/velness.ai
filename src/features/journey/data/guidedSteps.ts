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
      explanation: 'Thoughts are automatic mental events that pop up in response to situations. They are not facts, and they are not always accurate. Noticing a thought as "just a thought" creates distance so you can choose how to respond, rather than react.'
    },
    {
      id: 'cbt-foundations-l1-ex1-step2',
      type: 'question',
      title: 'Step 2: Practice',
      prompt: 'Think of a recent moment you felt a strong emotion. What went through your mind, in the exact words? Write it as a sentence, even if it feels true.',
      explanation: 'Check in with your mind. What story is it telling you right now?',
      example: "e.g., \"I'm going to mess this up.\" or \"Nobody actually likes me.\"",
      placeholder: 'Type the exact thought here...',
      required: true
    },
    {
      id: 'cbt-foundations-l1-ex1-ai-reflection',
      type: 'reflection',
      title: 'AI Companion Guidance',
      aiInstruction: 'Review the user\'s automatic thought. Validate their feelings with compassion and empathy. Gently introduce cognitive defusion: suggest they can say "I\'m having the thought that…" to create distance. Keep it under 60 words.'
    },
    {
      id: 'cbt-foundations-l1-ex1-step3',
      type: 'question',
      title: 'Step 3: Reflect',
      prompt: 'Put the phrase "I\'m having the thought that…" in front of your thought. Notice: does it feel a little less like a fact? Write one sentence about what that distance is like.',
      explanation: 'Write a single, honest sentence checking in with yourself.',
      placeholder: 'It feels...',
      required: true
    },
    {
      id: 'cbt-foundations-l1-ex1-step4',
      type: 'apply',
      title: 'Step 4: Apply',
      explanation: 'Once a day, when a heavy feeling hits, pause and mentally label it: "That\'s a thought, not a fact." Just 30 seconds of noticing is enough to start the habit.'
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
      explanation: 'Congratulations! You took the first step in cognitive awareness: noticing that thoughts are mental events you can observe, not commands you must obey.'
    }
  ],

  // Lesson 2: Identify Distortions
  'cbt-foundations-l2-ex1': [
    {
      id: 'cbt-foundations-l2-ex1-step1',
      type: 'learn',
      title: 'Step 1: Learn',
      explanation: 'Cognitive distortions are common, biased thinking habits — like mental "blind spots" — that make situations seem more negative than they are. Naming the distortion is the first step to loosening its grip.'
    },
    {
      id: 'cbt-foundations-l2-ex1-step2',
      type: 'question',
      title: 'Step 2: Practice',
      prompt: 'Write down a recent negative thought you had. Then name the distortion(s) that fit it from the list below. You don\'t have to be certain — just notice the pattern.',
      explanation: 'Common distortions: All-or-Nothing · Overgeneralization · Mental Filter · Discounting the Positive · Mind Reading / Fortune Telling · Catastrophizing · Emotional Reasoning ("I feel it, so it\'s true") · Should Statements · Labeling · Personalization. Which one shows up for you?',
      example: "'I failed that one task, so I'm a total failure.' → Labeling / All-or-Nothing.",
      placeholder: 'The distortion I notice is...',
      required: true
    },
    {
      id: 'cbt-foundations-l2-ex1-ai-reflection',
      type: 'reflection',
      title: 'AI Companion Guidance',
      aiInstruction: 'Name the distortion the user described (e.g. catastrophizing, mind reading, labeling). Explain, in plain language, how this trap warps their view of the situation. Offer gentle validation that noticing it is already progress. Keep it under 60 words.'
    },
    {
      id: 'cbt-foundations-l2-ex1-step3',
      type: 'question',
      title: 'Step 3: Reflect',
      prompt: 'Which distortion shows up most often for you? What situation tends to trigger it? Write one sentence about the pattern you are starting to see.',
      explanation: 'Checking in. How does labeling this distortion help you pause?',
      placeholder: 'Recognizing this trap...',
      required: true
    },
    {
      id: 'cbt-foundations-l2-ex1-step4',
      type: 'apply',
      title: 'Step 4: Apply',
      explanation: 'When a bad feeling hits today, ask: "What distortion might be sneaking in here?" Just name it — you don\'t have to fix it yet. Naming is half the battle.'
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
      explanation: 'Excellent work! Labeling a distortion — catastrophizing, mind reading, all-or-nothing — breaks the illusion that the thought is simply "the truth."'
    }
  ],

  // Lesson 3: Challenge Thoughts
  'cbt-foundations-l3-ex1': [
    {
      id: 'cbt-foundations-l3-ex1-step1',
      type: 'learn',
      title: 'Step 1: Learn',
      explanation: 'Challenging a thought means examining the evidence for and against it, like a fair judge weighing facts — not arguing it away. When you test a thought against reality, its grip usually loosens on its own.'
    },
    {
      id: 'cbt-foundations-l3-ex1-step2',
      type: 'question',
      title: 'Step 2: Practice',
      prompt: 'Write the thought you want to test. As the prosecutor, list the facts that support it. As the defense attorney, list the facts that argue against it. Stick to observable facts, not feelings.',
      explanation: 'What would a camera actually see? What are the objective facts?',
      example: "'Thought: My boss is annoyed because I was 2 minutes late.' Evidence against: He smiled at the meeting and emailed me a normal task afterward.",
      placeholder: 'Evidence for / against this thought...',
      required: true
    },
    {
      id: 'cbt-foundations-l3-ex1-ai-reflection',
      type: 'reflection',
      title: 'AI Companion Guidance',
      aiInstruction: 'Praise the user for weighing evidence fairly. Highlight the most striking fact that contradicts the thought. Note that a thought can be partly true AND partly false. Keep it under 60 words and warm.'
    },
    {
      id: 'cbt-foundations-l3-ex1-step3',
      type: 'question',
      title: 'Step 3: Reflect',
      prompt: 'If you were the judge, what is the fairest verdict? Is the thought 100% true, 0% true, or somewhere in between? On a scale of 0–100%, how much do you believe it now? Write one sentence.',
      explanation: 'Observe the shift. Does the thought feel as absolute now?',
      placeholder: 'My belief is now...',
      required: true
    },
    {
      id: 'cbt-foundations-l3-ex1-step4',
      type: 'apply',
      title: 'Step 4: Apply',
      explanation: 'When a worry feels like absolute truth, ask: "What\'s the evidence for AND against this?" Write at least one item in each column before you decide how much to believe it.'
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
      explanation: 'Fantastic! When you put a thought on trial, the verdict is almost always kinder and far more accurate than the original accusation.'
    }
  ],

  // Lesson 4: Replace Thoughts
  'cbt-foundations-l4-ex1': [
    {
      id: 'cbt-foundations-l4-ex1-step1',
      type: 'learn',
      title: 'Step 1: Learn',
      explanation: 'Once you\'ve weighed the evidence, build a balanced thought — one that acknowledges the hard parts AND the contradictory facts, and points to a small next step. It should feel believable, not artificially cheerful. This is realistic thinking, not toxic positivity.'
    },
    {
      id: 'cbt-foundations-l4-ex1-step2',
      type: 'question',
      title: 'Step 2: Practice',
      prompt: 'Take the thought you challenged. Write a balanced replacement: keep it to one sentence, drop extreme words (always / never / ruin), include one fact against the old thought, and end with a small next step.',
      explanation: 'Formula: copy the old thought → slice extreme phrases → insert one contrary fact → add a next step. Aim for ~140 characters so it\'s easy to recall under stress.',
      example: "'The call was rough, but they liked my proposal outline. I\'ll send clarifying follow-ups tomorrow.'",
      placeholder: 'A more balanced thought is...',
      required: true
    },
    {
      id: 'cbt-foundations-l4-ex1-ai-reflection',
      type: 'reflection',
      title: 'AI Companion Guidance',
      aiInstruction: 'Affirm how much more constructive the user\'s balanced thought is than the original. Note that it stays honest about the difficulty while adding a fact and a next step. Keep it under 60 words.'
    },
    {
      id: 'cbt-foundations-l4-ex1-step3',
      type: 'question',
      title: 'Step 3: Reflect',
      prompt: 'Read your balanced thought aloud. On a scale of 0–100%, how much do you believe it? How does your emotional intensity compare to when you started? Write one sentence.',
      explanation: 'Tune in to your body and mood.',
      placeholder: 'I feel...',
      required: true
    },
    {
      id: 'cbt-foundations-l4-ex1-step4',
      type: 'apply',
      title: 'Step 4: Apply',
      explanation: 'Keep your 2–3 best balanced thoughts on a "coping card" (a note in your phone). Re-read one whenever the old thought resurfaces today.'
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
      explanation: 'Great progress! Daily reframing is a habit, not a one-time fix — each balanced thought weakens the old negative groove.'
    }
  ],

  // Lesson 5: Daily Practice
  'cbt-foundations-l5-ex1': [
    {
      id: 'cbt-foundations-l5-ex1-step1',
      type: 'learn',
      title: 'Step 1: Learn',
      explanation: 'Cognitive restructuring is a skill that strengthens with repetition. A short daily check-in turns scattered insight into a habit, so you catch distortions earlier and recover faster. Records written closest to the trigger are the most accurate.'
    },
    {
      id: 'cbt-foundations-l5-ex1-step2',
      type: 'question',
      title: 'Step 2: Practice',
      prompt: 'Do a 3-minute check-in: what situation triggered a shift in mood today? What automatic thought came with it? What is one balanced thought you can offer yourself?',
      explanation: 'Use the Thought Record shape: Situation → Automatic Thought → Balanced Thought. Even logging just the situation and hot thought counts.',
      example: "'Skipped workout → thought: I have no discipline → balanced: One missed session isn\'t a pattern; I\'ll do a short walk tonight.'",
      placeholder: 'Today\'s check-in: situation, thought, balanced thought...',
      required: true
    },
    {
      id: 'cbt-foundations-l5-ex1-ai-reflection',
      type: 'reflection',
      title: 'AI Companion Guidance',
      aiInstruction: 'Validate the user\'s commitment to a daily practice. Point out that consistency beats length, and that catching a thought near the trigger is what builds the habit. Offer a brief, encouraging note. Keep it under 60 words.'
    },
    {
      id: 'cbt-foundations-l5-ex1-step3',
      type: 'question',
      title: 'Step 3: Reflect',
      prompt: 'After a week of check-ins, look back: which distortion appeared most? What time of day or situation is your biggest trigger? Write one pattern you have noticed.',
      explanation: 'Pick a consistent, recurring anchor in your day.',
      placeholder: 'The pattern I notice is...',
      required: true
    },
    {
      id: 'cbt-foundations-l5-ex1-step4',
      type: 'apply',
      title: 'Step 4: Apply',
      explanation: 'Set one daily reminder (e.g., 8pm) for a 3-minute thought check-in. Consistency builds a solid foundation for resilience.'
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
      explanation: 'Superb! A daily thought-checking routine keeps you grounded and builds lasting mental well-being.'
    }
  ],

  // Lesson 6: Reflection
  'cbt-foundations-l6-ex1': [
    {
      id: 'cbt-foundations-l6-ex1-step1',
      type: 'learn',
      title: 'Step 1: Learn',
      explanation: 'Consolidating what you\'ve learned into a personal playbook — your triggers, go-to balanced thoughts, and coping moves — protects your progress and gives you a plan for harder days. This is your Blueprint for Change.'
    },
    {
      id: 'cbt-foundations-l6-ex1-step2',
      type: 'question',
      title: 'Step 2: Practice',
      prompt: 'Build your playbook: list your top 2–3 trigger situations, the distortion each tends to bring, and one balanced thought you\'ll reach for. Then list 3 coping actions you can take on a hard day (e.g., text a friend, 10-min walk, box breathing).',
      explanation: 'Format: Trigger → Distortion → Balanced Go-To. Add a few coping moves you can actually do.',
      example: "'Trigger: vague feedback → Distortion: mind reading → Balanced: Vague isn\'t negative; I\'ll ask one clarifying question.'",
      placeholder: 'My playbook: triggers, distortions, balanced thoughts, coping moves...',
      required: true
    },
    {
      id: 'cbt-foundations-l6-ex1-ai-reflection',
      type: 'reflection',
      title: 'AI Companion Guidance',
      aiInstruction: 'Celebrate the user\'s growth and the concrete playbook they built. Affirm that having a written plan for hard days is a sign of real resilience. Offer a warm, professional closing. Keep it under 60 words.'
    },
    {
      id: 'cbt-foundations-l6-ex1-step3',
      type: 'question',
      title: 'Step 3: Reflect',
      prompt: 'What have you learned about your mind over these lessons? Write one sentence you\'d tell a friend who is just starting this work.',
      explanation: 'Envision your resilient future self.',
      placeholder: 'I am becoming...',
      required: true
    },
    {
      id: 'cbt-foundations-l6-ex1-step4',
      type: 'apply',
      title: 'Step 4: Apply',
      explanation: 'Once a month, do a 30-minute playbook review — update triggers, add a new balanced thought, reconfirm your coping list and a support contact.'
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
      explanation: 'Congratulations! You have completed the entire CBT Foundations program. Keep your playbook handy and practice your tools — this is how lasting change is built.'
    }
  ]
};
