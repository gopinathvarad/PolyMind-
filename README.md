# PolyMind

PolyMind is an AI model comparison and chat platform. It lets you sign in, create chat sessions, select multiple AI models, and view their responses side‑by‑side in real time. It’s built for researchers, engineers, and curious users who want to quickly benchmark prompts across leading LLMs.

## What you can do with PolyMind

- **Compare multiple models at once**: View up to 4 model responses in parallel.
- **Run faster prompt iterations**: Models stream responses concurrently for quick side‑by‑side review.
- **Stay organized**: Authenticated chat sessions are saved with history you can revisit.
- **Copy easily**: Copy any individual response with one click.
- **Use modern UX**: Responsive, dark‑mode friendly interface.

## Models supported

- ChatGPT 5 (OpenAI)
- Claude Sonnet 4 (Anthropic)
- Gemini 2.5 Pro (Google)
- DeepSeek Chat (DeepSeek)

## Tech stack

- Next.js 15 (App Router) + React 19
- TypeScript
- Tailwind CSS 4
- Supabase (Auth + Postgres + RLS)
- OpenRouter (unified access to multiple AI models)
- Vercel AI SDK (`ai`)
- Lucide React (icons)

## Architecture at a glance

- `app/` routes power the UI and server actions.
- `app/api/chat/route.ts` streams model responses via OpenRouter.
- Supabase manages auth and data for `users`, `chat_sessions`, and `messages` with RLS.
- Client selects models and sends prompts; server fans out to selected providers and streams results.

---

## The problem PolyMind solves

Teams adopting LLMs struggle to pick the right model and prompt under constraints of quality, cost, latency, and consistency. Evaluations are often ad‑hoc, manual, and slow, which leads to expensive guesswork and production regressions.

| Industry challenge                           | Impact                            | How PolyMind helps                                        | What you can track                       |
| -------------------------------------------- | --------------------------------- | --------------------------------------------------------- | ---------------------------------------- |
| Model selection is fragmented across vendors | Slow evaluations, vendor lock‑in  | One UI to query multiple providers via OpenRouter         | Response quality, failure modes          |
| Prompt iterations are manual and serial      | Days of trial‑and‑error           | Parallel, side‑by‑side responses for fast comparison      | Win rates per prompt version             |
| Hard to balance quality vs cost vs latency   | Surprising bills and slow UX      | Compare models with the same prompt and measure tradeoffs | Tokens, response time, perceived quality |
| Poor reproducibility of experiments          | Inconsistent results, regressions | Authenticated sessions with saved history                 | Versioned prompts and model choices      |
| Sharing findings is tedious                  | Knowledge silos                   | Copy responses and share links to sessions                | Team review efficiency                   |

Who benefits:

- Product and research teams choosing a default LLM
- Prompt engineers iterating on prompts/system messages
- Engineering leads tracking cost/latency and maintaining quality bars

---

## Setup and installation

### Prerequisites

- Node.js 18+
- An OpenRouter API key (create one at `https://openrouter.ai/keys`)
- A Supabase project with URL and anon key

### 1) Clone and install

```bash
git clone <your-repo-url>
cd polymind
npm install
```

### 2) Configure environment variables

Create a `.env.local` file in the project root and add:

```env
# OpenRouter
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Supabase (client-side usage)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3) Set up Supabase (database + auth)

Follow the step‑by‑step guide in `SUPABASE_SETUP.md`. It covers:

- Creating `users`, `chat_sessions`, and `messages` tables
- Enabling Row Level Security and policies
- Configuring auth settings (Site URL and Redirect URLs)

Quick start (summary):

1. Open your Supabase project → Settings → API to copy URL and anon key.
2. Paste them into `.env.local` as shown above.
3. In Supabase SQL editor, run the SQL from the migrations described in `SUPABASE_SETUP.md` to create tables and policies.
4. In Authentication → Settings, set Site URL to `http://localhost:3000` and add `http://localhost:3000/**` to Redirect URLs for development.

### 4) Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## Usage

1. Sign up or sign in.
2. Start a new chat session.
3. Select models to compare.
4. Enter your prompt and send.
5. Review, copy, and iterate on responses.

---

## Project structure

```
├── app/
│   ├── (protected)/
│   │   ├── chat/[sessionId]/page.tsx
│   │   ├── history/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   └── chat/route.ts
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── layout.tsx
│   └── middleware.ts
├── components/
│   ├── AuthModal.tsx
│   ├── MessageInput.tsx
│   ├── ModelSelector.tsx
│   └── ResponseColumn.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── ai-models.ts
│   ├── auth.ts
│   ├── database.ts
│   ├── openrouter.ts
│   └── supabase.ts
├── supabase/
│   └── migrations/
│       ├── 001_create_users_table.sql
│       ├── 002_create_chat_sessions_table.sql
│       └── 003_create_messages_table.sql
└── types/
    └── ai.ts
```

---

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Run ESLint

---

## Troubleshooting

- Auth errors: verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` and Supabase Site/Redirect URLs.
- Database/RLS issues: confirm you ran all SQL migrations and policies from `SUPABASE_SETUP.md`.
- Model errors: ensure `OPENROUTER_API_KEY` is valid and has access to the selected models.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Open a pull request

## License

MIT
