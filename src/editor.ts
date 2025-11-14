import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TrainDepartureBoardConfig } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'train-departure-card-editor': TrainDepartureEditor;
    }
}

@customElement('train-departure-card-editor')
export class TrainDepartureEditor extends LitElement {
    @property({ type: Object }) public config!: TrainDepartureBoardConfig;
    @property({ type: Object }) public hass: any;

    protected render() {
        return html`
            <div class="editor">
                <div class="config-section">
                    <label for="title">Card Title:</label>
                    <input 
                        id="title"
                        type="text"
                        .value="${this.config.routes?.[0] || 'Train Departures'}"
                        @change="${this._onTitleChange}"
                        placeholder="Enter card title"
                    />
                </div>
                <div class="config-section">
                    <label for="entity">Select Entity:</label>
                    <select 
                        id="entity"
                        .value="${this.config.routes?.[0] || ''}"
                        @change="${this._onEntityChange}"
                    >
                        <option value="">-- Select Entity --</option>
                        ${this._getAvailableEntities().map(entity => html`
                            <option value="${entity.entity_id}">${entity.friendly_name || entity.entity_id}</option>
                        `)}
                    </select>
                </div>
            </div>
        `;
    }

    private _getAvailableEntities() {
        if (!this.hass?.states) return [];
        return Object.values(this.hass.states as any)
            .filter((entity: any) => entity.entity_id.startsWith('sensor.'))
            .slice(0, 20);
    }

    private _onTitleChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this._fireConfigChanged({ title: input.value });
    }

    private _onEntityChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        this._fireConfigChanged({ entity: select.value });
    }

    private _fireConfigChanged(updates: any) {
        const newConfig = { ...this.config, ...updates };
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
    }

    static styles = css`
        .editor {
            padding: 16px;
            background-color: var(--card-background-color);
            border-radius: 8px;
        }
        .config-section {
            display: flex;
            flex-direction: column;
            margin-bottom: 16px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--primary-text-color);
        }
        input,
        select {
            width: 100%;
            padding: 8px;
            border: 1px solid var(--divider-color);
            border-radius: 4px;
            background-color: var(--card-background-color);
            color: var(--primary-text-color);
            font-family: inherit;
        }
        input:focus,
        select:focus {
            outline: none;
            border-color: var(--primary-color);
        }
    `;
}