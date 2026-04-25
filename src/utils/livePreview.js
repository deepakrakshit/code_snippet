const LIVE_PREVIEW_LANGUAGES = new Set(['html', 'css', 'javascript'])

const BASE_STYLE = `
html,
body {
  margin: 0;
  padding: 10px;
  min-height: 100%;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
  background: #0d1117;
  color: #f0f6fc;
}

.preview-shell {
  border: 1px solid #30363d;
  border-radius: 12px;
  background: linear-gradient(180deg, #111827, #0d1117);
  padding: 14px;
}

.preview-muted {
  margin: 0 0 10px;
  color: #8b949e;
  font-size: 13px;
}

#snipvault-console {
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid #30363d;
  background: #090d13;
  color: #b7f7d1;
  min-height: 160px;
  padding: 10px;
  white-space: pre-wrap;
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  line-height: 1.6;
}
`

function wrapDoc({ body, extraStyle = '', extraScript = '' }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${BASE_STYLE}${extraStyle}</style>
  </head>
  <body>
    ${body}
    ${extraScript}
  </body>
</html>`
}

function htmlPreviewDoc(code) {
  return wrapDoc({ body: code })
}

function javascriptPreviewDoc(code) {
  const escapedCode = code.replace(/<\/script>/gi, '<\\/script>')

  return wrapDoc({
    body: `<section class="preview-shell">
  <p class="preview-muted">Live JavaScript output</p>
  <pre id="snipvault-console">Console output appears here.</pre>
</section>`,
    extraScript: `<script>
const output = document.getElementById('snipvault-console');

function stringifyValue(value) {
  if (typeof value === 'string') {
    return value;
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function writeLine(type, values) {
  const prefix = type === 'error' ? '[error]' : '[log]';
  const line = values.map(stringifyValue).join(' ');
  output.textContent += '\\n' + prefix + ' ' + line;
}

const nativeLog = console.log.bind(console);
const nativeError = console.error.bind(console);

console.log = (...values) => {
  writeLine('log', values);
  nativeLog(...values);
};

console.error = (...values) => {
  writeLine('error', values);
  nativeError(...values);
};

window.addEventListener('error', (event) => {
  writeLine('error', [event.message]);
});

try {
  ${escapedCode}
} catch (error) {
  writeLine('error', [error.message]);
}
</script>`,
  })
}

function cssPreviewDoc(code) {
  return wrapDoc({
    body: `<section class="preview-shell">
  <p class="preview-muted">Live CSS output (sample markup)</p>
  <h2>SnipVault Preview</h2>
  <p>The styles below are rendered using your CSS snippet.</p>
  <button type="button">Preview Button</button>
</section>`,
    extraStyle: `\n${code}\n`,
  })
}

export function supportsLivePreview(language) {
  return LIVE_PREVIEW_LANGUAGES.has(language)
}

export function buildPreviewDocument({ language, code }) {
  if (!supportsLivePreview(language)) {
    return ''
  }

  if (language === 'html') {
    return htmlPreviewDoc(code)
  }

  if (language === 'css') {
    return cssPreviewDoc(code)
  }

  return javascriptPreviewDoc(code)
}
