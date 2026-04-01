# Train Departure Board

A custom Lovelace card for Home Assistant that displays train departure information in a TFL-style board format.

## Features

- 🚆 Real-time train departure information
- 🎨 Clean, modern design inspired by TFL departure boards
- ⏱️ Automatic status detection (On Time/Delayed)
- 🚉 Platform information display
- 📱 Responsive layout

## Configuration

The card will automatically appear in the card picker after installation. Simply search for "Train Departure Board" when adding a new card to your dashboard.

### Example Configuration

```yaml
type: custom:train-departure-board
title: Train Departures
entity: sensor.your_train_sensor
```

The card expects data from a sensor that provides train departure information in the following format:

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
  subsequent_stops: []
  stops: 14
```

## Support

For issues, feature requests, or contributions, please visit the [GitHub repository](https://github.com/ivmreg/ha-train-departure-board).
