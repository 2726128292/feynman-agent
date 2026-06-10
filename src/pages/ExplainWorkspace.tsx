import React, { useRef, useState } from 'react';
import { Mic, Send, ShieldCheck, Lightbulb, BarChart3, Target, Link2, Scale } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ExplanationEditor from '@/components/learning/ExplanationEditor';
import MasteryProgress from '@/components/learning/MasteryProgress';

const dimensionScores = [
  { label: '易读程度', value: 0.78, icon: <BarChart3 size={14} /> },
  { label: '概念完整度', value: 0.62, icon: <Target size={14} /> },
  { label: '因果链条', value: 0.55, icon: <Link2 size={14} /> },
  { label: '术语负担', value: 0.38, icon: <Scale size={14} />, inverted: true },
];

const ExplainWorkspace: React.FC = () => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [explanation, setExplanation] = useState('');

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#F7F8FC',
        fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* 顶部：主题名 + 第N轮讲解 badge */}
      <div className="flex items-center gap-3 mb-6">
        <h1
          className="text-xl font-bold"
          style={{ color: '#1F2937' }}
        >
          Transformer 注意力机制
        </h1>
        <Badge variant="primary" size="md">
          第 2 轮讲解
        </Badge>
      </div>

      {/* 左右分栏布局 */}
      <div className="grid grid-cols-[1fr_420px] gap-6">
        {/* 左侧讲解区（约占60%） */}
        <div>
          <Card padding="lg">
            <h3
              className="text-base font-semibold mb-4"
              style={{ color: '#1F2937' }}
            >
              我的讲解
            </h3>

            <ExplanationEditor
              ref={editorRef}
              value={explanation}
              onChange={setExplanation}
              wordCount={explanation.length}
              onSubmit={() => {}}
            />

            {/* 底部操作按钮 */}
            <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
              <Button
                size="md"
                variant="ghost"
                icon={<Mic size={16} />}
              >
                语音讲解
              </Button>
              <Button
                size="md"
                variant="primary"
                icon={<Send size={16} />}
              >
                提交给 Agent
              </Button>
            </div>
          </Card>
        </div>

        {/* 右侧 Agent 观察面板（约占40%） */}
        <div>
          <Card padding="lg" className="sticky top-6">
            {/* 面板标题 */}
            <div className="mb-5">
              <h3
                className="text-base font-semibold"
                style={{ color: '#1F2937' }}
              >
                Agent 观察面板
              </h3>
              <p
                className="text-xs mt-1"
                style={{ color: '#6B7280' }}
              >
                实时检查表达清晰度
              </p>
            </div>

            {/* 五维实时评分进度条 */}
            <div className="flex flex-col gap-4 mb-5">
              {dimensionScores.map((dim) => (
                <div key={dim.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: '#6B7280' }}>{dim.icon}</span>
                      <span
                        className="text-xs font-medium"
                        style={{ color: '#4B5563' }}
                      >
                        {dim.label}
                      </span>
                    </div>
                    <span
                      className="text-xs font-bold tabular-nums"
                      style={{ color: dim.inverted ? '#EF4444' : '#4F46E5' }}
                    >
                      {Math.round(dim.value * 100)}%
                    </span>
                  </div>
                  <MasteryProgress
                    value={dim.inverted ? 1 - dim.value : dim.value}
                    size="sm"
                    showLabel={false}
                  />
                </div>
              ))}
            </div>

            {/* 当前建议 - 黄色背景卡片 */}
            <div
              className="rounded-[16px] p-4 mb-4"
              style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
              }}
            >
              <div className="flex items-start gap-2.5">
                <Lightbulb
                  size={16}
                  className="shrink-0 mt-0.5"
                  style={{ color: '#D97706' }}
                />
                <div>
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: '#92400E' }}
                  >
                    当前建议
                  </p>
                  <ul
                    className="text-xs leading-relaxed space-y-1"
                    style={{ color: '#78350F' }}
                  >
                    <li>• 「自注意力」这个术语出现频率较高，建议补充一个生活化的类比来降低术语负担</li>
                    <li>• 因果链条不够清晰，建议在讲解中加入「因为...所以...」的句式</li>
                    <li>• 缺少对 Query、Key、Value 三个角色关系的具体说明</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 隐私模式已开启 - 绿色背景卡片 */}
            <div
              className="rounded-[16px] p-4"
              style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
              }}
            >
              <div className="flex items-start gap-2.5">
                <ShieldCheck
                  size={16}
                  className="shrink-0 mt-0.5"
                  style={{ color: '#059669' }}
                />
                <div>
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: '#065F46' }}
                  >
                    隐私模式已开启
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: '#047857' }}
                  >
                    当前会话使用本地模型处理，材料不会上传到云端。
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExplainWorkspace;
