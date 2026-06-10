/**
 * Agent 编排层 — Provider 路由器
 * 根据主题的隐私级别和可用 Provider 列表，决定使用哪个 Provider
 */

import type { ProviderConfig } from '@/types/provider'

export interface RouteResult {
  /** 选中的 Provider，null 表示需要用户选择 */
  provider: ProviderConfig | null
  /** 是否被隐私策略阻止 */
  blocked: boolean
  /** 阻止或需要选择的原因 */
  reason?: string
}

/**
 * 根据主题隐私级别路由到合适的 Provider
 *
 * @param topicPrivacyLevel - 主题的隐私级别 (local_only | allow_cloud | ask_every_time)
 * @param providers - 已配置且可用的 Provider 列表
 * @returns 路由结果
 */
export function routeToProvider(
  topicPrivacyLevel: string,
  providers: ProviderConfig[],
): RouteResult {
  // 分离本地和云端 Provider
  const localProviders = providers.filter((p) =>
    ['ollama', 'lm_studio', 'llama_cpp'].includes(p.type),
  )
  const cloudProviders = providers.filter((p) =>
    ['openai', 'custom'].includes(p.type),
  )

  const activeLocal = localProviders.filter((p) => p.is_active)
  const activeCloud = cloudProviders.filter((p) => p.is_active)

  switch (topicPrivacyLevel) {
    case 'local_only': {
      // 仅允许本地 Provider
      if (activeLocal.length === 0) {
        return {
          provider: null,
          blocked: true,
          reason:
            '当前主题设置为「仅本地处理」，但未配置可用的本地 Provider（Ollama / LM Studio / llama.cpp）。请先在设置中配置本地模型。',
        }
      }
      // 优先选择第一个活跃的本地 Provider
      return {
        provider: activeLocal[0],
        blocked: false,
      }
    }

    case 'allow_cloud': {
      // 本地优先，降级到云端
      if (activeLocal.length > 0) {
        return { provider: activeLocal[0], blocked: false }
      }
      if (activeCloud.length > 0) {
        return { provider: activeCloud[0], blocked: false }
      }
      return {
        provider: null,
        blocked: true,
        reason: '未配置任何可用的 Provider。请至少配置一个本地或云端模型。',
      }
    }

    case 'ask_every_time': {
      // 每次询问用户，返回所有可用选项待用户选择
      if (activeLocal.length === 0 && activeCloud.length === 0) {
        return {
          provider: null,
          blocked: true,
          reason: '未配置任何可用的 Provider。',
        }
      }
      return {
        provider: null,
        blocked: false,
        reason:
          activeLocal.length > 0 && activeCloud.length > 0
            ? `请选择使用的模型：本地 (${activeLocal.map((p) => p.name).join(', ')}) 或云端 (${activeCloud.map((p) => p.name).join(', ')})`
            : '请确认要使用的 Provider。',
      }
    }

    default: {
      return {
        provider: null,
        blocked: true,
        reason: `未知的隐私级别: ${topicPrivacyLevel}`,
      }
    }
  }
}
