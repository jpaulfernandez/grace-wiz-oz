import { forwardRef, useState, useEffect } from 'react'

export interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: React.ReactNode
  disabled?: boolean
  className?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onCheckedChange, label, disabled, className = '', ...props }, ref) => {
    const [internalChecked, setInternalChecked] = useState(checked || false)

    useEffect(() => {
      if (checked !== undefined) {
        setInternalChecked(checked)
      }
    }, [checked])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked
      setInternalChecked(newChecked)
      onCheckedChange?.(newChecked)
    }

    return (
      <label className={`flex items-start gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            checked={internalChecked}
            onChange={handleChange}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div className={`w-5 h-5 rounded border-2 transition-colors ${
            internalChecked
              ? 'bg-primary border-primary'
              : 'bg-white border-outline'
          }`}>
            <svg className={`w-full h-full text-white transition-opacity ${internalChecked ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 20 20" fill="none">
              <path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        {label && (
          <span className="text-base font-inter text-on-surface leading-relaxed">
            {label}
          </span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
