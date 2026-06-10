import React from 'react';
import { Target, Link2, Lightbulb, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import type { DimensionScore } from '@/types/diagnostic';
import Card from '@/components/ui/Card';

const dimensionIcons: Record<string, React.ReactNode> = {
  concept: <Target size={18} />,
  causal: <Link2 size={18} />,
  example: <Lightbulb size={18} />,
  boundary: <AlertTriangle size={18} />,
  transfer: <ArrowRightLeft size={18} />,
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return '#10B981';
  if (score >= 50) return '#F59E0B';
  return '#EF4444';
};

const getScoreBgColor = (score: number): string => {
  if (score >= 80) return '#D1FAE5';
  if (score >= 50) return '#FEF3C7';
  return '#FEE2E2';
};

interface DiagnosticCardProps {
  dimension: DimensionScore;
}

const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ dimension }) => {
  const scoreColor = getScoreColor(dimension.score);
  const bgColor = getScoreBgColor(dimension.score);

  return (
    <Card padding="md" hoverable>
      <div className="flex items-start gap-3">
        {/* 维度图标 + 颜色圆点容器 */}
        <div className="relative shrink-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${scoreColor}15`, color: scoreColor }}
          >
            {dimensionIcons[dimension.type] || <Target size={18} />}
          </div>
          <div
            className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
            style={{ backgroundColor: scoreColor }}
          />
        </div>

        {/* 信息区 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4
              className="text-sm font-semibold truncate"
              style={{ color: '#1F2937' }}
            >
              {dimension.label}
            </h4>
            <span
              className="text-lg font-bold tabular-nums ml-2"
              style={{ color: scoreColor }}
            >
              {dimension.score}%
            </span>
          </div>

          {/* 分数进度条 */}
          <div
            className="w-full h-1.5 rounded-full mb-2 overflow-hidden"
            style={{ backgroundColor: '#E5E7EB' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(0, dimension.score))}%`,
                backgroundColor: scoreColor,
              }}
            />
          </div>

          {/* 描述文字 */}
          <p
            className="text-xs leading-relaxed line-clamp-2"
            style={{ color: '#6B7280' }}
          >
            {dimension.description}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default DiagnosticCard;
