import { LitElement, html, css, property } from 'lit';
import { customElement } from 'lit/decorators.js';
import { TrainDeparture } from './types';

@customElement('train-departure-card')
export class TrainDepartureCard extends LitElement {
    @property({ type: Object }) hass: any;
    @property({ type: Object }) config: any;
    @property({ type: Array }) departures: TrainDeparture[] = [];

    static getConfigElement() {
        return document.createElement('train-departure-card-editor');
    }

    static getStubConfig() {
        return {
            entity: '',
            title: 'Train Departures'
        };
    }

    setConfig(config: any) {
        this.config = config;
    }

    static styles = css`
        .card {
            background-color: #fff;
            border-radius: 8px;
            padding: 16px;
            font-family: Arial, sans-serif;
        }
        .card-header {
            margin: 0 0 16px 0;
            font-size: 1.5em;
            font-weight: bold;
        }
        .departure-row {
            display: grid;
            grid-template-columns: 70px 1fr 100px 100px;
            gap: 12px;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .departure-row:last-child {
            border-bottom: none;
        }
        .time {
            font-weight: bold;
            font-size: 1.1em;
        }
        .destination {
            font-weight: 500;
        }
        .platform {
            text-align: center;
            font-size: 0.9em;
            color: #666;
        }
        .status {
            text-align: right;
            font-weight: 500;
        }
        .status.on-time {
            color: #4caf50;
        }
        .status.delayed {
            color: #ff9800;
        }
        .status.cancelled {
            color: #f44336;
        }
    `;

    render() {
        if (!this.config) {
            return html`<div class="card">No configuration provided</div>`;
        }

        return html`
            <ha-card>
                <div class="card">
                    ${this.config.title ? html`<h1 class="card-header">${this.config.title}</h1>` : ''}
                    ${this.departures.map(departure => this.renderDepartureRow(departure))}
                </div>
            </ha-card>
        `;
    }

    private renderDepartureRow(departure: TrainDeparture) {
        // Extract time from datetime string (format: "13-11-2025 22:51")
        const scheduledTime = departure.scheduled.split(' ')[1];
        const estimatedTime = departure.estimated.split(' ')[1];
        
        // Determine status by comparing scheduled and estimated times
        let status = 'On Time';
        let statusClass = 'on-time';
        
        if (estimatedTime !== scheduledTime) {
            status = 'Delayed';
            statusClass = 'delayed';
        }
        
        return html`
            <div class="departure-row">
                <div class="time">${scheduledTime}</div>
                <div class="destination">${departure.destination_name}</div>
                <div class="platform">Platform ${departure.platform}</div>
                <div class="status ${statusClass}">${status}</div>
            </div>
        `;
    }
}

// Register the card with Home Assistant
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: 'train-departure-card',
    name: 'Train Departure Board',
    description: 'Display train departure information in a TFL-style board'
});