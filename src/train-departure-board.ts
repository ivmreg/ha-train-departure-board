import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TrainDeparture } from './types';

@customElement('train-departure-board')
export class TrainDepartureBoard extends LitElement {
    @property({ type: Object }) hass: any;
    @property({ type: Object }) config: any;
    @property({ type: Array }) departures: TrainDeparture[] = [];

    static getConfigElement() {
        return document.createElement('train-departure-board-editor');
    }

    static getStubConfig() {
        return {
            type: 'custom:train-departure-board',
            title: 'Train Departures',
            entity: '',
            attribute: 'departures'
        };
    }

    setConfig(config: any) {
        if (!config) {
            throw new Error('Invalid configuration');
        }
        const mergedConfig = {
            title: 'Train Departures',
            attribute: 'departures',
            ...config,
        };

        if (typeof mergedConfig.attribute === 'string') {
            mergedConfig.attribute = mergedConfig.attribute.trim() || 'departures';
        } else {
            mergedConfig.attribute = 'departures';
        }

        this.config = mergedConfig;
    }

    static get properties() {
        return {
            hass: {},
            config: {},
            departures: { type: Array }
        };
    }

    static styles = css`
        ha-card {
            height: 100%;
        }
        .card {
            padding: 0 16px 16px;
        }
        .card-header {
            margin: 0;
            padding: 16px 0 8px;
            font-size: 1.4em;
            font-weight: 600;
        }
        .departure-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .train {
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 8px;
            padding: 12px 14px;
            background: var(--ha-card-background, var(--card-background-color, #fff));
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .top-heading {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
        }
        .scheduled-container {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .scheduled {
            font-size: 1.8em;
            font-weight: 600;
            line-height: 1;
        }
        .scheduled-status {
            font-size: 0.85em;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: var(--secondary-text-color, #666);
        }
        .scheduled-status.on-time {
            color: #52aa52;
        }
        .scheduled-status.delayed {
            color: #ffb347;
        }
        .scheduled-status.cancelled {
            color: #f06260;
        }
        .platform-container {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 2px;
            font-size: 0.85em;
            color: var(--secondary-text-color, #666);
        }
        .platform-label {
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }
        .platform {
            font-size: 1.4em;
            font-weight: 600;
            color: var(--primary-text-color, #111);
        }
        .terminus {
            margin: 0;
            font-size: 1.25em;
            font-weight: 600;
        }
        .calling-at {
            margin: 0;
            font-size: 0.9em;
            font-style: italic;
            color: var(--secondary-text-color, #666);
        }
        .no-departures {
            padding: 32px 0;
            text-align: center;
            color: var(--secondary-text-color, #999);
        }
    `;

    render() {
        if (!this.config) {
            return html`<div class="card">No configuration provided</div>`;
        }

        if (!this.config.entity) {
            return html`<div class="card">Please configure an entity</div>`;
        }

        const entity = this.hass?.states?.[this.config.entity];
        if (!entity) {
            return html`<div class="card">Entity not found: ${this.config.entity}</div>`;
        }

        const attributeName = this.config.attribute || 'departures';
        const attributeValue = entity.attributes?.[attributeName];
        const departures = Array.isArray(attributeValue) ? attributeValue : [];

        if (attributeValue === undefined) {
            // eslint-disable-next-line no-console
            console.warn(`train-departure-board: attribute "${attributeName}" was not found on entity ${this.config.entity}`);
        }
        if (!Array.isArray(attributeValue) && attributeValue !== undefined) {
            // eslint-disable-next-line no-console
            console.warn(`train-departure-board: attribute "${attributeName}" is not an array, falling back to empty list`);
        }

        return html`
            <ha-card>
                <div class="card">
                    ${this.config.title ? html`<h1 class="card-header">${this.config.title}</h1>` : ''}
                    ${departures.length > 0
                        ? html`<div class="departure-list">
                            ${departures.map((departure: TrainDeparture) => this.renderDepartureRow(departure))}
                        </div>`
                        : html`<div class="no-departures">No departures available</div>`
                    }
                </div>
            </ha-card>
        `;
    }

    private renderDepartureRow(departure: TrainDeparture) {
        // Extract time from datetime string (format: "13-11-2025 22:51")
        const scheduledTime = departure.scheduled.split(' ')[1];
        const estimatedTime = departure.estimated.split(' ')[1];
        
        // Determine status by comparing scheduled and estimated times
        let statusLabel = 'On time';
        let statusClass = 'on-time';

        if (estimatedTime !== scheduledTime) {
            // Calculate delay in minutes
            const delayMinutes = this.calculateDelayMinutes(departure.scheduled, departure.estimated);
            statusLabel = `Delayed +${delayMinutes} min`;
            statusClass = 'delayed';
        }

        // Prefer `minutes` attribute from the sensor if present, otherwise calculate from estimated/scheduled
        const minutesUntil = departure.minutes ?? this.calculateMinutesUntil(departure.estimated || departure.scheduled);
        const countdown = minutesUntil > 0 ? `in ${minutesUntil} min` : 'Due';
        const statusLine = `${statusLabel} • ${countdown}`;
        const callingAt = this.getCallingAtSummary(departure);

        return html`
            <div class="train">
                <div class="top-heading">
                    <div class="scheduled-container">
                        <span class="scheduled">${scheduledTime}</span>
                        <span class="scheduled-status ${statusClass}">${statusLine}</span>
                    </div>
                    <div class="platform-container">
                        <span class="platform-label">Platform</span>
                        <span class="platform">${departure.platform || '-'}</span>
                    </div>
                </div>
                <h3 class="terminus">${departure.destination_name}</h3>
                ${callingAt ? html`<p class="calling-at">Calling at ${callingAt}</p>` : ''}
            </div>
        `;
    }

    private getCallingAtSummary(departure: TrainDeparture): string | null {
        const stops = departure.stops_of_interest || [];
        if (!stops || stops.length === 0) return null;

        const dedupedStops = new Map<string, { label: string; time: number; timeText: string; order: number }>();

        stops.forEach((stop, index) => {
            const label = (stop.stop || (stop.name ? stop.name.split(' ')[0] : '') || '').trim();
            if (!label) {
                return;
            }

            const datetime = stop.estimate_stop || stop.scheduled_stop;
            const parsedDate = this.parseDateTime(datetime);
            const timestamp = parsedDate?.getTime() ?? Number.POSITIVE_INFINITY;
            const timeText = datetime ? (datetime.split(' ')[1] || '').trim() : '';

            const existing = dedupedStops.get(label);
            if (!existing || timestamp < existing.time) {
                dedupedStops.set(label, {
                    label,
                    time: timestamp,
                    timeText,
                    order: index,
                });
            }
        });

        const sortedStops = Array.from(dedupedStops.values()).sort((a, b) => {
            if (a.time === b.time) {
                return a.order - b.order;
            }
            return a.time - b.time;
        });

        if (sortedStops.length === 0) {
            return null;
        }

        const max = 3;
        const items = sortedStops.slice(0, max).map(info => `${info.label}${info.timeText ? ' ' + info.timeText : ''}`);
        if (sortedStops.length > max) {
            items.push(`+${sortedStops.length - max} more`);
        }

        return items.join(', ');
    }

    private parseDateTime(datetime?: string): Date | null {
        if (!datetime) {
            return null;
        }
        const [datePart, timePart] = datetime.split(' ');
        if (!datePart || !timePart) {
            return null;
        }
        const isoDate = `${datePart.split('-').reverse().join('-')}T${timePart}`;
        const parsed = new Date(isoDate);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    private calculateDelayMinutes(scheduled: string, estimated: string): number {
        // Parse datetime strings in format "13-11-2025 22:51"
        const scheduledParts = scheduled.split(' ');
        const estimatedParts = estimated.split(' ');
        
        const scheduledDate = new Date(`${scheduledParts[0].split('-').reverse().join('-')}T${scheduledParts[1]}`);
        const estimatedDate = new Date(`${estimatedParts[0].split('-').reverse().join('-')}T${estimatedParts[1]}`);
        
        const delayMs = estimatedDate.getTime() - scheduledDate.getTime();
        return Math.round(delayMs / (1000 * 60)); // Convert milliseconds to minutes
    }

    private calculateMinutesUntil(datetime: string): number {
        // Parse datetime strings in format "13-11-2025 22:51"
        const parts = datetime.split(' ');
        const date = new Date(`${parts[0].split('-').reverse().join('-')}T${parts[1]}`);

        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        return Math.max(0, Math.round(diffMs / (1000 * 60))); // minutes until departure; don't return negative
    }
}

// Register with Home Assistant's card registry
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    // Register with the `custom:` prefix so Home Assistant's card picker
    // recognizes the YAML type `custom:train-departure-board`.
    type: 'custom:train-departure-board',
    name: 'Train Departure Board',
    description: 'Display train departure information in a TFL-style board',
    // Enable preview so the card is discoverable in the card picker
    // and shows a preview in the UI.
    preview: true,
    support_url: 'https://github.com/ivmreg/ha-train-departure-board/issues'
});