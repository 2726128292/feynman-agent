import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'text-white border-0 shadow-sm hover:shadow-md active:scale-[0.98]',
  secondary:
    'border bg-transparent hover:bg-gray-50 active:scale-[0.98]',
  ghost:
    'border-0 bg-transparent hover:bg-gray-100 active:scale-[0.98]',
  danger:
    'text-white border-0 shadow-sm hover:shadow-md active:scale-[0.98]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

const getBackgroundStyle = (variant: ButtonVariant): React.CSSProperties => {
  switch (variant) {
    case 'primary':
      return { background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' };
    case 'secondary':
      return { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' };
    case 'ghost':
      return {};
    case 'danger':
      return { backgroundColor: '#EF4444' };
    default:
      return {};
  }
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth,
  loading = false,
  disabled,
  children,
  className = '',
  style,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-medium
        rounded-[10px] transition-all duration-200 cursor-pointer
        select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      style={{
        ...getBackgroundStyle(variant),
        ...(variant === 'secondary'
          ? { border: '1px solid #E5E7EB', color: '#1F2937' }
          : {}),
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="animate-spin" />
      ) : icon && iconPosition === 'left' ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
      {!loading && icon && iconPosition === 'right' ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
    </button>
  );
};

export default Button;
