import React, { useState, useMemo } from 'react';
import {
  Search,
  Grid3X3,
  List,
  BookOpen,
  Clock,
  TrendingUp,
  Calendar,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import type { Topic } from '@/types/topic';

const CATEGORIES = ['全部', '计算机科学', '数学', '物理', '语言学习', '考试备考'] as const;
const SORT_OPTIONS = [
  { label: '最近更新', value: 'updated' },
  { label: '掌握度', value: 'mastery' },
  { label: '创建时间', value: 'created' },
] as const;

const MOCK_TOPICS: Topic[] = [
  {
    id: '1',
    title: 'React Hooks 深度解析',
    category: '计算机科学',
    goal: '掌握 useState、useEffect、useCallback 等核心 Hook 的原理与最佳实践',
    privacy_level: 'local_only',
    tags: ['React', '前端', 'Hooks'],
    mastery: 78,
    status: 'explaining',
    created_at: '2025-01-15T08:00:00Z',
    updated_at: '2025-06-05T10:30:00Z',
  },
  {
    id: '2',
    title: '线性代数基础',
    category: '数学',
    goal: '理解向量空间、矩阵运算、特征值分解等核心概念',
    privacy_level: 'allow_cloud',
    tags: ['线性代数', '矩阵', '向量'],
    mastery: 45,
    status: 'questioning',
    created_at: '2025-02-20T09:00:00Z',
    updated_at: '2025-06-04T14:20:00Z',
  },
  {
    id: '3',
    title: '量子力学入门',
    category: '物理',
    goal: '理解波函数、薛定谔方程、量子叠加等基本概念',
    privacy_level: 'local_only',
    tags: ['量子力学', '波函数'],
    mastery: 32,
    status: 'topic_created',
    created_at: '2025-03-10T10:00:00Z',
    updated_at: '2025-06-03T09:15:00Z',
  },
  {
    id: '4',
    title: '英语语法：时态体系',
    category: '语言学习',
    goal: '系统掌握英语16种时态的用法和区别',
    privacy_level: 'ask_every_time',
    tags: ['英语', '语法', '时态'],
    mastery: 89,
    status: 'reinforcing',
    created_at: '2025-01-05T07:00:00Z',
    updated_at: '2025-06-06T11:00:00Z',
  },
  {
    id: '5',
    title: '数据结构与算法',
    category: '考试备考',
    goal: '备战技术面试，重点掌握常见数据结构和算法模式',
    privacy_level: 'local_only',
    tags: ['算法', '数据结构', '面试'],
    mastery: 65,
    status: 'scheduled',
    created_at: '2025-04-01T12:00:00Z',
    updated_at: '2025-06-02T16:45:00Z',
  },
  {
    id: '6',
    title: '机器学习数学基础',
    category: '计算机科学',
    goal: '理解梯度下降、概率论、优化理论在 ML 中的应用',
    privacy_level: 'allow_cloud',
    tags: ['机器学习', '数学', '优化'],
    mastery: 52,
    status: 'diagnosing',
    created_at: '2025-03-25T14:00:00Z',
    updated_at: '2025-06-01T13:30:00Z',
  },
];

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  const statusColors: Record<string, string> = {
    topic_created: '#6B7280',
    explaining: '#4F46E5',
    questioning: '#F59E0B',
    diagnosing: '#8B5CF6',
    reinforcing: '#10B981',
    scheduled: '#3B82F6',
  };

  const masteryColor =
    topic.mastery >= 80 ? '#10B981' : topic.mastery >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <Card hoverable onClick={onClick} className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={18} style={{ color: '#4F46E5' }} />
          <h3
            className="font-semibold text-base line-clamp-1"
            style={{ color: '#1F2937' }}
          >
            {topic.title}
          </h3>
        </div>
        <Badge variant="info" size="sm">
          {topic.category}
        </Badge>
      </div>

      <p
        className="text-sm line-clamp-2"
        style={{ color: '#6B7280' }}
      >
        {topic.goal}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {topic.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs rounded-md"
            style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: '#F3F4F6' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} style={{ color: masteryColor }} />
            <span className="text-xs font-medium" style={{ color: masteryColor }}>
              掌握度 {topic.mastery}%
            </span>
          </div>
          <Badge
            variant={
              topic.status === 'reinforcing'
                ? 'success'
                : topic.status === 'explaining' || topic.status === 'scheduled'
                ? 'primary'
                : 'default'
            }
            size="sm"
          >
            {topic.status === 'topic_created'
              ? '已创建'
              : topic.status === 'explaining'
              ? '讲解中'
              : topic.status === 'questioning'
              ? '追问中'
              : topic.status === 'diagnosing'
              ? '诊断中'
              : topic.status === 'reinforcing'
              ? '补强中'
              : '复习中'}
          </Badge>
        </div>
        <ArrowRight size={14} style={{ color: '#9CA3AF' }} />
      </div>
    </Card>
  );
};

const KnowledgeBase: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [sortBy, setSortBy] = useState<string>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const filteredTopics = useMemo(() => {
    let result = [...MOCK_TOPICS];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.goal.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (activeCategory !== '全部') {
      result = result.filter((t) => t.category === activeCategory);
    }

    switch (sortBy) {
      case 'mastery':
        result.sort((a, b) => b.mastery - a.mastery);
        break;
      case 'created':
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'updated':
      default:
        result.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        break;
    }

    return result;
  }, [searchQuery, activeCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: '#1F2937' }}
        >
          知识库
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          管理和浏览所有学习主题，追踪每个知识点的掌握进度
        </p>
      </div>

      {/* 搜索栏 + 筛选 + 排序 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="搜索主题名称、标签或目标..."
            prefixIcon={<Search size={16} />}
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <div className="flex items-center gap-2">
          {/* 视图切换 */}
          <div className="flex items-center rounded-[10px] border overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid' ? '' : ''
              }`}
              style={{
                backgroundColor: viewMode === 'grid' ? '#F3F4F6' : 'transparent',
                color: viewMode === 'grid' ? '#4F46E5' : '#6B7280',
              }}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors`}
              style={{
                backgroundColor: viewMode === 'list' ? '#F3F4F6' : 'transparent',
                color: viewMode === 'list' ? '#4F46E5' : '#6B7280',
              }}
            >
              <List size={18} />
            </button>
          </div>

          {/* 排序选择 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-[10px] border px-3 py-2.5 text-sm outline-none cursor-pointer"
            style={{
              borderColor: '#E5E7EB',
              backgroundColor: '#FFFFFF',
              color: '#1F2937',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 分类筛选标签 */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat ? 'shadow-sm' : ''
            }`}
            style={{
              backgroundColor:
                activeCategory === cat
                  ? '#4F46E5'
                  : '#FFFFFF',
              color: activeCategory === cat ? '#FFFFFF' : '#6B7280',
              border: `1px solid ${activeCategory === cat ? '#4F46E5' : '#E5E7EB'}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 主题卡片网格 */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
            : 'flex flex-col gap-3'
        }
      >
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onClick={() => setSelectedTopic(topic)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <BookOpen size={40} className="mx-auto mb-3" style={{ color: '#D1D5DB' }} />
            <p style={{ color: '#9CA3AF' }}>没有找到匹配的主题</p>
          </div>
        )}
      </div>

      {/* 主题详情 Modal */}
      <Modal
        open={!!selectedTopic}
        onClose={() => setSelectedTopic(null)}
        title={selectedTopic?.title || ''}
        width="lg"
      >
        {selectedTopic && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="info">{selectedTopic.category}</Badge>
              <Badge
                variant={
                  selectedTopic.mastery >= 80
                    ? 'success'
                    : selectedTopic.mastery >= 50
                    ? 'warning'
                    : 'error'
                }
              >
                掌握度 {selectedTopic.mastery}%
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-1.5" style={{ color: '#1F2937' }}>
                学习目标
              </h4>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                {selectedTopic.goal}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-1.5" style={{ color: '#1F2937' }}>
                标签
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedTopic.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs rounded-md"
                    style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                <Calendar size={14} />
                创建于{' '}
                {new Date(selectedTopic.created_at).toLocaleDateString('zh-CN')}
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                <Clock size={14} />
                更新于{' '}
                {new Date(selectedTopic.updated_at).toLocaleDateString('zh-CN')}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default KnowledgeBase;
