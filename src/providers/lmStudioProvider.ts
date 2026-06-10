/**
 * Provider 适配层 — LM Studio 适配器
 * 标准 OpenAI-compatible 接口实现
 */

import { BaseProvider } from './baseProvider'
import type { StreamChunk, ProviderRequest, ProviderConfig } from '@/types/provider'

export class LMStudioProvider extends BaseProvider {
  name = 'LM Studio'
  type = 'local' as const

  private baseUrl: string
  private apiKey: string
  private timeout: number

  constructor(config?: Partial<ProviderConfig>) {
    super()
    this.baseUrl = config?.base_url || 'http://localhost:1234/v1'
    this.apiKey = config?.api_key_encrypted || ''
    this.timeout = config?.timeout_seconds || 60
  }

  async *chat(request: ProviderRequest): AsyncIterable<StreamChunk> {
    const url = `${this.baseUrl}/chat/completions`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    const body = {
      model: request.model,
      messages: request.messages,
      stream: true,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 4096,
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.timeout * 1000),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`LM Studio API error (${response.status}): ${errorText}`)
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
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        signal: AbortSignal.timeout(5000),
      })
      if (response.ok) {
        const data = (await response.json()) as { data?: { id: string }[] }
        const count = data.data?.length ?? 0
        return {
          success: true,
          message: `连接成功，发现 ${count} 个模型`,
        }
      }
      return {
        success: false,
        message: `连接失败：HTTP ${response.status}`,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误'
      return {
        success: false,
        message: `无法连接到 LM Studio (${this.baseUrl}): ${message}`,
      }
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        signal: AbortSignal.timeout(10000),
      })
      if (!response.ok) return []
      const data = (await response.json()) as { data?: { id: string }[] }
      return (data.data ?? []).map((m) => m.id)
    } catch {
      return []
    }
  }
}
