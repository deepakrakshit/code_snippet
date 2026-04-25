const VOTE_STORAGE_KEY = 'snipvault:voted-snippets'

function readVotes() {
  try {
    return JSON.parse(localStorage.getItem(VOTE_STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function writeVotes(ids) {
  localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify([...new Set(ids)]))
}

export function hasVoted(snippetId) {
  return readVotes().includes(snippetId)
}

export function markVoted(snippetId) {
  writeVotes([...readVotes(), snippetId])
}

export function unmarkVoted(snippetId) {
  writeVotes(readVotes().filter((id) => id !== snippetId))
}
