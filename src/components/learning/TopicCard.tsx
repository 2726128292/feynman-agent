import React from 'react';
import { Clock, CalendarCheck, RefreshCw, AlertTriangle } from 'lucide-react';
import type { Topic } from '@/types/topic';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import MasteryProgress from './MasteryProgress';

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
}

const categoryColors: Record<string, string> = {
  '计算机科学': 'info',
  '数学': 'primary',
  '物理': 'warning',
  '语言学习': 'success',
  '考试备考': 'error',
  '其他': 'default',
};

const getStatusInfo = (topic: Topic) => {
  switch (topic.status) {
    case 'scheduled':
      return { icon: <Clock size={12} />, text: '今天20:00复习', color: '#10B981' };
    case 'explaining':
    case 'questioning':
      return { icon: <RefreshCw size={12} />, text: '讲解中', color: '#4F46E5' };
    case 'diagnosing':
      return { icon: <AlertTriangle size={12} />, text: '需要重讲', color: '#EF4444' };
    case 'reinforcing':
      return { icon: <RefreshCw size={12} />, text: '补强中', color: '#F59E0B' };
    default:
      return { icon: <CalendarCheck size={12} />, text: '明天复习', color: '#6B7280' };
  }
};

const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  const initial = topic.title.charAt(0).toUpperCase();
  const statusInfo = getStatusInfo(topic);

  return (
    <Card padding="md" hoverable onClick={onClick}>
      <div className="flex items-start gap-3.5">
        {/* 左侧圆形首字母渐变图标 */}
        <div
          className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-bold"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
        >
          {initial}
        </div>

        {/* 内容区 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h4
              className="text-sm font-semibold truncate"
              style={{ color: '#1F2937' }}
            >
              {topic.title}
            </h4>
            <Badge
              variant={(categoryColors[topic.category] as any) || 'default'}
              size="sm"
            >
              {topic.category}
            </Badge>
          </div>

          {/* 掌握度进度条 */}
          <MasteryProgress value={topic.mastery / 100} size="sm" showLabel />

          {/* 状态/时间标签 */}
          <div
            className="flex items-center gap-1 mt-2"
            style={{ color: statusInfo.color }}
          >
            {statusInfo.icon}
            <span className="text-xs font-medium">{statusInfo.text}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TopicCard;
