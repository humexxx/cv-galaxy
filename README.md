# CV Galaxy

[![CI](https://github.com/humexxx/cv-galaxy/actions/workflows/ci.yml/badge.svg)](https://github.com/humexxx/cv-galaxy/actions/workflows/ci.yml)
[![Release](https://github.com/humexxx/cv-galaxy/actions/workflows/release.yml/badge.svg)](https://github.com/humexxx/cv-galaxy/actions/workflows/release.yml)

A modern platform to discover and share professional CVs. Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4 and a Supabase Postgres database accessed through Drizzle ORM.

## ✨ Features

- 🔍 **Smart Search** - Find CVs by name, title, skills, or keywords
- 🔐 **LinkedIn Sign-In** - Supabase Auth with the LinkedIn OIDC provider
- ✍️ **CV Editor** - Rich-text editing (Tiptap) with server-side HTML sanitization
- 🤖 **AI Chat** - Ask questions about a CV, powered by the OpenAI API
- 📄 **PDF Export** - Server-rendered PDFs via `puppeteer-core` + `@sparticuz/chromium-min`
- 🎨 **Modern UI** - shadcn/ui + Radix, responsive, with dark mode
- 🚀 **CI/CD** - GitHub Actions for lint/typecheck/build and semantic releases

## 🛠️ Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4, `tw-animate-css` |
| UI | shadcn/ui + Radix UI, Lucide icons, `next-themes` |
| Editor | Tiptap 3 |
| Database | Supabase Postgres via Drizzle ORM (`postgres` driver) |
| Auth | Supabase Auth (LinkedIn OIDC) |
| AI | OpenAI API |
| PDF | `puppeteer-core` + `@sparticuz/chromium-min` (serverless), `puppeteer` locally |
| Hosting | Vercel |
| CI/CD | GitHub Actions + semantic-release |

## 🚀 Getting Started

### Prerequisites

- Node.js **22.x** (matches CI and the Vercel runtime)
- A Supabase project (Postgres + Auth)
- An OpenAI API key

### Install

```bash
git clone https://github.com/humexxx/cv-galaxy.git
cd cv-galaxy
npm install
```

`npm install` runs `scripts/postinstall.mjs`, which repacks the Chromium payload
shipped by `@sparticuz/chromium` into `public/chromium-pack.tar` (used by the PDF
route in production). The script **fails the install** if it cannot produce a
valid archive. Set `SKIP_CHROMIUM_PACK=1` to opt out deliberately; the step is
also skipped automatically on production-only installs (`npm ci --omit=dev`),
where `@sparticuz/chromium` is not present.

### Configure environment

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Postgres connection string for the Supabase database. Used by the Drizzle client (`db/index.ts`) and by `drizzle-kit` for migrations, `db:push` and `db:studio`. |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL. Consumed by the browser and server Supabase clients and by the auth proxy. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous/publishable key used to create the Supabase Auth clients. Public by design — never put the service-role key here. |
| `OPENAI_API_KEY` | ✅ for AI chat | Server-only key for the OpenAI client behind `/api/chat`. The AI features fail without it; the rest of the app still works. |
| `NEXT_PUBLIC_BASE_URL` | Optional | Canonical origin used to build absolute URLs (OG images, auth redirects). Falls back to `VERCEL_URL`, then `http://localhost:3000`. |
| `VERCEL_URL` | Auto | Injected by Vercel — the current deployment's hostname. Used as a base-URL fallback and to resolve the Chromium pack. |
| `VERCEL_PROJECT_PRODUCTION_URL` | Auto | Injected by Vercel — the production hostname. Preferred source for the Chromium pack URL used by `/api/pdf`. |
| `VERCEL_ENV` | Auto | Injected by Vercel. When set, `/api/pdf` switches to the serverless Chromium path instead of local `puppeteer`. |
| `NODE_ENV` | Auto | Set by Next.js/Node. Gates verbose error details in API responses. |
| `SKIP_CHROMIUM_PACK` | Optional | Set to `1` to skip Chromium pack creation in `postinstall`. |

> Use placeholders in committed files. Never commit a real `.env` — it is gitignored.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📜 Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (CI runs it with `--max-warnings 0`) |
| `npm run db:generate` | Generate Drizzle migrations from `db/schema.ts` |
| `npm run db:migrate` | Apply migrations |
| `npm run db:push` | Push the schema straight to the database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed the database (`db/seed.ts`, reads `.env`) |
| `npm run deploy` / `npm run deploy:prod` | Deploy via the Vercel CLI |

Type checking is not wired to a script; run `npx tsc --noEmit`.

## 🏗️ Project Structure

```
cv-galaxy/
├── app/                   # Next.js App Router
│   ├── [username]/        # Public CV pages
│   ├── api/               # Route handlers (auth, chat, models, og, pdf, search, user, users)
│   ├── auth/              # Auth callback / sign-in routes
│   ├── cv/                # CV creation & editing
│   └── settings/          # User settings
├── components/            # React components (ui/ holds shadcn primitives)
├── db/                    # Drizzle schema, client, migrations and seed data
├── docs/                  # Additional setup docs (e.g. OPENAI_SETUP.md)
├── hooks/                 # Custom React hooks
├── lib/                   # env, Supabase clients, services, templates, utils
├── schemas/               # Zod validation schemas
├── scripts/               # postinstall.mjs (Chromium pack)
├── types/                 # Shared TypeScript types
├── public/                # Static assets, incl. chromium-pack.tar
└── proxy.ts               # Request proxy / session refresh
```

## 🚀 CI/CD

- **CI** (`.github/workflows/ci.yml`): runs on pushes to `develop`/`main` and on PRs targeting them. Lints with `--max-warnings 0`, type checks, then builds.
- **Release** (`.github/workflows/release.yml`): semantic-release on push to `main`, then merges `main` back into `develop`.
- **Deploys**: handled by the Vercel Git integration (production on `main`, previews on PRs).

See [CI_CD_README.md](.github/CI_CD_README.md) for setup details.

## 📋 Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning:

```bash
# Features (bumps MINOR version)
git commit -m "feat: add new search filter"

# Fixes (bumps PATCH version)
git commit -m "fix: resolve mobile layout issue"

# Breaking changes (bumps MAJOR version)
git commit -m "feat!: change API response format"

# Other types (no version bump)
git commit -m "chore: update dependencies"
```

See [CONVENTIONAL_COMMITS.md](.github/CONVENTIONAL_COMMITS.md) for the complete guide.

## 📝 Adding CVs

CVs live in the database, not in the repo. Sign in with LinkedIn and use the
in-app editor at `/cv/new`. For local development you can load sample data with
`npm run db:seed` (see `db/seed-data.ts`).

## 🤝 Contributing

Contributions are welcome! Please open a Pull Request against `develop`.

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- [CI/CD documentation](.github/CI_CD_README.md)
- [OpenAI setup](docs/OPENAI_SETUP.md)
- [Next.js documentation](https://nextjs.org/docs)
