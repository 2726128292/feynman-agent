import React, { useState } from 'react';
import {
  ArrowLeft,
  Send,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Bot,
  User,
  Lightbulb,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface ChatMessage {
  id: string;
  role: 'agent' | 'user';
  content: string;
  timestamp: string;
}

interface QuestionRound {
  roundNumber: number;
  totalRounds: number;
  strategy: string;
  questions: ChatMessage[];
  userAnswers: ChatMessage[];
}

const mockConversationData: QuestionRound = {
  roundNumber: 2,
  totalRounds: 3,
  strategy: '从概念定义向边界条件推进',
  questions: [
    {
      id: 'q1',
      role: 'agent',
      content:
        '我仔细阅读了你的讲解，发现几个值得深入探讨的地方。让我们逐一分析。',
      timestamp: '14:23',
    },
    {
      id: 'q2',
      role: 'agent',
      content:
        '你提到自注意力机制让每个词关注其他词，那为什么需要缩放点积呢？直接做点积会有什么问题？',
      timestamp: '14:24',
    },
  ],
  userAnswers: [
    {
      id: 'a1',
      role: 'user',
      content:
        '缩放点积是为了防止数值过大...当向量维度很高时，点积结果会很大，导致 softmax 函数的梯度变得非常小。',
      timestamp: '14:26',
    },
  ],
};

const mockFutureQuestions: ChatMessage[] = [
  {
    id: 'q3',
    role: 'agent',
    content:
      '很好的观察！那你认为 softmax 在这里起到了什么作用？如果去掉 softmax，注意力权重会变成什么样？',
    timestamp: '14:28',
  },
];

const SocraticQuestioning: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    ...mockConversationData.questions,
    ...mockConversationData.userAnswers,
  ]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newAnswer: ChatMessage = {
      id: `a${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newAnswer]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
          苏格拉底式追问
        </h1>
        <Badge variant="primary">进行中</Badge>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex gap-6">
          {/* Main Chat Area */}
          <div className="flex-1 space-y-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}

            {/* Simulated Next Question */}
            <ChatBubble message={mockFutureQuestions[0]} />

            {/* User Input Area */}
            <Card padding="md" className="mt-4">
              <div className="flex gap-3">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入你的回答..."
                  rows={3}
                  className="flex-1 resize-none rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2"
                  style={{
                    borderColor: '#E5E7EB',
                    backgroundColor: '#FAFAFA',
                    color: '#1F2937',
                    fontFamily: 'inherit',
                  }}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleSend}
                    icon={<Send size={16} />}
                    disabled={!inputValue.trim()}
                  >
                    发送回答
                  </Button>
                  <Button variant="secondary" icon={<Stethoscope size={16} />}>
                    进入诊断
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Sidebar Panel */}
          <aside className="w-80 shrink-0 space-y-4">
            {/* Round Indicator */}
            <Card padding="md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: '#6B7280' }}>
                  当前轮次
                </span>
                <span
                  className="text-2xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  第 {mockConversationData.roundNumber} / {mockConversationData.totalRounds} 轮追问
                </span>
              </div>
              <div
                className="mt-3 h-2 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: '#E5E7EB' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(mockConversationData.roundNumber / mockConversationData.totalRounds) * 100}%`,
                    background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
                  }}
                />
              </div>
            </Card>

            {/* Strategy Card */}
            <Card padding="md">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={18} style={{ color: '#F59E0B' }} />
                <span className="text-sm font-semibold" style={{ color: '#1F2937' }}>
                  追问策略说明
                </span>
              </div>
              <div
                className="rounded-xl p-3 text-sm leading-relaxed"
                style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
              >
                当前策略：<strong>{mockConversationData.strategy}</strong>
                <p className="mt-2 opacity-80">
                  Agent 正在引导你从基础概念逐步深入到边界条件和反例思考。
                </p>
              </div>
            </Card>

            {/* Collapsible History Summary */}
            <Card padding="md">
              <button
                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} style={{ color: '#4F46E5' }} />
                  <span className="text-sm font-semibold" style={{ color: '#1F2937' }}>
                    追问历史摘要
                  </span>
                </div>
                {isHistoryExpanded ? (
                  <ChevronUp size={18} style={{ color: '#6B7280' }} />
                ) : (
                  <ChevronDown size={18} style={{ color: '#6B7280' }} />
                )}
              </button>

              {isHistoryExpanded && (
                <div className="mt-3 space-y-3">
                  {[1, 2].map((round) => (
                    <div
                      key={round}
                      className="rounded-lg p-3 text-xs leading-relaxed"
                      style={{ backgroundColor: '#F9FAFB', color: '#6B7280' }}
                    >
                      <div className="mb-1 font-semibold" style={{ color: '#1F2937' }}>
                        第 {round} 轮
                      </div>
                      <div>策略：概念澄清 → 类比验证</div>
                      <div>结论：用户对自注意力的直觉基本正确，但数学细节模糊</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

/* ── Sub-components ─────────────────────────────────────── */

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isAgent = message.role === 'agent';

  return (
    <div className={`flex gap-3 ${isAgent ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: isAgent ? '#EDE9FE' : '#DBEAFE',
          color: isAgent ? '#4F46E5' : '#2563EB',
        }}
      >
        {isAgent ? <Bot size={18} /> : <User size={18} />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAgent ? 'rounded-tl-sm' : 'rounded-tr-sm'
        }`}
        style={
          isAgent
            ? { backgroundColor: '#FFFFFF', color: '#1F2937', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
            : { background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: '#FFFFFF' }
        }
      >
        <p>{message.content}</p>
        <span
          className={`mt-1 block text-[11px] ${isAgent ? 'text-right' : ''}`}
          style={{ color: isAgent ? '#9CA3AF' : 'rgba(255,255,255,0.7)' }}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
};

export default SocraticQuestioning;
