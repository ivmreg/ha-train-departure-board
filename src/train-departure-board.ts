import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TrainDeparture, TrainDepartureBoardConfig, HomeAssistant } from './types';
import './editor'; // Import the editor to ensure it's registered

@customElement('train-departure-board')
export class TrainDepartureBoard extends LitElement {
    @property({ type: Object }) hass!: HomeAssistant;
    @property({ type: Object }) config!: TrainDepartureBoardConfig;
    @property({ type: Array }) departures: TrainDeparture[] = [];
    @state() private _selectedDeparture: TrainDeparture | null = null;
    private dateCache = new Map<string, Date | null>();
    private lastEntityId: string | null = null;

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

    setConfig(config: TrainDepartureBoardConfig) {
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

    static styles = css`
        ha-card {
            height: 100%;
            background: var(--ha-card-background, var(--card-background-color, #fff));
            color: var(--primary-text-color, #111);
            display: flex;
            flex-direction: column;
        }
        .card-header {
            padding: 12px 16px;
            font-size: 1.2em;
            font-weight: 500;
            color: var(--primary-text-color);
            border-bottom: 1px solid var(--divider-color, #e0e0e0);
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
            cursor: pointer;
            transition: background-color 0.15s ease;
        }
        .train:hover {
            background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
        }
        .train:last-child {
            border-bottom: none;
        }
        .train.next-train {
            background: var(--secondary-background-color, rgba(255, 193, 7, 0.1));
            border-left: 4px solid var(--warning-color, #ff9800);
            padding-left: 8px; /* Compensate for border */
        }
        .train.next-train:hover {
            background: rgba(255, 193, 7, 0.18);
        }
        .train.cancelled-row {
            border-left: 4px solid var(--error-color, #f44336);
            padding-left: 8px;
        }
        .train.cancelled-row.next-train {
            border-left: 4px solid var(--error-color, #f44336);
        }
        .time-wrapper {
            display: flex;
            flex-direction: row;
            align-items: baseline;
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
        .time-cancelled .scheduled {
            color: var(--error-color, #f44336);
            text-decoration: line-through;
        }
        .status-pill {
            font-size: 0.7em;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            white-space: nowrap;
            padding: 2px 8px;
            border-radius: 12px;
            flex-shrink: 0;
        }
        .status-pill.on-time {
            background: var(--success-color, #4caf50);
            color: #fff;
        }
        .status-pill.delayed {
            background: var(--warning-color, #ff9800);
            color: #000;
        }
        .status-pill.cancelled {
            background: var(--error-color, #f44336);
            color: #fff;
        }
        .platform-badge {
            background: var(--disabled-color, #9e9e9e);
            color: #fff;
            font-size: 0.9em;
            font-weight: 700;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
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
            min-width: 0;
        }
        /* Popup overlay styles */
        .popup-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
        }
        .popup-card {
            background: var(--card-background-color, #fff);
            border-radius: 12px;
            max-width: 400px;
            width: 100%;
            max-height: 80vh;
            overflow: auto;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .popup-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-bottom: 1px solid var(--divider-color, #e0e0e0);
            position: sticky;
            top: 0;
            background: var(--card-background-color, #fff);
            border-radius: 12px 12px 0 0;
        }
        .popup-header h2 {
            margin: 0;
            font-size: 1.2em;
            font-weight: 600;
            color: var(--primary-text-color);
        }
        .popup-close {
            background: none;
            border: none;
            font-size: 1.5em;
            cursor: pointer;
            color: var(--secondary-text-color, #666);
            padding: 4px 8px;
            border-radius: 4px;
            line-height: 1;
        }
        .popup-close:hover {
            background: var(--secondary-background-color, rgba(0, 0, 0, 0.1));
        }
        .popup-content {
            padding: 16px;
        }
        .popup-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--divider-color, #e0e0e0);
        }
        .popup-meta-item {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .popup-meta-label {
            font-size: 0.75em;
            color: var(--secondary-text-color, #666);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .popup-meta-value {
            font-size: 0.95em;
            font-weight: 500;
            color: var(--primary-text-color);
        }
        .popup-stops-title {
            font-size: 0.85em;
            font-weight: 600;
            color: var(--secondary-text-color, #666);
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .popup-stops-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .popup-stop {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 0;
            border-bottom: 1px solid var(--divider-color, #e0e0e0);
        }
        .popup-stop:last-child {
            border-bottom: none;
        }
        .popup-stop-time {
            font-size: 0.9em;
            font-weight: 600;
            font-variant-numeric: tabular-nums;
            min-width: 50px;
            color: var(--primary-text-color);
        }
        .popup-stop-name {
            font-size: 0.95em;
            color: var(--primary-text-color);
            flex: 1;
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

        // Clear date cache only when entity changes
        if (this.lastEntityId !== this.config.entity) {
            this.dateCache.clear();
            this.lastEntityId = this.config.entity;
        }

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
                ${this.config.title ? html`<div class="card-header">${this.config.title}</div>` : ''}
                <div class="card">
                    ${departures.length > 0
                        ? html`<div class="departure-list" role="list" aria-label="Train departures">
                            ${departures.map((departure: TrainDeparture, index: number) => this.renderDepartureRow(departure, index))}
                        </div>`
                        : html`<div class="no-departures">No departures available</div>`
                    }
                    ${lastUpdated ? html`<div class="footer">Last updated: ${lastUpdated}</div>` : ''}
                </div>
            </ha-card>
            ${this._renderDetailsPopup()}
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('keydown', this._handleKeyDown);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('keydown', this._handleKeyDown);
    }

    private _handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this._selectedDeparture) {
            this._closePopup();
        }
    };

    private _showDetails(departure: TrainDeparture) {
        this._selectedDeparture = departure;
    }

    private _closePopup() {
        this._selectedDeparture = null;
    }

    private _handleOverlayClick(e: MouseEvent) {
        // Close only if clicking the overlay itself, not the card
        if ((e.target as HTMLElement).classList.contains('popup-overlay')) {
            this._closePopup();
        }
    }

    private _renderDetailsPopup() {
        if (!this._selectedDeparture) return nothing;
        
        const departure = this._selectedDeparture;
        const { statusClass, statusLabel } = this.getStatusMeta(departure);
        const scheduledTime = this.extractTimeLabel(departure.scheduled);
        const stops = this._getStopsForPopup(departure);
        const isCancelled = statusClass === 'cancelled';

        return html`
            <div class="popup-overlay" @click=${this._handleOverlayClick} role="dialog" aria-modal="true" aria-label="Train details">
                <div class="popup-card">
                    <div class="popup-header">
                        <h2>${departure.destination_name}</h2>
                        <button class="popup-close" @click=${this._closePopup} aria-label="Close">&times;</button>
                    </div>
                    <div class="popup-content">
                        <div class="popup-meta">
                            <div class="popup-meta-item">
                                <span class="popup-meta-label">Scheduled</span>
                                <span class="popup-meta-value ${isCancelled ? 'popup-time-cancelled' : ''}">${scheduledTime}</span>
                            </div>
                            <div class="popup-meta-item">
                                <span class="popup-meta-label">Status</span>
                                <span class="status-pill ${statusClass}">${statusLabel}</span>
                            </div>
                            ${departure.platform ? html`
                            <div class="popup-meta-item">
                                <span class="popup-meta-label">Platform</span>
                                <span class="popup-meta-value">${departure.platform}</span>
                            </div>` : ''}
                            ${departure.origin_name ? html`
                            <div class="popup-meta-item">
                                <span class="popup-meta-label">From</span>
                                <span class="popup-meta-value">${departure.origin_name}</span>
                            </div>` : ''}
                            ${departure.operator_name ? html`
                            <div class="popup-meta-item">
                                <span class="popup-meta-label">Operator</span>
                                <span class="popup-meta-value">${departure.operator_name}</span>
                            </div>` : ''}
                        </div>
                        ${stops.length > 0 ? html`
                        <div class="popup-stops-title">Calling at</div>
                        <div class="popup-stops-list">
                            ${stops.map(stop => html`
                                <div class="popup-stop">
                                    <span class="popup-stop-time">${stop.time}</span>
                                    <span class="popup-stop-name">${stop.name}</span>
                                </div>
                            `)}
                        </div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    private _getStopsForPopup(departure: TrainDeparture): { name: string; time: string }[] {
        const stops = departure.stops_of_interest || [];
        const identifier = this.config.stops_identifier || 'description';

        return stops
            .map(stop => {
                let name = '';
                if (identifier === 'tiploc') {
                    name = (stop.stop || '').trim();
                } else if (identifier === 'crs') {
                    name = (stop.crs || stop.name || '').trim();
                } else {
                    name = (stop.name || stop.stop || '').trim();
                }

                const datetime = stop.estimate_stop || stop.scheduled_stop;
                const time = datetime ? (datetime.split(' ')[1] || '').trim() : '';
                const parsedDate = this.parseDateTime(datetime);
                const timestamp = parsedDate?.getTime() ?? Number.POSITIVE_INFINITY;

                return { name, time, timestamp };
            })
            .filter(s => s.name)
            .sort((a, b) => a.timestamp - b.timestamp)
            .map(({ name, time }) => ({ name, time }));
    }

    private renderDepartureRow(departure: TrainDeparture, index: number) {
        const scheduledTime = this.extractTimeLabel(departure.scheduled);
        const { statusClass, statusLabel } = this.getStatusMeta(departure);
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
                </div>
                <div class="info-box">
                    <div class="destination-row">
                        <h3 class="terminus">${departure.destination_name}</h3>
                        <span class="status-pill ${statusClass}" aria-label="Status: ${statusLabel}">${statusLabel}</span>
                        ${platform ? html`<span class="platform-badge" aria-label="Platform ${platform}">${platform}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
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