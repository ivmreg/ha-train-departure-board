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

## Expected Entity Data Structure

The card expects a sensor entity with an `attributes.departures` array. Each departure should have:

```yaml
state: "updated"
attributes:
  departures:
    - origin_name: "Dartford"
      destination_name: "London Charing Cross"
      service_uid: "P19333"
      scheduled: "13-11-2025 22:51"
      estimated: "13-11-2025 22:51"
      minutes: 14
      platform: "1"
      operator_name: "Southeastern"
      stops_of_interest:
        - stop: "LBG"
          name: "London Bridge"
          scheduled_stop: "13-11-2025 23:03"
          estimate_stop: "13-11-2025 23:03"
          journey_time_mins: 12
          stops: 8
      stops: 11
    - origin_name: "Dartford"
      destination_name: "London Bridge"
      service_uid: "P19334"
      scheduled: "13-11-2025 23:00"
      estimated: "13-11-2025 23:05"
      minutes: 21
      platform: "2"
      operator_name: "Southeastern"
      stops_of_interest: []
      stops: 5
```

## Field Descriptions

### Required Fields
- **origin_name**: Where the train departs from
- **destination_name**: Where the train is going
- **scheduled**: Scheduled departure time (format: "DD-MM-YYYY HH:MM")
- **estimated**: Estimated/actual departure time
- **platform**: Platform number

### Optional Fields
- **service_uid**: Unique service identifier
- **minutes**: Minutes until departure
- **operator_name**: Train operating company
- **stops_of_interest**: Important stops on the route
- **stops**: Total number of stops

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
