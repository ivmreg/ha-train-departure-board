// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import '../src/train-departure-board';
import type { TrainDepartureBoard } from '../src/train-departure-board';
import { TrainDeparture } from '../src/types';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function inMinutesIso(mins: number): string {
  return new Date(Date.now() + mins * 60000).toISOString();
}

function inMinutesTime(mins: number): string {
  const d = new Date(Date.now() + mins * 60000);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function makeDeparture(overrides: Partial<TrainDeparture> = {}): TrainDeparture {
  return {
    origin_name: 'Dartford',
    destination_name: 'London Cannon Street',
    service_uid: 'P63128',
    headcode: '2A69',
    type: 'train',
    operator_name: 'Southeastern',
    scheduled: inMinutesIso(10),
    estimated: inMinutesIso(10),
    scheduled_time: inMinutesTime(10),
    estimated_time: inMinutesTime(10),
    minutes: 10,
    delay_minutes: 0,
    status: 'on_time',
    status_class: 'on-time',
    status_label: 'On Time',
    offset_label: null,
    lateness: null,
    is_cancelled: false,
    platform: '1',
    length: 8,
    stock: null,
    calling_points: [
      {
        station_name: 'Lewisham',
        crs: 'LEW',
        tiploc: 'LEWISHM',
        scheduled: inMinutesIso(16),
        estimated: inMinutesIso(16),
        time: inMinutesTime(16),
        delay_minutes: 0,
        status: 'on_time',
        status_class: 'on-time',
        status_label: 'On time',
        is_passed: false,
        is_current: false,
        is_between_previous: false,
      },
    ],
    destination_arrival_scheduled: inMinutesIso(30),
    destination_arrival_estimated: inMinutesIso(30),
    destination_arrival_time: inMinutesTime(30),
    destination_status: 'on_time',
    destination_delay_minutes: 0,
    journey_duration_minutes: 20,
    stops_count: 1,
    disruption_reason: null,
    last_report_station: null,
    last_report_type: null,
    last_report_time: null,
    last_report_time_label: null,
    ...overrides,
  };
}

function makeHass(
  departures: TrainDeparture[],
  extraAttributes: Record<string, unknown> = {}
) {
  return {
    states: {
      'sensor.trains': {
        entity_id: 'sensor.trains',
        state: '10',
        attributes: {
          contract_version: 2,
          next_trains: departures,
          ...extraAttributes,
        },
        last_changed: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        context: { id: '1', parent_id: null, user_id: null },
      },
    },
  };
}

async function mountCard(
  config: Record<string, unknown>,
  departures: TrainDeparture[],
  extraAttributes: Record<string, unknown> = {}
): Promise<TrainDepartureBoard> {
  const card = document.createElement(
    'train-departure-board'
  ) as TrainDepartureBoard;
  card.setConfig({ type: 'custom:train-departure-board', ...config } as never);
  card.hass = makeHass(departures, extraAttributes) as never;
  document.body.appendChild(card);
  await card.updateComplete;
  return card;
}

describe('train-departure-board component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders one row per departure with accessible labels', async () => {
    const card = await mountCard({ entity: 'sensor.trains' }, [
      makeDeparture(),
      makeDeparture({ destination_name: 'London Charing Cross' }),
    ]);

    const rows = card.shadowRoot!.querySelectorAll('.train');
    expect(rows.length).toBe(2);
    expect(rows[0].getAttribute('tabindex')).toBe('0');
    expect(rows[0].getAttribute('aria-label')).toContain('London Cannon Street');
    expect(rows[0].classList.contains('next-train')).toBe(true);
    expect(rows[1].classList.contains('next-train')).toBe(false);
  });

  it('renders a styled message when the entity is missing', async () => {
    const card = await mountCard({ entity: 'sensor.gone' }, []);
    const message = card.shadowRoot!.querySelector('.board-message');
    expect(message).not.toBeNull();
    expect(message!.textContent).toContain('Entity not found');
  });

  it('renders a styled empty state when there are no departures', async () => {
    const card = await mountCard({ entity: 'sensor.trains' }, []);
    const message = card.shadowRoot!.querySelector('.board-message');
    expect(message!.textContent).toContain('No departures in the current window');
  });

  it('opens the details popup with Enter and returns focus on close', async () => {
    const card = await mountCard({ entity: 'sensor.trains' }, [makeDeparture()]);

    const row = card.shadowRoot!.querySelector('.train') as HTMLElement;
    row.focus();
    row.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    await card.updateComplete;

    const dialog = card.shadowRoot!.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog!.getAttribute('aria-modal')).toBe('true');

    // Escape closes and focus returns to the row
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector('[role="dialog"]')).toBeNull();
  });

  it('shows the stale chip when the sensor reports data_stale', async () => {
    const card = await mountCard({ entity: 'sensor.trains' }, [makeDeparture()], {
      data_stale: true,
    });
    const chip = card.shadowRoot!.querySelector('.stale-chip');
    expect(chip).not.toBeNull();
    expect(chip!.textContent).toContain('last-known data');
  });

  it('hides the stale chip when stale_indicator is disabled', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains', stale_indicator: false },
      [makeDeparture()],
      { data_stale: true }
    );
    expect(card.shadowRoot!.querySelector('.stale-chip')).toBeNull();
  });

  it('moves the highlight to the first catchable train with walk_time_minutes', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains', walk_time_minutes: 15 },
      [
        makeDeparture({ scheduled: inMinutesIso(5), estimated: inMinutesIso(5), scheduled_time: inMinutesTime(5) }),
        makeDeparture({ scheduled: inMinutesIso(20), estimated: inMinutesIso(20), scheduled_time: inMinutesTime(20) }),
      ]
    );

    const rows = card.shadowRoot!.querySelectorAll('.train');
    expect(rows[0].classList.contains('next-train')).toBe(false);
    expect(rows[0].classList.contains('unreachable')).toBe(true);
    expect(rows[0].getAttribute('aria-label')).toContain('likely out of reach');
    expect(rows[1].classList.contains('next-train')).toBe(true);
  });

  it('renders a countdown when time_display is relative', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains', time_display: 'relative' },
      [makeDeparture({ scheduled: inMinutesIso(10), estimated: inMinutesIso(10) })]
    );

    const time = card.shadowRoot!.querySelector('.scheduled');
    expect(time!.textContent!.trim()).toMatch(/^(9|10) min$/);
  });

  it('applies the row_size class', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains', row_size: 'compact' },
      [makeDeparture()]
    );
    const row = card.shadowRoot!.querySelector('.train');
    expect(row!.classList.contains('row-size-compact')).toBe(true);
  });

  it('shows the last-seen line in the popup when reported', async () => {
    const card = await mountCard({ entity: 'sensor.trains' }, [
      makeDeparture({
        last_report_station: 'LEW',
        last_report_type: 'Departure',
        last_report_time: inMinutesIso(-2),
        last_report_time_label: inMinutesTime(-2),
      }),
    ]);

    (card.shadowRoot!.querySelector('.train') as HTMLElement).click();
    await card.updateComplete;

    const lastSeen = card.shadowRoot!.querySelector('.last-seen');
    expect(lastSeen).not.toBeNull();
    expect(lastSeen!.textContent).toContain('Last seen at LEW');
    expect(lastSeen!.textContent).toContain(`(${inMinutesTime(-2)})`);
  });

  it('only accents stock rows for the matching operator', async () => {
    const card = await mountCard({ entity: 'sensor.trains' }, [
      makeDeparture({ stock: 'Javelin', operator_name: 'Southeastern' }),
      makeDeparture({ stock: 'Javelin', operator_name: 'Thameslink' }),
    ]);

    const rows = card.shadowRoot!.querySelectorAll('.train');
    expect(rows[0].classList.contains('stock-row-javelin')).toBe(true);
    expect(rows[1].classList.contains('stock-row-javelin')).toBe(false);
  });
});

describe('new card behaviours', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('shows the journey summary in the popup when enrichment data exists', async () => {
    const card = await mountCard({ entity: 'sensor.trains' }, [
      makeDeparture({
        journey_duration_minutes: 33,
        stops_count: 7,
        destination_arrival_time: inMinutesTime(43),
      }),
    ]);

    (card.shadowRoot!.querySelector('.train') as HTMLElement).click();
    await card.updateComplete;

    const summary = card.shadowRoot!.querySelector('.journey-summary');
    expect(summary).not.toBeNull();
    expect(summary!.textContent).toContain('33 min journey');
    expect(summary!.textContent).toContain('7 stops');
    expect(summary!.textContent).toContain('arrives');
  });

  it('omits the journey summary without enrichment data', async () => {
    const card = await mountCard({ entity: 'sensor.trains' }, [
      makeDeparture({
        journey_duration_minutes: null,
        stops_count: null,
        destination_arrival_time: null,
      }),
    ]);
    (card.shadowRoot!.querySelector('.train') as HTMLElement).click();
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector('.journey-summary')).toBeNull();
  });

  it('marks the pinned train with a pin marker', async () => {
    const card = await mountCard({ entity: 'sensor.trains' }, [
      makeDeparture(),
      makeDeparture({ is_pinned: true, destination_name: 'Dartford' }),
    ]);

    const rows = card.shadowRoot!.querySelectorAll('.train');
    expect(rows[0].querySelector('.pin-marker')).toBeNull();
    expect(rows[1].querySelector('.pin-marker')).not.toBeNull();
  });

  it('applies a flap class only when a rendered value changes', async () => {
    const first = makeDeparture({ platform: '1' });
    const card = await mountCard({ entity: 'sensor.trains' }, [first]);

    expect(
      card.shadowRoot!.querySelector('.platform-badge')!.className
    ).not.toContain('flap');

    // Same data again: no flap
    card.hass = makeHass([makeDeparture({ platform: '1' })]) as never;
    await card.updateComplete;
    expect(
      card.shadowRoot!.querySelector('.platform-badge')!.className
    ).not.toContain('flap');

    // Platform change: flap
    card.hass = makeHass([makeDeparture({ platform: '4' })]) as never;
    await card.updateComplete;
    expect(
      card.shadowRoot!.querySelector('.platform-badge')!.className
    ).toContain('flap-a');

    // Change again: alternate animation class so it restarts
    card.hass = makeHass([makeDeparture({ platform: '5' })]) as never;
    await card.updateComplete;
    expect(
      card.shadowRoot!.querySelector('.platform-badge')!.className
    ).toContain('flap-b');
  });

  it('renders a styled message when the entity state is unavailable or unknown', async () => {
    const card = document.createElement('train-departure-board') as TrainDepartureBoard;
    card.setConfig({ type: 'custom:train-departure-board', entity: 'sensor.trains' } as never);
    card.hass = {
      states: {
        'sensor.trains': {
          entity_id: 'sensor.trains',
          state: 'unavailable',
          attributes: { next_trains: [] },
        },
      },
    } as never;
    document.body.appendChild(card);
    await card.updateComplete;
    const message = card.shadowRoot!.querySelector('.board-message');
    expect(message).not.toBeNull();
    expect(message!.textContent).toContain('Entity sensor.trains is currently unavailable');
  });

  it('renders an error when configured attribute is missing', async () => {
    const card = await mountCard({ entity: 'sensor.trains', attribute: 'missing_attr' }, []);
    const message = card.shadowRoot!.querySelector('.board-message.error');
    expect(message).not.toBeNull();
    expect(message!.textContent).toContain('Attribute "missing_attr" not found on entity sensor.trains');
  });

  it('renders an error when configured attribute is not an array', async () => {
    const card = document.createElement('train-departure-board') as TrainDepartureBoard;
    card.setConfig({ type: 'custom:train-departure-board', entity: 'sensor.trains' } as never);
    card.hass = {
      states: {
        'sensor.trains': {
          entity_id: 'sensor.trains',
          state: '10',
          attributes: { contract_version: 2, next_trains: 'invalid-string' },
        },
      },
    } as never;
    document.body.appendChild(card);
    await card.updateComplete;
    const message = card.shadowRoot!.querySelector('.board-message.error');
    expect(message).not.toBeNull();
    expect(message!.textContent).toContain('Attribute "next_trains" on entity sensor.trains is not an array');
  });

  it('renders a styled error when contract_version is missing', async () => {
    const card = document.createElement('train-departure-board') as TrainDepartureBoard;
    card.setConfig({ type: 'custom:train-departure-board', entity: 'sensor.trains' } as never);
    card.hass = {
      states: {
        'sensor.trains': {
          entity_id: 'sensor.trains',
          state: '10',
          attributes: { next_trains: [makeDeparture()] },
        },
      },
    } as never;
    document.body.appendChild(card);
    await card.updateComplete;
    const message = card.shadowRoot!.querySelector('.board-message.error');
    expect(message).not.toBeNull();
    expect(message!.textContent).toContain('Integration contract version 2 required (missing)');
    expect(message!.textContent).toContain('Please update both realtime_trains_api and ha-train-departure-board together');
  });

  it('renders a styled error when contract_version is not 2', async () => {
    const card = document.createElement('train-departure-board') as TrainDepartureBoard;
    card.setConfig({ type: 'custom:train-departure-board', entity: 'sensor.trains' } as never);
    card.hass = {
      states: {
        'sensor.trains': {
          entity_id: 'sensor.trains',
          state: '10',
          attributes: { contract_version: 1, next_trains: [makeDeparture()] },
        },
      },
    } as never;
    document.body.appendChild(card);
    await card.updateComplete;
    const message = card.shadowRoot!.querySelector('.board-message.error');
    expect(message).not.toBeNull();
    expect(message!.textContent).toContain('Integration contract version 2 required (found v1)');
    expect(message!.textContent).toContain('Please update both realtime_trains_api and ha-train-departure-board together');
  });

  it('renders a styled error when a departure item is malformed', async () => {
    const invalidDeparture = {
      origin_name: 'Dartford',
      // Missing required fields like scheduled, status_label, calling_points, etc.
    };
    const card = await mountCard(
      { entity: 'sensor.trains' },
      [invalidDeparture as unknown as TrainDeparture]
    );
    const message = card.shadowRoot!.querySelector('.board-message.error');
    expect(message).not.toBeNull();
    expect(message!.textContent).toContain('Malformed Contract v2 departure data on entity sensor.trains');
  });

  it('renders a styled error when a departure has malformed calling points', async () => {
    const departureWithBadStops = makeDeparture({
      calling_points: [null as never],
    });
    const card = await mountCard(
      { entity: 'sensor.trains' },
      [departureWithBadStops]
    );
    const message = card.shadowRoot!.querySelector('.board-message.error');
    expect(message).not.toBeNull();
    expect(message!.textContent).toContain('Malformed Contract v2 departure data on entity sensor.trains');
  });

  it('renders a notice when walk_time_minutes is set and no departures are reachable', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains', walk_time_minutes: 30 },
      [
        makeDeparture({ scheduled: inMinutesIso(5), estimated: inMinutesIso(5), scheduled_time: inMinutesTime(5) }),
        makeDeparture({ scheduled: inMinutesIso(10), estimated: inMinutesIso(10), scheduled_time: inMinutesTime(10) }),
      ]
    );
    const notice = card.shadowRoot!.querySelector('.walk-time-notice');
    expect(notice).not.toBeNull();
    expect(notice!.textContent).toContain('No listed departures reachable within 30 min walk');
    const rows = card.shadowRoot!.querySelectorAll('.train');
    expect(rows[0].classList.contains('unreachable')).toBe(true);
    expect(rows[1].classList.contains('unreachable')).toBe(true);
    expect(rows[0].classList.contains('next-train')).toBe(false);
    expect(rows[1].classList.contains('next-train')).toBe(false);
  });

  it('includes carriage information and rolling-stock label in row accessible text and title', async () => {
    const card = await mountCard({ entity: 'sensor.trains' }, [
      makeDeparture({
        destination_name: 'London Cannon Street',
        length: 8,
        stock: 'City Beam',
        operator_name: 'Southeastern',
      }),
    ]);
    const row = card.shadowRoot!.querySelector('.train');
    const label = row!.getAttribute('aria-label');
    const title = row!.getAttribute('title');
    expect(label).toContain('8 carriages');
    expect(label).toContain('CITY BEAM');
    expect(title).toBe(label);
  });

  it('renders limited journey details chip in footer when entity has error attribute', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains' },
      [makeDeparture()],
      { error: 'Limited enrichment' }
    );
    const chip = card.shadowRoot!.querySelector('.enrichment-error-chip');
    expect(chip).not.toBeNull();
    expect(chip!.textContent).toContain('Limited journey details');
  });

  it('renders limited journey details notice in popup when entity has error attribute', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains' },
      [makeDeparture()],
      { error: 'Limited enrichment' }
    );
    (card.shadowRoot!.querySelector('.train') as HTMLElement).click();
    await card.updateComplete;

    const notice = card.shadowRoot!.querySelector('.enrichment-popup-notice');
    expect(notice).not.toBeNull();
    expect(notice!.textContent).toContain('Limited journey details');
  });

  it('groups status pill, carriages badge, and platform badge in row-meta container', async () => {
    const card = await mountCard({ entity: 'sensor.trains' }, [
      makeDeparture({
        platform: '1',
        length: 10,
        estimated: inMinutesIso(15),
        status_class: 'delayed',
        status_label: 'Exp 12:15',
        offset_label: '+5m',
      }),
    ]);
    const rowMeta = card.shadowRoot!.querySelector('.row-meta');
    expect(rowMeta).not.toBeNull();
    expect(rowMeta!.querySelector('.status-pill')).not.toBeNull();
    expect(rowMeta!.querySelector('.carriages-badge')).not.toBeNull();
    expect(rowMeta!.querySelector('.platform-badge')).not.toBeNull();
  });
});
