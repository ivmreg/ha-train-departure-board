import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  TrainDeparture,
  TrainDepartureBoardConfig,
  HomeAssistant,
} from './types';
import {
  getStockCategory,
  extractTimeLabel,
  formatRelativeMinutes,
  getStatusMeta,
  getStopsForPopup,
  isCatchable,
} from './utils';
import './editor'; // Import the editor to ensure it's registered

@customElement('train-departure-board')
export class TrainDepartureBoard extends LitElement {
  @property({ type: Object }) hass!: HomeAssistant;
  @property({ type: Object }) config!: TrainDepartureBoardConfig;
  @property({ type: Array }) nextTrains: TrainDeparture[] = [];
  @state() private _selectedDeparture: TrainDeparture | null = null;
  private dateCache = new Map<string, Date | null>();
  private lastEntityId: string | null = null;
  private _returnFocusTo: HTMLElement | null = null;

  static getConfigElement() {
    return document.createElement('train-departure-board-editor');
  }

  static getStubConfig() {
    return {
      type: 'custom:train-departure-board',
      title: 'Train Departures',
      entity: '',
      attribute: 'next_trains',
    };
  }

  setConfig(config: TrainDepartureBoardConfig) {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    const mergedConfig = {
      attribute: 'next_trains',
      ...config,
    };

    if (typeof mergedConfig.attribute === 'string') {
      mergedConfig.attribute = mergedConfig.attribute.trim() || 'next_trains';
    } else {
      mergedConfig.attribute = 'next_trains';
    }

    this.config = mergedConfig;
  }

  static styles = css`
    ha-card {
      height: 100%;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color, #111);
      display: flex;
      flex-direction: column;
    }
    .card-header {
      padding: 12px 16px;
      font-size: 1.2em;
      font-weight: 500;
      color: var(--primary-text-color);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .card {
      padding: 0;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .departure-list {
      display: flex;
      flex-direction: column;
      padding: 8px;
      gap: 8px;
      flex: 1;
    }
    .train {
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      padding: 8px 12px;
      background: var(--card-background-color, #fff);
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 16px;
      position: relative;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }
    .train:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .train:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -2px;
    }
    .train:last-child {
      border-bottom: none;
    }
    /* Row density */
    .train.row-size-compact {
      padding-top: 3px;
      padding-bottom: 3px;
      gap: 10px;
    }
    .train.row-size-comfortable {
      padding-top: 16px;
      padding-bottom: 16px;
    }
    /* Departures the viewer can no longer reach given walk_time_minutes */
    .train.unreachable {
      opacity: 0.55;
    }
    .train.next-train {
      background: var(--secondary-background-color, rgba(255, 193, 7, 0.1));
      border-left: 4px solid var(--warning-color, #ff9800);
      padding-left: 8px; /* Compensate for border */
    }
    .train.next-train:hover {
      background: rgba(255, 193, 7, 0.18);
    }
    .train.cancelled-row {
      border-left: 4px solid var(--error-color, #f44336);
      padding-left: 8px;
    }
    .train.cancelled-row.next-train {
      border-left: 4px solid var(--error-color, #f44336);
    }

    /* Right border for train type / stock */
    .train.stock-row-modern {
      border-right: 4px solid #00aeef;
      padding-right: 8px;
    }
    .train.stock-row-javelin {
      border-right: 4px solid #002d72;
      padding-right: 8px;
    }
    .train.stock-row-refurb {
      border-right: 4px solid #003366;
      padding-right: 8px;
    }
    .time-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 2px;
      flex: 0 0 auto;
      min-width: auto;
    }
    .scheduled {
      font-size: var(--train-board-time-size, 1.25rem);
      font-weight: 700;
      line-height: 1;
      color: var(--primary-text-color, #111);
      font-family: var(--primary-font-family, sans-serif);
      font-variant-numeric: tabular-nums;
    }
    .time-cancelled .scheduled {
      color: var(--error-color, #f44336);
      text-decoration: line-through;
    }
    .relative-time {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--secondary-text-color, #666);
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .scheduled.relative-primary {
      font-size: var(--train-board-time-size, 1.25rem);
    }
    .offset-pill {
      font-size: 0.85rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .offset-pill.late {
      background: var(--warning-color, #ffe0b2);
      color: #d32f2f;
    }
    .offset-pill.early {
      background: var(--success-color, #c8e6c9);
      color: #2e7d32;
    }
    .platform-badge {
      font-size: 0.75em;
      font-weight: 700;
      padding: 2px 6px;
      min-width: 26px;
      height: 22px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      color: var(--secondary-text-color, #666);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      flex-shrink: 0;
      box-sizing: border-box;
    }
    .info-box {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .destination-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      width: 100%;
    }
    .terminus {
      margin: 0;
      font-size: var(--train-board-destination-size, 1rem);
      font-weight: 600;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      color: var(--primary-text-color, #111);
    }
    .carriages-badge {
      font-size: 0.75em;
      font-weight: 700;
      padding: 2px 4px;
      width: 44px;
      height: 22px;
      border-radius: 4px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      color: var(--secondary-text-color, #666);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      white-space: nowrap;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
    .status-pill {
      font-size: var(--train-board-status-size, 0.75rem);
      font-weight: 700;
      padding: 2px 6px;
      height: 22px;
      border-radius: 4px;
      white-space: nowrap;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
    .status-pill.on-time {
      background: rgba(46, 125, 50, 0.1);
      color: var(--success-color, #2e7d32);
      border: 1px solid rgba(46, 125, 50, 0.25);
    }
    .status-pill.delayed {
      background: rgba(230, 81, 0, 0.1);
      color: var(--warning-color, #e65100);
      border: 1px solid rgba(230, 81, 0, 0.25);
    }
    .status-pill.early {
      background: rgba(33, 150, 243, 0.1);
      color: var(--info-color, #2196f3);
      border: 1px solid rgba(33, 150, 243, 0.25);
    }
    .status-pill.cancelled {
      background: rgba(211, 47, 47, 0.1);
      color: var(--error-color, #d32f2f);
      border: 1px solid rgba(211, 47, 47, 0.25);
    }
    /* Popup overlay styles */
    .popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .popup-card {
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      max-width: 400px;
      width: 100%;
      max-height: 80vh;
      overflow: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    /* --- MODERN POPUP (DENSE JOURNEY FOCUS) --- */
    .modern-header {
      padding: 12px 16px;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.05),
        transparent
      );
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      position: relative;
      border-radius: 12px 12px 0 0;
    }
    .modern-header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .modern-dest-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .modern-time-group {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .modern-scheduled {
      font-size: 1.4em;
      color: var(--primary-text-color);
      font-weight: 700;
      letter-spacing: 0.5px;
      font-variant-numeric: tabular-nums;
    }
    .modern-operator {
      font-size: 0.85em;
      color: var(--secondary-text-color, #666);
      font-weight: 500;
    }
    .modern-dest {
      margin: 0;
      font-size: 1.15em;
      font-weight: 600;
      line-height: 1.2;
      color: var(--primary-text-color);
    }
    .modern-badges {
      display: flex;
      gap: 6px;
      align-items: center;
      margin-top: 8px;
    }
    .modern-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.8em;
      font-weight: 600;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
    }
    .modern-badge.status-ok {
      background: rgba(76, 175, 80, 0.15);
      color: var(--success-color, #4caf50);
    }
    .modern-badge.status-delayed {
      background: rgba(255, 152, 0, 0.15);
      color: var(--warning-color, #ff9800);
    }
    .modern-badge.status-cancelled {
      background: rgba(244, 67, 54, 0.15);
      color: var(--error-color, #f44336);
    }
    .modern-badge.platform {
      background: rgba(255, 255, 255, 0.1);
    }
    .modern-badge.stock-badge {
      font-size: 0.85em;
      padding: 4px 8px;
    }

    /* Dense Timeline */
    .timeline-container {
      padding: 12px 16px;
      background: rgba(0, 0, 0, 0.02);
    }
    .modern-stops-list {
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* The Line */
    .modern-stops-list::before {
      content: '';
      position: absolute;
      left: 15px;
      transform: translateX(-50%);
      top: 14px;
      bottom: 14px;
      width: 4px;
      background: var(--info-color, #03a9f4);
      border-radius: 2px;
      z-index: 1;
    }

    /* Passed portion of the line */
    .modern-stops-list.has-passed::after {
      content: '';
      position: absolute;
      left: 15px;
      transform: translateX(-50%);
      top: 14px;
      bottom: 14px;
      width: 4px;
      background: var(--secondary-text-color, #666);
      border-radius: 2px 2px 0 0;
      z-index: 2;
      opacity: 0.5;
    }

    /* Stop rows */
    .modern-stop,
    .modern-train-pos-wrapper {
      display: grid;
      grid-template-columns: 30px 1fr;
      gap: 12px;
      align-items: center;
      position: relative;
      z-index: 3;
    }

    .modern-stop {
      padding: 8px 0;
    }
    .modern-train-pos-wrapper {
      height: 6px;
      padding: 0;
    }

    /* Graphics column */
    .modern-stop-graphic {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
    }

    /* Station Nodes */
    .modern-stop-circle {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--card-background-color, #fff);
      border: 3px solid var(--info-color, #03a9f4);
      z-index: 4;
      transition: all 0.2s ease;
    }

    .modern-stop.passed .modern-stop-circle {
      border-color: var(--secondary-text-color, #666);
      background: var(--secondary-text-color, #666);
      width: 8px;
      height: 8px;
    }

    .modern-stop.current .modern-stop-circle {
      border-color: var(--warning-color, #ff9800);
      background: var(--warning-color, #ff9800);
    }

    /* Train Position Indicator */
    .modern-train-pos {
      width: 22px;
      height: 22px;
      background: var(--warning-color, #ff9800);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      box-shadow: 0 0 0 3px var(--card-background-color, #fff),
        0 2px 6px rgba(0, 0, 0, 0.5);
      z-index: 5;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 3px var(--card-background-color, #fff),
          0 0 0 0 rgba(255, 152, 0, 0.4);
      }
      70% {
        box-shadow: 0 0 0 3px var(--card-background-color, #fff),
          0 0 0 8px rgba(255, 152, 0, 0);
      }
      100% {
        box-shadow: 0 0 0 3px var(--card-background-color, #fff),
          0 0 0 0 rgba(255, 152, 0, 0);
      }
    }

    .modern-stop-content {
      display: flex;
      align-items: baseline;
      gap: 12px;
      min-width: 0;
    }

    .modern-stop-time {
      font-size: 0.95em;
      font-weight: 700;
      min-width: 45px;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }

    .modern-stop-info {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      flex: 1;
      gap: 8px;
      justify-content: space-between;
      min-width: 0;
    }
    .modern-stop-name {
      font-size: 0.95em;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .modern-stop-status {
      font-size: 0.75em;
      font-weight: 600;
      white-space: nowrap;
    }
    .modern-stop-status.on-time {
      color: var(--success-color, #4caf50);
    }
    .modern-stop-status.delayed {
      color: var(--warning-color, #ff9800);
    }
    .modern-stop-status.early {
      color: var(--info-color, #2196f3);
    }
    .modern-stop-status.cancelled {
      color: var(--error-color, #f44336);
    }

    .modern-stop.passed .modern-stop-time,
    .modern-stop.passed .modern-stop-name {
      color: var(--secondary-text-color, #666);
      font-weight: 400;
    }
    .modern-stop.passed .modern-stop-status {
      display: none;
    }

    /* Terminus special styling */
    .modern-stop:last-child .modern-stop-name {
      font-weight: 700;
    }
    .modern-stop:last-child .modern-stop-circle {
      border-radius: 3px; /* Square for terminus */
      width: 14px;
      height: 14px;
    }
    .footer {
      padding: 8px 12px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      font-size: 0.85em;
      color: var(--secondary-text-color, #666);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
      background: var(--card-background-color, #fff);
      border-radius: 0 0 8px 8px;
    }
    .stale-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.85em;
      font-weight: 600;
      background: rgba(230, 81, 0, 0.12);
      color: var(--warning-color, #e65100);
      border: 1px solid rgba(230, 81, 0, 0.3);
      margin-right: auto;
    }
    .board-message {
      padding: 32px 16px;
      text-align: center;
      color: var(--secondary-text-color, #999);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .board-message .message-icon {
      font-size: 1.8em;
      line-height: 1;
      opacity: 0.7;
    }
    .board-message .message-text {
      font-size: 0.95em;
    }
    .board-message.error .message-text {
      color: var(--error-color, #d32f2f);
    }
    .popup-close {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
      color: var(--primary-text-color, #111);
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      font-size: 1.2em;
      line-height: 1;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .popup-close:hover {
      background: var(--divider-color, rgba(0, 0, 0, 0.12));
    }
    .popup-close:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .last-seen {
      margin-top: 8px;
      font-size: 0.8em;
      color: var(--secondary-text-color, #666);
    }
    @media (prefers-reduced-motion: reduce) {
      .modern-train-pos {
        animation: none;
      }
      .train {
        transition: none;
      }
      .modern-stop-circle {
        transition: none;
      }
    }
    .stock-badge {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    .stock-modern {
      background: linear-gradient(135deg, #00aeef 0%, #0054a6 100%);
      color: white;
    }
    .stock-javelin {
      background: #002d72;
      color: white;
      border-left: 3px solid #c0c0c0;
    }
    .stock-refurb {
      background: #003366;
      color: white;
      border-right: 3px solid #ff8200;
    }
    .stock-older {
      color: var(--secondary-text-color);
      font-weight: 600;
    }
  `;

  private _renderMessage(icon: string, message: string, isError = false) {
    return html`
      <ha-card>
        ${this.config?.title
          ? html`<div class="card-header">${this.config.title}</div>`
          : ''}
        <div class="card">
          <div class="board-message ${isError ? 'error' : ''}">
            <span class="message-icon" aria-hidden="true">${icon}</span>
            <span class="message-text">${message}</span>
          </div>
        </div>
      </ha-card>
    `;
  }

  private _isDataStale(entity: {
    attributes: Record<string, unknown>;
  }): boolean {
    if (this.config.stale_indicator === false) {
      return false;
    }
    if (entity.attributes?.data_stale === true) {
      return true;
    }
    // Fall back to the sensor's own forecast of its next refresh: if it is
    // more than a minute overdue, treat the data as stale.
    const nextUpdateAt = entity.attributes?.next_update_at;
    if (typeof nextUpdateAt === 'string') {
      const due = new Date(nextUpdateAt).getTime();
      if (!Number.isNaN(due) && Date.now() > due + 60_000) {
        return true;
      }
    }
    return false;
  }

  render() {
    if (!this.config) {
      return this._renderMessage('🚆', 'No configuration provided', true);
    }

    if (!this.config.entity) {
      return this._renderMessage('🚆', 'Please configure an entity');
    }

    const entity = this.hass?.states?.[this.config.entity];
    if (!entity) {
      return this._renderMessage(
        '🚆',
        `Entity not found: ${this.config.entity}`,
        true
      );
    }

    // Clear date cache only when entity changes
    if (this.lastEntityId !== this.config.entity) {
      this.dateCache.clear();
      this.lastEntityId = this.config.entity;
    }

    const attributeName = this.config.attribute || 'next_trains';
    const attributeValue = entity.attributes?.[attributeName];
    const departures = Array.isArray(attributeValue) ? attributeValue : [];
    const lastUpdated = entity.last_updated
      ? new Date(entity.last_updated).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

    if (attributeValue === undefined) {
      // eslint-disable-next-line no-console
      console.warn(
        `train-departure-board: attribute "${attributeName}" was not found on entity ${this.config.entity}`
      );
    }
    if (!Array.isArray(attributeValue) && attributeValue !== undefined) {
      // eslint-disable-next-line no-console
      console.warn(
        `train-departure-board: attribute "${attributeName}" is not an array, falling back to empty list`
      );
    }

    // Build custom property styles from config
    const customStyles = [
      this.config.font_size_time
        ? `--train-board-time-size: ${this.config.font_size_time}`
        : '',
      this.config.font_size_destination
        ? `--train-board-destination-size: ${this.config.font_size_destination}`
        : '',
      this.config.font_size_status
        ? `--train-board-status-size: ${this.config.font_size_status}`
        : '',
    ]
      .filter(Boolean)
      .join('; ');

    const now = new Date();
    const walkTime = Number(this.config.walk_time_minutes) || 0;
    // Which departure is "yours": the first one, unless a walk time is
    // configured, in which case the first one you can still reach.
    let highlightIndex = 0;
    if (walkTime > 0) {
      highlightIndex = departures.findIndex((departure: TrainDeparture) =>
        isCatchable(departure, walkTime, now, this.dateCache)
      );
    }

    const isStale = this._isDataStale(entity);

    return html`
      <ha-card style="${customStyles}">
        ${this.config.title
          ? html`<div class="card-header">${this.config.title}</div>`
          : ''}
        <div class="card">
          ${departures.length > 0
            ? html`<div
                class="departure-list"
                role="list"
                aria-label="Train departures"
              >
                ${departures.map((departure: TrainDeparture, index: number) =>
                  this.renderDepartureRow(departure, index, highlightIndex, now)
                )}
              </div>`
            : html`<div class="board-message">
                <span class="message-icon" aria-hidden="true">🚉</span>
                <span class="message-text">No departures available</span>
              </div>`}
          ${lastUpdated || isStale
            ? html`<div class="footer">
                ${isStale
                  ? html`<span class="stale-chip" role="status"
                      >⚠ Showing last-known data</span
                    >`
                  : ''}
                ${lastUpdated ? html`Last updated: ${lastUpdated}` : ''}
              </div>`
            : ''}
        </div>
      </ha-card>
      ${this._renderDetailsPopup()}
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this._handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._handleKeyDown);
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this._selectedDeparture) {
      this._closePopup();
    }
  };

  private _handleRowKeyDown(e: KeyboardEvent, departure: TrainDeparture) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._showDetails(departure, e);
    }
  }

  private _showDetails(departure: TrainDeparture, e?: Event) {
    this._returnFocusTo = (e?.currentTarget as HTMLElement) ?? null;
    this._selectedDeparture = departure;
  }

  private _closePopup() {
    this._selectedDeparture = null;
    this._returnFocusTo?.focus();
    this._returnFocusTo = null;
  }

  protected updated(changedProps: Map<PropertyKey, unknown>) {
    super.updated(changedProps);
    // Move focus into the dialog when it opens
    if (changedProps.has('_selectedDeparture') && this._selectedDeparture) {
      const closeButton =
        this.shadowRoot?.querySelector<HTMLButtonElement>('.popup-close');
      closeButton?.focus();
    }
  }

  private _handleOverlayClick(e: MouseEvent) {
    // Close only if clicking the overlay itself, not the card
    if ((e.target as HTMLElement).classList.contains('popup-overlay')) {
      this._closePopup();
    }
  }

  private _handlePopupKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') {
      return;
    }
    // Trap focus inside the dialog. The close button is the only focusable
    // element, so keep focus pinned to it while the popup is open.
    const closeButton =
      this.shadowRoot?.querySelector<HTMLButtonElement>('.popup-close');
    if (closeButton) {
      e.preventDefault();
      closeButton.focus();
    }
  };

  private _renderDetailsPopup() {
    if (!this._selectedDeparture) return nothing;

    const departure = this._selectedDeparture;
    const { statusClass, statusLabel } = getStatusMeta(departure);
    const scheduledTime = extractTimeLabel(departure.scheduled);
    const stops = getStopsForPopup(
      departure,
      this.config.stops_identifier || 'description',
      this.dateCache
    );
    const isCancelled = statusClass === 'cancelled';
    const stockInfo = getStockCategory(departure.stock, departure.operator_name);

    const statusBadgeClass =
      statusClass === 'on-time'
        ? 'status-ok'
        : statusClass === 'cancelled'
        ? 'status-cancelled'
        : 'status-delayed';

    // Check if any stops have passed to color the line
    const hasPassedStops = stops.some(stop => stop.isPassed);

    return html`
      <div
        class="popup-overlay"
        @click=${this._handleOverlayClick}
        @keydown=${this._handlePopupKeyDown}
      >
        <div
          class="popup-card"
          role="dialog"
          aria-modal="true"
          aria-label="Details for the ${scheduledTime} to ${departure.destination_name}"
        >
          <div class="modern-header">
            <div class="modern-header-top">
              <div class="modern-dest-group">
                <div class="modern-time-group">
                  <span
                    class="modern-scheduled ${isCancelled
                      ? 'time-cancelled'
                      : ''}"
                    >${scheduledTime}</span
                  >
                  ${departure.operator_name
                    ? html`<span class="modern-operator"
                        >${departure.operator_name}</span
                      >`
                    : ''}
                </div>
                <h2 class="modern-dest">${departure.destination_name}</h2>
              </div>
              <button
                class="popup-close"
                @click=${this._closePopup}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div class="modern-badges">
              <div class="modern-badge ${statusBadgeClass}">
                <span style="font-size: 1.2em; line-height: 1;">●</span>
                ${statusLabel}
              </div>
              ${departure.platform
                ? html` <div class="modern-badge platform">
                    Platform ${departure.platform}
                  </div>`
                : ''}
              ${departure.length
                ? html` <div class="modern-badge carriages">
                    ${departure.length} carriages
                  </div>`
                : ''}
              ${stockInfo.category !== 'standard'
                ? html` <div
                    class="modern-badge stock-badge stock-${stockInfo.category}"
                  >
                    ${stockInfo.label}
                  </div>`
                : ''}
            </div>
            ${departure.last_report_station
              ? html`<div class="last-seen">
                  Last seen at ${departure.last_report_station}${departure.last_report_time
                    ? ` (${extractTimeLabel(departure.last_report_time)})`
                    : ''}
                </div>`
              : ''}
          </div>

          <div class="modern-content">
            ${stops.length > 0
              ? html` <div class="timeline-container">
                  <div
                    class="modern-stops-list ${hasPassedStops
                      ? 'has-passed'
                      : ''}"
                  >
                    ${stops.map(
                      stop => html`
                        ${stop.isBetweenPrevious
                          ? html`
                              <div
                                class="modern-train-pos-wrapper"
                                aria-hidden="true"
                              >
                                <div class="modern-stop-graphic">
                                  <div class="modern-train-pos">🚆</div>
                                </div>
                                <div></div>
                              </div>
                            `
                          : ''}
                        <div
                          class="modern-stop ${stop.isPassed
                            ? 'passed'
                            : ''} ${stop.isCurrent ? 'current' : ''}"
                        >
                          <div class="modern-stop-graphic">
                            <div class="modern-stop-circle"></div>
                          </div>
                          <div class="modern-stop-content">
                            <span class="modern-stop-time">${stop.time}</span>
                            <div class="modern-stop-info">
                              <span class="modern-stop-name">${stop.name}</span>
                              ${!stop.isPassed && stop.statusLabel
                                ? html`<span
                                    class="modern-stop-status ${stop.statusClass}"
                                    >${stop.statusLabel}</span
                                  >`
                                : ''}
                            </div>
                          </div>
                        </div>
                      `
                    )}
                  </div>
                </div>`
              : ''}
          </div>
        </div>
      </div>
    `;
  }

  private renderDepartureRow(
    departure: TrainDeparture,
    index: number,
    highlightIndex = 0,
    now: Date = new Date()
  ) {
    const scheduledTime = extractTimeLabel(departure.scheduled);
    const { statusClass, statusLabel, offsetStr } = getStatusMeta(departure);
    const platform = departure.platform ? departure.platform : null;
    const isNextTrain = index === highlightIndex;
    const isUnreachable = highlightIndex > 0 && index < highlightIndex;
    const isCancelled = statusClass === 'cancelled';
    const stockInfo = getStockCategory(departure.stock, departure.operator_name);
    const timeClass = isCancelled ? 'time-cancelled' : '';
    const rowSizeClass = `row-size-${this.config.row_size || 'normal'}`;
    const showCarriages = this.config.show_carriages !== false;
    const styledStockCategories = ['modern', 'javelin', 'refurb'];
    const stockRowClass = styledStockCategories.includes(stockInfo.category)
      ? `stock-row-${stockInfo.category}`
      : '';

    const timeDisplay = this.config.time_display || 'scheduled';
    const relativeTime =
      timeDisplay === 'relative' || timeDisplay === 'both'
        ? formatRelativeMinutes(departure, now, this.dateCache)
        : null;
    const primaryTimeLabel =
      timeDisplay === 'relative' && relativeTime ? relativeTime : scheduledTime;

    let pillHtml = html``;
    if (isCancelled) {
      pillHtml = html`<span class="status-pill cancelled">Cancelled</span>`;
    } else if (offsetStr) {
      const isEarly = statusClass === 'early';
      pillHtml = html`<span class="status-pill ${isEarly ? 'early' : 'delayed'}"
        >${isEarly ? 'Early ' : ''}${offsetStr}</span
      >`;
    }

    return html`
      <div
        class="train ${isNextTrain ? 'next-train' : ''} ${isCancelled
          ? 'cancelled-row'
          : ''} ${isUnreachable
          ? 'unreachable'
          : ''} ${stockRowClass} ${rowSizeClass}"
        role="listitem"
        tabindex="0"
        aria-haspopup="dialog"
        aria-label="${departure.destination_name} at ${scheduledTime}, ${statusLabel}${platform
          ? `, Platform ${platform}`
          : ''}${isUnreachable ? ', likely out of reach' : ''}"
        @click=${(e: Event) => this._showDetails(departure, e)}
        @keydown=${(e: KeyboardEvent) => this._handleRowKeyDown(e, departure)}
      >
        <div class="time-wrapper ${timeClass}">
          <span class="scheduled" aria-label="Scheduled time"
            >${primaryTimeLabel}</span
          >
          ${timeDisplay === 'both' && relativeTime
            ? html`<span class="relative-time"
                >${relativeTime === 'Due' ? relativeTime : `in ${relativeTime}`}</span
              >`
            : ''}
        </div>
        <div class="info-box">
          <div class="destination-col">
            <div class="destination-row">
              <h3 class="terminus">${departure.destination_name}</h3>
              ${pillHtml}
              ${showCarriages && departure.length
                ? html`<span class="carriages-badge">${departure.length}-car</span>`
                : ''}
              ${platform
                ? html`<span
                    class="platform-badge"
                    aria-label="Platform ${platform}"
                    >${platform}</span
                  >`
                : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Register with Home Assistant's card registry
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  // Register with the `custom:` prefix so Home Assistant's card picker
  // recognizes the YAML type `custom:train-departure-board`.
  type: 'custom:train-departure-board',
  name: 'Train Departure Board',
  description: 'Display train departure information in a TFL-style board',
  // Enable preview so the card is discoverable in the card picker
  // and shows a preview in the UI.
  preview: true,
  support_url: 'https://github.com/ivmreg/ha-train-departure-board/issues',
});
