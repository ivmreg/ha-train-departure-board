# UI Row Refinement: Time Spacing Removal

## Objective
Refine the main UI row for train departures by removing the empty space directly after the scheduled time on the left side of the dashboard. This creates a more compact and connected visual presentation between the time and the destination.

## Current State
- The `.time-wrapper` container has a fixed width (`flex: 0 0 5.5rem; min-width: 5.5rem;`).
- This fixed width was originally designed to accommodate both the time and potential delay offset pills on the same line within the time wrapper.
- With offset pills moving inline next to the destination (as per the recent visual refinement), this leaves unnecessary empty space after the time, causing the destination text to appear disconnected from the scheduled time.

## Design: Auto-Sizing Width Approach (Option A)

### Architecture & Layout
- The strict fixed width constraint on the `.time-wrapper` will be removed completely.
- The `.time-wrapper` will only consume as much horizontal space as required by its contents (the scheduled time text).
- The existing `gap: 16px;` defined on the parent `.train` container will provide the sole horizontal spacing between the time text and the destination text, keeping them visually linked.

### CSS Changes (`src/train-departure-board.ts`)
- **`.time-wrapper` class:**
  - Remove `flex: 0 0 5.5rem;`
  - Remove `min-width: 5.5rem;`
  - Replace with `flex: 0 0 auto;` and `min-width: auto;`
- **`.layout-stacked .time-wrapper` class:**
  - Remove `flex: 0 0 4.5rem;` and `min-width: 4.5rem;`
  - Replace with `flex: 0 0 auto;` and `min-width: auto;`
- **`.layout-status_line .time-wrapper` class:**
  - Remove `flex: 0 0 4.5rem;` and `min-width: 4.5rem;`
  - Replace with `flex: 0 0 auto;` and `min-width: auto;`

## Expected Outcomes
- The empty gap after the time will be eliminated.
- The visual layout will look tighter and more unified across all row sizes.
- Since we are using an auto-sizing approach, the vertical alignment of the destination text might vary slightly if the width of the time string itself varies (e.g., between "9:00" and "12:00" in non-monospace fonts), but `font-variant-numeric: tabular-nums;` is already applied, which largely mitigates this issue.

## Testing Strategy
- Compile TypeScript and verify no CSS syntax errors.
- Test the UI in a browser to ensure the gap is gone.
- Verify the layout remains consistent and doesn't break when different row configurations (stacked, status line) are used.
