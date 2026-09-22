# Example Configuration and Data Structure

> The canonical definition of the departure-array schema lives in the
> producing integration's
> [CONTRACT.md](https://github.com/ivmreg/ha_realtime_trains_api/blob/main/CONTRACT.md);
> `tests/contract.test.ts` validates `sample_entity.json` against the card's
> expectations so drift on either side fails CI.

> [!WARNING]
> **Breaking Change (Contract Version 2)**
> The card now consumes canonical, pre-calculated railway domain attributes directly from the sensor entity (display-ready timestamps, statuses, delays, calling points, and destination arrival).
> **Coordinated Upgrade Required:** This version requires `ha_realtime_trains_api` Contract Version 2 (`contract_version: 2`). Legacy v1 payloads are not supported.

## Basic Card Configuration

Add this to your Lovelace dashboard YAML or use the visual editor:

```yaml
type: custom:train-departure-board
title: Train Departures
entity: sensor.train_departures
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | required | Must be `custom:train-departure-board` |
| `title` | string | none | Title displayed at the top of the card |
| `entity` | string | required | Entity ID that contains the departure data |
| `attribute` | string | `next_trains` | Name of the entity attribute that holds the departures array |
| `stops_identifier` | string | `description` | How stations are named in the popup timeline: `description`, `crs`, or `tiploc` |
| `row_size` | string | `normal` | Row density: `compact`, `normal`, or `comfortable` |
| `time_display` | string | `scheduled` | `scheduled` clock time, `relative` countdown ("4 min"), or `both` |
| `walk_time_minutes` | number | `0` | Minutes you need to reach the platform. Highlights the first train you can still catch and dims earlier ones |
| `show_carriages` | boolean | `true` | Show train carriage/length count details if available |
| `stale_indicator` | boolean | `true` | Show a "Showing last-known data" chip when the sensor reports `data_stale: true` or its `next_update_at` is overdue |
| `font_size_time` | string | `1.25rem` | CSS font size for the departure time |
| `font_size_destination` | string | `1rem` | CSS font size for the destination |
| `font_size_status` | string | `0.75rem` | CSS font size for the status pill |

## Expected Entity Data Structure (Contract Version 2)

The card expects a sensor entity with an array of departures. By default it reads `attributes.next_trains`, but you can change the attribute name through the `attribute` option if your integration uses something like `departures`. Each departure should have:

```yaml
state: "10"
attributes:
  contract_version: 2
  journey_start: "DFD"
  journey_end: "CST"
  next_trains:
    - origin_name: "Dartford"
      destination_name: "London Cannon Street"
      service_uid: "P63128"
      headcode: "2A69"
      type: "TRAIN"
      operator_name: "Southeastern"
      scheduled: "2026-04-01T22:13:00+01:00"
      estimated: "2026-04-01T22:13:00+01:00"
      scheduled_time: "22:13"
      estimated_time: "22:13"
      minutes: 10
      delay_minutes: 0
      status: "on_time"
      status_class: "on-time"
      status_label: "On Time"
      offset_label: null
      lateness: null
      is_cancelled: false
      platform: "1"
      length: 8
      stock: null
      calling_points:
        - station_name: "Lewisham"
          crs: "LEW"
          tiploc: "LEWISHM"
          scheduled: "2026-04-01T22:16:00+01:00"
          estimated: "2026-04-01T22:16:00+01:00"
          time: "22:16"
          delay_minutes: 0
          status: "on_time"
          status_class: "on-time"
          status_label: "On time"
          is_passed: false
          is_current: false
          is_between_previous: false
      destination_arrival_time: "22:45"
      journey_duration_minutes: 32
      stops_count: 14
```

## Field Descriptions

### Required Departure Fields
- **origin_name**: Station name where the train departs from
- **destination_name**: Destination station name
- **scheduled**: Scheduled departure time (ISO-8601 string)
- **scheduled_time**: Display-ready 24-hour scheduled departure time (`"HH:MM"`)
- **status**: Normalized service status (`"on_time"`, `"delayed"`, `"early"`, `"cancelled"`, `"awaiting"`)
- **status_class**: Status CSS class (`"on-time"`, `"delayed"`, `"early"`, `"cancelled"`)
- **status_label**: Display-ready status label (e.g. `"On Time"`, `"Exp 22:18"`, `"Cancelled"`)
- **is_cancelled**: Boolean flag indicating service cancellation

### Optional / Enriched Departure Fields
- **estimated**: Estimated/actual departure time (ISO-8601 string)
- **estimated_time**: Display-ready 24-hour estimated departure time (`"HH:MM"`)
- **delay_minutes**: Integer delay in minutes (or `null`)
- **offset_label**: Display-ready offset string (e.g. `"+5m"`, `"-2m"`, or `null`)
- **service_uid**: Unique service identifier
- **headcode**: Train headcode (e.g. `2A69`)
- **type**: Service type (e.g. `TRAIN`)
- **operator_name**: Train operating company (scopes rolling-stock styling)
- **platform**: Platform number
- **length**: Number of carriages
- **stock**: Rolling stock branding (e.g. `City Beam`, `Javelin`)
- **calling_points**: Display-ready calling points list with timeline tracking
- **destination_arrival_time**: Display-ready clock arrival time (`"HH:MM"`)
- **journey_duration_minutes**: Total journey duration in minutes
- **stops_count**: Number of intermediate stops
- **last_report_station** / **last_report_time_label**: Live train location report
- **is_pinned**: Marks the recurring pinned train (`📌` marker)

When a displayed time, platform, or status *changes* between refreshes, the affected value plays a brief split-flap-style flip (disabled under `prefers-reduced-motion`).

### Optional Entity-Level Attributes

- **data_stale** (boolean): Set by the integration when it is serving cached data because the upstream API is down or rate-limited; triggers the card's stale-data chip
- **next_update_at** (ISO datetime): When the next refresh is expected; if it is more than a minute overdue the card also shows the stale-data chip

## Display Behavior

The card focuses purely on presentation and household policy:
- **Displays pre-calculated times and statuses** directly from the canonical API contract.
- **Renders countdowns** dynamically relative to client time when configured.
- **Applies walking-time filtering**: highlights the first departure the viewer can catch according to `walk_time_minutes`.
- **Maps rolling stock**: badges and accent colors for known train models per operator.
