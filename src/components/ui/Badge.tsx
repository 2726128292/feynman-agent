import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default' | 'primary';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string }> = {
  success: { bg: '#D1FAE5', color: '#065F46' },
  warning: { bg: '#FEF3C7', color: '#92400E' },
  error: { bg: '#FEE2E2', color: '#991B1B' },
  info: { bg: '#DBEAFE', color: '#1E40AF' },
  default: { bg: '#F3F4F6', color: '#374151' },
  primary: { bg: '#EDE9FE', color: '#4338CA' },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  style: externalStyle,
}) => {
  const style = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-[14px] whitespace-nowrap ${sizeStyles[size]} ${className}`}
      style={{
        backgroundColor: style.bg,
        color: style.color,
        ...externalStyle,
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
