import { LitElement, html, css, customElement, property } from 'lit-element';
import { HomeAssistant } from 'custom-card-helpers';
import { TrainDeparture } from './types';

@customElement('train-departure-board')
class TrainDepartureBoard extends LitElement {
    @property({ type: Object }) public hass!: HomeAssistant;
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
        
        return html`
            <div class="departure-row">
                <div>${scheduledTime}</div>
                <div>${departure.destination_name}</div>
                <div>${status}</div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'train-departure-board': TrainDepartureBoard;
    }
}