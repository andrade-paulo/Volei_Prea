# App Shell and Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the real app entry screen with two clear actions: `Novo jogo` and `Histórico`.

**Architecture:** Keep this as one small vertical slice. Use the existing React Router index route at `/`, keep the side prototype under `/progress`, and link the home actions into the existing `/progress/new` and `/progress/history` pages until later specs replace those flows.

**Tech Stack:** React 19, React Router 8, TypeScript, Tailwind CSS 4.

---

## Scope

One implementation only. No split needed.

This spec touches only the public entry shell/home. It does not implement match setup, scoreboard, history, or players.

## Files

- Modify: `app/root.tsx`
  - Load display font globally so home typography renders correctly.
- Modify: `app/routes/home.tsx`
  - Replace placeholder landing page with final home screen.
- Verify: `pnpm typecheck`
  - Confirms route types and TS compile.

---

## Task 1: Load app fonts globally

**Files:**
- Modify: `app/root.tsx`

- [ ] **Step 1: Update `links` font imports**

Replace the current Google font stylesheet entry with one URL that loads both `Inter` and `Russo One`:

```tsx
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Russo+One&display=swap",
  },
];
```

- [ ] **Step 2: Run typecheck**

```bash
pnpm typecheck
```

Expected: command exits successfully.

---

## Task 2: Replace placeholder Home screen

**Files:**
- Modify: `app/routes/home.tsx`

- [ ] **Step 1: Replace `Home` component content**

Keep existing imports and `meta`. Replace only returned JSX in `Home()` with this structure:

```tsx
export default function Home() {
  return (
    <main className="progress-grain relative min-h-dvh overflow-hidden bg-[#4a4a4a] text-[#e8e8e8]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-1/2 left-1/2 h-[145%] w-1 -translate-x-1/2 -translate-y-1/2 rotate-[35deg] bg-[#e85d2a] shadow-[0_0_16px_#e85d2a]" />
      </div>

      <section className="relative z-10 grid min-h-dvh grid-cols-1 sm:grid-cols-2">
        <Link
          to="/progress/new"
          className="group flex min-h-[50dvh] items-center justify-center px-6 py-12 text-center sm:min-h-dvh"
        >
          <span className="font-display text-5xl tracking-wide uppercase transition-colors group-hover:text-white sm:text-6xl">
            Novo jogo
          </span>
        </Link>

        <Link
          to="/progress/history"
          className="group flex min-h-[50dvh] items-center justify-center px-6 py-12 text-center sm:min-h-dvh"
        >
          <span className="font-display text-5xl tracking-wide text-[#cfcfcf] uppercase transition-colors group-hover:text-white sm:text-6xl">
            Histórico
          </span>
        </Link>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm typecheck
```

Expected: command exits successfully.

- [ ] **Step 3: Manual browser check**

Run dev server:

```bash
pnpm dev
```

Open `/` and check:

- Home fills viewport.
- `Novo jogo` is visible.
- `Histórico` is visible.
- Orange diagonal line appears.
- `Novo jogo` navigates to `/progress/new`.
- `Histórico` navigates to `/progress/history`.
- Mobile width stacks actions vertically.
- Wider width shows actions side by side.

---

## Task 3: Final verification

**Files:**
- Verify only.

- [ ] **Step 1: Run final typecheck**

```bash
pnpm typecheck
```

Expected: command exits successfully.

- [ ] **Step 2: Review changed files**

```bash
git diff -- app/root.tsx app/routes/home.tsx
```

Expected:

- Only font loading and home screen changed.
- No match setup, scoreboard, player, or history logic added.

- [ ] **Step 3: Commit**

```bash
git add app/root.tsx app/routes/home.tsx
git commit -m "feat: add app home shell"
```

---

## Self-review

- Spec coverage: home entry point, `Novo jogo`, `Histórico`, mobile-first layout, visual style covered.
- Placeholder scan: no TBD/TODO/fill-later steps.
- Type consistency: uses existing `Link`, existing `/progress/new`, existing `/progress/history`, existing `font-display`, existing `progress-grain`.
