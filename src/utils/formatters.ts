import { TrainDeparture } from '../types';

export const formatDepartureTime = (departure: TrainDeparture): string => {
    const scheduledTime = new Date(departure.scheduled);
    const estimatedTime = new Date(departure.estimated);
    const now = new Date();

    const timeDiff = estimatedTime.getTime() - now.getTime();
    const minutesUntilDeparture = Math.ceil(timeDiff / (1000 * 60));

    if (minutesUntilDeparture < 0) {
        return 'Departed';
    }

    return `${minutesUntilDeparture} min${minutesUntilDeparture !== 1 ? 's' : ''} to ${departure.destination}`;
};

export const formatTrainStatus = (status: string): string => {
    switch (status) {
        case 'OK':
            return 'On Time';
        case 'Delayed':
            return 'Delayed';
        case 'Cancelled':
            return 'Cancelled';
        default:
            return 'Unknown Status';
    }
};

export const formatPlatformInfo = (platform: string | null): string => {
    return platform ? `Platform ${platform}` : 'Platform info not available';
};