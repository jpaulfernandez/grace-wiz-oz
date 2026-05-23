import { forwardRef } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium font-inter text-on-surface mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full h-12 px-4 rounded-input font-inter
            bg-white border border-outline
            text-on-surface placeholder:text-text-muted
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20
            ${error ? 'border-error' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm font-inter text-error">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
