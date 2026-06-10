// tests/mapping.test.ts
import {
  getStockCategory,
  extractTimeLabel,
  calculateDelayMins,
  parseDateTime,
  getStatusMeta,
  getStopsForPopup
} from '../src/utils';
import { TrainDeparture } from '../src/types';

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
  } catch (e) {
    console.error(`❌ FAIL: ${name}`);
    console.error(e);
    process.exit(1);
  }
}

// ----------------------------------------------------
// getStockCategory
// ----------------------------------------------------
test('maps City Beam correctly', () => {
  const result = getStockCategory('City Beam');
  if (result.label !== 'CITY BEAM') throw new Error(`Expected CITY BEAM, got ${result.label}`);
});

test('maps null correctly', () => {
  const result = getStockCategory(null);
  if (result.category !== 'standard') throw new Error(`Expected standard, got ${result.category}`);
});

// ----------------------------------------------------
// extractTimeLabel
// ----------------------------------------------------
test('extractTimeLabel: handles falsy/empty values', () => {
  if (extractTimeLabel(undefined) !== '—') throw new Error('Expected — for undefined');
  if (extractTimeLabel('') !== '—') throw new Error('Expected — for empty string');
  if (extractTimeLabel('  ') !== '—') throw new Error('Expected — for spaces');
});

test('extractTimeLabel: handles ISO/date-time string', () => {
  if (extractTimeLabel('10-06-2026 20:15') !== '20:15') {
    throw new Error(`Expected 20:15, got ${extractTimeLabel('10-06-2026 20:15')}`);
  }
});

test('extractTimeLabel: handles HH:MM format directly', () => {
  if (extractTimeLabel('08:30') !== '08:30') {
    throw new Error(`Expected 08:30, got ${extractTimeLabel('08:30')}`);
  }
});

// ----------------------------------------------------
// calculateDelayMins
// ----------------------------------------------------
test('calculateDelayMins: calculates standard diffs', () => {
  if (calculateDelayMins('10:00', '10:05') !== 5) throw new Error('Expected +5 mins delay');
  if (calculateDelayMins('10:00', '09:55') !== -5) throw new Error('Expected -5 mins delay (early)');
  if (calculateDelayMins('12:00', '12:00') !== 0) throw new Error('Expected 0 mins diff');
});

test('calculateDelayMins: handles midnight rollover', () => {
  // 5 mins delay crossing midnight (scheduled 23:58, estimated 00:03 next day)
  if (calculateDelayMins('23:58', '00:03') !== 5) {
    throw new Error(`Expected 5, got ${calculateDelayMins('23:58', '00:03')}`);
  }
  // 5 mins early crossing midnight (scheduled 00:02, estimated 23:57 prev day)
  if (calculateDelayMins('00:02', '23:57') !== -5) {
    throw new Error(`Expected -5, got ${calculateDelayMins('00:02', '23:57')}`);
  }
});

test('calculateDelayMins: handles invalid input formats gracefully', () => {
  if (calculateDelayMins('foo', '10:00') !== 0) throw new Error('Expected 0 for invalid scheduled');
  if (calculateDelayMins('10:00', 'bar') !== 0) throw new Error('Expected 0 for invalid estimated');
});

// ----------------------------------------------------
// parseDateTime
// ----------------------------------------------------
test('parseDateTime: parses full date-time correctly', () => {
  const parsed = parseDateTime('10-06-2026 20:15');
  if (!parsed) throw new Error('Expected date object, got null');
  // 10-06-2026 splits to [10, 06, 2026], joins reversed: 2026-06-10T20:15
  if (parsed.getFullYear() !== 2026) throw new Error(`Expected year 2026, got ${parsed.getFullYear()}`);
  if (parsed.getMonth() !== 5) throw new Error(`Expected month index 5 (June), got ${parsed.getMonth()}`);
  if (parsed.getDate() !== 10) throw new Error(`Expected date 10, got ${parsed.getDate()}`);
});

test('parseDateTime: parses time-only correctly', () => {
  const parsed = parseDateTime('14:45');
  if (!parsed) throw new Error('Expected date object, got null');
  if (parsed.getHours() !== 14) throw new Error(`Expected 14 hours, got ${parsed.getHours()}`);
  if (parsed.getMinutes() !== 45) throw new Error(`Expected 45 minutes, got ${parsed.getMinutes()}`);
});

test('parseDateTime: caches results in dateCache', () => {
  const cache = new Map<string, Date | null>();
  const first = parseDateTime('10-06-2026 20:15', cache);
  if (!cache.has('10-06-2026 20:15')) throw new Error('Expected value to be cached');
  const second = parseDateTime('10-06-2026 20:15', cache);
  if (first !== second) throw new Error('Expected cached object reference to be returned');
});

// ----------------------------------------------------
// getStatusMeta
// ----------------------------------------------------
test('getStatusMeta: handles cancellation fields', () => {
  const depBase: TrainDeparture = {
    origin_name: 'A',
    destination_name: 'B',
    service_uid: '123',
    headcode: '2A99',
    type: 'train',
    scheduled: '12:00',
    estimated: '12:00',
    minutes: 0,
    lateness: 0,
    is_cancelled: false,
    platform: '1',
    length: 8,
    stock: null,
    operator_name: 'Southeastern',
    subsequent_stops: [],
    stops: 0
  };

  const meta1 = getStatusMeta({ ...depBase, is_cancelled: true });
  if (meta1.statusClass !== 'cancelled') throw new Error('is_cancelled: true failed');

  const meta2 = getStatusMeta({ ...depBase, status: 'Cancelled by operator' });
  if (meta2.statusClass !== 'cancelled') throw new Error('status Cancelled failed');

  const meta3 = getStatusMeta({ ...depBase, etd: 'Cancel' });
  if (meta3.statusClass !== 'cancelled') throw new Error('etd Cancel failed');

  const meta4 = getStatusMeta({ ...depBase, estimated: 'Cancelled' });
  if (meta4.statusClass !== 'cancelled') throw new Error('estimated Cancelled failed');
});

test('getStatusMeta: handles on-time, delay, and early states', () => {
  const depBase: TrainDeparture = {
    origin_name: 'A',
    destination_name: 'B',
    service_uid: '123',
    headcode: '2A99',
    type: 'train',
    scheduled: '12:00',
    estimated: '12:00',
    minutes: 0,
    lateness: 0,
    is_cancelled: false,
    platform: '1',
    length: 8,
    stock: null,
    operator_name: 'Southeastern',
    subsequent_stops: [],
    stops: 0
  };

  // Exactly on time
  const metaOnTime = getStatusMeta({ ...depBase, estimated: 'On Time' });
  if (metaOnTime.statusClass !== 'on-time') throw new Error('Expected on-time');

  // Minor delay (1 min) should still be considered "On Time"
  const metaMinorDelay = getStatusMeta({ ...depBase, scheduled: '12:00', estimated: '12:01' });
  if (metaMinorDelay.statusClass !== 'on-time') throw new Error('Expected 1 min delay to be on-time');

  // Delayed (> 1 min)
  const metaDelayed = getStatusMeta({ ...depBase, scheduled: '12:00', estimated: '12:05' });
  if (metaDelayed.statusClass !== 'delayed') throw new Error('Expected delayed status class');
  if (metaDelayed.statusLabel !== 'Exp 12:05') throw new Error(`Expected Exp 12:05, got ${metaDelayed.statusLabel}`);
  if (metaDelayed.offsetStr !== '+5m') throw new Error(`Expected +5m, got ${metaDelayed.offsetStr}`);

  // Early (> 1 min)
  const metaEarly = getStatusMeta({ ...depBase, scheduled: '12:00', estimated: '11:55' });
  if (metaEarly.statusClass !== 'early') throw new Error('Expected early status class');
  if (metaEarly.statusLabel !== 'Early 11:55') throw new Error(`Expected Early 11:55, got ${metaEarly.statusLabel}`);
  if (metaEarly.offsetStr !== '-5m') throw new Error(`Expected -5m, got ${metaEarly.offsetStr}`);
});

// ----------------------------------------------------
// getStopsForPopup
// ----------------------------------------------------
test('getStopsForPopup: maps stops and sorts by timestamp', () => {
  const departure: TrainDeparture = {
    origin_name: 'London Charing Cross',
    destination_name: 'Dartford',
    service_uid: '12345',
    headcode: '2M40',
    type: 'train',
    scheduled: '10-06-2026 12:00',
    estimated: '10-06-2026 12:00',
    minutes: 0,
    lateness: 0,
    is_cancelled: false,
    platform: '6',
    length: 10,
    stock: null,
    operator_name: 'Southeastern',
    subsequent_stops: [
      { stop: 'LEW', name: 'Lewisham', scheduled: '10-06-2026 12:15', estimated: '10-06-2026 12:15' },
      { stop: 'LBG', name: 'London Bridge', scheduled: '10-06-2026 12:08', estimated: '10-06-2026 12:08' }
    ],
    stops: 2
  };

  const stops = getStopsForPopup(departure, 'description');
  if (stops.length !== 2) throw new Error(`Expected 2 stops, got ${stops.length}`);
  
  // Sorted chronologically by timestamp (LBG 12:08 before LEW 12:15)
  if (stops[0].stopCode !== 'LBG') throw new Error('Expected LBG to be first');
  if (stops[1].stopCode !== 'LEW') throw new Error('Expected LEW to be second');
});

test('getStopsForPopup: identifies station name by stopsIdentifier setting', () => {
  const departure: TrainDeparture = {
    origin_name: 'A',
    destination_name: 'B',
    service_uid: '123',
    headcode: '2M40',
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
    subsequent_stops: [
      { stop: 'LEW', name: 'Lewisham', scheduled: '10-06-2026 12:15', estimated: '10-06-2026 12:15' }
    ],
    stops: 1
  };

  // 'tiploc' identifier -> name should be the stop code 'LEW'
  const stopsTiploc = getStopsForPopup(departure, 'tiploc');
  if (stopsTiploc[0].name !== 'LEW') throw new Error(`Expected LEW, got ${stopsTiploc[0].name}`);

  // 'crs' identifier -> name should be Lewisham
  const stopsCrs = getStopsForPopup(departure, 'crs');
  if (stopsCrs[0].name !== 'Lewisham') throw new Error(`Expected Lewisham, got ${stopsCrs[0].name}`);
});

test('getStopsForPopup: interpolates timeline with last_report_station', () => {
  const departure: TrainDeparture = {
    origin_name: 'London Charing Cross',
    destination_name: 'Dartford',
    service_uid: '12345',
    headcode: '2M40',
    type: 'train',
    scheduled: '10-06-2026 12:00',
    estimated: '10-06-2026 12:00',
    minutes: 0,
    lateness: 0,
    is_cancelled: false,
    platform: '6',
    length: 10,
    stock: null,
    operator_name: 'Southeastern',
    subsequent_stops: [
      { stop: 'LBG', name: 'London Bridge', scheduled: '10-06-2026 12:08', estimated: '10-06-2026 12:08' },
      { stop: 'LEW', name: 'Lewisham', scheduled: '10-06-2026 12:15', estimated: '10-06-2026 12:15' }
    ],
    stops: 2,
    last_report_station: 'LBG',
    last_report_type: 'Departure',
    last_report_time: '10-06-2026 12:09'
  };

  const stops = getStopsForPopup(departure, 'description');
  
  // Since LBG was departed:
  // LBG should be marked as passed
  if (!stops[0].isPassed) throw new Error('Expected LBG to be passed');
  if (stops[0].isCurrent) throw new Error('Expected LBG not to be current');

  // Next stop (LEW) should have isBetweenPrevious = true because LBG was departed
  if (!stops[1].isBetweenPrevious) throw new Error('Expected LEW to be marked as between previous');
});
