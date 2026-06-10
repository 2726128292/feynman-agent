import React from 'react';

interface MasteryProgressProps {
  value: number; // 0 - 1
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const heightStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
};

const labelSizes = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
};

const getColorByValue = (value: number): string => {
  const percent = value * 100;
  if (percent >= 80) return '#10B981';
  if (percent >= 50) return '#F59E0B';
  return '#EF4444';
};

const MasteryProgress: React.FC<MasteryProgressProps> = ({
  value,
  size = 'md',
  showLabel = true,
}) => {
  const clampedValue = Math.min(1, Math.max(0, value));
  const color = getColorByValue(clampedValue);

  return (
    <div className="w-full flex items-center gap-2.5">
      <div
        className={`flex-1 rounded-full overflow-hidden ${heightStyles[size]}`}
        style={{ backgroundColor: '#E5E7EB' }}
      >
        <div
          className={`${heightStyles[size]} rounded-full transition-all duration-500 ease-out`}
          style={{
            width: `${Math.round(clampedValue * 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {showLabel && (
        <span
          className={`${labelSizes[size]} font-semibold tabular-nums shrink-0`}
          style={{ color: '#6B7280', minWidth: 32, textAlign: 'right' }}
        >
          {Math.round(clampedValue * 100)}%
        </span>
      )}
    </div>
  );
};

export default MasteryProgress;
