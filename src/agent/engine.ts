/**
 * Agent 编排层 — FeynmanAgentEngine 主引擎
 * 协调 Prompt 模板、Provider 调用和响应解析
 */

import {
  SYSTEM_PROMPT,
  REVIEW_EXPLANATION_PROMPT,
  SOCRATIC_QUESTION_PROMPT,
  DIAGNOSE_GAPS_PROMPT,
  GENERATE_PRACTICE_PROMPT,
  PLAN_TOPIC_PROMPT,
} from './prompts'
import type {
  ReviewResult,
  QA,
  QuestionGenerationResult,
  GapDiagnosisResult,
  PracticeGenerationResult,
  TopicPlan,
  CallProviderOptions,
} from './types'
import type {
  ProviderMessage,
  ProviderConfig,
  StreamChunk,
} from '@/types/provider'
import type {
  Gap,
  DimensionScore,
} from '@/types/diagnostic'
import type {
  PracticeItem,
} from '@/types/practice'
import type {
  Question,
} from '@/types/learning'

// ============================================================
// 模拟数据工厂 — 用于无真实 Provider 时的演示
// ============================================================

function mockReviewResult(topic: string): ReviewResult {
  return {
    overall_score: 72,
    dimensions: [
      { type: 'concept', label: '概念清晰度', score: 78, description: `对「${topic}」的核心概念有基本把握，但部分关键术语的解释还可以更通俗化。` },
      { type: 'causal', label: '因果关系', score: 65, description: '"为什么"层面的解释较为薄弱，建议多追问"这背后的原因是什么"。' },
      { type: 'example', label: '实例支撑', score: 75, description: '使用了实例来支撑观点，但例子类型略显单一，可以增加跨领域的类比。' },
      { type: 'boundary', label: '认知边界', score: 70, description: '对概念的适用范围有一定认知，但对局限性提及不足。' },
      { type: 'transfer', label: '迁移能力', score: 68, description: '尚未充分展示将此知识迁移到新场景的能力。' },
    ],
    strengths: [
      '讲解结构清晰，有明确的逻辑主线',
      '能够用自己的语言组织内容，避免了机械背诵',
      '对核心定义的把握基本准确',
    ],
    improvements: [
      '尝试用生活中更常见的例子来类比抽象概念',
      '在解释每个要点后，主动补充"这意味着什么"',
      '明确指出该知识的适用边界和不适用场景',
    ],
    next_focus: 'causal',
  }
}

function mockQuestions(topic: string): Question[] {
  return [
    {
      id: 'q-1',
      content: `你提到「${topic}」的核心概念，能用自己的话再简单复述一遍吗？如果要让一个完全不懂这个领域的人听懂，你会怎么说？`,
      strategy: 'clarification',
      target_gap: 'concept',
    },
    {
      id: 'q-2',
      content: `为什么「${topic}」会是这样运作的？背后最根本的原因是什么？如果这个原因不存在了，会发生什么变化？`,
      strategy: 'elaboration',
      target_gap: 'causal',
    },
    {
      id: 'q-3',
      content: `能否举一个「${topic}」在日常生活中的例子？如果把这个概念应用到一个完全不相关的领域，你觉得会是什么样的？`,
      strategy: 'hypothetical',
      target_gap: 'transfer',
    },
  ]
}

function mockDiagnosis(topic: string): GapDiagnosisResult {
  const now = new Date().toISOString()
  return {
    topic_id: `mock-${topic}`,
    overall_mastery: 68,
    dimensions: [
      { type: 'concept', label: '概念清晰度', score: 78, description: '核心概念理解尚可，但细节层面存在模糊区域。' },
      { type: 'causal', label: '因果关系', score: 55, description: '因果链条断裂明显，多处"为什么"未能回答。' },
      { type: 'example', label: '实例支撑', score: 72, description: '有实例但数量和多样性不足。' },
      { type: 'boundary', label: '认知边界', score: 65, description: '对局限性的意识不够强。' },
      { type: 'transfer', label: '迁移能力', score: 60, description: '跨域迁移能力较弱。' },
    ] as DimensionScore[],
    gaps: [
      {
        id: 'gap-causal-1',
        type: 'causal',
        severity: 'high',
        description: `无法清晰说明「${topic}」运作的根本原因，停留在表面描述。`,
        suggestion: '建议通过绘制因果链图来梳理"因为A所以B所以C"的逻辑关系。',
        task_status: 'pending',
        score: 55,
      },
      {
        id: 'gap-example-1',
        type: 'example',
        severity: 'medium',
        description: '所举实例局限于单一领域，缺乏多样性和生活化案例。',
        suggestion: '尝试从日常生活、自然界、技术产品三个不同角度各找一个例子。',
        task_status: 'pending',
        score: 72,
      },
      {
        id: 'gap-transfer-1',
        type: 'transfer',
        severity: 'medium',
        description: '未能展示将该概念迁移到新情境中的能力。',
        suggestion: '练习"如果不谈X，这个原理还能用来解释什么？"的思考方式。',
        task_status: 'pending',
        score: 60,
      },
    ] as Gap[],
    generated_at: now,
  }
}

function mockPractice(gap: Gap): PracticeItem {
  const practiceMap: Record<string, PracticeItem> = {
    causal: {
      id: 'practice-causal-1',
      gap_id: gap.id,
      type: 'explanation',
      prompt: `请针对以下知识缺口进行深度讲解：\n\n${gap.description}\n\n请用"因为...所以..."的句式，完整梳理出至少三层因果链。`,
      hints: [
        '从最直接的原因开始，一层层往下挖',
        '每一层的"为什么"都要有答案',
        '如果某个环节说不通，那可能就是真正的理解盲区',
      ],
      answer: '期望用户能用清晰的因果链（至少3层）解释该概念的根本运作机制，每一步都有逻辑支撑。',
      mastery: 0,
      attempts: 0,
    },
    example: {
      id: 'practice-example-1',
      gap_id: gap.id,
      type: 'analogy',
      prompt: `针对以下薄弱点，请创造一个新的类比：\n\n${gap.description}\n\n要求：从你熟悉的一个完全不相关的领域（如烹饪、运动、游戏等）中找到一个可以类比的场景。`,
      hints: [
        '想想日常生活中有没有类似"输入→处理→输出"的过程',
        '好的类比往往来自意想不到的地方',
        '确保类比的关键特征与原概念一一对应',
      ],
      answer: '期望用户提供一个贴切的跨领域类比，并能解释类比与原概念的对应关系。',
      mastery: 0,
      attempts: 0,
    },
    transfer: {
      id: 'practice-transfer-1',
      gap_id: gap.id,
      type: 'counter_example',
      prompt: `知识迁移挑战：\n\n${gap.description}\n\n假设你需要向一位从事完全不同职业的人（如艺术家、工程师、教师）解释这个概念，你会怎么用对方的语言来说明？`,
      hints: [
        '先了解对方领域的核心词汇',
        '找到两个领域之间的桥梁概念',
        '用对方熟悉的框架来重新包装你的知识',
      ],
      answer: '期望用户能用目标受众的语言和思维框架成功解释该概念，展现跨域迁移能力。',
      mastery: 0,
      attempts: 0,
    },
    concept: {
      id: 'practice-concept-1',
      gap_id: gap.id,
      type: 'explanation',
      prompt: `概念重述练习：\n\n${gap.description}\n\n请在不查看任何资料的情况下，用不超过5句话重新定义这个核心概念，要求一个初中生也能听懂。`,
      hints: [
        '避免使用专业术语',
        '用"就像..."这样的比喻开头',
        '说完后自问：我奶奶能听懂吗？',
      ],
      answer: '期望用户给出简洁、通俗、准确的概念定义，适合非专业人士理解。',
      mastery: 0,
      attempts: 0,
    },
    boundary: {
      id: 'practice-boundary-1',
      gap_id: gap.id,
      type: 'choice',
      prompt: `边界识别练习：\n\n${gap.description}\n\n请列出：(1) 这个概念肯定适用的3个场景；(2) 这个概念可能不适用的2个场景；(3) 你不确定是否适用的1个场景。`,
      hints: [
        '适用场景要具体，不要泛泛而谈',
        '不适用场景往往是检验理解的试金石',
        '"不确定"的场景正是你最需要去探索的方向',
      ],
      answer: '期望用户能清晰划分概念的适用边界，并对模糊地带有清醒认识。',
      mastery: 0,
      attempts: 0,
    },
  }

  return practiceMap[gap.type] || practiceMap.concept
}

function mockTopicPlan(topic: string, goal: string): TopicPlan {
  return {
    topic,
    goal: goal || '全面掌握该主题的核心知识和应用能力',
    stages: [
      {
        name: '概念建立',
        description: '梳理核心概念体系，建立基础认知框架',
        key_concepts: [`「${topic}」的定义`, '核心组成要素', '基本工作原理'],
        activities: ['阅读基础材料并提炼关键词', '用自己的话写下概念定义', '画出概念关系图'],
        estimated_minutes: 20,
      },
      {
        name: '首次讲解',
        description: '模拟向他人讲授该主题，检测初步理解程度',
        key_concepts: ['完整讲解叙事', '自检逻辑漏洞'],
        activities: ['录制/撰写5分钟讲解稿', '自我评审讲解质量', '标注不确定的部分'],
        estimated_minutes: 15,
      },
      {
        name: '苏格拉底追问',
        description: '通过系统化问答发现深层理解缺口',
        key_concepts: ['因果链完整性', '实例丰富度', '边界认知'],
        activities: ['回答引导性问题', '反思回答过程中的犹豫点', '记录需要进一步研究的问题'],
        estimated_minutes: 25,
      },
      {
        name: '补强精炼',
        description: '针对性弥补发现的薄弱环节',
        key_concepts: ['定向补强', '二次讲解'],
        activities: ['针对弱项进行专项练习', '重新组织讲解内容', '简化表达使其更易懂'],
        estimated_minutes: 20,
      },
    ],
    suggested_questions: [
      `「${topic}」最本质的特征是什么？如果去掉它还是同一个东西吗？`,
      `这个概念是如何产生的？它解决了什么问题？`,
      `能不能用一个日常生活中的现象来类比「${topic}」？`,
    ],
    success_criteria: '能够用通俗易懂的语言向非专业人士完整讲解该主题，并能正确回答关于"为什么""举例""边界""迁移"四个方向的追问。',
    total_estimated_minutes: 80,
  }
}

// ============================================================
// JSON 安全解析工具
// ============================================================

/**
 * 从 LLM 响应文本中安全提取 JSON
 * 处理可能的 markdown 代码块包裹
 */
function safeJsonParse<T>(text: string): T | null {
  // 尝试直接解析
  try {
    return JSON.parse(text) as T
  } catch {
    // 尝试提取 markdown 代码块中的 JSON
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch?.[1]) {
      try {
        return JSON.parse(jsonMatch[1].trim()) as T
      } catch {
        return null
      }
    }
    return null
  }
}

// ============================================================
// FeynmanAgentEngine 主引擎
// ============================================================

export class FeynmanAgentEngine {
  private currentProvider: ProviderConfig | null = null
  private mockMode: boolean = true

  constructor(options?: { provider?: ProviderConfig | null; mockMode?: boolean }) {
    this.currentProvider = options?.provider ?? null
    this.mockMode = options?.mockMode ?? true
  }

  /** 设置当前使用的 Provider */
  setProvider(provider: ProviderConfig | null): void {
    this.currentProvider = provider
    this.mockMode = provider === null
  }

  /** 启用/禁用模拟模式 */
  setMockMode(enabled: boolean): void {
    this.mockMode = enabled
  }

  // ============================================================
  // 公开 API 方法
  // ============================================================

  /**
   * 评审用户的讲解内容
   */
  async reviewExplanation(topic: string, content: string): Promise<ReviewResult> {
    if (this.mockMode) {
      // 模拟延迟以提供真实的异步体验
      await this.simulateDelay(800)
      return mockReviewResult(topic)
    }

    const messages: ProviderMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: REVIEW_EXPLANATION_PROMPT(topic, content) },
    ]

    const responseText = await this.callProvider(messages, { temperature: 0.3 })
    const result = safeJsonParse<ReviewResult>(responseText)

    if (!result) {
      console.warn('[FeynmanAgent] Failed to parse review response, falling back to mock data')
      return mockReviewResult(topic)
    }

    return result
  }

  /**
   * 生成苏格拉底式追问
   */
  async generateQuestions(
    topic: string,
    explanation: string,
    history: QA[],
  ): Promise<Question[]> {
    if (this.mockMode) {
      await this.simulateDelay(600)
      return mockQuestions(topic)
    }

    const previousQa = history
      .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`)
      .join('\n\n')

    const messages: ProviderMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: SOCRATIC_QUESTION_PROMPT(topic, explanation, previousQa, ''),
      },
    ]

    const responseText = await this.callProvider(messages, { temperature: 0.7 })
    const result = safeJsonParse<QuestionGenerationResult>(responseText)

    if (!result?.questions?.length) {
      console.warn('[FeynmanAgent] Failed to parse questions response, falling back to mock data')
      return mockQuestions(topic)
    }

    return result.questions
  }

  /**
   * 进行五维知识缺口诊断
   */
  async diagnoseGaps(
    topic: string,
    explanation: string,
    qaHistory: QA[],
  ): Promise<GapDiagnosisResult> {
    if (this.mockMode) {
      await this.simulateDelay(1000)
      return mockDiagnosis(topic)
    }

    const qaText = qaHistory
      .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`)
      .join('\n\n')

    const messages: ProviderMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: DIAGNOSE_GAPS_PROMPT(topic, explanation, qaText) },
    ]

    const responseText = await this.callProvider(messages, { temperature: 0.3 })
    const result = safeJsonParse<GapDiagnosisResult>(responseText)

    if (!result) {
      console.warn('[FeynmanAgent] Failed to parse diagnosis response, falling back to mock data')
      return mockDiagnosis(topic)
    }

    return result
  }

  /**
   * 针对特定知识缺口生成练习题
   */
  async generatePractice(gap: Gap, topic: string): Promise<PracticeItem> {
    if (this.mockMode) {
      await this.simulateDelay(500)
      return mockPractice(gap)
    }

    const messages: ProviderMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: GENERATE_PRACTICE_PROMPT(gap.description, topic) },
    ]

    const responseText = await this.callProvider(messages, { temperature: 0.6 })
    const result = safeJsonParse<PracticeGenerationResult>(responseText)

    if (!result?.practice) {
      console.warn('[FeynmanAgent] Failed to parse practice response, falling back to mock data')
      return mockPractice(gap)
    }

    return result.practice
  }

  /**
   * 为学习主题制定首轮计划
   */
  async planTopic(
    topic: string,
    goal: string,
    materials: string,
  ): Promise<TopicPlan> {
    if (this.mockMode) {
      await this.simulateDelay(1200)
      return mockTopicPlan(topic, goal)
    }

    const messages: ProviderMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: PLAN_TOPIC_PROMPT(topic, goal, materials) },
    ]

    const responseText = await this.callProvider(messages, { temperature: 0.4 })
    const result = safeJsonParse<{ plan: TopicPlan }>(responseText)

    if (!result?.plan) {
      console.warn('[FeynmanAgent] Failed to parse plan response, falling back to mock data')
      return mockTopicPlan(topic, goal)
    }

    return result.plan
  }

  // ============================================================
  // 内部方法
  // ============================================================

  /**
   * 调用当前 Provider 并获取完整响应文本
   */
  private async callProvider(
    messages: ProviderMessage[],
    options?: CallProviderOptions,
  ): Promise<string> {
    if (!this.currentProvider) {
      throw new Error('[FeynmanAgent] No provider configured. Enable mock mode or configure a provider.')
    }

    // 动态导入避免循环依赖
    const { getProviderInstance } = await import('@/providers/providerFactory')

    const provider = await getProviderInstance(this.currentProvider)
    const fullText = await this.parseStreamResponse(
      provider.chat({
        messages,
        model: this.currentProvider.default_model,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 4096,
        stream: true,
      }),
      options?.onStreamChunk,
    )

    return fullText
  }

  /**
   * 解析流式响应为完整文本
   */
  private async parseStreamResponse(
    stream: AsyncIterable<StreamChunk>,
    onChunk?: (chunk: StreamChunk) => void,
  ): Promise<string> {
    const chunks: string[] = []

    for await (const chunk of stream) {
      if (chunk.delta && !chunk.done) {
        chunks.push(chunk.delta)
      }
      onChunk?.(chunk)
    }

    return chunks.join('')
  }

  /**
   * 模拟网络延迟
   */
  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// ============================================================
// 单例导出（便捷使用）
// ============================================================

let engineInstance: FeynmanAgentEngine | null = null

/** 获取全局引擎单例 */
export function getAgentEngine(): FeynmanAgentEngine {
  if (!engineInstance) {
    engineInstance = new FeynmanAgentEngine({ mockMode: true })
  }
  return engineInstance
}
