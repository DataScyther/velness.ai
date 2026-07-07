import { EXERCISE_TYPE, ExerciseType } from '../constants';
import type { Exercise } from '../models/Exercise';
import { DEFAULT_LESSONS } from './programs';

interface CustomExerciseInput {
  type?: ExerciseType;
  title: string;
  goal: string;
  instructions: string[];
  completionCriteria?: string;
  time?: number;
}

const CUSTOM_EXERCISES: Record<string, CustomExerciseInput> = {
  // CBT - Understanding Thoughts
  'understanding-thoughts-l1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Noticing the Voice',
    goal: 'Learn to catch automatic thoughts in real time',
    instructions: [
      'Take a moment to close your eyes and breathe naturally.',
      'Observe the commentary passing through your mind.',
      'Write down the very first thought you clearly observe.',
      'Label it simply as a "mental event", not an absolute truth.'
    ],
    completionCriteria: 'Save your observation to complete the lesson.'
  },
  'understanding-thoughts-l2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Triangle Mapping',
    goal: 'Map how thoughts drive emotions and behaviors',
    instructions: [
      'Recall a situation today where you felt a sudden shift in your mood.',
      'Write down the exact trigger (what happened).',
      'Identify the automatic thought that immediately followed.',
      'Note how that thought affected your feelings and behavior.'
    ]
  },
  'understanding-thoughts-l3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Fact vs Interpretation',
    goal: 'Distinguish objective reality from mental stories',
    instructions: [
      'Write down a stressful thought you had today.',
      'Strip away all interpretations: what would a camera record?',
      'List the objective facts of the situation.',
      'List the opinions or stories your mind added to those facts.'
    ]
  },
  'understanding-thoughts-l4': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Trigger Tracking',
    goal: 'Identify physical or environmental cues that spark stress loops',
    instructions: [
      'Identify a situation that frequently makes you feel anxious or frustrated.',
      'Describe the environment (who was there, what was happening).',
      'Note any physical signals (shallow breathing, muscle tightness).',
      'Formulate a warning label: "When [trigger] happens, my mind tends to..."'
    ]
  },
  'understanding-thoughts-l5': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Cognitive Integration Log',
    goal: 'Establish a structured daily thought-checking routine',
    instructions: [
      'Think of a current stressful situation.',
      'Log the trigger, the automatic thought, and the emotional intensity (1-10).',
      'Review the facts objectively.',
      'Write one balanced, supportive alternative thought.'
    ]
  },

  // CBT - Challenging Negative Thinking
  'challenging-negative-thinking-l1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'ANT Catcher',
    goal: 'Identify automatic negative thoughts (ANTs) as they arise',
    instructions: [
      'Recall a moment today when you felt self-doubt or irritation.',
      'Write down the exact automatic negative thought (ANT).',
      'Rate how strongly you believed this thought (0% to 100%).',
      'Remind yourself: "Believing a thought doesn\'t make it true."'
    ]
  },
  'challenging-negative-thinking-l2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Distortion Labeling',
    goal: 'Examine thoughts for common cognitive biases (thinking traps)',
    instructions: [
      'Select a persistent stressful thought.',
      'Review thinking traps: Catastrophizing, Mind Reading, All-or-Nothing.',
      'Identify which distortions are active in your selected thought.',
      'Explain *why* this thought fits that distortion pattern.'
    ]
  },
  'challenging-negative-thinking-l3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Thought on Trial',
    goal: 'Examine the factual evidence supporting and opposing a negative belief',
    instructions: [
      'Write your negative belief clearly (e.g. "I am bad at this job").',
      'Act as the defense: write all the factual evidence *supporting* the thought.',
      'Act as the prosecution: write all the factual evidence *contradicting* the thought.',
      'Judge the case: what is the objective, balanced truth?'
    ]
  },
  'challenging-negative-thinking-l4': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'The Reframe Generator',
    goal: 'Brainstorm alternative, realistic explanations for situations',
    instructions: [
      'Describe a situation where someone\'s action upset you.',
      'Write your primary negative interpretation (e.g. "They are ignoring me").',
      'Brainstorm two other realistic explanations (e.g. "They are busy", "They forgot").',
      'Notice how your emotional intensity shifts with these alternatives.'
    ]
  },
  'challenging-negative-thinking-l5': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Daily Restructuring Playbook',
    goal: 'Practice daily cognitive restructuring to support flexibility',
    instructions: [
      'State your main negative automatic thought from today.',
      'Identify the cognitive distortion and check the evidence.',
      'Write down a balanced, factual, and supportive reframe.',
      'Rate your belief in the reframe (0% to 100%).'
    ]
  },

  // CBT - Managing Anxiety
  'managing-anxiety-l1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Anxiety Compass',
    goal: 'Observe and demystify how anxiety triggers function',
    instructions: [
      'Recall a recent anxious moment.',
      'State what triggered the anxiety (situation, person, or thought).',
      'Acknowledge the anxiety as a protective response (fight-or-flight).',
      'Write: "My body is trying to protect me, but there is no actual danger."'
    ]
  },
  'managing-anxiety-l2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Somatic Map',
    goal: 'Locate and observe physical anxiety sensations objectively',
    instructions: [
      'Check in with your body right now. Where do you feel tension?',
      'Describe the sensation objectively (e.g. "warmth", "tightness", "fluttering").',
      'Breathe into that space, allowing the physical sensation to just exist.',
      'Observe it change or dissolve over the next two minutes.'
    ]
  },
  'managing-anxiety-l3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Sensory Grounding (5-4-3-2-1)',
    goal: 'Anchor your attention in the physical environment to disrupt panic',
    instructions: [
      'Take a deep breath and look around you.',
      'Write down 5 things you can see, and 4 things you can physically feel.',
      'Write down 3 things you can hear, and 2 things you can smell.',
      'Write down 1 positive thing you can taste or say about yourself.'
    ]
  },
  'managing-anxiety-l4': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'De-Catastrophizer',
    goal: 'Challenge worst-case scenario thinking with probability',
    instructions: [
      'Write down your catastrophic "what-if" thought.',
      'Determine: what is the absolute worst-case outcome?',
      'Determine: what is the best-case outcome?',
      'Determine: what is the most realistic, probable outcome, and how will you cope?'
    ]
  },
  'managing-anxiety-l5': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'My Calming Protocol',
    goal: 'Design a personalized response plan for anxiety triggers',
    instructions: [
      'Outline your warning signs (e.g., tight chest, racing thoughts).',
      'Select your primary grounding technique (e.g., 5-4-3-2-1, Box Breathing).',
      'Write one calming phrase to repeat: "I am safe in this moment."',
      'Commit to taking this exact pause next time you notice a trigger.'
    ]
  },

  // CBT - Emotional Regulation
  'emotional-regulation-l1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Primary Emotions Tracker',
    goal: 'Identify and validate your immediate emotional responses',
    instructions: [
      'Sit quietly and check in with your current feelings.',
      'Identify the primary emotion (Sadness, Anger, Fear, Joy, Shame).',
      'Describe the raw physical sensation of this emotion.',
      'Write: "It is okay to feel [emotion] right now. This feeling is temporary."'
    ]
  },
  'emotional-regulation-l2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Emotion Wheel Audit',
    goal: 'Translate vague feelings into precise, named emotions',
    instructions: [
      'Select a vague mood state you felt today (e.g., "bad", "stressed").',
      'Unpack it: are you feeling rejected, overwhelmed, ignored, or tired?',
      'Write down the specific secondary emotions you discover.',
      'Reflect on how naming them changes their intensity.'
    ]
  },
  'emotional-regulation-l3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'The STOP Pause',
    goal: 'Practice pausing to prevent impulsive, emotion-driven actions',
    instructions: [
      'Recall a situation today where you felt like reacting impulsively.',
      'Practice the STOP steps: **S**top, **T**ake a breath, **O**bserve, **P**roceed.',
      'Write down what your impulsive reaction would have been.',
      'Write down a more helpful, controlled response.'
    ]
  },
  'emotional-regulation-l4': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Somatic Cooling',
    goal: 'Use physiological resets to lower high emotional arousal',
    instructions: [
      'Identify a physical release that works for you (e.g., splashing cold water, progressive muscle relaxation).',
      'Engage in paced breathing (slow count to 5 in, slow count to 5 out).',
      'Write down how your physical tension levels changed after the reset.',
      'Commit to using this reset when emotional intensity exceeds a 7/10.'
    ]
  },
  'emotional-regulation-l5': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Emotional Dialectic Builder',
    goal: 'Accept intense feelings while committing to helpful behaviors',
    instructions: [
      'Describe a current difficult emotion you are experiencing.',
      'Write an acceptance statement: "I feel [emotion], and that is valid."',
      'Write a commitment statement: "Even though I feel [emotion], I will still [helpful action]."',
      'Merge them: "I feel [emotion] AND I can still choose to [action]."'
    ]
  },

  // CBT - Building Confidence
  'building-confidence-l1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Core Belief Audit',
    goal: 'Examine deep-seated assumptions about your self-worth',
    instructions: [
      'Write down a recurring negative self-belief (e.g. "I am not smart enough").',
      'Recall when you first started believing this statement.',
      'List three historical examples that prove this belief is incorrect.',
      'Write a more compassionate, updated version of this belief.'
    ]
  },
  'building-confidence-l2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Inner Critic Reframed',
    goal: 'Answer harsh self-criticism with supportive self-compassion',
    instructions: [
      'Write down a harsh self-criticism you made today.',
      'Imagine a friend came to you with this exact same concern.',
      'Write down what you would say to support and encourage them.',
      'Direct that exact response back to yourself in writing.'
    ]
  },
  'building-confidence-l3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Strengths Inventory',
    goal: 'Identify and anchor your sense of self in personal competencies',
    instructions: [
      'List three things you have done well or challenges you overcame.',
      'For each, identify the personal strength you used (e.g. perseverance, kindness).',
      'Write down how you can apply one of these strengths in your life today.',
      'Acknowledge your capacity to grow and handle future obstacles.'
    ]
  },
  'building-confidence-l4': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Values Affirmation',
    goal: 'Reinforce self-worth by connecting actions to core values',
    instructions: [
      'Identify one value that is deeply important to you (e.g. honesty, creativity).',
      'Write about a time you acted in alignment with this value.',
      'List one small action you can take today to express this value.',
      'Note how living your values supports your confidence independently of performance.'
    ]
  },
  'building-confidence-l5': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Micro-Courage Challenge',
    goal: 'Take a small, value-aligned risk to build efficacy',
    instructions: [
      'Define a small action that makes you slightly nervous but aligns with your values.',
      'State when and where you will complete this challenge.',
      'Write down your cope-ahead plan: how will you support yourself regardless of the outcome?',
      'Commit to taking the step and logging the result.'
    ]
  },

  // CBT - Healthy Habits
  'healthy-habits-l1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Habit Mapping',
    goal: 'Deconstruct a daily routine into cue, routine, and reward',
    instructions: [
      'Select a daily habit you want to modify or establish.',
      'Identify the **cue** (time, location, emotional state, or preceding action).',
      'Describe the **routine** (the behavior itself).',
      'Identify the **reward** (what benefit or craving satisfaction does it provide?).'
    ]
  },
  'healthy-habits-l2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Friction Hacking',
    goal: 'Redesign environment triggers to make positive habits effortless',
    instructions: [
      'Select the habit you want to build (e.g., drinking water).',
      'Identify one way to reduce friction (e.g., placing a water bottle on your desk).',
      'Select a habit you want to break (e.g., scrolling social media).',
      'Identify one way to add friction (e.g., deleting the app, placing phone in another room).'
    ]
  },
  'healthy-habits-l3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'The 2-Minute Rule',
    goal: 'Scale down habits to eliminate starting resistance',
    instructions: [
      'Write down a habit you struggle to start (e.g. exercising daily).',
      'Scale it down to a version that takes 2 minutes or less (e.g. putting on running shoes).',
      'Commit to performing only the 2-minute version for the next 3 days.',
      'Focus purely on showing up consistently rather than the intensity of the work.'
    ]
  },
  'healthy-habits-l4': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Stacking Plan',
    goal: 'Link a new habit to an established routine to automate consistency',
    instructions: [
      'Identify an anchor habit you perform automatically every day (e.g., brewing coffee).',
      'Identify the new habit you want to build.',
      'Create your habit stack formula: "After I [anchor], I will [new habit]."',
      'Specify the reward or positive check-in you will give yourself immediately after.'
    ]
  },
  'healthy-habits-l5': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Resilience Protocol',
    goal: 'Create a recovery plan for setbacks to maintain consistency',
    instructions: [
      'Write down your rule: **"Never miss twice."**',
      'Identify the obstacles that caused you to miss habits in the past.',
      'Formulate an "If-Then" plan: "If [obstacle occurs], then I will [backup micro-habit]."',
      'Acknowledge that showing up partially is always better than not showing up at all.'
    ]
  },

  // Box Breathing
  'box-breathing-l1': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Foundational Box Breath',
    goal: 'Settle respiratory rhythms using 4-second intervals',
    instructions: [
      'Sit comfortably and let your shoulders drop.',
      'Inhale slowly through your nose for 4 seconds.',
      'Hold your breath with relaxed lungs for 4 seconds.',
      'Exhale gently through your mouth for 4 seconds.',
      'Hold empty for 4 seconds. Repeat the cycle.'
    ],
    completionCriteria: 'Breathe continuously through 4 full box cycles.',
    time: 5
  },
  'box-breathing-l2': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Hold Expansion',
    goal: 'Extend holds to regulate autonomic carbon dioxide tolerance',
    instructions: [
      'Sit tall and close your eyes.',
      'Follow the expand-hold-shrink-hold circle animation.',
      'Maintain complete physical relaxation during the breath holds.',
      'Allow any physical urge to sigh to pass into slow, controlled exhales.'
    ],
    completionCriteria: 'Maintain the paced holding cycles for 5 minutes.',
    time: 5
  },
  'box-breathing-l3': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Everyday Integration',
    goal: 'Practice box breathing in high-stress mock situations',
    instructions: [
      'Close your eyes and visualize a challenging upcoming situation.',
      'Begin a slow box breathing cycle (4-4-4-4).',
      'Continue breathing steadily while maintaining the mental image.',
      'Notice how somatic activation declines as you breathe.'
    ],
    completionCriteria: 'Breathe steadily for 5 minutes.',
    time: 5
  },

  // 4-7-8 Breathing
  '4-7-8-breathing-l1': {
    type: EXERCISE_TYPE.BREATHING,
    title: '4-7-8 Foundations',
    goal: 'Activate parasympathetic systems with a paced sigh',
    instructions: [
      'Exhale completely through your mouth with a "whoosh" sound.',
      'Inhale quietly through your nose for 4 seconds.',
      'Hold your breath for a count of 7 seconds.',
      'Exhale completely through your mouth with a "whoosh" for 8 seconds.',
      'Repeat this cycle for 4 breaths total.'
    ],
    completionCriteria: 'Complete 4 full breathing cycles.',
    time: 5
  },
  '4-7-8-breathing-l2': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Nervous System Tuning',
    goal: 'Down-regulate heart rate and muscle tension',
    instructions: [
      'Sit comfortably, keeping your tongue behind your front teeth.',
      'Inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds.',
      'Focus your attention on the feeling of releasing tension during the long exhales.',
      'Allow your body to become heavy and fully relaxed.'
    ],
    completionCriteria: 'Maintain the 4-7-8 rhythm for 4 cycles.',
    time: 5
  },
  '4-7-8-breathing-l3': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Sleep Transition Reset',
    goal: 'Use breathing cues to transition into restorative sleep',
    instructions: [
      'Lie down in bed and dim the lights.',
      'Perform 4 to 8 cycles of the 4-7-8 breath.',
      'Let your exhalations carry away any residual thoughts from the day.',
      'Allow your breath to return to its natural, soft rhythm as you drift off.'
    ],
    completionCriteria: 'Breathe slowly for 5 minutes.',
    time: 5
  },

  // Calm Reset
  'calm-reset-l1': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Resonant Flow Reset',
    goal: 'Slow down respiration to 6 breaths per minute to balance stress',
    instructions: [
      'Inhale slowly for 5 seconds as the indicator expands.',
      'Exhale smoothly for 5 seconds as the indicator shrinks.',
      'Maintain a continuous flow with no pauses between breaths.',
      'Focus on the physical expansion and contraction of your chest.'
    ],
    completionCriteria: 'Resonate breathe for 3 minutes.',
    time: 3
  },
  'calm-reset-l2': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Rapid De-escalation',
    goal: 'Use extended exhales to quickly cool down high-stress moments',
    instructions: [
      'Inhale quickly for 3 seconds.',
      'Exhale slowly and completely for 6 seconds.',
      'Observe the immediate slowing of your heart rate.',
      'Repeat this 1:2 ratio for 3 minutes.'
    ],
    completionCriteria: 'Complete the paced exhalations for 3 minutes.',
    time: 3
  },
  'calm-reset-l3': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Steady Grounding Anchor',
    goal: 'Establish a stable daily somatic anchor',
    instructions: [
      'Sit comfortably upright and close your eyes.',
      'Begin a slow, deep breathing rhythm (5 seconds in, 5 seconds out).',
      'Feel the support of the chair underneath you with each breath.',
      'Rest in the physical sensation of steady grounding.'
    ],
    completionCriteria: 'Breathe slowly for 5 minutes.',
    time: 5
  },

  // Stress Relief Breathing
  'stress-relief-breathing-l1': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Deep Diaphragmatic Breath',
    goal: 'Engage the diaphragm to reverse shallow stress breathing',
    instructions: [
      'Place one hand on your chest and one on your belly.',
      'Inhale deeply, feeling only your belly expand.',
      'Exhale slowly, letting your belly sink naturally.',
      'Keep your chest and shoulders still and relaxed.'
    ],
    completionCriteria: 'Breathe diaphragmatically for 5 minutes.',
    time: 5
  },
  'stress-relief-breathing-l2': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Tension Release Sigh',
    goal: 'Release somatic stress from the body on exhalation',
    instructions: [
      'Inhale deeply through your nose.',
      'Open your mouth and sigh the breath out fully with a relaxed jaw.',
      'With each sigh, imagine tension melting off your shoulders and neck.',
      'Let your muscles become soft and heavy.'
    ],
    completionCriteria: 'Practice tension release breaths for 5 minutes.',
    time: 5
  },
  'stress-relief-breathing-l3': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Quiet Mind Respiration',
    goal: 'Establish slow, coherent breathing to silence overthinking',
    instructions: [
      'Inhale for 5 seconds, and exhale for 6 seconds.',
      'Observe the empty spaces at the end of each exhalation.',
      'Let your mind rest in those quiet pauses.',
      'Continue breathing with a soft, effortless rhythm.'
    ],
    completionCriteria: 'Maintain the slow breathing for 5 minutes.',
    time: 5
  },

  // Focus Breathing
  'focus-breathing-l1': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Alertness Activation',
    goal: 'Energize the brain and clear fatigue with rhythmic activation breathing',
    instructions: [
      'Sit upright with a strong, active posture.',
      'Inhale sharply through your nose for 2 seconds.',
      'Exhale rapidly through your nose for 2 seconds.',
      'Perform this energetic cycle rhythmically for 10 breaths, then rest.'
    ],
    completionCriteria: 'Complete 3 activation cycles.',
    time: 3
  },
  'focus-breathing-l2': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Mind Energizer (Bhastrika)',
    goal: 'Boost alertness and clear brain fog',
    instructions: [
      'Inhale deeply and raise your arms up.',
      'Exhale forcefully through your nose while bringing your fists down to your shoulders.',
      'Maintain an energetic, rhythmic pace.',
      'Settle into a normal, calm breath when completed.'
    ],
    completionCriteria: 'Breathe rhythmically for 3 minutes.',
    time: 3
  },
  'focus-breathing-l3': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Coherent Focus Reset',
    goal: 'Balance alertness and calm for sustained mental stamina',
    instructions: [
      'Inhale for 4 seconds, pause for 2 seconds.',
      'Exhale for 4 seconds, pause for 2 seconds.',
      'Keep your eyes open and focus your gaze on a single point in front of you.',
      'Maintain this balanced, alert breath.'
    ],
    completionCriteria: 'Breathe with focus for 3 minutes.',
    time: 3
  },

  // Sleep Preparation
  'sleep-preparation-l1': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Somatic Unwinding',
    goal: 'Release physiological activation from the day',
    instructions: [
      'Sit or lie down in a dim space.',
      'Slowly inhale for 5 seconds.',
      'Exhale gently for 7 seconds, letting your body sink into support.',
      'Allow your jaw, forehead, and shoulders to fully relax.'
    ],
    completionCriteria: 'Breathe slowly for 5 minutes.',
    time: 5
  },
  'sleep-preparation-l2': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Sleep Activation Breath',
    goal: 'Trigger sleep centers in the brain with extended exhales',
    instructions: [
      'Inhale silently through your nose for 4 seconds.',
      'Exhale very slowly and quietly through your mouth for 8 seconds.',
      'Repeat this cycle, making the breath as soft and effortless as possible.',
      'Let your thoughts float away with each slow release.'
    ],
    completionCriteria: 'Maintain the sleep-triggering breath for 5 minutes.',
    time: 5
  },
  'sleep-preparation-l3': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Bedtime Transition Flow',
    goal: 'Lock in a nightly wind-down breathing ritual',
    instructions: [
      'Close your eyes and lie down comfortably in bed.',
      'Inhale slowly for 6 seconds, and exhale gently for 6 seconds.',
      'Pause briefly at the end of each breath.',
      'Allow your breathing to become natural and soft as you fall asleep.'
    ],
    completionCriteria: 'Breathe gently for 5 minutes.',
    time: 5
  },

  // Morning Calm
  'morning-calm-l1': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Mindful Waking Anchor',
    goal: 'Ground your attention in somatic sensations to start the day',
    instructions: [
      'Find a comfortable seated posture.',
      'Bring your focus to the rising and falling of your chest.',
      'Acknowledge the transition from sleep to waking state.',
      'Rest in the physical sensation of breath in the morning.'
    ],
    completionCriteria: 'Meditate for 10 minutes.',
    time: 10
  },
  'morning-calm-l2': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Intention Setting',
    goal: 'Set a positive, value-aligned focus for the day',
    instructions: [
      'Sit comfortably and settle your breathing.',
      'Ask yourself: "How do I want to show up for myself and others today?"',
      'Select one value word (e.g. patience, courage, presence).',
      'Hold this intention in your awareness as you focus on your breath.'
    ],
    completionCriteria: 'Meditate for 10 minutes.',
    time: 10
  },
  'morning-calm-l3': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Radiant Day Starter',
    goal: 'Cultivate energy and readiness to meet the day',
    instructions: [
      'Take three deep, energizing breaths.',
      'Visualize yourself handling today\'s tasks with ease and confidence.',
      'Offer yourself a positive affirmation: "I am capable and present."',
      'Open your eyes, ready to step into your day.'
    ],
    completionCriteria: 'Meditate for 10 minutes.',
    time: 10
  },

  // Anxiety Relief Meditation
  'anxiety-relief-meditation-l1': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Body Anchor',
    goal: 'Locate a stable physical sensation to anchor your focus',
    instructions: [
      'Find a comfortable posture, placing your feet flat on the floor.',
      'Bring your attention to the contact of your body with the chair.',
      'Feel the weight and stability of this physical connection.',
      'Return to this physical anchor whenever anxious thoughts surge.'
    ],
    completionCriteria: 'Meditate for 10 minutes.',
    time: 10
  },
  'anxiety-relief-meditation-l2': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Sky and Clouds Defusion',
    goal: 'Observe thoughts as passing objects, not absolute truth',
    instructions: [
      'Close your eyes and observe the anxious thoughts passing through your mind.',
      'Visualize your mind as the wide, open blue sky.',
      'Imagine your anxious thoughts as passing clouds floating by.',
      'Observe them without holding onto them or pushing them away.'
    ],
    completionCriteria: 'Meditate for 10 minutes.',
    time: 10
  },
  'anxiety-relief-meditation-l3': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Softening Resistance',
    goal: 'Release physical resistance and allow feelings to pass',
    instructions: [
      'Acknowledge any tightness or racing heart rate without judgment.',
      'Breathe into these physical sensations, imagining them softening.',
      'Repeat: "This feeling is uncomfortable, but I am safe. It will pass."',
      'Let the sensation exist without fighting it.'
    ],
    completionCriteria: 'Meditate for 10 minutes.',
    time: 10
  },

  // Better Sleep
  'better-sleep-l1': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Deep Sleep Body Scan',
    goal: 'Progressively relax body parts to trigger somatic sleep readiness',
    instructions: [
      'Lie down comfortably in bed, ready to sleep.',
      'Bring your attention to your toes, relaxing them completely.',
      'Slowly move your awareness up through your feet, calves, knees, and thighs.',
      'Release any lingering tension in your torso, shoulders, neck, and face.'
    ],
    completionCriteria: 'Complete the full body scan.',
    time: 15
  },
  'better-sleep-l2': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Floating Thoughts Imagery',
    goal: 'Release active thoughts to allow the mind to quiet',
    instructions: [
      'Close your eyes and breathe softly.',
      'When an active thought arises, imagine placing it on a leaf.',
      'Watch the leaf float down a gentle stream and disappear.',
      'Do this with every thought, returning to the stream\'s flow.'
    ],
    completionCriteria: 'Meditate for 10 minutes.',
    time: 10
  },
  'better-sleep-l3': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Surrendered Rest',
    goal: 'Transition into deep resting states',
    instructions: [
      'Let go of any effort to control your breath.',
      'Feel the weight of your body fully supported by the mattress.',
      'Allow your mind to drift naturally without trying to achieve anything.',
      'Let sleep arrive on its own terms.'
    ],
    completionCriteria: 'Meditate for 15 minutes.',
    time: 15
  },

  // Focus Training
  'focus-training-l1': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Focus Anchor',
    goal: 'Train focus by keeping attention on the breath',
    instructions: [
      'Find a comfortable, alert seated posture.',
      'Focus attention on the physical sensation of breath at your nostrils.',
      'Observe the coolness as you inhale, and the warmth as you exhale.',
      'Keep your attention fixed on this small point.'
    ],
    completionCriteria: 'Meditate for 10 minutes.',
    time: 10
  },
  'focus-training-l2': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Distraction Labeler',
    goal: 'Label distractions neutrally and return to focus',
    instructions: [
      'Focus on your breath anchor.',
      'When your mind wanders, note it neutrally: say "thinking" or "feeling".',
      'Gently, without self-blame, redirect your focus back to the breath.',
      'Repeat this cycle of noticing, labeling, and returning.'
    ],
    completionCriteria: 'Meditate for 10 minutes.',
    time: 10
  },
  'focus-training-l3': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Mental Stamina Builder',
    goal: 'Build attentional endurance over a sustained period',
    instructions: [
      'Maintain your breath focus for an extended duration.',
      'Notice any restlessness or boredom that arises.',
      'Observe these states as temporary mind waves, and return to focus.',
      'Strengthen your attention span through persistence.'
    ],
    completionCriteria: 'Meditate for 10 minutes.',
    time: 10
  },

  // Self Compassion
  'self-compassion-l1': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Loving-Kindness Practice',
    goal: 'Cultivate friendly, accepting attitudes toward yourself',
    instructions: [
      'Find a comfortable posture and place a hand over your heart.',
      'Bring to mind a mental picture of yourself.',
      'Silently offer these phrases: "May I be safe. May I be happy. May I live with ease."',
      'Breathe into the warmth of these wishes.'
    ],
    completionCriteria: 'Meditate for 10 minutes.',
    time: 10
  },
  'self-compassion-l2': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Softening Inner Critic',
    goal: 'Soften critical self-talk using empathetic phrases',
    instructions: [
      'Recall a recent mistake or failure that made you criticize yourself.',
      'Recognize that struggle and imperfection are part of being human.',
      'Offer yourself support: "I did the best I could. I am worthy of kindness."',
      'Let go of the critical narrative.'
    ],
    completionCriteria: 'Meditate for 10 minutes.',
    time: 10
  },
  'self-compassion-l3': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Embracing Imperfection',
    goal: 'Accept your limitations with kindness',
    instructions: [
      'Sit quietly and reflect on a personal flaw or boundary.',
      'Observe any shame or frustration that arises.',
      'Breathe into these feelings, offering self-acceptance.',
      'Remember: you are enough, exactly as you are in this moment.'
    ],
    completionCriteria: 'Meditate for 10 minutes.',
    time: 10
  },

  // Mindfulness Basics
  'mindfulness-basics-l1': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Breath Awareness',
    goal: 'Observe the breath simply as it is, without controlling it',
    instructions: [
      'Sit comfortably and close your eyes.',
      'Observe the natural flow of your breath. Do not force it.',
      'Notice the pauses between the inhalation and exhalation.',
      'Rest in simple, effortless awareness.'
    ],
    completionCriteria: 'Meditate for 10 minutes.',
    time: 10
  },
  'mindfulness-basics-l2': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Somatic Check-in',
    goal: 'Anchor attention in raw physical sensations',
    instructions: [
      'Bring your attention to your physical body.',
      'Scan from your head to your feet, observing sensations of weight and touch.',
      'Feel the air on your skin, and the support of the chair.',
      'Observe everything objectively, without labeling it as good or bad.'
    ],
    completionCriteria: 'Meditate for 10 minutes.',
    time: 10
  },
  'mindfulness-basics-l3': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Living Mindfully',
    goal: 'Bring presence into daily actions and sensory contact',
    instructions: [
      'Open your eyes and tune into the sounds around you.',
      'Observe colors, shapes, and textures in your environment without labeling.',
      'Practice bringing this same open, sensory presence into your next task.',
      'Rest in the present moment.'
    ],
    completionCriteria: 'Meditate for 10 minutes.',
    time: 10
  },

  // Guided Journaling
  'guided-journaling-l1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Mental Download',
    goal: 'Empty your mind by writing freely',
    instructions: [
      'Set aside all distractions and prepare to write.',
      'Write continuously about whatever is on your mind. Do not filter.',
      'Don\'t worry about spelling or grammar; just let the words flow.',
      'Write until your mind feels lighter.'
    ],
    time: 10
  },
  'guided-journaling-l2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Emotion Map Log',
    goal: 'Trace complex feelings to boundaries and needs',
    instructions: [
      'Describe your dominant emotion right now.',
      'Write about what triggered this feeling today.',
      'Identify what boundary or personal need this emotion is pointing to.',
      'Formulate one constructive action to support this need.'
    ],
    time: 10
  },
  'guided-journaling-l3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Future Vision Script',
    goal: 'Align daily actions with your future self',
    instructions: [
      'Visualize yourself six months from now, feeling healthy and aligned.',
      'Describe your morning routine, your work day, and your evenings in detail.',
      'Identify the main value driving this future version of you.',
      'Write down one micro-habit you can practice tomorrow to align with this vision.'
    ],
    time: 10
  },

  // Gratitude Practice
  'gratitude-practice-l1': {
    type: EXERCISE_TYPE.GRATITUDE,
    title: 'Three Daily Blessings',
    goal: 'Scan for and appreciate positive daily events',
    instructions: [
      'Write down three positive things that happened in the last 24 hours.',
      'For each, describe *why* it happened and how it made you feel.',
      'Acknowledge any person who contributed to these moments.'
    ],
    time: 5
  },
  'gratitude-practice-l2': {
    type: EXERCISE_TYPE.GRATITUDE,
    title: 'Micro-Gratitude Tracker',
    goal: 'Find appreciation in small, routine sensory details',
    instructions: [
      'Identify three ordinary things you usually ignore (e.g. coffee, warm water).',
      'Reflect on how these elements improve your quality of life.',
      'Write a brief note of appreciation for each item.'
    ],
    time: 5
  },
  'gratitude-practice-l3': {
    type: EXERCISE_TYPE.GRATITUDE,
    title: 'Appreciation Draft',
    goal: 'Cultivate gratitude for key relationships',
    instructions: [
      'Think of a person who has supported or helped you recently.',
      'Draft a short message expressing exactly what they did and why you appreciate it.',
      'Reflect on how focusing on their kindness shifts your perspective.',
      'Consider sending the message to them.'
    ],
    time: 5
  },

  // Emotional Reflection
  'emotional-reflection-l1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Name Your State',
    goal: 'Develop emotional awareness by labeling feelings',
    instructions: [
      'Sit quietly for a moment. What is the main feeling present?',
      'Use specific emotional labels (e.g. anxious, disappointed, grateful).',
      'Describe the physical sensations associated with this emotion.',
      'Reflect on the message this feeling is bringing you.'
    ],
    time: 10
  },
  'emotional-reflection-l2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Trigger Map',
    goal: 'Connect daily events to mood shifts',
    instructions: [
      'Identify a moment today when your mood changed.',
      'Describe the event or thought that triggered this shift.',
      'Reflect on how you held this mood in your body.',
      'Write down how you would like to handle this trigger next time.'
    ],
    time: 10
  },
  'emotional-reflection-l3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Tension Write-Off',
    goal: 'Release residual emotional energy through writing',
    instructions: [
      'Write down any frustration, resentment, or worry you are carrying.',
      'Write continuously, expressing all raw thoughts.',
      'Once finished, write: "I release this energy. I am in control of my peace."',
      'Define one physical activity to complete the release.'
    ],
    time: 10
  },

  // Goal Setting
  'goal-setting-l1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Values Alignment Planner',
    goal: 'Ensure goals align with core personal values',
    instructions: [
      'Identify your top personal value (e.g., health, growth, kindness).',
      'Write down your main focus goal.',
      'Analyze how this goal supports your identified value.',
      'Rephrase your goal to reflect this value connection.'
    ],
    time: 10
  },
  'goal-setting-l2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Micro Habit Blueprint',
    goal: 'Deconstruct goals into small daily habit steps',
    instructions: [
      'Select a goal you want to achieve.',
      'Break it down into the smallest possible daily habit.',
      'Create your trigger stack: "When [cue], I will [micro habit]."',
      'Commit to a tracking method.'
    ],
    time: 10
  },
  'goal-setting-l3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Review System Setup',
    goal: 'Design a simple weekly accountability checklist',
    instructions: [
      'Define when and where you will review your habit progress.',
      'Outline three questions to ask yourself: what went well, what was hard, what will I adjust?',
      'Commit to a supportive, compassionate self-review style.'
    ],
    time: 10
  },

  // Weekly Review
  'weekly-review-l1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Wins & Consistency Audit',
    goal: 'Celebrate successes and evaluate habit execution',
    instructions: [
      'List three wins or successes from your week.',
      'Review your habit execution consistency percentage.',
      'Acknowledge the effort you put in, regardless of the completion rate.'
    ],
    time: 10
  },
  'weekly-review-l2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Friction Analysis',
    goal: 'Learn from weekly setbacks and plan adaptations',
    instructions: [
      'Identify the main challenge or friction point from this week.',
      'Analyze why it was difficult.',
      'Write down one adjustment to make this habit easier next week.'
    ],
    time: 10
  },
  'weekly-review-l3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Intentional Week Planner',
    goal: 'Set clear objectives and intentions for the upcoming week',
    instructions: [
      'Select one value focus for the week ahead.',
      'Commit to three specific habit targets.',
      'Write a brief motivational message to your future self.'
    ],
    time: 10
  },

  // Daily Reset
  'daily-reset-l1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Mid-Day Grounding',
    goal: 'Pause and ground attention during daily tasks',
    instructions: [
      'Take three slow, deep breaths.',
      'Check in with your body and release any tension in your jaw or shoulders.',
      'Write down one priority intention for the rest of your day.'
    ],
    time: 10
  },
  'daily-reset-l2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Transition Write-off',
    goal: 'Release daily mental tension before resting',
    instructions: [
      'Write down any pending work tasks or worries from today.',
      'Write: "I am parking these items for tomorrow. My day is done."',
      'Commit to fully logging off for the evening.'
    ],
    time: 10
  },
  'daily-reset-l3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Daily Close Reflection',
    goal: 'Conclude the day with appreciation and rest intentions',
    instructions: [
      'Write down one thing that went well today.',
      'Acknowledge your efforts and progress.',
      'Set a gentle intention for relaxation and restorative sleep.'
    ],
    time: 10
  }
};

export const DEFAULT_EXERCISES: Exercise[] = DEFAULT_LESSONS.map((lesson) => {
  // Let's determine exercise type and properties from our custom map
  const custom = CUSTOM_EXERCISES[lesson.id];

  const type = custom?.type || EXERCISE_TYPE.JOURNALING;
  const title = custom?.title || lesson.title;
  const goal = custom?.goal || 'Track automatic thoughts and emotional responses';
  const instructions = custom?.instructions || [
    'Take a moment to close your eyes and check in with yourself.',
    'Write down the situation you were in when you noticed a shift in your mood.',
    'Identify the exact thought passing through your mind.',
    'Rate the intensity of the emotion associated with that thought from 1-10.'
  ];
  const completionCriteria = custom?.completionCriteria || 'Save your reflection entry to progress.';
  const time = custom?.time || lesson.duration || 5;

  return {
    id: lesson.exerciseIds[0],
    lessonId: lesson.id,
    type,
    title,
    description: lesson.description,
    estimatedTime: time,
    content: {},
    sortOrder: 0,
    goal,
    instructions,
    completionCriteria
  };
});

