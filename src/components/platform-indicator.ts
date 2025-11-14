import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('platform-indicator')
export class PlatformIndicator extends LitElement {
    @property({ type: String }) platform = '';
    @property({ type: String }) status = '';

    static styles = css`
        .platform-indicator {
            display: flex;
            align-items: center;
            padding: 10px;
            border-radius: 5px;
            background-color: #f0f0f0;
            font-family: Arial, sans-serif;
            font-size: 16px;
        }
        .platform {
            font-weight: bold;
            margin-right: 10px;
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
            <div class="platform-indicator">
                <span class="platform">Platform: ${this.platform}</span>
                <span class="status ${this.status.toLowerCase()}">${this.status}</span>
            </div>
        `;
    }
}