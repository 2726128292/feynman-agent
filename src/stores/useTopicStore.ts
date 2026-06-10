import { create } from 'zustand';
import { getDB, Topic } from '../db/database';

interface TopicState {
  topics: Topic[];
  currentTopic: Topic | null;
  loading: boolean;
  error: string | null;
  fetchTopics: () => Promise<void>;
  addTopic: (topic: Omit<Topic, 'id' | 'created_at' | 'updated_at'>) => Promise<Topic>;
  updateTopic: (id: string, updates: Partial<Topic>) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  setCurrentTopic: (topic: Topic | null) => void;
  getTopicById: (id: string) => Topic | undefined;
}

export const useTopicStore = create<TopicState>((set, get) => ({
  topics: [],
  currentTopic: null,
  loading: false,
  error: null,

  fetchTopics: async () => {
    set({ loading: true, error: null });
    try {
      const db = await getDB();
      const allTopics = await db.getAll('topics');
      const sortedTopics = allTopics.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      set({ topics: sortedTopics, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : '获取主题列表失败';
      set({ error: message, loading: false });
    }
  },

  addTopic: async (topicData) => {
    try {
      const db = await getDB();
      const now = new Date().toISOString();
      const newTopic: Topic = {
        ...topicData,
        id: crypto.randomUUID(),
        created_at: now,
        updated_at: now,
      };

      await db.add('topics', newTopic);
      set((state) => ({ topics: [newTopic, ...state.topics] }));
      return newTopic;
    } catch (error) {
      const message = error instanceof Error ? error.message : '添加主题失败';
      set({ error: message });
      throw error;
    }
  },

  updateTopic: async (id, updates) => {
    try {
      const db = await getDB();
      const existingTopic = await db.get('topics', id);

      if (!existingTopic) {
        throw new Error('主题不存在');
      }

      const updatedTopic: Topic = {
        ...existingTopic,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      await db.put('topics', updatedTopic);
      set((state) => ({
        topics: state.topics.map((t) => (t.id === id ? updatedTopic : t)),
        currentTopic:
          state.currentTopic?.id === id ? updatedTopic : state.currentTopic,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : '更新主题失败';
      set({ error: message });
      throw error;
    }
  },

  deleteTopic: async (id) => {
    try {
      const db = await getDB();
      await db.delete('topics', id);
      set((state) => ({
        topics: state.topics.filter((t) => t.id !== id),
        currentTopic:
          state.currentTopic?.id === id ? null : state.currentTopic,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : '删除主题失败';
      set({ error: message });
      throw error;
    }
  },

  setCurrentTopic: (topic) => {
    set({ currentTopic: topic });
  },

  getTopicById: (id) => {
    return get().topics.find((t) => t.id === id);
  },
}));
