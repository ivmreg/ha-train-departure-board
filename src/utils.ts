// src/utils.ts
import { TrainDeparture } from './types';

export interface StockInfo {
  category: 'modern' | 'javelin' | 'refurb' | 'older' | 'standard';
  label: string;
}

export function getStockCategory(stock: string | null): StockInfo {
  const s = (stock || '').toLowerCase();
  if (s.includes('city beam') || s.includes('707')) {
    return { category: 'modern', label: 'CITY BEAM' };
  }
  if (s.includes('javelin') || s.includes('395')) {
    return { category: 'javelin', label: 'JAVELIN' };
  }
  if (s.includes('376')) {
    return { category: 'refurb', label: 'REFURB 376' };
  }
  if (s.includes('465') || s.includes('466') || s.includes('networker')) {
    return { category: 'older', label: 'CLASS 465' };
  }
  return { category: 'standard', label: '' };
}

export function extractTimeLabel(datetime?: string): string {
  if (!datetime) {
    return '—';
  }
  const trimmed = datetime.trim();
  if (!trimmed) {
    return '—';
  }
  const parts = trimmed.split(' ');
  if (parts.length === 2 && /^\d{2}:\d{2}$/.test(parts[1])) {
    return parts[1];
  }
  if (/^\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  return parts.length === 2 ? parts[1] || parts[0] : trimmed;
}

export function calculateDelayMins(
  scheduledTime: string,
  estimatedTime: string
): number {
  if (
    !/^\d{2}:\d{2}$/.test(scheduledTime) ||
    !/^\d{2}:\d{2}$/.test(estimatedTime)
  ) {
    return 0;
  }
  const [sH, sM] = scheduledTime.split(':').map(Number);
  const [eH, eM] = estimatedTime.split(':').map(Number);
  let diff = eH * 60 + eM - (sH * 60 + sM);
  if (diff < -720) diff += 1440;
  if (diff > 720) diff -= 1440;
  return diff;
}

export function parseDateTime(
  datetime?: string,
  dateCache?: Map<string, Date | null>
): Date | null {
  if (!datetime) {
    return null;
  }
  if (dateCache && dateCache.has(datetime)) {
    return dateCache.get(datetime) ?? null;
  }
  const [datePart, timePart] = datetime.split(' ');
  let parsed: Date | null = null;
  if (datePart && timePart) {
    const isoDate = `${datePart.split('-').reverse().join('-')}T${timePart}`;
    const candidate = new Date(isoDate);
    parsed = Number.isNaN(candidate.getTime()) ? null : candidate;
  } else if (/^\d{2}:\d{2}$/.test(datetime)) {
    const today = new Date();
    const iso = `${today.toISOString().split('T')[0]}T${datetime}`;
    const candidate = new Date(iso);
    parsed = Number.isNaN(candidate.getTime()) ? null : candidate;
  }
  if (dateCache) {
    dateCache.set(datetime, parsed);
  }
  return parsed;
}

export function getStatusMeta(departure: TrainDeparture): {
  statusLabel: string;
  statusClass: string;
  offsetStr?: string;
} {
  const scheduledRaw = departure.scheduled || '';
  const estimatedRaw = departure.estimated || '';
  const scheduledTime = extractTimeLabel(scheduledRaw);
  const estimatedTime = extractTimeLabel(estimatedRaw);

  if (
    departure.is_cancelled ||
    departure.status?.toLowerCase().includes('cancel') ||
    departure.etd?.toLowerCase().includes('cancel') ||
    departure.planned_cancel ||
    departure.cancel_reason ||
    estimatedRaw.toLowerCase().includes('cancel')
  ) {
    return { statusLabel: 'Cancelled', statusClass: 'cancelled' };
  }

  if (!estimatedRaw) {
    return { statusLabel: 'Awaiting', statusClass: 'delayed' };
  }

  const normalizedEstimate = estimatedRaw.toLowerCase();
  if (normalizedEstimate === 'on time') {
    return { statusLabel: 'On Time', statusClass: 'on-time' };
  }

  if (estimatedTime && scheduledTime && estimatedTime !== scheduledTime) {
    const delayMins = calculateDelayMins(scheduledTime, estimatedTime);
    if (Math.abs(delayMins) <= 1) {
      return { statusLabel: 'On Time', statusClass: 'on-time' };
    }

    let sClass = 'delayed';
    let labelPrefix = 'Exp';
    let offsetStr = `+${delayMins}m`;

    if (delayMins < 0) {
      sClass = 'early';
      labelPrefix = 'Early';
      offsetStr = `${delayMins}m`;
    }
    if (/^\d{2}:\d{2}$/.test(estimatedTime)) {
      return {
        statusLabel: `${labelPrefix} ${estimatedTime}`,
        statusClass: sClass,
        offsetStr,
      };
    }
    return { statusLabel: estimatedTime, statusClass: sClass, offsetStr };
  }

  return { statusLabel: 'On Time', statusClass: 'on-time' };
}

export interface ProcessedStop {
  name: string;
  time: string;
  stopCode: string;
  isPassed: boolean;
  isCurrent: boolean;
  isBetweenPrevious?: boolean;
  timestamp: number;
  statusLabel?: string;
  statusClass?: string;
}

export function getStopsForPopup(
  departure: TrainDeparture,
  stopsIdentifier: 'tiploc' | 'crs' | 'description' = 'description',
  dateCache?: Map<string, Date | null>
): ProcessedStop[] {
  const stops = departure.subsequent_stops || [];

  const stopsProcessed: ProcessedStop[] = stops
    .map(stop => {
      let name = '';
      if (stopsIdentifier === 'tiploc') {
        name = (stop.stop || '').trim();
      } else if (stopsIdentifier === 'crs') {
        name = (stop.name || '').trim();
      } else {
        name = (stop.name || stop.stop || '').trim();
      }

      const datetime = stop.scheduled || stop.estimated;
      const parsedDate = parseDateTime(datetime, dateCache);
      const timestamp = parsedDate?.getTime() ?? Number.POSITIVE_INFINITY;

      const estimatedStr = stop.estimated;
      const scheduledStr = stop.scheduled;
      let stopStatusLabel = 'On time';
      let stopStatusClass = 'on-time';

      if (estimatedStr && scheduledStr) {
        const estTime = extractTimeLabel(estimatedStr);
        const schedTime = extractTimeLabel(scheduledStr);

        if (estTime !== '—' && schedTime !== '—' && estTime !== schedTime) {
          const delayMins = calculateDelayMins(schedTime, estTime);
          if (Math.abs(delayMins) <= 1) {
            stopStatusClass = 'on-time';
            stopStatusLabel = 'On time';
          } else {
            stopStatusClass = 'delayed';
            let labelPrefix = 'Exp';
            if (delayMins < 0) {
              stopStatusClass = 'early';
              labelPrefix = 'Early';
            }
            if (/^\d{2}:\d{2}$/.test(estTime)) {
              stopStatusLabel = `${labelPrefix} ${estTime}`;
            } else {
              stopStatusLabel = estTime;
            }
          }
        }
      }
      if (
        estimatedStr?.toLowerCase().includes('cancel') ||
        (stop as any).is_cancelled
      ) {
        stopStatusLabel = 'Cancelled';
        stopStatusClass = 'cancelled';
      }

      return {
        name,
        time: datetime ? (datetime.split(' ')[1] || '').trim() : '',
        timestamp,
        stopCode: stop.stop || '',
        isPassed: false,
        isCurrent: false,
        isBetweenPrevious: false,
        statusLabel: stopStatusLabel,
        statusClass: stopStatusClass,
      };
    })
    .filter(s => s.name)
    .sort((a, b) => a.timestamp - b.timestamp);

  if (!departure.last_report_station || !departure.last_report_type) {
    // No real-time report logic: fall back to marking all as future
    return stopsProcessed;
  }

  const reportStation = departure.last_report_station;
  const reportType = departure.last_report_type; // 'Arrival', 'Departure', 'Pass'
  const reportTimeMs = departure.last_report_time
    ? parseDateTime(departure.last_report_time, dateCache)?.getTime()
    : undefined;

  // Try to find the exact reported station
  const exactMatchIndex = stopsProcessed.findIndex(
    s => s.stopCode === reportStation
  );

  if (exactMatchIndex !== -1) {
    for (let i = 0; i < exactMatchIndex; i++) {
      stopsProcessed[i].isPassed = true;
    }
    if (reportType === 'Arrival') {
      stopsProcessed[exactMatchIndex].isCurrent = true; // At the station
      stopsProcessed[exactMatchIndex].isPassed = false;
    } else {
      // 'Departure' or 'Pass'
      stopsProcessed[exactMatchIndex].isPassed = true;
      if (exactMatchIndex + 1 < stopsProcessed.length) {
        stopsProcessed[exactMatchIndex + 1].isBetweenPrevious = true;
      } else {
        // It left the last station
        stopsProcessed[exactMatchIndex].isPassed = true;
      }
    }
  } else if (reportTimeMs !== undefined && !Number.isNaN(reportTimeMs)) {
    // Interpolation fallback based on time
    let lastPassedIndex = -1;
    for (let i = 0; i < stopsProcessed.length; i++) {
      if (stopsProcessed[i].timestamp <= reportTimeMs) {
        stopsProcessed[i].isPassed = true;
        lastPassedIndex = i;
      } else {
        break;
      }
    }
    if (lastPassedIndex !== -1 && lastPassedIndex + 1 < stopsProcessed.length) {
      stopsProcessed[lastPassedIndex + 1].isBetweenPrevious = true;
    } else if (lastPassedIndex === -1 && stopsProcessed.length > 0) {
      // Not reached the first station yet
      stopsProcessed[0].isBetweenPrevious = true;
    }
  }

  // Feature: Inject previous unlisted station to connect the timeline if train is currently between
  if (
    stopsProcessed.length > 0 &&
    stopsProcessed[0].isBetweenPrevious &&
    exactMatchIndex === -1 &&
    reportStation
  ) {
    // Train has departed an unknown/unlisted station and is headed to our first listed stop.
    const timeLabel = departure.last_report_time
      ? extractTimeLabel(departure.last_report_time)
      : '';
    stopsProcessed.unshift({
      name: reportStation,
      time: timeLabel,
      timestamp: reportTimeMs || 0,
      stopCode: reportStation,
      isPassed: true,
      isCurrent: false,
      isBetweenPrevious: false,
      statusLabel: '',
      statusClass: '',
    });
  }

  return stopsProcessed;
}
