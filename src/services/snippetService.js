import { isSupabaseConfigured, supabase } from '../lib/supabase'

const LOCAL_SNIPPETS_KEY = 'snipvault:snippets'
const LOCAL_CHANGE_EVENT = 'snipvault-local-change'
const LOCAL_FALLBACK_KEY = 'snipvault:local-fallback'
let localFallbackEnabled =
  !isSupabaseConfigured ||
  sessionStorage.getItem(LOCAL_FALLBACK_KEY) === 'true'

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

function sortSnippetsByTop(snippets) {
  return [...snippets].sort((a, b) => {
    if (b.upvotes !== a.upvotes) {
      return b.upvotes - a.upvotes
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

function sortSnippetsByNewest(snippets) {
  return [...snippets].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

function readLocalSnippets() {
  const stored = localStorage.getItem(LOCAL_SNIPPETS_KEY)

  if (!stored) {
    localStorage.setItem(LOCAL_SNIPPETS_KEY, '[]')
    return []
  }

  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    localStorage.setItem(LOCAL_SNIPPETS_KEY, '[]')
    return []
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
    return sortSnippetsByTop(readLocalSnippets().map(normalizeSnippet))
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
    return sortSnippetsByTop(readLocalSnippets().map(normalizeSnippet))
  }
}

export async function fetchAllSnippets() {
  if (shouldUseLocalStore()) {
    return sortSnippetsByNewest(readLocalSnippets().map(normalizeSnippet))
  }

  try {
    const { data, error } = await supabase
      .from('snippets')
      .select('id,title,language,code,upvotes,createdAt')
      .order('createdAt', { ascending: false })

    if (error) {
      throw error
    }

    return data.map(normalizeSnippet)
  } catch {
    activateLocalFallback()
    return sortSnippetsByNewest(readLocalSnippets().map(normalizeSnippet))
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
