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

export type ServiceStatus =
  | 'on_time'
  | 'delayed'
  | 'early'
  | 'cancelled';

export type ServiceStatusClass =
  | 'on-time'
  | 'delayed'
  | 'early'
  | 'cancelled';

export interface CallingPoint {
  station_name: string;
  crs: string | null;
  tiploc: string | null;
  scheduled: string; // ISO-8601
  estimated: string | null; // ISO-8601
  time: string; // Display-ready clock time (HH:MM)
  delay_minutes: number | null;
  status: ServiceStatus;
  status_class: ServiceStatusClass;
  status_label: string;
  is_passed: boolean;
  is_current: boolean;
  is_between_previous: boolean;
}

export interface TrainDeparture {
  origin_name: string;
  destination_name: string;
  service_uid: string;
  headcode: string;
  type: string;
  operator_name: string;
  scheduled: string; // ISO-8601
  estimated: string | null; // ISO-8601
  scheduled_time: string; // Display-ready clock time (HH:MM)
  estimated_time: string | null; // Display-ready clock time (HH:MM)
  minutes: number;
  delay_minutes: number | null;
  status: ServiceStatus;
  status_class: ServiceStatusClass;
  status_label: string; // e.g. "On Time", "Exp 12:05", "Early 11:55", "Cancelled"
  offset_label: string | null; // e.g. "+5m", "-5m", null
  lateness: number | null;
  is_cancelled: boolean;
  platform: string | null;
  length: number | null;
  stock: string | null;
  // Journey enrichment fields (display-ready)
  calling_points: CallingPoint[];
  destination_arrival_scheduled: string | null;
  destination_arrival_estimated: string | null;
  destination_arrival_time: string | null; // Display-ready clock time (HH:MM)
  destination_status: ServiceStatus | null;
  destination_delay_minutes: number | null;
  journey_duration_minutes: number | null;
  stops_count: number | null;
  disruption_reason: string | null;
  last_report_station: string | null;
  last_report_type: string | null;
  last_report_time: string | null; // ISO-8601
  last_report_time_label: string | null; // Display-ready clock time (HH:MM)
  // Pin marker
  is_pinned?: boolean;
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
  // Whether to show LED-style announcements banner (default: true)
  show_announcements?: boolean;
  // Position of LED-style announcements banner: 'top' or 'bottom' (default: 'top')
  announcement_position?: 'top' | 'bottom';
  // Legacy / alternative announcement placement: 'top', 'bottom', or 'off'
  announcements?: 'top' | 'bottom' | 'off';
}

export type BoardServiceStatus =
  | 'normal'
  | 'delayed'
  | 'disrupted'
  | 'engineering_work'
  | 'station_closed'
  | 'no_departures';

export interface DisruptionItem {
  id: string;
  title: string;
  is_planned: boolean;
  summary: string;
  alternative_travel: string | null;
  url: string | null;
  [key: string]: unknown;
}
