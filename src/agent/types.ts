/**
 * Agent 编排层 — 类型定义
 */

import type {
  ProviderMessage,
  StreamChunk,
} from '@/types/provider'
import type {
  DimensionScore,
  Gap,
  DiagnosisReport,
} from '@/types/diagnostic'
import type {
  PracticeItem,
} from '@/types/practice'
import type {
  Question,
} from '@/types/learning'

// ============================================================
// 引擎返回类型
// ============================================================

/** 讲解评审结果 */
export interface ReviewResult {
  overall_score: number
  dimensions: DimensionScore[]
  strengths: string[]
  improvements: string[]
  next_focus: string
}

/** 问答对 */
export interface QA {
  question: string
  answer: string
}

/** 苏格拉底追问生成结果 */
export interface QuestionGenerationResult {
  questions: Question[]
}

/** 缺口诊断结果（复用 DiagnosisReport） */
export type GapDiagnosisResult = DiagnosisReport

/** 练习生成结果 */
export interface PracticeGenerationResult {
  practice: PracticeItem
}

/** 主题规划结果 */
export interface TopicPlan {
  topic: string
  goal: string
  stages: PlanStage[]
  suggested_questions: string[]
  success_criteria: string
  total_estimated_minutes: number
}

export interface PlanStage {
  name: string
  description: string
  key_concepts: string[]
  activities: string[]
  estimated_minutes: number
}

// ============================================================
// 引擎配置
// ============================================================

export interface AgentEngineOptions {
  /** 是否启用模拟模式（无真实 Provider 时使用） */
  mockMode?: boolean
  /** 默认温度参数 */
  temperature?: number
  /** 最大 token 数 */
  maxTokens?: number
  /** 流式输出回调 */
  onStreamChunk?: (chunk: StreamChunk) => void
}

// ============================================================
// 内部工具类型
// ============================================================

/** Provider 调用选项 */
export interface CallProviderOptions {
  temperature?: number
  maxTokens?: number
  onStreamChunk?: (chunk: StreamChunk) => void
}
