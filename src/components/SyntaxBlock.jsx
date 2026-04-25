import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go'
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown'
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup'
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby'
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust'
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark'

SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('csharp', csharp)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('go', go)
SyntaxHighlighter.registerLanguage('html', markup)
SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('markdown', markdown)
SyntaxHighlighter.registerLanguage('php', php)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('ruby', ruby)
SyntaxHighlighter.registerLanguage('rust', rust)
SyntaxHighlighter.registerLanguage('sql', sql)
SyntaxHighlighter.registerLanguage('typescript', typescript)

function SyntaxBlock({ code, language, preview = false }) {
  return (
    <div className="overflow-hidden rounded-lg border border-vault-border/85 bg-[#10151d]">
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers={!preview}
        wrapLongLines
        customStyle={{
          margin: 0,
          minHeight: preview ? '182px' : '360px',
          maxHeight: preview ? '182px' : 'none',
          background: '#10151d',
          fontSize: preview ? '0.78rem' : '0.9rem',
          lineHeight: 1.65,
          padding: preview ? '1rem' : '1.25rem',
        }}
        codeTagProps={{
          style: {
            fontFamily:
              '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
          },
        }}
        lineNumberStyle={{
          color: '#6e7681',
          minWidth: '2.5em',
          paddingRight: '1em',
        }}
        PreTag={({ children, ...props }) => (
          <pre {...props} className="code-scrollbar overflow-auto">
            {children}
          </pre>
        )}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default SyntaxBlock
