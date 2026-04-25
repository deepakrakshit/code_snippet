import { isSupabaseConfigured, supabase } from '../lib/supabase'

const LOCAL_SNIPPETS_KEY = 'snipvault:demo-snippets'
const LOCAL_CHANGE_EVENT = 'snipvault-local-change'
const LOCAL_FALLBACK_KEY = 'snipvault:local-fallback'
let localFallbackEnabled =
  !isSupabaseConfigured ||
  sessionStorage.getItem(LOCAL_FALLBACK_KEY) === 'true'

const seedSnippets = [
  {
    id: 'demo-react-copy-hook',
    title: 'Clipboard Hook With Timeout',
    language: 'javascript',
    code: `import { useCallback, useState } from 'react'

export function useClipboard(timeout = 1200) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (value) => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), timeout)
  }, [timeout])

  return { copied, copy }
}`,
    upvotes: 42,
    createdAt: '2026-04-18T10:30:00.000Z',
  },
  {
    id: 'demo-sql-top-snippets',
    title: 'Top Snippets Query',
    language: 'sql',
    code: `select
  id,
  title,
  language,
  upvotes,
  "createdAt"
from public.snippets
order by upvotes desc, "createdAt" desc
limit 20;`,
    upvotes: 31,
    createdAt: '2026-04-16T14:05:00.000Z',
  },
  {
    id: 'demo-python-slugify',
    title: 'Tiny Python Slugify',
    language: 'python',
    code: `import re

def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")

print(slugify("SnipVault Launch Day"))`,
    upvotes: 24,
    createdAt: '2026-04-12T09:45:00.000Z',
  },
]

function createSnippetId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `snip_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function normalizeSnippet(snippet) {
  return {
    ...snippet,
    upvotes: Number(snippet.upvotes ?? 0),
  }
}

function sortSnippets(snippets) {
  return [...snippets].sort((a, b) => {
    if (b.upvotes !== a.upvotes) {
      return b.upvotes - a.upvotes
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

function readLocalSnippets() {
  const stored = localStorage.getItem(LOCAL_SNIPPETS_KEY)

  if (!stored) {
    localStorage.setItem(LOCAL_SNIPPETS_KEY, JSON.stringify(seedSnippets))
    return seedSnippets
  }

  try {
    return JSON.parse(stored)
  } catch {
    localStorage.setItem(LOCAL_SNIPPETS_KEY, JSON.stringify(seedSnippets))
    return seedSnippets
  }
}

function writeLocalSnippets(snippets) {
  localStorage.setItem(LOCAL_SNIPPETS_KEY, JSON.stringify(snippets))
  window.dispatchEvent(new CustomEvent(LOCAL_CHANGE_EVENT))
}

function shouldUseLocalStore() {
  return localFallbackEnabled || !isSupabaseConfigured
}

function activateLocalFallback() {
  localFallbackEnabled = true
  sessionStorage.setItem(LOCAL_FALLBACK_KEY, 'true')
}

export async function fetchSnippets() {
  if (shouldUseLocalStore()) {
    return sortSnippets(readLocalSnippets().map(normalizeSnippet))
  }

  try {
    const { data, error } = await supabase
      .from('snippets')
      .select('id,title,language,code,upvotes,createdAt')
      .order('upvotes', { ascending: false })
      .order('createdAt', { ascending: false })

    if (error) {
      throw error
    }

    return data.map(normalizeSnippet)
  } catch {
    activateLocalFallback()
    return sortSnippets(readLocalSnippets().map(normalizeSnippet))
  }
}

export async function fetchSnippet(snippetId) {
  if (shouldUseLocalStore()) {
    const snippet = readLocalSnippets().find((item) => item.id === snippetId)
    return snippet ? normalizeSnippet(snippet) : null
  }

  try {
    const { data, error } = await supabase
      .from('snippets')
      .select('id,title,language,code,upvotes,createdAt')
      .eq('id', snippetId)
      .maybeSingle()

    if (error) {
      throw error
    }

    return data ? normalizeSnippet(data) : null
  } catch {
    activateLocalFallback()
    const snippet = readLocalSnippets().find((item) => item.id === snippetId)
    return snippet ? normalizeSnippet(snippet) : null
  }
}

export async function createSnippet({ title, language, code }) {
  const snippet = {
    id: createSnippetId(),
    title: title.trim(),
    language,
    code: code.trimEnd(),
    upvotes: 0,
    createdAt: new Date().toISOString(),
  }

  if (shouldUseLocalStore()) {
    writeLocalSnippets([snippet, ...readLocalSnippets()])
    return snippet
  }

  try {
    const { data, error } = await supabase
      .from('snippets')
      .insert(snippet)
      .select('id,title,language,code,upvotes,createdAt')
      .single()

    if (error) {
      throw error
    }

    return normalizeSnippet(data)
  } catch {
    activateLocalFallback()
    writeLocalSnippets([snippet, ...readLocalSnippets()])
    return snippet
  }
}

export async function upvoteSnippet(snippetId) {
  if (shouldUseLocalStore()) {
    const snippets = readLocalSnippets()
    const updated = snippets.map((snippet) =>
      snippet.id === snippetId
        ? { ...snippet, upvotes: Number(snippet.upvotes ?? 0) + 1 }
        : snippet,
    )

    writeLocalSnippets(updated)
    return normalizeSnippet(updated.find((snippet) => snippet.id === snippetId))
  }

  try {
    const { data, error } = await supabase.rpc('increment_snippet_upvotes', {
      snippet_id: snippetId,
    })

    if (error) {
      throw error
    }

    const snippet = Array.isArray(data) ? data[0] : data
    return normalizeSnippet(snippet)
  } catch {
    activateLocalFallback()
    const snippets = readLocalSnippets()
    const updated = snippets.map((snippet) =>
      snippet.id === snippetId
        ? { ...snippet, upvotes: Number(snippet.upvotes ?? 0) + 1 }
        : snippet,
    )

    writeLocalSnippets(updated)
    return normalizeSnippet(updated.find((snippet) => snippet.id === snippetId))
  }
}

export function subscribeToSnippets(onChange) {
  if (shouldUseLocalStore()) {
    window.addEventListener(LOCAL_CHANGE_EVENT, onChange)
    window.addEventListener('storage', onChange)

    return () => {
      window.removeEventListener(LOCAL_CHANGE_EVENT, onChange)
      window.removeEventListener('storage', onChange)
    }
  }

  const channel = supabase
    .channel('snipvault-snippets-feed')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'snippets' },
      onChange,
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export function subscribeToSnippet(snippetId, onChange) {
  if (shouldUseLocalStore()) {
    return subscribeToSnippets(onChange)
  }

  const channel = supabase
    .channel(`snipvault-snippet-${snippetId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'snippets',
        filter: `id=eq.${snippetId}`,
      },
      onChange,
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
