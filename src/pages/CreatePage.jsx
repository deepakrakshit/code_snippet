import { Save, WandSparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LANGUAGES } from '../data/languages'
import { createSnippet } from '../services/snippetService'

const starterCode = `function greetVault(name) {
  return \`Ship it, \${name}.\`
}

console.log(greetVault('SnipVault'))`

function CreatePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    language: 'javascript',
    code: starterCode,
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim() || !form.code.trim()) {
      setError('Title and code are required.')
      return
    }

    try {
      setError('')
      setIsSubmitting(true)
      const snippet = await createSnippet(form)
      navigate(`/snippet/${snippet.id}`)
    } catch (submitError) {
      setError(submitError.message ?? 'Unable to save snippet.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-4xl">
      <div className="hero-panel glass-panel rise-in rounded-lg p-5 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-vault-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-vault-green">Create</p>
            <h1 className="mt-2 text-3xl font-extrabold text-vault-text sm:text-4xl">
              New Snippet
            </h1>
          </div>
          <span className="inline-flex size-12 items-center justify-center rounded-lg border border-vault-green/40 bg-vault-green/10 text-vault-green shadow-[0_0_28px_rgba(0,255,136,0.16)]">
            <WandSparkles size={23} />
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-vault-text">
              Title
            </span>
            <input
              className="input-field h-12 px-4"
              name="title"
              value={form.title}
              onChange={updateField}
              placeholder="Debounced search hook"
              maxLength={90}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-vault-text">
              Language
            </span>
            <select
              className="input-field h-12 px-4"
              name="language"
              value={form.language}
              onChange={updateField}
            >
              {LANGUAGES.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-vault-text">
              Code
            </span>
            <textarea
              className="input-field code-scrollbar min-h-[360px] resize-y px-4 py-4 text-sm leading-7"
              name="code"
              value={form.code}
              onChange={updateField}
              spellCheck="false"
            />
          </label>

          {error ? (
            <p className="rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="sheen inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-vault-green px-5 text-sm font-extrabold text-[#001b0e] shadow-[0_14px_34px_rgba(0,255,136,0.18)] transition hover:-translate-y-0.5 hover:bg-[#35ffa0] hover:shadow-[0_18px_42px_rgba(0,255,136,0.24)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <Save size={18} />
              {isSubmitting ? 'Saving...' : 'Save Snippet'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CreatePage
