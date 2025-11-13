export interface TrainDeparture {
    serviceUid: string;
    scheduledDeparture: string;
    estimatedDeparture: string;
    destination: string;
    platform: string | null;
    status: 'On Time' | 'Delayed' | 'Cancelled';
    journeyTimeMins: number;
    stopsOfInterest: StopOfInterest[];
}

export interface StopOfInterest {
    stop: string;
    name: string;
    scheduledStop: string;
    estimatedStop: string;
    journeyTimeMins: number;
}

export interface TrainDepartureBoardConfig {
    routes: string[];
    displayOptions: DisplayOptions;
}

export interface DisplayOptions {
    showPlatform: boolean;
    showStatus: boolean;
    showJourneyTime: boolean;
}