# UI Configuration Screen Redesign

## Objective
Bring all widget configuration settings forward to the main UI configuration screen (the editor) by removing `expandable` sections. This ensures all settings are directly visible and correctly mapped to the root of the configuration object.

## Current State
- The `TrainDepartureBoardConfig` interface defines settings at the root level (e.g., `delay_layout`, `row_size`, `font_size_time`).
- The `src/editor.ts` schema places these settings inside `type: 'expandable'` blocks. 
- Expandable sections in Home Assistant's `ha-form` with a `name` cause the data to nest, which doesn't match the card's expectation that settings are at the root level.
- Even if the name is empty, placing settings in expandables hides them from immediate view.

## Design

### Configuration Schema (src/editor.ts)
The schema will be flattened so that no `expandable` sections are used.

1. **Top Level**
   - Entity (Sensor)
   - Card Title

2. **Data Configuration (2-column grid)**
   - Data Attribute
   - Station Identifier (`stops_identifier`)

3. **Layout Options (2-column grid)**
   - Delay Pill Layout (`delay_layout`)
   - Row Size (`row_size`)

4. **Font Sizes (3-column grid)**
   - Time Font Size (`font_size_time`)
   - Destination Font Size (`font_size_destination`)
   - Status Pill Font Size (`font_size_status`)

### Labels and Helpers
- The unused/invalid `''` key in `LABELS` will be removed if no longer necessary.
- Remaining `LABELS` and `HELPERS` will be verified against the new flattened schema to ensure all fields have accurate descriptions.

### Expected Outcomes
- The card's configuration editor will show all settings upon load without requiring the user to expand sections.
- Saving the form will write all fields correctly to the root of the `config` object, preventing mapping issues.

## Testing Strategy
- Compile the TypeScript code and observe that there are no type errors.
- Test the configuration form directly in Home Assistant to ensure settings save and load properly.
