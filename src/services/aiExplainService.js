const AI_ENDPOINT = '/api/ai'

async function requestAi(payload) {
  let response

  try {
    response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error(
      'AI service is unreachable. For local usage, run through Vercel dev with GROQ_API_KEY configured.',
    )
  }

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(body?.error ?? 'AI request failed.')
  }

  return body
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

export async function explainCode({ code, language, title, context }) {
  if (!String(code ?? '').trim()) {
    throw new Error('Code is required for explanation.')
  }

  const body = await requestAi({
    action: 'explain',
    code,
    language,
    title,
    context,
  })

  if (!body?.result) {
    throw new Error('AI did not return an explanation.')
  }

  return normalizeResult(body.result)
}

export async function askSnipVaultAssistant(question) {
  const trimmed = String(question ?? '').trim()

  if (!trimmed) {
    throw new Error('Please add a question for the assistant.')
  }

  const body = await requestAi({
    action: 'assistant',
    question: trimmed,
  })

  const answer = String(body?.answer ?? '').trim()

  if (!answer) {
    throw new Error('Assistant response was empty.')
  }

  return answer
}
