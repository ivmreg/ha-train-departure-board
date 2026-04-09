# Popup Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize and improve the information density of the train departure details popup by replacing the existing meta-data block and simple timeline with a styled "Dense Journey Focus" view.

**Architecture:** Purely presentation-layer CSS and HTML template refactoring inside the Lit `render()` pipeline for the `_renderDetailsPopup` method. No state parsing logic changes needed.

**Tech Stack:** TypeScript, Lit HTML/CSS

---

### Task 1: Update CSS Styles

**Files:**
- Modify: `src/train-departure-board.ts:167-278` (Approximate CSS region for `.popup-header`, `.popup-meta`, and `.popup-stops-list`)

- [ ] **Step 1: Replace old CSS with new Dense Journey Focus CSS**

Locate the `/* Popup overlay styles */` block in `static styles = css\`` and replace the `.popup-header`, `.popup-meta`, and `.popup-stops-*` classes with the following:

```typescript
        /* --- MODERN POPUP (DENSE JOURNEY FOCUS) --- */
        .modern-header {
            padding: 12px 16px;
            background: linear-gradient(to bottom, rgba(255,255,255,0.05), transparent);
            border-bottom: 1px solid var(--divider-color, #e0e0e0);
            position: relative;
            border-radius: 12px 12px 0 0;
        }
        .modern-header-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .modern-dest-group { display: flex; flex-direction: column; gap: 4px; }
        .modern-time-group { display: flex; align-items: baseline; gap: 8px; }
        .modern-scheduled { font-size: 1.4em; color: var(--primary-text-color); font-weight: 700; letter-spacing: 0.5px; font-variant-numeric: tabular-nums; }
        .modern-operator { font-size: 0.85em; color: var(--secondary-text-color, #666); font-weight: 500; }
        .modern-dest { margin: 0; font-size: 1.15em; font-weight: 600; line-height: 1.2; color: var(--primary-text-color); }
        .modern-badges { display: flex; gap: 6px; align-items: center; margin-top: 8px; }
        .modern-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 6px; font-size: 0.8em; font-weight: 600; background: var(--secondary-background-color, rgba(0,0,0,0.05)); }
        .modern-badge.status-ok { background: rgba(76, 175, 80, 0.15); color: var(--success-color, #4caf50); }
        .modern-badge.status-delayed { background: rgba(255, 152, 0, 0.15); color: var(--warning-color, #ff9800); }
        .modern-badge.status-cancelled { background: rgba(244, 67, 54, 0.15); color: var(--error-color, #f44336); }
        .modern-badge.platform { background: rgba(255, 255, 255, 0.1); }
        
        /* Dense Timeline */
        .timeline-container { padding: 12px 16px; background: rgba(0,0,0,0.02); }
        .modern-stops-list { display: flex; flex-direction: column; position: relative; padding-left: 36px; }
        
        /* The Line */
        .modern-stops-list::before { 
            content: ''; 
            position: absolute; 
            left: 14px; 
            top: 14px; 
            bottom: 14px; 
            width: 4px; 
            background: var(--info-color, #03a9f4); 
            border-radius: 2px;
            z-index: 1; 
        }
        
        /* Passed portion of the line */
        .modern-stops-list.has-passed::after {
            content: ''; 
            position: absolute; 
            left: 14px; 
            top: 14px; 
            bottom: 14px;
            width: 4px; 
            background: var(--secondary-text-color, #666); 
            border-radius: 2px 2px 0 0;
            z-index: 2;
            opacity: 0.5;
        }

        .modern-stop { display: flex; align-items: center; gap: 12px; padding: 8px 0; position: relative; z-index: 3; }
        
        /* Station Nodes */
        .modern-stop-circle { 
            position: absolute; 
            left: -26px; 
            top: 50%; 
            transform: translateY(-50%); 
            width: 12px; 
            height: 12px; 
            border-radius: 50%; 
            background: var(--card-background-color, #fff); 
            border: 3px solid var(--info-color, #03a9f4); 
            z-index: 4;
            transition: all 0.2s ease;
        }
        
        .modern-stop.passed .modern-stop-circle { 
            border-color: var(--secondary-text-color, #666);
            background: var(--secondary-text-color, #666);
            width: 8px;
            height: 8px;
            left: -24px;
        }

        .modern-stop.current .modern-stop-circle { 
            border-color: var(--warning-color, #ff9800);
            background: var(--warning-color, #ff9800);
        }
        
        /* Train Position Indicator */
        .modern-train-pos {
            position: absolute;
            left: -33px;
            top: -12px; /* Positioned between stations */
            width: 22px;
            height: 22px;
            background: var(--warning-color, #ff9800);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            box-shadow: 0 0 0 3px var(--card-background-color, #fff), 0 2px 6px rgba(0,0,0,0.5);
            z-index: 5;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 3px var(--card-background-color, #fff), 0 0 0 0 rgba(255, 152, 0, 0.4); }
            70% { box-shadow: 0 0 0 3px var(--card-background-color, #fff), 0 0 0 8px rgba(255, 152, 0, 0); }
            100% { box-shadow: 0 0 0 3px var(--card-background-color, #fff), 0 0 0 0 rgba(255, 152, 0, 0); }
        }

        .modern-stop-time { 
            font-size: 0.95em; 
            font-weight: 700; 
            min-width: 45px; 
            color: var(--primary-text-color);
            font-variant-numeric: tabular-nums;
        }
        
        .modern-stop-info { display: flex; flex-direction: row; align-items: baseline; flex: 1; gap: 8px; justify-content: space-between; min-width: 0; }
        .modern-stop-name { font-size: 0.95em; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .modern-stop-status { font-size: 0.75em; font-weight: 600; white-space: nowrap; }
        .modern-stop-status.on-time { color: var(--success-color, #4caf50); }
        .modern-stop-status.delayed { color: var(--warning-color, #ff9800); }
        .modern-stop-status.cancelled { color: var(--error-color, #f44336); }
        
        .modern-stop.passed .modern-stop-time, 
        .modern-stop.passed .modern-stop-name { 
            color: var(--secondary-text-color, #666); 
            font-weight: 400;
        }
        .modern-stop.passed .modern-stop-status { display: none; }

        /* Terminus special styling */
        .modern-stop:last-child .modern-stop-name { font-weight: 700; }
        .modern-stop:last-child .modern-stop-circle { 
            border-radius: 3px; /* Square for terminus */
            width: 14px;
            height: 14px;
            left: -27px;
        }
```

Remove the unused `.popup-meta`, `.popup-stops-title`, `.popup-train-indicator` classes. Leave `.popup-overlay`, `.popup-card`, `.popup-close` intact.

- [ ] **Step 2: Build project to check CSS syntax**

Run: `npm run build`
Expected: Build passes without Lit parser errors.

- [ ] **Step 3: Commit**

```bash
git add src/train-departure-board.ts
git commit -m "style: replace popup css with modern journey focus styles"
```

### Task 2: Refactor HTML Template in `_renderDetailsPopup`

**Files:**
- Modify: `src/train-departure-board.ts` (inside `_renderDetailsPopup`)

- [ ] **Step 1: Replace HTML structure**

Replace the contents of `<div class="popup-card">` up to the end of `_renderDetailsPopup` with the new structure. Ensure variables map correctly.

```typescript
        const statusBadgeClass = statusClass === 'on-time' ? 'status-ok' : statusClass === 'cancelled' ? 'status-cancelled' : 'status-delayed';
        
        // Check if any stops have passed to color the line
        const hasPassedStops = stops.some(stop => stop.isPassed);

        return html`
            <div class="popup-overlay" @click=${this._handleOverlayClick} role="dialog" aria-modal="true" aria-label="Train details">
                <div class="popup-card">
                    <div class="modern-header">
                        <div class="modern-header-top">
                            <div class="modern-dest-group">
                                <div class="modern-time-group">
                                    <span class="modern-scheduled ${isCancelled ? 'time-cancelled' : ''}">${scheduledTime}</span>
                                    ${departure.operator_name ? html`<span class="modern-operator">${departure.operator_name}</span>` : ''}
                                </div>
                                <h2 class="modern-dest">${departure.destination_name}</h2>
                            </div>
                            <button class="popup-close" @click=${this._closePopup} aria-label="Close">&times;</button>
                        </div>
                        <div class="modern-badges">
                            <div class="modern-badge ${statusBadgeClass}">
                                <span style="font-size: 1.2em; line-height: 1;">●</span> ${statusLabel}
                            </div>
                            ${departure.platform ? html`
                            <div class="modern-badge platform">
                                Platform ${departure.platform}
                            </div>` : ''}
                        </div>
                    </div>
                    
                    <div class="modern-content">
                        ${stops.length > 0 ? html`
                        <div class="timeline-container">
                            <div class="modern-stops-list ${hasPassedStops ? 'has-passed' : ''}">
                                ${stops.map((stop, i) => html`
                                    ${stop.isBetweenPrevious ? html`
                                    <div style="position: relative; height: 6px;" aria-hidden="true">
                                        <div class="modern-train-pos">🚆</div>
                                    </div>
                                    ` : ''}
                                    <div class="modern-stop ${stop.isPassed ? 'passed' : ''} ${stop.isCurrent ? 'current' : ''}">
                                        <div class="modern-stop-circle"></div>
                                        <span class="modern-stop-time">${stop.time}</span>
                                        <div class="modern-stop-info">
                                            <span class="modern-stop-name">${stop.name}</span>
                                            ${!stop.isPassed && !isCancelled ? html`<span class="modern-stop-status on-time">On time</span>` : ''}
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </div>` : ''}
                    </div>
                </div>
            </div>
        `;
```

Note: for now we hardcode "On time" since the `stops` object parsing logic doesn't currently easily expose a difference between the stop's scheduled and estimated time without re-parsing it inside the `html` tag. That is perfectly fine for this presentation-only PR.

- [ ] **Step 2: Build and lint project**

Run: `npm run lint && npm run build`
Expected: Clean build and no lint errors.

- [ ] **Step 3: Commit**

```bash
git add src/train-departure-board.ts
git commit -m "feat: refactor popup html to use new journey focus layout"
```

### Task 3: Stop Status Logic (Optional Polish)

The original HTML just assumed if we were rendering it, we could say "On time" as a placeholder, but actually, we could calculate if that stop is delayed in `_getStopsForPopup` to make it perfect. Let's add that to `_getStopsForPopup`.

**Files:**
- Modify: `src/train-departure-board.ts` (in `_getStopsForPopup` and `_renderDetailsPopup`)

- [ ] **Step 1: Add delay logic to `_getStopsForPopup`**

Find `_getStopsForPopup`. When returning the mapped object, add `statusLabel` and `statusClass`.

```typescript
                const estimatedStr = stop.estimated;
                const scheduledStr = stop.scheduled;
                let stopStatusLabel = 'On time';
                let stopStatusClass = 'on-time';

                if (estimatedStr && scheduledStr && estimatedStr !== scheduledStr) {
                    const estTime = (estimatedStr.split(' ')[1] || '').trim();
                    if (estTime) {
                        stopStatusLabel = `Exp ${estTime}`;
                        stopStatusClass = 'delayed';
                    }
                }
                if (estimatedStr?.toLowerCase().includes('cancel') || stop.is_cancelled) {
                    stopStatusLabel = 'Cancelled';
                    stopStatusClass = 'cancelled';
                }

                // add to returned object:
                return {
                    name,
                    time: datetime ? (datetime.split(' ')[1] || '').trim() : '', // use datetime (which is estimated || scheduled)
                    timestamp,
                    stopCode: stop.stop || '',
                    isPassed: false,
                    isCurrent: false,
                    isBetweenPrevious: false,
                    statusLabel: stopStatusLabel,
                    statusClass: stopStatusClass
                };
```
(Adjust the type signature of `_getStopsForPopup` to include `statusLabel?: string; statusClass?: string;` at the top of the function.)

- [ ] **Step 2: Use in `_renderDetailsPopup`**

Find the hardcoded "On time" in the previous task's HTML and replace it:

```typescript
                                            ${!stop.isPassed && stop.statusLabel ? html`<span class="modern-stop-status ${stop.statusClass}">${stop.statusLabel}</span>` : ''}
```

- [ ] **Step 3: Build and test**

Run: `npm run lint && npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add src/train-departure-board.ts
git commit -m "feat: display per-stop delay status in popup timeline"
```