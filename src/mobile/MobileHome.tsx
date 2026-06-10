import React from 'react';
import {
  BookOpen,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface MobileTopicItem {
  id: string;
  title: string;
  mastery: number;
  nextReview: string;
}

const MOCK_TOPICS: MobileTopicItem[] = [
  { id: '1', title: 'React Hooks 深度解析', mastery: 78, nextReview: '今天 14:00' },
  { id: '2', title: '线性代数基础', mastery: 45, nextReview: '明天 09:00' },
  { id: '3', title: '英语语法：时态体系', mastery: 89, nextReview: '今天 16:30' },
  { id: '4', title: '数据结构与算法', mastery: 65, nextReview: '后天 10:00' },
  { id: '5', title: '量子力学入门', mastery: 32, nextReview: '周五 15:00' },
];

const MobileHome: React.FC = () => {
  return (
    <div className="pb-24 space-y-5" style={{ minHeight: '100vh' }}>
      {/* 顶部状态栏区域 */}
      <div className="pt-3 pb-2">
        <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>
          2025年6月10日 · 周二
        </p>
        <h1
          className="text-xl font-bold mt-0.5"
          style={{ color: '#1F2937' }}
        >
          你好，学习者 👋
        </h1>
      </div>

      {/* Hero 卡片 */}
      <Card
        padding="lg"
        style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        }}
      >
        <div className="flex flex-col gap-4 text-white">
          <div className="flex items-center gap-2.5">
            <Sparkles size={20} />
            <span className="text-sm font-medium opacity-90">
              今天继续讲清楚
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold">待复习</p>
            <p className="text-lg mt-1 opacity-90">
              <span className="text-4xl font-bold">3</span> 个知识点
            </p>
          </div>
          <Button
            size="lg"
            icon={<BookOpen size={18} />}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#4F46E5',
              fontWeight: 600,
              alignSelf: 'flex-start',
            }}
          >
            开始复习
          </Button>
        </div>
      </Card>

      {/* 最近主题 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-base font-semibold"
            style={{ color: '#1F2937' }}
          >
            最近主题
          </h2>
          <button
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: '#4F46E5' }}
          >
            查看全部 <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-2.5">
          {MOCK_TOPICS.map((topic) => {
            const masteryColor =
              topic.mastery >= 80
                ? '#10B981'
                : topic.mastery >= 50
                ? '#F59E0B'
                : '#EF4444';

            return (
              <Card key={topic.id} hoverable padding="md" className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #EEF2FF, #EDE9FE)',
                  }}
                >
                  <BookOpen size={18} style={{ color: '#4F46E5' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: '#1F2937' }}
                  >
                    {topic.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <TrendingUp size={11} style={{ color: masteryColor }} />
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: masteryColor }}
                      >
                        {topic.mastery}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={11} style={{ color: '#9CA3AF' }} />
                      <span
                        className="text-[11px]"
                        style={{ color: '#9CA3AF' }}
                      >
                        {topic.nextReview}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: '#D1D5DB' }} shrink-0 />
              </Card>
            );
          })}
        </div>
      </div>

      {/* 浮动新建按钮 (FAB) */}
      <button
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        style={{
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          boxShadow: '0 8px 24px rgba(79, 70, 229, 0.35)',
        }}
      >
        <Plus size={26} style={{ color: '#FFFFFF' }} />
      </button>
    </div>
  );
};

export default MobileHome;
