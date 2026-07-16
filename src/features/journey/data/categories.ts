import { CATEGORY_ID } from '../constants';
import type { Category } from '../models/Category';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: CATEGORY_ID.CBT,
    title: 'CBT',
    description: 'Reframe thoughts and build cognitive skills',
    iconType: 'brain',
    accentColor: '#6C4CF1',
    exerciseCount: 6,
    sortOrder: 0,
  },
  {
    id: CATEGORY_ID.BREATHING,
    title: 'Breathing',
    description: 'Regulate your nervous system and relax',
    iconType: 'wind',
    accentColor: '#06B6D4',
    exerciseCount: 3,
    sortOrder: 1,
  },
  {
    id: CATEGORY_ID.MEDITATION,
    title: 'Meditation',
    description: 'Cultivate presence and daily focus',
    iconType: 'sparkles',
    accentColor: '#8B5CF6',
    exerciseCount: 3,
    sortOrder: 2,
  },
  {
    id: CATEGORY_ID.WELLNESS,
    title: 'Wellness Studio',
    description: 'Reflect and build positive habits',
    iconType: 'leaf',
    accentColor: '#10B981',
    exerciseCount: 3,
    sortOrder: 3,
  },
];

