import React from 'react';
import { motion } from 'framer-motion';

interface ProgressProps {
  value: number; // 0 - 100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const heightStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const getColorByValue = (value: number): string => {
  if (value >= 80) return '#10B981';
  if (value >= 50) return '#F59E0B';
  return '#EF4444';
};

const Progress: React.FC<ProgressProps> = ({
  value,
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const color = getColorByValue(clampedValue);

  return (
    <div className={`w-full flex items-center gap-3 ${className}`}>
      <div
        className={`flex-1 rounded-full overflow-hidden ${heightStyles[size]}`}
        style={{ backgroundColor: '#E5E7EB' }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`${heightStyles[size]} rounded-full`}
          style={{ backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span
          className="text-xs font-semibold tabular-nums shrink-0"
          style={{ color: '#6B7280', minWidth: 36, textAlign: 'right' }}
        >
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  );
};

export default Progress;
