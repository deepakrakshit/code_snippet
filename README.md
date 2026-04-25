# SnipVault

SnipVault is a production-ready snippet sharing app built with React, Vite, Tailwind CSS, Supabase, React Router, and Prism syntax highlighting.

## Folder Structure

```txt
.
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AppLayout.jsx
│   │   ├── SnippetCard.jsx
│   │   ├── StatusMessage.jsx
│   │   └── SyntaxBlock.jsx
│   ├── data/
│   │   └── languages.js
│   ├── lib/
│   │   └── supabase.js
│   ├── pages/
│   │   ├── CreatePage.jsx
│   │   ├── HomePage.jsx
│   │   └── SnippetPage.jsx
│   ├── services/
│   │   └── snippetService.js
│   ├── utils/
│   │   ├── format.js
│   │   └── votes.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── supabase/
│   ├── sample-data.sql
│   └── schema.sql
├── .env.example
├── vercel.json
├── package.json
└── vite.config.js
```

## Features

- Home feed sorted by upvotes, with live refresh through Supabase Realtime.
- Create page with title, language, and monospace code editor.
- Snippet detail page with full syntax highlighting, upvote animation, copy code, and copy link.
- Basic spam protection with localStorage-based one-vote-per-snippet tracking.
- Local demo mode when Supabase env vars are missing, so the UI still works before backend setup.

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Run `supabase/sample-data.sql` for testing data.
5. Copy your Project URL and anon public key from Project Settings > API.
6. Create `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

If `alter publication supabase_realtime add table public.snippets;` reports that the table is already a member, the realtime setup is already done.

## Local Development

```bash
npm install
npm run dev
```

Open the Vite URL printed in the terminal.

## Database Shape

```js
{
  id: 'string',
  title: 'string',
  language: 'string',
  code: 'string',
  upvotes: 0,
  createdAt: 'timestamp'
}
```

## Deployment To Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Deploy.

`vercel.json` is included so `/snippet/:id` works after refresh.

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run preview
```
