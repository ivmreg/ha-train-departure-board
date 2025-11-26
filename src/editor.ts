import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TrainDepartureBoardConfig } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'train-departure-board-editor': TrainDepartureEditor;
    }
}

@customElement('train-departure-board-editor')
export class TrainDepartureEditor extends LitElement {
    @property({ type: Object }) public config!: TrainDepartureBoardConfig;
    @property({ type: Object }) public hass: any;

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
                        .value="${this.config.entity || ''}"
                        @change="${this._onEntityChange}"
                    >
                        <option value="">-- Select Entity --</option>
                        ${this._getAvailableEntities().map((entity: any) => html`
                            <option value="${entity.entity_id}">${entity.friendly_name || entity.entity_id}</option>
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
                    <label for="scrolling_mode">Scrolling Mode:</label>
                    <select 
                        id="scrolling_mode"
                        .value="${this.config.scrolling_mode || 'marquee'}"
                        @change="${this._onScrollingModeChange}"
                    >
                        <option value="marquee">Marquee (Default)</option>
                        <option value="scroll_on_hover">Scroll on Hover</option>
                        <option value="static">Static (Ellipsis)</option>
                    </select>
                </div>
                <div class="config-section checkbox-section">
                    <input 
                        id="use_short_names"
                        type="checkbox"
                        .checked="${this.config.use_short_names !== false}"
                        @change="${this._onUseShortNamesChange}"
                    />
                    <label for="use_short_names">Use Short Station Names</label>
                </div>
            </div>
        `;
    }

    private _getAvailableEntities(): Array<{ entity_id: string; friendly_name?: string }> {
        if (!this.hass?.states) return [];
        return Object.values(this.hass.states as any)
            .filter((entity: any) => entity && typeof entity === 'object' && typeof entity.entity_id === 'string' && entity.entity_id.startsWith('sensor.'))
            .slice(0, 20) as Array<{ entity_id: string; friendly_name?: string }>;
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

    private _onScrollingModeChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        this._fireConfigChanged({ scrolling_mode: select.value });
    }

    private _onUseShortNamesChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this._fireConfigChanged({ use_short_names: input.checked });
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
        .checkbox-section {
            flex-direction: row;
            align-items: center;
            gap: 8px;
        }
        .checkbox-section input {
            width: auto;
        }
        .checkbox-section label {
            margin-bottom: 0;
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