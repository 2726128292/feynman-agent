export interface Topic {
  id: string
  title: string
  category: string
  goal: string
  privacy_level: 'local_only' | 'allow_cloud' | 'ask_every_time'
  tags: string[]
  mastery: number
  status: TopicStatus
  template_id?: string
  created_at: string
  updated_at: string
}

export type TopicStatus =
  | 'topic_created'
  | 'explaining'
  | 'questioning'
  | 'diagnosing'
  | 'reinforcing'
  | 'scheduled'

export const TOPIC_STATUS_LABELS: Record<TopicStatus, string> = {
  topic_created: '已创建',
  explaining: '讲解中',
  questioning: '追问中',
  diagnosing: '诊断中',
  reinforcing: '补强中',
  scheduled: '复习中',
}

export const PRIVACY_LEVEL_LABELS: Record<string, string> = {
  local_only: '仅本地处理',
  allow_cloud: '允许云端',
  ask_every_time: '每次询问',
}
