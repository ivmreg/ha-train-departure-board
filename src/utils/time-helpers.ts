// src/utils/time-helpers.ts

export function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function timeDifferenceInMinutes(start: Date, end: Date): number {
    const diffInMs = end.getTime() - start.getTime();
    return Math.floor(diffInMs / 1000 / 60);
}

export function isTrainDepartingSoon(departureTime: Date, thresholdMinutes: number): boolean {
    const now = new Date();
    const diffMinutes = timeDifferenceInMinutes(now, departureTime);
    return diffMinutes >= 0 && diffMinutes <= thresholdMinutes;
}

export function addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
}