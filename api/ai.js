import { Buffer } from 'node:buffer'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

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

function normalizeExplainResult(value) {
  return {
    explanation: String(value?.explanation ?? 'No explanation returned.').trim(),
    complexity: String(value?.complexity ?? 'Not applicable').trim(),
    suggestions: normalizeSuggestions(value?.suggestions),
  }
}

async function parseRequestBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body
  }

  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      throw new Error('Invalid JSON body.')
    }
  }

  const chunks = []

  for await (const chunk of req) {
    chunks.push(chunk)
  }

  if (!chunks.length) {
    return {}
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new Error('Invalid JSON body.')
  }
}

function buildExplainMessages({ title, language, code, context }) {
  return [
    {
      role: 'system',
      content:
        'You are an expert senior software engineer who explains code clearly. Return valid JSON only with keys: explanation, complexity, suggestions. explanation must be 2 to 5 concise sentences. complexity should be Big-O if relevant, otherwise "Not applicable". suggestions must be an array of 1 to 5 practical improvements.',
    },
    {
      role: 'user',
      content: [
        `Context: ${context ?? 'SnipVault code explain feature'}`,
        `Snippet title: ${title ?? 'Untitled snippet'}`,
        `Language: ${language ?? 'unknown'}`,
        'Explain this code for an intermediate developer and prioritize clarity over jargon.',
        '',
        code,
      ].join('\n'),
    },
  ]
}

function buildAssistantMessages(question) {
  return [
    {
      role: 'system',
      content:
        'You are the built-in SnipVault assistant. Answer only about using SnipVault. Product facts: Home page shows top snippets by upvotes; /ai has the AI assistant and paste-to-explain tool; snippet cards include an Explain button; /create makes a new snippet with title, language, code; /snippet/:id supports upvote, copy code, copy link, export image, and AI explain; /vault shows all snippets with search by title, language, and snippet ID; upvotes are one-per-browser using local protection. Reply in short practical steps (max 120 words). If asked about unrelated topics, politely steer back to SnipVault usage.',
    },
    {
      role: 'user',
      content: question,
    },
  ]
}

async function callGroq(messages, options = {}) {
  const groqApiKey = globalThis.process?.env?.GROQ_API_KEY

  if (!groqApiKey) {
    throw new Error('GROQ_API_KEY is not configured on the server.')
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: options.temperature ?? 0.2,
      max_tokens: options.maxTokens ?? 900,
      ...(options.json ? { response_format: { type: 'json_object' } } : {}),
      messages,
    }),
  })

  const responseBody = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(responseBody?.error?.message ?? 'Groq AI request failed.')
  }

  const content = responseBody?.choices?.[0]?.message?.content

  if (!content || typeof content !== 'string') {
    throw new Error('Groq AI returned an empty response.')
  }

  return content
}

async function runExplainAction(payload) {
  const code = String(payload?.code ?? '').trim()

  if (!code) {
    throw new Error('Code is required for explanation.')
  }

  const content = await callGroq(
    buildExplainMessages({
      title: payload?.title,
      language: payload?.language,
      code,
      context: payload?.context,
    }),
    { json: true },
  )

  const parsed = parseJsonValue(content)

  if (!parsed) {
    return normalizeExplainResult({ explanation: content })
  }

  return normalizeExplainResult(parsed)
}

async function runAssistantAction(payload) {
  const question = String(payload?.question ?? '').trim()

  if (!question) {
    throw new Error('Question is required for the assistant.')
  }

  const answer = await callGroq(buildAssistantMessages(question), {
    temperature: 0.35,
    maxTokens: 420,
  })

  return answer.trim()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  try {
    const payload = await parseRequestBody(req)
    const action = String(payload?.action ?? '').trim().toLowerCase()

    if (action === 'assistant') {
      const answer = await runAssistantAction(payload)
      return res.status(200).json({ answer })
    }

    if (action === 'explain') {
      const result = await runExplainAction(payload)
      return res.status(200).json({ result })
    }

    return res.status(400).json({ error: 'Unknown AI action.' })
  } catch (error) {
    const message = error?.message ?? 'AI request failed.'
    return res.status(500).json({ error: message })
  }
}
