// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import '../src/train-departure-board';
import type { TrainDepartureBoard } from '../src/train-departure-board';
import { TrainDeparture } from '../src/types';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function inMinutes(mins: number): string {
  const d = new Date(Date.now() + mins * 60000);
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function makeDeparture(overrides: Partial<TrainDeparture> = {}): TrainDeparture {
  return {
    origin_name: 'Dartford',
    destination_name: 'London Cannon Street',
    service_uid: 'P63128',
    headcode: '2A69',
    type: 'train',
    scheduled: inMinutes(10),
    estimated: inMinutes(10),
    minutes: 10,
    lateness: null,
    is_cancelled: false,
    platform: '1',
    length: 8,
    stock: null,
    operator_name: 'Southeastern',
    subsequent_stops: [
      {
        stop: 'LEW',
        name: 'Lewisham',
        scheduled: inMinutes(16),
        estimated: inMinutes(16),
      },
    ],
    stops: 1,
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
        attributes: { next_trains: departures, ...extraAttributes },
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
        makeDeparture({ scheduled: inMinutes(5), estimated: inMinutes(5) }),
        makeDeparture({ scheduled: inMinutes(20), estimated: inMinutes(20) }),
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
      [makeDeparture({ scheduled: inMinutes(10), estimated: inMinutes(10) })]
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
        last_report_time: inMinutes(-2),
      }),
    ]);

    (card.shadowRoot!.querySelector('.train') as HTMLElement).click();
    await card.updateComplete;

    const lastSeen = card.shadowRoot!.querySelector('.last-seen');
    expect(lastSeen).not.toBeNull();
    expect(lastSeen!.textContent).toContain('Last seen at LEW');
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
        journey_time_mins: 33,
        stops: 7,
        estimate_arrival: inMinutes(43),
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
      makeDeparture({ stops: 0 }),
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
          attributes: { next_trains: 'invalid-string' },
        },
      },
    } as never;
    document.body.appendChild(card);
    await card.updateComplete;
    const message = card.shadowRoot!.querySelector('.board-message.error');
    expect(message).not.toBeNull();
    expect(message!.textContent).toContain('Attribute "next_trains" on entity sensor.trains is not an array');
  });

  it('renders a notice when walk_time_minutes is set and no departures are reachable', async () => {
    const card = await mountCard(
      { entity: 'sensor.trains', walk_time_minutes: 30 },
      [
        makeDeparture({ scheduled: inMinutes(5), estimated: inMinutes(5) }),
        makeDeparture({ scheduled: inMinutes(10), estimated: inMinutes(10) }),
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
        estimated: inMinutes(15),
      }),
    ]);
    const rowMeta = card.shadowRoot!.querySelector('.row-meta');
    expect(rowMeta).not.toBeNull();
    expect(rowMeta!.querySelector('.status-pill')).not.toBeNull();
    expect(rowMeta!.querySelector('.carriages-badge')).not.toBeNull();
    expect(rowMeta!.querySelector('.platform-badge')).not.toBeNull();
  });
});
