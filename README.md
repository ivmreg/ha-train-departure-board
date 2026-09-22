# Train Departure Board for Home Assistant

A custom Lovelace card for Home Assistant that displays train departure information in a format similar to the boards used by Transport for London (TFL).

## Features

- 🚆 Real-time train departure information
- 🎨 Clean, modern design inspired by TFL departure boards
- ⏱️ Automatic status detection (On Time/Delayed)
- 🚉 Platform information display
- 📱 Responsive grid layout
- ✨ No manual configuration required - appears automatically in card picker

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Click on "Frontend"
3. Click the three dots in the top right corner
4. Select "Custom repositories"
5. Add this repository URL: `https://github.com/ivmreg/ha-train-departure-board`
6. Select category: "Lovelace"
7. Click "Add"
8. Find "Train Departure Board" in the list and click "Download"
9. Restart Home Assistant

### Manual Installation

1. Download `ha-train-departure-board.js` from the latest release
2. Copy it to `<config>/www/community/ivmreg_ha-train-departure-board/ha-train-departure-board.js` (create the folders if they don't exist)
3. Add the resource to your Lovelace configuration:
   - Go to Settings → Dashboards → Resources
   - Click "Add Resource"
   - URL: `/local/community/ivmreg_ha-train-departure-board/ha-train-departure-board.js`
   - Resource type: JavaScript Module
4. Restart Home Assistant

## Usage

After installation, the card will automatically appear in your card picker. No need to manually add it to your configuration!

1. Edit your dashboard
2. Click "Add Card"
3. Search for "Train Departure Board"
4. Configure the card with your train sensor

### Configuration Options

```yaml
type: custom:train-departure-board
title: Train Departures
entity: sensor.your_train_sensor
attribute: next_trains # optional; use e.g. "departures" if your sensor uses another attribute name
row_size: normal # optional: compact | normal | comfortable
time_display: scheduled # optional: scheduled | relative ("4 min") | both
walk_time_minutes: 12 # optional: highlight the first train you can still reach
show_carriages: true # optional
stale_indicator: true # optional: warn when the data source is stale
```

If your integration exposes the departures array under a different attribute (for example `departures`), set the `attribute` field to that exact name so the card can find it.

See [CONFIGURATION.md](CONFIGURATION.md) for the full option reference and the expected data structure.

> [!WARNING]
> **Breaking Change (Contract Version 2)**
> The card now consumes canonical, pre-calculated railway domain attributes directly from the sensor entity (display-ready timestamps, statuses, delays, calling points, and destination arrival).
> **Coordinated Upgrade Required:** This version requires `ha_realtime_trains_api` Contract Version 2 (`contract_version: 2`). Legacy v1 payloads are not supported.

### Expected Data Format

The card expects a sensor providing an array of train departures following Contract Version 2:

```yaml
- origin_name: Dartford
  destination_name: London Cannon Street
  service_uid: P63128
  headcode: 2A69
  type: TRAIN
  operator_name: Southeastern
  scheduled: "2026-04-01T22:13:00+01:00"
  estimated: "2026-04-01T22:13:00+01:00"
  scheduled_time: "22:13"
  estimated_time: "22:13"
  minutes: 8
  delay_minutes: 0
  status: on_time
  status_class: on-time
  status_label: "On Time"
  offset_label: null
  lateness: null
  is_cancelled: false
  platform: "1"
  length: 8
  stock: null
  calling_points:
    - station_name: Lewisham
      crs: LEW
      tiploc: LEWISHM
      scheduled: "2026-04-01T22:16:00+01:00"
      estimated: "2026-04-01T22:16:00+01:00"
      time: "22:16"
      status: on_time
      status_class: on-time
      status_label: "On time"
      is_passed: false
      is_current: false
      is_between_previous: false
  destination_arrival_time: "22:45"
  journey_duration_minutes: 32
  stops_count: 14
```

## Development

To contribute or make modifications:

1. Clone the repository:
   ```bash
   git clone https://github.com/ivmreg/ha-train-departure-board.git
   cd ha-train-departure-board
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Watch for changes during development:
   ```bash
   npm run watch
   ```

The Lovelace card is implemented entirely in `src/train-departure-board.ts`. That file is the single place where the `custom:train-departure-board` element is registered, and the bundle `ha-train-departure-board.js` is produced directly from it via Rollup. Keeping a single entry point avoids the confusion we previously had when multiple files declared components with the same tag name.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by Transport for London (TFL) departure boards
- Built with Lit for efficient web components
- Thanks to the Home Assistant community