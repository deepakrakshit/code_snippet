import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Code2,
  Layers3,
  MessageSquareMore,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const highlights = [
  {
    value: '1 vault',
    label: 'Live snippet library with realtime updates',
  },
  {
    value: 'AI ready',
    label: 'Groq-powered explain and assistant tools',
  },
  {
    value: 'Judge-first',
    label: 'Built to demo cleanly, quickly, and memorably',
  },
]

const principles = [
  {
    icon: Code2,
    title: 'Code that feels collected, not dumped',
    description:
      'SnipVault focuses on beautiful presentation so every snippet looks worthy of review, sharing, and reuse.',
  },
  {
    icon: Bot,
    title: 'AI where it helps most',
    description:
      'Explain, explore, and ask follow-up questions without leaving the workflow.',
  },
  {
    icon: Layers3,
    title: 'A single source of truth',
    description:
      'Snippets live in Supabase, so the experience stays shared across devices and sessions.',
  },
  {
    icon: Sparkles,
    title: 'Presentation matters',
    description:
      'The interface is tuned to feel premium on first glance, which matters in a hackathon demo.',
  },
]

const journey = [
  {
    title: 'Capture',
    description:
      'Create a snippet with syntax highlighting, a title, and a clean language label.',
  },
  {
    title: 'Enrich',
    description:
      'Use AI to explain what the code does or ask the assistant for guidance.',
  },
  {
    title: 'Share',
    description:
      'Browse the vault, vote on useful snippets, and open the full snippet page.',
  },
  {
    title: 'Showcase',
    description:
      'Export a snippet as an image and present it beautifully in a submission or review.',
  },
]

function AboutPage() {
  return (
    <section className="space-y-6">
      <div className="hero-panel glass-panel rise-in overflow-hidden rounded-lg border border-vault-border/80 p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-vault-green">
              <Sparkles size={16} />
              About SnipVault
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-vault-text sm:text-5xl lg:text-6xl">
              A premium vault for code snippets, AI explanations, and demo-ready presentation.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-vault-muted sm:text-base">
              SnipVault was built to make snippets feel worth sharing. It combines
              polished code cards, realtime collaboration, and Groq-powered AI so
              the product is useful in practice and memorable on stage.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/vault"
                className="sheen inline-flex h-11 items-center gap-2 rounded-lg bg-vault-green px-4 text-sm font-bold text-[#001b0e] transition hover:-translate-y-0.5 hover:bg-[#35ffa0]"
              >
                Explore vault
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/ai"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-vault-cyan/40 bg-vault-cyan/10 px-4 text-sm font-bold text-vault-cyan transition hover:-translate-y-0.5 hover:border-vault-cyan hover:bg-vault-cyan/18"
              >
                <Bot size={17} />
                Try AI tools
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-vault-border bg-vault-panel-2/85 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <p className="text-2xl font-extrabold text-vault-text">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-vault-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        {principles.map((principle) => {
          const Icon = principle.icon

          return (
            <article
              key={principle.title}
              className="premium-card glass-panel rise-in rounded-lg p-5 transition duration-300 hover:-translate-y-1 hover:border-vault-green/50"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-vault-green/25 bg-vault-green/10 text-vault-green">
                  <Icon size={22} />
                </span>
                <div>
                  <h2 className="text-xl font-extrabold text-vault-text">{principle.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-vault-muted">{principle.description}</p>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="ai-panel rise-in rounded-lg p-6">
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.28em] text-vault-cyan">
            <MessageSquareMore size={14} />
            Our flow
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-vault-text">
            A simple product journey from idea to polished demo.
          </h2>
          <p className="mt-3 text-sm leading-7 text-vault-muted">
            The experience is intentionally short: create, explain, explore, and
            present. That keeps the app easy to understand for judges and fast to
            use for developers.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {journey.map((step, index) => (
            <article
              key={step.title}
              className="glass-panel rise-in rounded-lg p-5"
            >
              <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-vault-green">
                <BadgeCheck size={14} />
                Step {index + 1}
              </p>
              <h3 className="mt-3 text-lg font-extrabold text-vault-text">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-vault-muted">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hero-panel glass-panel rise-in rounded-lg p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-vault-amber">
              Built for the stage
            </p>
            <h2 className="mt-3 text-2xl font-extrabold text-vault-text sm:text-3xl">
              SnipVault is designed to impress quickly and hold attention.
            </h2>
          </div>
          <Link
            to="/faq"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-vault-border bg-vault-panel-2 px-4 text-sm font-bold text-vault-text transition hover:-translate-y-0.5 hover:border-vault-amber/60 hover:text-vault-amber"
          >
            Read the FAQ
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </section>
  )
}

export default AboutPage