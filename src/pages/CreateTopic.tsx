import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Link as LinkIcon,
  FileText,
  Tag,
  X,
  File,
  Image,
  FileCode,
  FileVideo,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import TemplateCard from '@/components/learning/TemplateCard';
import type { AgentTemplate } from '@/types/common';

const steps = ['基本信息', '导入材料', '确认创建'];

const categories = [
  { label: '计算机科学', value: 'computer_science' },
  { label: '数学', value: 'math' },
  { label: '物理', value: 'physics' },
  { label: '语言学习', value: 'language' },
  { label: '考试备考', value: 'exam' },
  { label: '其他', value: 'other' },
];

const privacyOptions = [
  { label: '仅本地处理（推荐）', value: 'local_only' },
  { label: '允许云端处理', value: 'allow_cloud' },
  { label: '每次询问', value: 'ask_every_time' },
];

const mockTemplates: AgentTemplate[] = [
  {
    id: 't1',
    name: '费曼讲解教练',
    description: '通过追问和诊断帮助你用简单语言讲清复杂概念',
    icon: '🎯',
    category: '通用学习',
    system_prompt: '',
  },
  {
    id: 't2',
    name: '代码逻辑拆解器',
    description: '专注于编程概念的逐行讲解与逻辑梳理',
    icon: '💻',
    category: '编程学习',
    system_prompt: '',
  },
  {
    id: 't3',
    name: '公式推导向导',
    description: '引导你一步步推导数学/物理公式，补全中间步骤',
    icon: '📐',
    category: '理科学习',
    system_prompt: '',
  },
  {
    id: 't4',
    name: '概念类比大师',
    description: '擅长用生活化类比帮助理解抽象概念',
    icon: '🔮',
    category: '通用学习',
    system_prompt: '',
  },
];

interface ImportedMaterial {
  id: string;
  name: string;
  type: 'file' | 'url' | 'text';
}

const CreateTopic: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formGoal, setFormGoal] = useState('');
  const [formPrivacy, setFormPrivacy] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [materials, setMaterials] = useState<ImportedMaterial[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const addUrlMaterial = () => {
    if (urlInput.trim()) {
      setMaterials([
        ...materials,
        { id: Date.now().toString(), name: urlInput.trim(), type: 'url' },
      ]);
      setUrlInput('');
    }
  };

  const addTextMaterial = () => {
    if (textInput.trim()) {
      setMaterials([
        ...materials,
        { id: Date.now().toString(), name: textInput.slice(0, 50) + (textInput.length > 50 ? '...' : ''), type: 'text' },
      ]);
      setTextInput('');
    }
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  return (
    <div
      className="min-h-screen max-w-3xl mx-auto py-8"
      style={{
        backgroundColor: '#F7F8FC',
        fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* 页面标题 */}
      <div className="mb-8 text-center">
        <h1
          className="text-2xl font-bold mb-1.5"
          style={{ color: '#1F2937' }}
        >
          新建学习主题
        </h1>
        <p
          className="text-sm"
          style={{ color: '#6B7280' }}
        >
          创建一个新的学习主题，开启你的费曼之旅
        </p>
      </div>

      {/* 步骤指示器 */}
      <div className="flex items-center justify-center gap-0 mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  index <= currentStep ? 'text-white' : ''
                }`}
                style={{
                  backgroundColor: index < currentStep ? '#10B981' : index === currentStep ? '#4F46E5' : '#E5E7EB',
                  color: index <= currentStep ? '#FFFFFF' : '#9CA3AF',
                }}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span
                className="text-sm font-medium hidden sm:inline"
                style={{
                  color: index <= currentStep ? '#1F2937' : '#9CA3AF',
                }}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className="w-16 sm:w-24 h-0.5 mx-1"
                style={{
                  backgroundColor: index < currentStep ? '#10B981' : '#E5E7EB',
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: 基本信息 */}
      {currentStep === 0 && (
        <Card padding="lg">
          <h3
            className="text-lg font-semibold mb-5"
            style={{ color: '#1F2937' }}
          >
            基本信息
          </h3>

          <div className="flex flex-col gap-5">
            <Input
              label="主题名称 *"
              placeholder="例如：Transformer 注意力机制"
              value={formName}
              onChange={(v) => setFormName(v)}
            />

            <Select
              label="分类"
              options={categories}
              placeholder="选择分类"
              value={formCategory}
              onChange={(v) => setFormCategory(v)}
            />

            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium"
                style={{ color: '#1F2937' }}
              >
                学习目标
              </label>
              <textarea
                rows={3}
                placeholder="描述你想达到的学习目标……"
                value={formGoal}
                onChange={(e) => setFormGoal(e.target.value)}
                className="w-full rounded-[10px] border px-3 py-2.5 text-sm resize-y outline-none transition-colors duration-200 placeholder:text-gray-400"
                style={{
                  borderColor: '#E5E7EB',
                  backgroundColor: '#FFFFFF',
                  color: '#1F2937',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4F46E5';
                  e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = '';
                }}
              />
            </div>

            <Select
              label="隐私等级"
              options={privacyOptions}
              placeholder="选择数据处理方式"
              value={formPrivacy}
              onChange={(v) => setFormPrivacy(v)}
            />

            {/* 标签输入 */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium"
                style={{ color: '#1F2937' }}
              >
                标签
              </label>
              <div className="flex items-center gap-2 flex-wrap p-2 rounded-[10px] border" style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}>
                {tags.map((tag) => (
                  <Badge key={tag} variant="primary" size="sm" className="gap-1">
                    {tag}
                    <X
                      size={10}
                      className="cursor-pointer hover:text-red-500"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="输入标签后按回车添加"
                  className="flex-1 min-w-[140px] text-sm outline-none bg-transparent py-1"
                  style={{ color: '#1F2937' }}
                />
                <Tag size={14} className="shrink-0" style={{ color: '#9CA3AF' }} />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: 材料导入 */}
      {currentStep === 1 && (
        <Card padding="lg">
          <h3
            className="text-lg font-semibold mb-5"
            style={{ color: '#1F2937' }}
          >
            导入材料
          </h3>

          <div className="flex flex-col gap-5">
            {/* 文件上传拖拽区域 */}
            <div
              className="border-2 border-dashed rounded-[16px] p-8 text-center cursor-pointer transition-all duration-200 hover:border-indigo-400"
              style={{ borderColor: '#D1D5DB' }}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload size={32} className="mx-auto mb-3" style={{ color: '#9CA3AF' }} />
              <p
                className="text-sm font-medium mb-1"
                style={{ color: '#374151' }}
              >
                拖拽文件到此处，或点击上传
              </p>
              <p
                className="text-xs mb-4"
                style={{ color: '#9CA3AF' }}
              >
                支持 PDF、TXT、MD、DOC 等格式
              </p>

              {/* 格式图标矩阵 */}
              <div className="flex items-center justify-center gap-4">
                {[File, Image, FileCode, FileVideo].map((IconComp, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#F3F4F6' }}
                  >
                    <IconComp size={18} style={{ color: '#6B7280' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* URL 导入 */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium flex items-center gap-1.5"
                style={{ color: '#1F2937' }}
              >
                <LinkIcon size={14} />
                URL 导入
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="粘贴网页链接..."
                  className="flex-1 rounded-[10px] border px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder:text-gray-400"
                  style={{
                    borderColor: '#E5E7EB',
                    backgroundColor: '#FFFFFF',
                    color: '#1F2937',
                  }}
                />
                <Button
                  size="md"
                  variant="secondary"
                  onClick={addUrlMaterial}
                >
                  添加
                </Button>
              </div>
            </div>

            {/* 文本粘贴 */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium flex items-center gap-1.5"
                style={{ color: '#1F2937' }}
              >
                <FileText size={14} />
                文本粘贴
              </label>
              <textarea
                rows={4}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="直接粘贴文本内容……"
                className="w-full rounded-[10px] border px-3 py-2.5 text-sm resize-y outline-none transition-colors duration-200 placeholder:text-gray-400"
                style={{
                  borderColor: '#E5E7EB',
                  backgroundColor: '#FFFFFF',
                  color: '#1F2937',
                }}
              />
              {textInput.trim() && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={addTextMaterial}
                  className="self-start"
                >
                  添加文本材料
                </Button>
              )}
            </div>

            {/* 已导入材料预览列表 */}
            {materials.length > 0 && (
              <div className="flex flex-col gap-2 pt-3" style={{ borderTop: '1px solid #E5E7EB' }}>
                <span className="text-sm font-medium" style={{ color: '#1F2937' }}>
                  已导入材料 ({materials.length})
                </span>
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-[10px]"
                    style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {material.type === 'file' && <File size={14} style={{ color: '#6B7280' }} />}
                      {material.type === 'url' && <LinkIcon size={14} style={{ color: '#6B7280' }} />}
                      {material.type === 'text' && <FileText size={14} style={{ color: '#6B7280' }} />}
                      <span
                        className="text-xs truncate"
                        style={{ color: '#374151' }}
                      >
                        {material.name}
                      </span>
                      <Badge variant="default" size="sm">{material.type}</Badge>
                    </div>
                    <button
                      onClick={() => removeMaterial(material.id)}
                      className="shrink-0 p-1 rounded hover:bg-red-50 cursor-pointer transition-colors"
                    >
                      <X size={13} style={{ color: '#EF4444' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Step 3: 确认创建 */}
      {currentStep === 2 && (
        <div className="flex flex-col gap-6">
          {/* 信息汇总 */}
          <Card padding="lg">
            <h3
              className="text-lg font-semibold mb-5"
              style={{ color: '#1F2937' }}
            >
              信息汇总
            </h3>

            <div className="space-y-4">
              {[
                { label: '主题名称', value: formName || '未填写' },
                { label: '分类', value: formName ? (categories.find(c => c.value === formCategory)?.label || '未选择') : '-' },
                { label: '学习目标', value: formGoal || '未填写' },
                { label: '隐私等级', value: privacyOptions.find(p => p.value === formPrivacy)?.label || '未选择' },
                { label: '标签', value: tags.length > 0 ? tags.join('、') : '无' },
                { label: '导入材料', value: `${materials.length} 项` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 pb-3"
                  style={{ borderBottom: item.label !== '导入材料' ? '1px solid #F3F4F6' : 'none' }}
                >
                  <span
                    className="text-xs font-medium w-20 shrink-0 pt-0.5"
                    style={{ color: '#6B7280' }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: '#1F2937' }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Agent 模板选择 */}
          <div>
            <h3
              className="text-base font-semibold mb-4"
              style={{ color: '#1F2937' }}
            >
              选择 Agent 模板
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {mockTemplates.map((template) => (
                <div key={template.id} onClick={() => setSelectedTemplateId(template.id)}>
                  <TemplateCard
                    template={template}
                    onSelect={() => setSelectedTemplateId(template.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 上一步 / 下一步导航 */}
      <div className="flex items-center justify-between mt-8">
        <Button
          size="md"
          variant="ghost"
          icon={<ChevronLeft size={16} />}
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          上一步
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            size="md"
            variant="primary"
            icon={<ChevronRight size={16} />}
            onClick={() => setCurrentStep(currentStep + 1)}
          >
            下一步
          </Button>
        ) : (
          <Button
            size="md"
            variant="primary"
            icon={<ChevronRight size={16} />}
          >
            确认创建
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateTopic;
