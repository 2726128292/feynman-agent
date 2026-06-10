import React, { forwardRef } from 'react';

interface InputProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  multiline?: boolean;
  type?: string;
  onChange?: (value: string) => void;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, error, prefixIcon, suffixIcon, multiline = false, onChange, className = '', style, id, ...props }, ref) => {
    const inputId = id || `input-${label?.replace(/\s+/g, '-')}`;

    const baseInputClasses = `
      w-full rounded-[10px] border px-3 py-2.5 text-sm font-normal
      transition-colors duration-200 outline-none
      placeholder:text-gray-400
      focus:ring-2 focus:ring-offset-0
      ${error
        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
      }
      ${prefixIcon ? 'pl-10' : ''}
      ${suffixIcon ? 'pr-10' : ''}
      ${className}
    `;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium"
            style={{ color: '#1F2937' }}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixIcon && (
            <span className="absolute left-3 z-10" style={{ color: '#6B7280' }}>
              {prefixIcon}
            </span>
          )}
          {multiline ? (
            <textarea
              ref={ref as React.RefObject<HTMLTextAreaElement>}
              id={inputId}
              rows={4}
              className={`${baseInputClasses} resize-y min-h-[100px]`}
              style={{ backgroundColor: '#FFFFFF', color: '#1F2937', ...style }}
              onChange={handleChange}
              {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
            />
          ) : (
            <input
              ref={ref as React.RefObject<HTMLInputElement>}
              id={inputId}
              className={baseInputClasses}
              style={{ backgroundColor: '#FFFFFF', color: '#1F2937', ...style }}
              onChange={handleChange}
              {...props as React.InputHTMLAttributes<HTMLInputElement>}
            />
          )}
          {suffixIcon && (
            <span className="absolute right-3 z-10" style={{ color: '#6B7280' }}>
              {suffixIcon}
            </span>
          )}
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

Input.displayName = 'Input';
export default Input;
