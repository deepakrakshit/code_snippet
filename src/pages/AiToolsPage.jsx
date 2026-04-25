import { Bot, Code2, MessageSquare, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { LANGUAGES } from '../data/languages'
import { askSnipVaultAssistant, explainCode } from '../services/aiExplainService'

function AiToolsPage() {
  const [assistantQuestion, setAssistantQuestion] = useState('')
  const [assistantAnswer, setAssistantAnswer] = useState('')
  const [assistantError, setAssistantError] = useState('')
  const [assistantLoading, setAssistantLoading] = useState(false)
  const [quickExplainCode, setQuickExplainCode] = useState('')
  const [quickExplainLanguage, setQuickExplainLanguage] = useState('javascript')
  const [quickExplainResult, setQuickExplainResult] = useState(null)
  const [quickExplainError, setQuickExplainError] = useState('')
  const [quickExplainLoading, setQuickExplainLoading] = useState(false)

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
        title: 'AI tools quick explain',
        language: quickExplainLanguage,
        code: quickExplainCode,
        context: 'AI tools page quick explain panel',
      })
      setQuickExplainResult(result)
    } catch (nextError) {
      setQuickExplainError(nextError.message ?? 'Unable to explain code right now.')
    } finally {
      setQuickExplainLoading(false)
    }
  }

  return (
    <section className="space-y-5">
      <div className="hero-panel glass-panel rise-in rounded-lg p-5 sm:p-6">
        <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase text-vault-cyan">
          <Sparkles size={16} />
          AI Tools
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-vault-text sm:text-5xl">
          Assistant and code explain
        </h1>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <AssistantPanel
          assistantQuestion={assistantQuestion}
          setAssistantQuestion={setAssistantQuestion}
          assistantAnswer={assistantAnswer}
          assistantError={assistantError}
          assistantLoading={assistantLoading}
          onAssistantSubmit={handleAssistantSubmit}
        />
        <ExplainPanel
          quickExplainCode={quickExplainCode}
          setQuickExplainCode={setQuickExplainCode}
          quickExplainLanguage={quickExplainLanguage}
          setQuickExplainLanguage={setQuickExplainLanguage}
          quickExplainResult={quickExplainResult}
          quickExplainError={quickExplainError}
          quickExplainLoading={quickExplainLoading}
          onQuickExplainSubmit={handleQuickExplainSubmit}
        />
      </div>
    </section>
  )
}

function AssistantPanel({
  assistantQuestion,
  setAssistantQuestion,
  assistantAnswer,
  assistantError,
  assistantLoading,
  onAssistantSubmit,
}) {
  const promptSuggestions = [
    'How do I create a snippet?',
    'How do I share a snippet?',
    'How do upvotes work?',
  ]

  return (
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
  )
}

function ExplainPanel({
  quickExplainCode,
  setQuickExplainCode,
  quickExplainLanguage,
  setQuickExplainLanguage,
  quickExplainResult,
  quickExplainError,
  quickExplainLoading,
  onQuickExplainSubmit,
}) {
  return (
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
          className="input-field code-scrollbar min-h-[220px] resize-y px-4 py-3 text-sm leading-7"
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
        <ExplainResult result={quickExplainResult} accent="green" />
      ) : null}
    </section>
  )
}

function ExplainResult({ result, accent = 'green' }) {
  const accentClass = accent === 'cyan' ? 'text-vault-cyan' : 'text-vault-green'

  return (
    <div className="mt-4 space-y-4 rounded-lg border border-vault-border bg-vault-bg/60 px-4 py-3 text-sm leading-7 text-vault-muted">
      <div>
        <p className={`text-xs font-bold uppercase tracking-wide ${accentClass}`}>
          Explanation
        </p>
        <p className="mt-1 text-vault-text/95">{result.explanation}</p>
      </div>

      <div>
        <p className={`text-xs font-bold uppercase tracking-wide ${accentClass}`}>
          Time Complexity
        </p>
        <p className="mt-1 text-vault-text/95">{result.complexity}</p>
      </div>

      <div>
        <p className={`text-xs font-bold uppercase tracking-wide ${accentClass}`}>
          Suggestions
        </p>
        {result.suggestions.length ? (
          <div className="mt-2 space-y-2">
            {result.suggestions.map((suggestion, index) => (
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
  )
}

export default AiToolsPage
