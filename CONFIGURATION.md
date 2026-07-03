# Example Configuration and Data Structure

> The canonical definition of the departure-array schema lives in the
> producing integration's
> [CONTRACT.md](https://github.com/ivmreg/ha_realtime_trains_api/blob/main/CONTRACT.md);
> `tests/contract.test.ts` validates `sample_entity.json` against the card's
> expectations so drift on either side fails CI.

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

> `delay_layout` was removed: the inline status pill introduced in the
> 2026-04-13 row refinement covers all layouts. The key is ignored if present
> in existing configs.

## Expected Entity Data Structure

The card expects a sensor entity with an array of departures. By default it reads `attributes.next_trains`, but you can change the attribute name through the `attribute` option if your integration uses something like `departures`. Each departure should have:

```yaml
state: "updated"
attributes:
  next_trains:
    - origin_name: "Dartford"
      destination_name: "London Cannon Street"
      service_uid: "P63128"
      headcode: "2A69"
      type: "TRAIN"
      operator_name: "Southeastern"
      scheduled: "01-04-2026 22:13"
      estimated: "01-04-2026 22:13"
      minutes: 8
      lateness: null
      is_cancelled: false
      platform: "1"
      length: 8
      stock: null
      subsequent_stops:
        - stop: "LEW"
          name: "Lewisham"
          scheduled: "01-04-2026 22:16"
          estimated: "01-04-2026 22:16"
      stops: 14
```

## Field Descriptions

### Required Fields
- **origin_name**: Where the train departs from
- **destination_name**: Where the train is going
- **scheduled**: Scheduled departure time (format: "DD-MM-YYYY HH:MM")
- **estimated**: Estimated/actual departure time
- **platform**: Platform number
- **is_cancelled**: Boolean flag for cancellation

### Optional Fields
- **service_uid**: Unique service identifier
- **headcode**: Train headcode (e.g. 2A69)
- **type**: Service type (e.g. TRAIN)
- **minutes**: Minutes until departure
- **operator_name**: Train operating company (also scopes rolling-stock badge styling)
- **subsequent_stops**: List of upcoming stops
- **stops**: Total number of stops
- **length**: Number of coaches
- **stock**: Train stock description (e.g. City Beam)
- **last_report_station** / **last_report_type** / **last_report_time**: The train's last reported position; shown as "Last seen at …" in the details popup and used to place the live train marker on the timeline
- **journey_time_mins** / **stops** / **scheduled_arrival** / **estimate_arrival**: Journey enrichment; shown as a "33 min journey · 7 stops · arrives 20:54" summary in the details popup
- **is_pinned**: Marks the query's pinned recurring train; the row gets a 📌 marker

When a displayed time, platform, or status *changes* between refreshes, the affected value plays a brief split-flap-style flip (disabled under `prefers-reduced-motion`).

### Optional Entity-Level Attributes

- **data_stale** (boolean): Set by the integration when it is serving cached data because the upstream API is down or rate-limited; triggers the card's stale-data chip
- **next_update_at** (ISO datetime): When the next refresh is expected; if it is more than a minute overdue the card also shows the stale-data chip
## Display Behavior

The card automatically:
- **Extracts time** from the scheduled/estimated datetime fields
- **Detects delays** by comparing scheduled vs estimated times
- **Color codes status**:
  - 🟢 Green: "On Time" (scheduled = estimated)
  - 🟠 Orange: "Delayed" (estimated > scheduled)
  - 🔴 Red: "Cancelled" (status indicates cancellation)

## Example Home Assistant Template

If you're creating a custom sensor, here's a template structure:

```yaml
template:
  - sensor:
      - name: "Train Departures"
        unique_id: "train_departures"
        state: "updated"
        attributes:
          departures: |
            {% set departures = [
              {
                "origin_name": "Dartford",
                "destination_name": "London Charing Cross",
                "scheduled": "14-11-2025 08:30",
                "estimated": "14-11-2025 08:30",
                "platform": "1",
                "operator_name": "Southeastern"
              }
            ] %}
            {{ departures }}
```

## Tips for Integration

### REST Sensor Example

```yaml
rest:
  - resource: "https://your-api.com/departures"
    scan_interval: 60
    sensor:
      - name: "Train Departures"
        unique_id: "train_departures"
        json_attributes:
          - departures
        value_template: "{{ now().isoformat() }}"
        headers:
          Authorization: "Bearer YOUR_TOKEN"
```

### Custom Integration

For a custom integration providing train data, ensure the entity attributes include:
```python
{
    "departures": [
        {
            "origin_name": str,
            "destination_name": str,
            "scheduled": "DD-MM-YYYY HH:MM",
            "estimated": "DD-MM-YYYY HH:MM",
            "platform": str,
            "operator_name": str,
            # ... other fields
        },
        # ... more departures
    ]
}
```
