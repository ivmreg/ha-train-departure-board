// Home Assistant types
export interface HomeAssistantEntity {
    entity_id: string;
    state: string;
    attributes: Record<string, unknown>;
    last_changed: string;
    last_updated: string;
    context: {
        id: string;
        parent_id: string | null;
        user_id: string | null;
    };
}

export interface HomeAssistant {
    states: Record<string, HomeAssistantEntity>;
    services: Record<string, Record<string, unknown>>;
    user?: {
        id: string;
        name: string;
        is_admin: boolean;
    };
    language: string;
    themes: {
        theme: string;
        themes: Record<string, unknown>;
    };
}

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
    planned_cancel?: boolean;
    cancel_reason?: string;
    stops_of_interest: StopOfInterest[];
    stops: number;
}

export interface StopOfInterest {
    stop: string;
    name: string;
    crs?: string;
    scheduled_stop: string;
    estimate_stop: string;
    journey_time_mins: number;
    stops: number;
}

export interface TrainDepartureBoardConfig {
    type: string;
    title?: string;
    entity?: string;
    attribute?: string;
    stops_identifier?: 'tiploc' | 'crs' | 'description';
}