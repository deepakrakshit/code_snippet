import { ArrowUp, Bot, Eye, Sparkles, Timer } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getLanguageColor, getLanguageLabel } from '../data/languages'
import { explainCode } from '../services/aiExplainService'
import { compactNumber, formatDate, getPreviewCode } from '../utils/format'

const SyntaxBlock = lazy(() => import('./SyntaxBlock'))

function SnippetCard({ snippet }) {
  const [explainResult, setExplainResult] = useState(null)
  const [explainError, setExplainError] = useState('')
  const [isExplaining, setIsExplaining] = useState(false)
  const languageColor = getLanguageColor(snippet.language)
  const languageBadgeStyle = {
    backgroundColor: `${languageColor}12`,
    borderColor: `${languageColor}66`,
    color: languageColor,
    boxShadow: `0 0 24px ${languageColor}14`,
  }

  async function handleExplainClick() {
    if (isExplaining) {
      return
    }

    try {
      setExplainError('')
      setIsExplaining(true)
      const result = await explainCode({
        title: snippet.title,
        language: snippet.language,
        code: snippet.code,
        context: 'Snippet card explain action',
      })
      setExplainResult(result)
    } catch (nextError) {
      setExplainError(nextError.message ?? 'Unable to explain code right now.')
    } finally {
      setIsExplaining(false)
    }
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

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleExplainClick}
          disabled={isExplaining}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-vault-cyan/45 bg-vault-cyan/10 px-3 text-sm font-bold text-vault-cyan transition hover:-translate-y-0.5 hover:border-vault-cyan hover:bg-vault-cyan/18 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0"
        >
          <Bot size={17} />
          {isExplaining ? 'Explaining' : 'Explain'}
        </button>
        <Link
          to={`/snippet/${snippet.id}`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-vault-border bg-vault-panel-2 px-3 text-sm font-bold text-vault-text shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:-translate-y-0.5 hover:border-vault-green/60 hover:text-vault-green focus:outline-none focus:ring-4 focus:ring-vault-green/15"
        >
          <Eye size={17} />
          View
        </Link>
      </div>

      {explainError ? (
        <p className="mt-3 rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-200">
          {explainError}
        </p>
      ) : null}

      {explainResult ? (
        <div className="mt-3 space-y-3 rounded-lg border border-vault-border bg-vault-bg/60 p-3 text-sm leading-6 text-vault-muted">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-vault-cyan">
            <Sparkles size={14} />
            AI Explain
          </p>
          <p className="text-vault-text/95">{explainResult.explanation}</p>
          <p>
            <span className="font-bold text-vault-cyan">Time:</span>{' '}
            {explainResult.complexity}
          </p>
          {explainResult.suggestions.length ? (
            <div className="space-y-2">
              {explainResult.suggestions.slice(0, 2).map((suggestion, index) => (
                <p
                  key={`${suggestion}-${index}`}
                  className="rounded-md border border-vault-border bg-vault-panel/80 px-3 py-2"
                >
                  {suggestion}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}

export default SnippetCard
