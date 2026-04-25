import {
  ArrowLeft,
  ArrowUp,
  Bot,
  Camera,
  Check,
  Clipboard,
  Copy,
  Link as LinkIcon,
  RefreshCw,
} from 'lucide-react'
import html2canvas from 'html2canvas'
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Link, useParams } from 'react-router-dom'
import StatusMessage from '../components/StatusMessage'
import { getLanguageColor, getLanguageLabel } from '../data/languages'
import { explainCode } from '../services/aiExplainService'
import {
  fetchSnippet,
  subscribeToSnippet,
  upvoteSnippet,
} from '../services/snippetService'
import { formatDate } from '../utils/format'
import { buildPreviewDocument, supportsLivePreview } from '../utils/livePreview'
import { hasVoted, markVoted, unmarkVoted } from '../utils/votes'

const SyntaxBlock = lazy(() => import('../components/SyntaxBlock'))

function createExportFileName(title) {
  const normalized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)

  return normalized || 'snipvault-snippet'
}

function SnippetPage() {
  const { id } = useParams()
  const exportCardRef = useRef(null)
  const [snippet, setSnippet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [explainError, setExplainError] = useState('')
  const [exportError, setExportError] = useState('')
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [isExplaining, setIsExplaining] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [voteBump, setVoteBump] = useState(false)
  const [alreadyVoted, setAlreadyVoted] = useState(() => hasVoted(id))
  const [explainResult, setExplainResult] = useState(null)
  const languageColor = snippet ? getLanguageColor(snippet.language) : '#00ff88'
  const canPreview = snippet ? supportsLivePreview(snippet.language) : false
  const previewDocument = useMemo(() => {
    if (!snippet || !canPreview) {
      return ''
    }

    return buildPreviewDocument({
      language: snippet.language,
      code: snippet.code,
    })
  }, [snippet, canPreview])
  const languageBadgeStyle = {
    backgroundColor: `${languageColor}12`,
    borderColor: `${languageColor}66`,
    color: languageColor,
    boxShadow: `0 0 24px ${languageColor}14`,
  }

  const loadSnippet = useCallback(async () => {
    try {
      setError('')
      const nextSnippet = await fetchSnippet(id)
      setSnippet(nextSnippet)
    } catch (loadError) {
      setError(loadError.message ?? 'Unable to load snippet.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    let isActive = true
    let unsubscribe = () => {}

    queueMicrotask(async () => {
      setLoading(true)
      setAlreadyVoted(hasVoted(id))
      setExplainResult(null)
      setExplainError('')
      setExportError('')
      await loadSnippet()

      if (isActive) {
        unsubscribe = subscribeToSnippet(id, loadSnippet)
      }
    })

    return () => {
      isActive = false
      unsubscribe()
    }
  }, [id, loadSnippet])

  async function copyValue(value, setter) {
    try {
      await navigator.clipboard.writeText(value)
      setter(true)
      window.setTimeout(() => setter(false), 1200)
    } catch {
      setError('Clipboard permission was denied.')
    }
  }

  async function handleExplainCode() {
    if (!snippet || isExplaining) {
      return
    }

    try {
      setExplainError('')
      setIsExplaining(true)
      const result = await explainCode({
        title: snippet.title,
        language: snippet.language,
        code: snippet.code,
      })
      setExplainResult(result)
    } catch (nextError) {
      setExplainError(nextError.message ?? 'Unable to explain code right now.')
    } finally {
      setIsExplaining(false)
    }
  }

  async function handleExportImage() {
    if (!snippet || !exportCardRef.current || isExporting) {
      return
    }

    try {
      setExportError('')
      setIsExporting(true)

      const canvas = await html2canvas(exportCardRef.current, {
        backgroundColor: '#0d1117',
        scale: 2,
        useCORS: true,
      })

      const downloadLink = document.createElement('a')
      downloadLink.href = canvas.toDataURL('image/png')
      downloadLink.download = `${createExportFileName(snippet.title)}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      downloadLink.remove()
    } catch (nextError) {
      setExportError(nextError.message ?? 'Unable to export snippet image.')
    } finally {
      setIsExporting(false)
    }
  }

  async function handleUpvote() {
    if (alreadyVoted || isVoting || !snippet) {
      return
    }

    const previousSnippet = snippet

    try {
      setIsVoting(true)
      setAlreadyVoted(true)
      markVoted(id)
      setSnippet((current) => ({
        ...current,
        upvotes: current.upvotes + 1,
      }))
      setVoteBump(true)
      window.setTimeout(() => setVoteBump(false), 450)

      const updatedSnippet = await upvoteSnippet(id)
      setSnippet(updatedSnippet)
    } catch (voteError) {
      unmarkVoted(id)
      setAlreadyVoted(false)
      setSnippet(previousSnippet)
      setError(voteError.message ?? 'Unable to upvote snippet.')
    } finally {
      setIsVoting(false)
    }
  }

  if (loading) {
    return (
      <div className="glass-panel min-h-[560px] animate-pulse rounded-lg p-5 sm:p-6">
        <div className="h-7 w-2/3 rounded bg-vault-border" />
        <div className="mt-4 h-5 w-56 rounded bg-vault-border/80" />
        <div className="mt-8 h-[420px] rounded-lg bg-vault-bg" />
      </div>
    )
  }

  if (error && !snippet) {
    return (
      <StatusMessage
        title="Could not open snippet"
        message={error}
        action={
          <Link
            to="/"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-vault-green px-4 text-sm font-bold text-[#001b0e] transition hover:bg-[#35ffa0]"
          >
            <ArrowLeft size={17} />
            Back to vault
          </Link>
        }
      />
    )
  }

  if (!snippet) {
    return (
      <StatusMessage
        title="Snippet not found"
        action={
          <Link
            to="/"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-vault-green px-4 text-sm font-bold text-[#001b0e] transition hover:bg-[#35ffa0]"
          >
            <ArrowLeft size={17} />
            Back to vault
          </Link>
        }
      />
    )
  }

  return (
    <article className="space-y-5">
      <Link
        to="/"
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-vault-border bg-vault-panel px-3 text-sm font-bold text-vault-muted transition hover:-translate-y-0.5 hover:border-vault-green/55 hover:text-vault-green"
      >
        <ArrowLeft size={17} />
        Vault
      </Link>

      <div
        ref={exportCardRef}
        className="hero-panel glass-panel rise-in export-capture-surface overflow-hidden rounded-lg"
      >
        <div className="border-b border-vault-border p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span
                  className="rounded-md border px-2.5 py-1 font-extrabold"
                  style={languageBadgeStyle}
                >
                  {getLanguageLabel(snippet.language)}
                </span>
                <span className="rounded-md border border-vault-border bg-vault-bg px-2.5 py-1 text-vault-muted">
                  {formatDate(snippet.createdAt)}
                </span>
              </div>
              <h1 className="mt-4 break-words text-3xl font-extrabold text-vault-text sm:text-4xl">
                {snippet.title}
              </h1>
            </div>

            <div className="space-y-2 lg:max-w-xl">
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={handleExplainCode}
                  disabled={isExplaining}
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-vault-cyan/45 bg-vault-cyan/10 px-4 text-sm font-extrabold text-vault-cyan transition hover:-translate-y-0.5 hover:border-vault-cyan hover:bg-vault-cyan/18 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0"
                >
                  <Bot size={17} />
                  {isExplaining ? 'Explaining...' : 'Explain Code'}
                </button>

                <button
                  type="button"
                  onClick={handleExportImage}
                  disabled={isExporting}
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-vault-amber/55 bg-vault-amber/12 px-4 text-sm font-extrabold text-vault-amber transition hover:-translate-y-0.5 hover:border-vault-amber hover:bg-vault-amber/18 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0"
                >
                  <Camera size={17} />
                  {isExporting ? 'Exporting...' : 'Export as Image'}
                </button>

                <button
                  type="button"
                  onClick={handleUpvote}
                  disabled={alreadyVoted || isVoting}
                  className="sheen inline-flex h-11 items-center gap-2 rounded-lg bg-vault-green px-4 text-sm font-extrabold text-[#001b0e] shadow-[0_14px_34px_rgba(0,255,136,0.18)] transition hover:-translate-y-0.5 hover:bg-[#35ffa0] hover:shadow-[0_18px_42px_rgba(0,255,136,0.24)] disabled:cursor-not-allowed disabled:bg-vault-panel-2 disabled:text-vault-muted disabled:shadow-none disabled:hover:translate-y-0"
                >
                  <ArrowUp size={18} />
                  <span className={voteBump ? 'vote-pop' : ''}>
                    {snippet.upvotes}
                  </span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={() => copyValue(snippet.code, setCopiedCode)}
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-vault-border bg-vault-panel-2 px-4 text-sm font-bold text-vault-text shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:-translate-y-0.5 hover:border-vault-green/60 hover:text-vault-green"
                >
                  {copiedCode ? <Check size={18} /> : <Copy size={18} />}
                  {copiedCode ? 'Copied' : 'Copy Code'}
                </button>

                <button
                  type="button"
                  onClick={() => copyValue(window.location.href, setCopiedLink)}
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-vault-border bg-vault-panel-2 px-4 text-sm font-bold text-vault-text shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:-translate-y-0.5 hover:border-vault-cyan/60 hover:text-vault-cyan"
                >
                  {copiedLink ? <Check size={18} /> : <LinkIcon size={18} />}
                  {copiedLink ? 'Copied' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              <RefreshCw size={16} />
              {error}
            </p>
          ) : null}

          {exportError ? (
            <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              <RefreshCw size={16} />
              {exportError}
            </p>
          ) : null}
        </div>

        <div className="p-4 sm:p-5">
          <div className={canPreview ? 'grid gap-4 xl:grid-cols-2' : ''}>
            <Suspense
              fallback={
                <pre className="code-scrollbar min-h-[360px] overflow-auto rounded-lg border border-vault-border bg-[#10151d] p-5 font-mono text-sm leading-7 text-vault-muted">
                  {snippet.code}
                </pre>
              }
            >
              <SyntaxBlock code={snippet.code} language={snippet.language} />
            </Suspense>

            {canPreview ? (
              <section className="overflow-hidden rounded-lg border border-vault-border bg-[#0f131a]">
                <div className="flex h-11 items-center justify-between border-b border-vault-border px-4">
                  <h2 className="text-sm font-bold text-vault-text">Live Preview</h2>
                  <span className="text-xs font-semibold uppercase tracking-wide text-vault-muted">
                    {snippet.language}
                  </span>
                </div>
                <iframe
                  title={`${snippet.title} live preview`}
                  srcDoc={previewDocument}
                  sandbox="allow-scripts"
                  className="h-[360px] w-full border-0 bg-white"
                />
              </section>
            ) : null}
          </div>
        </div>

        <div className="border-t border-vault-border p-4 sm:p-5">
          <section className="rounded-lg border border-vault-border bg-vault-panel/70 p-4 sm:p-5">
            <h2 className="inline-flex items-center gap-2 text-lg font-extrabold text-vault-text">
              <Bot size={18} className="text-vault-cyan" />
              AI Code Explain
            </h2>

            {isExplaining ? (
              <div className="mt-4 space-y-3">
                <div className="h-4 w-5/6 animate-pulse rounded bg-vault-border/70" />
                <div className="h-4 w-full animate-pulse rounded bg-vault-border/65" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-vault-border/65" />
              </div>
            ) : null}

            {!isExplaining && explainError ? (
              <p className="mt-4 rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                {explainError}
              </p>
            ) : null}

            {!isExplaining && !explainError && explainResult ? (
              <div className="mt-4 space-y-4 text-sm leading-7 text-vault-muted">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-vault-cyan">
                    Explanation
                  </p>
                  <p className="mt-1 text-vault-text/95">{explainResult.explanation}</p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-vault-cyan">
                    Time Complexity
                  </p>
                  <p className="mt-1 text-vault-text/95">{explainResult.complexity}</p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-vault-cyan">
                    Suggestions
                  </p>
                  {explainResult.suggestions.length ? (
                    <div className="mt-2 space-y-2">
                      {explainResult.suggestions.map((suggestion, index) => (
                        <p
                          key={`${suggestion}-${index}`}
                          className="rounded-md border border-vault-border bg-vault-bg/60 px-3 py-2"
                        >
                          {suggestion}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-vault-text/95">
                      No additional improvements suggested.
                    </p>
                  )}
                </div>
              </div>
            ) : null}

            {!isExplaining && !explainError && !explainResult ? (
              <p className="mt-4 text-sm text-vault-muted">
                Use Explain Code to generate a plain-English summary, complexity guidance, and improvement ideas.
              </p>
            ) : null}
          </section>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-vault-border px-5 py-4 text-sm text-vault-muted">
          <span className="inline-flex items-center gap-2">
            <Clipboard size={16} className="text-vault-green" />
            {snippet.code.split('\n').length} lines
          </span>
          <span>{snippet.id}</span>
        </div>
      </div>
    </article>
  )
}

export default SnippetPage
