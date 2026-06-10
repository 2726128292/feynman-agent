import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Download,
  Trash2,
  AlertTriangle,
  Lock,
  FileText,
  Clock,
  Database,
  Eye,
  EyeOff,
  Info,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Toggle from '@/components/ui/Toggle';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

type PrivacyLevel = 'local_only' | 'allow_cloud' | 'ask_every_time';

type PrivacyStatus = 'safe' | 'warning' | 'danger';

const PRIVACY_LEVEL_OPTIONS = [
  { label: '仅本地处理（推荐）', value: 'local_only' },
  { label: '允许云端处理', value: 'allow_cloud' },
  { label: '每次询问', value: 'ask_every_time' },
];

const getPrivacyStatus = (level: PrivacyLevel): PrivacyStatus => {
  if (level === 'local_only') return 'safe';
  if (level === 'allow_cloud') return 'warning';
  return 'safe';
};

const STATUS_CONFIG: Record<
  PrivacyStatus,
  { icon: React.ReactNode; label: string; bgColor: string; textColor: string; borderColor: string }
> = {
  safe: {
    icon: <ShieldCheck size={22} />,
    label: '隐私状态良好',
    bgColor: '#D1FAE5',
    textColor: '#065F46',
    borderColor: '#34D399',
  },
  warning: {
    icon: <ShieldAlert size={22} />,
    label: '存在隐私风险',
    bgColor: '#FEF3C7',
    textColor: '#92400E',
    borderColor: '#FBBF24',
  },
  danger: {
    icon: <ShieldX size={22} />,
    label: '隐私安全警告',
    bgColor: '#FEE2E2',
    textColor: '#991B1B',
    borderColor: '#F87171',
  },
};

const PrivacySecurity: React.FC = () => {
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('local_only');
  const [autoRedact, setAutoRedact] = useState(true);
  const [includeModelConfig, setIncludeModelConfig] = useState(false);
  const [recordLogs, setRecordLogs] = useState(false);
  const [autoClearDays, setAutoClearDays] = useState('30');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const currentStatus = getPrivacyStatus(privacyLevel);
  const statusConfig = STATUS_CONFIG[currentStatus];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>
          隐私安全
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          控制数据处理方式、导出安全和本地存储策略
        </p>
      </div>

      {/* 当前隐私状态总览卡片 */}
      <Card
        padding="lg"
        className="flex items-center gap-4"
        style={{
          backgroundColor: `${statusConfig.bgColor}`,
          borderLeft: `4px solid ${statusConfig.borderColor}`,
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${statusConfig.textColor}15` }}
        >
          {statusConfig.icon}
        </div>
        <div>
          <h3
            className="text-base font-semibold"
            style={{ color: statusConfig.textColor }}
          >
            {statusConfig.label}
          </h3>
          <p className="text-sm mt-0.5" style={{ color: statusConfig.textColor, opacity: 0.8 }}>
            {currentStatus === 'safe'
              ? '所有数据仅在本地处理，不会发送至任何外部服务器'
              : '部分数据可能被发送至外部服务进行处理'}
          </p>
        </div>
      </Card>

      {/* 分组设置项 */}

      {/* 数据路由 */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Database size={18} style={{ color: '#4F46E5' }} />
          <h3 className="text-base font-semibold" style={{ color: '#1F2937' }}>
            数据路由
          </h3>
        </div>
        <div className="space-y-3">
          <Select
            label="默认隐私等级"
            options={PRIVACY_LEVEL_OPTIONS}
            onChange={(val) => setPrivacyLevel(val as PrivacyLevel)}
          />
          <div
            className="flex items-start gap-2 p-3 rounded-[12px]"
            style={{ backgroundColor: '#F9FAFB' }}
          >
            <Info size={14} className="shrink-0 mt-0.5" style={{ color: '#6B7280' }} />
            <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
              「仅本地处理」模式下，所有 AI 推理均通过本地部署的模型（如 Ollama）完成；
              选择「允许云端」或「每次询问」时，数据将可能发送至 OpenAI 等云端服务。
            </p>
          </div>
        </div>
      </Card>

      {/* 导出安全 */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Download size={18} style={{ color: '#10B981' }} />
          <h3 className="text-base font-semibold" style={{ color: '#1F2937' }}>
            导出安全
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-[12px]" style={{ backgroundColor: '#FAFBFC' }}>
            <div className="flex items-center gap-3">
              <Lock size={18} style={{ color: '#F59E0B' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#1F2937' }}>
                  自动脱敏敏感信息
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                  导出时自动将 API Key、个人标识替换为 [REDACTED]
                </p>
              </div>
            </div>
            <Toggle checked={autoRedact} onChange={setAutoRedact} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-[12px]" style={{ backgroundColor: '#FAFBFC' }}>
            <div className="flex items-center gap-3">
              <FileText size={18} style={{ color: '#6B7280' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#1F2937' }}>
                  导出时包含模型配置
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                  在备份文件中包含当前使用的模型参数和 Prompt 设置
                </p>
              </div>
            </div>
            <Toggle checked={includeModelConfig} onChange={setIncludeModelConfig} />
          </div>
        </div>
      </Card>

      {/* 日志与存储 */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} style={{ color: '#7C3AED' }} />
          <h3 className="text-base font-semibold" style={{ color: '#1F2937' }}>
            日志与存储
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-[12px]" style={{ backgroundColor: '#FAFBFC' }}>
            <div className="flex items-center gap-3">
              <Eye size={18} style={{ color: '#6B7280' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#1F2937' }}>
                  记录请求日志
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                  记录每次 API 调用的详细信息用于调试（可能增加存储占用）
                </p>
              </div>
            </div>
            <Toggle checked={recordLogs} onChange={setRecordLogs} />
          </div>
          <Input
            label="自动清除天数"
            type="number"
            value={autoClearDays}
            onChange={setAutoClearDays}
            suffixIcon={<Clock size={14} />}
          />
          <p className="text-xs" style={{ color: '#9CA3AF' }}>
            超过指定天数的旧日志将自动清除。设为 0 表示不自动清除。
          </p>
        </div>
      </Card>

      {/* 数据管理 */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Database size={18} style={{ color: '#EF4444' }} />
          <h3 className="text-base font-semibold" style={{ color: '#1F2937' }}>
            数据管理
          </h3>
        </div>
        <div className="space-y-3">
          <Button
            variant="secondary"
            icon={<Download size={16} />}
            fullWidth
          >
            导出全部数据备份
          </Button>

          <Button
            variant="danger"
            icon={<Trash2 size={16} />}
            fullWidth
            onClick={() => setShowConfirmDelete(true)}
          >
            ⚠️ 清除全部数据
          </Button>
        </div>
      </Card>

      {/* 二次确认删除弹窗 */}
      <Modal
        open={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        title="⚠️ 确认清除全部数据？"
        width="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
              取消
            </Button>
            <Button variant="danger" icon={<Trash2 size={16} />} onClick={() => setShowConfirmDelete(false)}>
              确认清除
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div
            className="flex items-start gap-3 p-4 rounded-[12px]"
            style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}
          >
            <AlertTriangle size={20} className="shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
            <div className="text-sm space-y-1" style={{ color: '#991B1B' }}>
              <p className="font-semibold">此操作不可撤销！</p>
              <p>以下数据将被永久删除：</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs opacity-90">
                <li>所有学习主题及进度记录</li>
                <li>讲解对话历史</li>
                <li>练习结果和诊断报告</li>
                <li>复习计划和日程安排</li>
                <li>Provider 配置信息</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-center font-medium" style={{ color: '#1F2937' }}>
            请输入 <span style={{ color: '#EF4444' }}>「清除」</span> 来确认操作
          </p>
          <Input placeholder="输入「清除」以确认" />
        </div>
      </Modal>
    </div>
  );
};

export default PrivacySecurity;
