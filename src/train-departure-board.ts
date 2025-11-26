import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TrainDeparture } from './types';
import './editor'; // Import the editor to ensure it's registered

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
            display: flex;
            flex-direction: column;
        }
        .card {
            padding: 0;
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .departure-list {
            display: flex;
            flex-direction: column;
            padding: 8px;
            gap: 8px;
            flex: 1;
        }
        .train {
            border-bottom: 1px solid var(--divider-color, #e0e0e0);
            padding: 8px 12px;
            background: var(--card-background-color, #fff);
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 16px;
            position: relative;
        }
        .train:last-child {
            border-bottom: none;
        }
        .train.next-train {
            background: var(--secondary-background-color, rgba(255, 193, 7, 0.1));
            border-left: 4px solid var(--warning-color, #ff9800);
            padding-left: 8px; /* Compensate for border */
        }
        .time-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            min-width: 55px;
            flex-shrink: 0;
        }
        .scheduled {
            font-size: 1.4em;
            font-weight: 700;
            line-height: 1;
            color: var(--primary-text-color, #111);
            font-family: var(--primary-font-family, sans-serif);
            font-variant-numeric: tabular-nums;
        }
        .platform-badge {
            background: var(--primary-color, #03a9f4);
            color: #fff;
            font-size: 0.75em;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 10px;
            line-height: 1;
        }
        .info-box {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-width: 0;
            gap: 2px;
        }
        .destination-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            width: 100%;
        }
        .terminus {
            margin: 0;
            font-size: 1.1em;
            font-weight: 600;
            line-height: 1.2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--primary-text-color, #111);
            flex: 1;
        }
        .status-pill {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            white-space: nowrap;
            flex-shrink: 0;
            min-width: 80px;
            text-align: center;
        }
        .status-pill.on-time {
            color: var(--success-color, #4caf50);
            background: rgba(76, 175, 80, 0.1);
        }
        .status-pill.delayed {
            color: var(--warning-color, #ff9800);
            background: rgba(255, 152, 0, 0.1);
        }
        .status-pill.cancelled {
            color: var(--error-color, #f44336);
            background: rgba(244, 67, 54, 0.1);
        }
        .marquee-container {
            overflow: hidden;
            white-space: nowrap;
            position: relative;
            mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
            width: 100%;
        }
        .marquee-content {
            display: inline-block;
            padding-left: 100%;
            animation: marquee 20s linear infinite;
            font-size: 0.85em;
            color: var(--secondary-text-color, #666);
        }
        .marquee-container:hover .marquee-content {
            animation-play-state: paused;
        }
        @keyframes marquee {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-100%, 0); }
        }
        .footer {
            padding: 8px 12px;
            border-top: 1px solid var(--divider-color, #e0e0e0);
            font-size: 0.75em;
            color: var(--secondary-text-color, #666);
            text-align: right;
            background: var(--card-background-color, #fff);
            border-radius: 0 0 8px 8px;
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
        const lastUpdated = entity.last_updated ? new Date(entity.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

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
                            ${departures.map((departure: TrainDeparture, index: number) => this.renderDepartureRow(departure, index))}
                        </div>`
                        : html`<div class="no-departures">No departures available</div>`
                    }
                    ${lastUpdated ? html`<div class="footer">Last updated: ${lastUpdated}</div>` : ''}
                </div>
            </ha-card>
        `;
    }

    private cleanStationName(name: string): string {
        if (name.startsWith('London ')) {
            return name.substring(7);
        }
        return name;
    }

    private renderDepartureRow(departure: TrainDeparture, index: number) {
        const scheduledTime = this.extractTimeLabel(departure.scheduled);
        const { statusClass, statusLabel } = this.getStatusMeta(departure);
        const callingAt = this.getCallingAtSummary(departure);
        const platform = departure.platform ? departure.platform : null;
        const isNextTrain = index === 0;

        return html`
            <div class="train ${isNextTrain ? 'next-train' : ''}">
                <div class="time-wrapper">
                    <span class="scheduled">${scheduledTime}</span>
                    ${platform ? html`<span class="platform-badge">Plat ${platform}</span>` : ''}
                </div>
                <div class="info-box">
                    <div class="destination-row">
                        <h3 class="terminus">${this.cleanStationName(departure.destination_name)}</h3>
                        <span class="status-pill ${statusClass}">${statusLabel}</span>
                    </div>
                    ${callingAt ? html`
                    <div class="marquee-container">
                        <div class="marquee-content">Calling at: ${callingAt}</div>
                    </div>` : ''}
                </div>
            </div>
        `;
    }

    private getCallingAtSummary(departure: TrainDeparture): string | null {
        const stops = departure.stops_of_interest || [];

        const dedupedStops = new Map<string, { label: string; time: number; timeText: string; order: number }>();

        stops.forEach((stop, index) => {
            let label = '';
            const identifier = this.config.stops_identifier || 'description';
            
            if (identifier === 'tiploc') {
                label = (stop.stop || '').trim();
            } else if (identifier === 'crs') {
                label = (stop.crs || stop.name || '').trim();
            } else {
                label = (stop.name || stop.stop || '').trim();
            }

            if (!label) {
                return;
            }
            label = this.cleanStationName(label);

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

        let destinationName = (departure.destination_name || '').trim();
        if (destinationName) {
            destinationName = this.cleanStationName(destinationName);
            const lastStop = sortedStops[sortedStops.length - 1];
            if (!lastStop || lastStop.label.toLowerCase() !== destinationName.toLowerCase()) {
                sortedStops.push({
                    label: destinationName,
                    time: Number.POSITIVE_INFINITY,
                    timeText: '',
                    order: sortedStops.length
                });
            }
        }

        if (sortedStops.length === 0) {
            return null;
        }

        return sortedStops.map(info => `${info.label}${info.timeText ? ' ' + info.timeText : ''}`).join(', ');
    }

    private getStatusMeta(departure: TrainDeparture): { statusLabel: string; statusClass: string } {
        const scheduledRaw = departure.scheduled || '';
        const estimatedRaw = departure.estimated || '';
        const scheduledTime = this.extractTimeLabel(scheduledRaw);
        const estimatedTime = this.extractTimeLabel(estimatedRaw);

        if (
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
            if (/\d{2}:\d{2}/.test(estimatedTime)) {
                return { statusLabel: `Exp ${estimatedTime}`, statusClass: 'delayed' };
            }
            return { statusLabel: estimatedTime, statusClass: 'delayed' };
        }

        return { statusLabel: 'On Time', statusClass: 'on-time' };
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