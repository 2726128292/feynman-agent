/**
 * Provider 适配层 — Ollama 适配器
 * 支持 Ollama 原生 API 和 OpenAI-compatible 模式
 */

import { BaseProvider } from './baseProvider'
import type { StreamChunk, ProviderRequest, ProviderConfig } from '@/types/provider'

export class OllamaProvider extends BaseProvider {
  name = 'Ollama'
  type = 'local' as const

  private baseUrl: string
  private timeout: number

  constructor(config?: Partial<ProviderConfig>) {
    super()
    this.baseUrl = config?.base_url || 'http://localhost:11434'
    this.timeout = config?.timeout_seconds || 30
  }

  async *chat(request: ProviderRequest): AsyncIterable<StreamChunk> {
    // 使用 Ollama 原生 API（/api/chat）
    const url = `${this.baseUrl}/api/chat`
    const body = {
      model: request.model,
      messages: request.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
      options: {
        temperature: request.temperature ?? 0.7,
        num_predict: request.max_tokens ?? 4096,
      },
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.timeout * 1000),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`Ollama API error (${response.status}): ${errorText}`)
    }

    yield* this.parseOllamaStream(response)
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(5000),
      })
      if (response.ok) {
        const data = (await response.json()) as { models?: { name: string }[] }
        const count = data.models?.length ?? 0
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
        message: `无法连接到 Ollama (${this.baseUrl}): ${message}`,
      }
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(10000),
      })
      if (!response.ok) return []
      const data = (await response.json()) as { models?: { name: string }[] }
      return (data.models ?? []).map((m) => m.name)
    } catch {
      return []
    }
  }
}
