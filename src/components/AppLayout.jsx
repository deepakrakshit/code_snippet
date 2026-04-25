import { Code2, Plus, Sparkles } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { isSupabaseConfigured } from '../lib/supabase'

function AppLayout() {
  return (
    <div className="min-h-svh text-vault-text">
      <header className="sticky top-0 z-30 border-b border-vault-border/80 bg-vault-bg/82 shadow-[0_16px_48px_rgba(1,4,9,0.28)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <NavLink
            to="/"
            className="group flex min-w-0 items-center gap-3 rounded-lg outline-none transition focus-visible:ring-4 focus-visible:ring-vault-green/15"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-vault-green/45 bg-vault-green/10 text-vault-green shadow-[0_0_28px_rgba(0,255,136,0.18)] transition group-hover:scale-105 group-hover:border-vault-green">
              <Code2 size={22} strokeWidth={2.4} />
            </span>
            <span className="min-w-0">
              <span className="block text-lg font-extrabold">SnipVault</span>
              <span className="block text-xs font-medium text-vault-muted">
                {isSupabaseConfigured ? 'Live vault' : 'Demo vault'}
              </span>
            </span>
          </NavLink>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hidden rounded-lg px-3 py-2 text-sm font-semibold transition sm:inline-flex ${
                  isActive
                    ? 'bg-vault-panel-2 text-vault-text'
                    : 'text-vault-muted hover:bg-vault-panel hover:text-vault-text'
                }`
              }
            >
              Top
            </NavLink>
            <NavLink
              to="/vault"
              className={({ isActive }) =>
                `hidden rounded-lg px-3 py-2 text-sm font-semibold transition sm:inline-flex ${
                  isActive
                    ? 'bg-vault-panel-2 text-vault-text'
                    : 'text-vault-muted hover:bg-vault-panel hover:text-vault-text'
                }`
              }
            >
              Explore
            </NavLink>
            <NavLink
              to="/ai"
              className={({ isActive }) =>
                `hidden rounded-lg px-3 py-2 text-sm font-semibold transition sm:inline-flex ${
                  isActive
                    ? 'bg-vault-panel-2 text-vault-text'
                    : 'text-vault-muted hover:bg-vault-panel hover:text-vault-text'
                }`
              }
            >
              AI
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hidden rounded-lg px-3 py-2 text-sm font-semibold transition lg:inline-flex ${
                  isActive
                    ? 'bg-vault-panel-2 text-vault-text'
                    : 'text-vault-muted hover:bg-vault-panel hover:text-vault-text'
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/faq"
              className={({ isActive }) =>
                `hidden rounded-lg px-3 py-2 text-sm font-semibold transition lg:inline-flex ${
                  isActive
                    ? 'bg-vault-panel-2 text-vault-text'
                    : 'text-vault-muted hover:bg-vault-panel hover:text-vault-text'
                }`
              }
            >
              FAQ
            </NavLink>
            <NavLink
              to="/create"
              className="sheen inline-flex h-10 items-center gap-2 rounded-lg bg-vault-green px-4 text-sm font-bold text-[#001b0e] shadow-[0_14px_34px_rgba(0,255,136,0.18)] transition hover:-translate-y-0.5 hover:bg-[#35ffa0] hover:shadow-[0_18px_42px_rgba(0,255,136,0.24)] focus:outline-none focus:ring-4 focus:ring-vault-green/20"
            >
              <Plus size={18} />
              <span>New Snip</span>
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Outlet />
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-col gap-4 border-t border-vault-border/70 px-4 py-6 text-sm text-vault-muted sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <span>SnipVault</span>
          <NavLink to="/about" className="transition hover:text-vault-text">
            About
          </NavLink>
          <NavLink to="/faq" className="transition hover:text-vault-text">
            FAQ
          </NavLink>
        </div>
        <span className="inline-flex items-center gap-2">
          <Sparkles size={16} className="text-vault-green" />
          Built for sharp demos
        </span>
      </footer>
    </div>
  )
}

export default AppLayout
