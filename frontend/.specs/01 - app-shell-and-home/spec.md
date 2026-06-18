# 01 - App Shell and Home

## Goal
Create the first visible app structure and home screen.

This feature defines the entry point users see before starting a match or checking past data.

## Screens

### Home
Main screen with two primary actions:

- **Novo jogo**
- **Histórico**

Reference screens:

- `reference/screens/Main - 2.png`
- `reference/screens/Main - 3.png`

Use one final variation, not all three mockups.

## User Flow

1. User opens app.
2. Home screen appears.
3. User chooses:
   - **Novo jogo** → match setup flow
   - **Histórico** → history screen

## Required Behavior

- Show app visual identity.
- Show clear primary action for creating a new game.
- Show secondary action for history.
- Keep navigation simple and obvious.
- Preserve mobile-first layout.

## State Needed

Minimal state only:

- current screen / route

Shared app data lives in later specs.

## Acceptance Criteria

- Home screen is reachable as app entry point.
- User can navigate from Home to new game flow.
- User can navigate from Home to history flow.
- Visual style matches project references: dark gray, orange accent, bold sports typography feel.
- Layout works on mobile dimensions first.
