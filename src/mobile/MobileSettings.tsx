import React, { useState } from 'react';
import {
  User,
  Server,
  Globe,
  Shield,
  Trash2,
  MessageSquare,
  Info,
  ChevronRight,
  Bell,
  Palette,
  Lock,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Toggle from '@/components/ui/Toggle';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface SettingsGroup {
  title: string;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  value?: string;
  type?: 'toggle' | 'navigate' | 'value' | 'danger';
  toggleValue?: boolean;
  badge?: string;
}

const MobileSettings: React.FC = () => {
  const [editUsername, setEditUsername] = useState(false);
  const [username, setUsername] = useState('学习者');
  const [spaceName, setSpaceName] = useState('我的知识空间');
  const [privacyLevel, setPrivacyLevel] = useState('仅本地处理');
  const [redactEnabled, setRedactEnabled] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const settingsGroups: SettingsGroup[] = [
    {
      title: '账户',
      items: [
        {
          id: 'username',
          icon: <User size={18} />,
          label: '用户名',
          value: username,
          type: 'navigate',
        },
        {
          id: 'spacename',
          icon: <Palette size={18} />,
          label: '空间名',
          value: spaceName,
          type: 'navigate',
        },
      ],
    },
    {
      title: 'AI 模型',
      items: [
        {
          id: 'provider-config',
          icon: <Server size={18} />,
          label: 'Provider 配置',
          type: 'navigate',
          badge: '已配置 1 个',
        },
        {
          id: 'apikey-manage',
          icon: <Lock size={18} />,
          label: 'API Key 管理',
          type: 'navigate',
          badge: '2 个已配置',
        },
      ],
    },
    {
      title: '隐私与安全',
      items: [
        {
          id: 'privacy-level',
          icon: <Shield size={18} />,
          label: '隐私等级',
          value: privacyLevel,
          type: 'navigate',
        },
        {
          id: 'auto-redact',
          icon: <Lock size={18} />,
          label: '自动脱敏敏感信息',
          type: 'toggle',
          toggleValue: redactEnabled,
        },
        {
          id: 'clear-data',
          icon: <Trash2 size={18} />,
          label: '清除全部数据',
          type: 'danger',
        },
      ],
    },
    {
      title: '关于',
      items: [
        {
          id: 'version',
          icon: <Info size={18} />,
          label: '版本号',
          value: 'v1.0.0',
          type: 'value',
        },
        {
          id: 'feedback',
          icon: <MessageSquare size={18} />,
          label: '反馈与建议',
          type: 'navigate',
        },
      ],
    },
  ];

  return (
    <div className="pb-24 space-y-5" style={{ minHeight: '100vh' }}>
      {/* 顶部标题 */}
      <div className="pt-3 pb-1">
        <h1
          className="text-xl font-bold"
          style={{ color: '#1F2937' }}
        >
          设置
        </h1>
      </div>

      {/* iOS Settings 风格分组列表 */}
      {settingsGroups.map((group, groupIndex) => (
        <div key={group.title}>
          <p
            className="text-xs font-semibold uppercase tracking-wide px-1 mb-2 mt-1"
            style={{ color: '#9CA3AF' }}
          >
            {group.title}
          </p>
          <div
            className="rounded-[14px] overflow-hidden"
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            {group.items.map((item, itemIndex) => {
              const isFirst = itemIndex === 0;
              const isLast = itemIndex === group.items.length - 1;

              return (
                <div
                  key={item.id}
                  className={`flex items-center ${
                    item.type === 'toggle'
                      ? 'justify-between'
                      : 'justify-between'
                  } px-4 py-3.5 ${
                    !isLast ? 'border-b' : ''
                  }`}
                  style={{
                    borderColor: '#F3F4F6',
                    ...(item.type === 'danger'
                      ? {}
                      : { cursor: item.type !== 'value' ? 'pointer' : 'default' }),
                  }}
                  onClick={() => {
                    if (item.id === 'clear-data') setShowDeleteConfirm(true);
                    else if (item.id === 'username') setEditUsername(true);
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor:
                          item.type === 'danger'
                            ? '#FEE2E2'
                            : '#F3F4F6',
                        color:
                          item.type === 'danger'
                            ? '#EF4444'
                            : '#4F46E5',
                      }}
                    >
                      {item.icon}
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{
                        color:
                          item.type === 'danger'
                            ? '#EF4444'
                            : '#1F2937',
                      }}
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* 右侧内容 */}
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {item.value && (
                      <span
                        className="text-xs"
                        style={{ color: '#9CA3AF' }}
                      >
                        {item.value}
                      </span>
                    )}

                    {item.badge && (
                      <Badge variant="primary" size="sm">
                        {item.badge}
                      </Badge>
                    )}

                    {item.type === 'toggle' ? (
                      <Toggle
                        checked={item.toggleValue || false}
                        onChange={(val) => {
                          if (item.id === 'auto-redact')
                            setRedactEnabled(val);
                        }}
                      />
                    ) : item.type === 'navigate' || item.type === 'danger' ? (
                      <ChevronRight
                        size={16}
                        style={{ color: '#D1D5DB' }}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* 编辑用户名弹窗 */}
      <Modal
        open={editUsername}
        onClose={() => setEditUsername(false)}
        title="编辑用户名"
        width="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditUsername(false)}>
              取消
            </Button>
            <Button onClick={() => setEditUsername(false)}>保存</Button>
          </>
        }
      >
        <Input
          label="用户名"
          value={username}
          onChange={setUsername}
          placeholder="输入你的昵称"
        />
      </Modal>

      {/* 清除数据确认弹窗 */}
      <Modal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="确认清除全部数据？"
        width="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              取消
            </Button>
            <Button
              variant="danger"
              icon={<Trash2 size={16} />}
              onClick={() => setShowDeleteConfirm(false)}
            >
              确认清除
            </Button>
          </>
        }
      >
        <div
          className="p-4 rounded-[12px] text-sm text-center"
          style={{
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
          }}
        >
          此操作将永久删除所有学习记录、对话历史和配置信息，且无法恢复。
        </div>
      </Modal>
    </div>
  );
};

export default MobileSettings;
