import React, { useState } from 'react';
import {
  Download,
  FileText,
  Code,
  Table,
  File,
  Shield,
  CheckCircle2,
  Clock,
  FileDown,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Toggle from '@/components/ui/Toggle';
import Badge from '@/components/ui/Badge';
import type { ExportJob } from '@/types/common';

type ExportScope = 'single' | 'all' | 'selected';
type ExportFormat = 'markdown' | 'json' | 'csv' | 'pdf';

interface FormatOption {
  key: ExportFormat;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    key: 'markdown',
    label: 'Markdown',
    description: '继续编辑',
    icon: <FileText size={24} />,
  },
  {
    key: 'json',
    label: 'JSON',
    description: '完整备份',
    icon: <Code size={24} />,
  },
  {
    key: 'csv',
    label: 'CSV',
    description: '复习卡',
    icon: <Table size={24} />,
  },
  {
    key: 'pdf',
    label: 'PDF',
    description: '打印报告',
    icon: <File size={24} />,
  },
];

const MOCK_TOPICS = [
  { id: '1', title: 'React Hooks 深度解析', checked: false },
  { id: '2', title: '线性代数基础', checked: false },
  { id: '3', title: '量子力学入门', checked: false },
  { id: '4', title: '英语语法：时态体系', checked: false },
  { id: '5', title: '数据结构与算法', checked: false },
  { id: '6', title: '机器学习数学基础', checked: false },
];

const MOCK_EXPORT_HISTORY: ExportJob[] = [
  {
    id: '1',
    scope: 'all',
    format: 'json',
    redact_secrets: true,
    status: 'completed',
    file_url: '/exports/feynman-backup-20250605.json',
    created_at: '2025-06-05T14:30:00Z',
    completed_at: '2025-06-05T14:31:00Z',
  },
  {
    id: '2',
    scope: 'single',
    format: 'markdown',
    redact_secrets: true,
    status: 'completed',
    file_url: '/exports/react-hooks-notes.md',
    created_at: '2025-06-04T10:15:00Z',
    completed_at: '2025-06-04T10:15:30Z',
  },
  {
    id: '3',
    scope: 'selected',
    format: 'csv',
    redact_secrets: true,
    status: 'completed',
    file_url: '/exports/review-cards.csv',
    created_at: '2025-06-03T09:00:00Z',
    completed_at: '2025-06-03T09:00:20Z',
  },
  {
    id: '4',
    scope: 'all',
    format: 'pdf',
    redact_secrets: false,
    status: 'processing',
    created_at: '2025-06-06T11:00:00Z',
  },
];

const SCOPE_OPTIONS: { key: ExportScope; label: string; desc: string }[] = [
  { key: 'single', label: '单个主题', desc: '选择一个特定主题进行导出' },
  { key: 'all', label: '全部主题', desc: '导出所有学习数据和记录' },
  { key: 'selected', label: '自定义选择', desc: '手动勾选要包含的主题' },
];

const ExportCenter: React.FC = () => {
  const [scope, setScope] = useState<ExportScope>('all');
  const [format, setFormat] = useState<ExportFormat | null>(null);
  const [redactSecrets, setRedactSecrets] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);

  const toggleTopicSelection = (id: string) => {
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canExport = format && (scope !== 'selected' || selectedTopics.size > 0);

  const handleExport = () => {
    if (!canExport) return;
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>
          导出中心
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          将学习数据导出为多种格式，方便备份、分享或离线使用
        </p>
      </div>

      {/* 导出范围选择 */}
      <Card padding="lg">
        <h3 className="text-base font-semibold mb-4" style={{ color: '#1F2937' }}>
          导出范围
        </h3>
        <div className="space-y-2">
          {SCOPE_OPTIONS.map((option) => (
            <label
              key={option.key}
              className={`flex items-start gap-3 p-4 rounded-[12px] cursor-pointer transition-all duration-200 ${
                scope === option.key ? '' : ''
              }`}
              style={{
                backgroundColor: scope === option.key ? '#EEF2FF' : '#FAFBFC',
                border: `1px solid ${scope === option.key ? '#C7D2FE' : '#E5E7EB'}`,
              }}
            >
              <input
                type="radio"
                name="export-scope"
                checked={scope === option.key}
                onChange={() => setScope(option.key)}
                className="mt-0.5 accent-indigo-600"
              />
              <div>
                <p className="text-sm font-medium" style={{ color: '#1F2937' }}>
                  {option.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                  {option.desc}
                </p>
              </div>
            </label>
          ))}
        </div>

        {/* 自定义选择：多选列表 */}
        {scope === 'selected' && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
            <p className="text-sm font-medium mb-3" style={{ color: '#1F2937' }}>
              选择要导出的主题（已选 {selectedTopics.size} 个）
            </p>
            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {MOCK_TOPICS.map((topic) => (
                <label
                  key={topic.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[10px] cursor-pointer transition-colors`}
                  style={{
                    backgroundColor: selectedTopics.has(topic.id)
                      ? '#EEF2FF'
                      : '#FAFBFC',
                    border: `1px solid ${
                      selectedTopics.has(topic.id) ? '#C7D2FE' : '#E5E7EB'
                    }`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedTopics.has(topic.id)}
                    onChange={() => toggleTopicSelection(topic.id)}
                    className="accent-indigo-600 rounded"
                  />
                  <span className="text-sm" style={{ color: '#1F2937' }}>
                    {topic.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* 格式选择 */}
      <Card padding="lg">
        <h3 className="text-base font-semibold mb-4" style={{ color: '#1F2937' }}>
          导出格式
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {FORMAT_OPTIONS.map((fmt) => (
            <button
              key={fmt.key}
              onClick={() => setFormat(fmt.key)}
              className={`flex flex-col items-center gap-3 p-5 rounded-[16px] transition-all duration-200 ${
                format === fmt.key ? 'shadow-md scale-[1.02]' : ''
              }`}
              style={{
                backgroundColor: format === fmt.key ? '#EEF2FF' : '#FAFBFC',
                border: `2px solid ${
                  format === fmt.key ? '#4F46E5' : '#E5E7EB'
                }`,
                color: format === fmt.key ? '#4F46E5' : '#6B7280',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: format === fmt.key ? '#4F46E520' : '#F3F4F6',
                }}
              >
                {fmt.icon}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">{fmt.label}</p>
                <p className="text-xs mt-0.5">{fmt.description}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* 隐私选项 */}
      <Card padding="lg">
        <h3 className="text-base font-semibold mb-4" style={{ color: '#1F2937' }}>
          隐私选项
        </h3>
        <div className="flex items-center justify-between p-4 rounded-[12px]" style={{ backgroundColor: '#FAFBFC' }}>
          <div className="flex items-center gap-3">
            <Shield size={18} style={{ color: '#F59E0B' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: '#1F2937' }}>
                导出时脱敏敏感信息 [REDACTED]
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                自动将 API Key、个人标识等信息替换为占位符
              </p>
            </div>
          </div>
          <Toggle
            checked={redactSecrets}
            onChange={setRedactSecrets}
          />
        </div>
      </Card>

      {/* 导出按钮 */}
      <div className="flex justify-end">
        <Button
          size="lg"
          icon={<Download size={18} />}
          loading={isExporting}
          disabled={!canExport}
        >
          {isExporting ? '正在导出...' : '开始导出'}
        </Button>
      </div>

      {/* 导出历史表格 */}
      <Card padding="lg">
        <h3 className="text-base font-semibold mb-4" style={{ color: '#1F2937' }}>
          导出历史
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                <th className="text-left py-3 px-3 font-semibold" style={{ color: '#6B7280' }}>格式</th>
                <th className="text-left py-3 px-3 font-semibold" style={{ color: '#6B7280' }}>范围</th>
                <th className="text-left py-3 px-3 font-semibold" style={{ color: '#6B7280' }}>状态</th>
                <th className="text-left py-3 px-3 font-semibold" style={{ color: '#6B7280' }}>时间</th>
                <th className="text-right py-3 px-3 font-semibold" style={{ color: '#6B7280' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_EXPORT_HISTORY.map((job) => (
                <tr
                  key={job.id}
                  style={{ borderBottom: '1px solid #F3F4F6' }}
                  className="hover:bg-gray-50"
                >
                  <td className="py-3 px-3">
                    <Badge variant="default" size="sm">
                      {job.format.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-3" style={{ color: '#1F2937' }}>
                    {job.scope === 'single' ? '单个主题' : job.scope === 'all' ? '全部主题' : '自定义'}
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        job.status === 'completed'
                          ? 'success'
                          : job.status === 'processing'
                          ? 'warning'
                          : 'error'
                      }
                      size="sm"
                    >
                      {job.status === 'completed'
                        ? '已完成'
                        : job.status === 'processing'
                        ? '处理中...'
                        : '失败'}
                    </Badge>
                  </td>
                  <td className="py-3 px-3" style={{ color: '#6B7280' }}>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {new Date(job.created_at).toLocaleString('zh-CN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {job.status === 'completed' && job.file_url ? (
                      <Button size="sm" variant="ghost" icon={<FileDown size={14} />}>
                        下载
                      </Button>
                    ) : (
                      <span className="text-xs" style={{ color: '#D1D5DB' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ExportCenter;
