import { LitElement, html, css, property } from 'lit';
import { customElement } from 'lit/decorators.js';
import { TrainDeparture } from './types';

@customElement('train-departure-card')
export class TrainDepartureCard extends LitElement {
    @property({ type: Array }) departures: TrainDeparture[] = [];

    static styles = css`
        .card {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding: 16px;
            font-family: Arial, sans-serif;
        }
        .departure-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .departure-row:last-child {
            border-bottom: none;
        }
        .time {
            font-weight: bold;
        }
        .status {
            color: green;
        }
        .status.delayed {
            color: orange;
        }
        .status.cancelled {
            color: red;
        }
    `;

    render() {
        return html`
            <div class="card">
                ${this.departures.map(departure => this.renderDepartureRow(departure))}
            </div>
        `;
    }

    private renderDepartureRow(departure: TrainDeparture) {
        return html`
            <div class="departure-row">
                <div class="time">${departure.time}</div>
                <div>${departure.destination}</div>
                <div class="status ${departure.status.toLowerCase()}">${departure.status}</div>
            </div>
        `;
    }
}