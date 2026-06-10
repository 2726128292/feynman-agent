import React, { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  BookOpen,
  Target,
  FileText,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  ArrowDown,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface ReviewTask {
  id: string;
  topicName: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueTime?: string;
}

interface UpcomingTask {
  date: string;
  tasks: ReviewTask[];
}

const TODAY_TASKS: ReviewTask[] = [
  {
    id: 't1',
    topicName: 'React Hooks 深度解析',
    type: '概念回顾',
    priority: 'high',
    completed: false,
    dueTime: '14:00',
  },
  {
    id: 't2',
    topicName: '英语语法：时态体系',
    type: '练习题',
    priority: 'high',
    completed: false,
    dueTime: '16:30',
  },
  {
    id: 't3',
    topicName: '数据结构与算法',
    type: '诊断补强',
    priority: 'medium',
    completed: true,
  },
  {
    id: 't4',
    topicName: '线性代数基础',
    type: '新主题讲解',
    priority: 'medium',
    completed: false,
    dueTime: '明天 09:00',
  },
  {
    id: 't5',
    topicName: '机器学习数学基础',
    type: '练习题',
    priority: 'low',
    completed: false,
  },
];

const UPCOMING_TASKS: UpcomingTask[] = [
  {
    date: '明天 · 6月11日',
    tasks: [
      {
        id: 'u1',
        topicName: '线性代数基础',
        type: '概念回顾',
        priority: 'high',
        completed: false,
        dueTime: '09:00',
      },
      {
        id: 'u2',
        topicName: '量子力学入门',
        type: '新主题讲解',
        priority: 'medium',
        completed: false,
      },
    ],
  },
  {
    date: '后天 · 6月12日',
    tasks: [
      {
        id: 'u3',
        topicName: '数据结构与算法',
        type: '诊断补强',
        priority: 'high',
        completed: false,
        dueTime: '10:00',
      },
    ],
  },
  {
    date: '周五 · 6月13日',
    tasks: [
      {
        id: 'u4',
        topicName: '量子力学入门',
        type: '概念回顾',
        priority: 'low',
        completed: false,
      },
      {
        id: 'u5',
        topicName: '机器学习数学基础',
        type: '诊断补强',
        priority: 'medium',
        completed: false,
      },
    ],
  },
];

// 迷你周历数据
const WEEK_DAYS = ['一', '二', '三', '四', '五', '六', '日'];
const WEEK_DATES = [
  { day: 9, hasTask: true, isPast: true },
  { day: 10, hasTask: true, isToday: true },
  { day: 11, hasTask: true },
  { day: 12, hasTask: true },
  { day: 13, hasTask: true },
  { day: 14, hasTask: false },
  { day: 15, hasTask: false },
];

const PRIORITY_CONFIG = {
  high: { color: '#EF4444', label: '高' },
  medium: { color: '#F59E0B', label: '中' },
  low: { color: '#10B981', label: '低' },
};

const TYPE_ICON_MAP: Record<string, React.ReactNode> = {
  '概念回顾': <BrainCircuit size={14} />,
  '练习题': <Target size={14} />,
  '诊断补强': <FileText size={14} />,
  '新主题讲解': <BookOpen size={14} />,
};

const TaskCard: React.FC<{
  task: ReviewTask;
  onToggle: (id: string) => void;
}> = ({ task, onToggle }) => {
  const priorityInfo = PRIORITY_CONFIG[task.priority];
  const typeIcon = TYPE_ICON_MAP[task.type] || <Target size={14} />;

  return (
    <div
      className="flex items-center gap-3 pl-4 pr-3 py-3 rounded-[14px] transition-colors"
      style={{
        backgroundColor: task.completed ? '#F9FAFB' : '#FFFFFF',
        borderLeft: `3px solid ${task.completed ? '#D1D5DB' : priorityInfo.color}`,
        boxShadow: task.completed ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
        opacity: task.completed ? 0.65 : 1,
      }}
    >
      <button
        onClick={() => onToggle(task.id)}
        className="shrink-0"
      >
        {task.completed ? (
          <CheckCircle2 size={22} style={{ color: '#10B981' }} />
        ) : (
          <Circle size={22} style={{ color: '#D1D5DB' }} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            task.completed ? 'line-through' : ''
          }`}
          style={{ color: task.completed ? '#9CA3AF' : '#1F2937' }}
        >
          {task.topicName}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center gap-1 text-[11px]" style={{ color: '#9CA3AF' }}>
            {typeIcon}
            {task.type}
          </span>
          {task.dueTime && !task.completed && (
            <span className="flex items-center gap-0.5 text-[11px]" style={{ color: '#9CA3AF' }}>
              <Clock size={10} />
              {task.dueTime}
            </span>
          )}
        </div>
      </div>

      <Badge
        variant={
          task.priority === 'high'
            ? 'error'
            : task.priority === 'medium'
            ? 'warning'
            : 'success'
        }
        size="sm"
      >
        {priorityInfo.label}
      </Badge>
    </div>
  );
};

const MobileReview: React.FC = () => {
  const [tasks, setTasks] = useState(TODAY_TASKS);
  const [upcomingExpanded, setUpcomingExpanded] = useState(false);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const todayCompletedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="pb-24 space-y-5" style={{ minHeight: '100vh' }}>
      {/* 顶部标题 */}
      <div className="pt-3 pb-1">
        <h1
          className="text-xl font-bold"
          style={{ color: '#1F2937' }}
        >
          复习计划
        </h1>
        <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
          今日进度：{todayCompletedCount}/{TODAY_TASKS.length} 已完成
        </p>
      </div>

      {/* 迷你周历（横向） */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
            2025年6月
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded-md hover:bg-gray-100">
              <ChevronLeft size={14} style={{ color: '#9CA3AF' }} />
            </button>
            <button className="p-1 rounded-md hover:bg-gray-100">
              <ChevronRight size={14} style={{ color: '#9CA3AF' }} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {WEEK_DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] font-medium pb-1"
              style={{ color: '#9CA3AF' }}
            >
              {day}
            </div>
          ))}
          {WEEK_DATES.map((date) => (
            <button
              key={date.day}
              className={`relative flex flex-col items-center py-1.5 rounded-[10px] text-sm font-medium transition-colors ${
                date.isToday ? '' : ''
              }`}
              style={{
                backgroundColor: date.isToday ? '#4F46E5' : 'transparent',
                color: date.isToday
                  ? '#FFFFFF'
                  : date.isPast
                  ? '#D1D5DB'
                  : '#1F2937',
              }}
            >
              {date.day}
              {date.hasTask && !date.isToday && (
                <span
                  className="absolute bottom-0.5 w-1 h-1 rounded-full"
                  style={{ backgroundColor: '#4F46E5' }}
                />
              )}
              {date.hasTask && date.isToday && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-white" />
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* 今日任务卡片列表 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} style={{ color: '#4F46E5' }} />
          <h2
            className="text-base font-semibold"
            style={{ color: '#1F2937' }}
          >
            今日任务
          </h2>
          <Badge variant="primary" size="sm">{todayCompletedCount}/{TODAY_TASKS.length}</Badge>
        </div>

        <div className="space-y-2.5">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggle={toggleTask} />
          ))}
        </div>
      </div>

      {/* Upcoming 折叠区域 */}
      <div>
        <button
          onClick={() => setUpcomingExpanded(!upcomingExpanded)}
          className="flex items-center justify-between w-full py-2"
        >
          <div className="flex items-center gap-2">
            <ArrowDown size={16} style={{ color: '#9CA3AF' }} />
            <h2
              className="text-base font-semibold"
              style={{ color: '#1F2937' }}
            >
              即将到来
            </h2>
            <Badge variant="default" size="sm">
              {UPCOMING_TASKS.reduce(
                (sum, group) => sum + group.tasks.length,
                0
              )}{' '}
              项
            </Badge>
          </div>
          {upcomingExpanded ? (
            <ChevronUp size={18} style={{ color: '#9CA3AF' }} />
          ) : (
            <ChevronDown size={18} style={{ color: '#9CA3AF' }} />
          )}
        </button>

        {upcomingExpanded && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
            {UPCOMING_TASKS.map((group) => (
              <div key={group.date}>
                <p
                  className="text-xs font-medium mb-2 px-1"
                  style={{ color: '#9CA3AF' }}
                >
                  {group.date}
                </p>
                <div className="space-y-2">
                  {group.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => {}}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileReview;
