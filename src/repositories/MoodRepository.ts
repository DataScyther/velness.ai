/**
 * Mood Repository
 *
 * Manages mood data — single source of truth for all mood operations.
 * Components never own mood state; they only display what this repository provides.
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { storageService } from '@/services/storage';
import type { Mood } from '@/shared/types';

const COLLECTION = 'users';

function getLocalKey(uid: string): string {
  return `moods_${uid}`;
}

export class MoodRepository {
  async loadMoods(uid: string): Promise<Mood[]> {
    if (!uid) return [];

    const local = await this.loadFromLocal(uid);
    if (local.length > 0) return local;

    const fromCloud = await this.loadFromCloud(uid);
    if (fromCloud.length > 0) {
      await this.persistMoods(uid, fromCloud);
    }
    return fromCloud;
  }

  async saveMood(uid: string, entry: Mood): Promise<void> {
    if (!uid) return;

    await this.persistMoods(uid, [entry]);
    await this.syncToCloud(uid, entry);
  }

  async syncToCloud(uid: string, entry: Mood): Promise<void> {
    if (!uid || !db) return;
    try {
      const docRef = doc(db, COLLECTION, uid, 'moods', entry.id);
      await setDoc(docRef, {
        id: entry.id,
        rating: entry.rating,
        note: entry.note,
        timestamp: Timestamp.fromDate(entry.timestamp),
        ...(entry.label !== undefined ? { label: entry.label } : {}),
      });
    } catch (error) {
      console.error('Error syncing mood to cloud:', error);
      throw error;
    }
  }

  /**
   * Background cloud sync — fetches from Firestore, merges into local cache.
   * Never blocks UI. Safe to call at any time.
   */
  async syncFromCloud(uid: string): Promise<Mood[]> {
    if (!uid) return [];
    const cloudData = await this.loadFromCloud(uid);
    if (cloudData.length > 0) {
      await this.persistMoods(uid, cloudData);
    }
    return this.loadFromLocal(uid);
  }

  async persistMoods(uid: string, entries: Mood[]): Promise<void> {
    if (!uid || entries.length === 0) return;
    try {
      const key = getLocalKey(uid);
      const existing = await storageService.getJSON<Mood[]>(key) || [];
      const merged = [...existing];
      for (const entry of entries) {
        const idx = merged.findIndex((m) => m.id === entry.id);
        if (idx >= 0) {
          merged[idx] = entry;
        } else {
          merged.push(entry);
        }
      }
      await storageService.setJSON(key, merged);
    } catch (error) {
      console.error('Error persisting moods locally:', error);
    }
  }

  private async loadFromLocal(uid: string): Promise<Mood[]> {
    try {
      const local = await storageService.getJSON<Mood[]>(getLocalKey(uid));
      return local || [];
    } catch {
      return [];
    }
  }

  private async loadFromCloud(uid: string): Promise<Mood[]> {
    if (!db) return [];
    try {
      const moodsRef = collection(db, COLLECTION, uid, 'moods');
      const moodsQuery = query(moodsRef, orderBy('timestamp', 'asc'));
      const snapshot = await getDocs(moodsQuery);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        const mood: Mood = {
          id: data.id,
          rating: data.rating as Mood['rating'],
          note: data.note || '',
          timestamp: (data.timestamp as Timestamp).toDate(),
        };
        if (data.label !== undefined) {
          mood.label = data.label;
        }
        return mood;
      });
    } catch (error) {
      console.error('Error loading moods from cloud:', error);
      return [];
    }
  }
}

export const moodRepository = new MoodRepository();
export default moodRepository;
