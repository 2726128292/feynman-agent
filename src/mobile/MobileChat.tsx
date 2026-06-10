import React, { useState } from 'react';
import {
  ArrowLeft,
  Send,
  Mic,
  Bot,
  User,
  ChevronLeft,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  mode?: 'explain' | 'question';
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'system',
    content: '',
    timestamp: '14:00',
    mode: 'explain',
  },
  {
    id: '2',
    role: 'user',
    content:
      'React Hooks 中的 useEffect 是一个用于处理副作用的 Hook。它接收两个参数：第一个是执行副作用操作的回调函数，第二个是依赖数组。当依赖数组中的值发生变化时，useEffect 就会重新执行。比如，当组件挂载时、状态更新时，或者组件卸载时，都可以通过 useEffect 来处理相应的逻辑。',
    timestamp: '14:01',
    mode: 'explain',
  },
  {
    id: '3',
    role: 'agent',
    content:
      '📝 收到你的讲解！你提到了几个关键点：\n\n1. **useEffect 的基本结构** — 回调函数 + 依赖数组 ✓\n2. **触发时机** — 挂载/更新/卸载 ✓\n\n我想追问一下：**如果依赖数组为空数组 `[]`，useEffect 的行为和 `componentDidMount` 有什么区别？** 另外，你提到「状态更新时」会重新执行——那如果依赖数组中包含一个对象或数组类型的 state，会不会出现无限循环的问题？为什么？',
    timestamp: '14:02',
    mode: 'question',
  },
  {
    id: '4',
    role: 'user',
    content:
      '空数组的 useEffect 确实类似 componentDidMount，只在组件首次渲染后执行一次。关于对象作为依赖的问题... 如果直接把对象放在依赖数组里，每次渲染都会创建新的对象引用，导致 useEffect 反复执行造成无限循环。解决方法是用 useMemo 缓存对象，或者只依赖对象中的具体属性。',
    timestamp: '14:04',
    mode: 'explain',
  },
  {
    id: '5',
    role: 'agent',
    content:
      '✅ **诊断摘要**\n\n| 维度 | 得分 | 评价 |\n|------|------|------|\n| 概念理解 | ⭐⭐⭐⭐ | 基本概念清晰 |\n| 因果逻辑 | ⭐⭐⭐⭐ | 能解释循环原因 |\n| 举例能力 | ⭐⭐⭐ | 可以补充代码示例 |\n| 边界认知 | ⭐⭐⭐⭐ | 知道解决方案 |\n| 迁移应用 | ⭐⭐ | 可追问实际场景 |\n\n💡 **建议下一步**：尝试用生活中的类比来解释「依赖比较」的概念，然后我们来做一道练习题巩固理解。',
    timestamp: '14:05',
    mode: 'explain',
  },
];

const MobileChat: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState<'explain' | 'question'>('explain');

  return (
    <div
      className="flex flex-col"
      style={{
        height: '100dvh',
        backgroundColor: '#F7F8FC',
        fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* 顶导：返回 + 标题 + 模式切换 */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 -ml-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} style={{ color: '#1F2937' }} />
          </button>
          <h1
            className="text-base font-semibold"
            style={{ color: '#1F2937' }}
          >
            讲解对话
          </h1>
        </div>

        {/* 模式切换 */}
        <div
          className="flex rounded-[10px] p-0.5"
          style={{ backgroundColor: '#F3F4F6' }}
        >
          <button
            onClick={() => setMode('explain')}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all ${
              mode === 'explain' ? 'shadow-sm' : ''
            }`}
            style={{
              backgroundColor: mode === 'explain' ? '#FFFFFF' : 'transparent',
              color: mode === 'explain' ? '#4F46E5' : '#9CA3AF',
            }}
          >
            讲解
          </button>
          <button
            onClick={() => setMode('question')}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all ${
              mode === 'question' ? 'shadow-sm' : ''
            }`}
            style={{
              backgroundColor: mode === 'question' ? '#FFFFFF' : 'transparent',
              color: mode === 'question' ? '#4F46E5' : '#9CA3AF',
            }}
          >
            追问
          </button>
        </div>
      </div>

      {/* 对话区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {MOCK_MESSAGES.map((msg) => {
          if (msg.role === 'system') {
            // 时间戳分隔线
            return (
              <div key={msg.id} className="flex items-center justify-center">
                <span
                  className="px-3 py-1 rounded-full text-[11px]"
                  style={{
                    backgroundColor: '#E5E7EB',
                    color: '#9CA3AF',
                  }}
                >
                  {msg.mode === 'explain'
                    ? '📖 讲解模式'
                    : '❓ 追问模式'} · {msg.timestamp}
                </span>
              </div>
            );
          }

          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] ${
                  isUser ? 'items-end' : 'items-start'
                } flex flex-col gap-1.5`}
              >
                <div className="flex items-end gap-1.5">
                  {!isUser && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-auto"
                      style={{
                        background: 'linear-gradient(135deg, #EEF2FF, #EDE9FE)',
                      }}
                    >
                      <Bot size={14} style={{ color: '#4F46E5' }} />
                    </div>
                  )}
                  <div
                    className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                    style={
                      isUser
                        ? {
                            backgroundColor: '#4F46E5',
                            color: '#FFFFFF',
                            borderBottomRightRadius: '4px',
                          }
                        : {
                            backgroundColor: '#FFFFFF',
                            color: '#1F2937',
                            borderBottomLeftRadius: '4px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                          }
                    }
                  >
                    {msg.content}
                  </div>
                  {isUser && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-auto"
                      style={{
                        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                      }}
                    >
                      <User size={13} style={{ color: '#FFFFFF' }} />
                    </div>
                  )}
                </div>
                <span
                  className={`text-[10px] px-1 ${
                    isUser ? 'text-right' : 'text-left'
                  }`}
                  style={{ color: '#D1D5DB' }}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部输入区固定 */}
      <div
        className="shrink-0 px-4 py-3 safe-area-bottom"
        style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E5E7EB',
        }}
      >
        <div className="flex items-center gap-2">
          <button
            className="p-2.5 rounded-[12px] shrink-0 transition-colors hover:bg-gray-50"
            style={{ backgroundColor: '#F3F4F6' }}
          >
            <Mic size={18} style={{ color: '#6B7280' }} />
          </button>
          <input
            type="text"
            placeholder={`${mode === 'explain' ? '讲解你的理解...' : '回答 Agent 的追问...'}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 rounded-[22px] border-0 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-400"
            style={{ color: '#1F2937' }}
          />
          <button
            className={`p-2.5 rounded-[12px] shrink-0 transition-all ${
              inputValue.trim() ? '' : 'opacity-40'
            }`}
            disabled={!inputValue.trim()}
            style={{
              backgroundColor: inputValue.trim()
                ? '#4F46E5'
                : '#E5E7EB',
            }}
          >
            <Send
              size={16}
              style={{
                color: inputValue.trim() ? '#FFFFFF' : '#9CA3AF',
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileChat;
