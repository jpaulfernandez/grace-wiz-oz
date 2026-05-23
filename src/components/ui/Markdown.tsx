import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

export function Markdown({ source }: { source: string }) {
  return (
    <div className="prose prose-sm max-w-none prose-headings:font-serif text-left">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{source}</ReactMarkdown>
    </div>
  )
}
