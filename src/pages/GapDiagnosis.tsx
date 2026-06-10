import React from 'react';
import { ArrowLeft, ArrowRight, Target, Link, AlertTriangle, GitBranch, Rocket } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface DimensionData {
  type: string;
  label: string;
  score: number;
  color: string;
  icon: React.ReactNode;
  description: string;
}

const mockOverallMastery = 68;

const mockDimensions: DimensionData[] = [
  {
    type: 'concept',
    label: '概念准确性',
    score: 82,
    color: '#10B981',
    icon: <Target size={20} />,
    description:
      'Query / Key / Value 的类比基本正确，但需补充向量映射过程。',
  },
  {
    type: 'causal',
    label: '因果完整性',
    score: 54,
    color: '#F59E0B',
    icon: <Link size={20} />,
    description:
      '未解释除以 √d 的原因，也没有说明 softmax 的作用。',
  },
  {
    type: 'boundary',
    label: '边界与反例',
    score: 42,
    color: '#EF4444',
    icon: <AlertTriangle size={20} />,
    description:
      '缺少「注意力并非真正理解语义」的边界说明。',
  },
  {
    type: 'transfer',
    label: '迁移能力',
    score: 63,
    color: '#F59E0B',
    icon: <GitBranch size={20} />,
    description:
      '能够用手机通知举例，但还不能独立迁移到图像注意力。',
  },
];

const GapDiagnosis: React.FC = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#F7F8FC',
        fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4"
        style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}
      >
        <Button variant="ghost" size="sm" icon={<ArrowLeft size={18} />}>
          返回
        </Button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1F2937' }}>
            知识缺口诊断
          </h1>
          <p className="text-xs" style={{ color: '#6B7280' }}>
            Agent 将你的讲解拆解为概念、因果、例子、边界和迁移五个维度。
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8 space-y-6">
        {/* Overall Mastery Card */}
        <Card padding="lg" className="text-center">
          <p className="text-sm font-medium mb-2" style={{ color: '#6B7280' }}>
            总体掌握度
          </p>
          <div
            className="text-7xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {mockOverallMastery}%
          </div>

          {/* Wide Progress Bar */}
          <div
            className="mt-6 h-3 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: '#E5E7EB' }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${mockOverallMastery}%`,
                background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
              }}
            />
          </div>

          <p className="mt-4 text-sm" style={{ color: '#6B7280' }}>
            基于 3 轮追问与讲解内容的综合分析结果
          </p>
        </Card>

        {/* Five Dimensions */}
        <div className="space-y-4">
          {mockDimensions.map((dim) => (
            <DiagnosticCard key={dim.type} dimension={dim} />
          ))}
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex gap-4 pt-2">
          <Button variant="secondary" size="lg" icon={<ArrowLeft size={18} />} className="flex-1">
            返回继续讲解
          </Button>
          <Button size="lg" icon={<Rocket size={18} />} className="flex-1">
            生成补强任务
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ── Sub-components ─────────────────────────────────────── */

interface DiagnosticCardProps {
  dimension: DimensionData;
}

const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ dimension }) => {
  const { label, score, color, icon, description } = dimension;

  return (
    <Card padding="md">
      <div className="flex items-start gap-4">
        {/* Left: Color dot + Icon + Label */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold" style={{ color: '#1F2937' }}>
              {label}
            </h3>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: '#6B7280' }}>
              {description}
            </p>
          </div>
        </div>

        {/* Right: Score */}
        <div className="shrink-0 text-right">
          <span
            className="text-3xl font-bold tabular-nums"
            style={{ color }}
          >
            {score}%
          </span>
          {/* Mini progress bar under the number */}
          <div
            className="mt-1.5 h-1.5 w-20 overflow-hidden rounded-full ml-auto"
            style={{ backgroundColor: '#E5E7EB' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${score}%`, backgroundColor: color }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GapDiagnosis;
