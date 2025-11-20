export interface TrainDeparture {
    origin_name: string;
    destination_name: string;
    service_uid: string;
    scheduled: string;
    estimated: string;
    minutes: number;
    platform: string;
    operator_name: string;
    status?: string;
    etd?: string;
    stops_of_interest: StopOfInterest[];
    stops: number;
}

export interface StopOfInterest {
    stop: string;
    name: string;
    scheduled_stop: string;
    estimate_stop: string;
    journey_time_mins: number;
    stops: number;
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