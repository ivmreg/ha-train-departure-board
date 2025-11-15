import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TrainDeparture } from '../types';

@customElement('departure-row')
export class DepartureRow extends LitElement {
    @property({ type: Object }) departure!: TrainDeparture;

    static styles = css`
        .departure-row {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            border-bottom: 1px solid #ccc;
        }
        .time {
            font-weight: bold;
            color: #333;
        }
        .destination {
            flex-grow: 1;
            margin: 0 10px;
            color: #555;
        }
        .via {
            font-size: 0.78em;
            color: #777;
            margin-top: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .status {
            font-style: italic;
            color: #999;
        }
    `;

    render() {
        const scheduledTime = this.departure.scheduled.split(' ')[1];
        const estimatedTime = this.departure.estimated.split(' ')[1];
        
        let status = 'On Time';
        if (estimatedTime !== scheduledTime) {
            status = 'Delayed';
        }
        
        return html`
            <div class="departure-row">
                <div class="time">${scheduledTime}</div>
                <div class="destination">
                    ${this.departure.destination_name}
                    ${this.departure.stops_of_interest && this.departure.stops_of_interest.length ? ((): any => {
                        const stops = this.departure.stops_of_interest.slice(0,2).map(s => {
                            const time = s.estimate_stop || s.scheduled_stop;
                            const t = time ? time.split(' ')[1] : '';
                            const label = s.stop || (s.name ? s.name.split(' ')[0] : '');
                            return `${label}${t ? ' ' + t : ''}`;
                        });
                        if (this.departure.stops_of_interest.length > 2) stops.push(`+${this.departure.stops_of_interest.length - 2}`);
                        return html`<div class="via">via ${stops.join(' • ')}</div>`;
                    })() : ''}
                </div>
                <div class="status">${status}</div>
            </div>
        `;
    }
}