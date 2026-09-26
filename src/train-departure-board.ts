import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  TrainDeparture,
  TrainDepartureBoardConfig,
  HomeAssistant,
  CallingPoint,
  BoardServiceStatus,
  DisruptionItem,
} from './types';
import {
  getStockCategory,
  getCallingPointName,
  formatRelativeMinutes,
  isCatchable,
  isValidContractV2Departure,
} from './utils';
import './editor'; // Import the editor to ensure it's registered

@customElement('train-departure-board')
export class TrainDepartureBoard extends LitElement {
  @property({ type: Object }) hass!: HomeAssistant;
  @property({ type: Object }) config!: TrainDepartureBoardConfig;
  @property({ type: Array }) nextTrains: TrainDeparture[] = [];
  @state() private _selectedDeparture: TrainDeparture | null = null;
  @state() private _selectedAlert: DisruptionItem | {
    id?: string;
    title?: string;
    summary?: string;
    alternative_travel?: string | null;
    url?: string | null;
    is_planned?: boolean;
  } | null = null;
  @state() private _activeAnnouncementIndex = 0;
  private dateCache = new Map<string, Date | null>();
  private lastEntityId: string | null = null;
  private _returnFocusTo: HTMLElement | null = null;
  // Previous rendered values per service, used to trigger the flap
  // animation only when a value actually changes (not on every re-render)
  private _prevRowValues = new Map<
    string,
    { time: string; platform: string; status: string }
  >();
  private _flapCounters = new Map<string, number>();
  private _tickTimer: number | undefined;
  private _announcementTimer: number | undefined;

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
      container-type: inline-size;
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
      flex: 0 0 4.25rem;
      width: 4.25rem;
      min-width: 4.25rem;
      font-variant-numeric: tabular-nums;
    }
    .scheduled {
      display: inline-block; /* transformable for the flap animation */
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
    .platform-badge {
      font-size: 0.75em;
      font-weight: 700;
      padding: 2px 6px;
      min-width: 28px;
      height: 22px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      color: var(--secondary-text-color, #666);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      flex-shrink: 0;
      box-sizing: border-box;
      font-variant-numeric: tabular-nums;
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
    .row-meta {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      flex-shrink: 0;
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
      min-width: 44px;
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
      text-align: center;
      box-sizing: border-box;
      font-variant-numeric: tabular-nums;
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
    .walk-time-notice {
      padding: 6px 12px;
      margin: 8px 8px 0 8px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      color: var(--secondary-text-color, #666);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .enrichment-error-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      color: var(--secondary-text-color, #666);
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .enrichment-popup-notice {
      font-size: 0.8rem;
      color: var(--secondary-text-color, #666);
      padding: 4px 8px;
      margin-bottom: 8px;
      border-radius: 4px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    @container (max-width: 380px) {
      .carriages-badge {
        display: none;
      }
      .relative-time {
        display: none;
      }
    }
    @media (max-width: 380px) {
      .carriages-badge {
        display: none;
      }
      .relative-time {
        display: none;
      }
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
    .journey-summary {
      margin-top: 10px;
      font-size: 0.9em;
      font-weight: 500;
      color: var(--primary-text-color, #111);
    }
    .pin-marker {
      font-size: 0.8em;
      margin-right: 4px;
    }
    /* Split-flap-style flip when a displayed value changes. Two identical
       animations so consecutive changes both restart the effect. */
    @keyframes flap-a {
      0% {
        transform: rotateX(0);
      }
      50% {
        transform: rotateX(90deg);
        opacity: 0.25;
      }
      100% {
        transform: rotateX(0);
      }
    }
    @keyframes flap-b {
      0% {
        transform: rotateX(0);
      }
      50% {
        transform: rotateX(90deg);
        opacity: 0.25;
      }
      100% {
        transform: rotateX(0);
      }
    }
    .flap-a {
      animation: flap-a 0.5s ease;
    }
    .flap-b {
      animation: flap-b 0.5s ease;
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
      .flap-a,
      .flap-b {
        animation: none;
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
    /* Amber LED announcements banner */
    .announcements-banner {
      background: #0f0f0f;
      color: #ffaa00;
      border-bottom: 1px solid #2a2a2a;
      padding: 8px 12px;
      font-family: ui-monospace, SFMono-Regular, "Courier New", Consolas, monospace;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      box-sizing: border-box;
      cursor: pointer;
      position: relative;
    }
    .announcements-banner.position-bottom {
      border-bottom: none;
      border-top: 1px solid #2a2a2a;
    }
    .announcements-banner:focus-visible {
      outline: 2px solid #ffaa00;
      outline-offset: -2px;
    }
    .announcement-icon {
      color: #ffaa00;
      font-size: 1.1em;
      line-height: 1;
      flex-shrink: 0;
    }
    .announcement-body {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;
    }
    .announcement-ticker-wrap {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
    }
    .announcement-ticker {
      display: inline-block;
      white-space: nowrap;
      animation: ticker-scroll 16s linear infinite;
    }
    .announcement-counter {
      font-size: 0.75em;
      opacity: 0.85;
      flex-shrink: 0;
      border: 1px solid rgba(255, 170, 0, 0.4);
      border-radius: 3px;
      padding: 1px 4px;
    }
    .announcement-action {
      font-size: 0.75em;
      text-decoration: underline;
      opacity: 0.9;
      flex-shrink: 0;
    }
    @keyframes ticker-scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    .board-empty-state {
      padding: 28px 16px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      flex: 1;
    }
    .board-empty-state.station-closed {
      background: rgba(211, 47, 47, 0.04);
    }
    .board-empty-state.engineering-work {
      background: rgba(255, 152, 0, 0.04);
    }
    .board-empty-state.disrupted {
      background: rgba(230, 81, 0, 0.04);
    }
    .board-empty-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--primary-text-color, #111);
    }
    .board-empty-state.station-closed .board-empty-title {
      color: var(--error-color, #d32f2f);
    }
    .board-empty-state.engineering-work .board-empty-title {
      color: var(--warning-color, #e65100);
    }
    .board-empty-state.disrupted .board-empty-title {
      color: var(--warning-color, #e65100);
    }
    .alternative-travel-box {
      margin-top: 12px;
      width: 100%;
      max-width: 480px;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--warning-color, #ff9800);
      border-left: 4px solid var(--warning-color, #ff9800);
      border-radius: 6px;
      padding: 10px 14px;
      text-align: left;
      box-sizing: border-box;
    }
    .alternative-travel-header {
      font-weight: 700;
      font-size: 0.85rem;
      color: var(--warning-color, #e65100);
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
    }
    .alternative-travel-item {
      font-size: 0.85rem;
      color: var(--primary-text-color, #111);
      line-height: 1.4;
    }
    .alternative-travel-item + .alternative-travel-item {
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px dashed var(--divider-color, #e0e0e0);
    }
    .empty-disruption-details {
      margin-top: 10px;
      max-width: 500px;
      width: 100%;
      text-align: center;
    }
    .empty-disruption-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      margin: 0 0 4px 0;
    }
    .empty-state-summary {
      font-size: 0.88rem;
      line-height: 1.4;
      color: var(--secondary-text-color, #555);
      margin: 0;
    }
    .empty-station-messages {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-width: 500px;
      width: 100%;
    }
    .empty-station-message {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--secondary-text-color, #444);
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      padding: 6px 10px;
      border-radius: 4px;
      text-align: left;
    }
    .empty-state-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-top: 12px;
      flex-wrap: wrap;
    }
    .empty-details-btn {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
    }
    .empty-details-btn:hover {
      opacity: 0.9;
    }
    .empty-details-btn:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .empty-external-link {
      color: var(--primary-color, #03a9f4);
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .empty-external-link:hover {
      text-decoration: underline;
    }
    .alert-popup-card {
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      max-width: 460px;
      width: 100%;
      max-height: 85vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .alert-popup-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .alert-popup-title {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      line-height: 1.3;
    }
    .alert-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-top: 6px;
    }
    .alert-badge.planned {
      background: rgba(33, 150, 243, 0.12);
      color: var(--info-color, #1976d2);
      border: 1px solid rgba(33, 150, 243, 0.3);
    }
    .alert-badge.unplanned {
      background: rgba(230, 81, 0, 0.12);
      color: var(--warning-color, #e65100);
      border: 1px solid rgba(230, 81, 0, 0.3);
    }
    .alert-summary {
      font-size: 0.9rem;
      line-height: 1.45;
      color: var(--primary-text-color, #222);
      margin: 0;
      white-space: pre-wrap;
    }
    .alert-alternative-section {
      background: rgba(255, 193, 7, 0.08);
      border-left: 4px solid var(--warning-color, #ff9800);
      padding: 10px 12px;
      border-radius: 4px;
      font-size: 0.85rem;
    }
    .alert-alternative-title {
      font-weight: 700;
      color: var(--warning-color, #e65100);
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .alert-link {
      color: var(--primary-color, #03a9f4);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .alert-link:hover {
      text-decoration: underline;
    }
    @media (prefers-reduced-motion: reduce) {
      .announcement-ticker {
        animation: none !important;
        transform: none !important;
      }
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

    if (entity.state === 'unavailable') {
      return this._renderMessage(
        '🚆',
        `Entity ${this.config.entity} is currently unavailable`
      );
    }

    if (entity.state === 'unknown') {
      const hasValidV2 =
        entity.attributes?.contract_version === 2 &&
        Array.isArray(entity.attributes?.next_trains);
      if (!hasValidV2) {
        const errorDetail = entity.attributes?.error
          ? ` (${entity.attributes.error})`
          : '';
        return this._renderMessage(
          '⚠',
          `Data currently unavailable for entity ${this.config.entity}${errorDetail}`,
          true
        );
      }
    }

    const contractVersion = entity.attributes?.contract_version;
    if (contractVersion !== 2) {
      const detail =
        contractVersion === undefined
          ? 'missing'
          : `found v${String(contractVersion)}`;
      return this._renderMessage(
        '⚠',
        `Integration contract version 2 required (${detail}). Please update both realtime_trains_api and ha-train-departure-board together.`,
        true
      );
    }

    // Clear date cache only when entity changes
    if (this.lastEntityId !== this.config.entity) {
      this.dateCache.clear();
      this.lastEntityId = this.config.entity;
    }
    // Keys include dates, so an always-on dashboard accumulates entries
    if (this.dateCache.size > 500) {
      this.dateCache.clear();
    }

    const attributeName = this.config.attribute || 'next_trains';
    const attributeValue = entity.attributes?.[attributeName];
    if (attributeValue === undefined) {
      return this._renderMessage(
        '⚠',
        `Attribute "${attributeName}" not found on entity ${this.config.entity}`,
        true
      );
    }
    if (!Array.isArray(attributeValue)) {
      return this._renderMessage(
        '⚠',
        `Attribute "${attributeName}" on entity ${this.config.entity} is not an array`,
        true
      );
    }

    const departures = attributeValue;
    if (departures.some((d: unknown) => !isValidContractV2Departure(d))) {
      return this._renderMessage(
        '⚠',
        `Malformed Contract v2 departure data on entity ${this.config.entity}`,
        true
      );
    }
    const lastUpdated = entity.last_updated
      ? new Date(entity.last_updated).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

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
    this._updateFlapCounters(departures);

    const announcements = this._getAnnouncements();
    const showAnnouncements =
      this._isAnnouncementsEnabled() && announcements.length > 0;
    const announcementPos = this._getAnnouncementPosition();

    return html`
      <ha-card style="${customStyles}">
        ${this.config.title
          ? html`<div class="card-header">${this.config.title}</div>`
          : ''}
        <div class="card">
          ${showAnnouncements && announcementPos === 'top'
            ? this._renderAnnouncementsBanner(announcements, 'top')
            : ''}
          ${walkTime > 0 && highlightIndex === -1 && departures.length > 0
            ? html`<div class="walk-time-notice">
                No listed departures reachable within ${walkTime} min walk
              </div>`
            : ''}
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
            : this._renderEmptyState(entity, now)}
          ${showAnnouncements && announcementPos === 'bottom'
            ? this._renderAnnouncementsBanner(announcements, 'bottom')
            : ''}
          ${lastUpdated || isStale || entity.attributes?.error
            ? html`<div class="footer">
                ${isStale
                  ? html`<span class="stale-chip" role="status"
                      >⚠ Showing last-known data</span
                    >`
                  : ''}
                ${entity.attributes?.error
                  ? html`<span class="enrichment-error-chip" role="status"
                      >ℹ Limited journey details</span
                    >`
                  : ''}
                ${lastUpdated ? html`Last updated: ${lastUpdated}` : ''}
              </div>`
            : ''}
        </div>
      </ha-card>
      ${this._renderDetailsPopup()}
      ${this._renderAlertPopup()}
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this._handleKeyDown);
    // Keep relative countdowns honest even when HA is quiet
    this._tickTimer = window.setInterval(() => {
      const mode = this.config?.time_display;
      if (mode === 'relative' || mode === 'both') {
        this.requestUpdate();
      }
    }, 30_000);
    this._announcementTimer = window.setInterval(() => {
      const announcements = this._getAnnouncements();
      if (announcements.length > 1) {
        this._activeAnnouncementIndex =
          (this._activeAnnouncementIndex + 1) % announcements.length;
        this.requestUpdate();
      }
    }, 7000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._handleKeyDown);
    if (this._tickTimer !== undefined) {
      window.clearInterval(this._tickTimer);
      this._tickTimer = undefined;
    }
    if (this._announcementTimer !== undefined) {
      window.clearInterval(this._announcementTimer);
      this._announcementTimer = undefined;
    }
  }

  private _departureKey(departure: TrainDeparture): string {
    return (
      departure.service_uid ||
      `${departure.scheduled}-${departure.destination_name}`
    );
  }

  private _updateFlapCounters(departures: TrainDeparture[]) {
    // Bound both maps; entries accumulate as services roll through the day
    if (this._prevRowValues.size > 200) {
      this._prevRowValues.clear();
      this._flapCounters.clear();
    }
    for (const departure of departures) {
      const key = this._departureKey(departure);
      const current = {
        time: departure.estimated_time || departure.scheduled_time || '',
        platform: departure.platform || '',
        status: departure.status_label || '',
      };
      const prev = this._prevRowValues.get(key);
      if (prev) {
        for (const field of ['time', 'platform', 'status'] as const) {
          if (prev[field] !== current[field]) {
            const flapKey = `${key}:${field}`;
            this._flapCounters.set(
              flapKey,
              (this._flapCounters.get(flapKey) || 0) + 1
            );
          }
        }
      }
      this._prevRowValues.set(key, current);
    }
  }

  private _flapClass(departure: TrainDeparture, field: string): string {
    const count =
      this._flapCounters.get(`${this._departureKey(departure)}:${field}`) || 0;
    if (count === 0) {
      return '';
    }
    // Alternate between two identical animations so consecutive changes
    // both restart the flap
    return count % 2 ? 'flap-a' : 'flap-b';
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (this._selectedAlert) {
        this._closeAlertPopup();
      } else if (this._selectedDeparture) {
        this._closePopup();
      }
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
        this.shadowRoot?.querySelector<HTMLButtonElement>(
          '.popup-close:not(.alert-popup-close)'
        );
      closeButton?.focus();
    }
    if (changedProps.has('_selectedAlert') && this._selectedAlert) {
      const closeButton =
        this.shadowRoot?.querySelector<HTMLButtonElement>('.alert-popup-close');
      closeButton?.focus();
    }
  }

  private _isAnnouncementsEnabled(): boolean {
    if (!this.config) return true;
    if (
      this.config.show_announcements === false ||
      this.config.announcements === 'off'
    ) {
      return false;
    }
    return true;
  }

  private _getAnnouncementPosition(): 'top' | 'bottom' {
    if (!this.config) return 'top';
    if (this.config.announcement_position) {
      return this.config.announcement_position;
    }
    if (this.config.announcements === 'bottom') {
      return 'bottom';
    }
    return 'top';
  }

  private _getAnnouncements(): Array<{
    id: string;
    text: string;
    isDisruption: boolean;
    disruption?: DisruptionItem;
  }> {
    const entity = this.config?.entity
      ? this.hass?.states?.[this.config.entity]
      : null;
    if (!entity?.attributes) return [];

    const items: Array<{
      id: string;
      text: string;
      isDisruption: boolean;
      disruption?: DisruptionItem;
    }> = [];

    const stationMessages = entity.attributes.station_messages;
    if (Array.isArray(stationMessages)) {
      stationMessages.forEach((msg, idx) => {
        if (typeof msg === 'string' && msg.trim()) {
          items.push({
            id: `msg-${idx}`,
            text: msg.trim(),
            isDisruption: false,
          });
        }
      });
    }

    const disruptions = entity.attributes.disruptions;
    if (Array.isArray(disruptions)) {
      disruptions.forEach((d, idx) => {
        if (d && typeof d === 'object') {
          const item = d as DisruptionItem;
          const text = item.title || item.summary || 'Disruption alert';
          items.push({
            id: item.id || `disr-${idx}`,
            text: text.trim(),
            isDisruption: true,
            disruption: item,
          });
        }
      });
    }

    return items;
  }

  private _showAlertDetails(
    announcement: {
      id: string;
      text: string;
      isDisruption: boolean;
      disruption?: DisruptionItem;
    },
    e?: Event
  ) {
    this._returnFocusTo = (e?.currentTarget as HTMLElement) ?? null;
    if (announcement.disruption) {
      this._selectedAlert = announcement.disruption;
    } else {
      this._selectedAlert = {
        id: announcement.id,
        title: 'Station Announcement',
        summary: announcement.text,
        is_planned: false,
        alternative_travel: null,
        url: null,
      };
    }
  }

  private _closeAlertPopup() {
    this._selectedAlert = null;
    this._returnFocusTo?.focus();
    this._returnFocusTo = null;
  }

  private _handleAlertOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('popup-overlay')) {
      this._closeAlertPopup();
    }
  }

  private _handleAlertPopupKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') {
      return;
    }
    const focusable = Array.from(
      this.shadowRoot?.querySelectorAll<HTMLElement>(
        '.alert-popup-card button, .alert-popup-card a'
      ) || []
    ).filter(el => !el.hasAttribute('disabled'));

    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active =
      (this.shadowRoot?.activeElement as HTMLElement | null) ||
      (e.composedPath && (e.composedPath()[0] as HTMLElement)) ||
      null;

    if (e.shiftKey) {
      if (active === first || !focusable.includes(active as HTMLElement)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last || !focusable.includes(active as HTMLElement)) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  private _handleBannerKeyDown(
    e: KeyboardEvent,
    current: {
      id: string;
      text: string;
      isDisruption: boolean;
      disruption?: DisruptionItem;
    },
    announcements: Array<{
      id: string;
      text: string;
      isDisruption: boolean;
      disruption?: DisruptionItem;
    }>
  ) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._showAlertDetails(current, e);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      this._activeAnnouncementIndex =
        (this._activeAnnouncementIndex + 1) % announcements.length;
      this.requestUpdate();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this._activeAnnouncementIndex =
        (this._activeAnnouncementIndex - 1 + announcements.length) %
        announcements.length;
      this.requestUpdate();
    }
  }

  private _isSafeUrl(url: string | null | undefined): boolean {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim().toLowerCase();
    return trimmed.startsWith('https://') || trimmed.startsWith('http://');
  }

  private _renderAnnouncementsBanner(
    announcements: Array<{
      id: string;
      text: string;
      isDisruption: boolean;
      disruption?: DisruptionItem;
    }>,
    position: 'top' | 'bottom'
  ) {
    if (announcements.length === 0) return nothing;
    const activeIndex = this._activeAnnouncementIndex % announcements.length;
    const current = announcements[activeIndex];

    return html`
      <div
        class="announcements-banner position-${position}"
        role="region"
        aria-label="Station announcements"
        tabindex="0"
        aria-haspopup="dialog"
        @click=${(e: Event) => this._showAlertDetails(current, e)}
        @keydown=${(e: KeyboardEvent) =>
          this._handleBannerKeyDown(e, current, announcements)}
      >
        <span class="announcement-icon" aria-hidden="true">📢</span>
        <div class="announcement-body">
          ${announcements.length > 1
            ? html`<span
                class="announcement-counter"
                aria-label="Announcement ${activeIndex + 1} of ${announcements.length}"
                >${activeIndex + 1}/${announcements.length}</span
              >`
            : ''}
          <div class="announcement-ticker-wrap">
            <span class="announcement-ticker">${current.text}</span>
          </div>
        </div>
        <span class="announcement-action">Details</span>
      </div>
    `;
  }

  private _isNighttime(now: Date = new Date()): boolean {
    try {
      const hourStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: 'numeric',
        hourCycle: 'h23',
      }).format(now);
      const hour = parseInt(hourStr, 10);
      return hour >= 1 && hour < 5;
    } catch {
      const hour = now.getHours();
      return hour >= 1 && hour < 5;
    }
  }

  private _renderEmptyState(
    entity: {
      attributes?: Record<string, unknown>;
    },
    now: Date = new Date()
  ) {
    const attrs = entity.attributes || {};
    const serviceStatus =
      (attrs.service_status as BoardServiceStatus) ||
      'no_departures';
    const disruptions = (Array.isArray(attrs.disruptions)
      ? attrs.disruptions
      : []) as DisruptionItem[];
    const stationMessages = (Array.isArray(attrs.station_messages)
      ? attrs.station_messages
      : []).filter((m): m is string => Boolean(m && typeof m === 'string' && m.trim()));

    const altTravels = disruptions
      .map(d => d.alternative_travel)
      .filter((t): t is string => Boolean(t && typeof t === 'string' && t.trim()));

    const primaryDisruption = disruptions.length > 0 ? disruptions[0] : null;

    let icon = '🚉';
    let title = 'No Departures';
    let defaultMsg = 'No departures in the current window';

    if (serviceStatus === 'station_closed') {
      icon = '🚫';
      title = 'Station Closed';
      defaultMsg = 'This station is currently closed. No train services are operating.';
    } else if (serviceStatus === 'engineering_work') {
      icon = '🚧';
      title = 'Engineering Work';
      defaultMsg = 'Engineering work is affecting services at this station.';
    } else if (serviceStatus === 'disrupted') {
      icon = '⚠';
      title = 'Service Disrupted';
      defaultMsg = 'Train services are disrupted. Please check announcements for details.';
    } else {
      icon = '🚉';
      title = 'No Departures';
      if (this._isNighttime(now)) {
        defaultMsg = 'No departures scheduled overnight. Services may have finished for the night.';
      } else {
        defaultMsg = 'No departures in the current window';
      }
    }

    const statusClass = serviceStatus.replace(/_/g, '-');

    return html`
      <div class="board-message board-empty-state ${statusClass} ${serviceStatus}" role="status">
        <span class="message-icon" aria-hidden="true">${icon}</span>
        <div class="board-empty-title">${title}</div>
        <span class="message-text">${defaultMsg}</span>
        ${primaryDisruption
          ? html`
              <div class="empty-disruption-details">
                <h4 class="empty-disruption-title">
                  ${primaryDisruption.title || 'Disruption Notice'}
                </h4>
                ${primaryDisruption.summary
                  ? html`<p class="empty-state-summary">
                      ${primaryDisruption.summary}
                    </p>`
                  : ''}
              </div>
            `
          : ''}
        ${stationMessages.length > 0
          ? html`
              <div class="empty-station-messages">
                ${stationMessages.map(
                  msg => html`<div class="empty-station-message">📢 ${msg}</div>`
                )}
              </div>
            `
          : ''}
        ${altTravels.length > 0
          ? html`
              <div class="alternative-travel-box">
                <div class="alternative-travel-header">
                  <span aria-hidden="true">🚌</span> ${serviceStatus === 'engineering_work'
                    ? 'Replacement Bus & Ticket Acceptance'
                    : 'Alternative Travel & Ticket Acceptance'}
                </div>
                <div class="alternative-travel-content">
                  ${altTravels.map(
                    alt =>
                      html`<div class="alternative-travel-item">${alt}</div>`
                  )}
                </div>
              </div>
            `
          : nothing}
        ${primaryDisruption
          ? html`
              <div class="empty-state-actions">
                <button
                  class="empty-details-btn"
                  @click=${(e: Event) =>
                    this._showAlertDetails(
                      {
                        id: primaryDisruption.id,
                        text:
                          primaryDisruption.title ||
                          primaryDisruption.summary ||
                          'Disruption',
                        isDisruption: true,
                        disruption: primaryDisruption,
                      },
                      e
                    )}
                >
                  View Details
                </button>
                ${this._isSafeUrl(primaryDisruption.url)
                  ? html`
                      <a
                        href="${primaryDisruption.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="empty-external-link"
                      >
                        National Rail Updates ↗
                      </a>
                    `
                  : ''}
              </div>
            `
          : ''}
      </div>
    `;
  }

  private _renderAlertPopup() {
    if (!this._selectedAlert) return nothing;

    const alert = this._selectedAlert;
    const isSafe = this._isSafeUrl(alert.url);
    const isPlanned = Boolean(alert.is_planned);
    const title = alert.title || 'Station Notice';
    const summary = alert.summary || '';
    const altTravel = alert.alternative_travel;

    return html`
      <div
        class="popup-overlay alert-popup-overlay"
        @click=${this._handleAlertOverlayClick}
        @keydown=${this._handleAlertPopupKeyDown}
      >
        <div
          class="alert-popup-card"
          role="dialog"
          aria-modal="true"
          aria-label="${title}"
        >
          <div class="alert-popup-header">
            <div>
              <h2 class="alert-popup-title">${title}</h2>
              <div class="alert-badge ${isPlanned ? 'planned' : 'unplanned'}">
                ${isPlanned ? 'Planned Work' : 'Disruption Alert'}
              </div>
            </div>
            <button
              class="popup-close alert-popup-close"
              @click=${this._closeAlertPopup}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          ${summary ? html`<p class="alert-summary">${summary}</p>` : ''}
          ${altTravel
            ? html`
                <div class="alert-alternative-section">
                  <div class="alert-alternative-title">
                    <span aria-hidden="true">🚌</span> Alternative Travel &amp; Ticket Acceptance
                  </div>
                  <div>${altTravel}</div>
                </div>
              `
            : ''}
          ${isSafe && alert.url
            ? html`
                <div class="alert-link-container">
                  <a
                    href="${alert.url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="alert-link"
                  >
                    More information on National Rail ↗
                  </a>
                </div>
              `
            : ''}
        </div>
      </div>
    `;
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
    const statusClass = departure.status_class;
    const statusLabel = departure.status_label;
    const scheduledTime = departure.scheduled_time;
    const stops: CallingPoint[] = departure.calling_points || [];
    const isCancelled = departure.is_cancelled || statusClass === 'cancelled';
    const stockInfo = getStockCategory(departure.stock, departure.operator_name);
    const entity = this.config.entity
      ? this.hass?.states?.[this.config.entity]
      : null;
    const hasEnrichmentError = Boolean(entity?.attributes?.error);

    const statusBadgeClass =
      statusClass === 'on-time'
        ? 'status-ok'
        : statusClass === 'cancelled'
        ? 'status-cancelled'
        : 'status-delayed';

    // Check if any stops have passed to color the line
    const hasPassedStops = stops.some(stop => stop.is_passed);

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
            ${hasEnrichmentError
              ? html`<div class="enrichment-popup-notice">
                  ℹ Limited journey details
                </div>`
              : ''}
            ${this._renderJourneySummary(departure)}
            ${departure.last_report_station
              ? html`<div class="last-seen">
                  Last seen at ${departure.last_report_station}${departure.last_report_time_label
                    ? ` (${departure.last_report_time_label})`
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
                        ${stop.is_between_previous
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
                          class="modern-stop ${stop.is_passed
                            ? 'passed'
                            : ''} ${stop.is_current ? 'current' : ''}"
                        >
                          <div class="modern-stop-graphic">
                            <div class="modern-stop-circle"></div>
                          </div>
                          <div class="modern-stop-content">
                            <span class="modern-stop-time">${stop.time}</span>
                            <div class="modern-stop-info">
                              <span class="modern-stop-name">${getCallingPointName(
                                stop,
                                this.config.stops_identifier || 'description'
                              )}</span>
                              ${!stop.is_passed && stop.status_label
                                ? html`<span
                                    class="modern-stop-status ${stop.status_class}"
                                    >${stop.status_label}</span
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

  private _renderJourneySummary(departure: TrainDeparture) {
    const arrivalTime = departure.destination_arrival_time;
    const parts: string[] = [];
    if (departure.journey_duration_minutes != null) {
      parts.push(`${departure.journey_duration_minutes} min journey`);
    }
    if (departure.stops_count != null && departure.stops_count > 0) {
      parts.push(`${departure.stops_count} ${departure.stops_count === 1 ? 'stop' : 'stops'}`);
    }
    if (arrivalTime) {
      parts.push(`arrives ${arrivalTime}`);
    }
    if (parts.length === 0) {
      return nothing;
    }
    return html`<div class="journey-summary">${parts.join(' · ')}</div>`;
  }

  private renderDepartureRow(
    departure: TrainDeparture,
    index: number,
    highlightIndex = 0,
    now: Date = new Date()
  ) {
    const scheduledTime = departure.scheduled_time;
    const statusClass = departure.status_class;
    const statusLabel = departure.status_label;
    const offsetLabel = departure.offset_label;
    const platform = departure.platform ? departure.platform : null;
    const isNextTrain = highlightIndex >= 0 && index === highlightIndex;
    const walkTime = Number(this.config.walk_time_minutes) || 0;
    const isUnreachable =
      walkTime > 0 && (highlightIndex === -1 || index < highlightIndex);
    const isCancelled = departure.is_cancelled || statusClass === 'cancelled';
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

    const statusFlap = this._flapClass(departure, 'status');
    let pillHtml = html``;
    if (isCancelled) {
      pillHtml = html`<span class="status-pill cancelled ${statusFlap}"
        >Cancelled</span
      >`;
    } else if (offsetLabel) {
      const isEarly = statusClass === 'early';
      pillHtml = html`<span
        class="status-pill ${isEarly ? 'early' : 'delayed'} ${statusFlap}"
        >${isEarly ? 'Early ' : ''}${offsetLabel}</span
      >`;
    }

    const rowAccessibleParts: string[] = [
      `${departure.destination_name} at ${scheduledTime}`,
      statusLabel,
    ];
    if (platform) {
      rowAccessibleParts.push(`Platform ${platform}`);
    }
    if (showCarriages && departure.length) {
      rowAccessibleParts.push(`${departure.length} carriages`);
    }
    if (stockInfo.label) {
      rowAccessibleParts.push(stockInfo.label);
    }
    if (isUnreachable) {
      rowAccessibleParts.push('likely out of reach');
    }
    const rowAccessibleName = rowAccessibleParts.join(', ');

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
        aria-label="${rowAccessibleName}"
        title="${rowAccessibleName}"
        @click=${(e: Event) => this._showDetails(departure, e)}
        @keydown=${(e: KeyboardEvent) => this._handleRowKeyDown(e, departure)}
      >
        <div class="time-wrapper ${timeClass}">
          <span
            class="scheduled ${this._flapClass(departure, 'time')}"
            aria-label="Scheduled time"
            >${primaryTimeLabel}</span
          >
          ${timeDisplay === 'both' && relativeTime
            ? html`<span class="relative-time"
                >${relativeTime === 'Due' ? relativeTime : `in ${relativeTime}`}</span
              >`
            : ''}
        </div>
        <div class="info-box">
          <div class="destination-row">
            <h3 class="terminus">
              ${departure.is_pinned
                ? html`<span
                    class="pin-marker"
                    title="Your pinned train"
                    aria-label="Pinned train"
                    >📌</span
                  >`
                : ''}${departure.destination_name}
            </h3>
            <div class="row-meta">
              ${pillHtml}
              ${showCarriages && departure.length
                ? html`<span class="carriages-badge">${departure.length}-car</span>`
                : ''}
              ${platform
                ? html`<span
                    class="platform-badge ${this._flapClass(
                      departure,
                      'platform'
                    )}"
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
