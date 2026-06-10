import type { TopicStatus } from './topic'

export interface ExplanationVersion {
  id: string
  topic_id: string
  round: number
  content: string
  clarity_score: number
  word_count: number
  created_at: string
}

export interface QuestionRound {
  id: string
  explanation_id: string
  questions: Question[]
  answers: Answer[]
  status: TopicStatus
  round_number: number
}

export interface Question {
  id: string
  content: string
  strategy: string
  target_gap?: string
}

export interface Answer {
  id: string
  question_id: string
  content: string
  created_at: string
}
