import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, CheckCircle2, Settings, Plus } from 'lucide-react';

const tabs = [
  { label: '首页', icon: <Home size={22} />, path: '/m' },
  { label: '讲解', icon: <MessageSquare size={22} />, path: '/m/chat/topic-1' },
  { label: '复习', icon: <CheckCircle2 size={22} />, path: '/m/review' },
  { label: '设置', icon: <Settings size={22} />, path: '/m/settings' },
];

const MobileTabBar: React.FC = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] bg-white border-t border-solid shadow-lg"
      style={{ borderTopColor: '#E5E7EB', height: 64 }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.path === '/m'}
          className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 min-w-[56px] no-underline"
        >
          {({ isActive }) => (
            <>
              <span
                style={{
                  color: isActive ? '#4F46E5' : '#6B7280',
                  transition: 'color 0.2s ease',
                }}
              >
                {tab.icon}
              </span>
              <span
                className="text-[11px] font-medium"
                style={{
                  color: isActive ? '#4F46E5' : '#6B7280',
                  transition: 'color 0.2s ease',
                }}
              >
                {tab.label}
              </span>
              {isActive && (
                <span
                  className="w-1 h-1 rounded-full mt-0.5"
                  style={{ backgroundColor: '#4F46E5' }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}

      {/* 中间浮动新建按钮 */}
      <NavLink
        to="/topic/create"
        className="relative -mt-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg no-underline"
        style={{
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
        }}
      >
        <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
      </NavLink>
    </nav>
  );
};

export default MobileTabBar;
