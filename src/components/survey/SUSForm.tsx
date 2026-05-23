import { SUS_STATEMENTS } from '../../config/surveys'
import { LikertItem } from './LikertItem'

interface SUSFormProps {
  answers: (number | null)[]
  onChange: (index: number, value: number) => void
}

export function SUSForm({ answers, onChange }: SUSFormProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-headline-md font-newsreader text-on-surface mb-2 mt-4">
        App Usability Scale
      </h3>
      <p className="text-body-md text-text-secondary mb-6 font-inter">
        Please rate your agreement with the following statements regarding your experience with the prototype app.
      </p>

      <div className="flex flex-col">
        {SUS_STATEMENTS.map((statement, index) => (
          <LikertItem
            key={index}
            questionId={`sus_${index + 1}`}
            questionText={`${index + 1}. ${statement}`}
            value={answers[index]}
            onChange={(val) => onChange(index, val)}
          />
        ))}
      </div>
    </div>
  )
}
