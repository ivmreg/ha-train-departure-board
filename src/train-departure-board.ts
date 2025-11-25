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
            background: var(--ha-card-background, var(--card-background-color, #fff));
            color: var(--primary-text-color, #111);
        }
        .card {
            padding: 8px;
        }
        .departure-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .train {
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 8px;
            padding: 8px 12px;
            background: var(--secondary-background-color, #f9f9f9);
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 16px;
        }
        .time-box {
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-width: 50px;
        }
        .scheduled {
            font-size: 1.5em;
            font-weight: 700;
            line-height: 1;
            color: var(--primary-text-color, #111);
        }
        .info-box {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-width: 0;
            gap: 4px;
        }
        .destination-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }
        .terminus {
            margin: 0;
            font-size: 1.2em;
            font-weight: 600;
            line-height: 1.2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--primary-text-color, #111);
        }
        .status-pill {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            white-space: nowrap;
            flex-shrink: 0;
        }
        .status-pill.on-time {
            background-color: var(--success-color, #4caf50);
            color: #fff;
        }
        .status-pill.delayed {
            background-color: var(--warning-color, #ff9800);
            color: #fff;
        }
        .status-pill.cancelled {
            background-color: var(--error-color, #f44336);
            color: #fff;
        }
        .marquee-container {
            overflow: hidden;
            white-space: nowrap;
            position: relative;
            mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        .marquee-content {
            display: inline-block;
            padding-left: 100%;
            animation: marquee 20s linear infinite;
            font-size: 0.9em;
            color: var(--secondary-text-color, #666);
        }
        @keyframes marquee {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-100%, 0); }
        }
        .platform-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--primary-color, #03a9f4);
            color: #fff;
            padding: 4px 8px;
            border-radius: 6px;
            min-width: 40px;
            flex-shrink: 0;
        }
        .platform-label {
            text-transform: uppercase;
            font-size: 0.6em;
            line-height: 1;
            opacity: 0.9;
        }
        .platform {
            font-size: 1.2em;
            font-weight: 700;
            line-height: 1;
        }
        .no-departures {
            padding: 24px 0;
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
        const platform = departure.platform ? departure.platform : null;

        return html`
            <div class="train">
                <div class="time-box">
                    <span class="scheduled">${scheduledTime}</span>
                </div>
                <div class="info-box">
                    <div class="destination-row">
                        <h3 class="terminus">${departure.destination_name}</h3>
                        <span class="status-pill ${statusClass}">${statusLine}</span>
                    </div>
                    ${callingAt ? html`
                    <div class="marquee-container">
                        <div class="marquee-content">Calling at: ${callingAt}</div>
                    </div>` : ''}
                </div>
                ${platform ? html`
                <div class="platform-container">
                    <span class="platform-label">Plat</span>
                    <span class="platform">${platform}</span>
                </div>` : ''}
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

        return sortedStops.map(info => `${info.label}${info.timeText ? ' ' + info.timeText : ''}`).join(', ');
    }

    private getStatusMeta(departure: TrainDeparture): { statusLabel: string; statusClass: string; countdown: string | null } {
        const scheduledRaw = departure.scheduled || '';
        const estimatedRaw = departure.estimated || '';
        const scheduledTime = this.extractTimeLabel(scheduledRaw);
        const estimatedTime = this.extractTimeLabel(estimatedRaw);
        const countdown = this.formatCountdown(departure);

        if (departure.status?.toLowerCase().includes('cancel')) {
            return { statusLabel: departure.status || 'Cancelled', statusClass: 'cancelled', countdown: null };
        }

        if (departure.etd?.toLowerCase().includes('cancel')) {
            return { statusLabel: 'Cancelled', statusClass: 'cancelled', countdown: null };
        }

        if (departure.planned_cancel) {
            return { statusLabel: 'Cancelled', statusClass: 'cancelled', countdown: null };
        }

        if (departure.cancel_reason) {
            return { statusLabel: 'Cancelled', statusClass: 'cancelled', countdown: null };
        }

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