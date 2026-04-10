# Southeastern Train Types Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add visual badges to the train departure board to identify newer vs. older Southeastern rolling stock.

**Architecture:** 
- Add a helper function to map `stock` strings to fleet categories.
- Update the Lit component styles with fleet-specific CSS.
- Add a rendering method to display badges in the departure list.

**Tech Stack:** TypeScript, Lit, CSS, ts-node (for unit tests).

---

### Task 1: Mapping Logic & Unit Tests

**Files:**
- Create: `src/utils.ts`
- Create: `tests/mapping.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Add test script to package.json**

```json
"scripts": {
  ...
  "test": "ts-node tests/mapping.test.ts"
}
```

- [ ] **Step 2: Create a failing test for mapping logic**

```typescript
// tests/mapping.test.ts
import { getStockCategory } from '../src/utils';

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
  } catch (e) {
    console.error(`❌ FAIL: ${name}`);
    console.error(e);
    process.exit(1);
  }
}

test('maps City Beam correctly', () => {
  const result = getStockCategory('City Beam');
  if (result.label !== 'CITY BEAM') throw new Error(`Expected CITY BEAM, got ${result.label}`);
});

test('maps null correctly', () => {
  const result = getStockCategory(null);
  if (result.category !== 'standard') throw new Error(`Expected standard, got ${result.category}`);
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL (module not found)

- [ ] **Step 4: Implement minimal mapping logic**

```typescript
// src/utils.ts
export interface StockInfo {
  category: 'modern' | 'javelin' | 'refurb' | 'older' | 'standard';
  label: string;
}

export function getStockCategory(stock: string | null): StockInfo {
  const s = (stock || '').toLowerCase();
  if (s.includes('city beam') || s.includes('707')) {
    return { category: 'modern', label: 'CITY BEAM' };
  }
  if (s.includes('javelin') || s.includes('395')) {
    return { category: 'javelin', label: 'JAVELIN' };
  }
  if (s.includes('376')) {
    return { category: 'refurb', label: 'REFURB 376' };
  }
  if (s.includes('465') || s.includes('466') || s.includes('networker')) {
    return { category: 'older', label: 'CLASS 465' };
  }
  return { category: 'standard', label: '' };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add package.json src/utils.ts tests/mapping.test.ts
git commit -m "feat: add train type mapping logic and tests"
```

---

### Task 2: Component Styles & Rendering

**Files:**
- Modify: `src/train-departure-board.ts`

- [ ] **Step 1: Add CSS styles for badges**

Add to `static styles = css\``:
```css
.stock-badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.5px;
    white-space: nowrap;
}
.stock-modern {
    background: linear-gradient(135deg, #00AEEF 0%, #0054A6 100%);
    color: white;
}
.stock-javelin {
    background: #002D72;
    color: white;
    border-left: 3px solid #C0C0C0;
}
.stock-refurb {
    background: #003366;
    color: white;
    border-right: 3px solid #FF8200;
}
.stock-older {
    color: var(--secondary-text-color);
    font-weight: 600;
}
```

- [ ] **Step 2: Add _renderStockBadge method**

```typescript
import { getStockCategory } from './utils';
...
private _renderStockBadge(departure: TrainDeparture) {
    const info = getStockCategory(departure.stock);
    if (info.category === 'standard') return nothing;
    
    return html`
        <div class="stock-badge stock-${info.category}">
            ${info.label}
        </div>
    `;
}
```

- [ ] **Step 3: Update renderDepartureRow to include badge**

In `renderDepartureRow`, insert the badge before the status pill:
```typescript
<div class="destination-row">
    <h3 class="terminus">${departure.destination_name}</h3>
    ${this._renderStockBadge(departure)}
    <span class="status-pill ${statusClass}" ...
```

- [ ] **Step 4: Commit**

```bash
git add src/train-departure-board.ts
git commit -m "feat: render Southeastern train type badges on board"
```

---

### Task 3: Final Verification

- [ ] **Step 1: Run build to ensure no TS errors**

Run: `npm run build`
Expected: SUCCESS

- [ ] **Step 2: Verify with sample data**

Manually verify that `sample_entity.json` data would render correctly (using the unit tests from Task 1).

- [ ] **Step 3: Clean up**

Run: `npm run lint`
Expected: PASS
