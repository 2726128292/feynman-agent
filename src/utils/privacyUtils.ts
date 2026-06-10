const SECRET_KEY_PATTERNS = [
  'api_key',
  'apiKey',
  'api-key',
  'apikey',
  'key',
  'token',
  'secret',
  'password',
  'credential',
] as const

function isSecretField(key: string): boolean {
  const lowerKey = key.toLowerCase()
  return SECRET_KEY_PATTERNS.some((pattern) => lowerKey.includes(pattern.toLowerCase()))
}

export function redactSecrets<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (typeof obj === 'string') {
    return obj as T
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redactSecrets(item)) as unknown as T
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
      if (v !== null && typeof v === 'object') {
        result[k] = redactSecrets(v)
      } else if (typeof v === 'string' && isSecretField(k)) {
        result[k] = '[REDACTED]'
      } else {
        result[k] = v
      }
    }
    return result as T
  }

  return obj
}

export function shouldAllowCloud(
  topicPrivacyLevel: string,
  providerType: string,
): boolean {
  switch (topicPrivacyLevel) {
    case 'local_only':
      return false
    case 'allow_cloud':
      return true
    case 'ask_every_time':
      // 本地 provider 类型始终允许
      const localProviders = ['ollama', 'lm_studio', 'llama_cpp']
      return localProviders.includes(providerType)
    default:
      return false
  }
}
