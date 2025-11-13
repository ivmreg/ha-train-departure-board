import { css } from 'lit';

export const cardStyles = css`
  .train-departure-card {
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
  }

  .header {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 12px;
    color: #333333;
  }

  .departure-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .departure-row:last-child {
    border-bottom: none;
  }

  .time {
    font-size: 1.2em;
    color: #007bff;
  }

  .destination {
    font-size: 1.2em;
    color: #333333;
  }

  .status {
    font-size: 1em;
    color: #ff5722;
  }

  .platform {
    font-size: 1em;
    color: #4caf50;
    font-weight: bold;
  }

  .no-departures {
    text-align: center;
    color: #999999;
    font-style: italic;
  }
`;