
export interface TrainDeparture {
    origin_name: string;
    destination_name: string;
    service_uid: string;
    scheduled: string;
    estimated: string;
    minutes: number;
    platform: string;
    operator_name: string;
    stops_of_interest: any[];
    stops: number;
    status?: string;
    etd?: string;
}

// Mock the class to test getStatusMeta
class TrainDepartureBoard {
    dateCache = new Map<string, Date | null>();

    getStatusMeta(departure: TrainDeparture): { statusLabel: string; statusClass: string; countdown: string | null } {
        const scheduledRaw = departure.scheduled || '';
        const estimatedRaw = departure.estimated || '';
        const scheduledTime = this.extractTimeLabel(scheduledRaw);
        const estimatedTime = this.extractTimeLabel(estimatedRaw);
        const countdown = this.formatCountdown(departure);

        if (departure.status?.toLowerCase() === 'cancelled') {
            return { statusLabel: 'Cancelled', statusClass: 'cancelled', countdown: null };
        }

        if (departure.etd?.toLowerCase().includes('cancel')) {
            return { statusLabel: 'Cancelled', statusClass: 'cancelled', countdown: null };
        }

        if (!estimatedRaw) {
            return { statusLabel: 'Awaiting update', statusClass: 'delayed', countdown };
        }

        const normalizedEstimate = estimatedRaw.toLowerCase();
        if (normalizedEstimate.includes('cancel')) {
            return { statusLabel: 'Cancelled', statusClass: 'cancelled', countdown: null };
        }

        if (estimatedTime && scheduledTime && estimatedTime !== scheduledTime) {
            const delayMinutes = this.calculateDelayMinutes(scheduledRaw, estimatedRaw);
            const label = Number.isFinite(delayMinutes) ? 'Delayed +' + delayMinutes + ' min' : 'Delayed';
            return { statusLabel: label, statusClass: 'delayed', countdown };
        }

        if (!/\d{2}:\d{2}/.test(estimatedTime) && estimatedRaw) {
            return { statusLabel: estimatedRaw, statusClass: 'delayed', countdown };
        }

        return { statusLabel: 'On time', statusClass: 'on-time', countdown };
    }

    formatCountdown(departure: TrainDeparture): string | null {
        const referenceTime = this.pickReferenceTime(departure);
        const minutesUntil = departure.minutes ?? (referenceTime ? this.calculateMinutesUntil(referenceTime) : Number.NaN);
        if (!Number.isFinite(minutesUntil)) {
            return null;
        }
        return minutesUntil > 0 ? 'in ' + minutesUntil + ' min' : 'Due';
    }

    pickReferenceTime(departure: TrainDeparture): string | undefined {
        if (this.parseDateTime(departure.estimated ?? '')) {
            return departure.estimated;
        }
        if (this.parseDateTime(departure.scheduled ?? '')) {
            return departure.scheduled;
        }
        return undefined;
    }

    extractTimeLabel(datetime?: string): string {
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

    parseDateTime(datetime?: string): Date | null {
        if (!datetime) {
            return null;
        }
        if (this.dateCache.has(datetime)) {
            return this.dateCache.get(datetime) ?? null;
        }
        const [datePart, timePart] = datetime.split(' ');
        let parsed: Date | null = null;
        if (datePart && timePart) {
            const isoDate = datePart.split('-').reverse().join('-') + 'T' + timePart;
            const candidate = new Date(isoDate);
            parsed = Number.isNaN(candidate.getTime()) ? null : candidate;
        } else if (/^\d{2}:\d{2}$/.test(datetime)) {
            const today = new Date();
            const iso = today.toISOString().split('T')[0] + 'T' + datetime;
            const candidate = new Date(iso);
            parsed = Number.isNaN(candidate.getTime()) ? null : candidate;
        }
        this.dateCache.set(datetime, parsed);
        return parsed;
    }

    calculateDelayMinutes(scheduled: string, estimated: string): number {
        const scheduledDate = this.parseDateTime(scheduled);
        const estimatedDate = this.parseDateTime(estimated);
        if (!scheduledDate || !estimatedDate) {
            return Number.NaN;
        }
        const delayMs = estimatedDate.getTime() - scheduledDate.getTime();
        return Math.round(delayMs / (1000 * 60));
    }

    calculateMinutesUntil(datetime: string): number {
        const target = this.parseDateTime(datetime);
        if (!target) {
            return Number.NaN;
        }
        const now = new Date();
        const diffMs = target.getTime() - now.getTime();
        return Math.max(0, Math.round(diffMs / (1000 * 60)));
    }
}

const board = new TrainDepartureBoard();

const cancelledDeparture: TrainDeparture = {
    origin_name: "Origin",
    destination_name: "Destination",
    service_uid: "123",
    scheduled: "20-11-2025 10:00",
    estimated: "Cancelled",
    minutes: 0,
    platform: "1",
    operator_name: "Operator",
    stops_of_interest: [],
    stops: 0
};

console.log("Estimated: Cancelled ->", board.getStatusMeta(cancelledDeparture));

const cancelledDeparture2: TrainDeparture = {
    ...cancelledDeparture,
    estimated: "20-11-2025 10:00",
    status: "Cancelled"
};

console.log("Status: Cancelled ->", board.getStatusMeta(cancelledDeparture2));

const cancelledDeparture3: TrainDeparture = {
    ...cancelledDeparture,
    estimated: "20-11-2025 10:00",
    etd: "Cancelled"
};

console.log("ETD: Cancelled ->", board.getStatusMeta(cancelledDeparture3));
