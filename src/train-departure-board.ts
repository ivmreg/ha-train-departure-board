import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TrainDeparture } from './types';

@customElement('train-departure-board')
export class TrainDepartureBoard extends LitElement {
    @property({ type: Object }) hass: any;
    @property({ type: Object }) config: any;
    @property({ type: Array }) departures: TrainDeparture[] = [];
    private dateCache = new Map<string, Date | null>();

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
            padding: 12px;
        }
        .departure-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .train {
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 6px;
            padding: 10px 12px;
            background: var(--ha-card-background, var(--card-background-color, #fff));
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .top-heading {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 8px;
        }
        .scheduled-container {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .scheduled {
            font-size: 1.45em;
            font-weight: 600;
            line-height: 1;
        }
        .scheduled-status {
            font-size: 0.78em;
            letter-spacing: 0.03em;
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
            gap: 1px;
            font-size: 0.8em;
            color: var(--secondary-text-color, #666);
        }
        .platform-label {
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }
        .platform {
            font-size: 1.2em;
            font-weight: 600;
            color: var(--primary-text-color, #111);
        }
        .terminus {
            margin: 0;
            font-size: 1.1em;
            font-weight: 600;
        }
        .calling-at {
            margin: 0;
            font-size: 0.85em;
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

        this.dateCache.clear();

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
        const scheduledTime = this.extractTimeLabel(departure.scheduled);
        const { statusClass, statusLabel, countdown } = this.getStatusMeta(departure);
        const statusLine = countdown ? `${statusLabel} • ${countdown}` : statusLabel;
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
            const label = (stop.name || stop.stop || '').trim();
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

    private getStatusMeta(departure: TrainDeparture): { statusLabel: string; statusClass: string; countdown: string | null } {
        const scheduledRaw = departure.scheduled || '';
        const estimatedRaw = departure.estimated || '';
        const scheduledTime = this.extractTimeLabel(scheduledRaw);
        const estimatedTime = this.extractTimeLabel(estimatedRaw);
        const countdown = this.formatCountdown(departure);

        if (!estimatedRaw) {
            return { statusLabel: 'Awaiting update', statusClass: 'delayed', countdown };
        }

        const normalizedEstimate = estimatedRaw.toLowerCase();
        if (normalizedEstimate.includes('cancel')) {
            return { statusLabel: 'Cancelled', statusClass: 'cancelled', countdown: null };
        }

        if (estimatedTime && scheduledTime && estimatedTime !== scheduledTime) {
            const delayMinutes = this.calculateDelayMinutes(scheduledRaw, estimatedRaw);
            const label = Number.isFinite(delayMinutes) ? `Delayed +${delayMinutes} min` : 'Delayed';
            return { statusLabel: label, statusClass: 'delayed', countdown };
        }

        if (!/\d{2}:\d{2}/.test(estimatedTime) && estimatedRaw) {
            return { statusLabel: estimatedRaw, statusClass: 'delayed', countdown };
        }

        return { statusLabel: 'On time', statusClass: 'on-time', countdown };
    }

    private formatCountdown(departure: TrainDeparture): string | null {
        const referenceTime = this.pickReferenceTime(departure);
        const minutesUntil = departure.minutes ?? (referenceTime ? this.calculateMinutesUntil(referenceTime) : Number.NaN);
        if (!Number.isFinite(minutesUntil)) {
            return null;
        }
        return minutesUntil > 0 ? `in ${minutesUntil} min` : 'Due';
    }

    private pickReferenceTime(departure: TrainDeparture): string | undefined {
        if (this.parseDateTime(departure.estimated ?? '')) {
            return departure.estimated;
        }
        if (this.parseDateTime(departure.scheduled ?? '')) {
            return departure.scheduled;
        }
        return undefined;
    }

    private extractTimeLabel(datetime?: string): string {
        if (!datetime) {
            return '—';
        }
        const trimmed = datetime.trim();
        if (!trimmed) {
            return '—';
        }
        const parts = trimmed.split(' ');
        if (parts.length === 2 && /^\d{2}:\d{2}$/.test(parts[1])) {
            return parts[1];
        }
        if (/^\d{2}:\d{2}$/.test(trimmed)) {
            return trimmed;
        }
        return parts.length === 2 ? parts[1] || parts[0] : trimmed;
    }

    private parseDateTime(datetime?: string): Date | null {
        if (!datetime) {
            return null;
        }
        if (this.dateCache.has(datetime)) {
            return this.dateCache.get(datetime) ?? null;
        }
        const [datePart, timePart] = datetime.split(' ');
        let parsed: Date | null = null;
        if (datePart && timePart) {
            const isoDate = `${datePart.split('-').reverse().join('-')}T${timePart}`;
            const candidate = new Date(isoDate);
            parsed = Number.isNaN(candidate.getTime()) ? null : candidate;
        } else if (/^\d{2}:\d{2}$/.test(datetime)) {
            const today = new Date();
            const iso = `${today.toISOString().split('T')[0]}T${datetime}`;
            const candidate = new Date(iso);
            parsed = Number.isNaN(candidate.getTime()) ? null : candidate;
        }
        this.dateCache.set(datetime, parsed);
        return parsed;
    }

    private calculateDelayMinutes(scheduled: string, estimated: string): number {
        const scheduledDate = this.parseDateTime(scheduled);
        const estimatedDate = this.parseDateTime(estimated);
        if (!scheduledDate || !estimatedDate) {
            return Number.NaN;
        }
        const delayMs = estimatedDate.getTime() - scheduledDate.getTime();
        return Math.round(delayMs / (1000 * 60));
    }

    private calculateMinutesUntil(datetime: string): number {
        const target = this.parseDateTime(datetime);
        if (!target) {
            return Number.NaN;
        }
        const now = new Date();
        const diffMs = target.getTime() - now.getTime();
        return Math.max(0, Math.round(diffMs / (1000 * 60)));
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