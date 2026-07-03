import { describe, expect, it } from 'vitest';
import {
  getStockCategory,
  extractTimeLabel,
  calculateDelayMins,
  parseDateTime,
  getStatusMeta,
  getStopsForPopup,
} from '../src/utils';
import { TrainDeparture, SubsequentStop } from '../src/types';

function makeDeparture(overrides: Partial<TrainDeparture> = {}): TrainDeparture {
  return {
    origin_name: 'London Charing Cross',
    destination_name: 'Dartford',
    service_uid: 'P63128',
    headcode: '2A69',
    type: 'train',
    scheduled: '10-06-2026 12:00',
    estimated: '10-06-2026 12:00',
    minutes: 0,
    lateness: 0,
    is_cancelled: false,
    platform: '1',
    length: 8,
    stock: null,
    operator_name: 'Southeastern',
    subsequent_stops: [],
    stops: 0,
    ...overrides,
  };
}

function makeStop(overrides: Partial<SubsequentStop> = {}): SubsequentStop {
  return {
    stop: 'LEW',
    name: 'Lewisham',
    scheduled: '10-06-2026 12:15',
    estimated: '10-06-2026 12:15',
    ...overrides,
  };
}

describe('getStockCategory', () => {
  it('maps City Beam and 707 to modern', () => {
    expect(getStockCategory('City Beam')).toEqual({
      category: 'modern',
      label: 'CITY BEAM',
    });
    expect(getStockCategory('Class 707').category).toBe('modern');
  });

  it('maps Javelin and 395', () => {
    expect(getStockCategory('Javelin').category).toBe('javelin');
    expect(getStockCategory('Class 395').category).toBe('javelin');
  });

  it('maps 376 to refurb', () => {
    expect(getStockCategory('376').category).toBe('refurb');
  });

  it('maps Networker family to older', () => {
    expect(getStockCategory('465').category).toBe('older');
    expect(getStockCategory('466').category).toBe('older');
    expect(getStockCategory('Networker').category).toBe('older');
  });

  it('maps null/unknown to standard with empty label', () => {
    expect(getStockCategory(null)).toEqual({ category: 'standard', label: '' });
    expect(getStockCategory('Pendolino')).toEqual({
      category: 'standard',
      label: '',
    });
  });
});

describe('extractTimeLabel', () => {
  it('handles falsy/empty values', () => {
    expect(extractTimeLabel(undefined)).toBe('—');
    expect(extractTimeLabel('')).toBe('—');
    expect(extractTimeLabel('  ')).toBe('—');
  });

  it('extracts time from a DD-MM-YYYY HH:MM string', () => {
    expect(extractTimeLabel('10-06-2026 20:15')).toBe('20:15');
  });

  it('passes through HH:MM directly', () => {
    expect(extractTimeLabel('08:30')).toBe('08:30');
  });
});

describe('calculateDelayMins', () => {
  it('calculates standard diffs', () => {
    expect(calculateDelayMins('10:00', '10:05')).toBe(5);
    expect(calculateDelayMins('10:00', '09:55')).toBe(-5);
    expect(calculateDelayMins('12:00', '12:00')).toBe(0);
  });

  it('handles midnight rollover both ways', () => {
    expect(calculateDelayMins('23:58', '00:03')).toBe(5);
    expect(calculateDelayMins('00:02', '23:57')).toBe(-5);
  });

  it('returns 0 for invalid formats', () => {
    expect(calculateDelayMins('foo', '10:00')).toBe(0);
    expect(calculateDelayMins('10:00', 'bar')).toBe(0);
  });
});

describe('parseDateTime', () => {
  it('parses full date-time (DD-MM-YYYY HH:MM)', () => {
    const parsed = parseDateTime('10-06-2026 20:15');
    expect(parsed).not.toBeNull();
    expect(parsed!.getFullYear()).toBe(2026);
    expect(parsed!.getMonth()).toBe(5);
    expect(parsed!.getDate()).toBe(10);
  });

  it('parses time-only as today', () => {
    const parsed = parseDateTime('14:45');
    expect(parsed).not.toBeNull();
    expect(parsed!.getHours()).toBe(14);
    expect(parsed!.getMinutes()).toBe(45);
  });

  it('returns null for garbage and undefined', () => {
    expect(parseDateTime(undefined)).toBeNull();
    expect(parseDateTime('not a date')).toBeNull();
  });

  it('caches results (including nulls) in dateCache', () => {
    const cache = new Map<string, Date | null>();
    const first = parseDateTime('10-06-2026 20:15', cache);
    expect(cache.has('10-06-2026 20:15')).toBe(true);
    expect(parseDateTime('10-06-2026 20:15', cache)).toBe(first);

    parseDateTime('garbage', cache);
    expect(cache.has('garbage')).toBe(true);
    expect(parseDateTime('garbage', cache)).toBeNull();
  });
});

describe('getStatusMeta', () => {
  it('detects cancellation from every supported field', () => {
    expect(getStatusMeta(makeDeparture({ is_cancelled: true })).statusClass).toBe('cancelled');
    expect(getStatusMeta(makeDeparture({ status: 'Cancelled by operator' })).statusClass).toBe('cancelled');
    expect(getStatusMeta(makeDeparture({ etd: 'Cancel' })).statusClass).toBe('cancelled');
    expect(getStatusMeta(makeDeparture({ estimated: 'Cancelled' })).statusClass).toBe('cancelled');
    expect(getStatusMeta(makeDeparture({ planned_cancel: true })).statusClass).toBe('cancelled');
    expect(getStatusMeta(makeDeparture({ cancel_reason: 'engineering' })).statusClass).toBe('cancelled');
  });

  it('reports Awaiting when no estimate is available', () => {
    const meta = getStatusMeta(makeDeparture({ estimated: '' }));
    expect(meta.statusLabel).toBe('Awaiting');
    expect(meta.statusClass).toBe('delayed');
  });

  it('treats literal "On time" estimates as on time', () => {
    expect(getStatusMeta(makeDeparture({ estimated: 'On Time' })).statusClass).toBe('on-time');
  });

  it('treats <=1 minute deviation as on time', () => {
    const meta = getStatusMeta(
      makeDeparture({ scheduled: '12:00', estimated: '12:01' })
    );
    expect(meta.statusClass).toBe('on-time');
  });

  it('reports delays with label and offset', () => {
    const meta = getStatusMeta(
      makeDeparture({ scheduled: '12:00', estimated: '12:05' })
    );
    expect(meta).toEqual({
      statusLabel: 'Exp 12:05',
      statusClass: 'delayed',
      offsetStr: '+5m',
    });
  });

  it('reports early running with label and negative offset', () => {
    const meta = getStatusMeta(
      makeDeparture({ scheduled: '12:00', estimated: '11:55' })
    );
    expect(meta).toEqual({
      statusLabel: 'Early 11:55',
      statusClass: 'early',
      offsetStr: '-5m',
    });
  });

  it('handles delays across midnight', () => {
    const meta = getStatusMeta(
      makeDeparture({
        scheduled: '10-06-2026 23:58',
        estimated: '11-06-2026 00:04',
      })
    );
    expect(meta.statusClass).toBe('delayed');
    expect(meta.offsetStr).toBe('+6m');
  });
});

describe('getStopsForPopup', () => {
  it('maps stops and sorts them chronologically', () => {
    const departure = makeDeparture({
      subsequent_stops: [
        makeStop({ stop: 'LEW', name: 'Lewisham', scheduled: '10-06-2026 12:15', estimated: '10-06-2026 12:15' }),
        makeStop({ stop: 'LBG', name: 'London Bridge', scheduled: '10-06-2026 12:08', estimated: '10-06-2026 12:08' }),
      ],
    });

    const stops = getStopsForPopup(departure, 'description');
    expect(stops.map(s => s.stopCode)).toEqual(['LBG', 'LEW']);
    expect(stops[0].time).toBe('12:08');
  });

  it('chooses the name according to stopsIdentifier', () => {
    const departure = makeDeparture({ subsequent_stops: [makeStop()] });

    expect(getStopsForPopup(departure, 'tiploc')[0].name).toBe('LEW');
    expect(getStopsForPopup(departure, 'crs')[0].name).toBe('Lewisham');
    expect(getStopsForPopup(departure, 'description')[0].name).toBe('Lewisham');
  });

  it('flags per-stop delays', () => {
    const departure = makeDeparture({
      subsequent_stops: [
        makeStop({ scheduled: '10-06-2026 12:15', estimated: '10-06-2026 12:20' }),
      ],
    });

    const [stop] = getStopsForPopup(departure, 'description');
    expect(stop.statusClass).toBe('delayed');
    expect(stop.statusLabel).toBe('Exp 12:20');
  });

  it('marks all stops as future when there is no last report', () => {
    const departure = makeDeparture({
      subsequent_stops: [makeStop()],
    });

    const stops = getStopsForPopup(departure, 'description');
    expect(stops[0].isPassed).toBe(false);
    expect(stops[0].isCurrent).toBe(false);
    expect(stops[0].isBetweenPrevious).toBe(false);
  });

  it('marks the reported station current on Arrival reports', () => {
    const departure = makeDeparture({
      subsequent_stops: [
        makeStop({ stop: 'LBG', name: 'London Bridge', scheduled: '10-06-2026 12:08', estimated: '10-06-2026 12:08' }),
        makeStop({ stop: 'LEW', name: 'Lewisham', scheduled: '10-06-2026 12:15', estimated: '10-06-2026 12:15' }),
      ],
      last_report_station: 'LBG',
      last_report_type: 'Arrival',
      last_report_time: '10-06-2026 12:07',
    });

    const stops = getStopsForPopup(departure, 'description');
    expect(stops[0].isCurrent).toBe(true);
    expect(stops[0].isPassed).toBe(false);
    expect(stops[1].isBetweenPrevious).toBe(false);
  });

  it('marks the train between stations on Departure reports', () => {
    const departure = makeDeparture({
      subsequent_stops: [
        makeStop({ stop: 'LBG', name: 'London Bridge', scheduled: '10-06-2026 12:08', estimated: '10-06-2026 12:08' }),
        makeStop({ stop: 'LEW', name: 'Lewisham', scheduled: '10-06-2026 12:15', estimated: '10-06-2026 12:15' }),
      ],
      last_report_station: 'LBG',
      last_report_type: 'Departure',
      last_report_time: '10-06-2026 12:09',
    });

    const stops = getStopsForPopup(departure, 'description');
    expect(stops[0].isPassed).toBe(true);
    expect(stops[0].isCurrent).toBe(false);
    expect(stops[1].isBetweenPrevious).toBe(true);
  });

  it('interpolates position by time when the reported station is unlisted', () => {
    const departure = makeDeparture({
      subsequent_stops: [
        makeStop({ stop: 'LBG', name: 'London Bridge', scheduled: '10-06-2026 12:08', estimated: '10-06-2026 12:08' }),
        makeStop({ stop: 'LEW', name: 'Lewisham', scheduled: '10-06-2026 12:15', estimated: '10-06-2026 12:15' }),
      ],
      last_report_station: 'XXX',
      last_report_type: 'Pass',
      last_report_time: '10-06-2026 12:10',
    });

    const stops = getStopsForPopup(departure, 'description');
    expect(stops.map(s => s.name)).toEqual(['London Bridge', 'Lewisham']);
    expect(stops[0].isPassed).toBe(true);
    expect(stops[1].isBetweenPrevious).toBe(true);
  });

  it('injects the unlisted previous station before the first stop', () => {
    const departure = makeDeparture({
      subsequent_stops: [
        makeStop({ stop: 'LEW', name: 'Lewisham', scheduled: '10-06-2026 12:15', estimated: '10-06-2026 12:15' }),
      ],
      last_report_station: 'LBG',
      last_report_type: 'Departure',
      last_report_time: '10-06-2026 12:09',
    });

    const stops = getStopsForPopup(departure, 'description');
    // The unlisted station the train just left is prepended as passed
    expect(stops[0].stopCode).toBe('LBG');
    expect(stops[0].isPassed).toBe(true);
    expect(stops[1].isBetweenPrevious).toBe(true);
  });
});
