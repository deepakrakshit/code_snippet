import { ArrowUp, Eye, Timer } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { getLanguageColor, getLanguageLabel } from '../data/languages'
import { compactNumber, formatDate, getPreviewCode } from '../utils/format'

const SyntaxBlock = lazy(() => import('./SyntaxBlock'))

function SnippetCard({ snippet }) {
  const languageColor = getLanguageColor(snippet.language)
  const languageBadgeStyle = {
    backgroundColor: `${languageColor}12`,
    borderColor: `${languageColor}66`,
    color: languageColor,
    boxShadow: `0 0 24px ${languageColor}14`,
  }

  return (
    <article className="premium-card group glass-panel rise-in flex min-h-[410px] flex-col rounded-lg p-4 transition duration-300 hover:-translate-y-1.5 hover:border-vault-green/55 hover:shadow-[0_28px_95px_rgba(0,255,136,0.11)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-extrabold text-vault-text transition group-hover:text-white">
            {snippet.title}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-vault-muted">
            <span
              className="rounded-md border px-2.5 py-1 font-extrabold"
              style={languageBadgeStyle}
            >
              {getLanguageLabel(snippet.language)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Timer size={14} />
              {formatDate(snippet.createdAt)}
            </span>
          </div>
        </div>

        <span className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-vault-border bg-vault-bg/95 px-3 text-sm font-bold text-vault-text shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition group-hover:border-vault-green/50">
          <ArrowUp size={16} className="text-vault-green" />
          {compactNumber(snippet.upvotes)}
        </span>
      </div>

      <div className="mt-4 flex-1">
        <Suspense
          fallback={
            <div className="h-[216px] rounded-lg border border-vault-border bg-[#10151d] p-4 font-mono text-xs leading-6 text-vault-muted">
              {getPreviewCode(snippet.code)}
            </div>
          }
        >
          <SyntaxBlock
            code={getPreviewCode(snippet.code)}
            language={snippet.language}
            preview
          />
        </Suspense>
      </div>

      <Link
        to={`/snippet/${snippet.id}`}
        className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-vault-border bg-vault-panel-2 px-4 text-sm font-bold text-vault-text shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:-translate-y-0.5 hover:border-vault-green/60 hover:text-vault-green focus:outline-none focus:ring-4 focus:ring-vault-green/15"
      >
        <Eye size={17} />
        View
      </Link>
    </article>
  )
}

export default SnippetCard
