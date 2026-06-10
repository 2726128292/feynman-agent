import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Topic {
  id: string;
  title: string;
  description?: string;
  category: string;
  privacy_level: 'public' | 'private' | 'team';
  status: 'active' | 'archived' | 'completed';
  mastery: number;
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: string;
  topic_id: string;
  type: 'text' | 'url' | 'file' | 'note';
  content: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Explanation {
  id: string;
  topic_id: string;
  round: number;
  content: string;
  provider_id: string;
  created_at: string;
}

export interface QuestionRound {
  id: string;
  explanation_id: string;
  questions: Array<{
    id: string;
    question: string;
    answer: string;
    user_answer?: string;
    is_correct?: boolean;
  }>;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  completed_at?: string;
}

export interface Gap {
  id: string;
  topic_id: string;
  type: 'knowledge' | 'skill' | 'concept';
  description: string;
  severity: 'low' | 'medium' | 'high';
  task_status: 'identified' | 'practicing' | 'mastered';
  source_question_ids: string[];
  created_at: string;
}

export interface PracticeItem {
  id: string;
  gap_id: string;
  type: 'exercise' | 'quiz' | 'application' | 'teaching';
  content: string;
  result?: 'success' | 'partial' | 'failed' | 'skipped';
  attempts: number;
  mastery: number;
  created_at: string;
  completed_at?: string;
}

export interface ReviewSchedule {
  id: string;
  topic_id: string;
  practice_id: string;
  due_at: string;
  interval_days: number;
  ease_factor: number;
  result?: 'reviewed' | 'skipped' | 'overdue';
  last_reviewed_at?: string;
  created_at: string;
}

export interface ProviderConfig {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'google' | 'custom';
  api_key?: string;
  base_url?: string;
  model: string;
  parameters?: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExportJob {
  id: string;
  topic_id: string;
  format: 'pdf' | 'markdown' | 'json' | 'html';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_path?: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export interface Setting {
  key: string;
  value: unknown;
  updated_at: string;
}

interface FeynmanAgentDB extends DBSchema {
  topics: {
    key: string;
    value: Topic;
    indexes: {
      'by-category': string;
      'by-privacy_level': string;
      'by-status': string;
      'by-created_at': string;
      'by-mastery': number;
    };
  };
  materials: {
    key: string;
    value: Material;
    indexes: {
      'by-topic_id': string;
      'by-type': string;
      'by-created_at': string;
    };
  };
  explanations: {
    key: string;
    value: Explanation;
    indexes: {
      'by-topic_id': string;
      'by-round': number;
      'by-created_at': string;
    };
  };
  questionRounds: {
    key: string;
    value: QuestionRound;
    indexes: {
      'by-explanation_id': string;
      'by-status': string;
    };
  };
  gaps: {
    key: string;
    value: Gap;
    indexes: {
      'by-topic_id': string;
      'by-type': string;
      'by-severity': string;
      'by-task_status': string;
    };
  };
  practiceItems: {
    key: string;
    value: PracticeItem;
    indexes: {
      'by-gap_id': string;
      'by-type': string;
      'by-mastery': number;
    };
  };
  reviewSchedules: {
    key: string;
    value: ReviewSchedule;
    indexes: {
      'by-topic_id': string;
      'by-practice_id': string;
      'by-due_at': string;
      'by-result': string;
    };
  };
  providerConfigs: {
    key: string;
    value: ProviderConfig;
    indexes: {
      'by-type': string;
      'by-name': string;
    };
  };
  exportJobs: {
    key: string;
    value: ExportJob;
    indexes: {
      'by-status': string;
      'by-format': string;
      'by-created_at': string;
    };
  };
  settings: {
    key: string;
    value: Setting;
    indexes: {};
  };
}

let dbInstance: IDBPDatabase<FeynmanAgentDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<FeynmanAgentDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<FeynmanAgentDB>('feynman-agent-db', 1, {
    upgrade(db) {
      // Topics store
      if (!db.objectStoreNames.contains('topics')) {
        const topicStore = db.createObjectStore('topics', { keyPath: 'id' });
        topicStore.createIndex('by-category', 'category');
        topicStore.createIndex('by-privacy_level', 'privacy_level');
        topicStore.createIndex('by-status', 'status');
        topicStore.createIndex('by-created_at', 'created_at');
        topicStore.createIndex('by-mastery', 'mastery');
      }

      // Materials store
      if (!db.objectStoreNames.contains('materials')) {
        const materialStore = db.createObjectStore('materials', { keyPath: 'id' });
        materialStore.createIndex('by-topic_id', 'topic_id');
        materialStore.createIndex('by-type', 'type');
        materialStore.createIndex('by-created_at', 'created_at');
      }

      // Explanations store
      if (!db.objectStoreNames.contains('explanations')) {
        const explanationStore = db.createObjectStore('explanations', { keyPath: 'id' });
        explanationStore.createIndex('by-topic_id', 'topic_id');
        explanationStore.createIndex('by-round', 'round');
        explanationStore.createIndex('by-created_at', 'created_at');
      }

      // Question rounds store
      if (!db.objectStoreNames.contains('questionRounds')) {
        const questionStore = db.createObjectStore('questionRounds', { keyPath: 'id' });
        questionStore.createIndex('by-explanation_id', 'explanation_id');
        questionStore.createIndex('by-status', 'status');
      }

      // Gaps store
      if (!db.objectStoreNames.contains('gaps')) {
        const gapStore = db.createObjectStore('gaps', { keyPath: 'id' });
        gapStore.createIndex('by-topic_id', 'topic_id');
        gapStore.createIndex('by-type', 'type');
        gapStore.createIndex('by-severity', 'severity');
        gapStore.createIndex('by-task_status', 'task_status');
      }

      // Practice items store
      if (!db.objectStoreNames.contains('practiceItems')) {
        const practiceStore = db.createObjectStore('practiceItems', { keyPath: 'id' });
        practiceStore.createIndex('by-gap_id', 'gap_id');
        practiceStore.createIndex('by-type', 'type');
        practiceStore.createIndex('by-mastery', 'mastery');
      }

      // Review schedules store
      if (!db.objectStoreNames.contains('reviewSchedules')) {
        const reviewStore = db.createObjectStore('reviewSchedules', { keyPath: 'id' });
        reviewStore.createIndex('by-topic_id', 'topic_id');
        reviewStore.createIndex('by-practice_id', 'practice_id');
        reviewStore.createIndex('by-due_at', 'due_at');
        reviewStore.createIndex('by-result', 'result');
      }

      // Provider configs store
      if (!db.objectStoreNames.contains('providerConfigs')) {
        const providerStore = db.createObjectStore('providerConfigs', { keyPath: 'id' });
        providerStore.createIndex('by-type', 'type');
        providerStore.createIndex('by-name', 'name');
      }

      // Export jobs store
      if (!db.objectStoreNames.contains('exportJobs')) {
        const exportStore = db.createObjectStore('exportJobs', { keyPath: 'id' });
        exportStore.createIndex('by-status', 'status');
        exportStore.createIndex('by-format', 'format');
        exportStore.createIndex('by-created_at', 'created_at');
      }

      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });

  return dbInstance;
}

export type { FeynmanAgentDB };
