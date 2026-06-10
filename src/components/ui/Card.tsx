import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

const Card: React.FC<CardProps> = ({
  padding = 'md',
  hoverable = false,
  onClick,
  children,
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-[16px] shadow-sm
        ${paddingStyles[padding]}
        ${
          hoverable || onClick
            ? 'cursor-pointer transition-shadow duration-200 hover:shadow-md active:scale-[0.99]'
            : ''
        }
        ${className}
      `}
      style={{
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        ...style,
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
