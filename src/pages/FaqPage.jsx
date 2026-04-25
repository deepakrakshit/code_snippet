import {
  ArrowRight,
  CircleHelp,
  Code2,
  MessageSquareMore,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const faqItems = [
  {
    question: 'What is SnipVault?',
    answer:
      'SnipVault is a polished code snippet vault where users can create, explore, explain, vote on, and share snippets with a judge-friendly presentation layer.',
  },
  {
    question: 'How does the AI helper work?',
    answer:
      'The app sends code or questions to the server-side Groq integration, then returns a structured explanation or assistant response without exposing the API key in the browser.',
  },
  {
    question: 'Does the vault sync across devices?',
    answer:
      'Yes. Snippets are stored in Supabase and loaded from the live database, so they appear consistently across devices and browsers.',
  },
  {
    question: 'Can I preview code before opening the full page?',
    answer:
      'Yes. The feed shows syntax-highlighted previews and the snippet page includes a live preview for supported HTML, CSS, and JavaScript snippets.',
  },
  {
    question: 'Why does the app feel focused on presentation?',
    answer:
      'Because hackathon judges and collaborators usually decide quickly. The UI is built to make the product understandable, premium, and memorable in a short demo.',
  },
  {
    question: 'What can I do after creating a snippet?',
    answer:
      'You can share it, open it from the vault, ask AI to explain it, vote on useful snippets, and export a visual version for demos or submissions.',
  },
]

function FaqPage() {
  return (
    <section className="space-y-6">
      <div className="hero-panel glass-panel rise-in rounded-lg border border-vault-border/80 p-6 sm:p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-vault-cyan">
              <CircleHelp size={16} />
              FAQ
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-vault-text sm:text-5xl lg:text-6xl">
              Clear answers for judges, users, and curious developers.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-vault-muted sm:text-base">
              This page covers the product story, how the AI works, and why the
              vault behaves the way it does. It is short by design so it is easy to
              skim during a live review.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-lg border border-vault-border bg-vault-panel-2/85 p-4">
              <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-vault-green">
                <Wand2 size={14} />
                AI powered
              </p>
              <p className="mt-2 text-sm leading-6 text-vault-muted">
                Explain code and ask questions through the integrated assistant.
              </p>
            </div>
            <div className="rounded-lg border border-vault-border bg-vault-panel-2/85 p-4">
              <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-vault-amber">
                <Code2 size={14} />
                Shared vault
              </p>
              <p className="mt-2 text-sm leading-6 text-vault-muted">
                Snippets stay synced through Supabase instead of local-only storage.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="grid gap-4">
        {faqItems.map((item) => (
          <details
            key={item.question}
            className="premium-card glass-panel rise-in rounded-lg border border-vault-border p-5 open:border-vault-green/50"
          >
            <summary className="cursor-pointer list-none text-lg font-extrabold text-vault-text outline-none transition hover:text-vault-green focus-visible:text-vault-green [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                <span>{item.question}</span>
                <Sparkles size={18} className="shrink-0 text-vault-green" />
              </span>
            </summary>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-vault-muted">
              {item.answer}
            </p>
          </details>
        ))}
      </section>

      <section className="ai-panel rise-in rounded-lg p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.28em] text-vault-cyan">
              <MessageSquareMore size={14} />
              Need more context?
            </p>
            <h2 className="mt-3 text-2xl font-extrabold text-vault-text sm:text-3xl">
              Use the AI tools or jump back into the vault.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/ai"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-vault-cyan/40 bg-vault-cyan/10 px-4 text-sm font-bold text-vault-cyan transition hover:-translate-y-0.5 hover:border-vault-cyan hover:bg-vault-cyan/18"
            >
              Try AI tools
              <ArrowRight size={17} />
            </Link>
            <Link
              to="/vault"
              className="sheen inline-flex h-11 items-center gap-2 rounded-lg bg-vault-green px-4 text-sm font-bold text-[#001b0e] transition hover:-translate-y-0.5 hover:bg-[#35ffa0]"
            >
              Open vault
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </section>
  )
}

export default FaqPage