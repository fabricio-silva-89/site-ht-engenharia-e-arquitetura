import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="block text-sm font-medium text-primary">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`w-full border px-4 py-3 text-sm text-primary placeholder:text-secondary/50 transition-colors focus:outline-none focus:border-accent ${
            error ? 'border-error' : 'border-border'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
