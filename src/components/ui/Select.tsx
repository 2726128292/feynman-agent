import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, placeholder, onChange, className = '', style, id, ...props }, ref) => {
    const selectId = id || `select-${label?.replace(/\s+/g, '-')}`;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium"
            style={{ color: '#1F2937' }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full appearance-none rounded-[10px] border px-3 py-2.5 pr-9
              text-sm font-normal transition-colors duration-200
              outline-none cursor-pointer
              ${error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              }
              ${className}
            `}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#1F2937',
              ...style,
            }}
            onChange={handleChange}
            defaultValue=""
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: '#6B7280' }}
          />
        </div>
        {error && (
          <p className="text-xs mt-0.5" style={{ color: '#EF4444' }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
