// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { TrainDepartureBoard } from '../src/train-departure-board';
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

describe('rail disruption announcements and empty states', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const sampleDisruption = {
    id: 'INC100',
    title: 'Track circuit failure between Lewisham and London Bridge',
    is_planned: false,
    summary: 'Services may be cancelled or delayed by up to 20 minutes.',
    alternative_travel: 'Rail replacement bus running from Lewisham Stop C. Tickets accepted on London Underground.',
    url: 'https://www.nationalrail.co.uk/incidents/100',
  };

  it('renders the announcements banner at the top by default when messages or disruptions exist', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains' },
      [makeDeparture()],
      {
        station_messages: ['Please mind the gap'],
        disruptions: [sampleDisruption],
      }
    );

    const banner = card.shadowRoot!.querySelector('.announcements-banner');
    expect(banner).not.toBeNull();
    expect(banner!.classList.contains('position-top')).toBe(true);
    expect(banner!.textContent).toContain('Please mind the gap');

    // Check DOM position: banner should be before departure-list
    const cardBody = card.shadowRoot!.querySelector('.card')!;
    const bannerIndex = Array.from(cardBody.children).indexOf(banner!);
    const list = card.shadowRoot!.querySelector('.departure-list')!;
    const listIndex = Array.from(cardBody.children).indexOf(list);
    expect(bannerIndex).toBeLessThan(listIndex);
  });

  it('renders the announcements banner at the bottom when announcement_position is bottom', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains', announcement_position: 'bottom' },
      [makeDeparture()],
      {
        station_messages: ['Safety notice'],
      }
    );

    const banner = card.shadowRoot!.querySelector('.announcements-banner');
    expect(banner).not.toBeNull();
    expect(banner!.classList.contains('position-bottom')).toBe(true);

    const cardBody = card.shadowRoot!.querySelector('.card')!;
    const bannerIndex = Array.from(cardBody.children).indexOf(banner!);
    const list = card.shadowRoot!.querySelector('.departure-list')!;
    const listIndex = Array.from(cardBody.children).indexOf(list);
    expect(bannerIndex).toBeGreaterThan(listIndex);
  });

  it('renders the announcements banner at bottom with backward-compatible announcements enum', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains', announcements: 'bottom' },
      [makeDeparture()],
      {
        station_messages: ['Safety notice'],
      }
    );

    const banner = card.shadowRoot!.querySelector('.announcements-banner');
    expect(banner).not.toBeNull();
    expect(banner!.classList.contains('position-bottom')).toBe(true);
  });

  it('hides the announcements banner when show_announcements is false', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains', show_announcements: false },
      [makeDeparture()],
      {
        station_messages: ['Safety notice'],
        disruptions: [sampleDisruption],
      }
    );

    expect(card.shadowRoot!.querySelector('.announcements-banner')).toBeNull();
  });

  it('hides the announcements banner when announcements is off', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains', announcements: 'off' },
      [makeDeparture()],
      {
        station_messages: ['Safety notice'],
      }
    );

    expect(card.shadowRoot!.querySelector('.announcements-banner')).toBeNull();
  });

  it('cycles through announcements using ArrowRight and ArrowLeft keys', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains' },
      [makeDeparture()],
      {
        station_messages: ['Message 1'],
        disruptions: [sampleDisruption],
      }
    );

    const banner = card.shadowRoot!.querySelector('.announcements-banner') as HTMLElement;
    expect(banner.textContent).toContain('Message 1');
    expect(banner.querySelector('.announcement-counter')?.textContent).toBe('1/2');

    banner.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await card.updateComplete;

    expect(banner.textContent).toContain(sampleDisruption.title);
    expect(banner.querySelector('.announcement-counter')?.textContent).toBe('2/2');

    banner.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await card.updateComplete;

    expect(banner.textContent).toContain('Message 1');
    expect(banner.querySelector('.announcement-counter')?.textContent).toBe('1/2');
  });

  it('renders station_closed empty state with alternative travel guidance', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains' },
      [],
      {
        service_status: 'station_closed',
        disruptions: [sampleDisruption],
      }
    );

    const empty = card.shadowRoot!.querySelector('.board-empty-state.station-closed');
    expect(empty).not.toBeNull();
    expect(empty!.querySelector('.board-empty-title')!.textContent).toBe('Station Closed');
    expect(empty!.textContent).toContain('station is currently closed');

    const altTravel = empty!.querySelector('.alternative-travel-box');
    expect(altTravel).not.toBeNull();
    expect(altTravel!.textContent).toContain('Rail replacement bus running from Lewisham Stop C');
    expect(altTravel!.textContent).toContain('Tickets accepted on London Underground');
  });

  it('renders engineering_work empty state with replacement bus guidance', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains' },
      [],
      {
        service_status: 'engineering_work',
        disruptions: [sampleDisruption],
      }
    );

    const empty = card.shadowRoot!.querySelector('.board-empty-state.engineering-work');
    expect(empty).not.toBeNull();
    expect(empty!.querySelector('.board-empty-title')!.textContent).toBe('Engineering Work');
    expect(empty!.textContent).toContain('Engineering work is affecting services');

    const altTravel = empty!.querySelector('.alternative-travel-box');
    expect(altTravel).not.toBeNull();
    expect(altTravel!.textContent).toContain('Replacement Bus & Ticket Acceptance');
  });

  it('renders disrupted empty state with alternative travel guidance', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains' },
      [],
      {
        service_status: 'disrupted',
        disruptions: [sampleDisruption],
      }
    );

    const empty = card.shadowRoot!.querySelector('.board-empty-state.disrupted');
    expect(empty).not.toBeNull();
    expect(empty!.querySelector('.board-empty-title')!.textContent).toBe('Service Disrupted');
    expect(empty!.textContent).toContain('Train services are disrupted');
    expect(empty!.querySelector('.alternative-travel-box')).not.toBeNull();
  });

  it('opens alert details modal on banner click and closes with Escape key', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains' },
      [makeDeparture()],
      {
        disruptions: [sampleDisruption],
      }
    );

    const banner = card.shadowRoot!.querySelector('.announcements-banner') as HTMLElement;
    banner.focus();
    banner.click();
    await card.updateComplete;

    const dialog = card.shadowRoot!.querySelector('.alert-popup-card');
    expect(dialog).not.toBeNull();
    expect(dialog!.getAttribute('role')).toBe('dialog');
    expect(dialog!.textContent).toContain(sampleDisruption.title);
    expect(dialog!.textContent).toContain(sampleDisruption.summary);
    expect(dialog!.textContent).toContain(sampleDisruption.alternative_travel);

    // Escape key closes modal
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector('.alert-popup-card')).toBeNull();
  });

  it('opens alert details modal with Enter key on announcement banner', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains' },
      [makeDeparture()],
      {
        disruptions: [sampleDisruption],
      }
    );

    const banner = card.shadowRoot!.querySelector('.announcements-banner') as HTMLElement;
    banner.focus();
    banner.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await card.updateComplete;

    expect(card.shadowRoot!.querySelector('.alert-popup-card')).not.toBeNull();
  });

  it('safely renders http/https links and suppresses unsafe URLs in alert modal', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains' },
      [makeDeparture()],
      {
        disruptions: [sampleDisruption],
      }
    );

    const banner = card.shadowRoot!.querySelector('.announcements-banner') as HTMLElement;
    banner.click();
    await card.updateComplete;

    const link = card.shadowRoot!.querySelector('.alert-link') as HTMLAnchorElement;
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe('https://www.nationalrail.co.uk/incidents/100');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');

    // Close and test with unsafe url
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await card.updateComplete;

    const unsafeCard = await mountCard(
      { entity: 'sensor.trains' },
      [makeDeparture()],
      {
        disruptions: [
          {
            ...sampleDisruption,
            url: 'javascript:alert(document.cookie)',
          },
        ],
      }
    );

    const unsafeBanner = unsafeCard.shadowRoot!.querySelector('.announcements-banner') as HTMLElement;
    unsafeBanner.click();
    await unsafeCard.updateComplete;

    // Unsafe URL must NOT be rendered as a link
    expect(unsafeCard.shadowRoot!.querySelector('.alert-link')).toBeNull();
  });

  it('closes alert modal on close button click and overlay click', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains' },
      [makeDeparture()],
      {
        disruptions: [sampleDisruption],
      }
    );

    const banner = card.shadowRoot!.querySelector('.announcements-banner') as HTMLElement;
    banner.click();
    await card.updateComplete;

    const closeBtn = card.shadowRoot!.querySelector('.alert-popup-close') as HTMLElement;
    expect(closeBtn).not.toBeNull();
    closeBtn.click();
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector('.alert-popup-card')).toBeNull();

    // Re-open and test overlay click
    banner.click();
    await card.updateComplete;
    const overlay = card.shadowRoot!.querySelector('.alert-popup-overlay') as HTMLElement;
    overlay.click();
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector('.alert-popup-card')).toBeNull();
  });

  it('includes reduced-motion CSS rules for announcement ticker', () => {
    const styles = (TrainDepartureBoard as unknown as { styles: { cssText: string } }).styles?.cssText || '';
    expect(styles).toContain('prefers-reduced-motion');
    expect(styles).toContain('ticker-scroll');
    expect(styles).toContain('announcement-ticker');
  });
});

describe('entity state unknown and empty state enrichment', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const sampleDisruption = {
    id: 'INC200',
    title: 'Emergency engineering works near New Cross',
    is_planned: true,
    summary: 'No trains between London Bridge and Dartford via Lewisham.',
    alternative_travel: 'Replacement buses running between New Cross and Dartford.',
    url: 'https://www.nationalrail.co.uk/incidents/200',
  };

  function mountUnknownCard(
    attributes: Record<string, unknown> = {},
    state = 'unknown'
  ): Promise<TrainDepartureBoard> {
    const card = document.createElement(
      'train-departure-board'
    ) as TrainDepartureBoard;
    card.setConfig({
      type: 'custom:train-departure-board',
      entity: 'sensor.trains',
    } as never);
    card.hass = {
      states: {
        'sensor.trains': {
          entity_id: 'sensor.trains',
          state,
          attributes: {
            contract_version: 2,
            next_trains: [],
            ...attributes,
          },
          last_changed: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          context: { id: '1', parent_id: null, user_id: null },
        },
      },
    } as never;
    document.body.appendChild(card);
    return card.updateComplete.then(() => card);
  }

  it('renders station_closed empty state for HA state: unknown without raw unknown text', async () => {
    const card = await mountUnknownCard({
      service_status: 'station_closed',
      disruptions: [sampleDisruption],
      station_messages: ['Station will reopen at 06:00 tomorrow.'],
    });

    const empty = card.shadowRoot!.querySelector('.board-empty-state.station-closed');
    expect(empty).not.toBeNull();
    expect(empty!.querySelector('.board-empty-title')!.textContent).toBe('Station Closed');
    expect(empty!.textContent).toContain(sampleDisruption.title);
    expect(empty!.textContent).toContain(sampleDisruption.summary);
    expect(empty!.textContent).toContain('Station will reopen at 06:00 tomorrow.');
    expect(empty!.textContent).toContain('Replacement buses running');
    expect(card.shadowRoot!.textContent).not.toContain('is currently unknown');
  });

  it('renders engineering_work empty state for HA state: unknown without raw unknown text', async () => {
    const card = await mountUnknownCard({
      service_status: 'engineering_work',
      disruptions: [sampleDisruption],
    });

    const empty = card.shadowRoot!.querySelector('.board-empty-state.engineering-work');
    expect(empty).not.toBeNull();
    expect(empty!.querySelector('.board-empty-title')!.textContent).toBe('Engineering Work');
    expect(empty!.textContent).toContain(sampleDisruption.title);
    expect(empty!.textContent).toContain('Replacement Bus & Ticket Acceptance');
    expect(card.shadowRoot!.textContent).not.toContain('is currently unknown');
  });

  it('renders RTT-only no_departures empty state for HA state: unknown without raw unknown text', async () => {
    const card = await mountUnknownCard({
      service_status: 'no_departures',
      disruptions: [],
      station_messages: [],
    });

    const empty = card.shadowRoot!.querySelector('.board-empty-state.no-departures');
    expect(empty).not.toBeNull();
    expect(empty!.querySelector('.board-empty-title')!.textContent).toBe('No Departures');
    expect(card.shadowRoot!.textContent).not.toContain('is currently unknown');
  });

  it('renders clear data-unavailable message for state: unknown when v2 contract is missing and does not mislabel closure', async () => {
    const card = document.createElement(
      'train-departure-board'
    ) as TrainDepartureBoard;
    card.setConfig({
      type: 'custom:train-departure-board',
      entity: 'sensor.trains',
    } as never);
    card.hass = {
      states: {
        'sensor.trains': {
          entity_id: 'sensor.trains',
          state: 'unknown',
          attributes: {
            error: 'RTT API timeout',
            // Missing contract_version 2 and next_trains
          },
          last_changed: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          context: { id: '1', parent_id: null, user_id: null },
        },
      },
    } as never;
    document.body.appendChild(card);
    await card.updateComplete;

    const message = card.shadowRoot!.querySelector('.board-message');
    expect(message).not.toBeNull();
    expect(message!.textContent).toContain('Data currently unavailable');
    expect(message!.textContent).toContain('RTT API timeout');
    expect(card.shadowRoot!.textContent).not.toContain('Station Closed');
    expect(card.shadowRoot!.textContent).not.toContain('is currently unknown');
  });

  it('retains rich disruption context in empty state when announcements are disabled', async () => {
    const card = document.createElement(
      'train-departure-board'
    ) as TrainDepartureBoard;
    card.setConfig({
      type: 'custom:train-departure-board',
      entity: 'sensor.trains',
      show_announcements: false,
    } as never);
    card.hass = {
      states: {
        'sensor.trains': {
          entity_id: 'sensor.trains',
          state: 'unknown',
          attributes: {
            contract_version: 2,
            next_trains: [],
            service_status: 'disrupted',
            disruptions: [sampleDisruption],
            station_messages: ['Platform 2 closed for maintenance.'],
          },
          last_changed: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          context: { id: '1', parent_id: null, user_id: null },
        },
      },
    } as never;
    document.body.appendChild(card);
    await card.updateComplete;

    expect(card.shadowRoot!.querySelector('.announcements-banner')).toBeNull();

    const empty = card.shadowRoot!.querySelector('.board-empty-state.disrupted');
    expect(empty).not.toBeNull();
    expect(empty!.textContent).toContain(sampleDisruption.title);
    expect(empty!.textContent).toContain(sampleDisruption.summary);
    expect(empty!.textContent).toContain('Platform 2 closed for maintenance.');
    expect(empty!.textContent).toContain('Replacement buses running');

    const link = empty!.querySelector('.empty-external-link') as HTMLAnchorElement;
    expect(link).not.toBeNull();
    expect(link.href).toBe('https://www.nationalrail.co.uk/incidents/200');

    const detailsBtn = empty!.querySelector('.empty-details-btn') as HTMLElement;
    expect(detailsBtn).not.toBeNull();
    detailsBtn.click();
    await card.updateComplete;

    expect(card.shadowRoot!.querySelector('.alert-popup-card')).not.toBeNull();
  });

  it('traps focus properly inside alert modal using Shadow DOM activeElement', async () => {
    const card = await mountUnknownCard({
      service_status: 'disrupted',
      disruptions: [sampleDisruption],
    });

    const banner = card.shadowRoot!.querySelector('.announcements-banner') as HTMLElement;
    banner.click();
    await card.updateComplete;

    const closeBtn = card.shadowRoot!.querySelector('.alert-popup-close') as HTMLElement;
    const link = card.shadowRoot!.querySelector('.alert-link') as HTMLElement;
    expect(closeBtn).not.toBeNull();
    expect(link).not.toBeNull();

    closeBtn.focus();
    expect(card.shadowRoot!.activeElement).toBe(closeBtn);

    const overlay = card.shadowRoot!.querySelector('.alert-popup-overlay') as HTMLElement;
    overlay.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, composed: true })
    );
    expect(card.shadowRoot!.activeElement).toBe(link);

    overlay.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false, bubbles: true, composed: true })
    );
    expect(card.shadowRoot!.activeElement).toBe(closeBtn);
  });

  it('provides nighttime-specific message during overnight hours', () => {
    const card = document.createElement(
      'train-departure-board'
    ) as unknown as { _isNighttime: (date: Date) => boolean };

    const overnightDate = new Date('2026-01-15T03:30:00Z');
    expect(card._isNighttime(overnightDate)).toBe(true);

    const daytimeDate = new Date('2026-01-15T14:30:00Z');
    expect(card._isNighttime(daytimeDate)).toBe(false);
  });
});
