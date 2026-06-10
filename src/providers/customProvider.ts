/**
 * Provider 适配层 — 自定义 Provider 适配器
 * 完全自定义 Base URL 的 OpenAI-compatible 实现
 */

import { BaseProvider } from './baseProvider'
import type { StreamChunk, ProviderRequest, ProviderConfig } from '@/types/provider'

export class CustomProvider extends BaseProvider {
  private _displayName: string

  get name(): string {
    return this._displayName
  }

  type = 'openai_compatible' as const

  private baseUrl: string
  private apiKey: string
  private timeout: number

  constructor(config?: Partial<ProviderConfig> & { name?: string }) {
    super()
    this._displayName = config?.name || '自定义 Provider'
    this.baseUrl = config?.base_url || ''
    this.apiKey = config?.api_key_encrypted || ''
    this.timeout = config?.timeout_seconds || 60
  }

  async *chat(request: ProviderRequest): AsyncIterable<StreamChunk> {
    if (!this.baseUrl) {
      throw new Error('自定义 Provider 未配置 Base URL。请在设置中填写完整的 API 地址。')
    }

    const url = `${this.baseUrl.replace(/\/+$/, '')}/chat/completions`
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
      throw new Error(`${this.name} API error (${response.status}): ${errorText}`)
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
    if (!this.baseUrl) {
      return {
        success: false,
        message: '未配置 Base URL，无法测试连接。',
      }
    }

    try {
      const modelsUrl = `${this.baseUrl.replace(/\/+$/, '')}/models`
      const headers: Record<string, string> = {}
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`
      }

      const response = await fetch(modelsUrl, {
        headers,
        signal: AbortSignal.timeout(10000),
      })

      if (response.ok) {
        const data = (await response.json()) as { data?: { id: string }[] }
        const count = data.data?.length ?? 0
        return {
          success: true,
          message: `连接成功，发现 ${count} 个模型`,
        }
      }

      if (response.status === 401) {
        return { success: false, message: '认证失败，请检查 API Key 是否正确。' }
      }

      return {
        success: false,
        message: `连接失败：HTTP ${response.status}（部分服务可能不支持 /models 端点）`,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误'
      return {
        success: false,
        message: `无法连接到 ${this.name} (${this.baseUrl}): ${message}`,
      }
    }
  }

  async listModels(): Promise<string[]> {
    if (!this.baseUrl) return []

    try {
      const modelsUrl = `${this.baseUrl.replace(/\/+$/, '')}/models`
      const headers: Record<string, string> = {}
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`
      }

      const response = await fetch(modelsUrl, {
        headers,
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
