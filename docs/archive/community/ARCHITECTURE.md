# Community Feature — Archived Architecture

> Community was postponed (not cancelled). This doc captures what was built and how it connected, so it can be revived later without reverse-engineering.

## Overview

Anonymous peer support with AI-moderated discussions. Users could create posts, comment, react, and report content within group contexts.

## Navigation (removed)

- Tab: `community` (4th tab between Journey and Profile)
- Routes: `/(tabs)/community/feed`, `/(tabs)/community/post/[postId]`, `/(tabs)/community/post/create`, `/(tabs)/community/moderation`, `/(tabs)/community/report/[targetType]/[targetId]`

## Data Model

| Entity | Firestore Collection | Key Fields |
|--------|---------------------|------------|
| Post | `posts` | authorId, authorName, content, groupId, reactionCounts, commentCount, isFlagged |
| Comment | `posts/{postId}/comments` | authorId, authorName, content, parentCommentId |
| Reaction | `posts/{postId}/reactions` | type, userId |
| Report | `reports` | targetType, targetId, reporterId, reason, status |

## State Flow

- **TanStack Query** keys: `['feed', uid]`, `['post', postId]`, `['postComments', postId]`, `['reports']`
- **Realtime**: Firestore `onSnapshot` subscriptions via useRealtimeCollection/useRealtimeDocument
- **Mutations**: Optimistic updates with rollback on error

## Dependencies

- `@/lib/firestore.ts`: postsRef, postDocRef, postCommentsRef, postCommentsDocRef, postReactionsRef, postReactionDocRef, reportsRef, reportDocRef
- `@/repositories/CommunityRepository.ts`: Orchestrated all Firestore reads/writes
- `@/hooks/mutations/useCommunityMutations.ts`: useCreatePost, useDeletePost, useAddComment, useDeleteComment, useToggleReaction, useCreateReport, useModerateReport
- `@/hooks/realtime/`: useRealtimeFeed, useRealtimePost, useRealtimePostComments

## Screens

- **CommunityFeedScreen**: FlatList of posts with refresh, reactions, navigation to detail/create
- **PostDetailScreen**: Full post view with comments, reactions, reply input
- **CreatePostScreen**: Text input with optional group selector
- **ModerationScreen**: Report queue with dismiss/action controls
- **ReportScreen**: Reason picker + description form

## Components

- **PostCard**: Post preview with author avatar, timestamp, reaction bar, comment count
- **CommentList**: Recursive comment thread (parent+reply)
- **ReactionBar**: Emoji-style reaction buttons
- **CreatePostFAB**: Floating action button for new posts

## Why It Was Removed

Community was postponed to focus on core features (Home, Chat, Journey, Profile). The code was removed cleanly in phases to avoid dead code accumulation. The feature flag was `community: true` in `src/core/config/features.ts`.
