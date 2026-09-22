// src/utils.ts
import { CallingPoint, TrainDeparture } from './types';

export type StockCategory = 'modern' | 'javelin' | 'refurb' | 'older' | 'standard';

export interface StockInfo {
  category: StockCategory;
  label: string;
}

interface StockRule {
  matches: string[]; // lowercase substrings matched against the stock string
  category: StockCategory;
  label: string;
}

const STANDARD_STOCK: StockInfo = { category: 'standard', label: '' };

// Per-operator rolling-stock tables, keyed by a lowercase substring of the
// operator name. Extend with additional operators by adding an entry here;
// unknown operators simply get no stock styling.
const STOCK_TABLES: Record<string, StockRule[]> = {
  southeastern: [
    { matches: ['city beam', '707'], category: 'modern', label: 'CITY BEAM' },
    { matches: ['javelin', '395'], category: 'javelin', label: 'JAVELIN' },
    { matches: ['376'], category: 'refurb', label: 'REFURB 376' },
    { matches: ['465', '466', 'networker'], category: 'older', label: 'CLASS 465' },
  ],
};

function matchStockRules(rules: StockRule[], stock: string): StockInfo | null {
  for (const rule of rules) {
    if (rule.matches.some(fragment => stock.includes(fragment))) {
      return { category: rule.category, label: rule.label };
    }
  }
  return null;
}

export function getStockCategory(
  stock: string | null,
  operatorName?: string | null
): StockInfo {
  const s = (stock || '').toLowerCase();
  if (!s) {
    return STANDARD_STOCK;
  }

  const operator = (operatorName || '').toLowerCase().trim();
  if (operator) {
    // Known operator: use its table; unknown operator: no styling, so we
    // never render another operator's accent colours from a bad heuristic.
    const tableKey = Object.keys(STOCK_TABLES).find(key => operator.includes(key));
    if (!tableKey) {
      return STANDARD_STOCK;
    }
    return matchStockRules(STOCK_TABLES[tableKey], s) || STANDARD_STOCK;
  }

  // No operator info (e.g. custom data sources): try every table, matching
  // the pre-operator-aware behaviour.
  for (const rules of Object.values(STOCK_TABLES)) {
    const match = matchStockRules(rules, s);
    if (match) {
      return match;
    }
  }
  return STANDARD_STOCK;
}

export function parseDateTime(
  datetime?: string | null,
  dateCache?: Map<string, Date | null>
): Date | null {
  if (!datetime) {
    return null;
  }
  if (dateCache && dateCache.has(datetime)) {
    return dateCache.get(datetime) ?? null;
  }
  let parsed: Date | null = null;
  const candidate = new Date(datetime);
  if (!Number.isNaN(candidate.getTime())) {
    parsed = candidate;
  }
  if (dateCache) {
    dateCache.set(datetime, parsed);
  }
  return parsed;
}

export function formatRelativeMinutes(
  departure: TrainDeparture,
  now: Date,
  dateCache?: Map<string, Date | null>
): string | null {
  const timeStr = departure.estimated || departure.scheduled;
  const when = parseDateTime(timeStr, dateCache);
  if (!when) {
    return null;
  }
  const diffMins = Math.floor((when.getTime() - now.getTime()) / 60000);
  if (diffMins <= 0) {
    return 'Due';
  }
  return `${diffMins} min`;
}

export function isCatchable(
  departure: TrainDeparture,
  walkTimeMinutes: number,
  now: Date,
  dateCache?: Map<string, Date | null>
): boolean {
  const timeStr = departure.estimated || departure.scheduled;
  const when = parseDateTime(timeStr, dateCache);
  if (!when) {
    // Without a parseable time we can't rule the train out
    return true;
  }
  return when.getTime() - now.getTime() >= walkTimeMinutes * 60000;
}

export function getCallingPointName(
  stop: CallingPoint,
  stopsIdentifier: 'tiploc' | 'crs' | 'description' = 'description'
): string {
  if (stopsIdentifier === 'tiploc') {
    return (stop.tiploc || stop.crs || stop.station_name || '').trim();
  }
  if (stopsIdentifier === 'crs') {
    return (stop.crs || stop.station_name || '').trim();
  }
  return (stop.station_name || stop.crs || stop.tiploc || '').trim();
}

const VALID_SERVICE_STATUSES: Set<unknown> = new Set([
  'on_time',
  'delayed',
  'early',
  'cancelled',
]);

const VALID_SERVICE_STATUS_CLASSES: Set<unknown> = new Set([
  'on-time',
  'delayed',
  'early',
  'cancelled',
]);

export function isValidContractV2CallingPoint(
  item: unknown
): item is CallingPoint {
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const cp = item as Record<string, unknown>;
  return (
    typeof cp.station_name === 'string' &&
    (typeof cp.crs === 'string' || cp.crs === null) &&
    (typeof cp.tiploc === 'string' || cp.tiploc === null) &&
    typeof cp.scheduled === 'string' &&
    (typeof cp.estimated === 'string' || cp.estimated === null) &&
    typeof cp.time === 'string' &&
    VALID_SERVICE_STATUSES.has(cp.status) &&
    VALID_SERVICE_STATUS_CLASSES.has(cp.status_class) &&
    typeof cp.status_label === 'string' &&
    (typeof cp.delay_minutes === 'number' || cp.delay_minutes === null) &&
    typeof cp.is_passed === 'boolean' &&
    typeof cp.is_current === 'boolean' &&
    typeof cp.is_between_previous === 'boolean'
  );
}

export function isValidContractV2Departure(
  item: unknown
): item is TrainDeparture {
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const d = item as Record<string, unknown>;
  return (
    typeof d.destination_name === 'string' &&
    typeof d.scheduled === 'string' &&
    typeof d.scheduled_time === 'string' &&
    VALID_SERVICE_STATUSES.has(d.status) &&
    VALID_SERVICE_STATUS_CLASSES.has(d.status_class) &&
    typeof d.status_label === 'string' &&
    typeof d.is_cancelled === 'boolean' &&
    Array.isArray(d.calling_points) &&
    d.calling_points.every((cp: unknown) => isValidContractV2CallingPoint(cp))
  );
}
