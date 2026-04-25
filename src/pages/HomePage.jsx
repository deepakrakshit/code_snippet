import {
  Activity,
  Bot,
  Code2,
  MessageSquare,
  Plus,
  RefreshCw,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SnippetCard from '../components/SnippetCard'
import StatusMessage from '../components/StatusMessage'
import { LANGUAGES } from '../data/languages'
import { askSnipVaultAssistant, explainCode } from '../services/aiExplainService'
import { fetchSnippets, subscribeToSnippets } from '../services/snippetService'

function HomePage() {
  const [snippets, setSnippets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [assistantQuestion, setAssistantQuestion] = useState('')
  const [assistantAnswer, setAssistantAnswer] = useState('')
  const [assistantError, setAssistantError] = useState('')
  const [assistantLoading, setAssistantLoading] = useState(false)
  const [quickExplainCode, setQuickExplainCode] = useState('')
  const [quickExplainLanguage, setQuickExplainLanguage] = useState('javascript')
  const [quickExplainResult, setQuickExplainResult] = useState(null)
  const [quickExplainError, setQuickExplainError] = useState('')
  const [quickExplainLoading, setQuickExplainLoading] = useState(false)

  const loadSnippets = useCallback(async () => {
    try {
      setError('')
      const nextSnippets = await fetchSnippets()
      setSnippets(nextSnippets)
    } catch (loadError) {
      setError(loadError.message ?? 'Unable to load snippets.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true
    let unsubscribe = () => {}

    queueMicrotask(async () => {
      await loadSnippets()

      if (isActive) {
        unsubscribe = subscribeToSnippets(loadSnippets)
      }
    })

    return () => {
      isActive = false
      unsubscribe()
    }
  }, [loadSnippets])

  const totalVotes = useMemo(
    () => snippets.reduce((sum, snippet) => sum + snippet.upvotes, 0),
    [snippets],
  )

  async function handleAssistantSubmit(event) {
    event.preventDefault()

    const question = assistantQuestion.trim()

    if (!question) {
      setAssistantError('Ask a question about using SnipVault.')
      return
    }

    try {
      setAssistantError('')
      setAssistantLoading(true)
      const answer = await askSnipVaultAssistant(question)
      setAssistantAnswer(answer)
    } catch (nextError) {
      setAssistantError(nextError.message ?? 'Unable to get assistant response.')
    } finally {
      setAssistantLoading(false)
    }
  }

  async function handleQuickExplainSubmit(event) {
    event.preventDefault()

    if (!quickExplainCode.trim()) {
      setQuickExplainError('Paste code to explain.')
      return
    }

    try {
      setQuickExplainError('')
      setQuickExplainLoading(true)
      const result = await explainCode({
        title: 'Homepage quick explain',
        language: quickExplainLanguage,
        code: quickExplainCode,
        context: 'Homepage AI quick explain panel',
      })
      setQuickExplainResult(result)
    } catch (nextError) {
      setQuickExplainError(nextError.message ?? 'Unable to explain code right now.')
    } finally {
      setQuickExplainLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="space-y-6">
        <HomeHeader snippetCount={0} totalVotes={0} />
        <AiPanelSkeleton />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="glass-panel min-h-[410px] animate-pulse rounded-lg p-4"
            >
              <div className="h-6 w-2/3 rounded bg-vault-border" />
              <div className="mt-4 h-5 w-40 rounded bg-vault-border/80" />
              <div className="mt-6 h-48 rounded-lg bg-vault-bg" />
              <div className="mt-5 h-11 rounded-lg bg-vault-border/70" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <StatusMessage
        title="Could not load the vault"
        message={error}
        action={
          <button
            type="button"
            onClick={loadSnippets}
            className="sheen inline-flex h-11 items-center gap-2 rounded-lg bg-vault-green px-4 text-sm font-bold text-[#001b0e] transition hover:-translate-y-0.5 hover:bg-[#35ffa0]"
          >
            <RefreshCw size={17} />
            Retry
          </button>
        }
      />
    )
  }

  return (
    <section className="space-y-6">
      <HomeHeader snippetCount={snippets.length} totalVotes={totalVotes} />
      <AiToolsPanel
        assistantQuestion={assistantQuestion}
        setAssistantQuestion={setAssistantQuestion}
        assistantAnswer={assistantAnswer}
        assistantError={assistantError}
        assistantLoading={assistantLoading}
        onAssistantSubmit={handleAssistantSubmit}
        quickExplainCode={quickExplainCode}
        setQuickExplainCode={setQuickExplainCode}
        quickExplainLanguage={quickExplainLanguage}
        setQuickExplainLanguage={setQuickExplainLanguage}
        quickExplainResult={quickExplainResult}
        quickExplainError={quickExplainError}
        quickExplainLoading={quickExplainLoading}
        onQuickExplainSubmit={handleQuickExplainSubmit}
      />

      {snippets.length === 0 ? (
        <StatusMessage
          title="No snippets yet"
          action={
            <Link
              to="/create"
              className="sheen inline-flex h-11 items-center gap-2 rounded-lg bg-vault-green px-4 text-sm font-bold text-[#001b0e] transition hover:-translate-y-0.5 hover:bg-[#35ffa0]"
            >
              <Plus size={17} />
              Create first snippet
            </Link>
          }
        />
      ) : (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-vault-green">
                Real snippets
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-vault-text">
                Popular in the vault
              </h2>
            </div>
            <Link
              to="/vault"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-vault-border bg-vault-panel-2 px-4 text-sm font-bold text-vault-text transition hover:-translate-y-0.5 hover:border-vault-cyan/60 hover:text-vault-cyan"
            >
              Explore all snippets
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {snippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        </section>
      )}
    </section>
  )
}

function HomeHeader({ snippetCount, totalVotes }) {
  return (
    <div className="hero-panel glass-panel rise-in rounded-lg p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase text-vault-green">
            <Trophy size={16} />
            Live vault
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-vault-text sm:text-5xl">
            SnipVault command center
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-vault-muted sm:text-base">
            Search-worthy code snippets, instant AI help, and the highest voted
            ideas from your real Supabase data.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:min-w-72">
          <div className="rounded-lg border border-vault-border bg-vault-bg/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-vault-muted">
              <Activity size={14} />
              Snippets
            </p>
            <p className="mt-1 text-2xl font-extrabold text-vault-text">
              {snippetCount}
            </p>
          </div>
          <div className="rounded-lg border border-vault-border bg-vault-bg/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <p className="text-xs font-semibold text-vault-muted">Upvotes</p>
            <p className="mt-1 text-2xl font-extrabold text-vault-green">
              {totalVotes}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AiPanelSkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="glass-panel min-h-[280px] animate-pulse rounded-lg p-5"
        >
          <div className="h-6 w-40 rounded bg-vault-border" />
          <div className="mt-4 h-4 w-full rounded bg-vault-border/70" />
          <div className="mt-3 h-4 w-4/5 rounded bg-vault-border/65" />
          <div className="mt-5 h-11 rounded bg-vault-border/70" />
          <div className="mt-4 h-24 rounded bg-vault-bg" />
        </div>
      ))}
    </div>
  )
}

function AiToolsPanel({
  assistantQuestion,
  setAssistantQuestion,
  assistantAnswer,
  assistantError,
  assistantLoading,
  onAssistantSubmit,
  quickExplainCode,
  setQuickExplainCode,
  quickExplainLanguage,
  setQuickExplainLanguage,
  quickExplainResult,
  quickExplainError,
  quickExplainLoading,
  onQuickExplainSubmit,
}) {
  const promptSuggestions = [
    'How do I create a snippet?',
    'How do I share a snippet?',
    'How do upvotes work?',
  ]

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="ai-panel rise-in rounded-lg p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-vault-cyan">
              <Bot size={16} />
              AI Assistant
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-vault-text">
              Ask about SnipVault
            </h2>
          </div>
          <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-vault-cyan/40 bg-vault-cyan/10 text-vault-cyan">
            <MessageSquare size={20} />
          </span>
        </div>

        <form onSubmit={onAssistantSubmit} className="mt-4 space-y-3">
          <input
            className="input-field h-11 px-4"
            value={assistantQuestion}
            onChange={(event) => setAssistantQuestion(event.target.value)}
            placeholder="Ask anything about using SnipVault..."
          />
          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setAssistantQuestion(suggestion)}
                className="rounded-lg border border-vault-border bg-vault-bg/70 px-3 py-2 text-xs font-bold text-vault-muted transition hover:border-vault-cyan/60 hover:text-vault-cyan"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={assistantLoading}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-vault-cyan/45 bg-vault-cyan/10 px-4 text-sm font-extrabold text-vault-cyan transition hover:-translate-y-0.5 hover:border-vault-cyan hover:bg-vault-cyan/18 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0"
          >
            <Sparkles size={16} />
            {assistantLoading ? 'Thinking...' : 'Ask Assistant'}
          </button>
        </form>

        {assistantError ? (
          <p className="mt-4 rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
            {assistantError}
          </p>
        ) : null}

        {assistantAnswer ? (
          <div className="mt-4 whitespace-pre-wrap rounded-lg border border-vault-border bg-vault-bg/60 px-4 py-3 text-sm leading-7 text-vault-text/95">
            {assistantAnswer}
          </div>
        ) : null}
      </section>

      <section className="ai-panel rise-in rounded-lg p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-vault-green">
              <Sparkles size={16} />
              Explain Code
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-vault-text">
              Paste, explain, improve
            </h2>
          </div>
          <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-vault-green/40 bg-vault-green/10 text-vault-green">
            <Code2 size={20} />
          </span>
        </div>

        <form onSubmit={onQuickExplainSubmit} className="mt-4 space-y-3">
          <select
            className="input-field h-11 px-4"
            value={quickExplainLanguage}
            onChange={(event) => setQuickExplainLanguage(event.target.value)}
          >
            {LANGUAGES.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>

          <textarea
            className="input-field code-scrollbar min-h-[180px] resize-y px-4 py-3 text-sm leading-7"
            value={quickExplainCode}
            onChange={(event) => setQuickExplainCode(event.target.value)}
            placeholder="Paste code here..."
            spellCheck="false"
          />

          <button
            type="submit"
            disabled={quickExplainLoading}
            className="sheen inline-flex h-11 items-center gap-2 rounded-lg bg-vault-green px-4 text-sm font-extrabold text-[#001b0e] transition hover:-translate-y-0.5 hover:bg-[#35ffa0] disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0"
          >
            <Sparkles size={16} />
            {quickExplainLoading ? 'Explaining...' : 'Explain'}
          </button>
        </form>

        {quickExplainError ? (
          <p className="mt-4 rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
            {quickExplainError}
          </p>
        ) : null}

        {quickExplainResult ? (
          <div className="mt-4 space-y-4 rounded-lg border border-vault-border bg-vault-bg/60 px-4 py-3 text-sm leading-7 text-vault-muted">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-vault-green">
                Explanation
              </p>
              <p className="mt-1 text-vault-text/95">{quickExplainResult.explanation}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-vault-green">
                Time Complexity
              </p>
              <p className="mt-1 text-vault-text/95">{quickExplainResult.complexity}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-vault-green">
                Suggestions
              </p>
              {quickExplainResult.suggestions.length ? (
                <div className="mt-2 space-y-2">
                  {quickExplainResult.suggestions.map((suggestion, index) => (
                    <p
                      key={`${suggestion}-${index}`}
                      className="rounded-md border border-vault-border bg-vault-panel/80 px-3 py-2"
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
      </section>
    </div>
  )
}

export default HomePage
