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
  // Journey enrichment fields (present when the integration's
  // journey_data_for_next_X_trains covers this train)
  scheduled_arrival?: string;
  estimate_arrival?: string;
  journey_time_mins?: number;
  reason?: string;
  // Set when this is the query's pinned recurring train
  is_pinned?: boolean;
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
  row_size?: 'compact' | 'normal' | 'comfortable';
  show_carriages?: boolean;
  // Scheduled clock time, relative countdown, or both
  time_display?: 'scheduled' | 'relative' | 'both';
  // Minutes needed to reach the platform; shifts the "next train you can
  // actually catch" highlight and dims unreachable departures
  walk_time_minutes?: number;
  // Show a warning chip when the data source reports stale data or a
  // refresh is overdue (default: true)
  stale_indicator?: boolean;
}
