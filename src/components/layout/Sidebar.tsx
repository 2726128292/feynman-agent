import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Plus,
  MessageSquare,
  Library,
  CalendarDays,
  BarChart3,
  ArrowLeftRight,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { label: '学习总览', icon: <Home size={20} />, path: '/' },
  { label: '新建主题', icon: <Plus size={20} />, path: '/topic/create' },
  { label: '费曼对话', icon: <MessageSquare size={20} />, path: '/knowledge-base' },
  { label: '知识库', icon: <Library size={20} />, path: '/knowledge-base' },
  { label: '复习计划', icon: <CalendarDays size={20} />, path: '/review' },
  { label: '学习统计', icon: <BarChart3 size={20} />, path: '/settings/stats' },
  { label: '导入导出', icon: <ArrowLeftRight size={20} />, path: '/import' },
  { label: '设置', icon: <Settings size={20} />, path: '/settings/providers' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  connected?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  connected = true,
}) => {
  const width = collapsed ? 64 : 230;

  return (
    <motion.aside
      initial={false}
      animate={{ width }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col"
      style={{ backgroundColor: '#1e1b4b' }}
    >
      {/* Logo 区域 */}
      <div className="flex items-center h-16 px-4 shrink-0">
        <div
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          }}
        >
          F
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="ml-3 text-white font-semibold text-base whitespace-nowrap"
            >
              Feynman Agent
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer no-underline ${
                isActive
                  ? 'text-white'
                  : 'text-indigo-200 hover:text-white hover:bg-white/10'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }
                : undefined
            }
            title={collapsed ? item.label : undefined}
          >
              <span className="shrink-0">{item.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* 底部区域 */}
      <div className="px-3 pb-4 space-y-2">
        {/* 连接状态 */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                connected ? 'animate-ping' : ''
              }`}
              style={{ backgroundColor: connected ? '#10B981' : '#EF4444' }}
            />
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ backgroundColor: connected ? '#10B981' : '#EF4444' }}
            />
          </span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="text-xs text-indigo-300 whitespace-nowrap"
              >
                {connected ? '已连接' : '未连接'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* 折叠按钮 */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-indigo-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-xs whitespace-nowrap"
              >
                收起侧栏
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
