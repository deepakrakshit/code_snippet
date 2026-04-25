import { Activity, Bot, Plus, RefreshCw, Sparkles, Trophy } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SnippetCard from '../components/SnippetCard'
import StatusMessage from '../components/StatusMessage'
import { fetchSnippets, subscribeToSnippets } from '../services/snippetService'

function HomePage() {
  const [snippets, setSnippets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  if (loading) {
    return (
      <section className="space-y-6">
        <HomeHeader snippetCount={0} totalVotes={0} />
        <SnippetGridSkeleton />
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

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-vault-green">
              Featured feed
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-vault-text">
              Top Snippets
            </h2>
          </div>
          <Link
            to="/vault"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-vault-border bg-vault-panel-2 px-4 text-sm font-bold text-vault-text transition hover:-translate-y-0.5 hover:border-vault-cyan/60 hover:text-vault-cyan"
          >
            Explore all snippets
          </Link>
        </div>

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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {snippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        )}
      </section>
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
            Vault
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-vault-text sm:text-5xl">
            Top Snippets
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-vault-muted sm:text-base">
            The classic SnipVault feed is back: polished snippets first, AI kept
            close by without crowding the homepage.
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
          <Link
            to="/ai"
            className="rounded-lg border border-vault-cyan/35 bg-vault-cyan/10 p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:-translate-y-0.5 hover:border-vault-cyan/70"
          >
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-vault-cyan">
              <Bot size={14} />
              AI Tools
            </p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-extrabold text-vault-text">
              Ask or explain
              <Sparkles size={14} className="text-vault-cyan" />
            </p>
          </Link>
          <div className="col-span-2 rounded-lg border border-vault-border bg-vault-bg/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
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

function SnippetGridSkeleton() {
  return (
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
  )
}

export default HomePage
