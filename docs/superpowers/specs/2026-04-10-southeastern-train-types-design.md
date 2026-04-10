# Design Spec: Southeastern Train Type Visual Indicators

Add visual badges to the train departure board to help users identify newer vs. older Southeastern rolling stock at a glance.

## 1. Objectives
- Provide clear visual cues for "Modern" vs "Refurbished" vs "Older" Southeastern trains.
- Use fleet-specific branding colors to make the board feel authentic to the Southeastern experience.
- Gracefully handle missing or incomplete "stock" data.

## 2. Data Mapping Logic
We will map the `stock` attribute from the `TrainDeparture` object to specific fleet categories:

| Input `stock` | Category | Display Label | Visual Style |
| :--- | :--- | :--- | :--- |
| "City Beam", "707" | Modern Metro | CITY BEAM | Teal/Blue Gradient |
| "Javelin", "395" | Highspeed | JAVELIN | Dark Blue + Silver Accent |
| "376" (Refurbished) | Refurbished Metro | REFURB 376 | Navy + Orange Accent |
| "465", "466", "Networker" | Older Metro | CLASS 465 | Simple Grey Text |
| `null`, Other | Standard | (None) | Hidden by default |

*Note: Since the user provided data shows `stock: "City Beam"`, we will prioritize matching against these descriptive strings.*

## 3. Visual Design (Option C - Refined)
Badges will be placed to the left of the status pill in each departure row.

### Badge Styles (CSS)
- **City Beam:** `background: linear-gradient(135deg, #00AEEF 0%, #0054A6 100%);` (Teal to Royal Blue)
- **Javelin:** `background: #002D72; border-left: 3px solid #C0C0C0;` (Navy + Silver)
- **Refurb 376:** `background: #003366; border-right: 3px solid #FF8200;` (Navy + Orange)
- **Older Stock:** `color: var(--secondary-text-color); font-size: 0.7rem; font-weight: 600;`

## 4. Technical Changes

### `src/types.ts`
- No changes required (the `stock` field already exists in `TrainDeparture`).

### `src/train-departure-board.ts`
- **New Method:** `_renderStockBadge(departure: TrainDeparture)`
  - Implements the mapping logic.
  - Returns a Lit-HTML template for the badge or empty string.
- **Style Updates:**
  - Add CSS classes for `.stock-badge`, `.stock-city-beam`, `.stock-javelin`, `.stock-refurb-376`, and `.stock-older`.
  - Ensure the `.destination-row` layout accommodates the new badge without crowding the status pill.
- **Template Update:**
  - Update `renderDepartureRow` to call `_renderStockBadge` and place it before the status pill.

## 5. Testing Strategy
- **Unit Tests:**
  - Verify mapping logic for all identified Southeastern stock strings.
  - Verify that `null` or unknown stock doesn't render a broken badge.
- **Visual Verification:**
  - Use the development environment to confirm badge colors and alignment against the approved mockups.
