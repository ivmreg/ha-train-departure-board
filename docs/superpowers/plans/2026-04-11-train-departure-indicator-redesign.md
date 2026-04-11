# Train Departure Indicator Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the train departure indicator to give more horizontal space to destinations, remove redundant "On Time" pills, and present delays as a prominent offset pill next to the scheduled time.

**Architecture:** Modifies the existing Lit custom element (`TrainDepartureBoard`) in `src/train-departure-board.ts`. Updates the internal `getStatusMeta` method to return an optional `offsetStr` string, refactors the row HTML structure to use this offset string instead of `statusLabel`, and updates the CSS styles to remove the old status pill and introduce the offset pill.

**Tech Stack:** TypeScript, Lit Element, HTML/CSS.

---

### Task 1: Update `getStatusMeta` Signature and Logic

**Files:**
- Modify: `src/train-departure-board.ts:760-808`

- [ ] **Step 1: Modify `getStatusMeta` to return `offsetStr`**

Update the method signature and implementation to calculate and return `offsetStr`.

```typescript
    private getStatusMeta(departure: TrainDeparture): { statusLabel: string; statusClass: string; offsetStr?: string } {
        const scheduledRaw = departure.scheduled || '';
        const estimatedRaw = departure.estimated || '';
        const scheduledTime = this.extractTimeLabel(scheduledRaw);
        const estimatedTime = this.extractTimeLabel(estimatedRaw);

        if (
            departure.is_cancelled ||
            departure.status?.toLowerCase().includes('cancel') ||
            departure.etd?.toLowerCase().includes('cancel') ||
            departure.planned_cancel ||
            departure.cancel_reason ||
            estimatedRaw.toLowerCase().includes('cancel')
        ) {
            return { statusLabel: 'Cancelled', statusClass: 'cancelled' };
        }

        if (!estimatedRaw) {
            return { statusLabel: 'Awaiting', statusClass: 'delayed' };
        }

        const normalizedEstimate = estimatedRaw.toLowerCase();
        if (normalizedEstimate === 'on time') {
            return { statusLabel: 'On Time', statusClass: 'on-time' };
        }

        if (estimatedTime && scheduledTime && estimatedTime !== scheduledTime) {
            const delayMins = this.calculateDelayMins(scheduledTime, estimatedTime);
            if (Math.abs(delayMins) <= 1) {
                return { statusLabel: 'On Time', statusClass: 'on-time' };
            }

            let sClass = 'delayed';
            let labelPrefix = 'Exp';
            let offsetStr = `+${delayMins}m`;

            if (delayMins < 0) {
                sClass = 'early';
                labelPrefix = 'Early';
                offsetStr = `${delayMins}m`;
            }
            if (/^\d{2}:\d{2}$/.test(estimatedTime)) {
                return { statusLabel: `${labelPrefix} ${estimatedTime}`, statusClass: sClass, offsetStr };
            }
            return { statusLabel: estimatedTime, statusClass: sClass, offsetStr };
        }

        return { statusLabel: 'On Time', statusClass: 'on-time' };
    }
```

- [ ] **Step 2: Commit changes**

```bash
git add src/train-departure-board.ts
git commit -m "feat: add offset string to getStatusMeta"
```

---

### Task 2: Update CSS Styles

**Files:**
- Modify: `src/train-departure-board.ts:100-200` (approximately)

- [ ] **Step 1: Replace `.time-wrapper` and `.status-pill` CSS**

Replace the `.time-wrapper` rules to use `align-items: center`, `gap: 8px`, and `width: 100px`. Then remove the `.status-pill` block (and its variants) and replace it with `.offset-pill`. Replace `.info-box` block with simplified flex rules.

Search for the CSS blocks and replace them. Here is the updated CSS for those specific blocks:

```typescript
        .time-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100px;
            flex-shrink: 0;
        }
        .scheduled {
            font-size: var(--train-board-time-size, 1.25rem);
            font-weight: 700;
            line-height: 1;
            color: var(--primary-text-color, #111);
            font-family: var(--primary-font-family, sans-serif);
            font-variant-numeric: tabular-nums;
        }
        .time-cancelled .scheduled {
            color: var(--error-color, #f44336);
            text-decoration: line-through;
        }
        .offset-pill {
            font-size: 0.85rem;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
        }
        .offset-pill.late {
            background: var(--warning-color, #ffe0b2);
            color: #d32f2f;
        }
        .offset-pill.early {
            background: var(--success-color, #c8e6c9);
            color: #2e7d32;
        }
        .platform-badge {
            background: var(--disabled-color, #9e9e9e);
            color: #fff;
            font-size: 0.95em;
            font-weight: 700;
            width: 26px;
            height: 26px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .info-box {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .destination-row {
            display: flex;
            align-items: center;
            gap: 8px;
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
            color: var(--primary-text-color, #111);
        }
```

- [ ] **Step 2: Commit changes**

```bash
git add src/train-departure-board.ts
git commit -m "style: update board layout css for offset pill"
```

---

### Task 3: Update `renderDepartureRow` HTML Structure

**Files:**
- Modify: `src/train-departure-board.ts:729-760` (approximately)

- [ ] **Step 1: Replace the HTML return block**

Update the template returned by `renderDepartureRow` to remove the `.status-pill` entirely and inject the `.offset-pill` directly into the `.time-wrapper` div. 

```typescript
    private renderDepartureRow(departure: TrainDeparture, index: number) {
        const scheduledTime = this.extractTimeLabel(departure.scheduled);
        const { statusClass, statusLabel, offsetStr } = this.getStatusMeta(departure);
        const platform = departure.platform ? departure.platform : null;
        const isNextTrain = index === 0;
        const isCancelled = statusClass === 'cancelled';

        const timeClass = isCancelled ? 'time-cancelled' : '';

        return html`
            <div 
                class="train ${isNextTrain ? 'next-train' : ''} ${isCancelled ? 'cancelled-row' : ''}"
                role="listitem" 
                aria-label="${departure.destination_name} at ${scheduledTime}, ${statusLabel}${platform ? `, Platform ${platform}` : ''}"
                @click=${() => this._showDetails(departure)}
            >
                <div class="time-wrapper ${timeClass}">
                    <span class="scheduled" aria-label="Scheduled time">${scheduledTime}</span>
                    ${offsetStr ? html`<span class="offset-pill ${statusClass === 'early' ? 'early' : 'late'}">${offsetStr}</span>` : ''}
                </div>
                <div class="info-box">
                    <div class="destination-row">
                        <h3 class="terminus">${departure.destination_name}</h3>
                        ${this._renderStockBadge(departure)}
                        ${platform ? html`<span class="platform-badge" aria-label="Platform ${platform}">${platform}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }
```

- [ ] **Step 2: Run linter/build to verify everything is correct**

Run the build task to check for syntax or type errors:

```bash
npm run build
```

- [ ] **Step 3: Commit changes**

```bash
git add src/train-departure-board.ts
git commit -m "feat: restructure departure row html to use offset pill"
```