/**
 * Provider 适配层 — 基础 Provider 抽象类
 * 所有具体 Provider 实现均继承此抽象类
 */

import type { StreamChunk, ProviderRequest } from '@/types/provider'

/**
 * Provider 类型枚举
 */
export type ProviderType = 'local' | 'cloud' | 'openai_compatible'

/**
 * 基础 Provider 抽象类
 * 定义了所有 Provider 必须实现的接口契约
 */
export abstract class BaseProvider {
  /** Provider 显示名称 */
  abstract name: string

  /** Provider 类型分类 */
  abstract type: ProviderType

  /**
   * 发送聊天请求（支持流式输出）
   * @param request - 包含消息、模型、参数的请求对象
   * @returns 异步可迭代的流式响应块
   */
  abstract chat(request: ProviderRequest): AsyncIterable<StreamChunk>

  /**
   * 测试 Provider 连接是否正常
   * @returns 连接测试结果
   */
  abstract testConnection(): Promise<{ success: boolean; message: string }>

  /**
   * 获取该 Provider 支持的模型列表
   * @returns 模型名称数组
   */
  abstract listModels(): Promise<string[]>

  // ============================================================
  // 通用工具方法（子类可复用）
  // ============================================================

  /**
   * 解析 SSE (Server-Sent Events) 流
   * @param response - fetch Response 对象
   * @param dataExtractor - 从每行 JSON 中提取 delta 文本的函数
   */
  protected async *parseSSEStream(
    response: Response,
    dataExtractor: (data: unknown) => string,
  ): AsyncGenerator<StreamChunk> {
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Response body is not readable')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith(':')) continue

          if (trimmed === 'data: [DONE]') {
            yield { delta: '', done: true }
            return
          }

          if (trimmed.startsWith('data: ')) {
            try {
              const json = JSON.parse(trimmed.slice(6))
              const text = dataExtractor(json)
              if (text) {
                yield { delta: text, done: false }
              }
            } catch {
              // 忽略解析失败的行
            }
          }
        }
      }

      yield { delta: '', done: true }
    } finally {
      reader.releaseLock()
    }
  }

  /**
   * 解析 Ollama 原生格式的流响应
   * Ollama 返回的是逐行的 JSON（非标准 SSE）
   */
  protected async *parseOllamaStream(
    response: Response,
  ): AsyncGenerator<StreamChunk> {
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Response body is not readable')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed) continue

          try {
            const json = JSON.parse(trimmed)
            const text = json?.response ?? ''
            if (text) {
              yield { delta: text, done: false }
            }
            if (json?.done) {
              yield { delta: '', done: true }
              return
            }
          } catch {
            // 忽略解析失败的行
          }
        }
      }

      yield { delta: '', done: true }
    } finally {
      reader.releaseLock()
    }
  }
}
