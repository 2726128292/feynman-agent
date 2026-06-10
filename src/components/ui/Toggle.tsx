import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  id,
}) => {
  const toggleId = id || `toggle-${label?.replace(/\s+/g, '-')}`;

  return (
    <label
      htmlFor={toggleId}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={toggleId}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={`
          relative inline-flex h-6 w-11 shrink-0 rounded-full
          transition-colors duration-200 ease-in-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          ${checked ? '' : 'bg-gray-300'}
        `}
        style={{
          backgroundColor: checked ? '#4F46E5' : undefined,
        }}
      >
        <span
          className={`
            inline-block h-5 w-5 rounded-full bg-white shadow-sm
            transition-transform duration-200 ease-in-out mt-0.5 ml-0.5
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
      {label && (
        <span
          className="text-sm font-medium"
          style={{ color: '#1F2937' }}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default Toggle;
