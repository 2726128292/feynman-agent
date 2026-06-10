import React, { useState } from 'react';
import {
  Server,
  Globe,
  Wifi,
  WifiOff,
  Settings,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Zap,
  Lock,
  Code,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import type { ProviderConfig } from '@/types/provider';

interface ProviderDisplay extends ProviderConfig {
  tag: string;
  connected: boolean;
}

const PROVIDERS: ProviderDisplay[] = [
  {
    id: 'ollama',
    name: 'Ollama',
    type: 'ollama',
    base_url: 'http://localhost:11434',
    api_key_encrypted: '',
    default_model: 'qwen2.5:7b',
    timeout_seconds: 120,
    max_retries: 2,
    streaming: true,
    privacy_route: 'local_only',
    is_active: true,
    connection_status: 'connected',
    last_tested_at: '2025-06-05T10:00:00Z',
    tag: '本地优先',
    connected: true,
  },
  {
    id: 'lm-studio',
    name: 'LM Studio',
    type: 'lm_studio',
    base_url: 'http://localhost:1234/v1',
    api_key_encrypted: '',
    default_model: 'local-model',
    timeout_seconds: 120,
    max_retries: 2,
    streaming: true,
    privacy_route: 'local_only',
    is_active: false,
    connection_status: 'disconnected',
    tag: 'OpenAI 兼容',
    connected: false,
  },
  {
    id: 'llama-cpp',
    name: 'llama.cpp Server',
    type: 'llama_cpp',
    base_url: 'http://localhost:8080/v1',
    api_key_encrypted: '',
    default_model: 'default',
    timeout_seconds: 180,
    max_retries: 2,
    streaming: true,
    privacy_route: 'local_only',
    is_active: false,
    connection_status: 'disconnected',
    tag: '轻量服务',
    connected: false,
  },
  {
    id: 'openai',
    name: 'OpenAI',
    type: 'openai',
    base_url: 'https://api.openai.com/v1',
    api_key_encrypted: '',
    default_model: 'gpt-4o-mini',
    embedding_model: 'text-embedding-3-small',
    timeout_seconds: 60,
    max_retries: 2,
    streaming: true,
    privacy_route: 'ask_every_time',
    is_active: false,
    connection_status: 'key_saved',
    tag: '云端 API',
    connected: true,
  },
  {
    id: 'custom',
    name: '自定义 OpenAI 兼容',
    type: 'custom',
    base_url: '',
    api_key_encrypted: '',
    default_model: '',
    timeout_seconds: 60,
    max_retries: 2,
    streaming: true,
    privacy_route: 'ask_every_time',
    is_active: false,
    tag: '可扩展',
    connected: false,
  },
];

interface ProviderCardProps {
  provider: ProviderDisplay;
  onConfigure: (provider: ProviderDisplay) => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onConfigure }) => {
  const typeIcon =
    provider.type === 'ollama' || provider.type === 'lm_studio' || provider.type === 'llama_cpp' ? (
      <Server size={18} />
    ) : provider.type === 'custom' ? (
      <Code size={18} />
    ) : (
      <Globe size={18} />
    );

  const statusLabel = provider.connected
    ? provider.connection_status === 'connected'
      ? '已连接'
      : 'Key 已保存'
    : '未连接';

  return (
    <Card hoverable padding="lg" className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #EEF2FF, #EDE9FE)',
              color: '#4F46E5',
            }}
          >
            {typeIcon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold" style={{ color: '#1F2937' }}>
                {provider.name}
              </h3>
              <Badge
                variant={provider.connected ? 'success' : 'default'}
                size="sm"
              >
                {statusLabel}
              </Badge>
            </div>
            <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
              {provider.type === 'ollama' || provider.type === 'lm_studio' || provider.type === 'llama_cpp'
                ? '本地模型'
                : provider.type === 'openai'
                ? '云端模型'
                : '自定义地址'}
            </p>
          </div>
        </div>
        <Badge variant="primary" size="sm">
          [{provider.tag}]
        </Badge>
      </div>

      <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
        <ExternalLink size={14} />
        <span className="truncate font-mono text-xs">
          {provider.base_url || '填写 Base URL'}
        </span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: '#F3F4F6' }}>
        <div className="flex items-center gap-2">
          {provider.connected ? (
            <>
              <CheckCircle2 size={14} style={{ color: '#10B981' }} />
              <span className="text-xs" style={{ color: '#10B981' }}>连接正常</span>
            </>
          ) : (
            <>
              <WifiOff size={14} style={{ color: '#D1D5DB' }} />
              <span className="text-xs" style={{ color: '#D1D5DB' }}>未检测到服务</span>
            </>
          )}
        </div>
        <Button size="sm" variant="secondary" icon={<Settings size={14} />} onClick={() => onConfigure(provider)}>
          配置
        </Button>
      </div>
    </Card>
  );
};

const ProviderConfig: React.FC = () => {
  const [configuringProvider, setConfiguringProvider] = useState<ProviderDisplay | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>
          模型 Provider 配置
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          同一套学习流程可切换本地模型与云端模型。
        </p>
      </div>

      {/* Provider 卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROVIDERS.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            onConfigure={setConfiguringProvider}
          />
        ))}
      </div>

      {/* 新增 Provider 按钮 */}
      <div className="flex justify-start pt-2">
        <Button variant="secondary" icon={<Plus size={16} />}>
          新增 Provider
        </Button>
      </div>

      {/* 配置弹窗 */}
      <Modal
        open={!!configuringProvider}
        onClose={() => setConfiguringProvider(null)}
        title={`配置 — ${configuringProvider?.name || ''}`}
        width="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfiguringProvider(null)}>
              取消
            </Button>
            <Button icon={<Zap size={16} />}>测试连接</Button>
            <Button icon={<CheckCircle2 size={16} />}>保存配置</Button>
          </>
        }
      >
        {configuringProvider && (
          <div className="space-y-4">
            <Input
              label="Base URL"
              placeholder="http://localhost:11434"
              defaultValue={configuringProvider.base_url}
              prefixIcon={<ExternalLink size={16} />}
            />
            <Input
              label="默认模型"
              placeholder="如 qwen2.5:7b、gpt-4o-mini"
              defaultValue={configuringProvider.default_model}
            />
            <div className="flex items-center gap-3 p-3 rounded-[12px]" style={{ backgroundColor: '#FEF3C7' }}>
              <Lock size={16} style={{ color: '#92400E' }} />
              <span className="text-xs" style={{ color: '#92400E' }}>
                API Key 将加密存储在本地数据库中，不会上传至任何服务器。
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProviderConfig;
