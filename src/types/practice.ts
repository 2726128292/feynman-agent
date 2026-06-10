export interface PracticeItem {
  id: string
  gap_id: string
  type: 'explanation' | 'choice' | 'counter_example' | 'analogy'
  prompt: string
  hints: string[]
  answer: string
  mastery: number
  attempts: number
}

export interface ReviewSchedule {
  id: string
  topic_id: string
  practice_id: string
  due_at: string
  interval: number
  ease_factor: number
  result: string
  last_reviewed_at?: string
}
