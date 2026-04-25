import { Compass, RefreshCw, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import SnippetCard from '../components/SnippetCard'
import StatusMessage from '../components/StatusMessage'
import { fetchAllSnippets, subscribeToSnippets } from '../services/snippetService'

function ExplorePage() {
  const [snippets, setSnippets] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadSnippets = useCallback(async () => {
    try {
      setError('')
      const nextSnippets = await fetchAllSnippets()
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

  const filteredSnippets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return snippets
    }

    return snippets.filter((snippet) => {
      return (
        snippet.title.toLowerCase().includes(query) ||
        snippet.language.toLowerCase().includes(query) ||
        snippet.id.toLowerCase().includes(query)
      )
    })
  }, [searchQuery, snippets])

  if (loading) {
    return (
      <section className="space-y-6">
        <ExploreHeader
          totalCount={0}
          visibleCount={0}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
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
        title="Could not load snippets"
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
      <ExploreHeader
        totalCount={snippets.length}
        visibleCount={filteredSnippets.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {!snippets.length ? (
        <StatusMessage
          title="No snippets yet"
          message="Create a snippet from the New Snip page to populate the vault."
        />
      ) : !filteredSnippets.length ? (
        <StatusMessage
          title="No search matches"
          message="Try searching by snippet title, language, or snippet ID."
          action={
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-vault-border bg-vault-panel-2 px-4 text-sm font-bold text-vault-text transition hover:-translate-y-0.5 hover:border-vault-green/60 hover:text-vault-green"
            >
              Clear search
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredSnippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      )}
    </section>
  )
}

function ExploreHeader({ totalCount, visibleCount, searchQuery, setSearchQuery }) {
  return (
    <div className="hero-panel glass-panel rise-in rounded-lg p-5 sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase text-vault-cyan">
            <Compass size={16} />
            Explore
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-vault-text sm:text-5xl">
            All Snippets
          </h1>
          <p className="mt-3 text-sm text-vault-muted">
            Showing {visibleCount} of {totalCount} snippets
          </p>
        </div>

        <label className="relative w-full md:max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-vault-muted"
          />
          <input
            type="search"
            className="input-field h-11 w-full pl-10 pr-4"
            placeholder="Search title, language, or ID"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
      </div>
    </div>
  )
}

export default ExplorePage
