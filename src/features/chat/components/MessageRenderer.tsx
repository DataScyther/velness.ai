/**
 * MessageRenderer
 *
 * Routes each message to its appropriate visual component based on
 * message.type. All Phase 2 block types are handled here.
 *
 * Parsing conventions:
 *   - Line 1: title / label
 *   - Remaining lines: body content
 *   - "Key: value" lines parsed for structured data (question, action, etc.)
 */

import React from 'react';
import { View } from 'react-native';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ExerciseCard } from './ExerciseCard';
import { CBTExerciseCard } from './CBTExerciseCard';
import { BreathingExerciseCard } from './BreathingExerciseCard';
import { JournalPromptCard } from './JournalPromptCard';
import { WellnessRecommendationCard } from './WellnessRecommendationCard';
import { ReflectionBlock } from './blocks/ReflectionBlock';
import { QuestionBlock } from './blocks/QuestionBlock';
import { ActionBlock } from './blocks/ActionBlock';
import { SummaryBlock } from './blocks/SummaryBlock';
import { InsightBlock } from './blocks/InsightBlock';
import { ResourceBlock } from './blocks/ResourceBlock';
import type { Message } from '../types/Message';

interface MessageRendererProps {
  message: Message;
  baseStyle: {
    fontSize: number;
    lineHeight: number;
    color: string;
  };
  codeBackground: string;
  linkColor: string;
  blockquoteBackground: string;
  blockquoteBorder: string;
}

// ─── Content Parsers ──────────────────────────────────────────────────────────

function parseLines(content: string) {
  return content.split('\n').filter(Boolean);
}

function parseReflection(content: string) {
  const lines = parseLines(content);
  return {
    title: lines[0] || undefined,
    body: lines.slice(1).join('\n').trim() || undefined,
  };
}

function parseQuestion(content: string) {
  const lines = parseLines(content);
  const labelLine = lines.find((l) => l.startsWith('Label:'));
  const questionLine = lines.find((l) => l.startsWith('Question:') || !l.startsWith('Label:'));
  return {
    label: labelLine?.replace(/^Label:\s*/i, '') || undefined,
    question:
      questionLine?.replace(/^Question:\s*/i, '') ||
      lines[0] ||
      content,
  };
}

function parseAction(content: string) {
  const lines = parseLines(content);
  return {
    title: lines[0] || 'Take a step',
    body: lines.slice(1).join('\n').trim() || undefined,
    actionLabel: undefined,
  };
}

function parseSummary(content: string) {
  const lines = parseLines(content);
  const titleLine = lines[0] || undefined;
  // Remaining lines are bullet points (strip leading - or * or numbered)
  const points = lines.slice(1).map((l) =>
    l.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim(),
  ).filter(Boolean);
  return { title: titleLine, points: points.length > 0 ? points : [content] };
}

function parseInsight(content: string) {
  const lines = parseLines(content);
  return {
    insight: lines[0] || content,
    supportingText: lines.slice(1).join(' ').trim() || undefined,
  };
}

function parseResource(content: string) {
  const lines = parseLines(content);
  let title = '';
  let description: string | undefined;
  let sourceName: string | undefined;
  let sourceUrl: string | undefined;

  for (const line of lines) {
    if (line.startsWith('Title:')) {
      title = line.replace(/^Title:\s*/i, '');
    } else if (line.startsWith('Description:')) {
      description = line.replace(/^Description:\s*/i, '');
    } else if (line.startsWith('Source:')) {
      sourceName = line.replace(/^Source:\s*/i, '');
    } else if (line.startsWith('URL:')) {
      sourceUrl = line.replace(/^URL:\s*/i, '');
    }
  }

  // Fallback: if no "Title:" prefix, use first line as title
  if (!title) {
    title = lines[0] || 'Resource';
    description = lines.slice(1).join(' ').trim() || undefined;
  }

  return { title, description, sourceName, sourceUrl };
}

// ─── Renderer ─────────────────────────────────────────────────────────────────

export const MessageRenderer = React.memo(function MessageRenderer(props: MessageRendererProps) {
  const { message, ...styleProps } = props;

  switch (message.type) {
    // ── Phase 2 conversation blocks ───────────────────────────────────────────
    case 'reflection': {
      const p = parseReflection(message.content);
      return <ReflectionBlock title={p.title} body={p.body} />;
    }
    case 'insight': {
      const p = parseInsight(message.content);
      return <InsightBlock insight={p.insight} supportingText={p.supportingText} />;
    }
    case 'question': {
      const p = parseQuestion(message.content);
      return <QuestionBlock label={p.label} question={p.question} />;
    }
    case 'action': {
      const p = parseAction(message.content);
      return <ActionBlock title={p.title} body={p.body} actionLabel={p.actionLabel} />;
    }
    case 'summary': {
      const p = parseSummary(message.content);
      return <SummaryBlock title={p.title} points={p.points} />;
    }
    case 'resource': {
      const p = parseResource(message.content);
      return (
        <ResourceBlock
          title={p.title}
          description={p.description}
          sourceName={p.sourceName}
          sourceUrl={p.sourceUrl}
        />
      );
    }

    // ── Legacy specialty cards (exercise, journal, breathing, wellness, cbt) ──
    case 'exercise': {
      const lines = parseLines(message.content);
      const title = lines[0] || undefined;
      const duration = lines[1]?.replace(/^duration:?\s*/i, '') || undefined;
      return <ExerciseCard title={title} duration={duration} />;
    }
    case 'cbt-exercise':
      return <CBTExerciseCard content={message.content} />;
    case 'breathing':
      return <BreathingExerciseCard content={message.content} />;
    case 'journal':
      return <JournalPromptCard content={message.content} />;
    case 'wellness':
      return <WellnessRecommendationCard content={message.content} />;

    // ── Default: full Markdown rendering ─────────────────────────────────────
    default:
      return (
        <View>
          <MarkdownRenderer {...styleProps} text={message.content} />
        </View>
      );
  }
});

export default MessageRenderer;

