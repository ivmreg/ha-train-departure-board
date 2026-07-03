// @vitest-environment happy-dom
// Guards the data contract with ha_realtime_trains_api (see that repo's
// CONTRACT.md): sample_entity.json must match what the card's types and
// logic expect, so schema drift on either side fails this suite.
import { describe, expect, it } from 'vitest';
import sample from '../sample_entity.json';
import { TrainDeparture } from '../src/types';
import { getStatusMeta, getStopsForPopup, getStockCategory } from '../src/utils';
import '../src/train-departure-board';
import type { TrainDepartureBoard } from '../src/train-departure-board';

const departures = sample.attributes.next_trains as unknown as TrainDeparture[];

const DATETIME = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/;

describe('sample_entity.json matches the next_trains contract', () => {
  it('has at least one departure', () => {
    expect(departures.length).toBeGreaterThan(0);
  });

  it('every departure carries the always-present fields', () => {
    for (const train of departures) {
      expect(typeof train.origin_name).toBe('string');
      expect(typeof train.destination_name).toBe('string');
      expect(typeof train.service_uid).toBe('string');
      expect(typeof train.headcode).toBe('string');
      expect(typeof train.operator_name).toBe('string');
      expect(train.scheduled).toMatch(DATETIME);
      expect(train.estimated).toMatch(DATETIME);
      expect(typeof train.minutes).toBe('number');
      expect(typeof train.is_cancelled).toBe('boolean');
      // platform / length / stock are nullable but must be present
      expect('platform' in train).toBe(true);
      expect('length' in train).toBe(true);
      expect('stock' in train).toBe(true);
    }
  });

  it('journey-enriched departures carry the enrichment fields consistently', () => {
    const enriched = departures.filter(t => t.subsequent_stops !== undefined);
    expect(enriched.length).toBeGreaterThan(0);
    for (const train of enriched) {
      expect(train.scheduled_arrival).toMatch(DATETIME);
      expect(typeof train.journey_time_mins).toBe('number');
      expect(typeof train.stops).toBe('number');
      for (const stop of train.subsequent_stops) {
        expect(typeof stop.stop).toBe('string');
        expect(typeof stop.name).toBe('string');
        expect(stop.scheduled).toMatch(DATETIME);
        expect(stop.estimated).toMatch(DATETIME);
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

  it('the card logic digests every sample departure without throwing', () => {
    for (const train of departures) {
      expect(() => getStatusMeta(train)).not.toThrow();
      expect(() => getStockCategory(train.stock, train.operator_name)).not.toThrow();
      expect(() => getStopsForPopup(train, 'description')).not.toThrow();
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
