import React from 'react';
import { BookOpen, MessageSquare, AlertTriangle, Flame, ArrowRight, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TopicCard from '@/components/learning/TopicCard';
import type { Topic } from '@/types/topic';

const mockTopics: Topic[] = [
  {
    id: '1',
    title: 'Transformer 注意力机制',
    category: '计算机科学',
    goal: '理解自注意力机制的核心原理',
    privacy_level: 'local_only',
    tags: ['深度学习', 'NLP'],
    mastery: 82,
    status: 'scheduled',
    created_at: '2025-01-15T08:00:00Z',
    updated_at: '2025-01-20T10:30:00Z',
  },
  {
    id: '2',
    title: 'TCP 三次握手',
    category: '计算机科学',
    goal: '掌握 TCP 连接建立过程',
    privacy_level: 'allow_cloud',
    tags: ['网络', '协议'],
    mastery: 65,
    status: 'topic_created',
    created_at: '2025-01-18T09:00:00Z',
    updated_at: '2025-01-19T14:00:00Z',
  },
  {
    id: '3',
    title: '贝叶斯定理',
    category: '数学',
    goal: '能够用贝叶斯方法解决概率问题',
    privacy_level: 'ask_every_time',
    tags: ['概率论', '统计'],
    mastery: 48,
    status: 'diagnosing',
    created_at: '2025-01-12T10:00:00Z',
    updated_at: '2025-01-17T16:00:00Z',
  },
  {
    id: '4',
    title: 'Vue3 响应式原理',
    category: '计算机科学',
    goal: '深入理解 Proxy 响应式系统',
    privacy_level: 'local_only',
    tags: ['前端', 'Vue', '框架原理'],
    mastery: 76,
    status: 'scheduled',
    created_at: '2025-01-10T11:00:00Z',
    updated_at: '2025-01-21T09:15:00Z',
  },
];

const statsCards = [
  { label: '待复习', value: '4', subtext: '今日安排', icon: <BookOpen size={20} />, color: '#4F46E5' },
  { label: '本周讲解', value: '12', subtext: '完成 76%', icon: <MessageSquare size={20} />, color: '#7C3AED' },
  { label: '薄弱知识点', value: '3', subtext: '需重点复盘', icon: <AlertTriangle size={20} />, color: '#F59E0B' },
  { label: '连续学习', value: '7', subtext: '保持节奏', icon: <Flame size={20} />, color: '#EF4444' },
];

const timelineSteps = [
  { step: 1, status: 'done', title: '选择主题', detail: 'Transformer 注意力机制' },
  { step: 2, status: 'done', title: '尝试讲解', detail: '用自己的话解释' },
  { step: 3, status: 'active', title: 'Agent 追问', detail: '回答 3 个关键问题' },
  { step: 4, status: 'pending', title: '生成复习卡', detail: '安排下一次复盘' },
];

const Dashboard: React.FC = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#F7F8FC',
        fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* 页面标题区 */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-1.5"
          style={{ color: '#1F2937' }}
        >
          学习总览
        </h1>
        <p
          className="text-sm"
          style={{ color: '#6B7280' }}
        >
          费曼学习法驱动的个人知识教练
        </p>
      </div>

      {/* Hero 行动卡区域 */}
      <Card padding="lg" className="mb-8">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <h2
              className="text-xl font-bold mb-2"
              style={{ color: '#1F2937' }}
            >
              今天继续把知识讲清楚
            </h2>
            <p
              className="text-sm mb-6 max-w-md leading-relaxed"
              style={{ color: '#6B7280' }}
            >
              用自己的话解释概念，发现理解盲区，让知识真正内化。
            </p>
            <div className="flex items-center gap-3">
              <Button size="md" variant="primary" icon={<BookOpen size={16} />}>
                开始今日复习
              </Button>
              <Button size="md" variant="secondary" icon={<ArrowRight size={16} />}>
                新建学习主题
              </Button>
            </div>
          </div>

          {/* 右侧大号汉字装饰 */}
          <div
            className="shrink-0 w-32 h-32 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
            }}
          >
            <span
              className="text-5xl font-black"
              style={{ color: '#7C3AED' }}
            >
              懂
            </span>
          </div>
        </div>
      </Card>

      {/* 4 个统计卡片横排 */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: '#6B7280' }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-2xl font-bold tabular-nums"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: '#9CA3AF' }}
                >
                  {stat.subtext}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${stat.color}12`, color: stat.color }}
              >
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 双列内容区 */}
      <div className="grid grid-cols-[1fr_380px] gap-6">
        {/* 左侧：最近学习主题 */}
        <div>
          <h3
            className="text-base font-semibold mb-4"
            style={{ color: '#1F2937' }}
          >
            最近学习主题
          </h3>
          <div className="flex flex-col gap-3">
            {mockTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>

        {/* 右侧：今日路径 */}
        <div>
          <h3
            className="text-base font-semibold mb-4"
            style={{ color: '#1F2937' }}
          >
            今日路径
          </h3>
          <Card padding="lg">
            <div className="relative pl-6">
              {/* 时间线竖线 */}
              <div
                className="absolute left-[11px] top-2 bottom-2 w-0.5"
                style={{ backgroundColor: '#E5E7EB' }}
              />

              {timelineSteps.map((item, index) => (
                <div key={item.step} className="relative pb-6 last:pb-0">
                  {/* 步骤圆点 */}
                  <div className="absolute -left-6 top-0.5 z-10">
                    {item.status === 'done' ? (
                      <CheckCircle2 size={22} style={{ color: '#10B981' }} />
                    ) : item.status === 'active' ? (
                      <Loader2 size={22} className="animate-spin" style={{ color: '#4F46E5' }} />
                    ) : (
                      <Circle size={22} style={{ color: '#D1D5DB' }} />
                    )}
                  </div>

                  {/* 步骤内容 */}
                  <div className="ml-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color:
                            item.status === 'done'
                              ? '#10B981'
                              : item.status === 'active'
                              ? '#4F46E5'
                              : '#9CA3AF',
                        }}
                      >
                        步骤{item.step}
                      </span>
                      <span
                        className="text-sm font-medium"
                        style={{
                          color:
                            item.status === 'pending' ? '#9CA3AF' : '#1F2937',
                        }}
                      >
                        {item.title}
                      </span>
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: '#6B7280' }}
                    >
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
