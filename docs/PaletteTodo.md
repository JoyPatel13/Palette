# Palette — Project TODO List (MVP)

> Atomic, sequential task list. Each task has **zero unfinished dependencies** on any task below it. Complete top-to-bottom, one at a time.

---

## Phase 0 — Project Scaffolding

- [ ] **0.1** Initialize a Turborepo monorepo at the repo root with npm as the package manager
- [ ] **0.2** Scaffold the `apps/web` workspace — Next.js 16 (App Router) with TypeScript
- [ ] **0.3** Install and configure Tailwind CSS v4 in `apps/web`
- [ ] **0.4** Scaffold the `apps/api` workspace — Node.js + Express + TypeScript
- [ ] **0.5** Scaffold the `apps/worker` workspace — Node.js + TypeScript (background job runner)
- [ ] **0.6** Create the `packages/types` workspace — shared TypeScript types (`ColorVector`, `GameSchema`, `UserProfile`, `SwipeAction`, etc.)
- [ ] **0.7** Create the `packages/quiz-logic` workspace — empty package with TypeScript config, exporting a placeholder module
- [ ] **0.8** Create the `packages/ui` workspace — empty shared component library with TypeScript + React config
- [ ] **0.9** Verify the full Turborepo pipeline: `turbo build` and `turbo dev` succeed across all workspaces with no errors
- [ ] **0.10** Add a root `.gitignore`, base `tsconfig.json`, and root-level linting/formatting config (ESLint + Prettier)
- [ ] **0.11** Commit the clean scaffold to `main`

---

## Phase 1 — Database & ORM Setup

- [ ] **1.1** Create a Neon Postgres project/branch for Palette and obtain the connection string
- [ ] **1.2** Install Prisma (v6) in `apps/api` and initialize with the Neon connection string
- [ ] **1.3** Enable the `pgvector` extension on the Neon database (`CREATE EXTENSION IF NOT EXISTS vector;`)
- [ ] **1.4** Define the Prisma schema: `User` model (id, email, name, `color_vector` as an unsupported `vector(6)` type, timestamps)
- [ ] **1.5** Add the `Game` model to the Prisma schema (id, rawgId, title, slug, description, coverImageUrl, `tag_vector` as `vector(6)`, genre/tag metadata JSON, releaseDate, rating, timestamps)
- [ ] **1.6** Add the `Swipe` model (id, userId FK, gameId FK, action enum `LIKE | DISLIKE | SUPERLIKE`, timestamps)
- [ ] **1.7** Add the `QuizResult` model (id, userId FK, raw answers JSON, computed vector JSON, primary color, secondary color, timestamps)
- [ ] **1.8** Run `prisma migrate dev` to apply all migrations to Neon — verify tables and `vector(6)` columns exist
- [ ] **1.9** Write a raw-SQL test query in a scratch script: insert a dummy vector, run `ORDER BY color_vector <=> '[0.5,0.2,0.1,0.1,0.05,0.05]' LIMIT 5` — confirm pgvector cosine distance works
- [ ] **1.10** Commit the schema, migrations, and test script

---

## Phase 2 — Auth

- [ ] **2.1** Install Auth.js (NextAuth v5) in `apps/web`
- [ ] **2.2** Configure the Auth.js Prisma adapter to use the existing Prisma client in `apps/api` (add the required `Account`, `Session`, `VerificationToken` tables to the Prisma schema and migrate)
- [ ] **2.3** Set up Google OAuth provider (create Google Cloud OAuth credentials, add env vars)
- [ ] **2.4** Set up Discord OAuth provider (create Discord dev app, add env vars)
- [ ] **2.5** Create the sign-in page UI in `apps/web` — Google + Discord buttons, minimal styling with Tailwind
- [ ] **2.6** Protect routes: unauthenticated users are redirected to sign-in; authenticated users proceed to quiz or swipe deck
- [ ] **2.7** Add a session-aware API middleware in `apps/api` that validates the Auth.js session/JWT on incoming requests
- [ ] **2.8** Test the full auth flow end-to-end: sign in → session created → protected route accessible → sign out
- [ ] **2.9** Commit

---

## Phase 3 — Shared Types & Quiz Logic Engine

- [ ] **3.1** Define the `ColorVector` type in `packages/types` — a 6-element tuple `[crimson, cobalt, emerald, violet, amber, onyx]` normalized to sum = 1.0
- [ ] **3.2** Define the `QuizQuestion` type in `packages/types` — question text, array of answer options, each option carrying a partial weight map over the 6 colors
- [ ] **3.3** Define the `QuizAnswer` and `QuizSubmission` types
- [ ] **3.4** Author the quiz question dataset in `packages/quiz-logic` — 12–15 scenario-based questions with weighted answer options (e.g., "It's Friday night, you have 2 hours…")
- [ ] **3.5** Implement the scoring function in `packages/quiz-logic`: takes a `QuizSubmission`, accumulates color weights across all answers, normalizes to a unit vector → returns a `ColorVector`
- [ ] **3.6** Implement a `getPrimarySecondaryColor()` helper — returns the top-2 color names from a `ColorVector`
- [ ] **3.7** Write unit tests for the scoring function: verify normalization, verify known answer sets produce expected color outcomes
- [ ] **3.8** Export all public functions and types from `packages/quiz-logic`
- [ ] **3.9** Commit

---

## Phase 4 — Quiz Frontend

- [ ] **4.1** Install Framer Motion in `apps/web`
- [ ] **4.2** Create the quiz page route (`/quiz`) in `apps/web`
- [ ] **4.3** Build the `QuizCard` component — displays one question at a time with answer options as selectable cards/buttons
- [ ] **4.4** Build the quiz flow controller — steps through questions one at a time with Framer Motion slide/fade transitions, tracks selected answers in local state
- [ ] **4.5** Add a progress bar component showing current question index out of total
- [ ] **4.6** On quiz completion, call the scoring function from `packages/quiz-logic` client-side to compute the `ColorVector`
- [ ] **4.7** Submit the quiz result to the API (`POST /api/quiz/submit` — to be built in Phase 5)
- [ ] **4.8** Commit

---

## Phase 5 — Quiz Backend & Results

- [ ] **5.1** Create the `POST /api/quiz/submit` endpoint in `apps/api` — accepts `QuizSubmission`, validates with Zod, computes vector server-side using `packages/quiz-logic`, stores a `QuizResult` row, and writes the `color_vector` to the `User` row via raw SQL (`UPDATE users SET color_vector = $1::vector`)
- [ ] **5.2** Create the `GET /api/quiz/result/:userId` endpoint — returns the user's quiz result (primary color, secondary color, percentage breakdown, description)
- [ ] **5.3** Write color description copy for all 6 colors (short paragraph per color explaining the archetype)
- [ ] **5.4** Build the quiz results page UI (`/quiz/result`) — displays primary color with a bold color-themed header, secondary color, percentage breakdown bar chart for all 6 axes, and the archetype description
- [ ] **5.5** Add a "Start Swiping →" CTA button on the results page that routes to `/swipe`
- [ ] **5.6** Test the full quiz flow end-to-end: take quiz → submit → see result → vector stored in DB
- [ ] **5.7** Commit

---

## Phase 6 — Shareable Quiz Result Card

- [ ] **6.1** Design the shareable result card layout — color-themed card with the user's primary/secondary color, percentage breakdown, and Palette branding
- [ ] **6.2** Build a Next.js dynamic OG image route (`/api/og/quiz-result/[userId]`) using `next/og` (Satori) — renders the result card as a 1200×630 PNG
- [ ] **6.3** Add `<meta property="og:image">` and Twitter card meta tags to the `/quiz/result/[userId]` page, pointing to the OG image route
- [ ] **6.4** Add a "Share" button on the results page — copies the shareable URL to clipboard + native share API fallback on mobile
- [ ] **6.5** Test OG image rendering by pasting the URL into Twitter/Discord/iMessage link previews
- [ ] **6.6** Commit

---

## Phase 7 — Game Catalog Seeding

- [ ] **7.1** Register for a RAWG API key
- [ ] **7.2** Write a seed script in `apps/worker` that fetches games from the RAWG API (top-rated, popular, across multiple genres — aim for 200–300 games for MVP)
- [ ] **7.3** For each fetched game, map RAWG's genre/tag data to an initial `tag_vector` (6-axis) using a heuristic mapping (e.g., FPS/Action → high Crimson, Strategy/Puzzle → high Cobalt, etc.)
- [ ] **7.4** Insert the games into the `Game` table with their `tag_vector` stored as a pgvector column via raw SQL
- [ ] **7.5** Write a verification query: select the top-10 games closest to a pure-Crimson vector, confirm they are action/FPS games
- [ ] **7.6** Commit the seed script and the genre-to-vector mapping logic

---

## Phase 8 — Recommendation Engine (Backend)

- [ ] **8.1** Create the `GET /api/deck` endpoint — takes the authenticated user's `color_vector`, queries games using `ORDER BY color_vector <=> tag_vector LIMIT 20` with pgvector, excludes already-swiped games (subquery on `Swipe` table), injects ~10% exploration noise (random games from the user's weakest color axis)
- [ ] **8.2** Validate with Zod, return the deck as a JSON array of game cards (id, title, coverImage, genres, short description)
- [ ] **8.3** Create the `POST /api/swipe` endpoint — accepts `{ gameId, action: LIKE | DISLIKE | SUPERLIKE }`, inserts a `Swipe` row
- [ ] **8.4** Implement the vector update logic in `POST /api/swipe`: on LIKE, update `color_vector = (color_vector * 0.9) + (tag_vector * 0.1)`; on DISLIKE, update `color_vector = (color_vector * 0.9) + (tag_vector * -0.1)`; on SUPERLIKE, use `+0.15` weight. Re-normalize the vector after update. Execute via raw SQL.
- [ ] **8.5** Create the `GET /api/user/vector` endpoint — returns the user's current `color_vector` (for the profile/radar chart)
- [ ] **8.6** Write integration tests: seed a user with a known vector, swipe right on a Crimson game, verify the vector shifted toward Crimson
- [ ] **8.7** Commit

---

## Phase 9 — Swipe Deck Frontend

- [ ] **9.1** Build the `SwipeCard` component in `packages/ui` — displays game cover image, title, genres; styled with Tailwind, card layout
- [ ] **9.2** Build the `SwipeDeck` component in `packages/ui` — stacked card layout using Framer Motion for swipe-left/right/up gestures (left = dislike, right = like, up = superlike)
- [ ] **9.3** Wire up the swipe page route (`/swipe`) in `apps/web` — fetches the deck from `GET /api/deck` on mount
- [ ] **9.4** On swipe gesture completion, call `POST /api/swipe` with the action, animate the card off-screen, reveal the next card
- [ ] **9.5** Add like/dislike/superlike icon buttons below the card stack for users who prefer tapping over swiping
- [ ] **9.6** Handle the empty-deck state — show a "You've seen all the games! Check back later" message
- [ ] **9.7** Add a loading skeleton while the deck is being fetched
- [ ] **9.8** Test the full swipe flow on mobile viewport: gesture responsiveness, animation smoothness, correct API calls
- [ ] **9.9** Commit

---

## Phase 10 — Profile Page

- [ ] **10.1** Build the `RadarChart` component in `packages/ui` — a 6-axis spider/radar chart (Recharts or custom SVG) that visualizes a `ColorVector`
- [ ] **10.2** Create the profile page route (`/profile`) in `apps/web`
- [ ] **10.3** Fetch and display the user's current `color_vector` as the radar chart with color labels (Crimson, Cobalt, etc.)
- [ ] **10.4** Create the `GET /api/user/liked-games` endpoint — returns all games the user has LIKED or SUPERLIKED, ordered by most recent
- [ ] **10.5** Display the liked/superliked games as a scrollable grid below the radar chart, with cover images and titles
- [ ] **10.6** Show the user's primary/secondary color badge prominently at the top of the profile
- [ ] **10.7** Add a "Retake Quiz" button that routes to `/quiz`
- [ ] **10.8** Commit

---

## Phase 11 — Navigation & Layout Shell

- [ ] **11.1** Build the app shell layout in `apps/web` — persistent bottom navigation bar (mobile) or sidebar (desktop) with icons for: Quiz, Swipe, Profile
- [ ] **11.2** Implement the landing/home page (`/`) — if unauthenticated, show a marketing hero with "Take the Quiz" CTA; if authenticated but no quiz taken, redirect to `/quiz`; if authenticated with quiz done, redirect to `/swipe`
- [ ] **11.3** Add a top-level error boundary and 404 page
- [ ] **11.4** Ensure all pages are responsive and mobile-first (test at 375px, 768px, 1280px viewports)
- [ ] **11.5** Commit

---

## Phase 12 — Polish & UX

- [ ] **12.1** Add animated transitions between routes using Framer Motion (page enter/exit)
- [ ] **12.2** Add a toast notification system for success/error feedback (e.g., "Quiz submitted!", "Swipe recorded!")
- [ ] **12.3** Add "palette evolving" micro-animation on the radar chart when the user returns to their profile after swiping (chart animates from old vector to new vector)
- [ ] **12.4** Refine swipe card design — add a flip interaction to show a back-of-card with genre tags and a 1-line description
- [ ] **12.5** Add haptic feedback (vibration API) on swipe gestures for mobile
- [ ] **12.6** Dark mode support via Tailwind's `dark:` variant — default to system preference
- [ ] **12.7** Commit

---

## Phase 13 — Deployment

- [ ] **13.1** Set up the Vercel project for `apps/web` — connect the repo, configure the root directory and build command for the Turborepo monorepo
- [ ] **13.2** Add all required environment variables to Vercel (Neon DB URL, Auth.js secrets, RAWG API key, OAuth credentials)
- [ ] **13.3** Deploy `apps/web` to Vercel — verify SSR, OG images, and auth work in production
- [ ] **13.4** Dockerize `apps/api` — write a `Dockerfile` and `.dockerignore`
- [ ] **13.5** Set up a Render (or EC2) service for `apps/api` — deploy the Docker image, add env vars
- [ ] **13.6** Configure CORS on `apps/api` to allow requests from the Vercel frontend domain
- [ ] **13.7** Run the game seed script against the production Neon database
- [ ] **13.8** Smoke test the full production flow: sign in → quiz → result with OG image → swipe deck → profile
- [ ] **13.9** Commit any deployment config files (Dockerfile, Render/EC2 config, Vercel config)

---

## Phase 14 — CI/CD & Quality Gates

- [ ] **14.1** Create a GitHub Actions workflow: on push to `main`, run `turbo lint`, `turbo build`, and `turbo test` across all workspaces
- [ ] **14.2** Add a step to the workflow that runs Prisma migrations against a test database (or validates the schema)
- [ ] **14.3** Configure Vercel to auto-deploy preview builds on pull requests
- [ ] **14.4** Add a `README.md` update with setup instructions (clone, install, env vars, seed, dev)
- [ ] **14.5** Commit

---

## Phase 15 — Analytics & Instrumentation (MVP Baseline)

- [ ] **15.1** Instrument quiz completion events — log when a user starts the quiz, completes it, and which result they got
- [ ] **15.2** Instrument swipe events — log each swipe action with a timestamp (for computing right-swipe rate on first 10 cards, quiz-to-swipe conversion)
- [ ] **15.3** Instrument share events — log when a user clicks the share button on the result page
- [ ] **15.4** Create a simple admin-only `/admin/stats` page (or API endpoint) that queries and displays: quiz completion rate, quiz-to-swipe conversion %, average right-swipe rate on first 10 cards, total users, total swipes
- [ ] **15.5** Commit — **MVP complete** 🎉

---

> **Total: 75 tasks across 16 phases**
>
> Each task is atomic and depends only on tasks above it. No two tasks require work in the same file simultaneously. Complete one, commit, move on.
