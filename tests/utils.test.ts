import { describe, expect, it } from 'vitest';
import {
  getStockCategory,
  formatRelativeMinutes,
  parseDateTime,
  isCatchable,
  getCallingPointName,
  isValidContractV2Departure,
  isValidContractV2CallingPoint,
} from '../src/utils';
import { TrainDeparture, CallingPoint } from '../src/types';

function makeDeparture(overrides: Partial<TrainDeparture> = {}): TrainDeparture {
  return {
    origin_name: 'London Charing Cross',
    destination_name: 'Dartford',
    service_uid: 'P63128',
    headcode: '2A69',
    type: 'train',
    operator_name: 'Southeastern',
    scheduled: '2026-06-10T12:00:00+01:00',
    estimated: '2026-06-10T12:00:00+01:00',
    scheduled_time: '12:00',
    estimated_time: '12:00',
    minutes: 0,
    delay_minutes: 0,
    status: 'on_time',
    status_class: 'on-time',
    status_label: 'On Time',
    offset_label: null,
    lateness: 0,
    is_cancelled: false,
    platform: '1',
    length: 8,
    stock: null,
    calling_points: [],
    destination_arrival_scheduled: null,
    destination_arrival_estimated: null,
    destination_arrival_time: null,
    destination_status: null,
    destination_delay_minutes: null,
    journey_duration_minutes: null,
    stops_count: null,
    disruption_reason: null,
    last_report_station: null,
    last_report_type: null,
    last_report_time: null,
    last_report_time_label: null,
    ...overrides,
  };
}

function makeCallingPoint(overrides: Partial<CallingPoint> = {}): CallingPoint {
  return {
    station_name: 'Lewisham',
    crs: 'LEW',
    tiploc: 'LEWISHM',
    scheduled: '2026-06-10T12:15:00+01:00',
    estimated: '2026-06-10T12:15:00+01:00',
    time: '12:15',
    delay_minutes: 0,
    status: 'on_time',
    status_class: 'on-time',
    status_label: 'On time',
    is_passed: false,
    is_current: false,
    is_between_previous: false,
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

  it('applies the Southeastern table when the operator matches', () => {
    expect(getStockCategory('City Beam', 'Southeastern').category).toBe('modern');
    expect(getStockCategory('395', 'southeastern').category).toBe('javelin');
  });

  it('does not apply Southeastern stock styling to other operators', () => {
    expect(getStockCategory('376', 'Avanti West Coast').category).toBe('standard');
    expect(getStockCategory('Javelin', 'Thameslink').category).toBe('standard');
  });

  it('falls back to matching all tables when no operator is given', () => {
    expect(getStockCategory('Javelin', null).category).toBe('javelin');
    expect(getStockCategory('Javelin', '').category).toBe('javelin');
  });
});

describe('formatRelativeMinutes', () => {
  const now = new Date('2026-06-10T12:00:00+01:00');

  it('formats minutes until the estimated departure', () => {
    const departure = makeDeparture({ estimated: '2026-06-10T12:04:00+01:00' });
    expect(formatRelativeMinutes(departure, now)).toBe('4 min');
  });

  it('returns Due for imminent or past departures', () => {
    expect(
      formatRelativeMinutes(makeDeparture({ estimated: '2026-06-10T12:00:00+01:00' }), now)
    ).toBe('Due');
    expect(
      formatRelativeMinutes(makeDeparture({ estimated: '2026-06-10T11:58:00+01:00' }), now)
    ).toBe('Due');
  });

  it('falls back to scheduled time and handles invalid dates', () => {
    const departure = makeDeparture({
      estimated: null,
      scheduled: '2026-06-10T12:30:00+01:00',
    });
    expect(formatRelativeMinutes(departure, now)).toBe('30 min');
    expect(
      formatRelativeMinutes(
        makeDeparture({ estimated: 'nonsense', scheduled: null as any }),
        now
      )
    ).toBeNull();
  });
});

describe('isCatchable', () => {
  const now = new Date('2026-06-10T12:00:00+01:00');

  it('is true when the walk time fits before departure', () => {
    const departure = makeDeparture({ estimated: '2026-06-10T12:10:00+01:00' });
    expect(isCatchable(departure, 10, now)).toBe(true);
    expect(isCatchable(departure, 11, now)).toBe(false);
  });

  it('falls back to scheduled departure time when estimated is null', () => {
    const departure = makeDeparture({
      estimated: null,
      scheduled: '2026-06-10T12:15:00+01:00',
    });
    expect(isCatchable(departure, 14, now)).toBe(true);
    expect(isCatchable(departure, 16, now)).toBe(false);
  });

  it('does not rule out departures without a parseable time', () => {
    const departure = makeDeparture({ estimated: 'garbage', scheduled: null as any });
    expect(isCatchable(departure, 15, now)).toBe(true);
  });
});

describe('parseDateTime', () => {
  it('parses ISO-8601 datetime strings with offset', () => {
    const parsed = parseDateTime('2026-06-10T20:15:00+01:00');
    expect(parsed).not.toBeNull();
    expect(parsed!.getTime()).toBe(new Date('2026-06-10T20:15:00+01:00').getTime());
  });

  it('parses UTC ISO-8601 datetime strings', () => {
    const parsed = parseDateTime('2026-11-15T21:51:00Z');
    expect(parsed).not.toBeNull();
    expect(parsed!.getTime()).toBe(new Date('2026-11-15T21:51:00Z').getTime());
  });

  it('returns null for garbage and undefined', () => {
    expect(parseDateTime(undefined)).toBeNull();
    expect(parseDateTime(null)).toBeNull();
    expect(parseDateTime('not a date')).toBeNull();
  });

  it('caches results in dateCache', () => {
    const cache = new Map<string, Date | null>();
    const first = parseDateTime('2026-06-10T20:15:00+01:00', cache);
    expect(cache.has('2026-06-10T20:15:00+01:00')).toBe(true);
    expect(parseDateTime('2026-06-10T20:15:00+01:00', cache)).toBe(first);

    parseDateTime('garbage', cache);
    expect(cache.has('garbage')).toBe(true);
    expect(parseDateTime('garbage', cache)).toBeNull();
  });
});

describe('getCallingPointName', () => {
  const point = makeCallingPoint({
    station_name: 'Lewisham',
    crs: 'LEW',
    tiploc: 'LEWISHM',
  });

  it('returns station_name for description identifier', () => {
    expect(getCallingPointName(point, 'description')).toBe('Lewisham');
  });

  it('returns crs for crs identifier', () => {
    expect(getCallingPointName(point, 'crs')).toBe('LEW');
  });

  it('returns tiploc for tiploc identifier', () => {
    expect(getCallingPointName(point, 'tiploc')).toBe('LEWISHM');
  });

  it('falls back gracefully when crs or tiploc is null', () => {
    const fallbackPoint = makeCallingPoint({
      station_name: 'Unknown Halt',
      crs: null,
      tiploc: null,
    });
    expect(getCallingPointName(fallbackPoint, 'crs')).toBe('Unknown Halt');
    expect(getCallingPointName(fallbackPoint, 'tiploc')).toBe('Unknown Halt');
  });
});

describe('isValidContractV2CallingPoint', () => {
  it('returns true for a valid Contract v2 calling point', () => {
    expect(isValidContractV2CallingPoint(makeCallingPoint())).toBe(true);
  });

  it('accepts null for crs, tiploc, estimated, and delay_minutes', () => {
    const cp = makeCallingPoint({
      crs: null,
      tiploc: null,
      estimated: null,
      delay_minutes: null,
    });
    expect(isValidContractV2CallingPoint(cp)).toBe(true);
  });

  it('returns false for null or non-objects', () => {
    expect(isValidContractV2CallingPoint(null)).toBe(false);
    expect(isValidContractV2CallingPoint(undefined)).toBe(false);
    expect(isValidContractV2CallingPoint('string')).toBe(false);
  });

  it('returns false when station_name is missing or non-string', () => {
    const cp = makeCallingPoint() as Record<string, unknown>;
    delete cp.station_name;
    expect(isValidContractV2CallingPoint(cp)).toBe(false);
    expect(isValidContractV2CallingPoint({ ...makeCallingPoint(), station_name: 123 })).toBe(false);
  });

  it('returns false when crs or tiploc is not string or null', () => {
    expect(isValidContractV2CallingPoint({ ...makeCallingPoint(), crs: 123 })).toBe(false);
    expect(isValidContractV2CallingPoint({ ...makeCallingPoint(), tiploc: 123 })).toBe(false);
  });

  it('returns false when scheduled or time is missing or not a string', () => {
    const cp1 = makeCallingPoint() as Record<string, unknown>;
    delete cp1.scheduled;
    expect(isValidContractV2CallingPoint(cp1)).toBe(false);

    const cp2 = makeCallingPoint() as Record<string, unknown>;
    delete cp2.time;
    expect(isValidContractV2CallingPoint(cp2)).toBe(false);
  });

  it('returns false when status or status_class is not a canonical enum value', () => {
    expect(isValidContractV2CallingPoint({ ...makeCallingPoint(), status: 'unknown' as never })).toBe(false);
    expect(isValidContractV2CallingPoint({ ...makeCallingPoint(), status_class: 'unknown' as never })).toBe(false);
  });

  it('returns false when delay_minutes is non-number and non-null', () => {
    expect(isValidContractV2CallingPoint({ ...makeCallingPoint(), delay_minutes: '5' as never })).toBe(false);
  });

  it('returns false when any progress flag is missing or non-boolean', () => {
    expect(isValidContractV2CallingPoint({ ...makeCallingPoint(), is_passed: null as never })).toBe(false);
    expect(isValidContractV2CallingPoint({ ...makeCallingPoint(), is_current: undefined as never })).toBe(false);
    expect(isValidContractV2CallingPoint({ ...makeCallingPoint(), is_between_previous: 'false' as never })).toBe(false);
  });
});

describe('isValidContractV2Departure', () => {
  it('returns true for a valid Contract v2 departure', () => {
    expect(isValidContractV2Departure(makeDeparture())).toBe(true);
    expect(isValidContractV2Departure(makeDeparture({ calling_points: [makeCallingPoint()] }))).toBe(true);
  });

  it('returns false for null or non-objects', () => {
    expect(isValidContractV2Departure(null)).toBe(false);
    expect(isValidContractV2Departure(undefined)).toBe(false);
    expect(isValidContractV2Departure('string')).toBe(false);
    expect(isValidContractV2Departure(123)).toBe(false);
  });

  it('returns false when destination_name is missing or not a string', () => {
    const departure = makeDeparture() as Record<string, unknown>;
    delete departure.destination_name;
    expect(isValidContractV2Departure(departure)).toBe(false);
  });

  it('returns false when canonical time fields are missing', () => {
    const d1 = makeDeparture() as Record<string, unknown>;
    delete d1.scheduled;
    expect(isValidContractV2Departure(d1)).toBe(false);

    const d2 = makeDeparture() as Record<string, unknown>;
    delete d2.scheduled_time;
    expect(isValidContractV2Departure(d2)).toBe(false);
  });

  it('returns false when canonical status fields are missing or non-canonical', () => {
    const d1 = makeDeparture() as Record<string, unknown>;
    delete d1.status;
    expect(isValidContractV2Departure(d1)).toBe(false);

    const d2 = makeDeparture() as Record<string, unknown>;
    delete d2.status_class;
    expect(isValidContractV2Departure(d2)).toBe(false);

    const d3 = makeDeparture() as Record<string, unknown>;
    delete d3.status_label;
    expect(isValidContractV2Departure(d3)).toBe(false);

    expect(isValidContractV2Departure({ ...makeDeparture(), status: 'custom_status' as never })).toBe(false);
    expect(isValidContractV2Departure({ ...makeDeparture(), status_class: 'custom_class' as never })).toBe(false);
  });

  it('returns false when is_cancelled is missing or non-boolean', () => {
    const d1 = makeDeparture() as Record<string, unknown>;
    delete d1.is_cancelled;
    expect(isValidContractV2Departure(d1)).toBe(false);

    const d2 = { ...makeDeparture(), is_cancelled: 'true' };
    expect(isValidContractV2Departure(d2)).toBe(false);
  });

  it('returns false when calling_points is not an array', () => {
    const d = { ...makeDeparture(), calling_points: null };
    expect(isValidContractV2Departure(d)).toBe(false);
  });

  it('returns false when calling_points contains null or malformed items', () => {
    const d1 = { ...makeDeparture(), calling_points: [null] as never };
    expect(isValidContractV2Departure(d1)).toBe(false);

    const d2 = { ...makeDeparture(), calling_points: [{ station_name: 'Lewisham' }] as never };
    expect(isValidContractV2Departure(d2)).toBe(false);
  });
});
