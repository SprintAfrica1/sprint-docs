// src/components/HomepageFeatures/index.tsx

import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: React.ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Same-day Lagos',
    emoji: '🏠',
    description: (
      <>
        Zone-based pricing across every Lagos neighbourhood — from Ikeja to
        Lekki Phase 1. One quote, one delivery, before end of day.
      </>
    ),
  },
  {
    title: 'Next-day interstate',
    emoji: '🚚',
    description: (
      <>
        Lagos to Kano, Port Harcourt to Abuja, and 34 more state routes. Live
        tracking, courier assignment, and hub checkpoints all included.
      </>
    ),
  },
  {
    title: 'Bulk batches',
    emoji: '📦',
    description: (
      <>
        One pickup, fifty dropoffs. Every package priced individually, billed
        as one transaction, grouped as one batch in your dashboard.
      </>
    ),
  },
];

function Feature({ title, emoji, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <div className={styles.featureEmoji} role="img" aria-label={title}>
          {emoji}
        </div>
        <h3 className={styles.featureTitle}>{title}</h3>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}