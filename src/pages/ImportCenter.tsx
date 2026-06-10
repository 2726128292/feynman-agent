import React, { useState, useCallback, useRef } from 'react';
import {
  Upload,
  Link2,
  ClipboardPaste,
  FileText,
  FileCode,
  FileSpreadsheet,
  Image,
  X,
  CheckCircle2,
  History,
  CloudUpload,
  FileJson,
  Eye,
  File,
  Type,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

type ImportTab = 'upload' | 'url' | 'paste';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

const SUPPORTED_FORMATS = [
  { ext: 'PDF', icon: FileText, color: '#EF4444' },
  { ext: 'DOCX', icon: File, color: '#2563EB' },
  { ext: 'MD', icon: FileCode, color: '#6B7280' },
  { ext: 'TXT', icon: Type, color: '#6B7280' },
  { ext: 'CSV', icon: FileSpreadsheet, color: '#10B981' },
  { ext: 'JSON', icon: FileJson, color: '#F59E0B' },
  { ext: '图片', icon: Image, color: '#8B5CF6' },
];

const MOCK_IMPORT_HISTORY = [
  { id: '1', filename: '算法导论笔记.pdf', format: 'PDF', time: '2025-06-05 14:30', status: 'success' as const },
  { id: '2', filename: '机器学习课程大纲.md', format: 'MD', time: '2025-06-04 10:15', status: 'success' as const },
  { id: '3', filename: 'https://arxiv.org/abs/2301.xxxxx', format: 'URL', time: '2025-06-03 09:00', status: 'success' as const },
  { id: '4', filename: '复习笔记_第六章.txt', format: 'TXT', time: '2025-06-02 16:45', status: 'failed' as const },
  { id: '5', filename: '词汇表.csv', format: 'CSV', time: '2025-06-01 11:20', status: 'success' as const },
];

const TABS: { key: ImportTab; label: string; icon: React.ReactNode }[] = [
  { key: 'upload', label: '文件上传', icon: <Upload size={16} /> },
  { key: 'url', label: 'URL 导入', icon: <Link2 size={16} /> },
  { key: 'paste', label: '文本粘贴', icon: <ClipboardPaste size={16} /> },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ImportCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ImportTab>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      const newFiles: UploadedFile[] = files.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type || 'unknown',
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    },
    []
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const newFiles: UploadedFile[] = files.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type || 'unknown',
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const wordCount = pasteText.replace(/\s/g, '').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>
          导入中心
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          从文件、链接或文本导入学习内容，快速构建你的知识库
        </p>
      </div>

      {/* Tab 切换 */}
      <div className="flex rounded-[12px] p-1" style={{ backgroundColor: '#F3F4F6' }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-[10px] text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key ? 'shadow-sm' : ''
            }`}
            style={{
              backgroundColor: activeTab === tab.key ? '#FFFFFF' : 'transparent',
              color: activeTab === tab.key ? '#4F46E5' : '#6B7280',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 内容区域 */}
      <Card padding="lg">
        {/* 文件上传 Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-5">
            {/* 拖拽上传区域 */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center py-12 px-6 rounded-[16px] border-2 border-dashed cursor-pointer transition-all duration-200 ${
                isDragging ? 'scale-[1.01]' : ''
              }`}
              style={{
                borderColor: isDragging ? '#4F46E5' : '#D1D5DB',
                backgroundColor: isDragging ? '#EEF2FF' : '#FAFBFC',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.md,.txt,.csv,.json,.png,.jpg,.jpeg,.webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #EEF2FF, #EDE9FE)' }}
              >
                <CloudUpload size={32} style={{ color: '#4F46E5' }} />
              </div>
              <p className="text-base font-medium mb-1" style={{ color: '#1F2937' }}>
                拖拽文件到此处或点击上传
              </p>
              <p className="text-sm" style={{ color: '#9CA3AF' }}>
                支持批量上传，单个文件最大 50MB
              </p>

              {/* 支持格式图标矩阵 */}
              <div className="flex flex-wrap justify-center gap-3 mt-5">
                {SUPPORTED_FORMATS.map((fmt) => (
                  <div
                    key={fmt.ext}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg"
                    style={{ backgroundColor: `${fmt.color}15` }}
                  >
                    <fmt.icon size={18} style={{ color: fmt.color }} />
                    <span className="text-[10px] font-medium" style={{ color: fmt.color }}>
                      {fmt.ext}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 已选文件列表 */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold" style={{ color: '#1F2937' }}>
                  已选择文件 ({uploadedFiles.length})
                </h4>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between px-4 py-3 rounded-[12px]"
                    style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText size={18} style={{ color: '#6B7280' }} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: '#1F2937' }}>
                          {file.name}
                        </p>
                        <p className="text-xs" style={{ color: '#9CA3AF' }}>
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                    >
                      <X size={16} style={{ color: '#EF4444' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* URL 导入 Tab */}
        {activeTab === 'url' && (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: '#6B7280' }}>
              输入网页 URL 或文档链接，系统将自动抓取内容并转换为学习主题。
            </p>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="https://example.com/article 或 arxiv.org/abs/xxx"
                  prefixIcon={<Link2 size={16} />}
                  value={urlInput}
                  onChange={setUrlInput}
                />
              </div>
              <Button
                icon={<Eye size={16} />}
                disabled={!urlInput.trim()}
              >
                预览内容
              </Button>
            </div>
            {urlInput && (
              <div
                className="rounded-[12px] p-4"
                style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D' }}
              >
                <p className="text-sm" style={{ color: '#92400E' }}>
                  ⚠️ 请确保你有权访问该链接的内容。部分网站可能有反爬虫限制。
                </p>
              </div>
            )}
          </div>
        )}

        {/* 文本粘贴 Tab */}
        {activeTab === 'paste' && (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: '#6B7280' }}>
              直接粘贴文本内容，支持从剪贴板、笔记软件或其他来源复制。
            </p>
            <textarea
              placeholder="在此粘贴你要学习的文本内容..."
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="w-full min-h-[240px] rounded-[12px] border px-4 py-3 text-sm resize-y outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              style={{
                borderColor: '#E5E7EB',
                backgroundColor: '#FFFFFF',
                color: '#1F2937',
                fontFamily: "'Noto Sans SC', sans-serif",
              }}
            />
            <div className="flex justify-end">
              <span className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                字数统计：{wordCount} 字
                {wordCount > 5000 && (
                  <span style={{ color: '#EF4444' }} className="ml-1">（超过建议上限）</span>
                )}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* 导入按钮 */}
      <div className="flex justify-end">
        <Button size="lg" icon={<CheckCircle2 size={18} />}>
          开始导入
        </Button>
      </div>

      {/* 导入历史记录 */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold" style={{ color: '#1F2937' }}>
            <History size={18} className="inline mr-2" style={{ color: '#6B7280' }} />
            导入历史
          </h3>
        </div>
        <div className="space-y-2">
          {MOCK_IMPORT_HISTORY.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-3 rounded-[12px] transition-colors hover:bg-gray-50"
              style={{ backgroundColor: '#FAFBFC' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.status === 'success' ? (
                  <CheckCircle2 size={16} style={{ color: '#10B981' }} />
                ) : (
                  <X size={16} style={{ color: '#EF4444' }} />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#1F2937' }}>
                    {item.filename}
                  </p>
                </div>
                <Badge variant="default" size="sm">{item.format}</Badge>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs" style={{ color: '#9CA3AF' }}>{item.time}</span>
                <Badge
                  variant={item.status === 'success' ? 'success' : 'error'}
                  size="sm"
                >
                  {item.status === 'success' ? '成功' : '失败'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ImportCenter;
