export type GapType = 'concept' | 'causal' | 'example' | 'boundary' | 'transfer'

export interface Gap {
  id: string
  topic_id: string
  type: GapType
  severity: 'high' | 'medium' | 'low'
  description: string
  suggestion: string
  task_status: string
  score: number
}

export interface DimensionScore {
  type: GapType
  label: string
  score: number
  description: string
}

export interface DiagnosisReport {
  topic_id: string
  overall_mastery: number
  dimensions: DimensionScore[]
  gaps: Gap[]
  generated_at: string
}
