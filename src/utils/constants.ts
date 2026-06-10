import type { AgentTemplate } from '../types/common'
import type { GapType } from '../types/diagnostic'
import type { ProviderConfig } from '../types/provider'

export const APP_NAME = '费曼学习法 Agent'

export const DB_NAME = 'feynman-agent-db'

export const DB_VERSION = 1

export const MIN_WORD_COUNT = 100

export const MAX_WORD_COUNT = 5000

export const DEFAULT_TIMEOUT = 60000

export const MAX_RETRIES = 2

export const CATEGORIES = [
  '计算机科学',
  '数学',
  '物理',
  '语言学习',
  '考试备考',
  '其他',
] as const

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'standard-feynman',
    name: '标准费曼',
    description: '经典的费曼四步法，适合大多数知识领域的学习与巩固。',
    icon: '📖',
    category: '通用',
    system_prompt:
      '你是一位费曼学习法的引导者。请按照以下步骤帮助用户掌握知识点：\n1. 选择概念\n2. 用简单语言讲解\n3. 发现薄弱环节\n4. 简化并回顾',
  },
  {
    id: 'exam-sprint',
    name: '考试冲刺',
    description: '针对考试场景优化，聚焦高频考点和快速记忆策略。',
    icon: '🎯',
    category: '考试备考',
    system_prompt:
      '你是一位考试辅导专家。请帮助用户快速梳理考试重点，通过提问和练习强化记忆，重点关注易错点和高频考点。',
  },
  {
    id: 'tech-deep-dive',
    name: '技术深挖',
    description: '面向技术人员的深度学习模式，强调原理理解和代码实践。',
    icon: '💻',
    category: '计算机科学',
    system_prompt:
      '你是一位技术导师。引导用户深入理解技术概念，从原理到实现层层递进，鼓励用代码示例和实际项目来验证理解程度。',
  },
  {
    id: 'analogy-training',
    name: '类比训练',
    description: '强化类比能力，通过跨领域类比加深对抽象概念的理解。',
    icon: '🔗',
    category: '通用',
    system_prompt:
      '你是一位类比思维教练。引导用户用生活中的例子、其他领域的知识来解释当前学习的概念，培养跨领域思维能力。',
  },
  {
    id: 'language-learning',
    name: '语言学习',
    description: '专为语言学习设计，注重语境运用和文化理解。',
    icon: '🌍',
    category: '语言学习',
    system_prompt:
      '你是一位语言学习伙伴。通过情景对话、文化背景介绍和实际应用练习，帮助用户在真实语境中掌握语言表达。',
  },
  {
    id: 'paper-reading',
    name: '论文精读',
    description: '辅助学术论文阅读，提炼核心观点和研究方法。',
    icon: '📄',
    category: '学术研究',
    system_prompt:
      '你是一位学术研究助手。帮助用户拆解论文结构，提炼核心论点、研究方法和关键结论，并用通俗语言复述复杂概念。',
  },
]

export const DIMENSION_CONFIGS: Record<GapType, { label: string; color: string; weight: number; description: string }> = {
  concept: {
    label: '概念理解',
    color: '#ef4444',
    weight: 0.25,
    description: '对核心定义和基本概念的掌握程度',
  },
  causal: {
    label: '因果逻辑',
    color: '#f97316',
    weight: 0.25,
    description: '理解事物之间因果关系和推导链的能力',
  },
  example: {
    label: '举例能力',
    color: '#eab308',
    weight: 0.2,
    description: '能否举出恰当的例子来支撑观点',
  },
  boundary: {
    label: '边界认知',
    color: '#22c55e',
    weight: 0.15,
    description: '是否清楚知道什么情况下该理论适用或不适用',
  },
  transfer: {
    label: '迁移应用',
    color: '#3b82f6',
    weight: 0.15,
    description: '将所学知识应用到新情境中的能力',
  },
}

export const PROVIDER_PRESETS: Record<string, Omit<ProviderConfig, 'id' | 'is_active' | 'last_tested_at' | 'connection_status'>> = {
  ollama: {
    name: 'Ollama (本地)',
    type: 'ollama',
    base_url: 'http://localhost:11434',
    api_key_encrypted: '',
    default_model: 'qwen2.5:7b',
    embedding_model: undefined,
    timeout_seconds: 120,
    max_retries: 2,
    streaming: true,
    privacy_route: 'local_only',
  },
  lm_studio: {
    name: 'LM Studio (本地)',
    type: 'lm_studio',
    base_url: 'http://localhost:1234/v1',
    api_key_encrypted: '',
    default_model: 'local-model',
    embedding_model: undefined,
    timeout_seconds: 120,
    max_retries: 2,
    streaming: true,
    privacy_route: 'local_only',
  },
  llama_cpp: {
    name: 'llama.cpp (本地)',
    type: 'llama_cpp',
    base_url: 'http://localhost:8080',
    api_key_encrypted: '',
    default_model: 'default',
    embedding_model: undefined,
    timeout_seconds: 180,
    max_retries: 2,
    streaming: true,
    privacy_route: 'local_only',
  },
  openai: {
    name: 'OpenAI (云端)',
    type: 'openai',
    base_url: 'https://api.openai.com/v1',
    api_key_encrypted: '',
    default_model: 'gpt-4o-mini',
    embedding_model: 'text-embedding-3-small',
    timeout_seconds: 60,
    max_retries: 2,
    streaming: true,
    privacy_route: 'ask_every_time',
  },
  custom: {
    name: '自定义 Provider',
    type: 'custom',
    base_url: '',
    api_key_encrypted: '',
    default_model: '',
    embedding_model: undefined,
    timeout_seconds: 60,
    max_retries: 2,
    streaming: true,
    privacy_route: 'ask_every_time',
  },
}
