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
  // CBT Foundations - Lesson 1: Understanding Thoughts
  // (Maps to the lesson-generated exercise id cbt-foundations-l1-ex1)
  'cbt-foundations-l1-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Thought Logging',
    goal: 'Build awareness of your stream of thoughts by writing them down, then connect them to the situation and emotion',
    instructions: [
      'Sit comfortably and observe your thoughts without judgment.',
      'Write down the most prominent thought in your mind right now.',
      'Recall the exact situation you were in when the thought occurred (who, what, where).',
      'Name the emotion you felt and rate its intensity from 1-10.'
    ],
    completionCriteria: 'Save your observation to complete this step.'
  },
  // CBT Foundations - Lesson 2: Identify Distortions
  'cbt-foundations-l2-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Automatic Thoughts & Evidence',
    goal: 'Identify rapid, automatic reactions to a trigger and test them against the evidence',
    instructions: [
      'Describe a recent situation that caused a sudden shift in your mood.',
      'Write down the very first automatic thought that came to mind and rate how strongly you believe it (0-100%).',
      'List objective, factual evidence that supports this thought.',
      'List objective, factual evidence that contradicts this thought.'
    ],
    completionCriteria: 'Save your automatic thought and evidence to complete this step.'
  },
  // CBT Foundations - Lesson 3: Challenge Thoughts
  'cbt-foundations-l3-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Thinking Traps & Balanced View',
    goal: 'Recognize common cognitive distortions and develop a balanced, alternative perspective based on evidence',
    instructions: [
      'Review common traps: all-or-nothing thinking, catastrophizing, mind reading, emotional reasoning.',
      'Write down a recent negative thought and identify which thinking trap(s) it represents.',
      'Rephrase it objectively, removing the trap\'s exaggeration.',
      'Write a new, balanced thought that incorporates all the facts and re-rate your belief in the original thought.'
    ],
    completionCriteria: 'Save your balanced reframe to complete this step.'
  },
  // CBT Foundations - Lesson 4: Replace Thoughts
  'cbt-foundations-l4-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Perspective Shift & Balanced Thinking',
    goal: 'View a stressful situation from a different angle and develop a moderate, realistic thought',
    instructions: [
      'Describe a situation that is currently causing you stress.',
      'Imagine how a close, supportive friend would view this situation and write down what they would say.',
      'Write down the extreme positive and extreme negative outcomes, then identify the most realistic balanced outcome in between.',
      'Write a balanced thought summarizing this middle ground and rate how it changes your emotional intensity.'
    ],
    completionCriteria: 'Save your balanced thought to complete this step.'
  },
  // CBT Foundations - Lesson 5: Daily Practice
  'cbt-foundations-l5-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Thought Mastery Plan',
    goal: 'Establish a sustainable plan for daily thought awareness and a grounding statement',
    instructions: [
      'Summarize the key thinking traps and triggers you identified in this program.',
      'Commit to a daily thought-checking routine (e.g. 5 minutes every evening).',
      'Write a core grounding statement to remind you that thoughts are not facts.',
      'List one action you can take to cope if a worrying prediction starts to feel likely.'
    ],
    completionCriteria: 'Save your daily practice plan to complete this step.'
  },

  // CBT Foundations - Lesson 6: Reflection
  'cbt-foundations-l6-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Program Reflection',
    goal: 'Consolidate your CBT learnings into a long-term self-care playbook and name the insight that helped you most',
    instructions: [
      'Summarize the most important insight or tool you learned about your mind during this CBT program.',
      'Write one sentence about who you are becoming as you master your thought patterns.',
      'Choose one insight to share with a friend or write down in a physical journal.',
      'Commit to a daily check-in time to keep your cognitive skills sharp.'
    ],
    completionCriteria: 'Save your reflection to complete the program.'
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
  // Lesson 1: Recognizing Anxiety
  'managing-anxiety-l1-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Calming Breath Reset',
    goal: 'Slow down physiological arousal with paced breathing',
    instructions: [
      'Find a comfortable seat and place one hand on your belly.',
      'Inhale slowly through your nose for 4 seconds, feeling your belly expand.',
      'Exhale gently through pursed lips for 6 seconds.',
      'Repeat this cycle for 2 minutes, then note your physical calmness.'
    ]
  },
  'managing-anxiety-l1-ex2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Anxiety Signal Audit',
    goal: 'Audit your typical cognitive and somatic anxiety triggers',
    instructions: [
      'Reflect on the past week and list two situations that triggered anxiety.',
      'For each situation, describe the initial warning sign you noticed.',
      'Did you notice it in your mind (thoughts) or body (sensations) first?',
      'Reflect on how catching triggers early can help you slow down the response.'
    ]
  },
  'managing-anxiety-l1-ex3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Anxiety Compass Log',
    goal: 'Log and demystify anxiety as a biological alarm system',
    instructions: [
      'Write down a recent situation where you felt significant anxiety.',
      'List the exact thoughts and physical sensations you experienced.',
      'Acknowledge the feeling as a survival-driven fight-or-flight response.',
      'Write: "My body was trying to protect me, but there was no actual danger."'
    ]
  },
  'managing-anxiety-l1-ex4': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Notice the Alarm',
    goal: 'Observe the rise of anxiety triggers without running away',
    instructions: [
      'Recall a minor upcoming stressor (e.g., an email you need to send).',
      'Close your eyes and visualize starting the task, letting the alert rise.',
      'Instead of immediately avoiding it, sit with the alarm for 1 minute.',
      'Notice that the alarm peaks and slowly begins to fade on its own.'
    ]
  },
  'managing-anxiety-l1-ex5': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Alarm System Check',
    goal: 'Evaluate your perception of anxiety as a protector vs a danger',
    instructions: [
      'Rate how dangerous the feeling of anxiety felt to you (1-10) before this lesson.',
      'Rate how dangerous it feels now, knowing it is a safety alarm (1-10).',
      'Explain what changed in your perspective.',
      'Commit to viewing the next anxiety wave as an over-eager alarm, not a threat.'
    ]
  },

  // Lesson 2: Body Awareness
  'managing-anxiety-l2-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Somatic Body Breath',
    goal: 'Direct breath to release localized physical tension',
    instructions: [
      'Close your eyes and locate the area in your body holding the most tension.',
      'Inhale deeply, visualizing the breath flowing directly to that tense space.',
      'Exhale slowly, imagining the tension softening and leaving with your breath.',
      'Repeat this for 5 cycles and describe any physical release.'
    ]
  },
  'managing-anxiety-l2-ex2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Body Scan Audit',
    goal: 'Audit somatic signals of anxiety across your entire body',
    instructions: [
      'Slowly scan your body from your feet up to your jaw.',
      'Identify three distinct physical sensations (e.g., tight shoulders, shallow breathing, butterflies).',
      'Notice if you are actively fighting these sensations or holding your breath.',
      'Gently soften your posture and allow the sensations to exist without resistance.'
    ]
  },
  'managing-anxiety-l2-ex3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Somatic Map Journal',
    goal: 'Describe physical sensations using objective, neutral language',
    instructions: [
      'Focus on a current or recent physical symptom of anxiety.',
      'Describe the sensation objectively (e.g., "tightness in chest", "buzzing in hands").',
      'Avoid alarmist words like "heart attack" or "choking".',
      'Write a neutral statement: "My chest feels tight, and I can still breathe safely."'
    ]
  },
  'managing-anxiety-l2-ex4': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Somatic Welcoming',
    goal: 'Sit with physical discomfort to build somatic tolerance',
    instructions: [
      'Locate a physical sensation of anxiety or tension in your body.',
      'Set a timer for 2 minutes and focus your attention entirely on the sensation.',
      'Welcome it by repeating silently: "It is okay for this sensation to be here."',
      'Observe how the physical feeling shifts, spreads, or decreases over time.'
    ]
  },
  'managing-anxiety-l2-ex5': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Somatic Tolerance Check',
    goal: 'Evaluate the intensity and safety of physical sensations',
    instructions: [
      'Rate the discomfort of the physical sensation from 1 to 10.',
      'Write down what you learned by observing it without trying to fix it.',
      'Confirm that the sensation did not harm you and was temporary.',
      'Write: "Physical sensations are uncomfortable, but they are safe and survivable."'
    ]
  },

  // Lesson 3: Safety Behaviors
  'managing-anxiety-l3-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Anchored Grounding Breath',
    goal: 'Stabilize attention with paced breathing and sensory anchors',
    instructions: [
      'Inhale for 4 seconds, hold for 4 seconds, and exhale for 4 seconds.',
      'As you breathe, name three physical objects in your room to anchor your eyes.',
      'Notice the physical support of the chair or floor underneath you.',
      'Describe how this combination of breath and grounding affects your focus.'
    ]
  },
  'managing-anxiety-l3-ex2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Safety Behavior Audit',
    goal: 'Identify your common avoidant and escape behaviors',
    instructions: [
      'List three safety behaviors you use to escape anxiety (e.g., checking phone, avoiding eye contact, leaving early).',
      'Explain how each safety behavior makes you feel in the short term.',
      'Explain how each behavior keeps your anxiety alive in the long term.',
      'Select one behavior you want to challenge in this lesson.'
    ]
  },
  'managing-anxiety-l3-ex3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Avoidance Cost Log',
    goal: 'Reflect on the long-term impact of relying on safety behaviors',
    instructions: [
      'Journal about a recent time you avoided a situation due to anxiety.',
      'What did you miss out on or what was the cost of this avoidance?',
      'How does avoiding a situation reinforce the belief that you cannot handle it?',
      'Reflect on how facing discomfort opens up opportunities for freedom.'
    ]
  },
  'managing-anxiety-l3-ex4': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Safety Behavior Delay',
    goal: 'Practice delaying avoidant habits to build tolerance to distress',
    instructions: [
      'The next time you feel anxious, identify the safety behavior you want to perform.',
      'Set a timer and commit to delaying that behavior for exactly 5 minutes.',
      'Sit with the discomfort and breathe slowly during the delay.',
      'Notice if the urge to perform the safety behavior decreases after 5 minutes.'
    ]
  },
  'managing-anxiety-l3-ex5': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Delay Reflection',
    goal: 'Evaluate the outcome of delaying your safety behavior',
    instructions: [
      'Describe the safety behavior you delayed and how long you delayed it.',
      'Rate your urge to perform the behavior (1-10) before and after the delay.',
      'Did the anxiety decrease naturally without the safety behavior?',
      'Write: "I can feel anxious and delay safety behaviors; my body knows how to calm down on its own."'
    ]
  },

  // Lesson 4: Exposure Planning
  'managing-anxiety-l4-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Box Breathing for Courage',
    goal: 'Calm the nervous system before approaching a challenge',
    instructions: [
      'Prepare to plan an exposure task by box breathing.',
      'Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold empty for 4 seconds.',
      'Complete 4 rounds of this box breathing cycle.',
      'Note the sense of physiological stability and focus.'
    ]
  },
  'managing-anxiety-l4-ex2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Exposure Ladder Design',
    goal: 'Design a graded exposure ladder for a specific fear target',
    instructions: [
      'Identify a situation or task you avoid due to anxiety.',
      'Break this situation down into 3-5 progressive steps, from easiest to hardest.',
      'Rate the expected anxiety level (0-100%) for each step on your ladder.',
      'Identify the first step you will take (ideally scoring between 30% and 50% anxiety).'
    ]
  },
  'managing-anxiety-l4-ex3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Expectation Testing Log',
    goal: 'Document predictions and fears before performing exposure',
    instructions: [
      'Write down the exposure task you plan to complete.',
      'What is your specific prediction? (e.g. "If I speak, they will mock me").',
      'What is the worst-case scenario, and how will you cope if it happens?',
      'Write down the actual probability of that worst case occurring.'
    ]
  },
  'managing-anxiety-l4-ex4': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Micro-Exposure Run',
    goal: 'Execute a small exposure step and observe actual distress',
    instructions: [
      'Complete the first step of your exposure ladder.',
      'Focus on staying in the situation, breathing slowly, without using safety behaviors.',
      'Note your anxiety level at the start, peak, and end of the exposure.',
      'Wait for the anxiety to decrease by at least 50% before leaving.'
    ]
  },
  'managing-anxiety-l4-ex5': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Outcome Comparison',
    goal: 'Evaluate actual exposure results against initial predictions',
    instructions: [
      'Compare what actually happened during the exposure to your prediction.',
      'Did the worst-case scenario occur? Did you cope successfully?',
      'Rate the accuracy of your initial fear from 0% to 100%.',
      'Write: "My mind predicted danger, but the reality was safe and manageable."'
    ]
  },

  // Lesson 5: Recovery Toolkit
  'managing-anxiety-l5-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Calm Integration Breath',
    goal: 'Use physiological sighs to trigger rapid nervous system recovery',
    instructions: [
      'Take a deep inhale through your nose, followed immediately by a quick second sniff.',
      'Exhale slowly and fully through your mouth, letting your entire body relax.',
      'Complete 3 rounds of this double-inhale, slow-exhale sigh.',
      'Reflect on how this breath pattern acts as an instant release valve for stress.'
    ]
  },
  'managing-anxiety-l5-ex2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Anxiety Playbook Mapping',
    goal: 'Consolidate your top somatic, cognitive, and behavioral tools',
    instructions: [
      'Select your most effective somatic tool (e.g., box breathing, body scan).',
      'Select your most effective cognitive tool (e.g., cognitive reframing, reality testing).',
      'Select your primary exposure tool (e.g., safety behavior delay, graded steps).',
      'Map these into a 3-step emergency playbook to use during anxiety spikes.'
    ]
  },
  'managing-anxiety-l5-ex3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Resilience Anchor Journal',
    goal: 'Write a supportive reminder of your capacity to manage distress',
    instructions: [
      'Write a short letter to yourself, to be read when anxiety feels overwhelming.',
      'Remind yourself of what you have learned: anxiety is an alarm, sensations are safe, and you can cope.',
      'Highlight a successful moment from this program where you tolerated discomfort.',
      'End with a strong statement of self-support and trust.'
    ]
  },
  'managing-anxiety-l5-ex4': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Daily Exposure Commitment',
    goal: 'Commit to daily micro-exposures to prevent avoidance relapse',
    instructions: [
      'Identify one micro-exposure you can easily perform daily (e.g., asking a question, making eye contact).',
      'How does maintaining a habit of facing minor fears protect your progress?',
      'Write a formal commitment: "I commit to facing minor challenges daily to keep my confidence strong."',
      'Decide on a cue to trigger this daily action.'
    ]
  },
  'managing-anxiety-l5-ex5': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Recovery Toolkit Checklist',
    goal: 'Evaluate your confidence in using your anxiety management toolkit',
    instructions: [
      'Rate your confidence (1-10) in your ability to manage future anxiety spikes.',
      'Which tools will you practice regularly to keep them sharp?',
      'Identify one potential obstacle to using your toolkit, and how you will overcome it.',
      'Write: "I am equipped, I am capable, and I am the manager of my own peace."'
    ]
  },

  // CBT - Emotional Regulation
  'emotional-regulation-l1-ex1': {
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
  'emotional-regulation-l2-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Somatic Welcoming',
    goal: 'Observe and welcome an emotional wave without resistance',
    instructions: [
      'Recall a recent situation where you felt a strong, uncomfortable emotion.',
      'Focus on the physical sensation of that emotion in your body.',
      'Practice breathing space around it, releasing any physical clenching or bracing.',
      'Observe the feeling like a wave, letting it rise and fall without trying to force it away.'
    ]
  },
  'emotional-regulation-l3-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Emotion Wheel Audit',
    goal: 'Translate vague mood states into precise secondary emotions',
    instructions: [
      'Select a vague mood state you felt today (e.g., "bad", "stressed", "off").',
      'Unpack it: are you feeling rejected, overwhelmed, ignored, disappointed, or tired?',
      'Write down the specific secondary emotions you discover.',
      'Reflect on how naming them changes their emotional intensity.'
    ]
  },
  'emotional-regulation-l4-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Somatic Cooling Resets',
    goal: 'Practice physiological resets and the STOP technique',
    instructions: [
      'Identify a physical reset tool to use when emotions spike (e.g. splashing cold water, box breathing).',
      'Map out the STOP steps: Stop, Take a breath, Observe, Proceed.',
      'Write down how your physical tension level changed after visualizing this pause.',
      'Commit to using STOP when your emotional intensity exceeds a 6/10.'
    ]
  },
  'emotional-regulation-l5-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Emotional Dialectic Builder',
    goal: 'Accept intense feelings while committing to values-aligned actions',
    instructions: [
      'Describe a current difficult emotion you are experiencing.',
      'Write a non-judgmental acceptance statement for this feeling.',
      'Write a commitment statement for a helpful action you want to take anyway.',
      'Combine them into a dialectical statement: "I feel [emotion] AND I can still choose to [action]."'
    ]
  },

  // CBT - Building Confidence
  'building-confidence-l1-ex1': {
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
  'building-confidence-l1-ex2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Evidence Collection',
    goal: 'Gather factual evidence to challenge negative core beliefs',
    instructions: [
      'Write down a negative core belief you identified in your audit.',
      'List three factual experiences that directly contradict this belief.',
      'Reflect on how you typically dismiss or minimize this counter-evidence.',
      'Write a balanced summary that incorporates both the belief and the evidence.'
    ]
  },
  'building-confidence-l1-ex3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Strength Inventory',
    goal: 'Catalog your personal competencies and inner resources',
    instructions: [
      'List five personal strengths or qualities you possess.',
      'For each strength, describe a specific situation where you used it.',
      'Identify which strength you underuse and why.',
      'Commit to using this underused strength in the next 24 hours.'
    ]
  },
  'building-confidence-l2-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Inner Critic Journal',
    goal: 'Answer harsh self-criticism with supportive self-compassion',
    instructions: [
      'Write down a harsh self-criticism you made today.',
      'Imagine a friend came to you with this exact same concern.',
      'Write down what you would say to support and encourage them.',
      'Direct that exact response back to yourself in writing.'
    ]
  },
  'building-confidence-l2-ex2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Reframe Thoughts',
    goal: 'Transform critical thoughts into balanced, realistic statements',
    instructions: [
      'Capture one critical thought your inner voice repeated today.',
      'Identify the cognitive distortion present (e.g. catastrophizing, labeling).',
      'Write a realistic, neutral alternative to this thought.',
      'Notice how your emotional intensity shifts with the reframed version.'
    ]
  },
  'building-confidence-l2-ex3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Compassion Response',
    goal: 'Develop a habitual compassionate reply to self-judgment',
    instructions: [
      'Recall a moment of self-judgment from the past week.',
      'Write a compassionate phrase you wish you had said to yourself.',
      'Identify the underlying need or fear the judgment was masking.',
      'Design a 3-step compassion ritual to use when the critic appears.'
    ]
  },
  'building-confidence-l3-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Personal Wins',
    goal: 'Identify and document your recent accomplishments',
    instructions: [
      'List three things you have done well or challenges you overcame.',
      'For each, identify the personal strength you used (e.g. perseverance, kindness).',
      'Write down how you can apply one of these strengths in your life today.',
      'Acknowledge your capacity to grow and handle future obstacles.'
    ]
  },
  'building-confidence-l3-ex2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Character Strength Finder',
    goal: 'Identify your top character strengths using real-life evidence',
    instructions: [
      'Review the VIA classification: wisdom, courage, humanity, justice, temperance, transcendence.',
      'Select two categories where you feel naturally strong.',
      'List specific examples from your life that demonstrate these strengths.',
      'Write how you can deliberately use one strength tomorrow.'
    ]
  },
  'building-confidence-l3-ex3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Daily Success Reflection',
    goal: 'Build a nightly habit of recognizing small daily victories',
    instructions: [
      'Scan your day and identify one moment you handled well.',
      'Describe what you did and why it mattered.',
      'Name the quality or skill that helped you succeed.',
      'Express gratitude to yourself for showing up and trying.'
    ]
  },
  'building-confidence-l4-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Values Ranking',
    goal: 'Reinforce self-worth by connecting actions to core values',
    instructions: [
      'Identify one value that is deeply important to you (e.g. honesty, creativity).',
      'Write about a time you acted in alignment with this value.',
      'List one small action you can take today to express this value.',
      'Note how living your values supports your confidence independently of performance.'
    ]
  },
  'building-confidence-l4-ex2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Identity Alignment',
    goal: 'Align your daily actions with your authentic core identity',
    instructions: [
      'Describe the person you want to be at your best.',
      'Identify one area where your current actions conflict with this identity.',
      'Brainstorm one small change to bridge the gap between action and identity.',
      'Write an identity statement: "I am someone who..." based on your values.'
    ]
  },
  'building-confidence-l4-ex3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Purpose Reflection',
    goal: 'Connect your daily efforts to a deeper sense of meaning',
    instructions: [
      'Reflect on what gives your life a sense of direction or purpose.',
      'Describe how your daily routines do or do not serve this purpose.',
      'Identify one value-aligned goal that moves you toward your purpose.',
      'Write a purpose statement that anchors your confidence in meaning.'
    ]
  },
  'building-confidence-l5-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Confidence Action Plan',
    goal: 'Take a small, value-aligned risk to build efficacy',
    instructions: [
      'Define a small action that makes you slightly nervous but aligns with your values.',
      'State when and where you will complete this challenge.',
      'Write down your cope-ahead plan: how will you support yourself regardless of the outcome?',
      'Commit to taking the step and logging the result.'
    ]
  },
  'building-confidence-l5-ex2': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Fear Ladder',
    goal: 'Break down a feared situation into manageable, graded steps',
    instructions: [
      'Identify a situation that makes you feel anxious or avoids.',
      'List 5 smaller sub-steps leading up to this situation, from least to most anxiety-provoking.',
      'Choose the first step on your ladder and commit to taking it.',
      'Write a coping statement to repeat when you take this first step.'
    ]
  },
  'building-confidence-l5-ex3': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Future Self Letter',
    goal: 'Write a letter from your future confident self to your present self',
    instructions: [
      'Imagine yourself one year from now, having grown in confidence.',
      'Write a letter from this future self to your present self.',
      'Describe what the future self learned, overcame, and now believes.',
      'End with a piece of encouragement and advice for the journey ahead.'
    ]
  },

  // CBT - Healthy Habits
  'healthy-habits-l1-ex1': {
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
  'healthy-habits-l2-ex1': {
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
  'healthy-habits-l3-ex1': {
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
  'healthy-habits-l4-ex1': {
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
  'healthy-habits-l5-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Identity Integration Playbook',
    goal: 'Align your habits with your core values and desired identity',
    instructions: [
      'State the type of person you want to become (e.g., "I want to be a healthy, active person").',
      'List two small, daily habits that act as physical proof of this identity.',
      'Explain how you will maintain these identity-based habits over the next month.'
    ]
  },

  // 1 Minute Reset
  '1-minute-reset-l1-ex1': {
    type: EXERCISE_TYPE.BREATHING,
    title: '1 Minute Reset',
    goal: 'A quick 1-minute breathing space to reset and ground yourself',
    instructions: [
      'Sit comfortably and let your shoulders drop.',
      'Inhale slowly through your nose for 5 seconds.',
      'Exhale gently through your nose or mouth for 5 seconds.',
      'Maintain this slow, rhythmic pace for the duration of the timer.'
    ],
    completionCriteria: 'Breathe continuously through the 1-minute reset.',
    time: 1
  },
  // 3 Minute Calm
  '3-minute-calm-l1-ex1': {
    type: EXERCISE_TYPE.BREATHING,
    title: '3 Minute Calm',
    goal: 'Paced breathing to calm the mind and body',
    instructions: [
      'Sit tall and close your eyes.',
      'Inhale slowly and deeply for 5 seconds.',
      'Exhale smoothly and completely for 5 seconds.',
      'Focus on the physical sensation of the air entering and leaving your body.'
    ],
    completionCriteria: 'Maintain paced calm cycles for 3 minutes.',
    time: 3
  },
  // Box Breathing
  'box-breathing-l1-ex1': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Box Breathing',
    goal: 'The classic 4-second equal-count breathing technique used for focus and stress relief',
    instructions: [
      'Sit comfortably and let your shoulders drop.',
      'Inhale slowly through your nose for 4 seconds.',
      'Hold your breath with relaxed lungs for 4 seconds.',
      'Exhale gently through your mouth for 4 seconds.',
      'Hold empty for 4 seconds. Repeat the cycle.'
    ],
    completionCriteria: 'Breathe continuously through 4-4-4-4 box cycles.',
    time: 5
  },
  // 4-7-8 Breathing
  '4-7-8-breathing-l1-ex1': {
    type: EXERCISE_TYPE.BREATHING,
    title: '4-7-8 Breathing',
    goal: 'A deeply relaxing breathing pattern that acts as a natural tranquilizer for the nervous system',
    instructions: [
      'Exhale completely through your mouth with a "whoosh" sound.',
      'Inhale quietly through your nose for 4 seconds.',
      'Hold your breath for a count of 7 seconds.',
      'Exhale completely through your mouth with a "whoosh" for 8 seconds.',
      'Repeat this cycle.'
    ],
    completionCriteria: 'Maintain the 4-7-8 rhythm for the duration of the timer.',
    time: 5
  },
  // Deep Relaxation
  'deep-relaxation-l1-ex1': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Deep Relaxation',
    goal: 'Sustained slow breathing to release deep-seated physical and mental tension',
    instructions: [
      'Find a comfortable lying or seated posture.',
      'Inhale slowly for 5 seconds, filling your abdomen first, then chest.',
      'Exhale gently for 5 seconds, releasing all muscular tension.',
      'Let your mind settle into the slow, steady rhythm of your body.'
    ],
    completionCriteria: 'Sustain slow resonant breathing for 10 minutes.',
    time: 10
  },
  // Focus Breathing
  'focus-breathing-l1-ex1': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Focus Breathing',
    goal: 'Energising breathing cycles to boost alertness and mental clarity',
    instructions: [
      'Sit tall with your eyes open and focus your gaze on a single point.',
      'Inhale rapidly for 2 seconds.',
      'Exhale rapidly for 2 seconds.',
      'Keep the breaths light, crisp, and rhythmic.'
    ],
    completionCriteria: 'Breathe with energizing focus for 3 minutes.',
    time: 3
  },
  // Sleep Breathing
  'sleep-breathing-l1-ex1': {
    type: EXERCISE_TYPE.BREATHING,
    title: 'Sleep Breathing',
    goal: 'Slow diaphragmatic breathing with extended exhales to prepare for deep rest',
    instructions: [
      'Lie down in bed and dim the lights.',
      'Inhale slowly and quietly for 6 seconds.',
      'Exhale very slowly and gently for 6 seconds, letting go of any thoughts.',
      'Pause briefly and effortlessly before the next inhale.'
    ],
    completionCriteria: 'Breathe slowly for 15 minutes to transition to sleep.',
    time: 15
  },

  // ─── Meditation Redesign ───────────────────────────────────────────
  'sleep-meditation-l1-ex1': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Sleep Meditation',
    goal: 'Wind down your body and mind with calming body scans and visualizations.',
    instructions: [
      'Get into a comfortable lying position in a quiet, dark room.',
      'Allow your eyes to close and take three deep, slow breaths.',
      'Begin scanning your body from head to toe, releasing muscle groups as you scan.',
      'If thoughts arise, gently label them "thinking" and return to the scan.'
    ],
    completionCriteria: 'Complete the timer to transition to reflection.',
    time: 15
  },
  'stress-meditation-l1-ex1': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Stress Meditation',
    goal: 'Somatic calming and releasing daily mental chatter.',
    instructions: [
      'Sit in a posture that is upright yet relaxed.',
      'Allow your focus to rest on the physical expansion and contraction of your chest.',
      'On each exhale, consciously soften your shoulders, neck, and jaw.',
      'Give yourself permission to pause all problem-solving for the duration.'
    ],
    completionCriteria: 'Complete the timer to transition to reflection.',
    time: 10
  },
  'focus-meditation-l1-ex1': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Focus Meditation',
    goal: 'Train your brain to anchor attention, recognize distraction, and return to focus.',
    instructions: [
      'Find a quiet spot. Fix your gaze softly on a point or close your eyes.',
      'Anchor your awareness at the tip of your nose, feeling the cool air of inhale.',
      'When your mind wanders, note the distraction neutrally and return to the anchor.',
      'Acknowledge each return as a successful focus repetition.'
    ],
    completionCriteria: 'Complete the timer to transition to reflection.',
    time: 10
  },
  'anxiety-meditation-l1-ex1': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Anxiety Meditation',
    goal: 'Mindfulness practices specifically designed to create space around anxious feelings.',
    instructions: [
      'Settle into a comfortable, supportive seat.',
      'Observe anxious thoughts as passing clouds in the wide sky of your mind.',
      'Name physical sensations of anxiety (tightness, warmth) without trying to change them.',
      'Inhale spaciousness around the sensations; exhale soft release.'
    ],
    completionCriteria: 'Complete the timer to transition to reflection.',
    time: 15
  },
  'confidence-meditation-l1-ex1': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Confidence Meditation',
    goal: 'Inner strength alignment and positive self-visualization.',
    instructions: [
      'Sit comfortably and bring a straight, confident posture to your spine.',
      'Recall a moment in your life when you felt capable, strong, and in flow.',
      'Allow the physical sensations of that memory to expand across your chest.',
      'Incorporate this feeling of capacity into your breath cycles.'
    ],
    completionCriteria: 'Complete the timer to transition to reflection.',
    time: 10
  },
  'gratitude-meditation-l1-ex1': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Gratitude Meditation',
    goal: 'Rewire your focus toward the positive aspects of your life through active appreciation.',
    instructions: [
      'Close your eyes and breathe into your heart space.',
      'Bring to mind three simple things in your life that you appreciate.',
      'Focus on the physical feeling of appreciation and warmth in your body.',
      'Wish yourself and those objects of gratitude well.'
    ],
    completionCriteria: 'Complete the timer to transition to reflection.',
    time: 10
  },
  'self-compassion-meditation-l1-ex1': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Self Compassion Meditation',
    goal: 'Cultivating warmth, understanding, and kind acceptance of ourselves.',
    instructions: [
      'Place a hand gently over your heart or on your arm.',
      'Acknowledge any current difficulty or discomfort you are experiencing.',
      'Offer yourself warm, kind thoughts: "May I accept myself as I am, may I be gentle with myself."',
      'Let go of the need for perfection or self-criticism.'
    ],
    completionCriteria: 'Complete the timer to transition to reflection.',
    time: 12
  },

  // ─── Wellness Studio Redesign ───────────────────────────────────────
  'gratitude-journal-l1-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Gratitude Journal',
    goal: 'Write down small things that brought you comfort, joy, or satisfaction today.',
    instructions: [
      'Take a moment to reflect on your day from morning until now.',
      'Identify three distinct items (people, events, comforts) that you are grateful for.',
      'Write down each item and describe why it made a difference to your day.'
    ],
    completionCriteria: 'Write and save your journal entry to complete.',
    time: 5
  },
  'positive-affirmations-l1-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Positive Affirmations',
    goal: 'Ground yourself in supportive, self-directed beliefs to counter self-doubt.',
    instructions: [
      'Read or formulate statements of capacity: e.g., "I am resilient, I grow through challenges."',
      'Focus on the feeling of these statements in your body.',
      'Write down the affirmations that resonate with you most right now.'
    ],
    completionCriteria: 'Write and save your affirmations to complete.',
    time: 5
  },
  'digital-detox-l1-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Digital Detox',
    goal: 'Step away from screen activities and clear cognitive stimulation.',
    instructions: [
      'Place your device screen-down or set it aside.',
      'Spend the next 15 minutes engaging with your immediate physical environment (stretch, look out a window, sit in silence).',
      'Once the timer ends, write down a brief reflection on your sensory experience.'
    ],
    completionCriteria: 'Complete the pause and log your reflection to finish.',
    time: 15
  },
  'sleep-preparation-l1-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Sleep Preparation',
    goal: 'Slowing down breathing patterns and body cues to prepare for deep rest.',
    instructions: [
      'Dim the lights in your room and sit comfortably.',
      'Follow a slow, diaphragmatic breathing rhythm (e.g. 5s inhale, 5s exhale).',
      'Reflect on winding down and write down any thoughts you want to park for tomorrow.'
    ],
    completionCriteria: 'Log your bedtime transition reflections to complete.',
    time: 10
  },
  'mindful-walking-l1-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Mindful Walking',
    goal: 'Bring sensory awareness to your physical steps and surrounding environment.',
    instructions: [
      'Walk at a natural, unhurried pace.',
      'Notice the sensation of your feet connecting with the ground on each step.',
      'Identify three sounds, three colors, and two physical textures around you.',
      'After walking, write down the sights and sensations you observed.'
    ],
    completionCriteria: 'Log your sensory walking observations to complete.',
    time: 10
  },
  'body-scan-l1-ex1': {
    type: EXERCISE_TYPE.MEDITATION,
    title: 'Body Scan',
    goal: 'Progressively scanning your body to release stored somatic tension.',
    instructions: [
      'Find a comfortable posture, seated or lying down.',
      'Close your eyes and bring your attention to the top of your head.',
      'Gradually move your focus down your body, noting and softening any tight areas.',
      'Reflect on how your somatic awareness shifted during the scan.'
    ],
    completionCriteria: 'Complete the body scan to progress.',
    time: 15
  },
  'self-check-in-l1-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Self Check-in',
    goal: 'Scan your current physical, mental, and emotional state.',
    instructions: [
      'Pause and close your eyes. Take a deep, settling breath.',
      'Scan your body for physical tension, your mind for active thoughts, and your heart for current feelings.',
      'Log these observations to capture a snapshot of your state.'
    ],
    completionCriteria: 'Save your self check-in details to complete.',
    time: 5
  },
  'grounding-exercise-l1-ex1': {
    type: EXERCISE_TYPE.JOURNALING,
    title: 'Grounding Exercise',
    goal: 'Somatic pauses to stabilize your state in stressful transitions.',
    instructions: [
      'Find a steady seated or standing posture, feeling your weight fully supported.',
      'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.',
      'Take three slow, deep breaths, letting the shoulders sink on exhalations.',
      'Reflect on how this pause affected your level of calm.'
    ],
    completionCriteria: 'Save your grounding reflection to complete.',
    time: 5
  }
};

export const DEFAULT_EXERCISES: Exercise[] = DEFAULT_LESSONS.flatMap((lesson) => {
  return lesson.exerciseIds.map((exId) => {
    const custom = CUSTOM_EXERCISES[exId] || CUSTOM_EXERCISES[lesson.id];

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
      id: exId,
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
});

