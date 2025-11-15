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
            font-size: 0.85em;
            color: #777;
            margin-top: 4px;
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
                    ${this.departure.stops_of_interest && this.departure.stops_of_interest.length ? html`<div class="via">via ${this.departure.stops_of_interest.map(s => s.name + (s.estimate_stop ? ' ' + s.estimate_stop.split(' ')[1] : '')).slice(0,3).join(' — ')}${this.departure.stops_of_interest.length > 3 ? ` +${this.departure.stops_of_interest.length - 3} more` : ''}</div>` : ''}
                </div>
                <div class="status">${status}</div>
            </div>
        `;
    }
}