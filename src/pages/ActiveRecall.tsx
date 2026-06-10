import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Lightbulb,
  BookOpen,
  BarChart3,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface PracticeQuestion {
  id: number;
  type: string;
  question: string;
  answer: string;
  hints: string[];
}

const mockQuestions: PracticeQuestion[] = [
  {
    id: 1,
    type: '解释题',
    question: '为什么注意力分数要除以 √dₖ？',
    answer:
      '当向量维度 dₖ 较大时，点积结果的方差会随维度增大而增大，导致 softmax 输出趋近 one-hot（梯度消失）。除以 √dₖ 将方差归一化，使注意力分布更平滑，梯度更稳定。',
    hints: [
      '考虑高维空间中随机向量点积的数值分布特点',
      '思考 softmax 函数在输入值过大时的行为',
      '这本质上是一个数值稳定性技巧',
    ],
  },
  {
    id: 2,
    type: '选择题',
    question: '以下关于 Multi-Head Attention 的说法，哪项是错误的？\n\nA. 多头可以让模型同时关注不同位置的不同表示子空间\nB. 各头的参数是共享的\nC. 输出线性投影将多头结果合并',
    answer:
      'B 错误。Multi-Head Attention 的每个头有独立的 W^Q、W^K、W^V 参数矩阵，不共享参数。各头可以学习到不同的 attention pattern。',
    hints: [
      '回忆 Transformer 论文中对 Multi-Head 的定义',
      '每个 head 是否有自己的投影矩阵？',
      '如果参数完全共享，多头的意义是什么？',
    ],
  },
  {
    id: 3,
    type: '反例挑战',
    question: '「自注意力机制让模型理解了词语的语义」——这句话有什么问题？请给出反例。',
    answer:
      '这句话不准确。自注意力计算的是 token 之间的**相关性权重**，而非真正的语义理解。反例：在 "bank of the river" 和 "bank account" 中，attention 能正确关联 bank 与 river/account，但这只是基于共现统计的模式匹配，模型并不真正理解 "bank" 的概念。当遇到 "He deposited money at the river bank" 这种歧义句时，纯 attention 可能出错。',
    hints: [
      '区分「统计相关性」与「语义理解」',
      '考虑一词多义（polysemy）场景下 attention 的表现',
      '想想 attention 本质上在做什么运算',
    ],
  },
  {
    id: 4,
    type: '类比验证',
    question: '请用「图书馆检索系统」类比 Query / Key / Value 三个角色，并指出类比的局限性。',
    answer:
      'Query = 读者的检索需求；Key = 书籍的分类标签/索引词；Value = 书籍的实际内容。局限性：(1) 真实检索是精确匹配，attention 是加权软匹配；(2) 检索系统返回离散结果，attention 返回连续权重分布；(3) 类比无法体现缩放和 softmax 的作用。',
    hints: [
      '先建立 Q/K/V 与检索系统的对应关系',
      '然后思考 attention 的「软匹配」与硬检索的区别',
      '哪些数学操作在这个类比中找不到对应？',
    ],
  },
  {
    id: 5,
    type: '因果链',
    question: '请完整描述从输入序列到最终注意力输出之间的数据流因果链。',
    answer:
      'Input → Embedding → Linear(Q/K/V) → Scaled Dot-Product (Q·Kᵀ/√d) → Mask(可选) → Softmax → Multiply by V → Concat(Multi-Head) → Linear(Output)。每一步都有明确的数学动机：Embedding 映射到向量空间；Linear 投影产生不同语义视角的点积；Scale 控制方差；Softmax 归一化为概率分布；V 加权求和提取信息。',
    hints: [
      '按数据流动顺序一步步列出',
      '每一步说明「为什么需要这一步」',
      '注意 Mask 的位置和作用时机',
    ],
  },
];

const ActiveRecall: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(2); // Start at Q3
  const [isFlipped, setIsFlipped] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [results, setResults] = useState<Record<number, 'mastered' | 'partial' | 'reinforce'>>({});
  const [showRating, setShowRating] = useState(false);

  const currentQ = mockQuestions[currentIndex];
  const completedCount = Object.keys(results).length;
  const correctCount = Object.values(results).filter((r) => r === 'mastered').length;
  const accuracy = completedCount > 0 ? Math.round((correctCount / completedCount) * 100) : 0;

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setShowRating(true);
    }
  };

  const handleNextHint = () => {
    const nextHintIndex = revealedHints.length;
    if (nextHintIndex < currentQ.hints.length) {
      setRevealedHints([...revealedHints, nextHintIndex]);
    }
  };

  const handleRate = (rating: 'mastered' | 'partial' | 'reinforce') => {
    setResults({ ...results, [currentQ.id]: rating });
    setShowRating(false);
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetCard();
    }
  };

  const goNext = () => {
    if (currentIndex < mockQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetCard();
    }
  };

  const resetCard = () => {
    setIsFlipped(false);
    setRevealedHints([]);
    setShowRating(false);
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
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" icon={<ArrowLeft size={18} />}>
            返回
          </Button>
          <h1 className="text-xl font-bold" style={{ color: '#1F2937' }}>
            主动回忆练习
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium" style={{ color: '#6B7280' }}>
            第 {currentIndex + 1} / {mockQuestions.length} 题
          </span>
          <Badge variant={currentQ.type === '解释题' ? 'primary' : currentQ.type === '选择题' ? 'info' : 'warning'}>
            {currentQ.type}
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Flash Card */}
        <div className="perspective-[1200px] mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer"
              onClick={handleFlip}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                {!isFlipped && (
                  <Card padding="lg" className="min-h-[280px] flex flex-col items-center justify-center text-center relative">
                    <BookOpen size={32} style={{ color: '#4F46E5', marginBottom: 16 }} />
                    <p className="text-lg font-medium leading-relaxed px-4" style={{ color: '#1F2937' }}>
                      {currentQ.question}
                    </p>
                    <p className="mt-6 text-xs" style={{ color: '#9CA3AF' }}>
                      点击卡片查看答案与提示
                    </p>
                  </Card>
                )}

                {/* Back */}
                {isFlipped && (
                  <div style={{ transform: 'rotateY(180deg)' }}>
                    <Card padding="lg" className="min-h-[280px]">
                      <h3 className="text-sm font-semibold mb-3" style={{ color: '#4F46E5' }}>
                        参考答案
                      </h3>
                      <p className="text-sm leading-relaxed mb-5" style={{ color: '#374151' }}>
                        {currentQ.answer}
                      </p>

                      {/* Hints Section */}
                      <div className="border-t pt-4" style={{ borderColor: '#E5E7EB' }}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold" style={{ color: '#6B7280' }}>
                            渐进提示
                          </span>
                          {revealedHints.length < currentQ.hints.length && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNextHint();
                              }}
                              className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-colors"
                              style={{ color: '#4F46E5', backgroundColor: '#EDE9FE' }}
                            >
                              <Lightbulb size={12} />
                              显示提示 {revealedHints.length + 1}
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {currentQ.hints.map((hint, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, height: 0 }}
                              animate={
                                revealedHints.includes(idx)
                                  ? { opacity: 1, height: 'auto' }
                                  : { opacity: 0, height: 0 }
                              }
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div
                                className="rounded-lg p-2.5 text-xs leading-relaxed"
                                style={{
                                  backgroundColor: idx < revealedHints.length ? '#FEF3C7' : '#F9FAFB',
                                  color: idx < revealedHints.length ? '#92400E' : '#D1D5DB',
                                  border: `1px solid ${idx < revealedHints.length ? '#FDE68A' : '#E5E7EB'}`,
                                }}
                              >
                                <span className="font-semibold">提示 {idx + 1}：</span>{' '}
                                {hint}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Self-rating Buttons */}
                      {showRating && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-5 border-t pt-4"
                          style={{ borderColor: '#E5E7EB' }}
                        >
                          <p className="text-xs font-medium mb-3 text-center" style={{ color: '#6B7280' }}>
                            自评掌握程度
                          </p>
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRate('mastered');
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-medium text-white transition-all hover:shadow-md active:scale-[0.97]"
                              style={{ backgroundColor: '#10B981' }}
                            >
                              <CheckCircle2 size={16} />
                              完全掌握
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRate('partial');
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-medium text-white transition-all hover:shadow-md active:scale-[0.97]"
                              style={{ backgroundColor: '#F59E0B' }}
                            >
                              <AlertCircle size={16} />
                              部分掌握
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRate('reinforce');
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-medium text-white transition-all hover:shadow-md active:scale-[0.97]"
                              style={{ backgroundColor: '#EF4444' }}
                            >
                              <XCircle size={16} />
                              需要补强
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </Card>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="secondary"
            icon={<ArrowLeft size={16} />}
            onClick={goPrev}
            disabled={currentIndex === 0}
          >
            上一题
          </Button>
          <button
            onClick={() => {
              resetCard();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-medium transition-colors"
            style={{ color: '#6B7280', backgroundColor: '#F3F4F6' }}
          >
            <RotateCcw size={14} />
            重置卡片
          </button>
          <Button
            variant="secondary"
            icon={<ArrowRight size={16} />}
            iconPosition="right"
            onClick={goNext}
            disabled={currentIndex === mockQuestions.length - 1}
          >
            下一题
          </Button>
        </div>

        {/* Stats Sidebar / Bottom Panel */}
        <Card padding="md">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} style={{ color: '#4F46E5' }} />
            <h3 className="text-sm font-semibold" style={{ color: '#1F2937' }}>
              练习统计
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: '#4F46E5' }}>
                {completedCount}
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                已完成
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
                {accuracy}%
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                正确率
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: '#6B7280' }}>
                {mockQuestions.length - completedCount}
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                剩余
              </p>
            </div>
          </div>

          {/* Progress bar for all questions */}
          <div className="mt-4">
            <div className="flex gap-1">
              {mockQuestions.map((q) => {
                const status = results[q.id];
                let bg = '#E5E7EB';
                if (status === 'mastered') bg = '#10B981';
                else if (status === 'partial') bg = '#F59E0B';
                else if (status === 'reinforce') bg = '#EF4444';
                else if (q.id === currentQ.id + 1) bg = '#4F46E5';

                return (
                  <div
                    key={q.id}
                    className="h-2 flex-1 rounded-full transition-colors"
                    style={{ backgroundColor: bg }}
                  />
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ActiveRecall;
