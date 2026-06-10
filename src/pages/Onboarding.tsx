import React, { useState } from 'react';
import {
  Sparkles,
  Server,
  Globe,
  Plus,
  ArrowRight,
  BookOpen,
  Rocket,
  X,
  CheckCircle2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { id: 1, title: '欢迎' },
  { id: 2, title: '选择模型' },
  { id: 3, title: '创建主题' },
  { id: 4, title: '开始学习' },
];

const PROVIDER_OPTIONS = [
  {
    id: 'ollama',
    name: 'Ollama',
    desc: '本地运行，隐私优先',
    tag: '推荐',
    icon: <Server size={24} />,
  },
  {
    id: 'openai',
    name: 'OpenAI',
    desc: '云端强大，效果出色',
    tag: '',
    icon: <Globe size={24} />,
  },
  {
    id: 'other',
    name: '其他',
    desc: '自定义兼容接口',
    tag: '',
    icon: <Sparkles size={24} />,
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState('ollama');
  const [topicName, setTopicName] = useState('');

  const goNext = () => {
    if (currentStep < 4) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const skipOnboarding = () => {
    // 实际应用中会跳过引导并标记已完成
    console.log('Skip onboarding');
  };

  const completeOnboarding = () => {
    console.log('Complete onboarding');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* 主内容区 */}
      <div
        className="relative w-full max-w-lg mx-4 rounded-3xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: '#FFFFFF',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 右上角跳过按钮 */}
        <button
          onClick={skipOnboarding}
          className="absolute top-4 right-4 z-10 text-sm font-medium px-3 py-1.5 rounded-full transition-colors hover:bg-gray-100"
          style={{ color: '#9CA3AF' }}
        >
          跳过
        </button>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-center gap-2 pt-6 pb-4">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`transition-all duration-300 rounded-full ${
                step.id === currentStep ? 'w-8 h-3' : 'w-3 h-3'
              }`}
              style={{
                backgroundColor:
                  step.id === currentStep
                    ? '#4F46E5'
                    : step.id < currentStep
                    ? '#C7D2FE'
                    : '#E5E7EB',
              }}
            />
          ))}
        </div>

        {/* 步骤内容区域 */}
        <div className="flex-1 overflow-hidden px-8 pb-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col items-center text-center min-h-[380px]"
            >
              {/* Step 1: 欢迎 */}
              {currentStep === 1 && (
                <div className="flex flex-col items-center gap-5 w-full">
                  {/* 插画风格装饰 */}
                  <div
                    className="w-32 h-32 rounded-3xl flex items-center justify-center relative"
                    style={{
                      background: 'linear-gradient(135deg, #EEF2FF 0%, #EDE9FE 50%, #FCE7F3 100%)',
                    }}
                  >
                    <div
                      className="absolute -top-2 -right-2 w-10 h-10 rounded-full"
                      style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', opacity: 0.15 }}
                    />
                    <div
                      className="absolute -bottom-1 -left-1 w-8 h-8 rounded-full"
                      style={{ background: 'linear-gradient(135deg, #10B981, #34D399)', opacity: 0.15 }}
                    />
                    <Sparkles size={56} style={{ color: '#4F46E5' }} />
                  </div>

                  <div className="space-y-3">
                    <h2
                      className="text-2xl font-bold leading-tight"
                      style={{ color: '#1F2937' }}
                    >
                      欢迎来到<br />费曼学习法 Agent
                    </h2>
                    <p
                      className="text-base leading-relaxed max-w-sm mx-auto"
                      style={{ color: '#6B7280' }}
                    >
                      通过「先讲后问」的方式，让你真正理解每一个知识点。
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {['主动讲解', '智能追问', '精准诊断', '持续巩固'].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: '#EEF2FF',
                            color: '#4F46E5',
                          }}
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: 选择模型 */}
              {currentStep === 2 && (
                <div className="flex flex-col items-center gap-5 w-full">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #EEF2FF, #EDE9FE)',
                    }}
                  >
                    <Server size={36} style={{ color: '#4F46E5' }} />
                  </div>

                  <div className="space-y-2">
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: '#1F2937' }}
                    >
                      选择你的 AI 模型 Provider
                    </h2>
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>
                      同一套学习流程可切换不同模型
                    </p>
                  </div>

                  <div className="w-full space-y-3 mt-2">
                    {PROVIDER_OPTIONS.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 text-left ${
                          selectedProvider === provider.id ? '' : ''
                        }`}
                        style={{
                          backgroundColor:
                            selectedProvider === provider.id
                              ? '#EEF2FF'
                              : '#F9FAFB',
                          border: `2px solid ${
                            selectedProvider === provider.id
                              ? '#4F46E5'
                              : '#E5E7EB'
                          }`,
                        }}
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor:
                              selectedProvider === provider.id
                                ? '#4F46E520'
                                : '#F3F4F6',
                            color:
                              selectedProvider === provider.id
                                ? '#4F46E5'
                                : '#6B7280',
                          }}
                        >
                          {provider.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="font-semibold text-sm"
                              style={{
                                color:
                                  selectedProvider === provider.id
                                    ? '#4F46E5'
                                    : '#1F2937',
                              }}
                            >
                              {provider.name}
                            </span>
                            {provider.tag && (
                              <span
                                className="px-2 py-0.5 text-[10px] font-bold rounded-md"
                                style={{
                                  backgroundColor: '#4F46E5',
                                  color: '#FFFFFF',
                                }}
                              >
                                {provider.tag}
                              </span>
                            )}
                          </div>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: '#9CA3AF' }}
                          >
                            {provider.desc}
                          </p>
                        </div>
                        {selectedProvider === provider.id && (
                          <CheckCircle2
                            size={20}
                            style={{ color: '#4F46E5' }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: 创建主题 */}
              {currentStep === 3 && (
                <div className="flex flex-col items-center gap-5 w-full">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
                    }}
                  >
                    <BookOpen size={36} style={{ color: '#059669' }} />
                  </div>

                  <div className="space-y-2">
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: '#1F2937' }}
                    >
                      创建你的第一个学习主题
                    </h2>
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>
                      告诉我们你想学什么
                    </p>
                  </div>

                  <div className="w-full space-y-4 mt-2">
                    <Input
                      placeholder="例如：React Hooks 深度解析"
                      value={topicName}
                      onChange={setTopicName}
                    />
                    <div
                      className="flex flex-wrap gap-2"
                    >
                      {['线性代数', '量子力学', '英语语法'].map(
                        (suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setTopicName(suggestion)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                            style={{
                              backgroundColor: '#F3F4F6',
                              color: '#6B7280',
                              border: '1px solid #E5E7EB',
                            }}
                          >
                            {suggestion}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: 开始学习 */}
              {currentStep === 4 && (
                <div className="flex flex-col items-center gap-6 w-full">
                  <div
                    className="w-28 h-28 rounded-3xl flex items-center justify-center relative"
                    style={{
                      background:
                        'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    }}
                  >
                    <Rocket size={48} style={{ color: '#FFFFFF' }} />
                    <div
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center"
                    >
                      <Sparkles size={12} style={{ color: '#4F46E5' }} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2
                      className="text-2xl font-bold leading-tight"
                      style={{ color: '#1F2937' }}
                    >
                      准备好开始了吗？
                    </h2>
                    <p
                      className="text-base"
                      style={{ color: '#6B7280' }}
                    >
                      一切就绪，让我们开始第一次讲解吧！
                    </p>
                  </div>

                  <Button
                    size="lg"
                    icon={<Rocket size={20} />}
                    onClick={completeOnboarding}
                    style={{
                      paddingInline: '2.5rem',
                      fontSize: '1.05rem',
                    }}
                  >
                    开始首次讲解
                  </Button>

                  <p className="text-xs" style={{ color: '#D1D5DB' }}>
                    随时可以在设置中重新配置
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 底部导航按钮 */}
        <div
          className="flex items-center justify-between px-8 py-5 border-t"
          style={{ borderColor: '#F3F4F6' }}
        >
          {currentStep > 1 ? (
            <Button
              variant="ghost"
              onClick={goBack}
              size="md"
            >
              上一步
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <Button
              icon={<ArrowRight size={16} />}
              onClick={goNext}
              disabled={currentStep === 3 && !topicName.trim()}
            >
              下一步
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
