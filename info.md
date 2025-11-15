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
  destination_name: London Charing Cross
  service_uid: P19333
  scheduled: "13-11-2025 22:51"
  estimated: "13-11-2025 22:51"
  minutes: 14
  platform: "1"
  operator_name: Southeastern
  stops_of_interest: []
  stops: 11
```

## Support

For issues, feature requests, or contributions, please visit the [GitHub repository](https://github.com/ivmreg/ha-train-departure-board).
