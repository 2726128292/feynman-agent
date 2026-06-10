import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

/* ── Types ─────────────────────────────────────────────── */

interface TaskItem {
  id: string;
  topic: string;
  type: string;
  typeVariant: 'info' | 'warning' | 'error' | 'success' | 'primary';
  priority: 'high' | 'medium' | 'low';
  duration: string;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasTask: boolean;
  taskCount?: number;
}

interface UpcomingDay {
  dayName: string;
  date: number;
  tasks: number;
}

/* ── Mock Data ─────────────────────────────────────────── */

const mockTasks: TaskItem[] = [
  {
    id: 't1',
    topic: '自注意力机制的缩放技巧',
    type: '解释题',
    typeVariant: 'primary',
    priority: 'high',
    duration: '8 分钟',
  },
  {
    id: 't2',
    topic: 'Multi-Head 参数独立性辨析',
    type: '选择题',
    typeVariant: 'info',
    priority: 'medium',
    duration: '5 分钟',
  },
  {
    id: 't3',
    topic: '「注意力≠语义理解」反例构造',
    type: '反例挑战',
    typeVariant: 'error',
    priority: 'high',
    duration: '10 分钟',
  },
  {
    id: 't4',
    topic: 'Q/K/V 图书馆类比及其局限',
    type: '类比验证',
    typeVariant: 'warning',
    priority: 'low',
    duration: '6 分钟',
  },
];

const mockUpcoming: UpcomingDay[] = [
  { dayName: '明天', date: 11, tasks: 3 },
  { dayName: '周四', date: 12, tasks: 2 },
  { dayName: '周五', date: 13, tasks: 4 },
  { dayName: '周六', date: 14, tasks: 1 },
];

function generateCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  const days: CalendarDay[] = [];

  // Previous month padding
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
      hasTask: false,
    });
  }

  // Current month days
  const taskDates = [3, 5, 8, 10, 11, 12, 13, 14, 17, 20, 24, 27];
  for (let d = 1; d <= daysInMonth; d++) {
    const hasTask = taskDates.includes(d);
    days.push({
      date: d,
      isCurrentMonth: true,
      isToday: isCurrentMonth && d === today.getDate(),
      hasTask,
      taskCount: hasTask ? (d === 10 ? 4 : Math.floor(Math.random() * 3) + 1) : undefined,
    });
  }

  // Next month padding
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false,
      hasTask: false,
    });
  }

  return days;
}

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

const PRIORITY_CONFIG: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  high: { color: '#EF4444', bg: '#FEE2E2', label: '高优先' },
  medium: { color: '#F59E0B', bg: '#FEF3C7', label: '中优先' },
  low: { color: '#10B981', bg: '#D1FAE5', label: '低优先' },
};

/* ── Component ──────────────────────────────────────────── */

const ReviewPlan: React.FC = () => {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<number>(now.getDate());

  const calendarDays = generateCalendarDays(viewYear, viewMonth);

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const monthLabel = `${viewYear}年 ${viewMonth + 1}月`;

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
        <h1 className="text-xl font-bold" style={{ color: '#1F2937' }}>
          复习计划
        </h1>
        <Badge variant="primary">
          <Calendar size={12} className="mr-1" />
          间隔重复
        </Badge>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex gap-6">
          {/* ── Left: Mini Calendar ─────────────────────── */}
          <aside className="w-[340px] shrink-0 space-y-4">
            <Card padding="md">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={goPrevMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                  style={{ color: '#6B7280' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#F3F4F6')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm font-semibold" style={{ color: '#1F2937' }}>
                  {monthLabel}
                </span>
                <button
                  onClick={goNextMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                  style={{ color: '#6B7280' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#F3F4F6')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEKDAY_LABELS.map((label) => (
                  <div
                    key={label}
                    className="py-2 text-center text-xs font-medium"
                    style={{ color: '#9CA3AF' }}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => day.isCurrentMonth && setSelectedDate(day.date)}
                    disabled={!day.isCurrentMonth}
                    className="
                      relative flex flex-col items-center justify-center
                      h-10 rounded-xl text-sm transition-all
                      cursor-pointer
                    "
                    style={
                      day.isToday
                        ? {
                            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                            color: '#FFFFFF',
                            fontWeight: 700,
                            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.35)',
                          }
                        : !day.isCurrentMonth
                          ? { color: '#D1D5DB', cursor: 'default' }
                          : selectedDate === day.date
                            ? { backgroundColor: '#EDE9FE', color: '#4F46E5', fontWeight: 600 }
                            : { color: '#374151' }
                    }
                    onMouseEnter={(e) => {
                      if (day.isCurrentMonth && !day.isToday) {
                        e.currentTarget.style.backgroundColor = day.isToday
                          ? ''
                          : '#F9FAFB';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (day.isCurrentMonth && !day.isToday) {
                        e.currentTarget.style.backgroundColor =
                          selectedDate === day.date ? '#EDE9FE' : 'transparent';
                      }
                    }}
                  >
                    {day.date}
                    {day.hasTask && day.isCurrentMonth && (
                      <span
                        className="absolute bottom-1 h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor: day.isToday ? '#FFFFFF' : '#4F46E5',
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Selected Date Info */}
              {selectedDate && (
                <div
                  className="mt-4 rounded-xl p-3 text-xs"
                  style={{ backgroundColor: '#F9FAFB', color: '#6B7280' }}
                >
                  <div className="font-semibold mb-1" style={{ color: '#1F2937' }}>
                    {viewMonth + 1}月{selectedDate}日
                  </div>
                  {selectedDate === 10 ? (
                    <>
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle2 size={12} style={{ color: '#10B981' }} />
                        今天有 {mockTasks.length} 个复习任务待完成
                        </div>
                    </>
                  ) : (
                    <div className="mt-1">暂无任务安排</div>
                  )}
                </div>
              )}
            </Card>

            {/* Upcoming Schedule */}
            <Card padding="md">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#1F2937' }}>
                <Zap size={16} style={{ color: '#F59E0B' }} />
                Upcoming 排期
              </h3>
              <div className="space-y-2">
                {mockUpcoming.map((item) => (
                  <div
                    key={item.dayName}
                    className="flex items-center justify-between rounded-lg p-2.5 text-xs"
                    style={{ backgroundColor: '#FAFAFA' }}
                  >
                    <div>
                      <span className="font-medium" style={{ color: '#1F2937' }}>
                        {item.dayName}
                      </span>
                      <span className="ml-2" style={{ color: '#9CA3AF' }}>
                        {viewMonth + 1}/{item.date}
                      </span>
                    </div>
                    <Badge variant={item.tasks >= 3 ? 'warning' : 'default'} size="sm">
                      {item.tasks} 任务
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </aside>

          {/* ── Right: Task List ────────────────────────── */}
          <main className="flex-1 space-y-4">
            {/* Today's Review Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold" style={{ color: '#1F2937' }}>
                  今日复习
                </h2>
                <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                  共 {mockTasks.length} 个任务 · 预计约{' '}
                  {mockTasks.reduce(
                    (acc, t) => acc + parseInt(t.duration),
                    0
                  )}{' '}
                  分钟
                </p>
              </div>
              <Button icon={<Play size={16} />}>
                一键开始复习
              </Button>
            </div>

            {/* Task Cards */}
            <div className="space-y-3">
              {mockTasks.map((task) => {
                const pCfg = PRIORITY_CONFIG[task.priority];
                return (
                  <Card key={task.id} padding="md" hoverable>
                    <div className="flex items-start gap-4">
                      {/* Priority Indicator */}
                      <div
                        className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: pCfg.color }}
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold truncate" style={{ color: '#1F2937' }}>
                            {task.topic}
                          </h3>
                          <Badge variant={task.typeVariant} size="sm">
                            {task.type}
                          </Badge>
                          <Badge
                            size="sm"
                            style={{ backgroundColor: pCfg.bg, color: pCfg.color }}
                          >
                            {pCfg.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span
                            className="flex items-center gap-1 text-xs"
                            style={{ color: '#9CA3AF' }}
                          >
                            <Clock size={12} />
                            {task.duration}
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <Button size="sm" icon={<Play size={14} />}>
                        开始
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Floating CTA (visible when scrolled or always at bottom) */}
            <div className="sticky bottom-6 z-10 flex justify-end">
              <Button
                size="lg"
                icon={<Play size={18} />}
                className="shadow-lg"
                style={{ boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)' }}
              >
                一键开始复习
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ReviewPlan;
