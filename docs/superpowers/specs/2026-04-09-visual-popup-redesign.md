# HA Train Departure Board - Popup Redesign

## Objective
Modernize and improve the information density of the train departure details popup in the Home Assistant custom card. Shift from a metadata-heavy "list" view to a dense, modern "Journey Focus" view that emphasizes the timeline and current train position.

## Architecture & Implementation Plan

### 1. Styles (`src/train-departure-board.ts`)
Replace existing `.popup-*` CSS classes with the "Dense Journey Focus" styles developed in the mockup phase. Key styling changes include:
*   **Variables:** Introduce `--ha-blue: var(--info-color, #03a9f4)` for the timeline track. Use existing HA variables where possible for theme compatibility.
*   **Header Redesign:** Replace the `h2` and `.popup-meta` block with a structured header featuring:
    *   Large, tabular-nums scheduled time + operator on the top line.
    *   Prominent Destination below it.
    *   Pill-shaped badges for Status (e.g., "On Time") and Platform.
*   **Dense Timeline Redesign:**
    *   Reduce padding to fit more stations vertically.
    *   Thinner connecting line (4px).
    *   Greyed out, semi-transparent top section for passed stations to indicate progress.
    *   Smaller station nodes (12px future, 8px passed).
    *   Add a pulsing train indicator (`🚆`) that visually sits on the track line when `isBetweenPrevious` is true. Use CSS `@keyframes pulse` for the glow effect.
*   **Inline Stop Status:** Move the per-stop status text (e.g., "On time" or delay info) to the same line as the station name, aligned right, reducing the vertical space required per stop.

### 2. Render Logic (`_renderDetailsPopup`)
Refactor the HTML template returned by `_renderDetailsPopup` to match the new CSS structure.
*   **Header Section:** Remove the loop over `popup-meta-item`. Implement the new visual hierarchy directly using the departure object properties (`scheduled`, `operator_name`, `destination_name`, `platform`, and the results from `getStatusMeta()`).
*   **Stops Section:** Update the loop over the `stops` array to output the new dense HTML structure.
    *   Render the stop time and name.
    *   Conditionally render the new inline stop status based on the stop data (e.g., `stop.estimated` vs `stop.scheduled`).
    *   Conditionally render the pulsing train indicator container when a stop's `isBetweenPrevious` property is true.

## Scope & Constraints
*   **Visual Only:** This is a purely presentation-layer change within `train-departure-board.ts`. No changes to data parsing (`_getStopsForPopup` or `getStatusMeta`), configuration (`TrainDepartureBoardConfig`), or the main card layout are required.
*   **Theme Compatibility:** Ensure custom colors fallback gracefully to Home Assistant theme variables (e.g., `--info-color`, `--card-background-color`, `--primary-text-color`).
