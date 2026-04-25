<div align="center">

<!-- ANIMATED BANNER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00FF88,100:00b4d8&height=200&section=header&text=SnipVault&fontSize=80&fontColor=0d1117&fontAlignY=38&desc=Code%20snippets.%20Shared.%20Instantly.&descAlignY=60&descSize=20&descColor=0d1117&animation=fadeIn" width="100%"/>

<!-- LOGO / HERO -->

```
███████╗███╗   ██╗██╗██████╗ ██╗   ██╗ █████╗ ██╗   ██╗██╗  ████████╗
██╔════╝████╗  ██║██║██╔══██╗██║   ██║██╔══██╗██║   ██║██║  ╚══██╔══╝
███████╗██╔██╗ ██║██║██████╔╝██║   ██║███████║██║   ██║██║     ██║   
╚════██║██║╚██╗██║██║██╔═══╝ ╚██╗ ██╔╝██╔══██║██║   ██║██║     ██║   
███████║██║ ╚████║██║██║      ╚████╔╝ ██║  ██║╚██████╔╝███████╗██║   
╚══════╝╚═╝  ╚═══╝╚═╝╚═╝       ╚═══╝  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝   
```

<br/>

> **Share code. Get upvoted. Build in public.**  
> A blazing-fast, production-grade snippet sharing platform — syntax highlighted, realtime, and beautiful.

<br/>

<!-- BADGES ROW 1 -->
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)

<!-- BADGES ROW 2 -->
![License](https://img.shields.io/badge/License-MIT-00FF88?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-ff69b4?style=for-the-badge)
![Made with Love](https://img.shields.io/badge/Made%20with-Love%20%26%20Caffeine-red?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-00FF88?style=for-the-badge)

<br/>

[![⚡ Live Demo](https://img.shields.io/badge/⚡%20LIVE%20DEMO-Try%20it%20Now-00FF88?style=for-the-badge)](https://snipvault.vercel.app)
[![⭐ Star this repo](https://img.shields.io/github/stars/deepakrakshit/snipvault?style=for-the-badge&color=yellow)](https://github.com/deepakrakshit/snipvault)

</div>

---

<div align="center">

## ✦ What is SnipVault?

</div>

**SnipVault** is not just another paste site.  
It's a developer-first, realtime code sharing platform where your snippets get the spotlight they deserve — with gorgeous syntax highlighting across 100+ languages, live upvote feeds powered by Supabase Realtime, and a shareable link ready the moment you hit submit.

Think **GitHub Gist** met **Product Hunt** and they had a fast, beautiful baby.

---

<div align="center">

## ✦ Feature Showcase

</div>

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│   ⚡  REALTIME FEED       Snippets update live via Supabase      │
│   🎨  SYNTAX HIGHLIGHT    100+ languages with Prism.js           │
│   👍  UPVOTE SYSTEM       Spam-protected. One vote per snippet.  │
│   🔗  INSTANT SHARING     Unique URL generated on every submit   │
│   📋  COPY TO CLIPBOARD   One click. Done.                       │
│   🌙  DARK NATIVE UI      Because every dev lives in the dark    │
│   🔌  DEMO MODE           Works offline, no Supabase needed      │
│   📱  FULLY RESPONSIVE    Desktop to mobile, flawless            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

<div align="center">

## ✦ Tech Stack

</div>

| Layer | Technology | Purpose |
|---|---|---|
| ⚛️ **Frontend** | React 18 + Vite 5 | Blazing fast UI & dev server |
| 💅 **Styling** | Tailwind CSS | Utility-first, zero runtime CSS |
| 🗄️ **Backend** | Supabase (Postgres) | Database + Auth + Realtime |
| 🔴 **Realtime** | Supabase Realtime | Live upvote & feed updates |
| 🎨 **Highlighting** | Prism.js | Syntax highlighting, 100+ langs |
| 🔀 **Routing** | React Router v6 | SPA navigation |
| 🚀 **Deployment** | Vercel | Edge-deployed, global CDN |
| 🛡️ **Spam Guard** | localStorage voting | One vote per device per snippet |

---

<div align="center">

## ✦ Project Structure

</div>

```bash
snipvault/
│
├── 📁 public/
│   └── favicon.svg
│
├── 📁 src/
│   ├── 📁 components/          # Reusable UI building blocks
│   │   ├── AppLayout.jsx        # Global layout wrapper
│   │   ├── SnippetCard.jsx      # Feed card component
│   │   ├── StatusMessage.jsx    # Loading / error states
│   │   └── SyntaxBlock.jsx      # Prism-powered code renderer
│   │
│   ├── 📁 data/
│   │   └── languages.js         # Supported language registry
│   │
│   ├── 📁 lib/
│   │   └── supabase.js          # Supabase client init
│   │
│   ├── 📁 pages/                # Route-level page components
│   │   ├── CreatePage.jsx       # Snippet creation form
│   │   ├── HomePage.jsx         # Live feed sorted by upvotes
│   │   └── SnippetPage.jsx      # Full snippet + upvote view
│   │
│   ├── 📁 services/
│   │   └── snippetService.js    # All DB queries in one place
│   │
│   ├── 📁 utils/
│   │   ├── format.js            # Date, string helpers
│   │   └── votes.js             # Vote tracking logic
│   │
│   ├── App.jsx                  # Router config
│   ├── index.css                # Tailwind base
│   └── main.jsx                 # App entry point
│
├── 📁 supabase/
│   ├── schema.sql               # Table definitions + RLS
│   └── sample-data.sql          # Seed data for testing
│
├── .env.example                 # Environment variable template
├── vercel.json                  # SPA fallback routing fix
├── package.json
└── vite.config.js
```

---

<div align="center">

## ✦ Database Schema

</div>

```sql
-- Every snippet lives here
CREATE TABLE snippets (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  language    TEXT        NOT NULL,
  code        TEXT        NOT NULL,
  upvotes     INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Realtime enabled on this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.snippets;
```

---

<div align="center">

## ✦ Quick Start

</div>

### 1 · Clone & Install

```bash
git clone https://github.com/deepakrakshit/snipvault.git
cd snipvault
npm install
```

### 2 · Set Up Supabase

```bash
# Create your project at https://supabase.com
# Then run these in the SQL editor — in order:

supabase/schema.sql        # Creates the snippets table
supabase/sample-data.sql   # Seeds test snippets
```

### 3 · Configure Environment

```bash
cp .env.example .env.local
```

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

> **No Supabase yet?** Just skip this step. SnipVault runs in **local demo mode** automatically — full UI, no backend needed.

### 4 · Run Locally

```bash
npm run dev
```

Open the URL Vite prints. You're live. 🚀

---

<div align="center">

## ✦ Deploy to Vercel

</div>

```
1.  Push to GitHub
2.  Import project at vercel.com/new
3.  Framework preset  →  Vite
4.  Build command     →  npm run build
5.  Output dir        →  dist
6.  Add env vars      →  VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
7.  Hit Deploy
```

> `vercel.json` is already configured so `/snippet/:id` routes don't 404 after page refresh.

---

<div align="center">

## ✦ Available Scripts

</div>

| Command | Action |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint across the project |

---

<div align="center">

## ✦ Roadmap

</div>

```
 ✅  Realtime upvote feed
 ✅  Syntax highlighting — 100+ languages
 ✅  Shareable snippet URLs
 ✅  Copy code + copy link
 ✅  Spam-protected voting
 ✅  Local demo mode
 ✅  Vercel SPA routing fix

 🔲  User auth + profiles (Supabase Auth)
 🔲  Snippet search + tag filtering
 🔲  Comments on snippets
 🔲  Markdown description field
 🔲  GitHub import — paste a gist URL
 🔲  Embed widget (iframe-ready snippet view)
 🔲  Dark/light theme toggle
```

---

<div align="center">

## ✦ Contributing

</div>

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

```bash
# Standard fork → branch → PR flow
git checkout -b feature/your-feature-name
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
```

---

<div align="center">

## ✦ License

</div>

<div align="center">

MIT © [Deepak Rakshit](https://github.com/deepakrakshit)  
Built with purpose. Deployed with pride.

<br/>

---

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00b4d8,100:00FF88&height=120&section=footer&animation=fadeIn" width="100%"/>

*If this saved you time, drop a ⭐ — it means more than you think.*

</div>
