import React, { useState } from 'react';
import {
  Shield,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Server,
  Globe,
  Code,
  Settings,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Toggle from '@/components/ui/Toggle';

interface KeyEntry {
  id: string;
  provider: string;
  type: string;
  keyDisplay: string | null;
  status: 'configured' | 'not_needed' | 'not_set';
  icon: React.ReactNode;
}

const KEY_ENTRIES: KeyEntry[] = [
  {
    id: 'ollama',
    provider: 'Ollama',
    type: '本地模型',
    keyDisplay: null,
    status: 'not_needed',
    icon: <Server size={18} />,
  },
  {
    id: 'openai',
    provider: 'OpenAI',
    type: '云端模型',
    keyDisplay: 'sk-proj-••••••••8D2',
    status: 'configured',
    icon: <Globe size={18} />,
  },
  {
    id: 'lm-studio',
    provider: 'LM Studio',
    type: '本地模型',
    keyDisplay: null,
    status: 'not_set',
    icon: <Code size={18} />,
  },
  {
    id: 'custom',
    provider: 'Custom',
    type: '自定义地址',
    keyDisplay: null,
    status: 'not_set',
    icon: <Settings size={18} />,
  },
];

interface KeyCardProps {
  entry: KeyEntry;
}

const KeyCard: React.FC<KeyCardProps> = ({ entry }) => {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (entry.keyDisplay) {
      navigator.clipboard?.writeText(entry.keyDisplay);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="flex flex-col gap-4 p-5 rounded-[16px]"
      style={{ backgroundColor: '#FAFBFC', border: '1px solid #E5E7EB' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #EEF2FF, #EDE9FE)', color: '#4F46E5' }}
          >
            {entry.icon}
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: '#1F2937' }}>
              {entry.provider}
            </h4>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>
              {entry.type}
            </p>
          </div>
        </div>

        {/* 状态标签 */}
        {entry.status === 'not_needed' ? (
          <Badge variant="success" size="md">无需配置</Badge>
        ) : entry.status === 'configured' ? (
          <Badge variant="primary" size="md">已配置</Badge>
        ) : (
          <Badge variant="default" size="md">未设置</Badge>
        )}
      </div>

      {/* Key 内容区域 */}
      <div className="flex items-center gap-2">
        {entry.status === 'not_needed' ? (
          <span className="text-sm px-3 py-2 rounded-[10px]" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
            本地访问通常无需 API Key
          </span>
        ) : entry.status === 'configured' && entry.keyDisplay ? (
          <>
            <div className="flex-1 px-3 py-2 rounded-[10px] font-mono text-sm truncate" style={{ backgroundColor: '#F3F4F6', color: '#1F2937' }}>
              {showKey ? entry.keyDisplay.replace('••••••••', 'xxxxxxxx') : entry.keyDisplay}
            </div>
            <button
              onClick={() => setShowKey(!showKey)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={showKey ? '隐藏' : '显示'}
            >
              {showKey ? <EyeOff size={16} style={{ color: '#6B7280' }} /> : <Eye size={16} style={{ color: '#6B7280' }} />}
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="复制"
            >
              {copied ? (
                <CheckCircle2 size={16} style={{ color: '#10B981' }} />
              ) : (
                <Copy size={16} style={{ color: '#6B7280' }} />
              )}
            </button>
            <button
              className="p-2 rounded-lg hover:bg-red-50 transition-colors"
              title="删除"
            >
              <Trash2 size={16} style={{ color: '#EF4444' }} />
            </button>
          </>
        ) : (
          <Button size="sm" icon={<KeyRound size={14} />}>
            设置 Key
          </Button>
        )}
      </div>
    </div>
  );
};

const APIKeyManagement: React.FC = () => {
  const [tempKeyMode, setTempKeyMode] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>
          API Key 管理
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          安全地管理各 AI Provider 的 API 密钥，所有密钥均加密存储于本地
        </p>
      </div>

      {/* 安全警告横幅 */}
      <div
        className="flex items-start gap-3 p-4 rounded-[16px]"
        style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
        }}
      >
        <Shield size={20} className="shrink-0 mt-0.5" style={{ color: '#D97706' }} />
        <div>
          <h4 className="text-sm font-semibold mb-1" style={{ color: '#92400E' }}>
            安全提示
          </h4>
          <ul className="text-xs space-y-1" style={{ color: '#A16207' }}>
            <li>· API Key 仅加密存储在本地 IndexedDB 中，不会上传至任何服务器</li>
            <li>· 请勿在公共环境或共享设备上保存敏感密钥</li>
            <li>· 建议定期轮换 API Key 以保障账户安全</li>
          </ul>
        </div>
      </div>

      {/* 各 Provider Key 管理卡片 */}
      <div className="space-y-3">
        {KEY_ENTRIES.map((entry) => (
          <KeyCard key={entry.id} entry={entry} />
        ))}
      </div>

      {/* 会话临时 Key 模式 */}
      <Card padding="lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' }}
            >
              <AlertTriangle size={18} style={{ color: '#D97706' }} />
            </div>
            <div>
              <h4 className="text-sm font-semibold" style={{ color: '#1F2937' }}>
                会话临时 Key 模式
              </h4>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                开启后，API Key 仅在当前浏览器会话中有效，关闭窗口后自动清除
              </p>
            </div>
          </div>
          <Toggle checked={tempKeyMode} onChange={setTempKeyMode} />
        </div>
      </Card>
    </div>
  );
};

export default APIKeyManagement;
