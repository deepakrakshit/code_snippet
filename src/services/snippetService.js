import { isSupabaseConfigured, supabase } from '../lib/supabase'

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    )
  }

  return supabase
}

function toSnippetServiceError(error) {
  const message = String(error?.message ?? '').trim()
  const details = String(error?.details ?? '').trim()
  const hint = String(error?.hint ?? '').trim()
  const code = String(error?.code ?? '').trim()

  if (
    message.includes(
      "Could not find the table 'public.snippets' in the schema cache",
    )
  ) {
    return new Error(
      'Supabase table public.snippets is missing. Run supabase/schema.sql in the SQL editor for the same project used by VITE_SUPABASE_URL.',
    )
  }

  if (error instanceof Error) {
    return error
  }

  if (
    message.toLowerCase().includes('row-level security') ||
    code === '42501'
  ) {
    return new Error(
      'Insert blocked by Supabase RLS policy. Run supabase/schema.sql to create the insert/select policies on public.snippets.',
    )
  }

  const parts = [message, details, hint].filter(Boolean)
  if (parts.length) {
    return new Error(parts.join(' | '))
  }

  return new Error('Unexpected database error while loading snippets.')
}

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

export async function fetchSnippets() {
  const client = ensureSupabase()
  const { data, error } = await client.from('snippets').select('*')

  if (error) {
    throw toSnippetServiceError(error)
  }

  return sortSnippetsByTop((data ?? []).map(normalizeSnippet))
}

export async function fetchAllSnippets() {
  const client = ensureSupabase()
  const { data, error } = await client.from('snippets').select('*')

  if (error) {
    throw toSnippetServiceError(error)
  }

  return sortSnippetsByNewest((data ?? []).map(normalizeSnippet))
}

export async function fetchSnippet(snippetId) {
  const client = ensureSupabase()
  const { data, error } = await client
    .from('snippets')
    .select('*')
    .eq('id', snippetId)
    .maybeSingle()

  if (error) {
    throw toSnippetServiceError(error)
  }

  return data ? normalizeSnippet(data) : null
}

export async function createSnippet({ title, language, code }) {
  const client = ensureSupabase()
  const snippet = {
    id: createSnippetId(),
    title: title.trim(),
    language,
    code: code.trimEnd(),
    upvotes: 0,
    createdAt: new Date().toISOString(),
  }

  const { data, error } = await client
    .from('snippets')
    .insert(snippet)
    .select('*')
    .single()

  if (error) {
    console.log(error)
    throw toSnippetServiceError(error)
  }

  return normalizeSnippet(data)
}

export async function upvoteSnippet(snippetId) {
  const client = ensureSupabase()
  const { data: currentSnippet, error: currentError } = await client
    .from('snippets')
    .select('upvotes')
    .eq('id', snippetId)
    .single()

  if (currentError) {
    throw toSnippetServiceError(currentError)
  }

  const nextUpvotes = Number(currentSnippet?.upvotes ?? 0) + 1
  const { data, error } = await client
    .from('snippets')
    .update({ upvotes: nextUpvotes })
    .eq('id', snippetId)
    .select('*')
    .single()

  if (error) {
    throw toSnippetServiceError(error)
  }

  return normalizeSnippet(data)
}

export function subscribeToSnippets(onChange) {
  if (!isSupabaseConfigured || !supabase) {
    return () => {}
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
  if (!isSupabaseConfigured || !supabase) {
    return () => {}
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
