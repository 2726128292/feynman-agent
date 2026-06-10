import { useState, useEffect } from 'react'

/**
 * 响应式媒体查询 Hook
 * 监听 CSS 媒体查询的匹配状态变化
 *
 * @param query - CSS 媒体查询字符串，如 '(min-width: 1024px)'
 * @returns 当前是否匹配该媒体查询
 *
 * @example
 * ```tsx
 * const isDesktop = useMediaQuery('(min-width: 1024px)')
 * const isMobile = useMediaQuery('(max-width: 767px)')
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    // 初始化时检查（SSR 安全）
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)

    // 设置初始值
    setMatches(mediaQuery.matches)

    // 使用现代 API 的 addEventListener（兼容性更好）
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)

    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }, [query])

  return matches
}

/** 预定义断点常量 */
export const BREAKPOINTS = {
  /** 手机竖屏及以下 */
  sm: '(max-width: 639px)',
  /** 平板及以上 */
  md: '(min-width: 640px)',
  /** 小型桌面及以上 */
  lg: '(min-width: 1024px)',
  /** 大屏桌面及以上 */
  xl: '(min-width: 1280px)',
} as const

/** 是否为移动端设备（<= 767px） */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}

/** 是否为桌面端设备（>= 1024px） */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}
