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
    headcode: string;
    type: string;
    scheduled: string;
    estimated: string;
    minutes: number;
    lateness: number | null;
    is_cancelled: boolean;
    platform: string;
    length: number | null;
    stock: string | null;
    operator_name: string;
    subsequent_stops: SubsequentStop[];
    stops: number;
    last_report_station?: string;
    last_report_type?: string;
    last_report_time?: string;
    status?: string;
    etd?: string;
    planned_cancel?: boolean;
    cancel_reason?: string;
}

export interface SubsequentStop {
    stop: string;
    name: string;
    scheduled: string;
    estimated: string;
}

export interface TrainDepartureBoardConfig {
    type: string;
    title?: string;
    entity?: string;
    attribute?: string;
    stops_identifier?: 'tiploc' | 'crs' | 'description';
    // Font size configuration (CSS values like '1rem', '16px', etc.)
    font_size_time?: string;
    font_size_destination?: string;
    font_size_status?: string;
    delay_layout?: 'inline' | 'stacked' | 'status_line';
    row_size?: 'compact' | 'normal' | 'comfortable';
}