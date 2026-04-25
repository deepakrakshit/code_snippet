function StatusMessage({ title, message, action }) {
  return (
    <div className="hero-panel glass-panel rise-in flex min-h-64 flex-col items-center justify-center rounded-lg px-6 py-12 text-center">
      <h2 className="text-2xl font-bold text-vault-text">{title}</h2>
      {message ? (
        <p className="mt-3 max-w-xl text-sm leading-6 text-vault-muted">
          {message}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

export default StatusMessage
