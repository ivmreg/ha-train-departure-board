import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TrainDepartureBoardConfig, HomeAssistant } from './types';

// Schema type definition for ha-form
interface HaFormSchema {
    name: string;
    required?: boolean;
    selector?: Record<string, unknown>;
    type?: 'grid' | 'expandable';
    schema?: HaFormSchema[];
    context?: Record<string, string>;
}

// Define the configuration schema
const SCHEMA: HaFormSchema[] = [
    {
        name: 'entity',
        required: true,
        selector: {
            entity: {
                filter: [{ domain: 'sensor' }]
            }
        }
    },
    {
        name: 'title',
        selector: { text: {} }
    },
    {
        type: 'grid',
        name: '',
        schema: [
            {
                name: 'attribute',
                selector: { text: {} }
            },
            {
                name: 'stops_identifier',
                selector: {
                    select: {
                        options: [
                            { value: 'description', label: 'Description (Default)' },
                            { value: 'tiploc', label: 'TIPLOC' },
                            { value: 'crs', label: 'CRS' }
                        ],
                        mode: 'dropdown'
                    }
                }
            }
        ]
    },
    {
        type: 'expandable',
        name: '',
        schema: [
            {
                type: 'grid',
                name: '',
                schema: [
                    {
                        name: 'font_size_time',
                        selector: { text: {} }
                    },
                    {
                        name: 'font_size_destination',
                        selector: { text: {} }
                    },
                    {
                        name: 'font_size_status',
                        selector: { text: {} }
                    }
                ]
            }
        ]
    }
];

// Labels for each field
const LABELS: Record<string, string> = {
    entity: 'Entity',
    title: 'Card Title',
    attribute: 'Data Attribute',
    stops_identifier: 'Station Identifier',
    '': 'Font Sizes',
    font_size_time: 'Time',
    font_size_destination: 'Destination',
    font_size_status: 'Status Pill'
};

// Helper text for fields
const HELPERS: Record<string, string> = {
    entity: 'Select a realtime trains sensor',
    attribute: 'Attribute with departure data (default: departures)',
    stops_identifier: 'How stations are identified in the data',
    font_size_time: 'e.g. 1.5rem (default: 1.25rem)',
    font_size_destination: 'e.g. 1.2rem (default: 1rem)',
    font_size_status: 'e.g. 0.85rem (default: 0.75rem)'
};

declare global {
    interface HTMLElementTagNameMap {
        'train-departure-board-editor': TrainDepartureBoardEditor;
    }
}

@customElement('train-departure-board-editor')
export class TrainDepartureBoardEditor extends LitElement {
    @property({ attribute: false }) public hass!: HomeAssistant;
    @state() private _config?: TrainDepartureBoardConfig;

    public setConfig(config: TrainDepartureBoardConfig): void {
        this._config = config;
    }

    private _computeLabel = (schema: HaFormSchema): string => {
        return LABELS[schema.name] || schema.name;
    };

    private _computeHelper = (schema: HaFormSchema): string | undefined => {
        return HELPERS[schema.name];
    };

    protected render() {
        if (!this.hass || !this._config) {
            return nothing;
        }

        return html`
            <ha-form
                .hass=${this.hass}
                .data=${this._config}
                .schema=${SCHEMA}
                .computeLabel=${this._computeLabel}
                .computeHelper=${this._computeHelper}
                @value-changed=${this._valueChanged}
            ></ha-form>
        `;
    }

    private _valueChanged(ev: CustomEvent): void {
        ev.stopPropagation();
        const config = ev.detail.value;

        // Ensure defaults are preserved
        const newConfig = {
            ...this._config,
            ...config,
            attribute: config.attribute || 'departures',
            stops_identifier: config.stops_identifier || 'description'
        };

        this.dispatchEvent(new CustomEvent('config-changed', {
            detail: { config: newConfig },
            bubbles: true,
            composed: true
        }));
    }
}