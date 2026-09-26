// @vitest-environment happy-dom
// Guards the data contract with ha_realtime_trains_api (see that repo's
// CONTRACT.md): sample_entity.json must match what the card's types and
// logic expect, so schema drift on either side fails this suite.
import { describe, expect, it } from 'vitest';
import sample from '../sample_entity.json';
import { TrainDeparture } from '../src/types';
import { getStockCategory, getCallingPointName } from '../src/utils';
import '../src/train-departure-board';
import type { TrainDepartureBoard } from '../src/train-departure-board';

const departures = sample.attributes.next_trains as unknown as TrainDeparture[];

const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/;
const TIME_LABEL = /^\d{2}:\d{2}$/;

describe('sample_entity.json matches the Contract v2 contract', () => {
  it('has at least one departure', () => {
    expect(departures.length).toBeGreaterThan(0);
  });

  it('exposes contract_version 2 and omits redundant schema_version', () => {
    expect(sample.attributes.contract_version).toBe(2);
    expect((sample.attributes as Record<string, unknown>).schema_version).toBeUndefined();
  });

  it('omits all legacy aliases from departure payloads', () => {
    const legacyAliases = [
      'scheduled_iso',
      'estimated_iso',
      'subsequent_stops',
      'reason',
      'scheduled_arrival',
      'estimate_arrival',
      'scheduled_arrival_iso',
      'estimate_arrival_iso',
      'journey_time_mins',
      'stops',
      'last_report_time_iso',
    ];
    for (const train of departures) {
      const trainRecord = train as unknown as Record<string, unknown>;
      for (const alias of legacyAliases) {
        expect(trainRecord[alias]).toBeUndefined();
      }
    }
  });

  it('every departure carries the required Contract v2 fields', () => {
    for (const train of departures) {
      expect(typeof train.origin_name).toBe('string');
      expect(typeof train.destination_name).toBe('string');
      expect(typeof train.service_uid).toBe('string');
      expect(typeof train.headcode).toBe('string');
      expect(typeof train.operator_name).toBe('string');
      expect(train.scheduled).toMatch(ISO_DATETIME);
      if (train.estimated) {
        expect(train.estimated).toMatch(ISO_DATETIME);
      }
      expect(train.scheduled_time).toMatch(TIME_LABEL);
      if (train.estimated_time) {
        expect(train.estimated_time).toMatch(TIME_LABEL);
      }
      expect(typeof train.minutes).toBe('number');
      expect(typeof train.is_cancelled).toBe('boolean');
      expect(typeof train.status).toBe('string');
      expect(typeof train.status_class).toBe('string');
      expect(typeof train.status_label).toBe('string');
      expect('offset_label' in train).toBe(true);
      expect('platform' in train).toBe(true);
      expect('length' in train).toBe(true);
      expect('stock' in train).toBe(true);
      expect(Array.isArray(train.calling_points)).toBe(true);
    }
  });

  it('journey-enriched departures carry Contract v2 enrichment fields consistently', () => {
    const enriched = departures.filter(t => t.calling_points.length > 0);
    expect(enriched.length).toBeGreaterThan(0);
    for (const train of enriched) {
      expect(train.destination_arrival_scheduled).toMatch(ISO_DATETIME);
      if (train.destination_arrival_estimated) {
        expect(train.destination_arrival_estimated).toMatch(ISO_DATETIME);
      }
      expect(train.destination_arrival_time).toMatch(TIME_LABEL);
      expect(typeof train.journey_duration_minutes).toBe('number');
      expect(typeof train.stops_count).toBe('number');
      for (const stop of train.calling_points) {
        expect(typeof stop.station_name).toBe('string');
        expect('crs' in stop).toBe(true);
        expect('tiploc' in stop).toBe(true);
        expect(stop.scheduled).toMatch(ISO_DATETIME);
        if (stop.estimated) {
          expect(stop.estimated).toMatch(ISO_DATETIME);
        }
        expect(stop.time).toMatch(TIME_LABEL);
        expect(typeof stop.status).toBe('string');
        expect(typeof stop.status_class).toBe('string');
        expect(typeof stop.status_label).toBe('string');
        expect(typeof stop.is_passed).toBe('boolean');
        expect(typeof stop.is_current).toBe('boolean');
        expect(typeof stop.is_between_previous).toBe('boolean');
      }
    }
  });

  it('entity-level attributes match the contract', () => {
    const attrs = sample.attributes;
    expect(typeof attrs.journey_start).toBe('string');
    expect(typeof attrs.current_polling_interval).toBe('number');
    expect(typeof attrs.data_stale).toBe('boolean');
    expect(Number.isNaN(new Date(attrs.next_update_at).getTime())).toBe(false);
  });

  it('disruption and status attributes match Contract v2 contract', () => {
    const attrs = sample.attributes as Record<string, unknown>;
    expect(typeof attrs.service_status).toBe('string');
    expect([
      'normal',
      'delayed',
      'disrupted',
      'engineering_work',
      'station_closed',
      'no_departures',
    ]).toContain(attrs.service_status);
    expect(Array.isArray(attrs.station_messages)).toBe(true);
    for (const msg of attrs.station_messages as string[]) {
      expect(typeof msg).toBe('string');
    }
    expect(Array.isArray(attrs.disruptions)).toBe(true);
    for (const disruption of attrs.disruptions as Array<Record<string, unknown>>) {
      expect(typeof disruption.id).toBe('string');
      expect(typeof disruption.title).toBe('string');
      expect(typeof disruption.is_planned).toBe('boolean');
      expect(typeof disruption.summary).toBe('string');
      expect('alternative_travel' in disruption).toBe(true);
      expect('url' in disruption).toBe(true);
    }
  });

  it('presentation utilities digest sample departures without throwing', () => {
    for (const train of departures) {
      expect(() => getStockCategory(train.stock, train.operator_name)).not.toThrow();
      for (const stop of train.calling_points) {
        expect(() => getCallingPointName(stop, 'description')).not.toThrow();
        expect(() => getCallingPointName(stop, 'crs')).not.toThrow();
        expect(() => getCallingPointName(stop, 'tiploc')).not.toThrow();
      }
    }
  });

  it('the card renders the sample entity end to end', async () => {
    const card = document.createElement(
      'train-departure-board'
    ) as TrainDepartureBoard;
    card.setConfig({
      type: 'custom:train-departure-board',
      entity: sample.entity_id,
    } as never);
    card.hass = { states: { [sample.entity_id]: sample } } as never;
    document.body.appendChild(card);
    await card.updateComplete;

    const rows = card.shadowRoot!.querySelectorAll('.train');
    expect(rows.length).toBe(departures.length);
    // The sample pins the first train and cancels the last
    expect(rows[0].querySelector('.pin-marker')).not.toBeNull();
    expect(rows[rows.length - 1].classList.contains('cancelled-row')).toBe(true);
    document.body.innerHTML = '';
  });
});
