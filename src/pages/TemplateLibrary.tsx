import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Target,
  Code,
  Globe,
  GraduationCap,
  FileText,
  Plus,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import type { AgentTemplate } from '@/types/common';

const CATEGORIES = ['全部', '学习方法', '考试备考', '技术深挖', '语言学习', '学术研究'] as const;

const TEMPLATES: AgentTemplate[] = [
  {
    id: 'standard-feynman',
    name: '标准费曼',
    description: '经典的先讲后问流程，适合大多数学习场景',
    icon: '📖',
    category: '学习方法',
    system_prompt:
      '你是一位费曼学习法的引导者。请按照以下步骤帮助用户掌握知识点。',
  },
  {
    id: 'exam-sprint',
    name: '考试冲刺',
    description: '针对考点的快速诊断和高频练习',
    icon: '🎯',
    category: '考试备考',
    system_prompt:
      '你是一位考试辅导专家。聚焦高频考点快速诊断。',
  },
  {
    id: 'tech-deep-dive',
    name: '技术深挖',
    description: '面向算法、框架、系统设计的深度追问',
    icon: '💻',
    category: '技术深挖',
    system_prompt:
      '你是一位技术导师。引导用户深入理解技术概念。',
  },
  {
    id: 'analogy-training',
    name: '类比训练',
    description: '强化生活化类比和跨领域迁移能力',
    icon: '🔗',
    category: '学习方法',
    system_prompt:
      '你是一位类比思维教练。引导用户用生活中的例子解释概念。',
  },
  {
    id: 'language-learning',
    name: '语言学习',
    description: '侧重语法解释和句式迁移的语言专项',
    icon: '🌍',
    category: '语言学习',
    system_prompt:
      '你是一位语言学习伙伴。通过情景对话帮助用户掌握表达。',
  },
  {
    id: 'paper-reading',
    name: '论文精读',
    description: '针对学术论文的结构化阅读和复述',
    icon: '📄',
    category: '学术研究',
    system_prompt:
      '你是一位学术研究助手。帮助用户拆解论文结构并复述核心观点。',
  },
];

interface TemplateCardProps {
  template: AgentTemplate;
  onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onClick }) => {
  const categoryColorMap: Record<string, string> = {
    学习方法: '#4F46E5',
    考试备考: '#F59E0B',
    技术深挖: '#3B82F6',
    语言学习: '#10B981',
    学术研究: '#8B5CF6',
  };

  return (
    <Card hoverable onClick={onClick} padding="lg" className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{template.icon}</span>
          <div>
            <h3 className="text-base font-semibold" style={{ color: '#1F2937' }}>
              {template.name}
            </h3>
            <Badge
              variant="primary"
              size="sm"
              style={
                categoryColorMap[template.category]
                  ? { backgroundColor: `${categoryColorMap[template.category]}15`, color: categoryColorMap[template.category] }
                  : undefined
              }
            >
              {template.category}
            </Badge>
          </div>
        </div>
        <ChevronRight size={16} style={{ color: '#D1D5DB' }} />
      </div>
      <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
        {template.description}
      </p>
      <div className="pt-2 border-t" style={{ borderColor: '#F3F4F6' }}>
        <Button size="sm" variant="secondary" fullWidth icon={<Sparkles size={14} />}>
          使用此模板
        </Button>
      </div>
    </Card>
  );
};

const TemplateLibrary: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTemplates = useMemo(() => {
    if (activeCategory === '全部') return TEMPLATES;
    return TEMPLATES.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>
          Agent 模板库
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          选择预设的学习流程模板，或创建自定义 Agent 来适配不同场景
        </p>
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
              backgroundColor: activeCategory === cat ? '#4F46E5' : '#FFFFFF',
              color: activeCategory === cat ? '#FFFFFF' : '#6B7280',
              border: `1px solid ${activeCategory === cat ? '#4F46E5' : '#E5E7EB'}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 模板卡片网格（3列）+ 自定义入口 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onClick={() => setSelectedTemplate(template)}
          />
        ))}

        {/* 自定义模板入口卡片 */}
        <Card
          hoverable
          onClick={() => setShowCreateModal(true)}
          padding="lg"
          className="flex flex-col items-center justify-center gap-3 min-h-[200px]"
          style={{
            border: '2px dashed #D1D5DB',
            backgroundColor: '#FAFBFC',
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #EEF2FF, #EDE9FE)',
            }}
          >
            <Plus size={26} style={{ color: '#4F46E5' }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: '#4F46E5' }}>
              自定义模板
            </p>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
              创建专属的学习流程 Agent
            </p>
          </div>
        </Card>
      </div>

      {/* 模板详情弹窗 */}
      <Modal
        open={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        title={`${selectedTemplate?.icon || ''} ${selectedTemplate?.name || ''}`}
        width="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedTemplate(null)}>
              关闭
            </Button>
            <Button icon={<BookOpen size={16} />}>使用此模板</Button>
          </>
        }
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div>
              <Badge variant="primary">{selectedTemplate.category}</Badge>
            </div>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              {selectedTemplate.description}
            </p>
            <div>
              <h4 className="text-sm font-semibold mb-2" style={{ color: '#1F2937' }}>
                System Prompt 预览
              </h4>
              <pre
                className="p-4 rounded-[12px] text-xs whitespace-pre-wrap overflow-x-auto"
                style={{
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  fontFamily: "'Noto Sans SC', monospace",
                  lineHeight: 1.7,
                }}
              >
                {selectedTemplate.system_prompt}
              </pre>
            </div>
          </div>
        )}
      </Modal>

      {/* 创建自定义模板弹窗 */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="创建自定义模板"
        width="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              取消
            </Button>
            <Button icon={<Plus size={16} />}>创建模板</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="模板名称" placeholder="例如：高考数学专项" />
          <Input label="图标 Emoji" placeholder="例如：🧮" />
          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: '#1F2937' }}>
              所属分类
            </label>
            <select
              className="w-full rounded-[10px] border px-3 py-2.5 text-sm outline-none cursor-pointer"
              style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', color: '#1F2937' }}
            >
              {CATEGORIES.filter((c) => c !== '全部').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: '#1F2937' }}>
              描述
            </label>
            <textarea
              rows={3}
              placeholder="简要描述该模板的使用场景..."
              className="w-full rounded-[10px] border px-3 py-2.5 text-sm resize-y outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', color: '#1F2937' }}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: '#1F2937' }}>
              System Prompt
            </label>
            <textarea
              rows={5}
              placeholder="定义 Agent 的行为指令..."
              className="w-full rounded-[10px] border px-3 py-2.5 text-sm resize-y outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', color: '#1F2937' }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TemplateLibrary;
