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
                <div class="destination">${this.departure.destination_name}</div>
                <div class="status">${status}</div>
            </div>
        `;
    }
}