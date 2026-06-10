import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileTabBar from './MobileTabBar';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isDesktopScreen = useMediaQuery('(min-width: 1024px)');
  // /m/* 路由强制使用移动端布局
  const isMobileRoute = location.pathname.startsWith('/m');
  const showDesktopLayout = isDesktopScreen && !isMobileRoute;
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = useCallback(() => setCollapsed((prev) => !prev), []);

  const sidebarWidth = showDesktopLayout ? (collapsed ? 64 : 230) : 0;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#F7F8FC', fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif" }}
    >
      {/* 桌面端侧边栏 */}
      {showDesktopLayout && (
        <Sidebar
          collapsed={collapsed}
          onToggle={handleToggle}
        />
      )}

      {/* 主内容区 */}
      <main
        className="transition-all duration-300 ease-in-out min-h-screen flex flex-col"
        style={{
          marginLeft: sidebarWidth,
          maxWidth: showDesktopLayout ? 'none' : '480px',
          margin: showDesktopLayout ? `0 0 0 ${sidebarWidth}px` : '0 auto',
        }}
      >
        {/* 桌面端顶部栏 */}
        {showDesktopLayout && <TopBar />}

        {/* 页面内容 */}
        <div className={`flex-1 ${isMobileRoute ? 'p-4 pb-24' : 'p-4 lg:p-6 pb-20 lg:pb-6'}`}>
          {children || <Outlet />}
        </div>
      </main>

      {/* 移动端底部导航 */}
      {!showDesktopLayout && (
        <MobileTabBar />
      )}
    </div>
  );
};

export default AppLayout;
