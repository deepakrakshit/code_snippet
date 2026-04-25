insert into public.snippets (id, title, language, code, upvotes, "createdAt")
values
(
  'sample-react-copy-hook',
  'Clipboard Hook With Timeout',
  'javascript',
  'import { useCallback, useState } from ''react''

export function useClipboard(timeout = 1200) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (value) => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), timeout)
  }, [timeout])

  return { copied, copy }
}',
  42,
  '2026-04-18T10:30:00.000Z'
),
(
  'sample-sql-top-snippets',
  'Top Snippets Query',
  'sql',
  'select
  id,
  title,
  language,
  upvotes,
  "createdAt"
from public.snippets
order by upvotes desc, "createdAt" desc
limit 20;',
  31,
  '2026-04-16T14:05:00.000Z'
),
(
  'sample-python-slugify',
  'Tiny Python Slugify',
  'python',
  'import re

def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")

print(slugify("SnipVault Launch Day"))',
  24,
  '2026-04-12T09:45:00.000Z'
)
on conflict (id) do nothing;
