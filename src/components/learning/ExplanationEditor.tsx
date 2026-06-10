import React, { forwardRef } from 'react';
import { Lightbulb, Link2, PenLine } from 'lucide-react';

interface ExplanationEditorProps {
  value: string;
  onChange: (value: string) => void;
  wordCount: number;
  onSubmit?: () => void;
}

const hints = [
  { icon: <PenLine size={12} />, text: '避免术语堆砌' },
  { icon: <Lightbulb size={12} />, text: '补充生活类比' },
  { icon: <Link2 size={12} />, text: '写出因果关系' },
];

const ExplanationEditor = forwardRef<HTMLTextAreaElement, ExplanationEditorProps>(
  ({ value, onChange, wordCount, onSubmit }, ref) => {
    return (
      <div className="flex flex-col gap-3">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="继续输入你的讲解……"
          rows={10}
          className="w-full rounded-[16px] border px-5 py-4 text-sm leading-relaxed resize-y min-h-[240px]
            outline-none transition-all duration-200
            placeholder:text-gray-400"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E5E7EB',
            color: '#1F2937',
            fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
            fontSize: '14px',
            lineHeight: '1.8',
          }}
        />

        {/* 底部信息栏 */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs"
            style={{ color: '#6B7280' }}
          >
            已输入 {wordCount} 字 · 建议达到 300-600 字
          </span>
          {onSubmit && (
            <button
              onClick={onSubmit}
              className="text-xs font-medium px-4 py-2 rounded-[10px] text-white cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
            >
              提交讲解
            </button>
          )}
        </div>

        {/* 辅助提示标签行 */}
        <div className="flex items-center gap-2 flex-wrap">
          {hints.map((hint, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{
                backgroundColor: '#FEF3C7',
                color: '#92400E',
              }}
            >
              {hint.icon}
              {hint.text}
            </span>
          ))}
        </div>
      </div>
    );
  }
);

ExplanationEditor.displayName = 'ExplanationEditor';
export default ExplanationEditor;
