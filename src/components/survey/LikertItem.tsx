interface LikertItemProps {
  questionId: string
  questionText: string
  value: number | null
  onChange: (value: number) => void
}

export function LikertItem({ questionId, questionText, value, onChange }: LikertItemProps) {
  const options = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
  ]

  return (
    <div className="py-6 border-b border-border-divider">
      <p className="text-body-lg text-on-surface font-inter mb-4">{questionText}</p>
      
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center gap-1 sm:gap-2">
          {options.map((opt) => {
            const isSelected = value === opt.value
            return (
              <label
                key={opt.value}
                className={`flex-1 flex flex-col items-center justify-center py-3 border rounded-input cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary-container text-on-primary-container font-medium'
                    : 'border-border-divider hover:border-outline bg-white text-on-surface'
                }`}
              >
                <input
                  type="radio"
                  name={questionId}
                  value={opt.value}
                  checked={isSelected}
                  onChange={() => onChange(opt.value)}
                  className="sr-only"
                />
                <span className="text-body-md font-inter">{opt.label}</span>
              </label>
            )
          })}
        </div>
        <div className="flex justify-between text-label-sm text-text-secondary px-1">
          <span>Strongly disagree</span>
          <span>Strongly agree</span>
        </div>
      </div>
    </div>
  )
}
