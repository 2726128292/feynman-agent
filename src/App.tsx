import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'

// ============================================================
// 桌面端页面 — 懒加载
// ============================================================

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const CreateTopic = lazy(() => import('@/pages/CreateTopic'))
const ExplainWorkspace = lazy(() => import('@/pages/ExplainWorkspace'))
const SocraticQuestioning = lazy(() => import('@/pages/SocraticQuestioning'))
const GapDiagnosis = lazy(() => import('@/pages/GapDiagnosis'))
const ActiveRecall = lazy(() => import('@/pages/ActiveRecall'))
const ReviewPlan = lazy(() => import('@/pages/ReviewPlan'))
const KnowledgeBase = lazy(() => import('@/pages/KnowledgeBase'))
const ImportCenter = lazy(() => import('@/pages/ImportCenter'))
const ExportCenter = lazy(() => import('@/pages/ExportCenter'))
const ProviderConfig = lazy(() => import('@/pages/ProviderConfig'))
const APIKeyManagement = lazy(() => import('@/pages/APIKeyManagement'))
const LearningStats = lazy(() => import('@/pages/LearningStats'))
const TemplateLibrary = lazy(() => import('@/pages/TemplateLibrary'))
const PrivacySecurity = lazy(() => import('@/pages/PrivacySecurity'))

// ============================================================
// 移动端页面 — 懒加载
// ============================================================

const MobileHome = lazy(() => import('@/mobile/MobileHome'))
const MobileChat = lazy(() => import('@/mobile/MobileChat'))
const MobileReview = lazy(() => import('@/mobile/MobileReview'))
const MobileSettings = lazy(() => import('@/mobile/MobileSettings'))

// ============================================================
// 全屏页面（不包裹 Layout）— 懒加载
// ============================================================

const Onboarding = lazy(() => import('@/pages/Onboarding'))

// ============================================================
// 页面加载占位
// ============================================================

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#6B7280]">加载中...</span>
      </div>
    </div>
  )
}

// ============================================================
// 桌面端路由布局包裹器
// ============================================================

function DesktopRoute({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </AppLayout>
  )
}

// ============================================================
// 根组件
// ============================================================

export default function App() {
  return (
    <Routes>
      {/* ======== 首次引导（全屏，不包裹 Layout）======== */}
      <Route
        path="/onboarding"
        element={
          <Suspense fallback={<PageLoader />}>
            <Onboarding />
          </Suspense>
        }
      />

      {/* ======== 桌面端路由（包裹 AppLayout）======== */}
      {/* 首页 / 仪表盘 */}
      <Route
        path="/"
        element={
          <DesktopRoute>
            <Dashboard />
          </DesktopRoute>
        }
      />

      {/* 创建主题 */}
      <Route
        path="/topic/create"
        element={
          <DesktopRoute>
            <CreateTopic />
          </DesktopRoute>
        }
      />

      {/* 讲解工作区 */}
      <Route
        path="/topic/:id/explain"
        element={
          <DesktopRoute>
            <ExplainWorkspace />
          </DesktopRoute>
        }
      />

      {/* 苏格拉底追问 */}
      <Route
        path="/topic/:id/question"
        element={
          <DesktopRoute>
            <SocraticQuestioning />
          </DesktopRoute>
        }
      />

      {/* 缺口诊断 */}
      <Route
        path="/topic/:id/diagnosis"
        element={
          <DesktopRoute>
            <GapDiagnosis />
          </DesktopRoute>
        }
      />

      {/* 主动回忆练习 */}
      <Route
        path="/topic/:id/practice"
        element={
          <DesktopRoute>
            <ActiveRecall />
          </DesktopRoute>
        }
      />

      {/* 复习计划 */}
      <Route
        path="/review"
        element={
          <DesktopRoute>
            <ReviewPlan />
          </DesktopRoute>
        }
      />

      {/* 知识库 */}
      <Route
        path="/knowledge-base"
        element={
          <DesktopRoute>
            <KnowledgeBase />
          </DesktopRoute>
        }
      />

      {/* 导入中心 */}
      <Route
        path="/import"
        element={
          <DesktopRoute>
            <ImportCenter />
          </DesktopRoute>
        }
      />

      {/* 导出中心 */}
      <Route
        path="/export"
        element={
          <DesktopRoute>
            <ExportCenter />
          </DesktopRoute>
        }
      />

      {/* 设置 - Provider 配置 */}
      <Route
        path="/settings/providers"
        element={
          <DesktopRoute>
            <ProviderConfig />
          </DesktopRoute>
        }
      />

      {/* 设置 - API Key 管理 */}
      <Route
        path="/settings/keys"
        element={
          <DesktopRoute>
            <APIKeyManagement />
          </DesktopRoute>
        }
      />

      {/* 设置 - 学习统计 */}
      <Route
        path="/settings/stats"
        element={
          <DesktopRoute>
            <LearningStats />
          </DesktopRoute>
        }
      />

      {/* 设置 - 模板库 */}
      <Route
        path="/settings/templates"
        element={
          <DesktopRoute>
            <TemplateLibrary />
          </DesktopRoute>
        }
      />

      {/* 设置 - 隐私与安全 */}
      <Route
        path="/settings/privacy"
        element={
          <DesktopRoute>
            <PrivacySecurity />
          </DesktopRoute>
        }
      />

      {/* ======== 移动端路由（包裹 AppLayout，自动显示 MobileTabBar）======== */}
      {/* 移动端首页 */}
      <Route
        path="/m"
        element={
          <DesktopRoute>
            <MobileHome />
          </DesktopRoute>
        }
      />

      {/* 移动端聊天/学习会话 */}
      <Route
        path="/m/chat/:id"
        element={
          <DesktopRoute>
            <MobileChat />
          </DesktopRoute>
        }
      />

      {/* 移动端复习 */}
      <Route
        path="/m/review"
        element={
          <DesktopRoute>
            <MobileReview />
          </DesktopRoute>
        }
      />

      {/* 移动端设置 */}
      <Route
        path="/m/settings"
        element={
          <DesktopRoute>
            <MobileSettings />
          </DesktopRoute>
        }
      />

      {/* ======== 默认重定向 ======== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
