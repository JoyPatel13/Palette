# Product Requirements Document: Palette
*(working title — "Which Gaming Color Are You" quiz + "Tinder for Games" swiping, merged into one platform)*

---

## 1. Overview

Palette is a single platform that opens with a short personality-style quiz ("What's your Gaming Color?") and uses the result as the seed for a swipeable game-discovery feed. Instead of two disconnected experiences — a shareable quiz and a separate swipe app — the quiz becomes the **cold-start engine** for the recommendation system, and every swipe afterward refines it. The product's core promise: *"Tell us your color in 90 seconds. We'll find your next obsession in every swipe after that."*

---

## 2. Problem Statement

Swipe-based discovery apps (Tinder-likes) have a classic cold-start problem: a new user's first 10–20 swipes are near-random because the system knows nothing about them. Meanwhile, quiz/personality apps ("which X are you") are high-virality but low-retention — users get a result, screenshot it, and leave. Palette solves both: the quiz gives the recommendation engine a warm start instead of a cold one, and the swipe deck gives the quiz a reason to keep the user coming back instead of bouncing after the result screen.

---

## 3. Goals & Objectives

| Goal | Description |
|---|---|
| Eliminate cold-start | New users should get relevant recommendations from swipe #1, not swipe #50 |
| Convert virality into retention | Quiz drives top-of-funnel sharing; swiping converts that into daily/weekly active use |
| Build a self-improving taste graph | Every swipe should measurably sharpen the user's color vector and the game catalog's tag weights |
| Ship a portfolio-grade full-stack product | Demonstrate quiz-logic design, recommendation-system thinking, real-time swipe UI, and production deployment |

---

## 4. Target Users / Personas

- **The Casual Discoverer** — bored, wants something new to play tonight, doesn't want to read 10 Steam reviews to decide.
- **The Genre-Curious** — mostly plays one genre, quiz + swipe nudges them into adjacent genres they'd probably like.
- **The Social Sharer** — takes the quiz mainly to post the result, becomes a swipe user because the deck is addictive.
- **The Backlog Manager** — wants a "Must Play" wishlist synced with actual store data (price, ownership, deals) — V2 persona.

---

## 5. Core Concept: Gaming Color → Swipe Algorithm

### 5.1 What a "Gaming Color" actually represents
Each color is a **vector, not a label** — a weighted blend across genre tags, mechanic tags, and mood tags, similar to a Myers-Briggs-style axis system but tuned to games instead of personality traits.

| Color | Genre Cluster | Core Mechanics | Motivational Driver (Bartle-inspired) |
|---|---|---|---|
| **Crimson** | FPS, fighting, action-adventure | Fast reflexes, high APM, short session bursts | Achiever / Killer — mastery through action |
| **Cobalt** | Strategy, 4X, puzzle, city-builders | Planning, resource management, long-horizon thinking | Achiever — mastery through logic |
| **Emerald** | Open-world, survival, crafting, sandbox | Freedom, systemic play, low hand-holding | Explorer — mastery through discovery |
| **Violet** | Narrative RPGs, visual novels, story-adventure | Choice-driven, character depth, emotional pacing | Explorer/Socializer — mastery through immersion |
| **Amber** | Co-op, party games, MMOs | Shared sessions, low stakes, social loop | Socializer — mastery through connection |
| **Onyx** | Horror, soulslikes, high-difficulty | Tension, punishing feedback loops, atmosphere | Killer — mastery through endurance |

A user's quiz result is never "you are 100% Crimson" — it's a **percentage blend** (e.g., 55% Crimson / 25% Onyx / 20% Cobalt). That blend *is* the initial embedding fed into the recommendation engine, exactly like a cold-start vector in a real recsys.

### 5.2 The elegant connection (quiz → swipe)
Think of it as two layers of the same signal, not two features bolted together:

1. **Explicit signal (Quiz)** — 12–15 scenario-based questions ("It's Friday night, you have 2 hours — what are you doing?"), each answer nudges 2–3 color weights. Output: a normalized 6-axis vector.
2. **Implicit signal (Swipe)** — every right-swipe pulls the user's vector slightly toward that game's tag profile; every left-swipe pushes it slightly away. This is the same math as an Elo update or an exponential moving average — small, continuous, never a hard overwrite.
3. **Matching** — each game in the catalog is *also* tagged with the same 6-axis vector (assigned manually at MVP, or crowd-derived from swipe data at V2). Recommendation = cosine similarity between user vector and game vectors, with a controlled amount of "exploration noise" so the deck doesn't get stale.

This means the quiz isn't a gimmick bolted onto the swiper — it's literally the seed value in the same math the swiper uses forever after. That's the "seamless" part.

---

## 6. Further Improvisations — Creative Twists & Gamification

- **Palette Evolution radar chart** — profile screen shows a live spider chart of the user's 6-axis blend, visibly shifting as they swipe. "Your palette is evolving" moment = shareable, screenshot-bait.
- **Compatibility Mode** — two users compare palettes for a % match score ("You and Alex are 82% compatible — try *Deep Rock Galactic*"), turns quiz virality into a social/co-op feature rather than a one-off share.
- **Discovery Nudges** — deliberately slip in ~10% of cards from the user's *weakest* color to broaden taste over time, framed as a "Color Challenge" rather than a random miss.
- **Group Swipe / "Squad Mode"** — everyone in a friend group swipes the same deck simultaneously; a match happens when 2+ people right-swipe the same title — solves "what do we play tonight" for co-op groups.
- **Narrative micro-cards** — instead of just box art, cards can flip to a 1-line "why this fits your palette" blurb, generated per-user rather than generic.
- **Superlike → "Must Play" list** with release-date/price-drop reminders (ties into storefront integration in V2).
- **Seasonal Re-Color** — prompt to retake a shortened quiz every few months; shows drift ("You used to be mostly Onyx, now you're trending Amber") — good retention hook.
- **Badges/streaks** — swipe streaks, "Explorer" badge for trying all 6 colors, "Color Purist" badge for staying 90%+ in one lane.

---

## 7. Feature Roadmap

### MVP
- [ ] Quiz engine: 12–15 weighted-scoring questions → normalized 6-axis color vector
- [ ] Results screen: primary/secondary color, short description, shareable image card
- [ ] Swipe deck UI (like/dislike/superlike) — seeded game catalog (via RAWG or IGDB API)
- [ ] Content-based recommendation: cosine similarity between user vector and game tag vectors
- [ ] Incremental vector update on every swipe (simple weighted moving average)
- [ ] Basic auth (email or OAuth)
- [ ] Profile page: color blend + liked/superliked games list
- [ ] Responsive web app (mobile-first, since swipe UX lives or dies on mobile)

### V2
- [ ] Palette Evolution radar chart with historical tracking
- [ ] Compatibility Mode (friend-to-friend palette matching)
- [ ] Group Swipe / Squad Mode (real-time, Socket.IO-based)
- [ ] Storefront integration — live price, ownership, and deal data (Steam/Epic/PS/Xbox APIs where available)
- [ ] AI-generated per-user "why this fits" blurbs (LLM call over user vector + game metadata)
- [ ] Push notifications (new releases matching profile, price drops on wishlist)
- [ ] Seasonal re-quiz + drift tracking
- [ ] Admin/CMS for catalog + quiz-question management
- [ ] Analytics dashboard (swipe-through rate, vector convergence speed, retention by color)

---

## 8. Tech Stack & Architecture

Recommendation is built to extend what's already proven out in your **[[monorepo-deployment]]** setup — Turborepo/Bun monorepo with Docker CI/CD to EC2 — rather than starting a stack from zero.

**Monorepo layout (Turborepo + Bun):**
```
apps/
  web/        → Next.js 14+ (App Router), TypeScript, Tailwind
  api/        → Node/Express or tRPC, business logic + recsys endpoints
  worker/     → background job: recompute/decay vectors, catalog tag sync
packages/
  ui/         → shared swipe-card components, radar chart component
  quiz-logic/ → scoring engine (shared between quiz + worker)
  types/      → shared TS types (color vector, game schema, etc.)
```

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js + TypeScript + Tailwind | SSR for shareable quiz-result pages (OG images matter for virality) |
| Swipe UI | Framer Motion (custom) over `react-tinder-card`-style gestures | Full control over animation for the "palette evolving" moments |
| Backend | Node/Bun runtime, Express or tRPC | Matches your existing Bun monorepo experience |
| Database | **PostgreSQL + `pgvector`** | This is the key architectural choice: your color vectors *are* embeddings, so pgvector gives you native nearest-neighbor similarity search for recommendations instead of hand-rolled cosine-similarity loops |
| Caching | Redis | Cache the active swipe deck per session, rate-limit swipe writes |
| Real-time | Socket.IO | Reuse your CollabEditor experience directly for Squad Mode in V2 |
| Game data | RAWG API or IGDB (Twitch) API | Seed the catalog instead of hand-entering games |
| Auth | NextAuth.js or Clerk | Fast to wire up, OAuth-ready |
| Infra | Docker → AWS EC2 via GitHub Actions | Same CI/CD pipeline pattern as week-27 |

**Recommendation engine, concretely:**
1. Quiz submission → compute vector → write to `users.color_vector` (pgvector column).
2. Each game row has a `tag_vector` (pgvector column), same 6 dimensions.
3. Deck query = `ORDER BY color_vector <=> tag_vector LIMIT N` (pgvector cosine-distance operator) with a small injected randomness factor for exploration.
4. On swipe: `color_vector = (color_vector * 0.9) + (tag_vector * swipe_weight * 0.1)` — right-swipe weight positive, left-swipe weight negative, superlike weighted higher. Cheap, explainable, no ML infra needed for MVP; can graduate to matrix factorization in V2 without changing the schema.

---

## 9. User Stories

**Quiz**
- As a new user, I want to answer a short set of scenario questions so I get a personality-style result without it feeling like a boring form.
- As a user, I want my result to show a percentage breakdown, not just one label, so it feels accurate to my actual taste.
- As a user, I want a shareable result card so I can post it without leaving the app looking like a screenshot of raw data.

**Swipe**
- As a user, I want my very first swipe deck to already feel relevant, based on my quiz result, so I don't waste swipes on obviously-wrong games.
- As a user, I want to like, pass, or superlike a game with a single gesture so the flow feels as fast as a dating app.
- As a user, I want to see my "palette" visibly shift as I swipe so I feel the app is actually learning from me.

**Social (V2)**
- As a user, I want to compare my palette with a friend's so we can find something to co-op.
- As a group of friends, we want to swipe the same deck together so we land on one game everyone agrees on.

**Retention**
- As a returning user, I want occasional recommendations outside my dominant color so I don't get stuck in a rut.
- As a long-time user, I want to retake a shorter quiz periodically and see how my taste has drifted.

---

## 10. Success Metrics

| Metric | Target signal |
|---|---|
| Quiz completion rate | % of users who start the quiz and reach a result |
| Quiz-to-swipe conversion | % of users who take at least 5 swipes after seeing their result |
| Cold-start quality | Right-swipe rate on the *first 10* recommended cards (should beat a random-deck baseline) |
| Vector convergence | Average number of swipes before a user's vector stabilizes (stops moving >X% per swipe) |
| D7 / D30 retention | Standard return-usage tracking |
| Share rate | % of quiz results shared externally |
| (V2) Compatibility engagement | % of matched friend pairs who open a co-op recommendation |
| (V2) Wishlist conversion | % of superliked games later marked "owned" via storefront sync |

---

## 11. Open Questions / Risks

- **Catalog seeding**: RAWG/IGDB give metadata but not your 6-axis color tags — initial tagging will likely need to be semi-manual (or LLM-assisted) for the first few hundred games.
- **Cold-start validation**: need a baseline (random deck) to actually prove the quiz-seeded deck outperforms it — worth instrumenting from day one, not bolted on later.
- **Exploration vs. exploitation balance**: too much "safe" recommending makes the deck feel repetitive; too much exploration undermines the "we know you" promise the quiz sets up. This ratio will need tuning post-launch.