# Example Configuration and Data Structure

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
| `title` | string | "Train Departures" | Title displayed at the top of the card |
| `entity` | string | required | Entity ID that contains the departure data |
| `attribute` | string | `next_trains` | Name of the entity attribute that holds the departures array |

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
- **operator_name**: Train operating company
- **subsequent_stops**: List of upcoming stops
- **stops**: Total number of stops
- **length**: Number of coaches
- **stock**: Train stock description (e.g. City Beam)
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
