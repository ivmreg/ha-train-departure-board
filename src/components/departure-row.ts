import { html, css, LitElement, property } from 'lit';
import { customElement } from 'lit/decorators.js';
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
        return html`
            <div class="departure-row">
                <div class="time">${this.departure.time}</div>
                <div class="destination">${this.departure.destination}</div>
                <div class="status">${this.departure.status}</div>
            </div>
        `;
    }
}