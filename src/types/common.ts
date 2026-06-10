export type {
  Topic,
  TopicStatus,
} from './topic'

export type {
  ExplanationVersion,
  QuestionRound,
  Question,
  Answer,
} from './learning'

export type {
  GapType,
  Gap,
  DimensionScore,
  DiagnosisReport,
} from './diagnostic'

export type {
  PracticeItem,
  ReviewSchedule,
} from './practice'

export type {
  ProviderConfig,
  ProviderMessage,
  ProviderRequest,
  StreamChunk,
} from './provider'

export interface ExportJob {
  id: string
  scope: 'single' | 'all' | 'selected'
  format: string
  redact_secrets: boolean
  status: string
  file_url?: string
  created_at: string
  completed_at?: string
}

export interface ImportResult {
  success: boolean
  items_imported: number
  warnings: string[]
  topic_id?: string
}

export interface AgentTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: string
  system_prompt: string
}
