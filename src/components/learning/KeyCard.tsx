import React from 'react';
import { Eye, EyeOff, Copy, Trash2, ShieldAlert } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface KeyCardProps {
  providerName: string;
  maskedKey: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

const KeyCard: React.FC<KeyCardProps> = ({
  providerName,
  maskedKey,
  isVisible,
  onToggleVisibility,
  onCopy,
  onDelete,
}) => {
  return (
    <Card padding="md">
      {/* Provider 名称 + 显示/隐藏切换 */}
      <div className="flex items-center justify-between mb-3">
        <h4
          className="text-sm font-semibold"
          style={{ color: '#1F2937' }}
        >
          {providerName}
        </h4>
        <Button
          size="sm"
          variant="ghost"
          icon={isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
          onClick={onToggleVisibility}
        >
          {isVisible ? '隐藏' : '显示'}
        </Button>
      </div>

      {/* Key 掩码显示 */}
      <div
        className="px-4 py-3 rounded-[10px] mb-3 font-mono text-sm tracking-wide break-all"
        style={{
          backgroundColor: '#F9FAFB',
          border: '1px dashed #E5E7EB',
          color: '#374151',
        }}
      >
        {maskedKey}
      </div>

      {/* 操作按钮组 */}
      <div className="flex items-center gap-2 mb-3">
        <Button
          size="sm"
          variant="secondary"
          icon={<Copy size={14} />}
          onClick={onCopy}
        >
          复制
        </Button>
        <Button
          size="sm"
          variant="ghost"
          icon={<Trash2 size={14} />}
          onClick={onDelete}
          style={{ color: '#EF4444' }}
        >
          删除
        </Button>
      </div>

      {/* 安全警告区域 */}
      <div
        className="flex items-start gap-2 px-3 py-2.5 rounded-[10px]"
        style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #FECACA',
        }}
      >
        <ShieldAlert size={14} className="shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
        <p
          className="text-[11px] leading-relaxed"
          style={{ color: '#991B1B' }}
        >
          API Key 仅用于身份验证，请勿分享给他人。删除后需重新配置才能使用该 Provider。
        </p>
      </div>
    </Card>
  );
};

export default KeyCard;
