import React from 'react';
import { User } from 'lucide-react';

interface TopBarProps {
  username?: string;
  spaceName?: string;
  avatarUrl?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  username = '学习者',
  spaceName = '我的学习空间',
  avatarUrl,
}) => {
  return (
    <header
      className="h-14 lg:h-16 flex items-center justify-between px-4 lg:px-6 shrink-0 border-b"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB',
      }}
    >
      {/* 左侧占位（移动端可放菜单按钮） */}
      <div className="w-8" />

      {/* 右侧用户信息 */}
      <div className="flex items-center gap-3">
        {/* 用户名和空间名称（桌面端显示） */}
        <div className="hidden sm:flex flex-col items-end">
          <span
            className="text-sm font-medium leading-tight"
            style={{ color: '#1F2937' }}
          >
            {username}
          </span>
          <span
            className="text-xs leading-tight"
            style={{ color: '#6B7280' }}
          >
            {spaceName}
          </span>
        </div>

        {/* 头像 */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            className="w-9 h-9 rounded-full object-cover border-2"
            style={{ borderColor: '#4F46E5' }}
          />
        ) : (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            }}
          >
            <User size={18} color="#FFFFFF" />
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
