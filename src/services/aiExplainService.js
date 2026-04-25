const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_MODEL =
  import.meta.env.VITE_OPENROUTER_MODEL ?? 'openai/gpt-4o-mini'
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

function parseJsonValue(text) {
  if (!text || typeof text !== 'string') {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    const firstCurly = text.indexOf('{')
    const lastCurly = text.lastIndexOf('}')

    if (firstCurly === -1 || lastCurly === -1 || firstCurly >= lastCurly) {
      return null
    }

    try {
      return JSON.parse(text.slice(firstCurly, lastCurly + 1))
    } catch {
      return null
    }
  }
}

function normalizeSuggestions(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? '').trim())
      .filter(Boolean)
      .slice(0, 5)
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split('\n')
      .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
      .filter(Boolean)
      .slice(0, 5)
  }

  return []
}

function normalizeResult(value) {
  return {
    explanation: String(value?.explanation ?? 'No explanation returned.').trim(),
    complexity: String(value?.complexity ?? 'Not applicable').trim(),
    suggestions: normalizeSuggestions(value?.suggestions),
  }
}

export async function explainCode({ code, language, title }) {
  if (!OPENROUTER_API_KEY) {
    throw new Error(
      'AI explain is not configured. Add VITE_OPENROUTER_API_KEY to your environment.',
    )
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'SnipVault',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You explain code for developers. Always return valid JSON with keys: explanation, complexity, suggestions. suggestions must be an array of 1 to 5 concise strings.',
        },
        {
          role: 'user',
          content: [
            `Snippet title: ${title ?? 'Untitled snippet'}`,
            `Language: ${language}`,
            'Return:',
            '1) explanation in plain English (2 to 5 sentences)',
            '2) time complexity if applicable, else "Not applicable"',
            '3) practical improvements',
            '',
            code,
          ].join('\n'),
        },
      ],
    }),
  })

  if (!response.ok) {
    try {
      const body = await response.json()
      throw new Error(body?.error?.message ?? 'AI request failed.')
    } catch {
      throw new Error('AI request failed.')
    }
  }

  const body = await response.json()
  const content = body?.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('AI did not return an explanation.')
  }

  const parsed = parseJsonValue(content)

  if (!parsed) {
    return normalizeResult({ explanation: content })
  }

  return normalizeResult(parsed)
}
