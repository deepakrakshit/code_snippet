<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=220&color=0:00ff88,50:00c2ff,100:0f172a&text=SNIPVAULT&fontSize=72&fontColor=0b1020&fontAlignY=38&desc=Realtime%20Snippet%20Platform%20for%20Developers&descAlignY=60&descSize=18&animation=fadeIn" width="100%" />

[![Typing SVG](https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=20&duration=2600&pause=900&center=true&vCenter=true&repeat=true&width=900&lines=Built+for+Code+Sprint+2.0+at+NIET+College;AI+Explain+%7C+AI+Assistant+%7C+Live+Preview+%7C+Export+PNG;Supabase+Realtime+%2B+Groq+Llama-3.3-70B+Versatile)](https://github.com/deepakrakshit/code_snippet)

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=0b1020)
![Vite](https://img.shields.io/badge/Vite-8-7C3AED?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Realtime-3ECF8E?style=for-the-badge&logo=supabase&logoColor=062b1d)
![Groq](https://img.shields.io/badge/Groq-llama--3.3--70b--versatile-0f172a?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-111111?style=for-the-badge&logo=vercel&logoColor=white)

[![Live App](https://img.shields.io/badge/LIVE-Open%20SnipVault-00ff88?style=for-the-badge)](https://snipvault-44l4oiaws-deepakrakshits-projects.vercel.app)
[![Repository](https://img.shields.io/badge/GitHub-code__snippet-181717?style=for-the-badge&logo=github)](https://github.com/deepakrakshit/code_snippet)

</div>

---

## For Judges

This project was built as our working prototype for **CODE SPRINT 2.0 hosted at NIET College**.
The problem statement asked us to build a practical, developer-centric platform, and we delivered **SnipVault**: a realtime snippet sharing app with AI tools and production deployment.

### Team

- Deepak Rakshit: [https://github.com/deepakrakshit](https://github.com/deepakrakshit)
- Aryan Verma: [https://github.com/AryanVerma-cell](https://github.com/AryanVerma-cell)
- Samar Singh: [https://github.com/singhsamar-24](https://github.com/singhsamar-24)
- Shaswat Srivastav: [https://github.com/SHASWAT-SRIVASTAV](https://github.com/SHASWAT-SRIVASTAV)

---

## Project Snapshot

SnipVault is a full-stack code snippet platform where users can:

- Create and share snippet links instantly
- Browse a live feed and an explore vault with search
- Upvote snippets with realtime updates across devices
- Use AI for code explanation and assistant-style guidance
- Run live previews for HTML/CSS/JavaScript snippets
- Export snippet cards as PNG images

---

## Key Features

| Feature | Description |
|---|---|
| Realtime Snippet Feed | Backed by Supabase Realtime subscriptions |
| Explore Vault | Dedicated page with search by title, language, and id |
| AI Code Explain | Structured explanation, complexity, and improvements |
| AI Assistant | Prompt-based coding assistant integrated into app |
| Live Preview | Inline iframe rendering for HTML/CSS/JavaScript |
| Export as Image | Snippet card export as PNG via html2canvas |
| Device-wide Data | Supabase is the source of truth (no snippet local fallback) |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + React Router |
| UI | Tailwind CSS + Lucide icons |
| Syntax Highlighting | Prism-based rendering |
| Backend Data | Supabase Postgres + Realtime |
| AI Runtime | Groq API (`llama-3.3-70b-versatile`) via server endpoint |
| Deployment | Vercel |

---

## Architecture Notes

- Client-side data access is centralized in `src/services/snippetService.js`.
- AI calls are proxied through `api/ai.js` so secrets stay server-side.
- Live preview documents are built in `src/utils/livePreview.js`.
- Export generation is implemented on `src/pages/SnippetPage.jsx`.

---

## Database Setup (Supabase)

Run these scripts in the **same Supabase project** referenced by `VITE_SUPABASE_URL`.

1. `supabase/schema.sql`
2. `supabase/sample-data.sql` (optional seed)

### Expected table fields in `public.snippets`

- `id` (text)
- `title` (text)
- `language` (text)
- `code` (text)
- `upvotes` (integer)
- `createdAt` (timestamptz)

Compatibility note: The app also safely handles `created_at` if your table uses snake_case.

---

## Local Development

```bash
git clone https://github.com/deepakrakshit/code_snippet.git
cd code_snippet
npm install
```

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
GROQ_API_KEY=your-groq-api-key
```

Run app:

```bash
npm run dev
```

---

## Deployment (Vercel)

1. Push repository to GitHub
2. Import project in Vercel
3. Configure env vars for **Development**, **Preview**, and **Production**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`
4. Build command: `npm run build`
5. Output directory: `dist`

`vercel.json` is already configured for SPA route rewrites.

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Status and Roadmap

### Implemented

- Realtime snippet sync
- AI explain and AI assistant tools
- Explore page with search
- Live preview for web snippets
- PNG export for snippet cards
- Supabase-only snippet persistence

### Next

- User profiles and authentication
- Comments and collaboration layer
- Better snippet tagging and filtering
- Public API/read-only embed cards

---

## License

MIT

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=140&color=0:0f172a,40:00c2ff,100:00ff88&section=footer&animation=twinkling" width="100%" />

Built for CODE SPRINT 2.0 at NIET College by Team SnipVault.

</div>
