# UI Row Refinement: In-Line Pill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify the UI row layout to include a prominent, explicit in-line status pill directly to the right of the destination.

**Architecture:** The `renderDepartureRow` function in `src/train-departure-board.ts` will be updated to output the new pill HTML and position it within the `destination-row`. The CSS block will be updated to support text truncation for the destination name and styling for the new status pills (On Time, Delayed, Cancelled). We will simplify the logic by removing the `delay_layout` setting dependency as the in-line approach solves all cases.

**Tech Stack:** TypeScript, Lit Element, HTML/CSS

---

### Task 1: Update CSS for Truncation and Pill Styling

**Files:**
- Modify: `src/train-departure-board.ts`

- [ ] **Step 1: Add/Update CSS classes**
Locate the `static styles = css\`` block in `src/train-departure-board.ts`.
Update the `.destination-row`, `.terminus` and add `.status-pill` classes.

```typescript
// Add these styles inside the css`...` block, updating existing `.destination-row` and `.terminus`
        .destination-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            width: 100%;
        }
        .terminus {
            margin: 0;
            font-size: var(--train-board-destination-size, 1rem);
            font-weight: 600;
            line-height: 1.2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 1;
        }
        .status-pill {
            font-size: var(--train-board-status-size, 0.85rem);
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 4px;
            white-space: nowrap;
            color: #fff;
            flex-shrink: 0;
        }
        .status-pill.on-time { background: var(--success-color, #2e7d32); }
        .status-pill.delayed { background: var(--warning-color, #e65100); }
        .status-pill.cancelled { background: var(--error-color, #d32f2f); }
```

- [ ] **Step 2: Verify Compilation**
Run the TypeScript compiler.

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/train-departure-board.ts
git commit -m "style: update UI row CSS for inline status pill and text truncation"
```

---

### Task 2: Update HTML Structure and Logic

**Files:**
- Modify: `src/train-departure-board.ts`

- [ ] **Step 1: Modify `renderDepartureRow` logic**
Locate the `renderDepartureRow` function. Update the pill logic to generate an explicit "On time" pill if applicable, and place it inside `destination-row`.

Replace the `const pillHtml = ...` and the return HTML structure with the following:

```typescript
        const timeClass = isCancelled ? 'time-cancelled' : '';
        const rowSizeClass = `row-size-${this.config.row_size || 'normal'}`;

        let pillHtml = html``;
        if (isCancelled) {
            pillHtml = html`<span class="status-pill cancelled">Cancelled</span>`;
        } else if (statusClass === 'on-time') {
            pillHtml = html`<span class="status-pill on-time">On time</span>`;
        } else if (offsetStr) {
            pillHtml = html`<span class="status-pill delayed">${statusClass === 'early' ? 'Early ' : ''}${offsetStr}</span>`;
        }

        return html`
            <div 
                class="train ${isNextTrain ? 'next-train' : ''} ${isCancelled ? 'cancelled-row' : ''} ${stockRowClass} ${rowSizeClass}"
                role="listitem" 
                aria-label="${departure.destination_name} at ${scheduledTime}, ${statusLabel}${platform ? `, Platform ${platform}` : ''}"
                @click=${() => this._showDetails(departure)}
            >
                <div class="time-wrapper ${timeClass}">
                    <span class="scheduled" aria-label="Scheduled time">${scheduledTime}</span>
                </div>
                <div class="info-box">
                    <div class="destination-col">
                        <div class="destination-row">
                            <h3 class="terminus">${departure.destination_name}</h3>
                            ${platform ? html`<span class="platform-badge" aria-label="Platform ${platform}">${platform}</span>` : ''}
                            ${pillHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
```

- [ ] **Step 2: Verify Compilation**
Run the TypeScript compiler.

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Build**
Run the build script.

Run: `npm run build`
Expected: Successfully generates JS files.

- [ ] **Step 4: Commit**

```bash
git add src/train-departure-board.ts ha-train-departure-board.js ha-train-departure-board.js.map
git commit -m "feat: implement in-line status pill in main UI row"
```