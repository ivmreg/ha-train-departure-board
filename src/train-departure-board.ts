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
            padding: 0;
        }
        .card-header {
            margin: 0 0 16px 0;
            font-size: 1.5em;
            font-weight: bold;
            padding: 12px 16px 0 16px;
        }
        .departure-row {
            display: grid;
            grid-template-columns: 70px 1fr 70px 100px 100px;
            gap: 12px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--divider-color, #e0e0e0);
            font-size: 14px;
        }
        .departure-row:last-child {
            border-bottom: none;
        }
        .time {
            font-weight: bold;
            font-size: 1.1em;
        }

        .minutes {
            text-align: center;
            color: var(--secondary-text-color, #666);
            font-weight: 600;
            font-size: 0.95em;
        }
        .destination {
            font-weight: 500;
        }
        .via {
            font-size: 0.78em;
            color: var(--secondary-text-color, #777);
            margin-top: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            letter-spacing: 0.2px;
            opacity: 0.95;
        }
        .platform {
            text-align: center;
            font-size: 0.9em;
            color: var(--secondary-text-color, #666);
        }
        .status {
            text-align: right;
            font-weight: 500;
        }
        .status.on-time {
            color: #4caf50;
        }
        .status.delayed {
            color: #ff9800;
        }
        .status.cancelled {
            color: #f44336;
        }
        .no-departures {
            padding: 20px 16px;
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
                        ? departures.map((departure: TrainDeparture) => this.renderDepartureRow(departure))
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
        let status = 'On Time';
        let statusClass = 'on-time';
        
        if (estimatedTime !== scheduledTime) {
            // Calculate delay in minutes
            const delayMinutes = this.calculateDelayMinutes(departure.scheduled, departure.estimated);
            status = `Delayed +${delayMinutes} min`;
            statusClass = 'delayed';
        }
        
        // Prefer `minutes` attribute from the sensor if present, otherwise calculate from estimated/scheduled
        const minutesUntil = departure.minutes ?? this.calculateMinutesUntil(departure.estimated || departure.scheduled);

        return html`
            <div class="departure-row">
                <div class="time">${scheduledTime}</div>
                <div class="destination">
                    ${departure.destination_name}
                    ${this.renderVia(departure)}
                </div>
                <div class="minutes">${minutesUntil > 0 ? `in ${minutesUntil} min` : 'Due'}</div>
                <div class="platform">Platform ${departure.platform}</div>
                <div class="status ${statusClass}">${status}</div>
            </div>
        `;
    }

    private renderVia(departure: TrainDeparture) {
        const stops = departure.stops_of_interest || [];
        if (!stops || stops.length === 0) return html``;

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
            return html``;
        }

        const max = 2;
        const items = sortedStops.slice(0, max).map(info => `${info.label}${info.timeText ? ' ' + info.timeText : ''}`);
        if (sortedStops.length > max) items.push(`+${sortedStops.length - max}`);

        return html`<div class="via">via ${items.join(' • ')}</div>`;
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