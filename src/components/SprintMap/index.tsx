// src/components/SprintMap/index.tsx
//
// Schematic Nigeria logistics map.
//
//  - variant="hero"    animated delivery story: pickup -> route draws ->
//                      package travels -> delivered. One shipment at a
//                      time; the package never sits at pickup and at the
//                      destination simultaneously.
//  - variant="network" static route network (no cards, no animation).
//
// The outline is a stylised, hand-simplified silhouette, not survey-grade
// geography, and every shipment shown is an illustrative demo record.
// Per-frame movement is written straight to SVG attributes through refs;
// React state only changes on stage / whole-percent changes.

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import useReducedMotion from '@site/src/hooks/useReducedMotion';
import styles from './styles.module.css';

interface Point {
  x: number;
  y: number;
}

type LonLat = [number, number];
type Stage = 'pickup' | 'transit' | 'delivered';
type CityId = 'lagos' | 'abuja' | 'kano' | 'portHarcourt' | 'enugu';

interface View {
  idx: number;
  stage: Stage;
  pct: number;
}

interface Sample {
  idx: number;
  stage: Stage;
  p: number;
}

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

const VIEW_W = 600;
const VIEW_H = 480;
const SCALE = 46;

const project = ([lon, lat]: LonLat): Point => ({
  x: (lon - 2.4) * SCALE + 18,
  y: (14.2 - lat) * SCALE + 12,
});

const OUTLINE: LonLat[] = [
  [2.7, 6.4], [3.4, 6.42], [4.2, 6.3], [4.9, 5.85], [5.35, 5.35],
  [5.5, 4.5], [6.05, 4.3], [6.8, 4.35], [7.3, 4.45], [7.95, 4.55],
  [8.35, 4.6], [8.6, 4.9], [8.9, 5.5], [9.35, 6.1], [9.8, 6.65],
  [10.4, 6.95], [11.0, 6.7], [11.5, 7.0], [11.85, 7.3], [12.3, 7.9],
  [12.0, 8.5], [12.9, 9.8], [13.25, 10.0], [13.7, 10.8], [13.3, 11.3],
  [13.95, 11.7], [14.6, 12.2], [14.65, 12.9], [14.2, 13.2], [13.6, 13.7],
  [13.0, 13.45], [12.2, 13.3], [11.2, 13.35], [10.1, 13.3], [9.0, 13.5],
  [7.2, 13.45], [6.1, 13.7], [5.3, 13.75], [4.3, 13.1], [3.65, 11.9],
  [3.6, 11.6], [3.7, 10.7], [3.1, 9.2], [2.75, 8.0],
];

const OUTLINE_D =
  OUTLINE.map((ll, i) => {
    const p = project(ll);
    return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }).join(' ') + ' Z';

interface City {
  name: string;
  at: Point;
  dx: number;
  dy: number;
  anchor: 'start' | 'end' | 'middle';
}

const CITIES: Record<CityId, City> = {
  lagos: { name: 'Lagos', at: project([3.38, 6.52]), dx: -12, dy: 20, anchor: 'start' },
  abuja: { name: 'Abuja', at: project([7.49, 9.06]), dx: 12, dy: 4, anchor: 'start' },
  kano: { name: 'Kano', at: project([8.52, 12.0]), dx: 12, dy: 4, anchor: 'start' },
  portHarcourt: { name: 'Port Harcourt', at: project([7.01, 4.82]), dx: 12, dy: 14, anchor: 'start' },
  enugu: { name: 'Enugu', at: project([7.5, 6.45]), dx: 14, dy: 4, anchor: 'start' },
};

interface Shipment {
  to: CityId;
  code: string;
}

const SHIPMENTS: ReadonlyArray<Shipment> = [
  { to: 'abuja', code: 'DEMO-001' },
  { to: 'portHarcourt', code: 'DEMO-002' },
  { to: 'kano', code: 'DEMO-003' },
  { to: 'enugu', code: 'DEMO-004' },
];

interface Route {
  a: Point;
  b: Point;
  c: Point;
  d: string;
}

const ROUTES: ReadonlyArray<Route> = SHIPMENTS.map((s) => {
  const a = CITIES.lagos.at;
  const b = CITIES[s.to].at;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const k = 0.22;
  const c = { x: (a.x + b.x) / 2 + dy * k, y: (a.y + b.y) / 2 - dx * k };
  return {
    a,
    b,
    c,
    d: `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${c.x.toFixed(1)} ${c.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`,
  };
});

const bezier = (a: Point, c: Point, b: Point, t: number): Point => {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  };
};

const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

const HOLD_START = 1000;
const TRANSIT = 4800;
const HOLD_END = 2200;
const TOTAL = HOLD_START + TRANSIT + HOLD_END;

function sample(elapsed: number): Sample {
  const idx = Math.floor(elapsed / TOTAL) % SHIPMENTS.length;
  const local = elapsed % TOTAL;
  if (local < HOLD_START) {
    return { idx, stage: 'pickup', p: 0 };
  }
  if (local < HOLD_START + TRANSIT) {
    return {
      idx,
      stage: 'transit',
      p: easeInOutCubic((local - HOLD_START) / TRANSIT),
    };
  }
  return { idx, stage: 'delivered', p: 1 };
}

const CARD_TITLE: Record<Stage, string> = {
  pickup: 'PICKUP SCHEDULED',
  transit: 'SHIPMENT IN TRANSIT',
  delivered: 'DELIVERY COMPLETED',
};

const STATUS_LABEL: Record<Stage, string> = {
  pickup: 'Awaiting pickup',
  transit: 'In transit',
  delivered: 'Delivered',
};

const STEPS: ReadonlyArray<{ stage: Stage; label: string }> = [
  { stage: 'pickup', label: 'Pickup' },
  { stage: 'transit', label: 'In transit' },
  { stage: 'delivered', label: 'Delivered' },
];

const STAGE_ORDER: Record<Stage, number> = { pickup: 0, transit: 1, delivered: 2 };

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

interface Props {
  variant?: 'hero' | 'network';
  className?: string;
}

export default function SprintMap({ variant = 'hero', className }: Props) {
  const isHero = variant === 'hero';
  const reduced = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const pathRefs = useRef<Array<SVGPathElement | null>>([]);
  const markerRef = useRef<SVGGElement>(null);
  const [view, setView] = useState<View>({ idx: 0, stage: 'pickup', pct: 0 });

  const applyFrame = useCallback((idx: number, stage: Stage, p: number) => {
    pathRefs.current.forEach((el, i) => {
      if (!el) return;
      const offset = i < idx ? 0 : i === idx ? 1 - p : 1;
      el.style.strokeDashoffset = String(offset);
    });
    const route = ROUTES[idx];
    if (!route) return;
    const pt = stage === 'pickup' ? route.a : bezier(route.a, route.c, route.b, p);
    markerRef.current?.setAttribute(
      'transform',
      `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)})`,
    );
  }, []);

  useEffect(() => {
    if (!isHero) return undefined;

    if (reduced) {
      applyFrame(0, 'transit', 0.55);
      setView({ idx: 0, stage: 'transit', pct: 55 });
      return undefined;
    }

    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      const s = sample(now - start);
      applyFrame(s.idx, s.stage, s.p);
      const pct = Math.round(s.p * 100);
      setView((prev) =>
        prev.idx === s.idx && prev.stage === s.stage && prev.pct === pct
          ? prev
          : { idx: s.idx, stage: s.stage, pct },
      );
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [isHero, reduced, applyFrame]);

  const current: Shipment = SHIPMENTS[view.idx] ?? { to: 'abuja', code: 'DEMO-001' };
  const destination = CITIES[current.to];

  return (
    <div
      className={`${styles.frame} ${className ?? ''}`}
      data-variant={variant}>
      <div className={styles.glow} aria-hidden="true" />

      <svg
        className={styles.svg}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label="Schematic map of Nigeria showing delivery routes from Lagos to Abuja, Kano, Port Harcourt and Enugu. Demonstration data.">
        <defs>
          <linearGradient id={`${uid}-land`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0b2c52" />
            <stop offset="100%" stopColor="#06213f" />
          </linearGradient>
          <pattern
            id={`${uid}-dots`}
            width="11"
            height="11"
            patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.1" className={styles.dot} />
          </pattern>
          <clipPath id={`${uid}-clip`}>
            <path d={OUTLINE_D} />
          </clipPath>
        </defs>

        <path d={OUTLINE_D} fill={`url(#${uid}-land)`} className={styles.land} />
        <rect
          width={VIEW_W}
          height={VIEW_H}
          fill={`url(#${uid}-dots)`}
          clipPath={`url(#${uid}-clip)`}
        />
        <path d={OUTLINE_D} className={styles.outline} />

        {/* Faint network: every lane */}
        {ROUTES.map((r, i) => (
          <path key={`base-${i}`} d={r.d} className={styles.routeBase} />
        ))}

        {/* Drawn routes (progress is driven imperatively) */}
        {ROUTES.map((r, i) => {
          let cls = styles.routeIdle;
          if (!isHero) cls = styles.routeStatic;
          else if (i < view.idx) cls = styles.routeDone;
          else if (i === view.idx) cls = styles.routeActive;
          return (
            <path
              key={`route-${i}`}
              ref={(el) => {
                pathRefs.current[i] = el;
              }}
              d={r.d}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={isHero ? 1 : 0}
              className={cls}
            />
          );
        })}

        {/* Cities */}
        {(Object.keys(CITIES) as CityId[]).map((id) => {
          const city = CITIES[id];
          const isOrigin = id === 'lagos';
          const isTarget = isHero && !isOrigin && current.to === id;
          const delivered = isTarget && view.stage === 'delivered';
          const visited =
            isHero &&
            !isOrigin &&
            SHIPMENTS.slice(0, view.idx).some((s) => s.to === id);
          const nodeClass = isOrigin
            ? styles.hub
            : delivered
              ? styles.nodeDelivered
              : isTarget
                ? styles.nodeTarget
                : visited
                  ? styles.nodeVisited
                  : styles.node;
          return (
            <g key={id} transform={`translate(${city.at.x} ${city.at.y})`}>
              {isOrigin && <circle r="6" className={styles.hubPulse} />}
              {delivered && <circle r="6" className={styles.deliveredPulse} />}
              <circle r={isOrigin ? 6 : 4.5} className={nodeClass} />
              <text
                x={city.dx}
                y={city.dy}
                textAnchor={city.anchor}
                className={isOrigin ? styles.labelHub : styles.label}>
                {city.name}
              </text>
            </g>
          );
        })}

        {/* The package: one marker, never duplicated at pickup */}
        {isHero && (
          <g
            ref={markerRef}
            className={styles.marker}
            data-stage={view.stage}
            transform={`translate(${ROUTES[0]?.a.x ?? 0} ${ROUTES[0]?.a.y ?? 0})`}>
            <circle r="13" className={styles.markerHalo} />
            <rect x="-5" y="-5" width="10" height="10" rx="2" className={styles.markerCore} />
          </g>
        )}
      </svg>

      {isHero && (
        <>
          <span className={styles.demoBadge}>Illustrative demo data</span>

          <div className={`${styles.card} ${styles.cardMain}`}>
            <p className={styles.cardEyebrow}>{CARD_TITLE[view.stage]}</p>
            <p className={styles.cardRoute}>
              Lagos <span aria-hidden="true">→</span>
              <span className={styles.srOnly}> to </span> {destination.name}
            </p>
            <div className={styles.cardMeta}>
              <span className={styles.statusPill} data-stage={view.stage}>
                <span className={styles.statusIcon} aria-hidden="true">
                  {view.stage === 'delivered' ? '✓' : view.stage === 'transit' ? '➜' : '•'}
                </span>
                {STATUS_LABEL[view.stage]}
              </span>
              <span className={styles.cardId}>{current.code}</span>
            </div>
            <div
              className={styles.progress}
              role="progressbar"
              aria-label="Demo shipment progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={view.pct}>
              <span className={styles.progressBar} style={{ width: `${view.pct}%` }} />
            </div>
          </div>

          <div className={`${styles.card} ${styles.cardSteps}`}>
            <p className={styles.cardEyebrow}>ACTIVITY</p>
            <ol className={styles.steps}>
              {STEPS.map((step) => {
                const order = STAGE_ORDER[step.stage];
                const now = STAGE_ORDER[view.stage];
                const state =
                  order < now || (step.stage === 'delivered' && now === 2)
                    ? 'done'
                    : order === now
                      ? 'current'
                      : 'todo';
                return (
                  <li key={step.stage} className={styles.step} data-state={state}>
                    <span className={styles.stepMark} aria-hidden="true">
                      {state === 'done' ? '✓' : state === 'current' ? '●' : '○'}
                    </span>
                    {step.label}
                    <span className={styles.srOnly}>
                      {state === 'done' ? ' (complete)' : state === 'current' ? ' (current)' : ' (upcoming)'}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className={`${styles.card} ${styles.cardBulk}`}>
            <p className={styles.cardEyebrow}>BULK BATCH</p>
            <p className={styles.cardRoute}>24 packages</p>
            <span className={styles.statusPill} data-stage="transit">
              <span className={styles.statusIcon} aria-hidden="true">◐</span>
              Processing
            </span>
          </div>
        </>
      )}
    </div>
  );
}