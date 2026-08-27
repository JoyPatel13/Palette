# Palette

*"Tell us your color in 90 seconds. We'll find your next obsession in every swipe after that."*

Palette is a single platform that merges a short personality-style quiz ("What's your Gaming Color?") with a swipeable game-discovery feed. Instead of two disconnected experiences, the quiz result becomes the **cold-start seed** for a recommendation engine, and every swipe afterward refines it.

---

## The Problem

Swipe-based discovery apps have a classic cold-start problem: a new user's first 10–20 swipes are near-random because the system knows nothing about them yet. Quiz apps ("which X are you") go viral but don't retain — users screenshot their result and leave.

Palette solves both at once: the quiz gives the recommendation engine a warm start instead of a cold one, and the swipe deck gives the quiz a reason to keep the user coming back.

---

## Core Concept

Each user gets a **Gaming Color** — not a single label, but a percentage blend across six axes (Crimson, Cobalt, Emerald, Violet, Amber, Onyx), each mapped to a genre cluster, core mechanics, and a Bartle-inspired motivational driver. That blend is a 6-dimensional vector, and it *is* the user's initial recommendation embedding.

- **Explicit signal (Quiz):** 12–15 scenario-based questions, each nudging 2–3 color weights → a normalized 6-axis vector.
- **Implicit signal (Swipe):** every right-swipe pulls the vector toward that game's tag profile; every left-swipe pushes it away — a continuous, small update, similar to an Elo or exponential-moving-average adjustment.
- **Matching:** games are tagged with the same 6-axis vector. Recommendations = cosine similarity between user vector and game vectors, with some exploration noise mixed in so the deck doesn't get stale.

Full concept details, personas, and feature roadmap live in [`PRD.md`](./PRD.md).

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion |
| Backend | Node.js + Express + TypeScript, npm, Turborepo monorepo |
| Database | PostgreSQL (Neon) + `pgvector` + Prisma |
| Auth | Auth.js (or Clerk) |
| Real-time (V2) | Socket.IO |
| Deployment | Vercel (web) + Docker/EC2 or Render (api/worker) |
| Game data | RAWG API |

Full reasoning behind each choice — including trade-offs and what changed from the original PRD — lives in [`techStack.md`](./techStack.md).

---

## Monorepo Structure

```
apps/
  web/        → Next.js 16 (App Router), TypeScript, Tailwind
  api/        → Node/Express, business logic + recsys endpoints
  worker/     → background job: recompute/decay vectors, catalog tag sync
packages/
  ui/         → shared swipe-card components, radar chart component
  quiz-logic/ → scoring engine (shared between quiz + worker)
  types/      → shared TS types (color vector, game schema, etc.)
```

---

## Recommendation Engine (MVP)

1. Quiz submission → compute vector → write to `users.color_vector` (pgvector column).
2. Each game row has a `tag_vector` (pgvector column), same 6 dimensions.
3. Deck query: `ORDER BY color_vector <=> tag_vector LIMIT N` (pgvector cosine-distance operator), with a small injected randomness factor for exploration.
4. On swipe: `color_vector = (color_vector * 0.9) + (tag_vector * swipe_weight * 0.1)` — right-swipe weight positive, left-swipe negative, superlike weighted higher.

Cheap, explainable, no ML infra needed for MVP — can graduate to matrix factorization later without changing the schema.

---

## MVP Feature Checklist

- [ ] Quiz engine: 12–15 weighted-scoring questions → normalized 6-axis color vector
- [ ] Results screen: primary/secondary color, description, shareable image card
- [ ] Swipe deck UI (like/dislike/superlike) — seeded catalog via RAWG API
- [ ] Content-based recommendation via pgvector cosine similarity
- [ ] Incremental vector update on every swipe
- [ ] Auth (email or OAuth)
- [ ] Profile page: color blend + liked/superliked games list
- [ ] Responsive, mobile-first web app

See [`PRD.md`](./PRD.md) for the full MVP + V2 roadmap.

---

## Success Metrics

- Quiz completion rate
- Quiz-to-swipe conversion (≥5 swipes after result)
- Cold-start quality: right-swipe rate on first 10 recommended cards vs. a random-deck baseline
- Vector convergence speed
- D7 / D30 retention
- Share rate on quiz results

---

## Future Improvements

- Reintroduce **Redis** (Upstash) for swipe-deck caching and rate-limiting once comfortable with it, or once deck-query latency becomes a real bottleneck.
- V2 roadmap: Palette Evolution radar chart, Compatibility Mode, Group Swipe/Squad Mode, storefront integration, AI-generated "why this fits" blurbs, push notifications, seasonal re-quiz, admin/CMS, analytics dashboard.

---

## Docs

- [`PRD.md`](./PRD.md) — full product requirements, personas, user stories, open questions
- [`techStack.md`](./techStack.md) — detailed stack rationale and trade-offs
