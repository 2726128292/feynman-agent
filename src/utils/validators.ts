import { MIN_WORD_COUNT, MAX_WORD_COUNT } from './constants'

interface ValidationResult {
  valid: boolean
  message: string
}

interface ExplanationValidationResult extends ValidationResult {
  wordCount: number
}

export function validateTopicTitle(title: string): ValidationResult {
  const trimmed = title.trim()

  if (!trimmed) {
    return { valid: false, message: '主题名称不能为空' }
  }

  if (trimmed.length < 2) {
    return { valid: false, message: '主题名称至少需要2个字符' }
  }

  if (trimmed.length > 100) {
    return { valid: false, message: '主题名称不能超过100个字符' }
  }

  return { valid: true, message: '' }
}

export function validateExplanation(content: string): ExplanationValidationResult {
  const trimmed = content.trim()
  const wordCount = trimmed.length

  if (!trimmed) {
    return { valid: false, message: '讲解内容不能为空', wordCount: 0 }
  }

  if (wordCount < MIN_WORD_COUNT) {
    return {
      valid: false,
      message: `讲解内容至少需要 ${MIN_WORD_COUNT} 字（当前 ${wordCount} 字）`,
      wordCount,
    }
  }

  if (wordCount > MAX_WORD_COUNT) {
    return {
      valid: false,
      message: `讲解内容不能超过 ${MAX_WORD_COUNT} 字（当前 ${wordCount} 字）`,
      wordCount,
    }
  }

  return { valid: true, message: '', wordCount }
}

export function validateBaseUrl(url: string): ValidationResult {
  const trimmed = url.trim()

  if (!trimmed) {
    return { valid: false, message: 'API 地址不能为空' }
  }

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, message: '仅支持 http 或 https 协议' }
    }
    return { valid: true, message: '' }
  } catch {
    return { valid: false, message: '请输入有效的 URL 地址' }
  }
}
