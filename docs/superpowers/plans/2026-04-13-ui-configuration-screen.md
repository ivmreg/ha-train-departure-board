# UI Configuration Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring all widget configuration settings forward to the main UI configuration screen by removing `expandable` sections from the editor schema.

**Architecture:** The `ha-form` schema in `src/editor.ts` will be updated to remove `type: 'expandable'` wrappers, moving all configuration fields to the root level or into `type: 'grid'` layouts. This ensures all settings map correctly to the root of the configuration object.

**Tech Stack:** TypeScript, Lit, Home Assistant Frontend

---

### Task 1: Flatten Configuration Schema in Editor

**Files:**
- Modify: `src/editor.ts`

- [ ] **Step 1: Update the SCHEMA definition**
Modify the `SCHEMA` array in `src/editor.ts` to remove the `expandable` types. Replace it with the following flattened structure:

```typescript
// Define the configuration schema
const SCHEMA: HaFormSchema[] = [
    {
        name: 'entity',
        required: true,
        selector: {
            entity: {
                filter: [{ domain: 'sensor' }]
            }
        }
    },
    {
        name: 'title',
        selector: { text: {} }
    },
    {
        type: 'grid',
        name: '',
        schema: [
            {
                name: 'attribute',
                selector: { text: {} }
            },
            {
                name: 'stops_identifier',
                selector: {
                    select: {
                        options: [
                            { value: 'description', label: 'Description (Default)' },
                            { value: 'tiploc', label: 'TIPLOC' },
                            { value: 'crs', label: 'CRS' }
                        ],
                        mode: 'dropdown'
                    }
                }
            }
        ]
    },
    {
        type: 'grid',
        name: '',
        schema: [
            {
                name: 'delay_layout',
                selector: {
                    select: {
                        options: [
                            { value: 'inline', label: 'Inline (Default)' },
                            { value: 'stacked', label: 'Stacked' },
                            { value: 'status_line', label: 'Status Line' }
                        ],
                        mode: 'dropdown'
                    }
                }
            },
            {
                name: 'row_size',
                selector: {
                    select: {
                        options: [
                            { value: 'compact', label: 'Compact' },
                            { value: 'normal', label: 'Normal (Default)' },
                            { value: 'comfortable', label: 'Comfortable' }
                        ],
                        mode: 'dropdown'
                    }
                }
            }
        ]
    },
    {
        type: 'grid',
        name: '',
        schema: [
            {
                name: 'font_size_time',
                selector: { text: {} }
            },
            {
                name: 'font_size_destination',
                selector: { text: {} }
            },
            {
                name: 'font_size_status',
                selector: { text: {} }
            }
        ]
    }
];
```

- [ ] **Step 2: Verify TypeScript Compilation**
Run the TypeScript compiler to ensure there are no syntax or type errors.

Run: `npx tsc --noEmit`
Expected: PASS (No output or errors)

- [ ] **Step 3: Commit**

```bash
git add src/editor.ts
git commit -m "refactor(editor): flatten configuration schema"
```

---

### Task 2: Clean Up Form Labels and Helpers

**Files:**
- Modify: `src/editor.ts`

- [ ] **Step 1: Update LABELS dictionary**
Remove the unused `''` and `layout_options` keys from the `LABELS` dictionary in `src/editor.ts`.

```typescript
// Labels for each field
const LABELS: Record<string, string> = {
    entity: 'Entity',
    title: 'Card Title',
    attribute: 'Data Attribute',
    stops_identifier: 'Station Identifier',
    delay_layout: 'Delay Pill Layout',
    row_size: 'Row Size',
    font_size_time: 'Time Font Size',
    font_size_destination: 'Destination Font Size',
    font_size_status: 'Status Pill Font Size'
};
```

- [ ] **Step 2: Verify TypeScript Compilation**
Run the TypeScript compiler to ensure the changes are valid.

Run: `npx tsc --noEmit`
Expected: PASS (No output or errors)

- [ ] **Step 3: Commit**

```bash
git add src/editor.ts
git commit -m "chore(editor): clean up unused labels"
```
