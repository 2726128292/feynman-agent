/**
 * Provider 适配层 — 工厂函数
 * 根据 ProviderConfig 创建对应的 Provider 实例
 */

import { BaseProvider } from './baseProvider'
import type { ProviderConfig } from '@/types/provider'

/**
 * 根据配置创建对应的 Provider 实例
 * @param config - Provider 配置
 * @returns BaseProvider 实例
 */
export async function getProviderInstance(config: ProviderConfig): Promise<BaseProvider> {
  switch (config.type) {
    case 'ollama': {
      const { OllamaProvider } = await import('./ollamaProvider')
      return new OllamaProvider(config)
    }
    case 'lm_studio': {
      const { LMStudioProvider } = await import('./lmStudioProvider')
      return new LMStudioProvider(config)
    }
    case 'llama_cpp': {
      const { LlamaCppProvider } = await import('./llamaCppProvider')
      return new LlamaCppProvider(config)
    }
    case 'openai': {
      const { OpenAIProvider } = await import('./openaiProvider')
      return new OpenAIProvider(config)
    }
    case 'custom': {
      const { CustomProvider } = await import('./customProvider')
      return new CustomProvider({ ...config })
    }
    default:
      throw new Error(`Unknown provider type: ${config.type}`)
  }
}
