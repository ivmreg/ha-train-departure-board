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
```

If your integration exposes the departures array under a different attribute (for example `departures`), set the `attribute` field to that exact name so the card can find it.

### Expected Data Format

The card expects a sensor that provides an array of train departures with the following structure:

```yaml
- origin_name: Dartford
  destination_name: London Cannon Street
  service_uid: P63128
  headcode: 2A69
  type: TRAIN
  operator_name: Southeastern
  scheduled: 01-04-2026 22:13
  estimated: 01-04-2026 22:13
  minutes: 8
  lateness: null
  is_cancelled: false
  platform: "1"
  length: 8
  stock: null
  subsequent_stops:
    - stop: LEW
      name: Lewisham
      scheduled: 01-04-2026 22:16
      estimated: 01-04-2026 22:16
  stops: 14
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

The Lovelace card is implemented entirely in `src/train-departure-card.ts`. That file is the single place where the `custom:train-departure-board` element is registered, and the bundle `ha-train-departure-board.js` is produced directly from it via Rollup. Keeping a single entry point avoids the confusion we previously had when multiple files declared components with the same tag name.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by Transport for London (TFL) departure boards
- Built with Lit for efficient web components
- Thanks to the Home Assistant community