# Palette — Recommended Tech Stack (2026)

*Based on `PRD.md`. Optimized for: MVP speed, free/cheap tiers, and reuse of your existing monorepo + auth patterns from prior projects, while picking up new resume-worthy pieces (pgvector, recsys logic) where the PRD calls for them.*

---

## 1. Frontend

| Choice | Version / Notes |
|---|---|
| **Next.js (App Router)** | v16.x — current stable line as of mid-2026, built on Turbopack by default, React 19.2 |
| **TypeScript** | strict mode on |
| **Tailwind CSS v4** | matches your existing preference/config from DevBoard |
| **Framer Motion** | swipe-card gestures + the radar-chart "palette evolving" animation |
| **Recharts or a custom SVG radar** | for the 6-axis Palette Evolution chart |

**Why Next.js over plain Vite/React here (unlike DevBoard):** the PRD explicitly leans on SSR for shareable, OG-image-rich quiz-result pages — that's a real driver of the "virality" goal in section 3, and Vite/CSR can't produce server-rendered OG meta tags per-result the same way. This is one case where the PRD's stack choice is correct and worth keeping even though it differs from your usual React+Vite setup — it's also a good excuse to get Next.js/App Router on your resume alongside your Vite experience.

---

## 2. Backend

| Choice | Version / Notes |
|---|---|
| **Node.js + Express + TypeScript** | MERN-style REST API, matching your existing pattern from DevBoard/PrepIQ — Axios on the frontend with `Authorization: Bearer` headers, same as your usual working style |
| **Zod** | request validation on the Express routes, especially for the swipe/vector payloads which change shape often early on |
| **npm** | package manager across the monorepo |
| **Turborepo** | monorepo orchestration exactly as the PRD lays out (`apps/web`, `apps/api`, `apps/worker`, `packages/ui`, `packages/quiz-logic`, `packages/types`) |

**Note on "MERN":** the PRD's DB choice (Postgres + pgvector) stays — see section 3 below. So this is really the **E + R + N** of MERN (Express, React via Next.js, Node) with Neon/Postgres standing in for Mongo, since native vector similarity search (`pgvector`'s `<=>` operator) isn't something MongoDB gives you as cleanly for this use case.

---

## 3. Database

| Choice | Notes |
|---|---|
| **PostgreSQL + `pgvector`** | Keep this from the PRD — it's genuinely the right call, not just a trendy pick. Your color vectors *are* embeddings, and `pgvector`'s `<=>` cosine-distance operator replaces hand-rolled similarity loops with an indexed query (`ORDER BY color_vector <=> tag_vector LIMIT N`) |
| **Neon** (Postgres host) | Neon supports the `pgvector` extension on its free tier — reuse the same provider you're already using for DevBoard, just enable the extension on this project's branch |
| **Prisma** (v6) | for `users`, `games`, swipe-history tables; Prisma doesn't have first-class `pgvector` column types, so define the vector column via a raw migration (`vector(6)`) and query it with `$queryRaw` for the similarity search — everything else (auth tables, game metadata, swipe logs) stays in normal Prisma models |

**On dropping Redis for MVP:** the PRD uses Redis to cache the active swipe deck per session and rate-limit swipe writes. For MVP, skip it — query Postgres directly for the deck (pgvector similarity search is already fast at MVP catalog size) and do simple in-memory or Postgres-based rate-limiting on the Express side instead. Move Redis to the future-improvements list (section 10) and pick it up once you're comfortable with it or once deck-query latency actually becomes a problem.

**Why not skip pgvector for MVP simplicity:** you could compute cosine similarity in application code over a small in-memory catalog (a few hundred games), and honestly that's a legitimate MVP shortcut if you're short on time. But since the PRD frames this as *the* key architectural choice and a portfolio signal (section 4, goal 4), keeping it is worth the extra setup — it's a small amount of raw SQL, not a new service to run.

---

## 4. Auth

| Choice | Notes |
|---|---|
| **Auth.js (formerly NextAuth.js)** | now the standard pairing for Next.js App Router; OAuth (Google/Discord — Discord fits a gaming audience) + email/magic-link |
| **Clerk** | pick this instead if you want hosted UI components (sign-in modals, user management dashboard) with less wiring — better if you want to move fast and don't need the customization Auth.js gives you |

**Recommendation:** Auth.js if you want the token/session logic to be closer to what you already understand from DevBoard's JWT + refresh-token setup (more transferable learning). Clerk if you'd rather spend zero time on auth screens and focus your hours on the recsys logic, which is the actual novel part of this project.

---

## 5. Real-time (V2 — Squad Mode)

| Choice | Notes |
|---|---|
| **Socket.IO** | Reuse directly from your collaborative code editor project, as the PRD notes — no new real-time pattern to learn |

---

## 6. Deployment

| Layer | Choice |
|---|---|
| **Frontend (`apps/web`)** | Vercel — free tier, native Next.js support, handles OG image generation and SSR for quiz-result pages with zero config |
| **API (`apps/api`) + worker** | Docker → AWS EC2 via GitHub Actions, same CI/CD pattern as your existing monorepo setup — or Render/Railway free tier if you'd rather avoid managing EC2 for a side project |
| **Database** | Neon (managed Postgres + pgvector) |

**Simplification if you want less DevOps overhead:** Vercel (web) + Render (api/worker) + Neon is a fully free-tier stack with almost no server management, at the cost of not touching EC2/Docker again on this project. Use EC2 only if getting more Docker/AWS reps is itself a goal.

---

## 7. Game Data

| Choice | Notes |
|---|---|
| **RAWG API** | easiest free-tier onboarding, good metadata coverage; simplest for MVP catalog seeding |
| **IGDB (Twitch) API** | richer data (better genre/tag granularity, which helps hand-tagging the 6-axis vectors) but requires Twitch dev app registration |

**Recommendation:** start with RAWG for MVP speed; it's the lower-friction option and the PRD already flags manual/LLM-assisted tagging as the real bottleneck (section 11) — better data source won't remove that work.

---

## 8. Summary Table

| Layer | Recommendation |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind v4 + Framer Motion |
| Backend | npm + Turborepo + Node/Express + TypeScript |
| Database | PostgreSQL (Neon) + `pgvector` + Prisma |
| Auth | Auth.js (or Clerk for speed) |
| Real-time | Socket.IO (V2) |
| Deployment | Vercel (web) + EC2/Docker or Render (api/worker) |
| Game data | RAWG API |

---

## 9. Where this differs from the PRD, and why

- **Kept as-is:** Postgres + pgvector, Turborepo monorepo layout, RAWG/IGDB, Socket.IO for Squad Mode, Docker→EC2 pipeline. These are already well-reasoned in the PRD.
- **Locked in:** Express over tRPC for the backend — keeps the API layer consistent with your existing MERN-style REST + Axios pattern from DevBoard/PrepIQ, at the cost of losing tRPC's end-to-end type inference.
- **Locked in:** npm over Bun as the package manager — sticking with the tool you're already comfortable with rather than learning a new runtime alongside everything else this project introduces.
- **Removed for MVP:** Redis. Deck caching and swipe rate-limiting are handled directly against Postgres for now; see section 10 for when to revisit this.
- **Added a decision point:** Auth.js vs. Clerk — the PRD leaves this open; the doc above gives you the actual trade-off (transferable learning vs. speed) instead of picking one blindly.
- **Noted a possible simplification:** using Render/Railway instead of EC2 for the API if you want a fully free, low-maintenance V1 and only reach for EC2/Docker if you specifically want more of those reps.

---

## 10. Future Improvements (post-MVP)

- **Redis (Upstash)** — reintroduce once you're comfortable with it, to cache the active swipe deck per session and rate-limit swipe writes as the original PRD intended. Good candidate for whenever deck-query latency or write volume actually becomes a bottleneck rather than a hypothetical one.
- Everything already listed under the PRD's own V2 roadmap (section 7 of `PRD.md`): Compatibility Mode, Group Swipe/Squad Mode, storefront integration, AI-generated blurbs, push notifications, seasonal re-quiz, admin/CMS, analytics dashboard.