# UI Row Refinement: "In-Line Pill" Design

## Objective
Refine the main UI row for train departures to reintroduce prominent, visually distinct "On Time", "Delayed", and "Cancelled" status indicators. The goal is to provide high visual impact without expanding the row height or requiring the user to scan multiple lines of text.

## Current State
- The status offset (delay pill) is rendered in some layouts, but it lacks the visual prominence of previous iterations.
- Explicit "On Time" status is often implied rather than stated.
- Previous iterations with high visual weight caused the row height to expand significantly and required two lines of content to scan.

## Design: "In-Line Pill" Approach

### Architecture & Layout
- The `time-wrapper` will remain on the far left of the `train` row, occupying its defined fixed width (`5.5rem`).
- The right side of the row will be handled as a single horizontal flex line containing both the destination name and the new status pill.
- The status pill will be placed directly to the right of the destination text, pushed to the far right edge of the row.
- The `destination-row` (or the equivalent container) will be styled as `flex: 1` with `justify-content: space-between` and `align-items: center` to keep the destination and the pill aligned.

### Visuals
- **On Time:** A bold green pill (`#2e7d32` or `var(--success-color)`) with white text explicitly stating "On time".
- **Delayed:** A bright orange pill (`#e65100` or `var(--warning-color)`) with white text (e.g., "Exp 13:08" or "+8m").
- **Cancelled:** A deep red pill (`#d32f2f` or `var(--error-color)`) with white text stating "Cancelled".
- **Styling:** The pill will feature `padding: 2px 8px;`, `border-radius: 4px;`, `font-size: 0.85rem;`, and `font-weight: bold;`.

### Typography & Truncation
- To prevent the destination text from pushing the pill off-screen or forcing a wrap, the destination heading (`.terminus`) must use CSS text truncation: `white-space: nowrap`, `overflow: hidden`, and `text-overflow: ellipsis`.
- The status pill itself will use `white-space: nowrap` to prevent its text from wrapping if horizontal space is tight.

### Logic Updates (`src/train-departure-board.ts`)
- Evaluate the `statusClass` (`'on-time'`, `'late'`, `'early'`, `'cancelled'`) to determine the color of the pill.
- Render explicit "On time" text for `statusClass === 'on-time'` instead of an empty pill or omitting it.
- Update the `pillHtml` template variable to output this newly styled block. Ensure it integrates correctly with the user's selected `delayLayout` setting (or overrides it gracefully if inline is now the standard).

## Expected Outcomes
- High visual impact status indicators that can be scanned rapidly.
- Compact row height maintained via a strict single-line horizontal layout.
- Graceful handling of long destination names via text truncation.

## Testing Strategy
- Compile TypeScript to verify no syntax or type errors.
- Test the UI manually within Home Assistant (or the preview environment) with mock data representing On Time, Delayed, and Cancelled trains.
- Verify that resizing the browser window truncates the destination text before it breaks the pill onto a second line.
