import React from 'react';
import type { AgentTemplate } from '@/types/common';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface TemplateCardProps {
  template: AgentTemplate;
  onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  return (
    <Card padding="md" hoverable className="flex flex-col h-full">
      {/* 渐变圆形图标 + 模板名称 */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white text-lg shrink-0"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
        >
          {template.icon || template.name.charAt(0)}
        </div>
        <h4
          className="text-sm font-semibold"
          style={{ color: '#1F2937' }}
        >
          {template.name}
        </h4>
      </div>

      {/* 描述文字 */}
      <p
        className="text-xs leading-relaxed mb-3 flex-1"
        style={{ color: '#6B7280' }}
      >
        {template.description}
      </p>

      {/* 适用场景标签 */}
      <div className="mb-4">
        <Badge variant="primary" size="sm">
          {template.category}
        </Badge>
      </div>

      {/* 使用此模板按钮 */}
      <Button
        size="sm"
        variant="primary"
        onClick={onSelect}
        className="w-full justify-center"
      >
        使用此模板
      </Button>
    </Card>
  );
};

export default TemplateCard;
