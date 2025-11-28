import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TrainDepartureBoardConfig, HomeAssistant } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'train-departure-board-editor': TrainDepartureEditor;
    }
}

@customElement('train-departure-board-editor')
export class TrainDepartureEditor extends LitElement {
    @property({ type: Object }) public config!: TrainDepartureBoardConfig;
    @property({ type: Object }) public hass!: HomeAssistant;

    setConfig(config: TrainDepartureBoardConfig) {
        this.config = config;
    }

    protected render() {
        return html`
            <div class="editor">
                <div class="config-section">
                    <label for="title">Card Title:</label>
                    <input 
                        id="title"
                        type="text"
                        .value="${this.config.title || ''}"
                        @change="${this._onTitleChange}"
                        placeholder="Train Departures"
                    />
                </div>
                <div class="config-section">
                    <label for="entity">Select Entity:</label>
                    <select 
                        id="entity"
                        @change="${this._onEntityChange}"
                    >
                        <option value="" ?selected="${!this.config.entity}">-- Select Entity --</option>
                        ${this._getAvailableEntities().map((entity: any) => html`
                            <option value="${entity.entity_id}" ?selected="${this.config.entity === entity.entity_id}">${entity.friendly_name || entity.entity_id}</option>
                        `)}
                    </select>
                </div>
                <div class="config-section">
                    <label for="attribute">Attribute (optional):</label>
                    <input 
                        id="attribute"
                        type="text"
                        .value="${this.config.attribute || 'departures'}"
                        @change="${this._onAttributeChange}"
                        placeholder="departures"
                    />
                </div>
                <div class="config-section">
                    <label for="stops_identifier">Stops Identifier:</label>
                    <select 
                        id="stops_identifier"
                        @change="${this._onStopsIdentifierChange}"
                    >
                        <option value="description" ?selected="${(this.config.stops_identifier || 'description') === 'description'}">Description (Default)</option>
                        <option value="tiploc" ?selected="${this.config.stops_identifier === 'tiploc'}">TIPLOC</option>
                        <option value="crs" ?selected="${this.config.stops_identifier === 'crs'}">CRS</option>
                    </select>
                </div>
            </div>
        `;
    }

    private _getAvailableEntities(): Array<{ entity_id: string; friendly_name?: string }> {
        if (!this.hass?.states) return [];
        return Object.values(this.hass.states as any)
            .filter((entity: any) => entity && typeof entity === 'object' && typeof entity.entity_id === 'string' && entity.entity_id.startsWith('sensor.'))
            .map((entity: any) => ({ entity_id: entity.entity_id, friendly_name: entity.attributes?.friendly_name }))
            .sort((a, b) => (a.friendly_name || a.entity_id).localeCompare(b.friendly_name || b.entity_id));
    }

    private _onTitleChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this._fireConfigChanged({ title: input.value });
    }

    private _onEntityChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        this._fireConfigChanged({ entity: select.value });
    }

    private _onAttributeChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this._fireConfigChanged({ attribute: input.value });
    }

    private _onStopsIdentifierChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        this._fireConfigChanged({ stops_identifier: select.value as 'tiploc' | 'crs' | 'description' });
    }

    private _fireConfigChanged(updates: Partial<TrainDepartureBoardConfig>) {
        const newConfig = { ...this.config, ...updates };
        this.dispatchEvent(new CustomEvent('config-changed', {
            detail: { config: newConfig },
            bubbles: true,
            composed: true
        }));
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