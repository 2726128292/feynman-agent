import React, { useState } from 'react';
import {
  TrendingUp,
  BookOpen,
  Target,
  BarChart3,
  Clock,
  ArrowDown,
  PieChart,
  LineChart as LineChartIcon,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Select from '@/components/ui/Select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

type TimeRange = '7d' | '30d' | '3m' | 'all';

const TIME_RANGE_OPTIONS = [
  { label: '近 7 天', value: '7d' },
  { label: '近 30 天', value: '30d' },
  { label: '近 3 个月', value: '3m' },
  { label: '全部', value: 'all' },
];

// 模拟讲解次数趋势数据
const EXPLAIN_TREND_DATA = [
  { date: '06/01', count: 3 },
  { date: '06/02', count: 5 },
  { date: '06/03', count: 2 },
  { date: '06/04', count: 7 },
  { date: '06/05', count: 4 },
  { date: '06/06', count: 6 },
  { date: '06/07', count: 8 },
  { date: '06/08', count: 5 },
  { date: '06/09', count: 9 },
  { date: '06/10', count: 7 },
];

// 模拟五维掌握度数据
const MASTERY_DIMENSION_DATA = [
  { name: '概念理解', value: 78, fill: '#EF4444' },
  { name: '因果逻辑', value: 65, fill: '#F97316' },
  { name: '举例能力', value: 72, fill: '#EAB308' },
  { name: '边界认知', value: 55, fill: '#22C55E' },
  { name: '迁移应用', value: 48, fill: '#3B82F6' },
];

// 模拟知识领域分布
const DOMAIN_DISTRIBUTION_DATA = [
  { name: '计算机科学', value: 40, color: '#4F46E5' },
  { name: '数学', value: 20, color: '#7C3AED' },
  { name: '物理', value: 15, color: '#EC4899' },
  { name: '语言学习', value: 15, color: '#10B981' },
  { name: '考试备考', value: 10, color: '#F59E0B' },
];

// 摘要卡片数据
const SUMMARY_CARDS = [
  {
    label: '总讲解次数',
    value: '56',
    icon: <BookOpen size={20} />,
    change: '+12%',
    positive: true,
  },
  {
    label: '总练习完成',
    value: '128',
    icon: <Target size={20} />,
    change: '+23%',
    positive: true,
  },
  {
    label: '平均掌握度',
    value: '67.2%',
    icon: <BarChart3 size={20} />,
    change: '+5.3%',
    positive: true,
  },
  {
    label: '学习时长',
    value: '24.5h',
    icon: <Clock size={20} />,
    change: '+2.1h',
    positive: true,
  },
];

// 薄弱点排行
const WEAK_POINTS_DATA = [
  { rank: 1, topic: '递归与回溯算法', dimension: '迁移应用', score: 38, trend: -3 },
  { rank: 2, topic: '傅里叶变换原理', dimension: '概念理解', score: 42, trend: +1 },
  { rank: 3, topic: '虚拟 DOM Diff 算法', dimension: '因果逻辑', score: 45, trend: -2 },
  { rank: 4, topic: '英语虚拟语气', dimension: '举例能力', score: 48, trend: 0 },
  { rank: 5, topic: '特征值与特征向量', dimension: '边界认知', score: 52, trend: +4 },
];

const LearningStats: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 页面标题 + 时间范围选择器 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>
            学习统计
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            可视化追踪你的学习进度和知识掌握情况
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-[12px] p-1" style={{ backgroundColor: '#F3F4F6' }}>
          {TIME_RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeRange(opt.value as TimeRange)}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all ${
                timeRange === opt.value ? 'shadow-sm' : ''
              }`}
              style={{
                backgroundColor: timeRange === opt.value ? '#FFFFFF' : 'transparent',
                color: timeRange === opt.value ? '#4F46E5' : '#6B7280',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 数据摘要卡片行 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_CARDS.map((card) => (
          <Card key={card.label} padding="lg" hoverable>
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #EEF2FF, #EDE9FE)',
                  color: '#4F46E5',
                }}
              >
                {card.icon}
              </div>
              <Badge
                variant={card.positive ? 'success' : 'error'}
                size="sm"
              >
                {card.change}
              </Badge>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#1F2937' }}>
              {card.value}
            </p>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
              {card.label}
            </p>
          </Card>
        ))}
      </div>

      {/* 图表区域：折线图 + 柱状图 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 折线图：讲解次数趋势 */}
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <LineChartIcon size={18} style={{ color: '#4F46E5' }} />
            <h3 className="text-base font-semibold" style={{ color: '#1F2937' }}>
              讲解次数趋势
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={EXPLAIN_TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '13px',
                  color: '#1F2937',
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#4F46E5"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#FFFFFF', stroke: '#4F46E5', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#4F46E5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* 柱状图：五维掌握度变化对比 */}
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} style={{ color: '#7C3AED' }} />
            <h3 className="text-base font-semibold" style={{ color: '#1F2937' }}>
              五维掌握度对比
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MASTERY_DIMENSION_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} unit="%" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} width={80} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '13px',
                  color: '#1F2937',
                }}
                formatter={(value: number) => [`${value}%`, '掌握度']}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                {MASTERY_DIMENSION_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 饼图：知识领域分布 */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <PieChart size={18} style={{ color: '#10B981' }} />
          <h3 className="text-base font-semibold" style={{ color: '#1F2937' }}>
            知识领域分布
          </h3>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ResponsiveContainer width="100%" height={280}>
            <RechartsPieChart>
              <Pie
                data={DOMAIN_DISTRIBUTION_DATA}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {DOMAIN_DISTRIBUTION_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '13px',
                  color: '#1F2937',
                }}
                formatter={(value: number) => [`${value}%`, '占比']}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 shrink-0">
            {DOMAIN_DISTRIBUTION_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-2.5">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm" style={{ color: '#6B7280' }}>{item.name}</span>
                <span className="text-sm font-semibold ml-auto" style={{ color: '#1F2937' }}>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 薄弱点排行表 */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <ArrowDown size={18} style={{ color: '#EF4444' }} />
          <h3 className="text-base font-semibold" style={{ color: '#1F2937' }}>
            薄弱点排行 Top 5
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                <th className="text-left py-3 px-3 font-semibold w-12" style={{ color: '#6B7280' }}>#</th>
                <th className="text-left py-3 px-3 font-semibold" style={{ color: '#6B7280' }}>知识点</th>
                <th className="text-left py-3 px-3 font-semibold" style={{ color: '#6B7280' }}>薄弱维度</th>
                <th className="text-right py-3 px-3 font-semibold" style={{ color: '#6B7280' }}>得分</th>
                <th className="text-right py-3 px-3 font-semibold" style={{ color: '#6B7280' }}>趋势</th>
              </tr>
            </thead>
            <tbody>
              {WEAK_POINTS_DATA.map((item) => (
                <tr key={item.rank} style={{ borderBottom: '1px solid #F3F4F6' }} className="hover:bg-gray-50">
                  <td className="py-3 px-3">
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: item.rank <= 2 ? '#FEE2E2' : '#F3F4F6',
                        color: item.rank <= 2 ? '#DC2626' : '#6B7280',
                      }}
                    >
                      {item.rank}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium" style={{ color: '#1F2937' }}>
                    {item.topic}
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="warning" size="sm">{item.dimension}</Badge>
                  </td>
                  <td className="py-3 px-3 text-right font-mono" style={{ color: item.score < 45 ? '#EF4444' : '#F59E0B' }}>
                    {item.score}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className="inline-flex items-center gap-0.5 text-xs font-medium"
                      style={{ color: item.trend > 0 ? '#10B981' : item.trend < 0 ? '#EF4444' : '#9CA3AF' }}
                    >
                      {item.trend > 0 ? `+${item.trend}` : item.trend}
                      {item.trend !== 0 && (item.trend > 0 ? '↑' : '↓')}
                    </span>
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

export default LearningStats;
