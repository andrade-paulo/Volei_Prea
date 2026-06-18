# In-memory State Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace static/mock progress data with one sensible in-memory React state model for players, teams, current match, match history, and player history.

**Architecture:** Keep state scoped to the existing `/progress` route layout with a React context provider. Routes read/update state through a small hook. Use plain TypeScript functions for team generation and stats derivation so the model stays easy to wire to backend later.

**Tech Stack:** React 19, React Router 8, TypeScript, Tailwind CSS 4.

---

## Data model

Use IDs internally and names for display.

- `Player`
  - `id`: stable id
  - `name`: display name
  - `pin`: short visible number/code for ranking table
  - `skill`: 1-5, used by balanced teams
  - `createdAt`: ISO string
- `TeamDraft`
  - `name`
  - `playerIds`
- `CurrentMatch`
  - `id`
  - `mode`: `manual | random | balanced`
  - `team1`, `team2`
  - `score1`, `score2`
  - `startedAt`
  - `elapsedSeconds`
- `MatchHistoryItem`
  - `id`
  - `team1`, `team2`
  - `score1`, `score2`
  - `winnerTeamName`
  - `durationSeconds`
  - `finishedAt`
- `PlayerHistoryItem`
  - derived from players + match history
  - `matches`, `wins`, `losses`, `winRate`

## Files

- Create: `app/components/progress/store.tsx`
  - Types, seed data, context provider, actions, derived stats.
- Modify: `app/routes/progress/layout.tsx`
  - Wrap `<Outlet />` with provider.
- Modify: `app/routes/progress/new.random.tsx`
  - Generate random teams from store players; start current match.
- Modify: `app/routes/progress/new.balanced.tsx`
  - Generate balanced teams from store players by `skill`.
- Modify: `app/routes/progress/new.manual.tsx`
  - Use store players/teams; remove player from draft; start current match.
- Modify: `app/routes/progress/new.add-player.tsx`
  - Add player to store and return to mode selection. The player stays available in the pool until the user adds them to a team from the manual/balanced dialog.
- Modify: `app/routes/progress/match.tsx`
  - Use current match score/timer from store.
- Modify: `app/routes/progress/match.end.tsx`
  - Finish current match and render summary from stored result.
- Modify: `app/routes/progress/history.tsx`
  - Render actual match history from store.
- Modify: `app/routes/progress/history.players.tsx`
  - Render derived player history from store.

---

## Implementation tasks

### Task 1: Create progress store

- [ ] Add `app/components/progress/store.tsx` with model types, seed players, context provider, actions, team generators, and stats derivation.
- [ ] Include brief pt-BR comments near seed load/save points explaining where backend `fetch` calls will go later.
- [ ] Run `pnpm typecheck`.

### Task 2: Wire provider

- [ ] Wrap `app/routes/progress/layout.tsx` children with `ProgressDataProvider`.
- [ ] Run `pnpm typecheck`.

### Task 3: Replace team setup static data

- [ ] Update random, balanced, manual, and add-player routes to use store state/actions.
- [ ] Keep existing screen layout.
- [ ] Run `pnpm typecheck`.

### Task 4: Replace scoreboard/session globals

- [ ] Update match route to read current match from store.
- [ ] Increment/decrement score through store actions.
- [ ] Keep timer via effect and store elapsed seconds.
- [ ] Update match end route to finish match and display latest summary.
- [ ] Stop using module-global session for new flow.
- [ ] Run `pnpm typecheck`.

### Task 5: Replace mock history tables

- [ ] Update match history table to show `matches` from store.
- [ ] Update player ranking table to show derived player history.
- [ ] Delete only static mock exports made unused by this work.
- [ ] Run `pnpm typecheck`.

### Task 6: Final checks

- [ ] Run `pnpm typecheck`.
- [ ] Run `pnpm build` if typecheck passes.
- [ ] Smoke-check manually: add player from menu, confirm they do not auto-enter manual teams, add them through the manual/balanced dialog, generate random teams, generate balanced teams by level, start match, change score, finish match, see match history, see player ranking.
- [ ] Review `git diff` to confirm no user work was discarded.

---

## Self-review

- Scope is one implementation: data/state model across existing progress flow.
- Data fields match docs/screens: players have level/skill, teams have names/players, matches have score/duration/winner, histories include match rows and player ranking rows.
- Plan avoids backend implementation but requires clear pt-BR comments for future `fetch` wiring.
- No separate specs needed: splitting would create dependent half-work because all screens consume same state.
- Risk: current URLs under `/progress` remain prototype-ish. Accepted because user said they are creating pages under progress route.
