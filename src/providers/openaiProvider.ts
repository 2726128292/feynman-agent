/**
 * Provider 适配层 — OpenAI 适配器
 * 官方 OpenAI API 实现，需要 Bearer Token 认证
 */

import { BaseProvider } from './baseProvider'
import type { StreamChunk, ProviderRequest, ProviderConfig } from '@/types/provider'

export class OpenAIProvider extends BaseProvider {
  name = 'OpenAI'
  type = 'cloud' as const

  private baseUrl: string
  private apiKey: string
  private timeout: number

  constructor(config?: Partial<ProviderConfig>) {
    super()
    this.baseUrl = config?.base_url || 'https://api.openai.com/v1'
    this.apiKey = config?.api_key_encrypted || ''
    this.timeout = config?.timeout_seconds || 60
  }

  async *chat(request: ProviderRequest): AsyncIterable<StreamChunk> {
    if (!this.apiKey) {
      throw new Error('OpenAI Provider 需要 API Key 才能使用。请在设置中配置。')
    }

    const url = `${this.baseUrl}/chat/completions`

    const body = {
      model: request.model,
      messages: request.messages,
      stream: true,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 4096,
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.timeout * 1000),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`)
    }

    yield* this.parseSSEStream(response, (data: unknown) => {
      const choices = (data as Record<string, unknown>)?.choices
      if (!Array.isArray(choices) || choices.length === 0) return ''
      const choice = choices[0] as Record<string, unknown>
      const delta = choice?.delta as Record<string, unknown> | undefined
      return (delta?.content as string) || ''
    })
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.apiKey) {
      return {
        success: false,
        message: '未配置 API Key，无法测试连接。',
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        signal: AbortSignal.timeout(10000),
      })
      if (response.ok) {
        const data = (await response.json()) as { data?: { id: string }[] }
        const count = data.data?.length ?? 0
        return {
          success: true,
          message: `API Key 有效，可用 ${count} 个模型`,
        }
      }

      if (response.status === 401) {
        return { success: false, message: 'API Key 无效或已过期。' }
      }
      if (response.status === 429) {
        return { success: false, message: '请求频率超限，请稍后重试。' }
      }

      return {
        success: false,
        message: `连接失败：HTTP ${response.status}`,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误'
      return {
        success: false,
        message: `无法连接到 OpenAI API: ${message}`,
      }
    }
  }

  async listModels(): Promise<string[]> {
    if (!this.apiKey) return []

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        signal: AbortSignal.timeout(15000),
      })
      if (!response.ok) return []
      const data = (await response.json()) as { data?: { id: string }[] }
      return (data.data ?? []).map((m) => m.id)
    } catch {
      return []
    }
  }
}
