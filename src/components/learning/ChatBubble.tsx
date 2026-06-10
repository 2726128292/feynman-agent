import React, { useState, useEffect } from 'react';
import { User, Bot } from 'lucide-react';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content, isStreaming = false }) => {
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    if (isStreaming) {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= content.length) {
          setDisplayedContent(content.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    } else {
      setDisplayedContent(content);
    }
  }, [content, isStreaming]);

  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      {/* 头像 */}
      <div
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: isUser ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : '#F3F4F6',
        }}
      >
        {isUser ? (
          <User size={16} style={{ color: '#FFFFFF' }} />
        ) : (
          <Bot size={16} style={{ color: '#6B7280' }} />
        )}
      </div>

      {/* 气泡内容 */}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser ? 'rounded-tr-md' : 'rounded-tl-md'
        }`}
        style={{
          backgroundColor: isUser ? '#4F46E5' : '#FFFFFF',
          color: isUser ? '#FFFFFF' : '#1F2937',
          boxShadow: isUser ? undefined : '0 1px 3px rgba(0, 0, 0, 0.06)',
          fontSize: '14px',
          lineHeight: '1.7',
        }}
      >
        {displayedContent}
        {isStreaming && (
          <span
            className="inline-block w-1.5 h-1.5 ml-1 rounded-full animate-pulse"
            style={{ backgroundColor: isUser ? '#C7D2FE' : '#4F46E5', verticalAlign: 'middle' }}
          />
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
