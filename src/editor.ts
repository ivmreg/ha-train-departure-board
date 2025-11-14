import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TrainDepartureBoardConfig } from './types';

@customElement('train-departure-editor')
export class TrainDepartureEditor extends LitElement {
    @property({ type: Object }) public config!: TrainDepartureBoardConfig;

    protected render() {
        return html`
            <div class="editor">
                <h2>Train Departure Board Configuration</h2>
                <div>
                    <label for="routes">Select Train Routes:</label>
                    <select id="routes" @change="${this._onRoutesChange}">
                        <option value="route1">Route 1</option>
                        <option value="route2">Route 2</option>
                        <option value="route3">Route 3</option>
                    </select>
                </div>
                <div>
                    <label for="displayOptions">Display Options:</label>
                    <select id="displayOptions" @change="${this._onDisplayOptionsChange}">
                        <option value="compact">Compact</option>
                        <option value="detailed">Detailed</option>
                    </select>
                </div>
            </div>
        `;
    }

    private _onRoutesChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        this.config.routes = [select.value];
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this.config } }));
    }

    private _onDisplayOptionsChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        this.config.displayOptions = {
            showPlatform: true,
            showStatus: true,
            showJourneyTime: true
        };
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this.config } }));
    }

    static styles = css`
        .editor {
            padding: 16px;
            background-color: var(--card-background-color);
            border-radius: 8px;
        }
        label {
            display: block;
            margin-bottom: 8px;
        }
        select {
            width: 100%;
            padding: 8px;
            margin-bottom: 16px;
        }
    `;
}