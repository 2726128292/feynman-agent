// ============================================================
// 费曼学习法 Agent - Service Worker (Cache First 策略)
// ============================================================

const CACHE_NAME = 'feynman-agent-v1'

// 需要预缓存的静态资源（构建后自动包含）
const PRECACHE_URLS = [
  './',
  './index.html',
]

// 安装阶段：预缓存核心文件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {
        // 预缓存失败不影响安装
      })
    })
  )
  // 跳过等待，立即激活
  self.skipWaiting()
})

// 激活阶段：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  )
  // 立即控制所有客户端
  self.clients.claim()
})

// 拦截请求：Cache First + Network Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event

  // 只处理 GET 请求
  if (request.method !== 'GET') return

  // 跳过非同源请求和 Chrome 扩展请求
  if (!request.url.startsWith(self.location.origin)) return
  if (request.url.includes('chrome-extension://')) return

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // 缓存命中：返回缓存，同时在后台更新
        fetchAndCache(request)
        return cachedResponse
      }

      // 缓存未命中：尝试网络请求
      return fetchAndCache(request)
    })
  )
})

async function fetchAndCache(request) {
  try {
    const response = await fetch(request)

    // 只缓存成功的响应
    if (response.ok && response.status === 200) {
      const clone = response.clone()
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, clone).catch(() => {})
    }

    return response
  } catch (error) {
    // 网络失败且无缓存：返回离线页面（如果有）
    const cached = await caches.match('./index.html')
    return cached || new Response('离线模式', { status: 503 })
  }
}
