import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TrainDeparture } from './types';

@customElement('train-departure-board')
class TrainDepartureBoard extends LitElement {
    @property({ type: Array }) public departures: TrainDeparture[] = [];

    static get styles() {
        return css`
            .board {
                display: flex;
                flex-direction: column;
                padding: 16px;
                background-color: #f9f9f9;
                border: 1px solid #ccc;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
                font-size: 1.5em;
                font-weight: bold;
                margin-bottom: 12px;
            }
            .departure-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }
            .departure-row:last-child {
                border-bottom: none;
            }
            .via {
                font-size: 0.78em;
                color: var(--secondary-text-color, #777);
                margin-top: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .minutes {
                text-align: right;
                font-size: 0.9em;
                color: var(--secondary-text-color, #666);
            }
            .right {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                min-width: 80px;
            }
        `;
    }

    protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);
        if (changedProperties.has('departures')) {
            this.requestUpdate();
        }
    }

    protected render() {
        return html`
            <div class="board">
                <div class="header">Train Departures</div>
                ${this.departures.map(departure => this.renderDepartureRow(departure))}
            </div>
        `;
    }

    private renderDepartureRow(departure: TrainDeparture) {
        const scheduledTime = departure.scheduled.split(' ')[1];
        const estimatedTime = departure.estimated.split(' ')[1];
        
        let status = 'On Time';
        if (estimatedTime !== scheduledTime) {
            status = 'Delayed';
        }
        
        const minutesUntil = (departure as any).minutes ?? this.calculateMinutesUntil(departure.estimated || departure.scheduled);

        return html`
            <div class="departure-row">
                <div>${scheduledTime}</div>
                <div>
                    <div>${departure.destination_name}</div>
                    ${this.renderVia(departure)}
                </div>
                <div class="right">
                    <div class="minutes">${minutesUntil > 0 ? `in ${minutesUntil} min` : 'Due'}</div>
                    <div class="status">${status}</div>
                </div>
            </div>
        `;
    }

    private renderVia(departure: TrainDeparture) {
        const stops = departure.stops_of_interest || [];
        if (!stops.length) return html``;

        const max = 2;
        const items = stops.slice(0, max).map(s => {
            const tm = s.estimate_stop || s.scheduled_stop;
            const time = tm ? tm.split(' ')[1] : '';
            const label = s.stop || (s.name ? s.name.split(' ')[0] : '');
            return `${label}${time ? ' ' + time : ''}`;
        });
        if (stops.length > max) items.push(`+${stops.length - max}`);
        return html`<div class="via">via ${items.join(' • ')}</div>`;
    }

    private calculateMinutesUntil(datetime: string): number {
        const parts = datetime.split(' ');
        const date = new Date(`${parts[0].split('-').reverse().join('-')}T${parts[1]}`);
        const now = new Date();
        return Math.max(0, Math.round((date.getTime() - now.getTime()) / (1000 * 60)));
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'train-departure-board': TrainDepartureBoard;
    }
}