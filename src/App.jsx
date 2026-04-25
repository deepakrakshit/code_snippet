import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'

const CreatePage = lazy(() => import('./pages/CreatePage'))
const ExplorePage = lazy(() => import('./pages/ExplorePage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const SnippetPage = lazy(() => import('./pages/SnippetPage'))

function PageFallback() {
  return (
    <div className="glass-panel min-h-64 animate-pulse rounded-lg p-6">
      <div className="h-7 w-56 rounded bg-vault-border" />
      <div className="mt-5 h-4 w-72 max-w-full rounded bg-vault-border/80" />
      <div className="mt-8 h-40 rounded-lg bg-vault-bg" />
    </div>
  )
}

function suspended(element) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={suspended(<HomePage />)} />
        <Route path="vault" element={suspended(<ExplorePage />)} />
        <Route path="create" element={suspended(<CreatePage />)} />
        <Route path="snippet/:id" element={suspended(<SnippetPage />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
