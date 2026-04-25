export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', color: '#f7df1e' },
  { value: 'typescript', label: 'TypeScript', color: '#39d0ff' },
  { value: 'python', label: 'Python', color: '#00ff88' },
  { value: 'java', label: 'Java', color: '#ff8a65' },
  { value: 'csharp', label: 'C#', color: '#b392f0' },
  { value: 'go', label: 'Go', color: '#67e8f9' },
  { value: 'rust', label: 'Rust', color: '#ffcc66' },
  { value: 'php', label: 'PHP', color: '#c084fc' },
  { value: 'ruby', label: 'Ruby', color: '#ff6b8a' },
  { value: 'html', label: 'HTML', color: '#ff8a3d' },
  { value: 'css', label: 'CSS', color: '#58a6ff' },
  { value: 'sql', label: 'SQL', color: '#00ff88' },
  { value: 'bash', label: 'Bash', color: '#7ee787' },
  { value: 'json', label: 'JSON', color: '#ffcc66' },
  { value: 'markdown', label: 'Markdown', color: '#a5b4fc' },
]

export function getLanguageLabel(value) {
  return LANGUAGES.find((language) => language.value === value)?.label ?? value
}

export function getLanguageColor(value) {
  return LANGUAGES.find((language) => language.value === value)?.color ?? '#00ff88'
}
