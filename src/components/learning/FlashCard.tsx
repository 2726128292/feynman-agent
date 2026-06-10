import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle2, AlertCircle, ThumbsUp } from 'lucide-react';
import type { PracticeItem } from '@/types/practice';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface FlashCardProps {
  practice: PracticeItem;
  onRate: (rating: 'mastered' | 'partial' | 'need_work') => void;
  isFlipped: boolean;
  onFlip: () => void;
}

const typeLabels: Record<string, string> = {
  explanation: '讲解题',
  choice: '选择题',
  counter_example: '反例分析',
  analogy: '类比推理',
};

const FlashCard: React.FC<FlashCardProps> = ({ practice, onRate, isFlipped, onFlip }) => {
  return (
    <div className="w-full max-w-lg mx-auto perspective-[1200px]" style={{ perspective: '1200px' }}>
      <motion.div
        className="relative w-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        onClick={onFlip}
      >
        {/* 正面 - 问题 */}
        <Card
          padding="lg"
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex flex-col items-center gap-4 min-h-[280px] justify-center">
            <Badge variant="primary" size="md">{typeLabels[practice.type] || '练习'}</Badge>
            <p
              className="text-base font-medium text-center leading-relaxed"
              style={{ color: '#1F2937' }}
            >
              {practice.prompt}
            </p>
            <div
              className="mt-4 flex items-center gap-1.5 text-xs"
              style={{ color: '#6B7280' }}
            >
              <RotateCcw size={13} />
              点击翻转查看答案
            </div>
          </div>
        </Card>

        {/* 背面 - 答案 */}
        <Card
          padding="lg"
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="flex flex-col gap-4 min-h-[280px]">
            <Badge variant="success" size="sm">答案</Badge>

            {/* 答案内容 */}
            <p
              className="text-sm leading-relaxed flex-1"
              style={{ color: '#1F2937' }}
            >
              {practice.answer}
            </p>

            {/* 提示层级 */}
            {practice.hints.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-3" style={{ borderTop: '1px solid #E5E7EB' }}>
                <span className="text-xs font-medium" style={{ color: '#6B7280' }}>提示</span>
                {practice.hints.map((hint, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1.5 rounded-lg"
                    style={{ backgroundColor: '#F3F4F6', color: '#4B5563' }}
                  >
                    提示 {i + 1}: {hint}
                  </span>
                ))}
              </div>
            )}

            {/* 自评按钮组 */}
            <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid #E5E7EB' }}>
              <Button
                size="sm"
                variant="primary"
                icon={<CheckCircle2 size={14} />}
                onClick={(e) => { e.stopPropagation(); onRate('mastered'); }}
              >
                完全掌握
              </Button>
              <Button
                size="sm"
                variant="secondary"
                icon={<ThumbsUp size={14} />}
                onClick={(e) => { e.stopPropagation(); onRate('partial'); }}
              >
                部分掌握
              </Button>
              <Button
                size="sm"
                variant="ghost"
                icon={<AlertCircle size={14} />}
                onClick={(e) => { e.stopPropagation(); onRate('need_work'); }}
                style={{ color: '#EF4444' }}
              >
                需要补强
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default FlashCard;
