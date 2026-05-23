import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', isLoading, disabled, className = '', ...props }, ref) => {
    const baseStyles = 'h-12 px-6 rounded-input font-medium font-inter text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2'

    const variants = {
      primary: 'bg-primary text-white hover:bg-opacity-90 active:bg-opacity-100',
      secondary: 'border-2 border-primary text-primary bg-transparent hover:bg-primary-container active:bg-white',
      text: 'text-primary bg-transparent hover:bg-primary-container active:bg-transparent px-3',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
