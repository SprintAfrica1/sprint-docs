// src/components/FeatureVisuals/index.tsx
//
// Two schematic illustrations for the landing page feature sections.
// Both are diagrams, not geography, and are labelled as illustrative.

import styles from './styles.module.css';

const LAGOS_STEPS = ['Pickup', 'On the way', 'Delivered'] as const;

export function LagosVisual() {
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox="0 0 520 330"
        role="img"
        aria-label="Schematic of a Lagos delivery: one pickup point in the north connected to two drop-off points to the south and east.">
        {/* Land and lagoon (abstract) */}
        <path
          d="M20 40 Q120 10 260 24 Q420 38 500 70 L500 170 Q380 150 270 176 Q150 204 20 176 Z"
          className={styles.land}
        />
        <path
          d="M20 176 Q150 204 270 176 Q380 150 500 170 L500 200 Q380 184 270 208 Q150 236 20 210 Z"
          className={styles.water}
        />
        <path
          d="M20 210 Q150 236 270 208 Q380 184 500 200 L500 310 L20 310 Z"
          className={styles.land}
        />
        <text x="30" y="298" className={styles.mapLabel}>ATLANTIC OCEAN</text>
        <text x="30" y="198" className={styles.mapLabel}>LAGOON</text>

        {/* Routes */}
        <path d="M140 84 Q170 150 262 244" className={styles.flow} />
        <path d="M140 84 Q330 70 432 252" className={styles.flow} />

        {/* Pickup */}
        <g transform="translate(140 84)">
          <circle r="16" className={styles.pulse} />
          <circle r="7" className={styles.pickup} />
          <text x="14" y="-14" className={styles.nodeLabel}>Ikeja</text>
        </g>

        {/* Drop-offs */}
        <g transform="translate(262 244)">
          <circle r="6" className={styles.drop} />
          <text x="-10" y="22" className={styles.nodeLabel}>Victoria Island</text>
        </g>
        <g transform="translate(432 252)">
          <circle r="6" className={styles.drop} />
          <text x="-14" y="22" className={styles.nodeLabel}>Lekki</text>
        </g>
      </svg>

      <ol className={styles.timeline} aria-label="Delivery progression">
        {LAGOS_STEPS.map((label, i) => (
          <li key={label} className={styles.timelineItem} data-done={i < 2 ? 'true' : 'false'}>
            <span className={styles.timelineMark} aria-hidden="true">
              {i < 2 ? '✓' : '○'}
            </span>
            {label}
          </li>
        ))}
      </ol>

      <figcaption className={styles.caption}>
        Schematic, not to scale. Locations are illustrative.
      </figcaption>
    </figure>
  );
}

const BULK_TARGETS = [34, 84, 134, 184, 234, 284] as const;

export function BulkVisual() {
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox="0 0 520 330"
        role="img"
        aria-label="Schematic of a bulk batch: one pickup hub connected to six destinations, with packages grouped into a batch.">
        {BULK_TARGETS.map((y, i) => (
          <g key={y}>
            <path
              d={`M96 165 C220 165 250 ${y} 400 ${y}`}
              className={styles.flow}
              style={{ animationDelay: `${i * 0.25}s` }}
            />
            <g transform={`translate(400 ${y})`}>
              <circle r="6" className={styles.drop} />
              <rect x="14" y="-9" width="62" height="18" rx="9" className={styles.chip} />
              <text x="45" y="4" textAnchor="middle" className={styles.chipText}>
                {`PKG-0${i + 1}`}
              </text>
            </g>
          </g>
        ))}

        <g transform="translate(96 165)">
          <circle r="26" className={styles.pulse} />
          <circle r="14" className={styles.pickup} />
          <text y="40" textAnchor="middle" className={styles.nodeLabel}>Pickup hub</text>
        </g>
      </svg>

      <div className={styles.batch}>
        <p className={styles.batchEyebrow}>BULK BATCH</p>
        <p className={styles.batchTitle}>24 packages</p>
        <div className={styles.batchRow}>
          <span className={styles.batchStatus}>
            <span aria-hidden="true">◐</span> Processing
          </span>
          <span className={styles.batchCount}>15 / 24</span>
        </div>
        <div
          className={styles.batchTrack}
          role="progressbar"
          aria-label="Illustrative batch progress"
          aria-valuemin={0}
          aria-valuemax={24}
          aria-valuenow={15}>
          <span className={styles.batchFill} style={{ width: '62.5%' }} />
        </div>
      </div>

      <figcaption className={styles.caption}>
        Illustrative demo data. Package IDs and counts are examples.
      </figcaption>
    </figure>
  );
}