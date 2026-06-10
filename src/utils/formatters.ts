export function formatMastery(score: number): string {
  return `${Math.round(score)}%`
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatRelativeTime(dateStr: string): string {
  const now = Date.now()
  const target = new Date(dateStr).getTime()
  const diffMs = now - target
  if (diffMs < 0) return '刚刚'

  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return `${diffSec}秒前`

  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}分钟前`

  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}小时前`

  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 30) return `${diffDay}天前`

  const diffMonth = Math.floor(diffDay / 30)
  if (diffMonth < 12) return `${diffMonth}个月前`

  const diffYear = Math.floor(diffMonth / 12)
  return `${diffYear}年前`
}

export function maskApiKey(key: string): string {
  if (!key || key.length <= 8) return key ? '••••••••' : ''
  return `${key.slice(0, 7)}${'•'.repeat(Math.min(key.length - 8, 8))}${key.slice(-2)}`
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
