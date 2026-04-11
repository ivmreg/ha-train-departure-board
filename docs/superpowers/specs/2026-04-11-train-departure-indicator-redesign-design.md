# Train Departure Indicator Redesign

## Goal
Rework the train departure indicator on the main card to provide more horizontal space for the Destination name, remove redundant "On Time" pills, and clarify the presentation of delay/early offset times and cancellations.

## Design Changes

1. **Remove "On Time" Status Pill**
   - The green "On Time" pill is completely removed to save horizontal space and reduce visual clutter.

2. **Consolidate Time and Offsets**
   - **Scheduled Time:** Remains prominently displayed in its original color (unless cancelled).
   - **Delay / Early Offset:** Instead of showing absolute estimated times, delays and early arrivals are calculated as an offset (e.g. `+7m` or `-2m`) and displayed as a colored pill immediately following the scheduled time.

3. **Cancellations**
   - Cancelled trains are indicated by a red strikethrough over the scheduled time.
   - The red left-border indicator on the row remains.
   - The explicit "Cancelled" text pill is removed to keep the row compact.

4. **Preserved Elements**
   - The Destination text now has more available space and will truncate less frequently.
   - The Train Type badge (e.g., `CITY BEAM`, `CLASS 465`) and Platform badge remain completely unchanged in their current styling and location.

## Structural Changes
The HTML structure for each departure row will be updated to:
- Group the scheduled time and the new offset pill into a slightly wider `time-col` element to accommodate the offset side-by-side with the time.
- Place the destination, train type badge, and platform badge into the remaining flexible area.

## Data Processing
- Add or update helper functions to parse the difference between `scheduled` and `estimated` time to generate the `+Xm` / `-Xm` labels accurately.