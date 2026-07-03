# Train Departure Board — Home Assistant Lovelace Card

## What this is

A `custom:train-departure-board` Lovelace card (Lit 2 + TypeScript, bundled
with Rollup into a single `ha-train-departure-board.js`) that renders a
TFL-style departure board from any sensor exposing an array of departures —
by default the `next_trains` attribute produced by the companion
[`ha_realtime_trains_api`](https://github.com/ivmreg/ha_realtime_trains_api)
integration. The `attribute` config option lets it consume any compatible
array, so the card is not hard-wired to that integration.

## Commands

- `npm run build` — Rollup bundle to `ha-train-departure-board.js` (committed; HACS serves it)
- `npm test` — Vitest (`tests/`): pure-function tests plus component tests that mount the card in happy-dom
- `npm run lint` — ESLint over `src/**/*.ts`
- `npm run format` — Prettier

All three of build/lint/test must pass before committing.

## Architecture

- `src/train-departure-board.ts` — the whole card: styles, board rendering,
  the click/keyboard-openable details popup with a live journey timeline,
  stale-data chip, and `customCards` registration. Focus management for the
  popup lives here (`_showDetails`/`_closePopup`/`updated`).
- `src/editor.ts` — visual config editor (`ha-form` schema). Every option in
  `TrainDepartureBoardConfig` must appear both here and in
  `CONFIGURATION.md`; keep the three in sync.
- `src/utils.ts` — pure logic: status derivation (`getStatusMeta`), delay
  maths, date parsing (with a per-entity `dateCache`), popup timeline
  building (`getStopsForPopup`), the per-operator rolling-stock table
  (`getStockCategory` — seeded with Southeastern; add operators via
  `STOCK_TABLES`), `formatRelativeMinutes`, and `isCatchable` (walk-time
  highlight).
- `src/types.ts` — `TrainDeparture` (the data contract with the integration;
  additive changes only) and `TrainDepartureBoardConfig`.

## Conventions & constraints

- **Backward compatibility is a hard constraint**: existing card configs and
  the `next_trains` departure shape must keep working. New config options
  need safe defaults; removed options must be silently ignored.
- Theme-driven styling only: colors come from HA theme variables with
  fallbacks (`var(--warning-color, #ff9800)`). Don't hardcode palette except
  operator brand colors in stock badges.
- Respect `prefers-reduced-motion` for any animation.
- Interactive elements must be keyboard-operable and screen-reader labelled.
- `docs/superpowers/plans/` and `specs/` record prior design decisions (popup
  redesign, row refinement, stock types, config screen). Read the relevant
  doc before changing code it covers; don't undo its intent without a
  documented reason. Notably: `delay_layout` was deliberately removed by the
  2026-04-13 row-refinement plan.
- Dated toolchain (Lit 2, TS 4.9, Rollup 2, ESLint 7) — upgrades are welcome
  as deliberate, tested migrations, not drive-by bumps.
