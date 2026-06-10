import React from 'react';
import { Settings, CheckCircle2, XCircle, CircleDot } from 'lucide-react';
import type { ProviderConfig } from '@/types/provider';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const providerTypeLabels: Record<string, string> = {
  ollama: '本地模型',
  lm_studio: '本地模型',
  llama_cpp: '轻量服务',
  openai: '云端API',
  custom: '可扩展',
};

const providerTypeVariants: Record<string, 'success' | 'info' | 'warning' | 'primary' | 'default'> = {
  ollama: 'success',
  lm_studio: 'success',
  llama_cpp: 'warning',
  openai: 'info',
  custom: 'primary',
};

const getStatusIndicator = (status?: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle2 size={12} style={{ color: '#10B981' }} />;
    case 'failure':
      return <XCircle size={12} style={{ color: '#EF4444' }} />;
    default:
      return <CircleDot size={12} style={{ color: '#9CA3AF' }} />;
  }
};

const getStatusText = (status?: string) => {
  switch (status) {
    case 'success': return '连接成功';
    case 'failure': return '连接失败';
    default: return '未测试';
  }
};

interface ProviderCardProps {
  config: ProviderConfig;
  onConfigure: () => void;
  onTest: () => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ config, onConfigure, onTest }) => {
  return (
    <Card padding="md">
      <div className="flex items-start justify-between gap-3">
        {/* 左侧信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h4
              className="text-sm font-semibold"
              style={{ color: '#1F2937' }}
            >
              {config.name}
            </h4>
            <Badge variant={providerTypeVariants[config.type] || 'default'} size="sm">
              {providerTypeLabels[config.type] || config.type}
            </Badge>
          </div>

          {/* Base URL */}
          <p
            className="text-xs truncate mb-2"
            style={{ color: '#6B7280' }}
          >
            {config.base_url}
          </p>

          {/* 连接状态 */}
          <div className="flex items-center gap-1.5">
            {getStatusIndicator(config.connection_status)}
            <span
              className="text-xs"
              style={{
                color:
                  config.connection_status === 'success'
                    ? '#10B981'
                    : config.connection_status === 'failure'
                    ? '#EF4444'
                    : '#9CA3AF',
              }}
            >
              {getStatusText(config.connection_status)}
            </span>
          </div>
        </div>

        {/* 右侧操作按钮 */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            icon={<CircleDot size={14} style={{ color: '#6B7280' }} />}
            onClick={onTest}
          >
            测试
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={<Settings size={14} />}
            onClick={onConfigure}
          >
            配置
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProviderCard;
